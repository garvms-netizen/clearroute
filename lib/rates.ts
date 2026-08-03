import generated from "./generated/rates.json";

/**
 * Daily FX closes.
 *
 * ## Source and why it is baked in
 *
 * Yahoo Finance (USDINR=X, EURINR=X, GBPINR=X), fetched at **build time** by
 * scripts/fetch-rates.mjs and imported here as plain data.
 *
 * Yahoo's endpoints send no Access-Control-Allow-Origin header, so a browser
 * request from the deployed site fails — verified against query1, query2, the
 * v7 quote endpoint and the spark endpoint, all four blocked. That is a
 * browser restriction, not a server one, so the build fetches it instead and
 * the published site carries the data rather than requesting it.
 *
 * Three things fall out of that, all good:
 *
 * - No runtime network call, so no spinner, no failure state, and nothing for
 *   Lighthouse to dock the page for.
 * - No API key and no proxy, so nothing to leak and nothing to pay for.
 * - The data cadence matches its own truth. These are daily closes; the
 *   deploy workflow re-runs on a daily cron, so there is nothing fresher
 *   being missed.
 *
 * ## The honesty constraint
 *
 * Every figure the site prints is a real published close on a real date, and
 * the date is always shown next to it. Nothing is interpolated, no point is
 * invented for days with no print, and no digit moves that did not move in
 * the market. There is no simulated ticker anywhere in this project.
 *
 * ## Quote convention
 *
 * A rate is "units of the sending currency per 1 unit of the receiving
 * currency" — INR→USD ≈ 95.37 means one dollar costs ₹95.37, so the recipient
 * gets `amount / rate`.
 */

export type Corridor = "USD" | "EUR" | "GBP";

export const CORRIDORS: Corridor[] = ["USD", "EUR", "GBP"];

/** One real published close. */
export type Close = { date: string; rate: number };

type Generated = {
  source: string;
  fetchedAt: string | null;
  series: Partial<Record<Corridor, Close[]>>;
};

const data = generated as Generated;

/**
 * Static fallbacks, matching the §9.2 worked example. Only reachable if the
 * generated file is empty, which means someone deleted it *and* Yahoo was
 * unreachable at build time.
 */
export const FALLBACK_RATES: Record<Corridor, number> = {
  USD: 83.421,
  EUR: 90.105,
  GBP: 105.77,
};

export const FALLBACK_NOTICE = "Showing sample rates — no published data available.";

/** Full series for a corridor, oldest to newest. */
export function closesFor(corridor: Corridor): Close[] {
  return data.series[corridor] ?? [];
}

/** The most recent published close, or the static fallback. */
export function latestClose(corridor: Corridor): Close {
  const series = closesFor(corridor);
  const last = series[series.length - 1];
  return last ?? { date: "", rate: FALLBACK_RATES[corridor] };
}

/** True when no published data made it into the build. */
export const hasLiveData = CORRIDORS.some((c) => closesFor(c).length > 0);

export const RATE_SOURCE = data.source;

/** Absolute and percentage change between the last two real closes. */
export function dayChange(closes: Close[]) {
  if (closes.length < 2) return null;
  const latest = closes[closes.length - 1];
  const prev = closes[closes.length - 2];
  const abs = latest.rate - prev.rate;
  return {
    abs,
    pct: (abs / prev.rate) * 100,
    direction: abs > 0 ? ("up" as const) : abs < 0 ? ("down" as const) : ("flat" as const),
    previousDate: prev.date,
    latestDate: latest.date,
  };
}

/* --------------------------------------------------------------------------
   Formatting. Every figure the site prints goes through one of these, so
   grouping and precision never drift between pages.
   -------------------------------------------------------------------------- */

const SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export const symbolFor = (code: string) => SYMBOLS[code] ?? "";

/** Rates always show four decimals — the precision the product claims. */
export const formatRate = (n: number) => n.toFixed(4);

/**
 * Indian digit grouping for rupees (₹5,00,000.00), Western grouping for
 * everything else. Getting this wrong is immediately visible to the audience
 * this site is written for.
 */
export function formatMoney(amount: number, currency: string): string {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return (
    symbolFor(currency) +
    amount.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/** "2 August 2026" — spelled out, so it can't be misread as a rate. */
export function formatRateDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
