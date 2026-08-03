import type { Metadata } from "next";
import { LinkedInPreview } from "@/components/presence/LinkedInPreview";

export const metadata: Metadata = {
  title: "LinkedIn — concept preview",
  description:
    "Three posts aimed at finance teams. Two build the insight layer; only the third names the product.",
};

export default function Page() {
  return <LinkedInPreview />;
}
