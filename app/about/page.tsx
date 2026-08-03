import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About — where does the money actually go?",
  description:
    "The observation, the diagnosis and the decision behind Clear Route: build the visibility layer rather than new rails.",
};

export default function Page() {
  return <AboutPage />;
}
