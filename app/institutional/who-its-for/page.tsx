import type { Metadata } from "next";
import { PersonaPage } from "@/components/personas/PersonaPage";

export const metadata: Metadata = {
  title: "Who it's for — finance teams moving company money",
  description:
    "Built for the finance manager who signs off on vendor payments, subsidiary funding and contractor payouts, and has to justify the choice to a CFO.",
};

export default function Page() {
  return <PersonaPage mode="institutional" />;
}
