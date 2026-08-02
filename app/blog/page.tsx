import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Blog" };

export default function Page() {
  return (
    <PageStub
      eyebrow="RESOURCES"
      title="Writing about how cross-border payments actually work."
      stage="Stage 8"
    />
  );
}
