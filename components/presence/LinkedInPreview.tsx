"use client";

import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { PostCard } from "@/components/ui/PostCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";
import { RouteContrast } from "@/components/art/RouteContrast";
import { RouteMark } from "@/components/art/RouteMark";
import { ConceptNote } from "./ConceptNote";
import { SlideVisual } from "./SlideVisual";
import { LI_POSTS, LI_PROFILE, LI_USAGE_NOTE } from "@/lib/campaign";

const POST_VISUALS = ["feestack", "route", "phone"] as const;

/**
 * A generic company page and feed.
 *
 * No LinkedIn logo, no clone of its interface. The banner is RouteContrast,
 * the avatar is the RouteMark, and PostCard supplies the frame — the same
 * component the paid-social previews use, because these are Clear Route's
 * assets in Clear Route's chrome.
 */
export function LinkedInPreview() {
  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="OUR PRESENCE · LINKEDIN"
          level={1}
          title="Three posts, and only the last one sells."
          lede="Aimed at Rohan — the finance manager who will be asked to justify the choice. Two posts establish the insight; the third is the only one that names the product."
        />
        <div className="mt-8">
          <ConceptNote channel="LinkedIn" />
        </div>
      </div>

      <Section labelledBy="company-page">
        <h2 id="company-page" className="sr-only">
          Company page preview
        </h2>

        {/* Company header */}
        <div
          className="overflow-hidden border"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <div
            className="flex h-32 items-center justify-center overflow-hidden sm:h-40"
            style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--line)" }}
          >
            <RouteContrast className="w-full" decorative />
          </div>

          <div className="flex flex-wrap items-end gap-4 p-5">
            <span
              className="-mt-12 flex h-20 w-20 shrink-0 items-center justify-center border-4"
              style={{
                background: "var(--brand)",
                borderColor: "var(--surface)",
                borderRadius: "var(--radius)",
              }}
            >
              <RouteMark size={30} decorative />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[18px] font-semibold" style={{ color: "var(--text)" }}>
                {LI_PROFILE.name}
              </p>
              <p className="text-[13px]" style={{ color: "var(--text-dim)" }}>
                {LI_PROFILE.descriptor}
              </p>
              <p className="mono mt-0.5 text-[11px]" style={{ color: "var(--text-dim)" }}>
                {LI_PROFILE.followers}
              </p>
            </div>
          </div>
        </div>

        <Callout className="mt-6">{LI_USAGE_NOTE}</Callout>
      </Section>

      {/* Feed */}
      <Section labelledBy="feed">
        <SectionHeader id="feed" eyebrow="THE FEED" title="Posts in running order" />

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {LI_POSTS.map((post, i) => (
            <div key={post.id}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="mono text-[11px]" style={{ color: "var(--text-dim)" }}>
                  Post {i + 1}
                </span>
                <Badge tone={post.stage === "Interest" ? "warn" : "accent"}>{post.stage}</Badge>
              </div>

              <PostCard
                meta={LI_PROFILE.descriptor}
                reactions={post.reactions}
                comments={post.comments}
                topComment={post.prompt}
                visual={
                  <div className="flex items-center justify-center px-6 py-6">
                    <SlideVisual kind={POST_VISUALS[i] ?? "route"} className="h-28" />
                  </div>
                }
                body={
                  <>
                    {post.body.map((para) => (
                      <p key={para.slice(0, 24)} style={{ whiteSpace: "pre-line" }}>
                        {para}
                      </p>
                    ))}
                    <p className="mono pt-1 text-[11px]" style={{ color: "var(--accent-ink)" }}>
                      {post.tags.map((t) => `#${t}`).join("  ")}
                    </p>
                  </>
                }
              />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
