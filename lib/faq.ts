/**
 * FAQ content, §16.1.
 *
 * Grouped into five sections, drawn from the persona objections, the pricing
 * page, the demo and the security page. Every answer is under 80 words, plain
 * and specific — an FAQ that restates the marketing copy is worse than no FAQ,
 * because it teaches the reader that the page will not answer them.
 *
 * Each id becomes the element id, so every question is deep-linkable:
 * /faq#is-the-rate-marked-up opens that answer directly.
 */

export type FaqItem = { id: string; q: string; a: string };
export type FaqGroup = { id: string; title: string; items: FaqItem[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "getting-started",
    title: "Getting started",
    items: [
      {
        id: "what-is-clear-route",
        q: "What is Clear Route?",
        a: "A cross-border payment platform built around three things: a live rate you can lock before confirming, fewer intermediary banks in the chain, and a map showing every hop your money passes through. It is a fictional company created for an academic marketing project.",
      },
      {
        id: "do-i-need-an-account-to-see-rates",
        q: "Do I need an account to see the rate?",
        a: "No. The rate appears on the interactive demo before you enter a single beneficiary detail, and the pricing page shows the full worked example without a signup. Hiding the number would contradict the entire point of the product.",
      },
      {
        id: "what-do-i-need-to-send-money",
        q: "What do I need to send money?",
        a: "Identity documents for verification, the beneficiary's account details, and a purpose for the transfer. Verification is document plus liveness check — nothing is posted anywhere and there is no branch visit.",
      },
      {
        id: "which-currencies-are-supported",
        q: "Which currencies can I send?",
        a: "The demo quotes any pair among the currencies with a published market rate — 144 of them at the last build, covering every corridor the personas here use. Hop counts and settlement windows differ by corridor and are shown before you confirm.",
      },
    ],
  },
  {
    id: "rates-and-fees",
    title: "Rates & fees",
    items: [
      {
        id: "is-the-rate-marked-up",
        q: "Is the rate marked up?",
        a: "No. The rate applied is the live interbank reference rate, locked at confirmation. The margin is a separate, itemised line shown before you confirm — it is never folded into the exchange rate.",
      },
      {
        id: "what-does-it-cost",
        q: "What does it cost?",
        a: "A flat 0.40% of the send amount. Network and correspondent fees are absorbed. There is no tiering and no hidden spread, and the exact figure appears before you confirm every transfer.",
      },
      {
        id: "are-there-receiving-fees",
        q: "Are there receiving fees?",
        a: "Network and correspondent fees are absorbed by Clear Route. A recipient's own bank may apply its own charge, which is outside our control; where it can be estimated, it is shown before you send rather than after.",
      },
      {
        id: "does-the-margin-change-by-currency",
        q: "Does the margin change by currency?",
        a: "No. It is 0.40% on every corridor. Currencies differ in how many hops and how long they take, and both are shown per corridor before you confirm.",
      },
      {
        id: "how-does-the-first-transfer-offer-work",
        q: "How does the first-transfer offer work?",
        a: "Your first completed transfer applies no forex markup — you pay the live interbank rate with no margin added, up to ₹5,00,000 or currency equivalent, once per verified account. Standard itemised pricing applies afterward and is always shown before you confirm. No countdown, no expiry.",
      },
      {
        id: "why-show-a-waived-fee",
        q: "Why show a fee and then waive it?",
        a: "Because a bare zero looks like there was never a fee. Showing the standard 0.40% alongside the waiver makes clear exactly what is being given up, and what future transfers will cost.",
      },
    ],
  },
  {
    id: "transfers-and-tracking",
    title: "Transfers & tracking",
    items: [
      {
        id: "how-long-does-a-transfer-take",
        q: "How long does a transfer take?",
        a: "Around ninety seconds on a typical two-hop corridor, against two to five days for a typical bank route. The destination account is pre-funded, so the transfer is a book movement rather than a payment travelling a chain. Your corridor's estimate is shown before you confirm.",
      },
      {
        id: "what-is-a-hop",
        q: "What is a hop?",
        a: "One institution handling your money on its way to the recipient. Each hop can take a fee and add delay. Most bank routes pass through two or three correspondent banks; fewer hops is the mechanism behind faster settlement, not a slogan.",
      },
      {
        id: "what-if-my-transfer-fails",
        q: "What if my transfer fails or gets stuck?",
        a: "Every transfer carries an end-to-end tracking reference. If a payment is held at any hop you see exactly where and why, our team works the resolution directly rather than asking you to chase your bank, and the margin on a failed transfer is not charged.",
      },
      {
        id: "can-i-send-multiple-currencies",
        q: "Can I send in more than one currency at once?",
        a: "Yes. A second leg — say USD→EUR after INR→USD — is added to the same session, carrying over your KYC, beneficiary and source-of-funds details. On most platforms this is two separate transactions with everything typed twice.",
      },
      {
        id: "can-i-cancel-a-transfer",
        q: "Can I cancel a transfer after confirming?",
        a: "Once a transfer has been debited and the rate locked, it proceeds. Before confirmation nothing is committed — the rate quote, the fee breakdown and the route are all shown while you can still walk away.",
      },
      {
        id: "what-is-the-transaction-map",
        q: "What is the transaction map?",
        a: "A timestamped record of every hop, fee and conversion in your transfer, readable like parcel tracking. It is saved, exportable, and the same view your finance team or auditor can work from.",
      },
    ],
  },
  {
    id: "security-and-compliance",
    title: "Security & compliance",
    items: [
      {
        id: "is-clear-route-regulated",
        q: "Is Clear Route licensed and regulated?",
        a: "No. Clear Route is fictional and holds no licence. The security page presents a regulatory posture as a real deployment would, with the two fields that would carry an actual registration left explicitly empty rather than filled with something plausible.",
      },
      {
        id: "how-is-my-money-held",
        q: "How is my money held in transit?",
        a: "Client funds are described as segregated from operating capital, moved through regulated partner banks in each settlement corridor. If a transfer is held mid-chain, the hop and the reason are visible rather than reported after the fact.",
      },
      {
        id: "what-data-is-collected",
        q: "What data does this website collect?",
        a: "Anonymous page and interaction counts with a random per-session identifier that expires when you close the tab. No cookies, no fingerprinting, no third-party trackers, no advertising pixels. The privacy page describes exactly this.",
      },
      {
        id: "will-you-ever-ask-for-my-password",
        q: "Will you ever contact me asking for credentials?",
        a: "Never. Not a password, not an OTP, not card details. Anyone who does is not us. This sits alongside two other commitments: never quote one rate and apply another, and never bury a fee inside an exchange rate.",
      },
    ],
  },
  {
    id: "for-businesses",
    title: "For businesses",
    items: [
      {
        id: "is-this-fema-compliant",
        q: "Is this RBI and FEMA compliant?",
        a: "A real deployment would capture a purpose code per transfer and file on the RBI schedule, with KYC and sanctions screening before settlement. Clear Route is fictional, so it holds no authorisation — the security page states that plainly rather than reassuring generically.",
      },
      {
        id: "can-i-export-for-reconciliation",
        q: "Can I export transfers for reconciliation?",
        a: "Yes. Every hop, fee and timestamp is recorded and exportable, which is what makes the transaction map an audit trail rather than a status page. It is designed to be forwarded to an auditor without rework.",
      },
      {
        id: "is-there-volume-pricing",
        q: "Is there volume pricing?",
        a: "Above a monthly threshold the 0.40% can be reviewed against your actual corridors and frequency. That is a conversation, not a hidden tier — the standard rate stays published on the pricing page either way.",
      },
      {
        id: "can-transfers-be-scheduled",
        q: "Can recurring vendor payments be scheduled?",
        a: "Yes. A recurring transfer is set up once and runs on schedule, with the same rate transparency and transaction mapping applied each time it executes.",
      },
    ],
  },
];

export const FAQ_COUNT = FAQ_GROUPS.reduce((n, g) => n + g.items.length, 0);

/**
 * §16.1 sets a floor of 18 questions and an 80-word ceiling per answer.
 * Both are checked at module load so the build fails rather than shipping an
 * FAQ that quietly drifted below the brief.
 */
function assertFaqShape() {
  if (FAQ_COUNT < 18) {
    throw new Error(`FAQ has ${FAQ_COUNT} questions; §16.1 requires at least 18.`);
  }
  const long = FAQ_GROUPS.flatMap((g) => g.items).filter(
    (i) => i.a.trim().split(/\s+/).length > 80,
  );
  if (long.length) {
    throw new Error(
      `FAQ answers over 80 words: ${long.map((i) => i.id).join(", ")}.`,
    );
  }
  const ids = FAQ_GROUPS.flatMap((g) => g.items).map((i) => i.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) {
    throw new Error(`Duplicate FAQ ids would break deep links: ${dupes.join(", ")}.`);
  }
}

assertFaqShape();
