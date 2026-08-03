"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";
import { POSTS } from "@/lib/posts";

/**
 * /blog, §17.
 *
 * One post is written; three are planned. The planned ones render as visibly
 * disabled cards marked PLANNED rather than as links to nothing — showing the
 * content calendar is part of demonstrating the SEO strategy, and pretending
 * three unwritten articles exist would be worse than admitting they don't.
 *
 * Each card carries its target persona and keyword cluster, so the index
 * doubles as the strategy document it was planned from.
 */
export function BlogIndex() {
  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="RESOURCES · BLOG"
          level={1}
          title="Writing about how cross-border payments actually work."
          lede="Aimed at the searches these two audiences are already making — where the fee goes, how to read a rate quote, why a second currency means starting over. One article is published; the rest of the calendar is shown rather than implied."
        />
      </div>

      <Section labelledBy="articles">
        <h2 id="articles" className="sr-only">
          Articles
        </h2>

        <ul className="grid gap-5 md:grid-cols-2">
          {POSTS.map((post) => {
            const published = post.status === "published";

            const inner = (
              <>
                <span className="flex flex-wrap items-center gap-2">
                  <Badge tone={published ? "accent" : "muted"}>
                    {published ? "Published" : "Planned"}
                  </Badge>
                  <Badge tone="muted">{post.persona}</Badge>
                  <span className="mono text-[11px]" style={{ color: "var(--text-dim)" }}>
                    {post.readingTime}
                  </span>
                </span>

                <span
                  className="mt-3 block text-[17px] leading-snug font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  {post.title}
                </span>

                <span className="mt-4 block">
                  <span className="eyebrow mb-1.5 block">Keyword cluster</span>
                  <span
                    className="mono block text-[11px] leading-relaxed"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {post.keywords.join(" · ")}
                  </span>
                </span>

                {published && (
                  <span
                    className="mt-4 block text-[13px] font-medium"
                    style={{ color: "var(--accent-ink)" }}
                  >
                    Read the article →
                  </span>
                )}
              </>
            );

            const style: React.CSSProperties = {
              background: "var(--surface)",
              borderColor: "var(--line)",
              borderRadius: "var(--radius-lg)",
            };

            return (
              <li key={post.slug}>
                {published ? (
                  <Link href={`/blog/${post.slug}`} className="flex h-full flex-col border p-5" style={style}>
                    {inner}
                  </Link>
                ) : (
                  // Not a link, and marked as such for assistive tech too —
                  // a disabled-looking card that is still focusable and
                  // clickable would be the worst of both.
                  <div
                    className="flex h-full flex-col border border-dashed p-5"
                    style={{ ...style, background: "transparent", opacity: 0.62 }}
                    aria-disabled="true"
                  >
                    {inner}
                    <span
                      className="mono mt-4 block text-[11px]"
                      style={{ color: "var(--text-dim)" }}
                    >
                      Not yet written — on the content calendar
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
