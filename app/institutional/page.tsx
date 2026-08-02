import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "For businesses — cross-border payments with a visible route",
  description:
    "Vendor payments, subsidiary funding and contractor payouts with live locked rates, minimal intermediaries and an exportable transaction map.",
  keywords: [
    "business forex transfer India",
    "SWIFT alternative for SMEs",
    "reduce forex markup company payments",
    "vendor payment cross border India",
  ],
};

export default function InstitutionalHome() {
  return <HomePage mode="institutional" />;
}
