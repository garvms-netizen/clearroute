import type { Metadata } from "next";
import { CallbackForm } from "@/components/forms/CallbackForm";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Request a callback",
  description:
    "Tell us where you send money and we'll walk you through the route, the rate and the settlement timeline for your specific corridors.",
};

export default function Page() {
  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="REQUEST A CALLBACK"
          level={1}
          title="Tell us where you send money."
          lede="If you're handling vendor payments, subsidiary funding or contractor payouts, a short call is usually faster than a signup form. We'll walk you through the route, the rate and the settlement timeline for your specific corridors."
        />
      </div>
      <CallbackForm />
    </>
  );
}
