import type { Mode } from "./mode";

/**
 * Home page content, §8.
 *
 * Section order is locked in both modes — value proposition, proof, social
 * proof, objections, conversion. Only copy register and presentation change.
 * Anything stated identically in both modes lives here once.
 */

/* --- §8.2 The problem ----------------------------------------------------- */

export const PROBLEM_H2 =
  "The rate you're quoted and the rate you get are usually two different numbers.";

export const PROBLEM_BODY =
  "Most cross-border payments pass through two or three correspondent banks. " +
  "Each one takes a fee. On top of that, a margin is typically added to the " +
  "exchange rate itself — not shown as a line item, just absorbed into the " +
  "number you see. That's why two providers can both advertise “no transfer " +
  "fee” and still cost very different amounts.";

export type Stat = { figure: string; label: string };

export const PROBLEM_STATS: Stat[] = [
  {
    figure: "1–3%",
    label: "Typical margin added into the quoted exchange rate",
  },
  { figure: "$10–30", label: "Taken by each correspondent bank in the chain" },
  {
    figure: "2–5 days",
    label: "Average settlement time for a business cross-border payment",
  },
];

/** Institutional adds a fourth — density is the point in that mode. */
export const PROBLEM_STAT_INSTITUTIONAL: Stat = {
  figure: "68%",
  label:
    "of business owners globally report paying unnecessarily high fees on cross-border payments",
};

/* --- §8.3 How it works, teaser only --------------------------------------- */

export const STEPS_H2 = "Four steps. Nothing hidden at any of them.";

export const STEPS: Array<{ title: string; optional?: boolean; body: string }> = [
  {
    title: "Choose your route",
    body: "Pick your currencies and amount. The live rate appears immediately, before you enter a single beneficiary detail.",
  },
  {
    title: "Lock your rate",
    body: "Lock the rate you can see. It won't move between now and settlement. The fee is a separate line, never folded into the rate.",
  },
  {
    title: "Add another leg",
    optional: true,
    body: "Sending INR→USD and then USD→EUR? Add the second leg to the same session. Your details carry over.",
  },
  {
    title: "Watch it move",
    body: "After you confirm, you get the full route: every hop, every fee, every timestamp.",
  },
];

/* --- §8.4 Three mechanisms ------------------------------------------------ */

export const MECHANISMS_H2 = "Built around three specific mechanisms.";

export const MECHANISMS: Array<{ title: string; body: string }> = [
  {
    title: "Live locked rate",
    body: "The rate you see is the rate applied. Locked before you confirm, held through settlement.",
  },
  {
    title: "Minimal intermediaries",
    body: "Fewer banks in the chain means fewer fees deducted and less time in transit.",
  },
  {
    title: "One session, every currency",
    body: "Multi-leg, multi-currency transfers set up together — no restarting, no re-entering.",
  },
];

/* --- §8.7 Objection handling ---------------------------------------------- */

export const OBJECTIONS_H2 =
  "The questions worth asking before you send money anywhere.";

export type Objection = {
  id: string;
  question: string;
  answer: string;
  /** Rendered as a project-note Callout directly beneath the answer. */
  projectNote?: string;
  link?: { label: string; href: string };
};

export const OBJECTIONS: Objection[] = [
  {
    id: "licensed-and-compliant",
    question: "Is Clear Route licensed and compliant?",
    answer:
      "Clear Route operates under applicable regulatory authorisation for cross-border remittance, and all transfers are subject to standard KYC and FEMA reporting requirements. Full licensing detail is on our Security & Compliance page.",
    projectNote:
      "Clear Route is fictional. A real deployment must state the actual licence type, issuing regulator and registration number here — never generic reassurance.",
    link: { label: "Security & compliance", href: "/security" },
  },
  {
    id: "transfer-fails",
    question: "What happens if a transfer fails or gets stuck?",
    answer:
      "Every transfer carries an end-to-end tracking reference. If a payment is held at any hop, you'll see exactly where and why, and our team works the resolution directly rather than asking you to chase your bank.",
  },
  {
    id: "trust-large-sums",
    question: "Can I trust a new platform with large sums?",
    answer:
      "You shouldn't have to take that on faith — which is why your first transfer is at zero forex markup. Test the platform on a real payment, at the live rate, and check the route yourself before deciding whether to send more.",
  },
  {
    id: "cost-after-first-transfer",
    question: "What does it actually cost after the first transfer?",
    answer:
      "A flat, itemised margin shown separately from the exchange rate, displayed before you confirm every transfer. No tiering, no hidden spread.",
    link: { label: "See pricing", href: "/pricing" },
  },
];

/* --- §8.8 Conversion ------------------------------------------------------ */

export function conversionCopy(mode: Mode) {
  return mode === "institutional"
    ? {
        heading: "Moving company money?",
        body: "If you're handling vendor payments, subsidiary funding or contractor payouts, a short call is usually faster than a signup form. Tell us where you send money and we'll walk you through the route, the rate and the settlement timeline for your specific corridors.",
        cta: { label: "Request a callback", href: "/institutional/callback" },
      }
    : {
        heading: "Ready to send?",
        body: "See exactly how a transfer works — the live rate, the route, and your first transfer at zero forex markup.",
        cta: { label: "Get the app", href: "/personal/get-the-app" },
      };
}

/* --- §8.1 Hero ------------------------------------------------------------ */

export function heroCopy(mode: Mode) {
  return mode === "institutional"
    ? {
        eyebrow: "CROSS-BORDER PAYMENTS · INDIA OUTBOUND",
        h1: "See every step your money takes. Every time.",
        sub: "Live rates, minimal intermediaries, full transaction tracking, and multi-currency transfers in one session.",
        primary: {
          label: "See how a transfer works →",
          href: "/institutional/how-it-works",
        },
        secondary: {
          label: "Request a callback",
          href: "/institutional/callback",
        },
      }
    : {
        eyebrow: "SENDING MONEY ABROAD",
        h1: "Send money home. Watch every step of the way.",
        sub: "See the real rate before you send. Track your transfer like a parcel, from your bank to theirs.",
        primary: { label: "See how it works →", href: "/personal/how-it-works" },
        secondary: { label: "Get the app", href: "/personal/get-the-app" },
      };
}

/* --- §8.5 Video strip ----------------------------------------------------- */

export function videoFor(mode: Mode) {
  return mode === "institutional"
    ? {
        src: "/video/clearroute-institutional.mp4",
        title: "The number you were never shown.",
        runtime: "50s",
      }
    : {
        src: "/video/clearroute-personal.mp4",
        title: "The other end of the line.",
        runtime: "35s",
      };
}
