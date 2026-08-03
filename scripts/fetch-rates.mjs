/**
 * Fetches daily FX closes from Yahoo Finance and writes them into the build.
 *
 * ## Why this runs at build time rather than in the browser
 *
 * Yahoo's chart endpoint sends no Access-Control-Allow-Origin header, so a
 * browser request from the deployed site fails outright — verified against
 * query1, query2, the v7 quote endpoint and the spark endpoint, all four
 * blocked. That restriction is a browser policy, not a server one, so the
 * same request succeeds from Node.
 *
 * GitHub Actions runs `npm run build` on a server, so fetching here gets the
 * data with no CORS problem, no API key, no proxy, and no runtime network
 * dependency on the published site. The workflow re-runs daily on a cron, so
 * the figures stay current — which matches the data's own cadence, since
 * these are daily closes and there is nothing fresher to miss.
 *
 * ## Cost
 *
 * Zero. Yahoo's chart endpoint needs no key and no account. GitHub Actions
 * minutes are unmetered for public repositories.
 *
 * ## Failure behaviour
 *
 * Never fails the build. If Yahoo is unreachable or returns something
 * unexpected, the previously committed rates.json is left exactly as it is
 * and the site ships with the last known good data, which is why that file is
 * committed rather than generated-and-ignored.
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

const OUT = join(HERE, "..", "lib", "generated", "rates.json");

/**
 * Every currency the picker offers, quoted against USD.
 *
 * One base is enough for the whole world: with `perUSD[X]` for every X, any
 * pair is a division — `rate(A→B) = perUSD[A] / perUSD[B]`. That turns 144
 * requests into support for 144 × 143 = 20,592 currency pairs, which is why
 * the picker can offer arbitrary corridors without a per-pair lookup.
 *
 * Yahoo quotes all 144 (verified: 143/143 on the first probe, plus USD
 * itself). Fetched twelve at a time, the whole set takes about two seconds,
 * so it comfortably fits the 30-minute rebuild.
 */
const ALL_CODES = JSON.parse(
  readFileSync(join(HERE, "..", "lib", "currencies.ts"), "utf8")
    .match(/export const CURRENCIES: Currency\[\] = (\[[\s\S]*?\n\]);/)[1],
).map((c) => c.code);

/** The three corridors the status strip shows, kept as full intraday series. */
const SYMBOLS = { USD: "USDINR=X", EUR: "EURINR=X", GBP: "GBPINR=X" };

/**
 * Two series per corridor, because they answer different questions.
 *
 * - `intraday` (5-minute bars over 5 days) is what the trend line draws and
 *   where the current quote comes from. Yahoo returns roughly 370 real bars
 *   for this pair, so the line shows movement that genuinely happened within
 *   the day rather than a flat step between daily closes.
 * - `daily` (daily closes over 3 months) is the baseline for the
 *   day-over-day change. Comparing an intraday tick against the previous
 *   *close* is the comparison that means something; comparing it against the
 *   tick five minutes earlier would be noise.
 */
/**
 * `keep` trims each series to what the UI actually reads before it is written.
 *
 * Yahoo returns up to 662 intraday bars and 66 daily closes per corridor. This
 * file is imported by client code, so every point ships in the JavaScript
 * bundle — untrimmed it came to 151 KB of data to render a 72-point sparkline
 * and one day-over-day figure. Keeping a modest margin above what is consumed
 * cuts that by roughly 85% with nothing visible lost.
 */
const SERIES_SPECS = [
  { key: "intraday", query: "interval=5m&range=5d", precision: 16, keep: 120 },
  { key: "daily", query: "interval=1d&range=3mo", precision: 10, keep: 40 },
];

async function fetchSeries(symbol, spec) {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?${spec.query}`;

  const res = await fetch(url, {
    // Yahoo rejects requests with no UA.
    headers: { "User-Agent": "Mozilla/5.0 (compatible; clearroute-build/1.0)" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`${symbol} ${spec.key}: HTTP ${res.status}`);

  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`${symbol} ${spec.key}: no chart result`);

  const stamps = result.timestamp ?? [];
  const closes = result.indicators?.quote?.[0]?.close ?? [];

  // Yahoo emits nulls for periods with no print. Dropping them is correct — a
  // period with no observed price genuinely has no value, and interpolating
  // one would be inventing a rate.
  const series = stamps
    .map((t, i) => ({ t, rate: closes[i] }))
    .filter((p) => typeof p.rate === "number" && Number.isFinite(p.rate))
    .map((p) => ({
      // Daily bars keep a plain date; intraday keeps the minute, because the
      // whole point of intraday is that the time of day matters.
      date: new Date(p.t * 1000).toISOString().slice(0, spec.precision) + (spec.precision > 10 ? "Z" : ""),
      rate: Math.round(p.rate * 1e4) / 1e4,
    }));

  if (series.length < 2) {
    throw new Error(`${symbol} ${spec.key}: only ${series.length} usable points`);
  }
  // Newest points are the ones that get read, so trim from the front.
  return spec.keep ? series.slice(-spec.keep) : series;
}

/**
 * Latest price for `USD{code}=X` — units of `code` per 1 USD.
 *
 * USD itself is 1 by definition and has no symbol to look up.
 */
async function fetchPerUsd(code) {
  if (code === "USD") return 1;
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/USD${code}=X` +
    `?interval=1d&range=5d`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; clearroute-build/1.0)" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) return null;
  const json = await res.json();
  const px = json?.chart?.result?.[0]?.meta?.regularMarketPrice;
  return typeof px === "number" && Number.isFinite(px) && px > 0 ? px : null;
}

/** Fetch the whole table, twelve at a time so it stays quick and polite. */
async function fetchAllPerUsd() {
  const perUsd = {};
  const missing = [];
  const CONCURRENCY = 12;

  for (let i = 0; i < ALL_CODES.length; i += CONCURRENCY) {
    const batch = ALL_CODES.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map((c) => fetchPerUsd(c).catch(() => null)));
    batch.forEach((code, j) => {
      const px = results[j];
      // A currency with no quote is simply omitted. The picker reads this
      // table, so an omitted currency disappears from the options rather than
      // being offered and then failing — never a fabricated rate.
      if (px === null) missing.push(code);
      else perUsd[code] = Math.round(px * 1e6) / 1e6;
    });
  }
  return { perUsd, missing };
}

async function main() {
  const out = {
    source: "Yahoo Finance",
    fetchedAt: null,
    series: {},
    intraday: {},
    perUsd: {},
  };

  for (const [code, symbol] of Object.entries(SYMBOLS)) {
    for (const spec of SERIES_SPECS) {
      const series = await fetchSeries(symbol, spec);
      if (spec.key === "daily") out.series[code] = series;
      else out.intraday[code] = series;
    }
    const d = out.series[code];
    const i = out.intraday[code];
    console.log(
      `  ${code.padEnd(3)} ${String(d.length).padStart(3)} daily closes · ` +
        `${String(i.length).padStart(4)} intraday bars · ` +
        `latest ${i.at(-1).date} = ${i.at(-1).rate}`,
    );
  }

  const { perUsd, missing } = await fetchAllPerUsd();
  out.perUsd = perUsd;
  console.log(
    `\n  ${Object.keys(perUsd).length}/${ALL_CODES.length} currencies quoted against USD` +
      (missing.length ? ` · omitted: ${missing.join(", ")}` : ""),
  );

  out.fetchedAt = new Date().toISOString();

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`\nWrote ${OUT}`);
}

main().catch((err) => {
  console.warn(`\n[fetch-rates] Yahoo unavailable: ${err.message}`);
  if (existsSync(OUT)) {
    const prev = JSON.parse(readFileSync(OUT, "utf8"));
    console.warn(`[fetch-rates] Keeping committed data from ${prev.fetchedAt}. Build continues.`);
  } else {
    // Only reachable if someone deletes the committed file. Write a stub so
    // the build still completes rather than failing on a missing import.
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(
      OUT,
      JSON.stringify({ source: "unavailable", fetchedAt: null, series: {} }, null, 2) + "\n",
      "utf8",
    );
    console.warn("[fetch-rates] No committed data found; wrote an empty stub.");
  }
  process.exit(0); // never fail the build over a rate lookup
});
