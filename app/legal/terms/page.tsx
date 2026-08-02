import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Terms" };

export default function Page() {
  return (
    <PageStub
      eyebrow="LEGAL"
      title="Terms of service"
      stage="Stage 8"
    />
  );
}
