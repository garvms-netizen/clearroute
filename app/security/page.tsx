import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Security" };

export default function Page() {
  return (
    <PageStub
      eyebrow="SECURITY & COMPLIANCE"
      title="Safety here means you can see the path."
      stage="Stage 5"
    />
  );
}
