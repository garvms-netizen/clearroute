import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Personal" };

export default function Page() {
  return (
    <PageStub
      eyebrow="SEND MONEY ABROAD"
      title="Send money home. Watch every step of the way."
      stage="Stage 4"
    />
  );
}
