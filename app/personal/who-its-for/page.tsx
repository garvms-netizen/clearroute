import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Who Its For" };

export default function Page() {
  return (
    <PageStub
      eyebrow="WHO IT'S FOR"
      title="For the transfer you cannot afford to get wrong."
      stage="Stage 6"
    />
  );
}
