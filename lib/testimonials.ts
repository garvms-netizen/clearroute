import type { Mode } from "./mode";

/**
 * Testimonial content, §12.2.
 *
 * Every one of these is a written persona, not a real customer. The site
 * labels them as illustrative wherever they appear — prominently on
 * /customers and in a note beside the home page set. Fabricated reviews
 * presented as real are an ethical problem anywhere and a regulatory one in
 * financial services; labelling them costs nothing.
 */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  context: string;
  corridor: string;
  /** A small mono figure, consistent with the numbers used elsewhere. */
  stat: string;
  audience: Mode;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The rate we were quoted was the rate we got. That sounds like it should be normal. In eight years of vendor payments it hasn't been.",
    name: "Anita Deshpande",
    role: "Finance Manager",
    context: "mid-market textiles exporter, Mumbai",
    corridor: "INR→USD",
    stat: "~4 hrs settlement",
    audience: "institutional",
  },
  {
    quote:
      "I stopped chasing our RM for status updates. The route map tells me where the money is, and I forward it straight to our auditor.",
    name: "Rohan Mehta",
    role: "Head of Treasury",
    context: "IT services firm, Pune",
    corridor: "INR→USD→EUR",
    stat: "3 hops",
    audience: "institutional",
  },
  {
    quote:
      "Two currency legs in one session. That's a small thing that saves my team an afternoon every month.",
    name: "Vikram Shah",
    role: "Director",
    context: "import-export trading firm, Ahmedabad",
    corridor: "INR→USD, USD→EUR",
    stat: "2 legs, 1 session",
    audience: "institutional",
  },
  {
    quote:
      "We tested it with the zero-markup first transfer on a real vendor payment. That was the point at which the finance committee stopped objecting.",
    name: "Meera Krishnan",
    role: "CFO",
    context: "engineering components manufacturer, Bangalore",
    corridor: "INR→EUR",
    stat: "₹0 markup",
    audience: "institutional",
  },
  {
    quote:
      "I was sending my son's first semester fee. I refreshed the tracking page about twenty times. Being able to see where it actually was made the whole day easier.",
    name: "Priya Nair",
    role: "parent",
    context: "Kochi",
    corridor: "INR→USD",
    stat: "Tuition payment",
    audience: "personal",
  },
  {
    quote:
      "As a freelancer I lost 3–4% to my bank on every invoice without ever seeing it as a fee. Seeing the rate before I send changed how much I actually keep.",
    name: "Arjun Menon",
    role: "product designer",
    context: "Bangalore",
    corridor: "USD→INR",
    stat: "Freelance income",
    audience: "personal",
  },
  {
    quote:
      "My parents send money for my rent. They're not technical. They understood the tracking screen immediately — it looks like tracking a delivery.",
    name: "Sneha Iyer",
    role: "postgraduate student",
    context: "Berlin",
    corridor: "INR→EUR",
    stat: "Monthly support",
    audience: "personal",
  },
];

export const testimonialsFor = (mode: Mode, limit?: number) => {
  const list = TESTIMONIALS.filter((t) => t.audience === mode);
  return limit ? list.slice(0, limit) : list;
};

/**
 * The trust row, §8.6 and §12.1. Illustrative product figures, consistent
 * with the worked example on /pricing and in the demo.
 */
export const TRUST_ROW: Array<{ figure: string; label: string }> = [
  { figure: "₹0", label: "markup on first transfer" },
  { figure: "2–3", label: "hops typical" },
  { figure: "40+", label: "currency corridors" },
  { figure: "~4 hrs", label: "average settlement" },
];

/**
 * Case studies, §12.3. Each is labelled an illustrative scenario wherever it
 * renders — these describe how the product is designed to be used, not
 * engagements that happened.
 */
export type CaseStudy = {
  id: string;
  title: string;
  situation: string;
  change: string;
  outcome: string;
  audience: Mode;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "import-export-ahmedabad",
    title: "Import-export SME, Ahmedabad",
    situation:
      "Forty vendor payments a month across USD and EUR, each set up as its own transaction.",
    change:
      "Consolidated into multi-leg sessions, so a USD and a EUR payment to the same schedule are arranged together.",
    outcome: "Settlement moved from 2–5 days to same-day.",
    audience: "institutional",
  },
  {
    id: "it-services-pune",
    title: "IT services firm, Pune",
    situation:
      "Recurring contractor payouts, reconciled by hand against bank statements at month end.",
    change:
      "Scheduled transfers plus exportable transaction maps, so each payment arrives with its own itemised route.",
    outcome: "Month-end reconciliation time cut substantially.",
    audience: "institutional",
  },
  {
    id: "student-family-kochi-berlin",
    title: "Postgraduate student family, Kochi → Berlin",
    situation:
      "Termly tuition and monthly support, sent whenever the deadline demanded it.",
    change:
      "Rate alerts on the corridor they use, so transfers could be timed rather than forced.",
    outcome: "They choose when to send instead of accepting whatever the day gave them.",
    audience: "personal",
  },
];
