import type { Mode } from "./mode";

/**
 * The two personas, §1.2.
 *
 * These drive /{mode}/who-its-for. Written as the brief specifies them —
 * including the objections, because a page that lists what someone is worried
 * about and then answers it is more persuasive than one that only lists
 * benefits.
 */

export type Persona = {
  mode: Mode;
  name: string;
  role: string;
  eyebrow: string;
  headline: string;
  lede: string;
  profile: Array<[string, string]>;
  uses: string[];
  needs: Array<{ need: string; answer: string }>;
  /** Institutional calls these objections; retail, honestly, anxiety. */
  concernsTitle: string;
  concerns: Array<{ concern: string; answer: string }>;
  cta: { label: string; href: string };
};

export const PERSONAS: Record<Mode, Persona> = {
  institutional: {
    mode: "institutional",
    name: "Rohan Mehta",
    role: "Finance Manager / Head of Treasury",
    eyebrow: "WHO IT'S FOR",
    headline: "Built for the person who signs off on the payment.",
    lede: "Not a forex specialist. Someone who runs finance for a mid-market firm, is comfortable in a dashboard, and will be asked by a CFO to justify why they chose this over the bank.",
    profile: [
      ["Role", "Finance Manager / Head of Treasury"],
      ["Company size", "₹20 Cr – ₹500 Cr revenue"],
      ["Age", "32–48"],
      ["Based", "Mumbai · Delhi NCR · Bangalore · Pune · Ahmedabad"],
      ["Works in", "Tally · Zoho Books · SAP, daily"],
      ["Forex expertise", "Not a specialist — and shouldn't need to be"],
    ],
    uses: [
      "Recurring vendor payments across USD and EUR",
      "Subsidiary funding on a fixed schedule",
      "Contractor payouts, often several in one run",
    ],
    needs: [
      {
        need: "Predictable settlement, so cash flow can be planned",
        answer:
          "Hop count and settlement window are shown per corridor before you confirm, not estimated afterwards.",
      },
      {
        need: "No margin lost to a markup nobody itemised",
        answer:
          "The margin is a separate line at 0.40%, shown against the rate rather than folded into it.",
      },
      {
        need: "An audit trail a CFO and an auditor can work from",
        answer:
          "Every hop, fee and timestamp is recorded and exportable — the transaction map is the receipt.",
      },
      {
        need: "Less dependence on a bank relationship manager",
        answer:
          "Status is on the screen. There is nobody to chase for an update that the map already shows.",
      },
    ],
    concernsTitle: "The objections worth raising",
    concerns: [
      {
        concern: "Is this RBI/FEMA compliant?",
        answer:
          "Purpose codes are captured per transfer and filed on the RBI schedule, with KYC and sanctions screening before settlement. The Security page states the full posture — including, honestly, that this is a fictional company holding no licence.",
      },
      {
        concern: "What happens if a transfer fails mid-chain?",
        answer:
          "You see the hop it stopped at and why. Resolution is worked from our side rather than handed back to you to chase with your bank.",
      },
      {
        concern: "Can I trust a new platform with crores?",
        answer:
          "You shouldn't have to on faith. The first transfer carries zero forex markup precisely so it can be tested on a real payment, at the live rate, before anything larger follows.",
      },
    ],
    cta: { label: "Request a callback", href: "/institutional/callback" },
  },

  personal: {
    mode: "personal",
    name: "Priya Nair",
    role: "Freelancer · NRI relative · parent paying tuition",
    eyebrow: "WHO IT'S FOR",
    headline: "For the transfer you cannot afford to get wrong.",
    lede: "A tuition fee, a month's rent, an invoice you already earned. Often a large one-time sum, often the first time, and always money that matters more than the fee on it.",
    profile: [
      ["Who", "Freelancer · NRI relative · parent paying tuition"],
      ["Age", "24–45"],
      ["Based", "Tier 1 and Tier 2 India"],
      ["Sends", "USD · GBP · EUR"],
      ["For", "Freelance invoices · education fees · family support"],
      ["Experience", "First-time or occasional sender"],
    ],
    uses: [
      "A semester's tuition, on a deadline",
      "Monthly support to someone studying or living abroad",
      "Freelance income arriving from overseas clients",
    ],
    needs: [
      {
        need: "A fair rate, without the hidden 2–4%",
        answer:
          "You see the rate before you enter a single beneficiary detail, and it is the reference rate rather than a customer rate with margin already inside it.",
      },
      {
        need: "Something simple, app-based, with no branch visit",
        answer:
          "Verification is documents and a liveness check. Nothing is posted anywhere and nobody needs to see you in person.",
      },
      {
        need: "Confidence that a large one-time sum lands safely",
        answer:
          "The transfer is tracked like a parcel. You can see which hop it is at, and roughly how long the next one takes.",
      },
    ],
    concernsTitle: "What people worry about",
    concerns: [
      {
        concern: "It's a lot of money and I've never used this before.",
        answer:
          "That is exactly the situation the first-transfer offer exists for: send at the live rate with no margin added, check the route yourself, and decide afterwards whether to use it again.",
      },
      {
        concern: "What if it goes to the wrong place?",
        answer:
          "Beneficiary details are confirmed before the rate is locked, and the map shows you where the money is at every step rather than going quiet until it arrives.",
      },
      {
        concern: "I don't understand exchange rates well enough to tell if this is fair.",
        answer:
          "You don't have to. The rate shown is the published reference rate, the fee is a separate line, and the comparison against a typical bank route is on the pricing page in full.",
      },
    ],
    cta: { label: "See how it works", href: "/personal/how-it-works" },
  },
};
