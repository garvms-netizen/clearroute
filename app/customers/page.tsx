import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Customers" };

export default function Page() {
  return (
    <PageStub
      eyebrow="CUSTOMERS"
      title="Built for two very different people."
      stage="Stage 6"
    />
  );
}
