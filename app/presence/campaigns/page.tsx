import type { Metadata } from "next";
import { CampaignsPreview } from "@/components/presence/CampaignsPreview";

export const metadata: Metadata = {
  title: "Search & social ads — concept preview",
  description:
    "Three search ad groups and seven paid-social variants, each labelled with its keyword cluster or audience segment, with live landing page links.",
};

export default function Page() {
  return <CampaignsPreview />;
}
