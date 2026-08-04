import type { Metadata } from "next";
import { InsightsPage } from "@/components/insights/InsightsPage";

export const metadata: Metadata = {
  title: "Insights — campaign analytics",
  description:
    "Two dashboards kept deliberately separate: modelled figures for a campaign that was never run, and real anonymous counts from this deployment.",
};

export default function Page() {
  return <InsightsPage />;
}
