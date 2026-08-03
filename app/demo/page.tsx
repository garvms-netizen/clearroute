import type { Metadata } from "next";
import { DemoPage } from "@/components/demo/DemoPage";

export const metadata: Metadata = {
  title: "Product demo — watch a transfer, end to end",
  description:
    "Two short films: one for finance teams moving company money, one for people sending money to family, students and freelancers. Both play inline.",
};

export default function Page() {
  return <DemoPage />;
}
