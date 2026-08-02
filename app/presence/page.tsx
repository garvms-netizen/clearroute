import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Presence" };

export default function Page() {
  return (
    <PageStub
      eyebrow="OUR PRESENCE"
      title="One campaign. Every channel. One argument."
      stage="Stage 7"
    />
  );
}
