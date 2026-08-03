/**
 * Canonical copy.
 *
 * Anything stated in more than one place lives here, so the wording cannot
 * drift between pages. Pull from this file rather than paraphrasing.
 */

/**
 * The first-transfer offer, §1.4.
 *
 * Stated in full at every mention, never with an asterisk pointing elsewhere.
 * No countdown, no expiry, no urgency language — anywhere in this project.
 */
export const OFFER_TERMS =
  "First transfer, zero forex markup. You pay the live interbank rate with no " +
  "margin added on top, up to ₹5,00,000 or currency equivalent. Applies once, " +
  "to your first completed transfer, per verified account. Standard itemised " +
  "pricing applies afterward and is always shown before you confirm.";

export const OFFER_HEADLINE = "First transfer, zero forex markup.";

export const OFFER_NO_PRESSURE = "No countdown. No expiry. It's there when you're ready.";

/** Taglines, §23.7. */
export const TAGLINE = "See every step. Every time.";
export const TAGLINE_MAPPING = "Every hop. Every hour. Every rupee accounted for.";
export const TAGLINE_MULTILEG = "One route, every currency.";

/** The 15-second pitch — used as the fork sub-head and the social bio. */
export const PITCH_15 =
  "Cross-border payments with nothing hidden — live rates, minimal " +
  "intermediaries, full transaction tracking, and multi-currency transfers in " +
  "one session.";

/** The shared H1. The same sentence opens the fork and the institutional home. */
export const H1_SHARED = "See every step your money takes. Every time.";

/** The illustrative-testimonials banner, §12. Non-negotiable, not buried. */
export const TESTIMONIAL_DISCLOSURE =
  "Illustrative testimonials. Clear Route is a fictional company built for an " +
  "academic marketing project. The reviews below are written personas " +
  "representing the target customers this campaign was designed for — they are " +
  "not real customer feedback.";

/**
 * The demo-page data note, §21.
 *
 * §21 names frankfurter.app as the source. That host fails CORS from a
 * browser, and the site now uses Yahoo Finance daily closes fetched at build
 * time instead — so the wording follows the actual source. A disclosure that
 * names the wrong provider is worse than no disclosure.
 */
export const DEMO_DATA_NOTE =
  "Rates, timestamps and institution names shown are illustrative. Exchange " +
  "rates are daily closes from Yahoo Finance, captured when this site was " +
  "last built, and update once per trading day rather than continuously.";

/** The legal-pages banner, §16.5. */
export const LEGAL_BANNER =
  "This is a fictional company created for an academic project. These documents " +
  "are illustrative and carry no legal force.";
