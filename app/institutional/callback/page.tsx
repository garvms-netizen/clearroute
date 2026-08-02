import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Callback" };

export default function Page() {
  return (
    <PageStub
      eyebrow="REQUEST A CALLBACK"
      title="Tell us where you send money."
      stage="Stage 9"
    />
  );
}
