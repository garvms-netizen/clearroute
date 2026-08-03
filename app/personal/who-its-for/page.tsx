import type { Metadata } from "next";
import { PersonaPage } from "@/components/personas/PersonaPage";

export const metadata: Metadata = {
  title: "Who it's for — sending money yourself",
  description:
    "For tuition fees, family support and freelance income — the transfer you cannot afford to get wrong, sent at a rate you can see and tracked the whole way.",
};

export default function Page() {
  return <PersonaPage mode="personal" />;
}
