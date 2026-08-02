import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Email" };

export default function Page() {
  return (
    <PageStub
      eyebrow="OUR PRESENCE · EMAIL"
      title="Concept preview: the email sequence"
      stage="Stage 7"
    />
  );
}
