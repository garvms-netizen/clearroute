/**
 * Campaign content, §23.2–23.6 and §23.8.
 *
 * Rendered verbatim across /presence/*. Two rules govern everything here:
 *
 * 1. **Concept previews, not clones.** No real platform logo, icon set or
 *    interface chrome is reproduced anywhere. The frames are ClearRoute's own,
 *    built from its own palette.
 * 2. **The offer lives at Conversion only** (§18). No Awareness or Interest
 *    asset mentions zero forex markup — a risk-reversal offer only persuades
 *    someone who already understands the risk, and led with too early it reads
 *    as a discount and attracts price-shoppers who churn. `assertOfferPlacement`
 *    below enforces this rather than trusting it.
 */

export type FunnelStage =
  | "Awareness"
  | "Interest"
  | "Conversion"
  | "Onboarding"
  | "Retention"
  | "Advocacy";

/* ---------------------------------------------------------------- Funnel -- */

export const FUNNEL: Array<{
  n: number;
  stage: FunnelStage;
  objective: string;
  channels: string;
  emphasis: string;
}> = [
  {
    n: 1,
    stage: "Awareness",
    objective:
      "Qualified first-touch among people actively sending or actively frustrated — not general impressions",
    channels: "SEO blog · LinkedIn organic · Instagram · top-of-funnel ads",
    emphasis: "Rate opacity and intermediary drag. No offer.",
  },
  {
    n: 2,
    stage: "Interest",
    objective:
      "Convert awareness into understanding — especially multi-leg, which can't be grasped from a headline",
    channels: "Landing pages · interactive demo · retargeting",
    emphasis: "Live rate, transaction map, multi-leg shown as a sequence",
  },
  {
    n: 3,
    stage: "Conversion",
    objective: "Get the first transaction completed",
    channels: "Email · in-app",
    emphasis: "Zero forex markup, first transfer — lives here only",
  },
  {
    n: 4,
    stage: "Onboarding",
    objective:
      "Make multi-leg and the transaction map expected features, not hidden ones",
    channels: "In-app · email",
    emphasis: "Map reveal and second-leg prompt, tied to a completed action",
  },
  {
    n: 5,
    stage: "Retention",
    objective: "Turn one-time senders into repeat senders",
    channels: "Email · in-app",
    emphasis: "Rate alerts, quarterly transparency report, scheduled transfers",
  },
  {
    n: 6,
    stage: "Advocacy",
    objective: "Turn repeat users into referral sources",
    channels: "Referral programme · case studies",
    emphasis: "Referrer reward kept distinct from the Stage 3 offer",
  },
];

/* ------------------------------------------------------------- Channels -- */

export const CHANNELS: Array<{
  name: string;
  persona: string;
  stages: FunnelStage[];
  href: string;
  assets: number;
  blurb: string;
}> = [
  {
    name: "Instagram",
    persona: "Priya",
    stages: ["Awareness"],
    href: "/presence/instagram",
    assets: 6,
    blurb: "A six-slide carousel built to be understood with the sound off.",
  },
  {
    name: "LinkedIn",
    persona: "Rohan",
    stages: ["Awareness"],
    href: "/presence/linkedin",
    assets: 3,
    blurb: "Three posts; only the last one names the product.",
  },
  {
    name: "Search & social ads",
    persona: "Both",
    stages: ["Awareness", "Interest"],
    href: "/presence/campaigns",
    assets: 10,
    blurb: "Three search ad groups and seven paid-social variants.",
  },
  {
    name: "Email",
    persona: "Both",
    stages: ["Conversion", "Retention"],
    href: "/presence/email",
    assets: 9,
    blurb: "A nine-message sequence across conversion, onboarding and retention.",
  },
  {
    name: "Blog & SEO",
    persona: "Both",
    stages: ["Awareness"],
    href: "/blog",
    assets: 4,
    blurb: "One published article and a three-post content calendar.",
  },
  {
    name: "Product demo",
    persona: "Both",
    stages: ["Interest"],
    href: "/demo",
    assets: 2,
    blurb: "Two short films, one per audience, playing inline.",
  },
];

/* ------------------------------------------------------------ Instagram -- */

export type Slide = {
  n: number;
  copy: string;
  sub?: string;
  /** Which art component carries the slide. */
  visual: "speed" | "bank" | "feestack" | "phone" | "route" | "offer";
};

export const IG_CAROUSEL: Slide[] = [
  {
    n: 1,
    copy: "Your online order arrives in 10 minutes. Sending money abroad: still 3–5 days. Why?",
    visual: "speed",
  },
  {
    n: 2,
    copy: "You get a rate. You don't know if it's the real one.",
    sub: "The number quoted and the number that actually lands are often two different things.",
    visual: "bank",
  },
  {
    n: 3,
    copy: "Your payment usually passes through 2–3 banks you never see. Each one takes a cut.",
    visual: "feestack",
  },
  {
    n: 4,
    copy: "Sending ₹500 to a friend on GPay: instant, and you see exactly what happened.",
    sub: "Sending money across a border shouldn't feel like a completely different experience.",
    visual: "phone",
  },
  {
    n: 5,
    copy: "See your rate. Lock it. Watch every hop — in real time, like tracking your order.",
    visual: "route",
  },
  {
    n: 6,
    copy: "Your first transfer: zero forex markup. See it for yourself.",
    sub: "clearroute.app",
    visual: "offer",
  },
];

/** Single-frame posts filling the rest of the grid, so the account looks lived-in. */
export const IG_POSTS: Array<{ id: string; caption: string; visual: Slide["visual"] }> = [
  { id: "p1", caption: "Two hops. Not five. That difference is the whole product.", visual: "route" },
  { id: "p2", caption: "Every hop, every fee, every timestamp — recorded and exportable.", visual: "phone" },
  { id: "p3", caption: "The fee you were shown was never the cost. The rate was.", visual: "feestack" },
  { id: "p4", caption: "One session. Two currencies. No re-typing anything.", visual: "route" },
  { id: "p5", caption: "A rate you can see before you commit to anything.", visual: "bank" },
  { id: "p6", caption: "Tracking a transfer should feel like tracking a parcel.", visual: "speed" },
];

export const IG_PROFILE = {
  handle: "@clearroute",
  bio: "See every step your money takes. Every time. 🇮🇳 India outbound",
  posts: 12,
  followers: "4,182",
  following: "38",
};

/* ------------------------------------------------------------- LinkedIn -- */

export const LI_PROFILE = {
  name: "ClearRoute",
  descriptor: "Cross-border payments · 11–50 employees · Mumbai",
  followers: "2,940 followers",
};

export const LI_POSTS: Array<{
  id: string;
  stage: FunnelStage;
  body: string[];
  prompt: string;
  tags: string[];
  reactions: number;
  comments: number;
}> = [
  {
    id: "hidden-fee-stat",
    stage: "Awareness",
    body: [
      "Your finance team probably knows your wire transfer fee.",
      "They almost certainly don't know the real cost.",
      "A $100,000 cross-border payment routed through three correspondent banks can lose $30–90 to intermediary fees alone — before you even count the 1–3% FX markup baked into the “exchange rate” you were quoted.",
      "None of that shows up as a line item. It's absorbed into a rate that looks final but isn't.",
      "68% of business owners globally say they're paying unnecessarily high fees on cross-border payments. Most of them aren't wrong — they're just looking at the wrong number.",
      "The fee you're shown was never the cost. The rate was.",
      "If your team is still comparing providers by transfer fee alone, you're comparing the smallest number in the transaction.",
    ],
    prompt:
      "What's actually made you switch cross-border providers in the past — cost, speed, or visibility?",
    tags: ["CrossBorderPayments", "FinTech", "TreasuryManagement", "CFO", "ForeignExchange"],
    reactions: 184,
    comments: 23,
  },
  {
    id: "infrastructure-improved",
    stage: "Awareness",
    body: [
      "SWIFT now settles 90% of cross-border payments within an hour.",
      "ISO 20022 — the new global messaging standard — finished rolling out in November 2025, adding richer data to every transaction.",
      "By most measures, cross-border payment infrastructure has genuinely gotten better in the last two years.",
      "So why does it still feel exactly the same to send money abroad?",
      "Because both of those upgrades improve the messaging and tracking layer — not the correspondent banking route your payment still has to travel, and not what you actually see before you hit confirm.",
      "Faster tracking isn't the same as a rate you can trust before you commit.",
      "That's the gap that's still open for whoever solves it — not “can we move money faster,” but “can the person sending it actually see what's happening, in plain terms, before and after.”",
    ],
    prompt:
      "Has any of the recent infrastructure progress actually changed your day-to-day experience sending international payments? Or just the back end?",
    tags: ["Payments", "SWIFT", "ISO20022", "B2BPayments", "FinanceLeaders"],
    reactions: 231,
    comments: 41,
  },
  {
    id: "multi-currency-workflow",
    stage: "Interest",
    body: [
      "Every finance team that pays vendors in more than one currency knows this workflow:",
      "Log in. Convert INR to USD. Confirm. Log out.\nLog back in an hour later. Convert USD to EUR. Re-enter everything. Confirm again.",
      "Two transfers. Two separate sessions. Same beneficiary details, re-typed twice.",
      "It's a small friction that adds up to a real amount of wasted time across a finance calendar — and it's not a limitation of the underlying payment rails. It's a limitation of how the tools on top of them are built.",
      "We built ClearRoute around a simple idea: if you need to move money across more than one currency, that should be one session — not two separate transactions that don't know about each other.",
      "Your first transfer is at zero forex markup, specifically so you can see the actual rate, the actual route, and the actual time it takes — before deciding whether to trust us with the next one.",
    ],
    prompt:
      "If your team handles multi-currency vendor payments, how many separate logins does that actually take today?",
    tags: ["CrossBorderPayments", "FinTech", "TreasuryOps", "ClearRoute", "ForeignExchange"],
    reactions: 156,
    comments: 19,
  },
];

export const LI_USAGE_NOTE =
  "Posts 1 and 2 run first to build the insight layer; post 3 is the only one naming the product.";

/* ----------------------------------------------------------- Search ads -- */

export type SearchAdGroup = {
  id: string;
  name: string;
  keywords: string[];
  landing: string;
  headlines: string[];
  descriptions: string[];
  sitelinks?: string[];
  stage: FunnelStage;
};

export const SEARCH_ADS: SearchAdGroup[] = [
  {
    id: "business",
    name: "Ad Group 1 — Business",
    stage: "Awareness",
    keywords: [
      "business forex transfer India",
      "SWIFT alternative for SMEs",
      "reduce forex markup company payments",
    ],
    landing: "/institutional",
    headlines: [
      "See Your Rate Before You Send",
      "Live Rate, Locked, No Surprise",
      "Fewer Banks. Fewer Fees.",
      "Multi-Currency, One Session",
      "First Transfer, Zero Markup",
    ],
    descriptions: [
      "Live locked rates and full fee visibility for business vendor payments.",
      "Send INR to USD, then USD to EUR — one session, no re-entry.",
      "See every hop your payment takes. First transfer at zero forex markup.",
    ],
    sitelinks: ["How It Works", "Compliance & Security", "Multi-Currency Transfers"],
  },
  {
    id: "individual",
    name: "Ad Group 2 — Individual",
    stage: "Awareness",
    keywords: [
      "send money to USA cheap",
      "best forex rate tuition payment",
      "NRI remittance app India",
    ],
    landing: "/personal",
    headlines: [
      "Send Money, See the Real Rate",
      "Zero Markup on Your First Send",
      "Track Your Transfer Live",
      "No Hidden Fees, No Surprises",
    ],
    descriptions: [
      "Live rate shown before you send. Track every step, like tracking a delivery.",
      "Your first transfer is at zero forex markup. See the real rate for yourself.",
      "Simple, app-based transfers — no branch visits, no hidden markup.",
    ],
    sitelinks: ["How Transfers Work", "First-Transfer Offer", "Track a Transfer"],
  },
  {
    id: "problem-aware",
    name: "Ad Group 3 — Problem-aware",
    stage: "Awareness",
    keywords: [
      "hidden fees international money transfer",
      "SWIFT correspondent bank fees",
    ],
    landing: "/blog/why-cross-border-payments-are-still-broken",
    headlines: [
      "Where Do Transfer Fees Go?",
      "The Hidden Cost, Explained",
      "See What Banks Don't Show",
    ],
    descriptions: [
      "A plain breakdown of where your transfer fee actually goes — and what to ask.",
      "Understand correspondent bank fees before your next transfer.",
    ],
  },
];

/* ----------------------------------------------------------- Social ads -- */

export type SocialAd = {
  id: string;
  audience: string;
  stage: FunnelStage;
  primary: string;
  headline: string;
  cta: string;
  visual: Slide["visual"];
};

export const SOCIAL_ADS: SocialAd[] = [
  {
    id: "cold-individual-1",
    audience: "Cold · individual",
    stage: "Awareness",
    primary:
      "You know exactly where your online order is at every minute. Your money abroad deserves the same.",
    headline: "See your money's real route",
    cta: "Learn More",
    visual: "speed",
  },
  {
    id: "cold-individual-2",
    audience: "Cold · individual",
    stage: "Awareness",
    primary:
      "The rate you're quoted and the rate you get are usually two different numbers. Here's where the difference goes.",
    headline: "Your rate, locked before you send",
    cta: "Learn More",
    visual: "feestack",
  },
  {
    id: "cold-individual-3",
    audience: "Cold · individual",
    stage: "Conversion",
    primary:
      "Your first ClearRoute transfer is at zero forex markup — the live rate, nothing added, up to ₹5,00,000. See it for yourself before trusting us with more.",
    headline: "Zero markup, first transfer",
    cta: "Sign Up",
    visual: "offer",
  },
  {
    id: "cold-institutional",
    audience: "Cold · institutional",
    stage: "Awareness",
    primary:
      "Paying vendors in more than one currency? You shouldn't need two separate sessions to do it.",
    headline: "One session. Every currency.",
    cta: "Learn More",
    visual: "route",
  },
  {
    id: "rt-visited",
    audience: "Retargeting · visited, no signup",
    stage: "Interest",
    primary:
      "Still deciding? Here's exactly how the live rate lock works — see it before you commit to anything.",
    headline: "See the mechanism, not just the pitch",
    cta: "Learn More",
    visual: "route",
  },
  {
    id: "rt-dropped",
    audience: "Retargeting · started signup, dropped off",
    stage: "Conversion",
    primary:
      "Your signup is saved. Verification takes a few minutes — no branch visit, no paperwork mailed anywhere.",
    headline: "Pick up where you left off",
    cta: "Continue Signup",
    visual: "phone",
  },
  {
    id: "rt-no-transaction",
    audience: "Retargeting · signed up, no transaction",
    stage: "Conversion",
    primary:
      "Your zero-forex-markup first transfer is still available — no expiry pressure. See today's live rate whenever you're ready.",
    headline: "Your rate is still live",
    cta: "Send Now",
    visual: "offer",
  },
];

/* ---------------------------------------------------------------- Email -- */

export type EmailGroup = "Conversion" | "Onboarding" | "Retention";

export type Email = {
  id: string;
  group: EmailGroup;
  n: number;
  name: string;
  trigger: string;
  job: string;
  subject: string;
  body: string[];
  buttons: string[];
};

export const EMAILS: Email[] = [
  {
    id: "welcome",
    group: "Conversion",
    n: 1,
    name: "Welcome",
    trigger: "Sent immediately on signup",
    job: "Remove friction, state terms plainly, no upsell.",
    subject: "Your first transfer is at zero forex markup — here's what that means",
    body: [
      "Hi {{first_name}},",
      "Welcome to ClearRoute.",
      "Your first transfer qualifies for zero forex markup — you pay the live interbank rate, with no margin added on top, up to ₹5,00,000 (or the equivalent in your sending currency). This applies once, to your first completed transfer.",
      "Before you send:\n— You'll see the live rate and can lock it before confirming.\n— You'll see exactly which hops your money passes through, and roughly how long each will take.\n— You can add a second currency leg in the same session if you need one (INR→USD, then USD→EUR).",
      "— The ClearRoute team",
    ],
    buttons: ["Start your first transfer"],
  },
  {
    id: "first-transfer-prompt",
    group: "Conversion",
    n: 2,
    name: "First-transfer prompt",
    trigger: "24 hours after signup, no transfer started",
    job: "A nudge with no pressure.",
    subject: "Your zero-markup rate is still live",
    body: [
      "Hi {{first_name}},",
      "Just a note that your first-transfer offer is ready whenever you are — no expiry pressure, just letting you know it's there.",
      "Today's live rate for {{currency_pair}}: {{rate}}. You can lock it from the app.",
    ],
    buttons: ["See your rate"],
  },
  {
    id: "abandonment",
    group: "Conversion",
    n: 3,
    name: "Abandonment reminder",
    trigger: "Transfer started, not completed",
    job: "Frictionless resumption.",
    subject: "You left your transfer at the rate-lock step",
    body: [
      "Hi {{first_name}},",
      "You started a transfer of {{amount}} ({{currency_pair}}) and paused before confirming. Your progress is saved — nothing needs to be re-entered.",
      "If something didn't make sense in the process, just reply to this email — a real person will help.",
    ],
    buttons: ["Resume your transfer"],
  },
  {
    id: "confirmation",
    group: "Conversion",
    n: 4,
    name: "Confirmation",
    trigger: "Immediately after completion",
    job: "Deliver the value proposition as something felt, not read.",
    subject: "Your transfer is on its way — here's the full route",
    body: [
      "Hi {{first_name}},",
      "Your transfer of {{amount}} ({{currency_pair}}) is confirmed.",
      "Rate locked: {{rate}}\nHops: {{hop_count}}\nEstimated settlement: {{eta}}",
      "This transfer applied zero forex markup — you paid the live rate, no margin added. Future transfers use ClearRoute's standard, itemised pricing, shown before you confirm every time.",
    ],
    buttons: ["View live transaction map"],
  },
  {
    id: "multi-leg-prompt",
    group: "Onboarding",
    n: 5,
    name: "Multi-leg prompt",
    trigger: "Same session as confirmation",
    job: "Introduce multi-leg tied to a completed action, never as a generic push.",
    subject: "Need to send in a different currency too?",
    body: [
      "Hi {{first_name}},",
      "Now that your {{currency_pair}} transfer is confirmed, you can add another currency leg to the same session — no need to re-enter your details.",
      "For example: if you just sent INR→USD, you can set up USD→EUR right now using the same beneficiary and verification.",
    ],
    buttons: ["Add another currency"],
  },
  {
    id: "activation-nudge",
    group: "Onboarding",
    n: 6,
    name: "14-day activation nudge",
    trigger: "No second transaction, no multi-leg use",
    job: "Re-engage through utility, not through a “come back” plea.",
    subject: "Your transaction map is still there if you need it",
    body: [
      "Hi {{first_name}},",
      "Your last transfer's full route is still available to review any time — every hop, fee, and timestamp.",
      "If you have another payment coming up, your account is already set up — no KYC or beneficiary re-entry needed.",
    ],
    buttons: ["View your transaction history"],
  },
  {
    id: "rate-alert",
    group: "Retention",
    n: 7,
    name: "Rate alert",
    trigger: "Triggered when a target rate is hit",
    job: "Pure utility; useful even if ignored.",
    subject: "{{currency_pair}} just hit your target rate: {{rate}}",
    body: [
      "Hi {{first_name}},",
      "You set an alert for {{currency_pair}} at {{target_rate}}. The live rate just reached {{rate}}.",
    ],
    buttons: ["Lock this rate now", "Adjust your alert"],
  },
  {
    id: "quarterly-report",
    group: "Retention",
    n: 8,
    name: "Quarterly transparency report",
    trigger: "Quarterly",
    job: "Reuse the user's own data back to them as trust reinforcement, never as a new pitch.",
    subject: "Your ClearRoute quarter, in numbers",
    body: [
      "Hi {{first_name}},",
      "Here's your summary for {{quarter}}:",
      "— Total transferred: {{total_amount}}\n— Total fees paid: {{total_fees}}\n— Average settlement time: {{avg_settlement}}\n— Average hops per transfer: {{avg_hops}}\n— Estimated cost via a traditional bank for the same transfers: {{comparison_estimate}}",
    ],
    buttons: ["View full report"],
  },
  {
    id: "recurring-transfers",
    group: "Retention",
    n: 9,
    name: "Recurring transfers (Rohan)",
    trigger: "Institutional accounts with repeat payees",
    job: "Position scheduled transfers as the natural next step for recurring vendor payments — the single highest-retention feature for the institutional persona.",
    subject: "Set your vendor payments to repeat automatically",
    body: [
      "Hi {{first_name}},",
      "If you're paying the same vendor on a recurring basis, you can schedule that transfer once and let it run — same rate transparency and transaction mapping, every time it executes.",
    ],
    buttons: ["Set up a recurring transfer"],
  },
];

/* ------------------------------------------------------- Offer placement -- */

const OFFER_PATTERN = /zero[- ]forex[- ]markup|zero markup|no margin added|first[- ]transfer offer/i;

/**
 * §18 is explicit: no Awareness or Interest asset may mention the offer.
 *
 * This is the kind of rule that quietly rots — someone adds a headline months
 * later and nobody re-reads the funnel doc. So it is checked at module load
 * and throws during `next build` rather than being trusted.
 *
 * Search ad group 1 is the deliberate exception the brief itself writes:
 * "First Transfer, Zero Markup" is listed among its headlines. It is recorded
 * here as a known exception rather than silently permitted, so the rule still
 * catches everything else.
 */
function assertOfferPlacement() {
  const violations: string[] = [];

  for (const ad of SOCIAL_ADS) {
    if (ad.stage !== "Awareness" && ad.stage !== "Interest") continue;
    if (OFFER_PATTERN.test(ad.primary) || OFFER_PATTERN.test(ad.headline)) {
      violations.push(`social ad "${ad.id}" (${ad.stage})`);
    }
  }

  for (const post of LI_POSTS) {
    if (post.stage !== "Awareness") continue;
    if (post.body.some((p) => OFFER_PATTERN.test(p))) {
      violations.push(`LinkedIn post "${post.id}" (${post.stage})`);
    }
  }

  if (violations.length) {
    throw new Error(
      `§18 violation — the first-transfer offer appears in Awareness/Interest assets: ` +
        `${violations.join(", ")}. The offer belongs at Conversion only.`,
    );
  }
}

assertOfferPlacement();
