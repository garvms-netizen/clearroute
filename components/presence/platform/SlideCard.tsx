"use client";

import { RouteMark } from "@/components/art/RouteMark";
import { SlideVisual } from "../SlideVisual";
import type { Slide } from "@/lib/campaign";

/**
 * A finished carousel slide — a square card with the copy set *on* it.
 *
 * Previously the artwork was an abstract SVG and the copy sat underneath in
 * the caption. That is not what a carousel is: the whole point of the format
 * is that each slide carries its own line, readable on a muted scroll without
 * ever opening the caption. So the type is composed into the card here.
 *
 * The cards use the brand's own dark ground rather than the surrounding
 * platform chrome, because that is what a real posted asset looks like — the
 * app frame is the app's, the artwork inside it is the advertiser's.
 *
 * §23.3 rules that still hold: Amber only on slide 6, no brand names in the
 * artwork, and no numerals baked into the SVG — the figures here are HTML
 * text sitting over the graphic, not paths.
 */

const INK = "#E4E9F2";
const DIM = "#8B99B0";
const GROUND = "#0B1220";
const PANEL = "#121C2E";
const ACCENT = "#00B8A9";
const AMBER = "#F4A340";

export function SlideCard({
  slide,
  ratio = "1:1",
}: {
  slide: Slide;
  /** 1:1 for the feed, 4:5 for the taller variant §23.3 mentions. */
  ratio?: "1:1" | "4:5";
}) {
  const isOffer = slide.visual === "offer";

  return (
    <div
      data-mode="institutional"
      className="relative flex w-full flex-col overflow-hidden"
      style={{
        aspectRatio: ratio === "1:1" ? "1 / 1" : "4 / 5",
        background: GROUND,
      }}
    >
      {/* A faint route line across the top — the one motif every slide shares,
          so six different compositions still read as one set. */}
      <svg
        viewBox="0 0 400 40"
        className="absolute inset-x-0 top-0 w-full"
        aria-hidden="true"
        style={{ opacity: 0.35 }}
      >
        <path d="M0 30 L150 30 L400 6" stroke={ACCENT} strokeWidth="1.5" fill="none" />
      </svg>

      {/* Slide number, mono, top-right */}
      <span
        className="mono absolute top-4 right-5 text-[11px] tracking-[0.14em]"
        style={{ color: DIM }}
      >
        {String(slide.n).padStart(2, "0")} / 06
      </span>

      {/* Artwork */}
      <div className="flex flex-1 items-center justify-center px-8 pt-12 pb-2">
        <div
          className="flex w-full items-center justify-center"
          style={{
            background: isOffer ? "transparent" : PANEL,
            borderRadius: 4,
            padding: isOffer ? 0 : "18px 20px",
            border: isOffer ? "none" : `1px solid #223049`,
          }}
        >
          <SlideVisual kind={slide.visual} className="h-[86px] w-full" />
        </div>
      </div>

      {/* The line — this is the slide */}
      <div className="px-7 pb-7">
        <p
          className="font-semibold"
          style={{
            color: isOffer ? AMBER : INK,
            fontSize: ratio === "4:5" ? 23 : 21,
            lineHeight: 1.22,
            letterSpacing: "-0.02em",
            textWrap: "balance",
          }}
        >
          {slide.copy}
        </p>

        {slide.sub && (
          <p
            className="mt-2.5"
            style={{ color: DIM, fontSize: 13.5, lineHeight: 1.5 }}
          >
            {slide.sub}
          </p>
        )}

        {/* Sign-off, on the last slide only */}
        {isOffer && (
          <span className="mt-4 flex items-center gap-2">
            <RouteMark size={16} decorative />
            <span
              className="font-semibold"
              style={{ color: INK, fontSize: 14, letterSpacing: "-0.02em" }}
            >
              Clear Route
            </span>
          </span>
        )}
      </div>

      {/* Swipe affordance on every slide but the last */}
      {slide.n < 6 && (
        <span
          className="mono absolute right-5 bottom-6 text-[10px] tracking-[0.12em]"
          style={{ color: DIM }}
          aria-hidden="true"
        >
          SWIPE →
        </span>
      )}
    </div>
  );
}
