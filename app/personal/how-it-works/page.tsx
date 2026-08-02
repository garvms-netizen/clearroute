import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "How It Works" };

export default function Page() {
  return (
    <PageStub
      eyebrow="HOW IT WORKS"
      title="See exactly how your money gets there."
      stage="Stage 5"
    />
  );
}
