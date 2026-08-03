import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Illustrative terms for a fictional company created as an academic marketing project. They carry no legal force.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "what-this-is",
    heading: "What this document is",
    paras: [
      "These terms are written in the shape a real cross-border payment provider's terms would take, as part of a university marketing project. They are illustrative. They create no rights, no obligations and no agreement between anyone.",
      "Clear Route is not a company. It is not registered, licensed or regulated anywhere, and it does not hold, move or convert money.",
    ],
  },
  {
    id: "no-service",
    heading: "There is no service",
    paras: [
      "Nothing on this website can send money. The interactive demo is a walkthrough that computes figures from published market rates; confirming a transfer in it debits nothing, because there is nothing to debit and no account to debit it from.",
      "Rates shown are real published market data, but the transfers, timestamps, institution names and settlement windows around them are illustrative.",
    ],
  },
  {
    id: "do-not-send-information",
    heading: "Do not submit sensitive information",
    paras: [
      "Do not enter card numbers, bank account details, passwords, one-time codes, government identity numbers or any other sensitive financial information into this site. Nothing here is built to receive them, and no page asks for them.",
      "The contact and callback forms ask only for a name, an email address, and — for callbacks — a company and phone number. Those go to a private spreadsheet owned by the project author.",
    ],
  },
  {
    id: "the-offer",
    heading: "About the first-transfer offer",
    paras: [
      "The zero-forex-markup first transfer described across this site is campaign copy for a product that does not exist. It cannot be claimed, redeemed or relied on.",
      "Where it appears, its terms are stated in full rather than behind an asterisk, because that is the standard the project is arguing for — not because there is an offer to honour.",
    ],
  },
  {
    id: "accuracy",
    heading: "Accuracy of the content",
    paras: [
      "Industry figures quoted in the blog article are drawn from the published sources listed at the foot of it. They were accurate to those sources when written and are not maintained.",
      "Testimonials, case studies, team members and the company timeline are written personas and scenarios. They are labelled as illustrative wherever they appear, and none of them describe real people or real engagements.",
    ],
  },
  {
    id: "intellectual-property",
    heading: "Third-party names and marks",
    paras: [
      "The presence pages preview how campaign assets would appear on social and search platforms. They reproduce no platform's logo, icon set or interface; the frames are drawn in this project's own palette and imply no association with, or endorsement by, any platform.",
      "Where a third-party product is named in campaign copy, it is named as a point of comparison only and never depicted.",
    ],
  },
  {
    id: "changes",
    heading: "Changes",
    paras: [
      "This site is coursework and changes as the coursework does. There is no notice period and no versioning, because there is nothing being relied upon.",
    ],
  },
];

export default function Page() {
  return (
    <LegalPage
      eyebrow="LEGAL · TERMS"
      title="Terms of service"
      lede="Written in the shape real terms would take, for a company that does not exist."
      updated="3 August 2026"
      sections={SECTIONS}
    />
  );
}
