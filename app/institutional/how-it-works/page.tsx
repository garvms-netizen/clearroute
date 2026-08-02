import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "How It Works" };

export default function Page() {
  return (
    <PageStub
      eyebrow="HOW IT WORKS"
      title="Four steps. Nothing hidden at any of them."
      stage="Stage 5"
    />
  );
}
