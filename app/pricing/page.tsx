import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing/PricingPage";

export const metadata: Metadata = {
  title: "Pricing — one margin, shown before every transfer",
  description:
    "A flat 0.40% margin shown separately from the exchange rate, network and correspondent fees absorbed, and the live interbank rate locked at confirmation. Fully visible without signing up.",
};

export default function Page() {
  return <PricingPage />;
}
