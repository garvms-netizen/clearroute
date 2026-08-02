import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Privacy" };

export default function Page() {
  return (
    <PageStub
      eyebrow="LEGAL"
      title="Privacy policy"
      stage="Stage 8"
    />
  );
}
