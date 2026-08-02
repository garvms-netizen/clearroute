import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageStub } from "@/components/shell/PageStub";
import { POSTS, publishedSlugs } from "@/lib/posts";

/**
 * A static export has to know every dynamic route at build time, so only the
 * published slugs are generated. Planned posts render as disabled cards on
 * the index and have no route of their own — pretending they exist would be
 * worse than showing the content calendar honestly.
 */
export function generateStaticParams() {
  return publishedSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  return {
    title: post?.metaTitle ?? "Article",
    description: post?.metaDescription,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug && p.status === "published");
  if (!post) notFound();

  return <PageStub eyebrow="BLOG" title={post.title} stage="Stage 8" />;
}
