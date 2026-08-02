import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Faq" };

export default function Page() {
  return (
    <PageStub
      eyebrow="FAQ"
      title="Questions worth asking before you send money anywhere."
      stage="Stage 8"
    />
  );
}
