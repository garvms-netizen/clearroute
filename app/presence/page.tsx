import type { Metadata } from "next";
import { PresenceIndex } from "@/components/presence/PresenceIndex";

export const metadata: Metadata = {
  title: "Our presence — one campaign, every channel",
  description:
    "Concept previews of the Clear Route campaign across Instagram, LinkedIn, search and social ads, email, blog and product demo — built from the same two audiences and the same five claims.",
};

export default function Page() {
  return <PresenceIndex />;
}
