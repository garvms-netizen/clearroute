import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Who Its For" };

export default function Page() {
  return (
    <PageStub
      eyebrow="WHO IT'S FOR"
      title="Built for the person who signs off on the payment."
      stage="Stage 6"
    />
  );
}
