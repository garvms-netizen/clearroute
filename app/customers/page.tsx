import type { Metadata } from "next";
import { CustomersPage } from "@/components/customers/CustomersPage";

export const metadata: Metadata = {
  title: "Customers — built for two very different people",
  description:
    "Illustrative testimonials and scenarios representing the two audiences this campaign was designed for: finance teams moving company money, and people sending money themselves.",
};

export default function Page() {
  return <CustomersPage />;
}
