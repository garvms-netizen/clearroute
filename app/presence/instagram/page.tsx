import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Instagram" };

export default function Page() {
  return (
    <PageStub
      eyebrow="OUR PRESENCE · INSTAGRAM"
      title="Concept preview: Instagram"
      stage="Stage 7"
    />
  );
}
