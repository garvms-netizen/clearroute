import type { Metadata } from "next";
import { SecurityPage } from "@/components/security/SecurityPage";

export const metadata: Metadata = {
  title: "Security & compliance",
  description:
    "Regulatory posture, how funds are handled, platform security, and what we will never do. Safety here means you can see the path your money takes.",
};

export default function Page() {
  return <SecurityPage />;
}
