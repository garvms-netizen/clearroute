import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Insights" };

export default function Page() {
  return (
    <PageStub
      eyebrow="INSIGHTS"
      title="Campaign analytics."
      stage="Stage 9"
    />
  );
}
