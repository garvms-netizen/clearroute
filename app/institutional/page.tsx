import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Institutional" };

export default function Page() {
  return (
    <PageStub
      eyebrow="CROSS-BORDER PAYMENTS · INDIA OUTBOUND"
      title="See every step your money takes. Every time."
      stage="Stage 4"
    />
  );
}
