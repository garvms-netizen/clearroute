import type { Metadata } from "next";
import { InstagramPreview } from "@/components/presence/InstagramPreview";

export const metadata: Metadata = {
  title: "Instagram — concept preview",
  description:
    "A six-slide awareness carousel aimed at people sending money themselves, argued from a familiar experience rather than product features.",
};

export default function Page() {
  return <InstagramPreview />;
}
