/**
 * The blog index, §17.
 *
 * One post is written; three are planned. The planned ones render as visibly
 * disabled cards marked PLANNED — showing the content calendar is part of
 * demonstrating the SEO strategy, and pretending they exist would be worse
 * than admitting they aren't written.
 */

export type Post = {
  slug: string;
  title: string;
  status: "published" | "planned";
  /** Which persona the post targets. */
  persona: "Rohan" | "Priya" | "Both";
  /** The keyword cluster it is written against (§23.8). */
  keywords: string[];
  readingTime: string;
  metaTitle?: string;
  metaDescription?: string;
};

export const POSTS: Post[] = [
  {
    slug: "why-cross-border-payments-are-still-broken",
    title: "Why Cross-Border Payments Are Still Broken — Even in 2026",
    status: "published",
    persona: "Both",
    keywords: [
      "hidden fees international money transfer",
      "SWIFT correspondent bank fees",
      "correspondent bank fees explained",
    ],
    readingTime: "8 min read",
    metaTitle: "Why Cross-Border Payments Are Still Broken in 2026",
    metaDescription:
      "Cross-border payments move $150 trillion a year, yet remain slow, costly, and opaque. Here's why — and what a genuinely transparent alternative looks like.",
  },
  {
    slug: "real-cost-of-a-business-forex-transfer-in-india",
    title:
      "The Real Cost of a Business Forex Transfer in India (And How to Read a Rate Quote)",
    status: "planned",
    persona: "Rohan",
    keywords: [
      "business forex transfer India",
      "reduce forex markup company payments",
      "best forex rates for business payments",
    ],
    readingTime: "9 min read",
  },
  {
    slug: "sending-tuition-money-abroad-without-hidden-markups",
    title: "Sending Tuition Money Abroad Without Losing 3–4% to Hidden Markups",
    status: "planned",
    persona: "Priya",
    keywords: [
      "best forex rate tuition payment",
      "send money to USA cheap",
      "NRI remittance app India",
    ],
    readingTime: "7 min read",
  },
  {
    slug: "multi-currency-vendor-payments",
    title:
      "Multi-Currency Vendor Payments: Why Businesses Restart the Process for Every Leg",
    status: "planned",
    persona: "Rohan",
    keywords: [
      "vendor payment cross border India",
      "SWIFT alternative for SMEs",
    ],
    readingTime: "6 min read",
  },
];

export const publishedSlugs = () =>
  POSTS.filter((p) => p.status === "published").map((p) => p.slug);
