import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What this website collects and why: anonymous events with a per-session identifier, form submissions to a private spreadsheet, no cookies and no third-party trackers.",
};

/**
 * Every claim below is checkable against the source.
 *
 * lib/track.ts holds the session id in sessionStorage and sends no personal
 * data; the built output contains no third-party host; the only outbound
 * request is to the project owner's own Apps Script endpoint, and only when
 * one is configured. A fictional company publishing an inaccurate privacy
 * policy would be modelling exactly the behaviour this project criticises.
 */
const SECTIONS: LegalSection[] = [
  {
    id: "what-this-covers",
    heading: "What this covers",
    paras: [
      "This describes what the Clear Route website does with information. It is written to be accurate about this specific site rather than to be a template — every statement below can be checked against the published source code, which is public.",
      "Clear Route does not process payments, so there is no transaction data, no account and no financial information involved anywhere.",
    ],
  },
  {
    id: "what-we-collect",
    heading: "What is collected",
    paras: [
      "Anonymous interaction counts: which page was viewed, which mode was selected, how far through the demo someone got, which calls-to-action were clicked, and which videos were played. Each event carries a random identifier generated when the tab opens.",
      "If you submit the contact or callback form, the details you type into it — name, company, email, phone number or message — are sent to a private spreadsheet owned by the project author.",
    ],
  },
  {
    id: "what-we-do-not-collect",
    heading: "What is not collected",
    paras: [
      "No cookies are set by this site. No fingerprinting is performed. There are no third-party trackers, no advertising pixels, no analytics platform, and no social media embeds.",
      "The session identifier lives in sessionStorage, which the browser discards when the tab closes. It cannot follow you between visits and is not linked to anything about you.",
      "The published site makes no request to any external host. Fonts are self-hosted, exchange rates are collected when the site is built rather than fetched by your browser, and no content is loaded from a content delivery network.",
    ],
  },
  {
    id: "why",
    heading: "Why any of it is collected",
    paras: [
      "The interaction counts exist so the insights page can show which parts of the campaign a visitor actually engaged with — that page is itself part of the coursework being demonstrated.",
      "Form details exist so a submitted enquiry can be seen at all. They are stored in a private spreadsheet for demonstration purposes only and are not used for any commercial activity, not sold, and not shared.",
    ],
  },
  {
    id: "retention",
    heading: "Retention and deletion",
    paras: [
      "The session identifier is deleted by your browser when you close the tab. Nothing else about your visit persists on your device.",
      "Form submissions remain in the project author's spreadsheet for the duration of the coursework and are deleted afterwards. To have a submission removed sooner, use the contact form and say so.",
    ],
  },
  {
    id: "your-choices",
    heading: "Your choices",
    paras: [
      "Blocking JavaScript, or using a browser that blocks it, prevents interaction events entirely — the site is readable either way, because the content is served as static HTML.",
      "Not submitting a form means no personal information reaches anyone. Nothing on this site requires an account.",
    ],
  },
  {
    id: "contact",
    heading: "Questions",
    paras: [
      "Questions about this document, or a request to delete something you submitted, can go through the contact form. Clear Route is fictional, so there is no data protection officer and no regulator to escalate to — a real deployment would name both here.",
    ],
  },
];

export default function Page() {
  return (
    <LegalPage
      eyebrow="LEGAL · PRIVACY"
      title="What this site collects, and what it doesn't."
      lede="Short, and accurate about this specific website rather than copied from a template."
      updated="3 August 2026"
      sections={SECTIONS}
    />
  );
}
