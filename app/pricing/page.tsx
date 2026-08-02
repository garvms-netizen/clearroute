import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Pricing" };

export default function Page() {
  return (
    <PageStub
      eyebrow="PRICING"
      title="One margin, shown before every transfer."
      stage="Stage 5"
    />
  );
}
