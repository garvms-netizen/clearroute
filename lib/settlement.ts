/**
 * The real stages of a cross-border payment.
 *
 * The earlier map compressed a transfer into five friendly rows. That hid the
 * steps that actually cost time and money — screening, the nostro/vostro leg,
 * local clearing — which are precisely the steps this product claims to make
 * visible. A tracking view that skips them is the same opacity the whole
 * argument is against.
 *
 * Each stage carries what genuinely happens, who holds the money at that
 * moment, and whether it is a step Clear Route removes. `savedByClearRoute`
 * marks the two correspondent hops a typical bank route adds and this one
 * does not — shown struck through rather than deleted, because the comparison
 * is the point.
 */

export type Stage = {
  id: string;
  /** What the customer sees. */
  label: string;
  /** What is actually happening at this stage. */
  detail: string;
  /** Who is holding the money right now. */
  custody: string;
  /** Seconds this stage takes in the demo. Real-world figure is in `realWorld`. */
  demoSeconds: number;
  /** How long this takes on a real transfer. */
  realWorld: string;
  /** Present only on the bank route — Clear Route removes these. */
  bankOnly?: boolean;
};

export const SETTLEMENT_STAGES: Stage[] = [
  {
    id: "initiated",
    label: "Transfer initiated",
    detail: "Rate locked, purpose code captured, beneficiary details validated against the destination format.",
    custody: "You",
    demoSeconds: 2,
    realWorld: "instant",
  },
  {
    id: "screening",
    label: "Compliance screening",
    detail: "Sanctions and AML screening on both parties, plus source-of-funds check. This is the step that silently holds payments for days elsewhere.",
    custody: "Clear Route",
    demoSeconds: 3,
    realWorld: "~10 min",
  },
  {
    id: "debit",
    label: "Debited from your account",
    detail: "Funds leave your bank and settle into the collection account.",
    custody: "Your bank → Clear Route",
    demoSeconds: 3,
    realWorld: "~30 min",
  },
  {
    id: "fx",
    label: "FX conversion executed",
    detail: "Converted at the rate you locked, not the rate at execution. The difference between those two is where a markup normally hides.",
    custody: "Clear Route",
    demoSeconds: 3,
    realWorld: "~5 min",
  },
  {
    id: "correspondent-1",
    label: "First correspondent bank",
    detail: "An intermediary that holds the payment, deducts a fee, and passes it on. No visibility into timing while it sits here.",
    custody: "Correspondent bank",
    demoSeconds: 4,
    realWorld: "6–24 hrs",
    bankOnly: true,
  },
  {
    id: "correspondent-2",
    label: "Second correspondent bank",
    detail: "A second intermediary repeating the same deduction and delay.",
    custody: "Correspondent bank",
    demoSeconds: 4,
    realWorld: "6–24 hrs",
    bankOnly: true,
  },
  {
    id: "partner",
    label: "Partner bank in destination market",
    detail: "Pre-funded account in the destination country, so the money is already there — the transfer is a book movement rather than a journey.",
    custody: "Partner bank",
    demoSeconds: 3,
    realWorld: "~45 min",
  },
  {
    id: "clearing",
    label: "Local clearing",
    detail: "Enters the destination country's domestic payment system, on that country's local rails.",
    custody: "Local clearing house",
    demoSeconds: 3,
    realWorld: "~1 hr",
  },
  {
    id: "credited",
    label: "Credited to beneficiary",
    detail: "Funds land in the recipient's account. Confirmation reference issued to both sides.",
    custody: "Beneficiary",
    demoSeconds: 2,
    realWorld: "instant",
  },
];

/** The route Clear Route actually takes — correspondents removed. */
export const CLEARROUTE_STAGES = SETTLEMENT_STAGES.filter((s) => !s.bankOnly);

/**
 * Each stage with the second it starts and the second it finishes.
 *
 * Computed once here rather than accumulated inside a render pass — the
 * schedule is fixed, so deriving it on every tick would be both wasteful and
 * a mutation during render.
 */
export const STAGE_SCHEDULE: Array<{ stage: Stage; start: number; end: number }> =
  CLEARROUTE_STAGES.reduce<Array<{ stage: Stage; start: number; end: number }>>(
    (acc, stage) => {
      const start = acc.length ? acc[acc.length - 1].end : 0;
      acc.push({ stage, start, end: start + stage.demoSeconds });
      return acc;
    },
    [],
  );

/** Total demo runtime for the Clear Route path, in seconds. */
export const DEMO_DURATION = STAGE_SCHEDULE.length
  ? STAGE_SCHEDULE[STAGE_SCHEDULE.length - 1].end
  : 0;

/**
 * Why the demo is honest about being a simulation.
 *
 * The stages, their order and their real-world durations are how a
 * cross-border payment genuinely works. The clock in the demo is compressed —
 * a real transfer takes hours, and a demo that took hours would demonstrate
 * nothing. Each row shows both: the demo timer running now, and the real-world
 * duration that stage actually takes.
 */
export const COMPRESSION_NOTE =
  "Stages, order and custody are how a cross-border payment actually works. " +
  "The clock is compressed: each row shows both the live demo timer and the " +
  "real-world duration that stage genuinely takes.";
