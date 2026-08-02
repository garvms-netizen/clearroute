import type { Metadata } from "next";
import { PageStub } from "@/components/shell/PageStub";

export const metadata: Metadata = { title: "Get The App" };

export default function Page() {
  return (
    <PageStub
      eyebrow="GET THE APP"
      title="The app isn't live yet."
      stage="Stage 9"
    />
  );
}
