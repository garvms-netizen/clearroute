import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/BlogIndex";

export const metadata: Metadata = {
  title: "Blog — how cross-border payments actually work",
  description:
    "Articles on where transfer fees really go, how to read a rate quote, and why multi-currency payments still mean starting over. One published, three planned.",
};

export default function Page() {
  return <BlogIndex />;
}
