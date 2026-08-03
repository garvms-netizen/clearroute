import type { Metadata } from "next";
import { EmailPreview } from "@/components/presence/EmailPreview";

export const metadata: Metadata = {
  title: "Email sequence — concept preview",
  description:
    "Nine messages across conversion, onboarding and retention, each stating what triggers it and what job it does.",
};

export default function Page() {
  return <EmailPreview />;
}
