import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Demo" };

export default function Page() {
  return (
    <PageStub
      eyebrow="PRODUCT DEMO"
      title="Watch a transfer, end to end."
      stage="Stage 5"
    />
  );
}
