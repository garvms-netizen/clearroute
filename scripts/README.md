# Connecting the forms and analytics

Ten minutes, entirely free, no account beyond a Google one you already have.

The site is a static export on GitHub Pages, so there is no server. Forms and
anonymous analytics post to a Google Apps Script Web App that **you** deploy
from **your own** Google account, writing into a private spreadsheet only you
can see.

Until you do this, the site works fine — forms show their success state and
say plainly that nothing was delivered, and `/insights` shows the illustrative
half only. Nothing breaks.

---

## Step 1 — Create the sheet

1. Go to <https://sheets.new>. A blank spreadsheet opens.
2. Name it something like `Clear Route submissions`.
3. Copy the **ID** out of the address bar. It is the long string between
   `/d/` and `/edit`:

   ```
   https://docs.google.com/spreadsheets/d/1AbC...XyZ/edit
                                          ^^^^^^^^^^ this part
   ```

You do not need to create any tabs — the script creates and formats them on
first use.

## Step 2 — Add the script

1. In that spreadsheet: **Extensions ▸ Apps Script**.
2. Delete whatever is in the editor.
3. Paste the entire contents of [`apps-script.gs`](apps-script.gs).
4. Replace `PASTE_YOUR_SHEET_ID_HERE` on line 19 with the ID from Step 1.
5. Save (Ctrl+S).

## Step 3 — Deploy it

1. **Deploy ▸ New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. **Deploy**. Google will ask you to authorise it — this is your own script
   writing to your own sheet, so approve it. You will pass through an
   "unverified app" warning; **Advanced ▸ Go to (project name)** gets past it.
5. Copy the **Web app URL**. It ends in `/exec`.

> **"Who has access: Anyone" is required and is safe here.** The site posts
> from a visitor's browser with no credentials, so the endpoint has to accept
> anonymous requests. It only ever appends rows; it never reads your other
> files. The tradeoff is that anyone with the URL could post junk — see
> *Limitations* below.

## Step 4 — Give the URL to the site

**For the deployed site:** in the GitHub repo, go to
**Settings ▸ Secrets and variables ▸ Actions ▸ Variables ▸ New repository
variable**:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SHEETS_ENDPOINT` | the `/exec` URL from Step 3 |

Then re-run the deploy workflow (**Actions ▸ Deploy to GitHub Pages ▸ Run
workflow**) so the new value gets baked in.

**A Variable, not a Secret.** `NEXT_PUBLIC_*` values are inlined into the
JavaScript bundle at build time, so a Secret would be masked in the Actions
log while still shipping in plain sight in the bundle. Masking it would be
theatre.

**For local development:** create `.env.local` in the project root:

```
NEXT_PUBLIC_SHEETS_ENDPOINT=https://script.google.com/macros/s/.../exec
```

## Step 5 — Check it works

1. Open `/contact` on the site and send yourself a test message.
2. Look at the spreadsheet — a **Contact Messages** tab should have appeared
   with your row in it.
3. Open `/insights`. The "Live site activity" half should now show counts
   instead of the not-configured notice.

If nothing arrives, open the browser console. `lib/track.ts` warns there on
failure rather than swallowing it.

---

## Why the requests look strange

Apps Script rejects preflighted JSON from a browser, so the site sends
`Content-Type: text/plain` with `mode: "no-cors"`. That makes the response
**opaque** — the browser will not let the page read the status code.

So a resolved promise means *the request left*, not *the server accepted it*.
The UI always shows its success state, and failures are `console.warn`'d so
they stay debuggable. This is a real constraint of posting to Apps Script from
a static site, not a shortcut.

## What gets stored

| Tab | Written when | Columns |
|---|---|---|
| `Callback Requests` | someone submits the institutional callback form | Timestamp, Name, Company, Email, Phone |
| `Contact Messages` | someone submits the contact form | Timestamp, Name, Email, Message |
| `Events` | any tracked interaction | Timestamp, Event, Page, Mode, Label, Session |

`Session` is a random string generated once per browser tab and held in
`sessionStorage`. It expires when the tab closes, is not a cookie, and is not
linked to anything identifying. No other personal data is ever sent —
`/legal/privacy` describes exactly this and is meant to stay true.

## Limitations

- **No authentication.** A public write endpoint can be spammed by anyone who
  finds the URL. At project scale that is acceptable; in production it would
  not be.
- **Quotas.** Apps Script caps daily executions on free accounts. Heavy
  traffic would hit that ceiling and requests would start failing silently —
  which, given the opaque responses above, the site cannot detect.
- **No deletion flow.** Removing a submission means opening the sheet and
  deleting the row yourself.

None of this is hidden from visitors: `/legal/privacy` says the data goes to a
private spreadsheet for demonstration purposes and is not used commercially.

## Cost

Zero. Google Sheets and Apps Script are free at this volume, GitHub Pages
hosting is free for public repositories, and Actions minutes are unmetered for
them. Nothing in this project bills anyone.
