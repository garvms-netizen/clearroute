import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "About" };

export default function Page() {
  return (
    <PageStub
      eyebrow="COMPANY"
      title="We started with one question: where does the money actually go?"
      stage="Stage 8"
    />
  );
}
