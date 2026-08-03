import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact — support, business enquiries, press",
  description:
    "Three routes to a person: support for anything in flight, a callback for business enquiries, and press questions about the project behind the site.",
};

export default function Page() {
  return <ContactPage />;
}
