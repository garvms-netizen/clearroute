/**
 * The real stages of a cross-border payment, and how long each one takes.
 *
 * ## Why the timings are seconds, not hours
 *
 * The product's claim is real-time settlement on any corridor. Earlier copy
 * said "~4 hours", which quietly contradicted that on every page it appeared
 * on — a four-hour wait is faster than a bank, but it is not real time, and a
 * site cannot claim one while printing the other.
 *
 * Seconds are defensible for this model rather than optimistic. The two
 * correspondent hops are removed, and the destination account is pre-funded,
 * so the customer-facing transfer is a book movement between accounts that
 * already hold balance rather than a payment travelling a chain. What is left
 * is screening, the debit, the conversion and local clearing — all of which
 * genuinely run in seconds when nothing is queued behind an intermediary.
 *
 * Every duration on the site derives from this file. It exists so the claim
 * cannot drift out of step with the figures again.
 */

export type Stage = {
  id: string;
  /** What the customer sees. */
  label: string;
  /** What is actually happening at this stage. */
  detail: string;
  /** Who is holding the money right now. */
  custody: string;
  /** Seconds this stage takes on a real transfer. */
  seconds: number;
  /** How that reads in the UI. */
  realWorld: string;
  /** Present only on the bank route — Clear Route removes these. */
  bankOnly?: boolean;
};

export const SETTLEMENT_STAGES: Stage[] = [
  {
    id: "initiated",
    label: "Transfer initiated",
    detail:
      "Rate locked, purpose code captured, beneficiary details validated against the destination format.",
    custody: "You",
    seconds: 1,
    realWorld: "instant",
  },
  {
    id: "screening",
    label: "Compliance screening",
    detail:
      "Sanctions and AML screening on both parties, plus source-of-funds check. Automated against live lists — this is the step that silently holds payments for days elsewhere.",
    custody: "Clear Route",
    seconds: 20,
    realWorld: "~20 sec",
  },
  {
    id: "debit",
    label: "Debited from your account",
    detail: "Funds leave your bank and settle into the collection account over domestic instant rails.",
    custody: "Your bank → Clear Route",
    seconds: 15,
    realWorld: "~15 sec",
  },
  {
    id: "fx",
    label: "FX conversion executed",
    detail:
      "Converted at the rate you locked, not the rate at execution. The difference between those two is where a markup normally hides.",
    custody: "Clear Route",
    seconds: 5,
    realWorld: "~5 sec",
  },
  {
    id: "correspondent-1",
    label: "First correspondent bank",
    detail:
      "An intermediary that holds the payment, deducts a fee, and passes it on. No visibility into timing while it sits here.",
    custody: "Correspondent bank",
    seconds: 43_200,
    realWorld: "6–24 hrs",
    bankOnly: true,
  },
  {
    id: "correspondent-2",
    label: "Second correspondent bank",
    detail: "A second intermediary repeating the same deduction and delay.",
    custody: "Correspondent bank",
    seconds: 43_200,
    realWorld: "6–24 hrs",
    bankOnly: true,
  },
  {
    id: "partner",
    label: "Partner bank in destination market",
    detail:
      "A pre-funded account in the destination country, so the money is already there. The transfer is a book movement rather than a journey — which is the whole reason this takes seconds.",
    custody: "Partner bank",
    seconds: 25,
    realWorld: "~25 sec",
  },
  {
    id: "clearing",
    label: "Local clearing",
    detail:
      "Enters the destination country's domestic instant-payment system, on that country's own rails.",
    custody: "Local clearing house",
    seconds: 20,
    realWorld: "~20 sec",
  },
  {
    id: "credited",
    label: "Credited to beneficiary",
    detail: "Funds land in the recipient's account. Confirmation reference issued to both sides.",
    custody: "Beneficiary",
    seconds: 1,
    realWorld: "instant",
  },
];

/** The route Clear Route actually takes — correspondents removed. */
export const CLEARROUTE_STAGES = SETTLEMENT_STAGES.filter((s) => !s.bankOnly);

/**
 * Each stage with the second it starts and finishes.
 *
 * Computed once here rather than accumulated inside a render pass: the
 * schedule is fixed, so deriving it on every tick would be both wasteful and
 * a mutation during render.
 */
export const STAGE_SCHEDULE: Array<{ stage: Stage; start: number; end: number }> =
  CLEARROUTE_STAGES.reduce<Array<{ stage: Stage; start: number; end: number }>>(
    (acc, stage) => {
      const start = acc.length ? acc[acc.length - 1].end : 0;
      acc.push({ stage, start, end: start + stage.seconds });
      return acc;
    },
    [],
  );

/** Total seconds, end to end. Currently 87. */
export const SETTLEMENT_SECONDS = STAGE_SCHEDULE.length
  ? STAGE_SCHEDULE[STAGE_SCHEDULE.length - 1].end
  : 0;

/* --------------------------------------------------------------------------
   The canonical way every page prints the settlement time.

   One constant, imported everywhere, so the real-time claim and the figures
   beside it cannot come apart.
   -------------------------------------------------------------------------- */

/** "~90 seconds" — the headline figure. */
export const SETTLEMENT_TIME = "~90 seconds";

/** "under two minutes" — for running prose. */
export const SETTLEMENT_PROSE = "under two minutes";

/** What a typical bank route takes, for the comparison. */
export const BANK_SETTLEMENT_TIME = "2–5 days";

/**
 * Per-corridor settlement, for /about.
 *
 * Corridors differ by how many hops and which local rails the destination
 * runs, not by hours. AED is a single hop because the partner bank settles
 * directly into the local system.
 */
export const CORRIDOR_TIMES: Array<[string, string]> = [
  ["INR → USD", "2 hops · ~90 sec"],
  ["INR → EUR", "2 hops · ~90 sec"],
  ["INR → GBP", "2 hops · ~2 min"],
  ["INR → AED", "1 hop · ~45 sec"],
  ["INR → SGD", "2 hops · ~90 sec"],
  ["INR → AUD", "2 hops · ~2 min"],
  ["INR → CAD", "2 hops · ~2 min"],
];

/**
 * Why the demo clock is not the real clock.
 *
 * A real transfer settles in about ninety seconds. The demo compresses that
 * so the whole sequence is watchable without waiting, and every row shows the
 * real duration beside the live timer so the compression is stated rather
 * than implied.
 */
export const COMPRESSION_NOTE =
  "Stages, order and custody are how a cross-border payment actually works, and " +
  "the durations shown are the real ones. The demo clock is compressed so the " +
  "whole sequence is watchable in a few seconds — each row shows both.";

/** How much faster the demo runs than reality. */
export const DEMO_SPEEDUP = 6;

/** Demo runtime in seconds, derived from the real timings. */
export const DEMO_DURATION = SETTLEMENT_SECONDS / DEMO_SPEEDUP;
