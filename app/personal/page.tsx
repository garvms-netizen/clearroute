import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "Send money abroad and watch every step",
  description:
    "See the real rate before you send. Track your transfer like a parcel, from your bank to theirs. First transfer at zero forex markup.",
  keywords: [
    "send money to USA cheap",
    "best forex rate tuition payment",
    "NRI remittance app India",
    "freelancer payment international low fees",
  ],
};

export default function PersonalHome() {
  return <HomePage mode="personal" />;
}
