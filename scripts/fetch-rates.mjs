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

/** INR per 1 unit of each quote currency. */
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
const SERIES_SPECS = [
  { key: "intraday", query: "interval=5m&range=5d", precision: 16 },
  { key: "daily", query: "interval=1d&range=3mo", precision: 10 },
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
  return series;
}

async function main() {
  const out = { source: "Yahoo Finance", fetchedAt: null, series: {}, intraday: {} };

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
