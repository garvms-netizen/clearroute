import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Contact" };

export default function Page() {
  return (
    <PageStub
      eyebrow="CONTACT"
      title="Three ways to reach a person."
      stage="Stage 8"
    />
  );
}
