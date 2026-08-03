import type { Metadata } from "next";
import { InteractiveDemo } from "@/components/demo/InteractiveDemo";

export const metadata: Metadata = {
  title: "How a transfer works — for businesses",
  description:
    "A worked cross-border transfer end to end: live locked rate, itemised margin, multi-leg in one session, and the full transaction map with every hop and timestamp.",
};

export default function Page() {
  return <InteractiveDemo mode="institutional" />;
}
