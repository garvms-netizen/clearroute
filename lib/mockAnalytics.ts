/**
 * Illustrative campaign figures for /insights.
 *
 * This campaign was never run, so these numbers are invented — and the page
 * says so, in a panel that cannot be confused with the live half beside it.
 *
 * They are shaped to be realistic rather than flattering: click-through rates
 * in the low single digits, a conversion funnel that loses most of its volume
 * between awareness and interest, and a KYC drop-off large enough to be worth
 * fixing. Round, obviously-fake numbers would make the analysis look like
 * decoration; numbers that all point the right way would make it look like
 * wishful thinking.
 */

export type FunnelPoint = {
  stage: string;
  users: number;
  /** Percentage of the previous stage that made it here. */
  conversion: number;
};

export const FUNNEL_DATA: FunnelPoint[] = [
  { stage: "Awareness", users: 48_210, conversion: 100 },
  { stage: "Interest", users: 7_940, conversion: 16.5 },
  { stage: "Conversion", users: 1_186, conversion: 14.9 },
  { stage: "Onboarding", users: 742, conversion: 62.6 },
  { stage: "Retention", users: 401, conversion: 54.0 },
  { stage: "Advocacy", users: 88, conversion: 21.9 },
];

export type WeeklyPoint = {
  week: string;
  institutional: number;
  personal: number;
};

export const WEEKLY_TRAFFIC: WeeklyPoint[] = [
  { week: "W1", institutional: 610, personal: 1_240 },
  { week: "W2", institutional: 745, personal: 1_690 },
  { week: "W3", institutional: 902, personal: 2_110 },
  { week: "W4", institutional: 1_180, personal: 2_460 },
  { week: "W5", institutional: 1_364, personal: 3_020 },
  { week: "W6", institutional: 1_612, personal: 3_380 },
  { week: "W7", institutional: 1_509, personal: 3_190 },
  { week: "W8", institutional: 1_847, personal: 3_940 },
];

export type ChannelRow = {
  channel: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpcInr: number;
  persona: string;
};

export const CHANNEL_ATTRIBUTION: ChannelRow[] = [
  { channel: "Search — problem-aware", impressions: 184_300, clicks: 6_240, ctr: 3.39, cpcInr: 31, persona: "Both" },
  { channel: "Search — business", impressions: 96_400, clicks: 2_180, ctr: 2.26, cpcInr: 74, persona: "Rohan" },
  { channel: "Search — individual", impressions: 212_800, clicks: 5_910, ctr: 2.78, cpcInr: 27, persona: "Priya" },
  { channel: "Meta — cold, individual", impressions: 604_200, clicks: 8_470, ctr: 1.4, cpcInr: 19, persona: "Priya" },
  { channel: "LinkedIn — cold, business", impressions: 141_700, clicks: 1_390, ctr: 0.98, cpcInr: 118, persona: "Rohan" },
  { channel: "Instagram — organic", impressions: 88_900, clicks: 3_020, ctr: 3.4, cpcInr: 0, persona: "Priya" },
  { channel: "Blog / SEO", impressions: 61_400, clicks: 4_180, ctr: 6.81, cpcInr: 0, persona: "Both" },
];

export type CtaRow = {
  cta: string;
  page: string;
  views: number;
  clicks: number;
  rate: number;
};

export const CTA_PERFORMANCE: CtaRow[] = [
  { cta: "See how a transfer works", page: "/institutional", views: 9_410, clicks: 2_180, rate: 23.2 },
  { cta: "Request a callback", page: "/institutional", views: 9_410, clicks: 604, rate: 6.4 },
  { cta: "See how it works", page: "/personal", views: 18_240, clicks: 5_390, rate: 29.5 },
  { cta: "Get the app", page: "/personal", views: 18_240, clicks: 1_610, rate: 8.8 },
  { cta: "Try the interactive demo", page: "/demo", views: 4_120, clicks: 1_490, rate: 36.2 },
  { cta: "Read the full breakdown", page: "/institutional", views: 9_410, clicks: 812, rate: 8.6 },
];

/** Where signups stall, for the Conversion-stage commentary. */
export const DROP_OFF = [
  { point: "Reached rate lock", share: 100 },
  { point: "Started KYC", share: 71 },
  { point: "Completed KYC", share: 44 },
  { point: "Confirmed first transfer", share: 38 },
];

export const MOCK_NOTE =
  "Illustrative campaign data — this campaign was not run live. Figures are " +
  "modelled to be realistic rather than flattering, and none of them describe " +
  "actual spend, reach or customers.";
