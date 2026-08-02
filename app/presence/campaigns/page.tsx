import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Campaigns" };

export default function Page() {
  return (
    <PageStub
      eyebrow="OUR PRESENCE · ADS"
      title="Concept preview: search & social ads"
      stage="Stage 7"
    />
  );
}
