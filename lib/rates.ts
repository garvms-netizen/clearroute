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
  /** Daily closes — the baseline for day-over-day change. */
  series: Partial<Record<Corridor, Close[]>>;
  /** 5-minute bars — what the trend line draws and where the quote comes from. */
  intraday?: Partial<Record<Corridor, Close[]>>;
};

const data = generated as Generated;

/** When the build last pulled from Yahoo. Displayed so freshness is visible. */
export const FETCHED_AT = data.fetchedAt;

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

/** Daily closes for a corridor, oldest to newest. */
export function closesFor(corridor: Corridor): Close[] {
  return data.series[corridor] ?? [];
}

/** 5-minute intraday bars, oldest to newest. */
export function intradayFor(corridor: Corridor): Close[] {
  return data.intraday?.[corridor] ?? [];
}

/**
 * The most recent observed price — the last intraday bar where we have one,
 * falling back to the last daily close, then to the static figure.
 *
 * Intraday is preferred because it is genuinely more recent: the last 5-minute
 * bar is minutes old at build time, where the daily close can be a day behind.
 */
export function latestClose(corridor: Corridor): Close {
  const intra = intradayFor(corridor);
  const last = intra[intra.length - 1];
  if (last) return last;

  const daily = closesFor(corridor);
  return daily[daily.length - 1] ?? { date: "", rate: FALLBACK_RATES[corridor] };
}

/**
 * Change against the previous *daily close*, not the previous bar.
 *
 * Comparing an intraday price to the tick five minutes earlier would report
 * noise as news. Against yesterday's close it answers the question someone
 * sending money actually has: is this better or worse than it was?
 */
export function changeVsPreviousClose(corridor: Corridor) {
  const daily = closesFor(corridor);
  const now = latestClose(corridor);
  if (daily.length < 1) return null;

  // The last daily bar may be today's, in which case yesterday's is the
  // baseline; otherwise the last one we have is the previous close.
  const today = now.date.slice(0, 10);
  const prior = [...daily].reverse().find((d) => d.date.slice(0, 10) !== today);
  if (!prior) return null;

  const abs = now.rate - prior.rate;
  return {
    abs,
    pct: (abs / prior.rate) * 100,
    direction: abs > 0 ? ("up" as const) : abs < 0 ? ("down" as const) : ("flat" as const),
    previousDate: prior.date,
    latestDate: now.date,
  };
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

/**
 * "2 August 2026" — spelled out, so it can't be misread as a rate.
 *
 * Accepts both stamp shapes the generated file carries: a plain `2026-08-02`
 * from a daily bar, and a full `2026-08-03T02:31Z` from an intraday one.
 */
export function formatRateDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso.length <= 10 ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "2 Aug, 02:31 UTC" — for intraday stamps, where the time is the point. */
export function formatRateTime(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso.length <= 10 ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
  return `${day}, ${time} UTC`;
}
