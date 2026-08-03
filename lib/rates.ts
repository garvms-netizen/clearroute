/**
 * Live reference rates.
 *
 * Source: Frankfurter, which serves ECB reference rates. Free, no API key,
 * CORS-enabled — which matters, because this site is a static export with no
 * server to proxy through.
 *
 * ## The honesty constraint
 *
 * ECB reference rates update **once per working day**. They are not
 * tick-by-tick. Everything below is built around not overstating that:
 *
 * - The figure is always labelled "Indicative rate · ECB reference" and
 *   carries the `date` the API itself reports.
 * - There is deliberately no simulated ticker. On a product whose entire
 *   pitch is rate honesty, animating price movement that did not happen is
 *   the one lie that would undo the pitch.
 * - On failure the UI shows static sample figures and says so. Never an
 *   endless spinner, never a blank figure.
 *
 * ## Quote convention
 *
 * A rate is "units of the sending currency per 1 unit of the receiving
 * currency" — INR→USD ≈ 83.42 means one dollar costs ₹83.42, so the
 * recipient gets `amount / rate`. This matches the worked example in §9.2
 * exactly: 500000 ÷ 83.4210 = 5994.89.
 */

export type Corridor = "USD" | "EUR" | "GBP";

export const CORRIDORS: Corridor[] = ["USD", "EUR", "GBP"];

export type RateSet = {
  /** INR per 1 unit of the quote currency. */
  rates: Record<Corridor, number>;
  /** The date the ECB published these, straight from the API. */
  date: string;
  /** True when these are the hard-coded fallbacks below. */
  isFallback: boolean;
};

/** One real published close. */
export type Close = { date: string; rate: number };

export type RateHistory = {
  /** Oldest to newest, one entry per ECB publishing day. */
  series: Record<Corridor, Close[]>;
  isFallback: boolean;
};

/**
 * Static fallbacks, matching the §9.2 worked example so every downstream
 * figure still reconciles when the network is unavailable.
 */
export const FALLBACK_RATES: RateSet = {
  rates: { USD: 83.421, EUR: 90.105, GBP: 105.77 },
  date: "2026-01-02",
  isFallback: true,
};

export const FALLBACK_NOTICE =
  "Showing sample rates — live reference unavailable.";

/**
 * One request, quoted off the EUR base.
 *
 * ECB publishes everything against EUR, and Frankfurter passes that through:
 * `base=EUR&symbols=INR,USD,GBP` returns full-precision figures from which
 * every INR pair can be derived as `rates.INR / rates.X`.
 *
 * Two alternatives were measured against a direct quote and rejected:
 *
 * - `base=INR&symbols=…` returns reciprocals rounded to five significant
 *   figures (USD came back as 0.01048). Inverting that gave 95.4198 where the
 *   direct quote was 95.3900 — an error of 0.03, visible at the second
 *   decimal and worth roughly ₹150 on a ₹5,00,000 transfer. On a site whose
 *   entire claim is rate precision, that is not a rounding detail to wave
 *   through.
 * - Quoting each pair directly is exact but costs three round trips.
 *
 * Deriving off EUR lands within 0.005 of the direct quote in one request,
 * the residual being the API's own rounding.
 *
 * Note the path is `/v1`. There is no `/v2` (it 404s), and the
 * `api.frankfurter.app` host named in §9.1 fails CORS outright.
 */
export async function fetchRates(signal?: AbortSignal): Promise<RateSet> {
  const url =
    "https://api.frankfurter.dev/v1/latest?base=EUR&symbols=INR," +
    CORRIDORS.filter((c) => c !== "EUR").join(",");

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Rate lookup failed: ${res.status}`);

  const data: { date?: string; rates?: Record<string, number> } =
    await res.json();

  const inrPerEur = data.rates?.INR;
  if (!inrPerEur) throw new Error("Rate lookup missing INR");

  const out = {} as Record<Corridor, number>;
  for (const c of CORRIDORS) {
    if (c === "EUR") {
      out.EUR = inrPerEur;
      continue;
    }
    const perEur = data.rates?.[c];
    if (!perEur) throw new Error(`Rate lookup missing ${c}`);
    out[c] = inrPerEur / perEur;
  }

  return { rates: out, date: data.date ?? FALLBACK_RATES.date, isFallback: false };
}

/**
 * Real published closes for the last `days` calendar days.
 *
 * This is what makes movement on this site honest. There is no free,
 * keyless, CORS-enabled source of intraday interbank rates — tick data is a
 * commercial product — so the choice was between showing one static number
 * or inventing movement between refreshes. The time-series endpoint removes
 * that choice: every point below is an actual ECB close on an actual date,
 * so day-over-day change and the trend line are both real and independently
 * checkable. Nothing is interpolated and nothing is simulated.
 *
 * Weekends and TARGET holidays simply have no entry, which is correct — the
 * ECB does not publish on those days, and inventing a point to smooth the
 * line would be exactly the fabrication this whole approach avoids.
 */
export async function fetchRateHistory(
  days = 45,
  signal?: AbortSignal,
): Promise<RateHistory> {
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - days);
  const from = start.toISOString().slice(0, 10);

  const url =
    `https://api.frankfurter.dev/v1/${from}..?base=EUR&symbols=INR,` +
    CORRIDORS.filter((c) => c !== "EUR").join(",");

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Rate history failed: ${res.status}`);

  const data: { rates?: Record<string, Record<string, number>> } =
    await res.json();
  const byDate = data.rates ?? {};
  const dates = Object.keys(byDate).sort();
  if (dates.length === 0) throw new Error("Rate history empty");

  const series = { USD: [], EUR: [], GBP: [] } as Record<Corridor, Close[]>;

  for (const date of dates) {
    const row = byDate[date];
    const inrPerEur = row?.INR;
    if (!inrPerEur) continue;
    for (const c of CORRIDORS) {
      // Same EUR-base derivation as fetchRates, for the same precision
      // reason — see the note there.
      const rate = c === "EUR" ? inrPerEur : inrPerEur / row[c];
      if (Number.isFinite(rate)) series[c].push({ date, rate });
    }
  }

  return { series, isFallback: false };
}

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

/** "2 January 2026" — spelled out, so it can't be misread as a rate. */
export function formatRateDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
