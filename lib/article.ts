/**
 * The published article, §23.1 — rendered verbatim.
 *
 * Structured as blocks rather than a markdown string so the table of contents
 * can be generated from the section headings instead of parsed back out of
 * prose, and so figures can be marked up in mono without a markdown extension.
 *
 * The text itself is not edited anywhere. §23 is final copy.
 */

export type Block =
  | { t: "p"; text: string }
  | { t: "ul"; items: Array<{ lead?: string; text: string }> }
  | { t: "h3"; text: string };

export type Section = { id: string; heading: string; blocks: Block[] };

export const ARTICLE = {
  slug: "why-cross-border-payments-are-still-broken",
  title: "Why Cross-Border Payments Are Still Broken — Even in 2026",
  metaTitle: "Why Cross-Border Payments Are Still Broken in 2026",
  metaDescription:
    "Cross-border payments move $150 trillion a year, yet remain slow, costly, and opaque. Here's why — and what a genuinely transparent alternative looks like.",
  readingTime: "8 min read",

  intro: [
    "If you've ever sent money abroad — for a vendor payment, a tuition fee, or a family member overseas — you've probably felt it: you don't actually know what it's going to cost, and you don't know when it will arrive. That's not a personal failure to read the fine print. It's how the system is built.",
    "Cross-border payments move over $150 trillion a year, yet despite decades of technological advancement, sending money internationally remains expensive, slow, and opaque. That gap — between how much money moves through this system and how badly it still serves the people sending it — is the actual story of this industry.",
  ],

  sections: [
    {
      id: "how-inefficient",
      heading: "Just how inefficient is it, really?",
      blocks: [
        { t: "p", text: "The numbers are more stark than most people expect." },
        {
          t: "p",
          text: "The World Bank found that sending USD 200 internationally cost 6.2–6.4% on average in 2023 — more than double the 3% target set by the UN's Sustainable Development Goals (a target the G20 has separately endorsed, though the G20's own targets focus on payment speed, not cost). Costs aren't evenly distributed either: fees into Sub-Saharan Africa were the highest of any region, at roughly 8%, while South Asia and East Asia & Pacific were actually among the cheapest corridors globally, at around 5.8%. That's a useful data point in itself — it means the visible remittance fee for a corridor like India isn't where most of the hidden cost lives. The real gap is the invisible FX markup layered into the “exchange rate,” which the visible fee figure doesn't capture at all. Some individual corridors are worse still — regulators have flagged specific country pairs where fees run past 50%.",
        },
        {
          t: "p",
          text: "For businesses, the picture is just as rough. Average cross-border B2B payments take two to five business days to settle, and corridors involving emerging markets or multiple currency conversions can stretch to weeks. A company processing 500 international payments a month can end up spending $50,000 to $150,000 a year on cross-border payment fees alone — most of it never itemized as a single line the business can actually see.",
        },
        {
          t: "p",
          text: "This isn't a fringe complaint. Roughly 68% of business owners globally report paying unnecessarily high fees on their cross-border payments.",
        },
      ],
    },
    {
      id: "where-money-goes",
      heading: "Where the money actually goes (and why nobody shows you)",
      blocks: [
        {
          t: "p",
          text: "The core problem isn't any single fee — it's that the real cost is split across several invisible layers, stacked on top of each other:",
        },
        {
          t: "ul",
          items: [
            {
              lead: "FX markup:",
              text: "Banks typically add a 1–3% spread to the exchange rate they quote, which on a $100,000 payment alone works out to $1,000–3,000 in cost that never appears as a line-item fee.",
            },
            {
              lead: "Correspondent bank fees:",
              text: "Each intermediary bank in the chain extracts roughly $10–30 per transaction, so a payment routed through three correspondent banks can lose $30–90 before it even arrives.",
            },
            {
              lead: "Lifting fees:",
              text: "some receiving banks charge an additional fee simply to move an incoming international payment into the recipient's local account.",
            },
            {
              lead: "Failure and investigation costs:",
              text: "incorrect details or compliance holds can trigger reprocessing fees on top of everything else.",
            },
          ],
        },
        {
          t: "p",
          text: "None of this is disclosed as a single number up front. The “exchange rate” quoted to a customer is usually where most of this cost is quietly absorbed — which is precisely why two providers can both claim “no transfer fee” and still cost wildly different amounts.",
        },
      ],
    },
    {
      id: "industry-improved",
      heading:
        "The industry has genuinely improved. It just hasn't fixed the actual problem.",
      blocks: [
        {
          t: "p",
          text: "To be fair to the industry: this isn't a story of total stagnation. Real infrastructure progress has happened, and it matters.",
        },
        {
          t: "p",
          text: "**SWIFT gpi and ISO 20022.** SWIFT's own network data shows 90% of cross-border payments now reach the beneficiary's bank within an hour — a real improvement in tracking and speed over the traditional wire transfer, though “reaching the bank” and “landing in the recipient's account” aren't the same moment, since local processing at the receiving end can still add delay. The global migration to ISO 20022 — a richer, more structured messaging standard — officially completed for cross-border payments on November 22, 2025, replacing decades-old message formats with something that carries far more data per transaction.",
        },
        {
          t: "p",
          text: "**Domestic instant-payment rails are raising expectations.** Systems like India's UPI, Brazil's Pix, and the UK's Faster Payments weren't built to replace SWIFT, and mostly operate within national borders — but their success has reshaped what people expect from payment speed and accessibility everywhere. Some of these systems are now being bilaterally linked — Singapore's PayNow and Thailand's PromptPay, for instance — creating small regional corridors that skip the traditional chain entirely.",
        },
        {
          t: "p",
          text: "**Stablecoins and alternative rails are scaling fast.** Stablecoin transaction volume hit $33 trillion in 2025, a 72% jump over the year before, as businesses look for settlement that doesn't depend on the correspondent banking chain at all.",
        },
        {
          t: "p",
          text: "Here's the catch: **almost none of this progress reaches the actual customer as visible, usable improvement.**",
        },
        {
          t: "p",
          text: "SWIFT gpi's core limitation is that it improves messaging and tracking around a payment without replacing the correspondent banking route the payment still has to travel — so the underlying fee stack described above doesn't go away, it just gets reported more accurately. Instant domestic rails don't extend across most international corridors yet. Stablecoin settlement is real, but it's still largely infrastructure-layer — most end users, whether a finance manager or someone paying tuition abroad, never interact with it directly, and it does nothing for the two problems that actually matter to them: can I see the real rate before I commit, and can I see where my money is right now.",
        },
      ],
    },
    {
      id: "what-it-means",
      heading: "What this actually means if you're the one sending the money",
      blocks: [
        {
          t: "p",
          text: "Strip away the industry jargon, and two problems remain completely unsolved for the end user, regardless of how much backend infrastructure has improved:",
        },
        {
          t: "ul",
          items: [
            {
              lead: "You still don't see the true cost before you commit.",
              text: "The rate quoted and the rate applied are still, in practice, two different numbers for most providers — the improvements above make the transaction faster and better-tracked, not more transparent about price.",
            },
            {
              lead: "You still can't move money across more than one currency pair without starting over.",
              text: "Need to convert INR to USD for one payment, then USD to EUR for another? Every mainstream option — bank or fintech — treats that as two separate, manually re-entered transactions, even though the underlying rails increasingly support it.",
            },
          ],
        },
        {
          t: "p",
          text: "This is the actual gap in the market. Not “is there a fast payment rail” — there increasingly is — but “does anything let the end user see it, trust it, and use it without repeating themselves.”",
        },
      ],
    },
    {
      id: "where-clearroute-fits",
      heading: "Where Clear Route fits",
      blocks: [
        {
          t: "p",
          text: "This is the exact gap Clear Route is built to close — not by inventing new payment rails, but by making the experience around cross-border payments radically clearer than what the improved infrastructure currently allows:",
        },
        {
          t: "ul",
          items: [
            {
              lead: "A live, lockable rate shown before you confirm",
              text: "— so the rate you see is the rate you get, not a number that shifts once the correspondent chain has taken its cut.",
            },
            {
              lead: "Minimal intermediaries by design,",
              text: "with an end-to-end transaction map showing every hop, fee, and timestamp — turning “trust us, it's on the way” into something you can actually see.",
            },
            {
              lead: "One session, multiple currencies",
              text: "— set up an INR→USD transfer and a USD→EUR transfer without re-entering your details twice, closing the exact multi-leg gap described above.",
            },
            {
              lead: "Your first transaction at zero forex markup",
              text: "— so you can verify all of this yourself, on a real transfer, before deciding whether to trust Clear Route with more.",
            },
          ],
        },
        {
          t: "p",
          text: "The cross-border payments industry has spent the last few years building faster pipes. Clear Route is built on the belief that speed without visibility isn't actually the fix — and that the next real advancement in this category is letting the person sending the money see exactly what's happening to it, every time.",
        },
      ],
    },
    {
      id: "faq",
      heading: "FAQ",
      blocks: [
        { t: "h3", text: "Why are cross-border payments still so expensive if the technology has improved?" },
        {
          t: "p",
          text: "Because most recent advancements — SWIFT gpi, ISO 20022 — improve the messaging and tracking layer around a payment, not the underlying correspondent banking structure the money still travels through. The fee stack (FX markup, per-bank intermediary fees, lifting fees) is largely unchanged even as tracking gets better.",
        },
        { t: "h3", text: "What's the difference between a wire transfer fee and the real cost of a transfer?" },
        {
          t: "p",
          text: "The published transfer fee is usually just one visible piece. The larger, hidden cost is typically the FX markup baked into the exchange rate itself, plus fees taken by each correspondent bank the payment passes through.",
        },
        { t: "h3", text: "Can I transfer between more than two currencies in one go?" },
        {
          t: "p",
          text: "With most banks and fintech apps, no — each currency pair is treated as a separate transaction requiring you to re-enter your details. Clear Route is built specifically to support multi-leg, multi-currency transfers in a single session.",
        },
      ],
    },
  ] satisfies Section[],

  sources:
    "Sources referenced: World Bank Migration and Development Brief (2023–24), World Bank Remittance Prices Worldwide database, Swift network data and press releases (2024–2025), Swift/ISO 20022 migration announcements, Bloomberg/Artemis Analytics stablecoin data (Jan 2026).",
};
