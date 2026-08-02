import type { Metadata } from "next";
import { EntryFork } from "@/components/fork/EntryFork";

export const metadata: Metadata = {
  title: "ClearRoute — See every step your money takes. Every time.",
  description:
    "Cross-border payments with nothing hidden — live rates, minimal intermediaries, full transaction tracking, and multi-currency transfers in one session.",
};

export default function Home() {
  return <EntryFork />;
}
