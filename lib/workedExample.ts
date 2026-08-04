/**
 * The worked example, §9.2.
 *
 * This is the single source for every figure that appears on /pricing, /demo
 * and both /{mode}/how-it-works pages. §20 requires those four to reconcile
 * exactly, and the only durable way to guarantee that is to derive the
 * outputs from the inputs here rather than type the same numbers into four
 * files and hope they stay in step.
 *
 * The inputs below are the illustrative figures the brief specifies. They are
 * deliberately *not* the live rate: the live rate moves daily, and a comparison
 * table whose difference changed every morning would be impossible to
 * reference. The demo labels these as an example and shows the live rate
 * separately, clearly marked as such.
 */

import { BANK_SETTLEMENT_TIME, SETTLEMENT_TIME } from "./settlement";

export const SEND_INR = 500_000;

/** INR per 1 USD. */
export const LEG1_RATE = 83.421;
/** EUR per 1 USD — the second leg is a USD→EUR conversion. */
export const LEG2_RATE = 0.918;

/** Clear Route's standard margin, waived on a first transfer. */
export const MARGIN_PCT = 0.4;

/** A typical bank route's applied rate, INR per 1 USD. Never named. */
export const BANK_RATE = 85.08;

/* --------------------------------------------------------------------------
   Derived. Rounded to 2dp at each step, because that is what a customer is
   actually shown and therefore what the next step genuinely operates on —
   carrying full float precision through would produce a total that doesn't
   match the visible line items.

   ## Correction to the brief

   §9.2 states "INR→USD at 83.4210 → $5,994.89 (500000 ÷ 83.4210)". That
   division does not produce that figure:

       83.4210 × 5,994.89 = 500,099.70   (not ₹5,00,000)
       83.4210 × 5,993.69 = 500,000.00

   The correct quotient is $5,993.69, and the brief's €5,503.31 and $118.07
   both inherit the error because they are computed from it.

   Resolved by treating the *rate* as the input and deriving the amounts,
   which is the right way round — a rate is quoted, an amount is a
   consequence of it. Keeping $5,994.89 instead would have meant publishing
   83.4043 as the locked rate, contradicting the rate printed throughout the
   brief and in the transaction map.

   Corrected figures: $5,993.69 · €5,502.21 · difference $116.87.
   -------------------------------------------------------------------------- */

const round2 = (n: number) => Math.round(n * 100) / 100;

/** $5,993.69 — see the correction note above. */
export const LEG1_USD = round2(SEND_INR / LEG1_RATE);

/** €5,502.21 */
export const LEG2_EUR = round2(LEG1_USD * LEG2_RATE);

/** What the margin would have been: ₹2,000.00 at 0.40%. */
export const MARGIN_INR = round2((SEND_INR * MARGIN_PCT) / 100);

/** $5,876.82 — the same rupees through a typical bank route. */
export const BANK_USD = round2(SEND_INR / BANK_RATE);

/** $116.87 */
export const DIFFERENCE_USD = round2(LEG1_USD - BANK_USD);

export const HOPS = { leg1: 2, leg2: 1, session: 3 } as const;
/**
 * Settlement windows, imported rather than restated.
 *
 * These used to read "~4 hours", which contradicted the real-time claim on
 * every page they appeared on. lib/settlement.ts is now the only place any
 * duration is written down.
 */
export const HOURS = { leg1: SETTLEMENT_TIME, leg2: "~45 sec" } as const;
export const BANK_SETTLEMENT = BANK_SETTLEMENT_TIME;

/**
 * The transaction map, §9.3 step 4.
 *
 * Timestamps are illustrative and fixed. The active row runs a live mm:ss
 * counter in the UI — that one is honest, because it counts elapsed demo time
 * rather than pretending to track a real payment.
 */
export type MapRow = {
  state: "done" | "active" | "pending";
  row: string;
  detail: string;
  time: string;
};

/**
 * Figures are interpolated from the constants above rather than written out,
 * so the map cannot drift from the breakdown it is meant to be a record of.
 */
const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const usd = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const eur = (n: number) =>
  "€" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const TRANSACTION_MAP: MapRow[] = [
  {
    state: "done",
    row: "Debited · HDFC Bank, Mumbai",
    detail: `${inr(SEND_INR)} · fee ${inr(0)}`,
    time: "09:14:02 IST",
  },
  {
    state: "done",
    row: "Clear Route FX · INR → USD",
    detail: `${LEG1_RATE.toFixed(4)} locked · ${usd(LEG1_USD)}`,
    time: "09:14:38 IST",
  },
  {
    state: "done",
    row: "Partner bank · New York",
    detail: `${usd(LEG1_USD)} · fee ${usd(0)}`,
    time: "11:47:20 IST",
  },
  {
    state: "active",
    row: "Clear Route FX · USD → EUR",
    detail: `${LEG2_RATE.toFixed(4)} locked · ${eur(LEG2_EUR)}`,
    time: "in progress",
  },
  {
    state: "pending",
    row: "Beneficiary · Frankfurt",
    detail: `${eur(LEG2_EUR)} expected`,
    time: "est. 13:20 IST",
  },
];

/**
 * A build-time reconciliation check.
 *
 * If someone edits an input above and the published figures no longer agree
 * with the brief, this throws during `next build` rather than shipping a page
 * whose numbers quietly contradict the page beside it. On a site whose entire
 * claim is arithmetic you can check, a silent drift is the worst failure mode
 * available.
 */
function assertReconciles() {
  // The corrected figures — see the correction note above. This guard already
  // earned its place: it caught the brief's own division error on first run,
  // before four pages shipped quoting a quotient that doesn't divide.
  const expected: Array<[string, number, number]> = [
    ["LEG1_USD", LEG1_USD, 5993.69],
    ["LEG2_EUR", LEG2_EUR, 5502.21],
    ["MARGIN_INR", MARGIN_INR, 2000],
    ["BANK_USD", BANK_USD, 5876.82],
    ["DIFFERENCE_USD", DIFFERENCE_USD, 116.87],
  ];
  for (const [name, actual, want] of expected) {
    if (Math.abs(actual - want) > 0.005) {
      throw new Error(
        `Worked example no longer reconciles: ${name} is ${actual}, expected ${want}. ` +
          `Fix the inputs in lib/workedExample.ts — do not let the pages drift apart.`,
      );
    }
  }

  // The relationships have to hold too, not just the constants. If someone
  // changes a rate, this is what says the comparison is still arithmetic
  // rather than decoration.
  if (Math.abs(DIFFERENCE_USD - round2(LEG1_USD - BANK_USD)) > 0.005) {
    throw new Error("The advertised difference is not leg 1 minus the bank route.");
  }
  if (Math.abs(SEND_INR / LEG1_RATE - LEG1_USD) > 0.01) {
    throw new Error("Leg 1 does not divide out at the quoted rate.");
  }
}

assertReconciles();
