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

const RANGE = "3mo";

async function fetchSeries(symbol) {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?interval=1d&range=${RANGE}`;

  const res = await fetch(url, {
    // Yahoo rejects requests with no UA.
    headers: { "User-Agent": "Mozilla/5.0 (compatible; clearroute-build/1.0)" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`${symbol}: HTTP ${res.status}`);

  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`${symbol}: no chart result`);

  const stamps = result.timestamp ?? [];
  const closes = result.indicators?.quote?.[0]?.close ?? [];

  // Yahoo emits nulls for days with no print. Dropping them is correct — a
  // day with no observed close genuinely has no value, and interpolating one
  // would be inventing a rate.
  const series = stamps
    .map((t, i) => ({
      date: new Date(t * 1000).toISOString().slice(0, 10),
      rate: closes[i],
    }))
    .filter((p) => typeof p.rate === "number" && Number.isFinite(p.rate))
    .map((p) => ({ date: p.date, rate: Math.round(p.rate * 1e4) / 1e4 }));

  if (series.length < 2) throw new Error(`${symbol}: only ${series.length} usable points`);
  return series;
}

async function main() {
  const out = { source: "Yahoo Finance", fetchedAt: null, series: {} };

  for (const [code, symbol] of Object.entries(SYMBOLS)) {
    out.series[code] = await fetchSeries(symbol);
    console.log(
      `  ${code.padEnd(3)} ${String(out.series[code].length).padStart(3)} closes  ` +
        `latest ${out.series[code].at(-1).date} = ${out.series[code].at(-1).rate}`,
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
