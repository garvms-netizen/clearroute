import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Linkedin" };

export default function Page() {
  return (
    <PageStub
      eyebrow="OUR PRESENCE · LINKEDIN"
      title="Concept preview: LinkedIn"
      stage="Stage 7"
    />
  );
}
