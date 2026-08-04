/**
 * Clear Route — Google Apps Script backend.
 *
 * GitHub Pages is static, so this is the only server-side piece in the
 * project. It receives form submissions and anonymous analytics events and
 * appends them to a private Google Sheet you own.
 *
 * Setup is in scripts/README.md. Paste this whole file into the Apps Script
 * editor, set SHEET_ID below, and deploy as a Web app.
 *
 * ## Known limitations, stated plainly
 *
 * This is a public write endpoint with no authentication. Anyone who finds the
 * URL can post to it, and Apps Script enforces daily quotas. That is
 * acceptable at project scale and is not production-grade — a real deployment
 * would put an authenticated API in front of a real datastore.
 */

const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';

/** Accepts form submissions and events. */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);

    if (data.type === 'callback') {
      getOrCreate(ss, 'Callback Requests', ['Timestamp', 'Name', 'Company', 'Email', 'Phone'])
        .appendRow([new Date(), data.name, data.company, data.email, data.phone]);
    } else if (data.type === 'contact') {
      getOrCreate(ss, 'Contact Messages', ['Timestamp', 'Name', 'Email', 'Message'])
        .appendRow([new Date(), data.name, data.email, data.message]);
    } else if (data.type === 'event') {
      getOrCreate(ss, 'Events', ['Timestamp', 'Event', 'Page', 'Mode', 'Label', 'Session'])
        .appendRow([
          new Date(),
          data.event,
          data.page,
          data.mode,
          data.label || '',
          data.session || '',
        ]);
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Returns aggregated counts for the live half of /insights.
 *
 * Aggregates here rather than shipping raw rows: the dashboard only needs
 * totals, and sending individual session rows to a public endpoint would
 * expose more than the page uses.
 */
function doGet() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sh = ss.getSheetByName('Events');
    if (!sh || sh.getLastRow() < 2) {
      return json({ ok: true, totals: {}, byPage: {}, byMode: {}, count: 0, sessions: 0 });
    }

    const rows = sh.getRange(2, 1, sh.getLastRow() - 1, 6).getValues();
    const totals = {};
    const byPage = {};
    const byMode = {};
    const sessions = {};

    rows.forEach(function (r) {
      totals[r[1]] = (totals[r[1]] || 0) + 1;
      byPage[r[2]] = (byPage[r[2]] || 0) + 1;
      byMode[r[3]] = (byMode[r[3]] || 0) + 1;
      if (r[5]) sessions[r[5]] = true;
    });

    // Form submissions, counted from their own sheets.
    const counts = {};
    ['Callback Requests', 'Contact Messages'].forEach(function (name) {
      const s = ss.getSheetByName(name);
      counts[name] = s ? Math.max(0, s.getLastRow() - 1) : 0;
    });

    return json({
      ok: true,
      totals: totals,
      byPage: byPage,
      byMode: byMode,
      count: rows.length,
      sessions: Object.keys(sessions).length,
      forms: counts,
      updated: new Date().toISOString(),
    });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function getOrCreate(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#1B3A6B')
      .setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
  }
  return sh;
}
