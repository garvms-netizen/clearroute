"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";
import { RouteMark } from "@/components/art/RouteMark";
import { ConceptNote } from "./ConceptNote";
import { SlideVisual } from "./SlideVisual";
import { IG_CAROUSEL, IG_POSTS, IG_PROFILE } from "@/lib/campaign";
import { track } from "@/lib/track";

/**
 * A generic mobile profile layout inside PhoneFrame, plus a carousel viewer.
 *
 * Nothing here reproduces Instagram's logo, icon set or chrome. The engagement
 * glyphs are drawn from Clear Route's own route motif — a node for likes, a
 * bracket for comments, an arrow for shares — for the same reason the frame
 * carries no wordmark: this is a preview of our assets, not a copy of someone
 * else's product.
 *
 * The grid tiles are all openable. An account with three filled tiles and nine
 * empty ones reads as a mockup; filling them is what makes the campaign look
 * like a body of work rather than a sample.
 */

type Tile =
  | { kind: "carousel"; index: number }
  | { kind: "post"; index: number };

export function InstagramPreview() {
  const [open, setOpen] = useState<Tile | null>(null);
  const [slide, setSlide] = useState(0);

  const openCarousel = () => {
    setSlide(0);
    setOpen({ kind: "carousel", index: 0 });
    track("carousel_open", "instagram");
  };

  const tiles: Tile[] = [
    { kind: "carousel", index: 0 },
    ...IG_POSTS.map((_, i) => ({ kind: "post" as const, index: i })),
  ];

  const current = open?.kind === "carousel" ? IG_CAROUSEL[slide] : null;
  const post = open?.kind === "post" ? IG_POSTS[open.index] : null;

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="OUR PRESENCE · INSTAGRAM"
          level={1}
          title="The awareness layer, built for a silent scroll."
          lede="A six-slide carousel aimed at Priya — the freelancer, the parent paying tuition, the person sending money themselves. It argues from a familiar experience rather than from product features, and never mentions the offer."
        />
        <div className="mt-8">
          <ConceptNote channel="Instagram" />
        </div>
      </div>

      <Section labelledBy="profile">
        <h2 id="profile" className="sr-only">
          Profile preview
        </h2>

        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start">
          <PhoneFrame width={320} statusLabel="Clear Route">
            <div className="px-4 pt-4 pb-2">
              {/* Profile header */}
              <div className="flex items-center gap-4">
                <span
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "var(--brand)" }}
                >
                  <RouteMark size={24} decorative />
                </span>
                <dl className="flex flex-1 justify-around text-center">
                  {[
                    [IG_PROFILE.posts, "posts"],
                    [IG_PROFILE.followers, "followers"],
                    [IG_PROFILE.following, "following"],
                  ].map(([v, k]) => (
                    <div key={k as string}>
                      <dd className="mono text-[13px] font-medium" style={{ color: "var(--text)" }}>
                        {v}
                      </dd>
                      <dt className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                        {k}
                      </dt>
                    </div>
                  ))}
                </dl>
              </div>

              <p className="mono mt-3 text-[12px] font-medium" style={{ color: "var(--text)" }}>
                {IG_PROFILE.handle}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
                {IG_PROFILE.bio}
              </p>
            </div>

            {/* Post grid */}
            <div className="grid grid-cols-3 gap-0.5 px-1 pb-2">
              {tiles.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => (t.kind === "carousel" ? openCarousel() : setOpen(t))}
                  className="relative flex aspect-square items-center justify-center overflow-hidden"
                  style={{ background: "var(--surface-2)" }}
                >
                  <SlideVisual
                    kind={t.kind === "carousel" ? IG_CAROUSEL[0].visual : IG_POSTS[t.index].visual}
                    className="h-[78%] w-[78%]"
                  />
                  {t.kind === "carousel" && (
                    // A stacked-frames mark, drawn rather than borrowed, so
                    // the multi-slide tile reads as a set.
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 right-1.5"
                      style={{ color: "var(--accent)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <rect x="3.5" y="0.5" width="8" height="8" rx="1.5" stroke="currentColor" />
                        <rect
                          x="0.5"
                          y="3.5"
                          width="8"
                          height="8"
                          rx="1.5"
                          stroke="currentColor"
                          fill="var(--surface-2)"
                        />
                      </svg>
                    </span>
                  )}
                  <span className="sr-only">
                    {t.kind === "carousel"
                      ? "Open the six-slide carousel"
                      : `Open post: ${IG_POSTS[t.index].caption}`}
                  </span>
                </button>
              ))}
            </div>
          </PhoneFrame>

          {/* Slide inventory beside the phone, readable without opening anything */}
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge tone="accent">Awareness</Badge>
              <Badge tone="muted">Priya</Badge>
              <span className="mono text-[11px]" style={{ color: "var(--text-dim)" }}>
                6 slides · 1:1 with a 4:5 variant
              </span>
            </div>

            <ol className="border-t" style={{ borderColor: "var(--line)" }}>
              {IG_CAROUSEL.map((s, i) => (
                <li key={s.n} className="border-b" style={{ borderColor: "var(--line)" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSlide(i);
                      setOpen({ kind: "carousel", index: i });
                      track("carousel_open", `instagram:slide-${s.n}`);
                    }}
                    className="flex w-full items-start gap-4 py-3.5 text-left"
                  >
                    <span className="mono shrink-0 text-[11px]" style={{ color: "var(--accent-ink)" }}>
                      {String(s.n).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-[14px] leading-snug" style={{ color: "var(--text)" }}>
                        {s.copy}
                      </span>
                      {s.sub && (
                        <span
                          className="mt-1 block text-[12px] leading-relaxed"
                          style={{ color: "var(--text-dim)" }}
                        >
                          {s.sub}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <p
              className="mt-5 text-[12px] leading-relaxed"
              style={{ color: "var(--text-dim)", maxWidth: "62ch" }}
            >
              Online ordering is referenced generically and never by brand name.
              Google Pay is named in slide 4&rsquo;s copy only — never depicted,
              and never implying a partnership. Amber appears on slide 6 alone,
              which is the only Conversion-stage asset in this set.
            </p>
          </div>
        </div>
      </Section>

      {/* ---------- Carousel viewer ---------- */}
      <Modal
        open={open?.kind === "carousel"}
        onClose={() => setOpen(null)}
        label={`Carousel slide ${slide + 1} of ${IG_CAROUSEL.length}`}
        onPrev={() => setSlide((s) => (s - 1 + IG_CAROUSEL.length) % IG_CAROUSEL.length)}
        onNext={() => setSlide((s) => (s + 1) % IG_CAROUSEL.length)}
        className="max-w-md"
      >
        {current && (
          <div>
            <div
              className="flex aspect-square items-center justify-center p-8"
              style={{ background: "var(--surface-2)" }}
            >
              <SlideVisual kind={current.visual} className="max-h-full w-full" />
            </div>

            <div className="p-5">
              <p className="text-[17px] leading-snug font-semibold" style={{ color: "var(--text)" }}>
                {current.copy}
              </p>
              {current.sub && (
                <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
                  {current.sub}
                </p>
              )}

              {/* Dot pagination */}
              <div className="mt-5 flex justify-center gap-1.5">
                {IG_CAROUSEL.map((s, i) => (
                  <button
                    key={s.n}
                    type="button"
                    onClick={() => setSlide(i)}
                    aria-label={`Go to slide ${s.n}`}
                    aria-current={i === slide}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: i === slide ? "var(--accent)" : "var(--line)" }}
                  />
                ))}
              </div>

              <EngagementRow />

              <p className="mono mt-4 text-[10px]" style={{ color: "var(--text-dim)" }}>
                ← → to move · Esc to close
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* ---------- Single post viewer ---------- */}
      <Modal
        open={open?.kind === "post"}
        onClose={() => setOpen(null)}
        label="Post preview"
        className="max-w-md"
      >
        {post && (
          <div>
            <div
              className="flex aspect-square items-center justify-center p-8"
              style={{ background: "var(--surface-2)" }}
            >
              <SlideVisual kind={post.visual} className="max-h-full w-full" />
            </div>
            <div className="p-5">
              <p className="text-[15px] leading-snug" style={{ color: "var(--text)" }}>
                {post.caption}
              </p>
              <EngagementRow />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

/**
 * Engagement affordances drawn from the route motif rather than copied from a
 * platform's icon set — a node for reactions, a bracket for comments, an arrow
 * for shares.
 */
function EngagementRow() {
  return (
    <div
      className="mt-4 flex items-center gap-4 border-t pt-3"
      style={{ borderColor: "var(--line)", color: "var(--text-dim)" }}
      aria-hidden="true"
    >
      <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="4" stroke="var(--accent)" strokeWidth="1.5" />
      </svg>
      <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
        <path
          d="M2 3h10v6H6l-3 2.5V9H2z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
        <path
          d="M2 7h9M8 4l3 3-3 3"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
