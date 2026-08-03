import type { Metadata } from "next";
import { InteractiveDemo } from "@/components/demo/InteractiveDemo";

export const metadata: Metadata = {
  title: "How a transfer works",
  description:
    "Walk through a real transfer: see the rate before you send, lock it, add a second currency in the same session, and track every hop until it arrives.",
};

export default function Page() {
  return <InteractiveDemo mode="personal" />;
}
