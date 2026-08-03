import type { Metadata } from "next";
import { FaqPage } from "@/components/faq/FaqPage";

export const metadata: Metadata = {
  title: "FAQ — rates, fees, transfers, security",
  description:
    "Answers on how the rate is set, what a transfer costs, how tracking works, what happens if a payment is held, and what this site collects.",
};

export default function Page() {
  return <FaqPage />;
}
