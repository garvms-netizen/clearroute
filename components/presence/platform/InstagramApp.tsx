"use client";

import { useState } from "react";
import { RouteMark } from "@/components/art/RouteMark";
import { SlideCard } from "./SlideCard";
import { IG_CAROUSEL, IG_POSTS, IG_PROFILE } from "@/lib/campaign";
import { track } from "@/lib/track";
import {
  ChevronLeft, CommentIcon, DotsIcon, GridIcon, HeartIcon, HomeIcon,
  ReelIcon, SaveIcon, SearchIcon, ShareIcon, TagIcon,
} from "./icons";

/**
 * A phone-accurate mobile photo-app mockup.
 *
 * This deliberately does **not** use the site's design tokens. The whole
 * point of a channel preview is to show how an asset looks in the place it
 * will actually appear — rendering it in Clear Route's own palette shows the
 * asset in a context it will never be seen in. So the chrome here is
 * hard-coded to the platform's real values: true black ground, #F5F5F5 type,
 * #262626 rules, the #0095F6 action blue, the 1px-gap 3-up grid, the
 * story-ring gradient.
 *
 * Where the line is drawn: no platform logo or wordmark appears. A real
 * profile screen shows the *account's* name in its top bar rather than the
 * app's mark, so the mockup stays convincing without reproducing a trademark,
 * and every interface glyph is drawn from scratch in ./icons.tsx. The only
 * brand mark on screen is Clear Route's own.
 */

const BG = "#000000";
const FG = "#F5F5F5";
const DIM = "#A8A8A8";
const RULE = "#262626";
const BLUE = "#0095F6";

type Open = { kind: "carousel"; i: number } | { kind: "post"; i: number } | null;

export function InstagramApp() {
  const [open, setOpen] = useState<Open>(null);
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState<"grid" | "reels" | "tagged">("grid");
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const tiles = [{ carousel: true }, ...IG_POSTS.map(() => ({ carousel: false }))];

  return (
    <div className="mx-auto w-full" style={{ maxWidth: 390 }}>
      {/* Device shell */}
      <div
        style={{
          background: BG,
          border: "10px solid #1c1c1e",
          borderRadius: 44,
          overflow: "hidden",
          boxShadow: "0 0 0 1px #3a3a3c",
        }}
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between px-6 pt-3 pb-1"
          style={{ color: FG, fontSize: 12, fontWeight: 600 }}
        >
          <span>9:41</span>
          <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={i * 4.4} y={8 - i * 2.4} width="3" height={3 + i * 2.4} rx="0.7" fill={FG} />
              ))}
            </svg>
            <svg width="24" height="11" viewBox="0 0 24 11" aria-hidden="true">
              <rect x="0.5" y="0.5" width="20" height="10" rx="3" stroke={FG} fill="none" />
              <rect x="2" y="2" width="16" height="7" rx="1.6" fill={FG} />
              <path d="M22 4v3" stroke={FG} strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        </div>

        {open ? (
          <PostView
            open={open}
            slide={slide}
            setSlide={setSlide}
            onClose={() => setOpen(null)}
            liked={liked}
            setLiked={setLiked}
          />
        ) : (
          <>
            {/* Top bar — the account's own handle, as a real profile screen shows */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ color: FG }}
            >
              <ChevronLeft color={FG} />
              <span style={{ fontSize: 16, fontWeight: 700 }}>{IG_PROFILE.handle.replace("@", "")}</span>
              <DotsIcon color={FG} />
            </div>

            {/* Profile block */}
            <div className="px-4 pt-2">
              <div className="flex items-center gap-6">
                {/* Story ring */}
                <span
                  style={{
                    padding: 2.5,
                    borderRadius: "50%",
                    background: "linear-gradient(45deg,#FEDA75,#FA7E1E,#D62976,#962FBF,#4F5BD5)",
                    display: "inline-flex",
                  }}
                >
                  <span
                    style={{
                      width: 78, height: 78, borderRadius: "50%",
                      background: "#1B3A6B", border: `2.5px solid ${BG}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <RouteMark size={26} decorative />
                  </span>
                </span>

                <div className="flex flex-1 justify-around text-center" style={{ color: FG }}>
                  {[[IG_PROFILE.posts, "posts"], [IG_PROFILE.followers, "followers"], [IG_PROFILE.following, "following"]].map(
                    ([v, k]) => (
                      <div key={k as string}>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>{v}</div>
                        <div style={{ fontSize: 13, color: FG }}>{k}</div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="mt-3" style={{ color: FG, fontSize: 13.5, lineHeight: 1.45 }}>
                <div style={{ fontWeight: 600 }}>Clear Route</div>
                <div style={{ color: DIM }}>Financial service</div>
                <div>{IG_PROFILE.bio}</div>
                <div style={{ color: "#E0F1FF" }}>clearroute.app</div>
              </div>

              {/* Action buttons */}
              <div className="mt-3.5 flex gap-1.5">
                <button
                  style={{ flex: 1, background: BLUE, color: "#fff", fontSize: 14, fontWeight: 600, borderRadius: 8, padding: "7px 0" }}
                >
                  Follow
                </button>
                <button
                  style={{ flex: 1, background: "#363636", color: FG, fontSize: 14, fontWeight: 600, borderRadius: 8, padding: "7px 0" }}
                >
                  Message
                </button>
                <button
                  style={{ background: "#363636", color: FG, borderRadius: 8, padding: "7px 12px" }}
                  aria-label="More"
                >
                  <ChevronLeft size={14} color={FG} />
                </button>
              </div>

              {/* Story highlights */}
              <div className="mt-4 flex gap-4 pb-3">
                {["Rates", "Routes", "Fees", "Q&A"].map((h) => (
                  <div key={h} className="text-center">
                    <span
                      style={{
                        width: 58, height: 58, borderRadius: "50%",
                        border: `1.5px solid ${RULE}`, background: "#121212",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <RouteMark size={16} decorative />
                    </span>
                    <div style={{ color: FG, fontSize: 11.5, marginTop: 5 }}>{h}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex" style={{ borderTop: `1px solid ${RULE}` }}>
              {([["grid", GridIcon], ["reels", ReelIcon], ["tagged", TagIcon]] as const).map(([k, Icon]) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className="flex flex-1 justify-center py-2.5"
                  style={{ borderBottom: `1.5px solid ${tab === k ? FG : "transparent"}` }}
                  aria-label={k}
                >
                  <Icon color={tab === k ? FG : DIM} />
                </button>
              ))}
            </div>

            {/* Grid */}
            {tab === "grid" ? (
              <div className="grid grid-cols-3" style={{ gap: 1.5, background: RULE }}>
                {tiles.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (t.carousel) { setSlide(0); setOpen({ kind: "carousel", i: 0 }); track("carousel_open", "instagram"); }
                      else setOpen({ kind: "post", i: i - 1 });
                    }}
                    className="relative flex aspect-square items-center justify-center overflow-hidden"
                    style={{ background: "#0d0d0d" }}
                  >
                    {/* The tile shows the finished slide, scaled — which is
                        what a grid thumbnail actually is. */}
                    <SlideCard
                      slide={
                        t.carousel
                          ? IG_CAROUSEL[0]
                          : { n: i, copy: IG_POSTS[i - 1].caption, visual: IG_POSTS[i - 1].visual }
                      }
                    />
                    {t.carousel && (
                      <span className="absolute top-1.5 right-1.5" style={{ color: FG }} aria-hidden="true">
                        <svg width="15" height="15" viewBox="0 0 12 12" fill="none">
                          <rect x="3.5" y="0.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                          <rect x="0.5" y="3.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="#0d0d0d" />
                        </svg>
                      </span>
                    )}
                    <span className="sr-only">
                      {t.carousel ? "Open the six-slide carousel" : IG_POSTS[i - 1].caption}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-16" style={{ color: DIM, fontSize: 13 }}>
                Nothing here yet
              </div>
            )}

            {/* Bottom nav */}
            <div
              className="flex items-center justify-around py-3"
              style={{ borderTop: `1px solid ${RULE}` }}
            >
              <HomeIcon color={FG} />
              <SearchIcon color={FG} />
              <ReelIcon color={FG} />
              <HeartIcon size={22} color={FG} />
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#1B3A6B", display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${FG}` }}>
                <RouteMark size={9} decorative />
              </span>
            </div>
            <div className="flex justify-center pb-2">
              <span style={{ width: 120, height: 4, borderRadius: 2, background: "#4a4a4a" }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PostView({
  open, slide, setSlide, onClose, liked, setLiked,
}: {
  open: NonNullable<Open>;
  slide: number;
  setSlide: (n: number) => void;
  onClose: () => void;
  liked: Record<string, boolean>;
  setLiked: (v: Record<string, boolean>) => void;
}) {
  const isCarousel = open.kind === "carousel";
  const item = isCarousel ? IG_CAROUSEL[slide] : IG_POSTS[open.i];
  const key = isCarousel ? `c${slide}` : `p${open.i}`;
  const isLiked = Boolean(liked[key]);

  return (
    <div>
      <div className="flex items-center gap-3 px-3 py-2.5" style={{ color: FG }}>
        <button onClick={onClose} aria-label="Back"><ChevronLeft color={FG} /></button>
        <span style={{ width: 32, height: 32, borderRadius: "50%", background: "#1B3A6B", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <RouteMark size={13} decorative />
        </span>
        <span style={{ fontSize: 13.5, fontWeight: 600, flex: 1 }}>{IG_PROFILE.handle.replace("@", "")}</span>
        <DotsIcon color={FG} />
      </div>

      <div className="relative" style={{ background: "#0d0d0d" }}>
        <SlideCard
          slide={
            isCarousel
              ? IG_CAROUSEL[slide]
              : { n: open.i + 1, copy: (item as { caption: string }).caption, visual: item.visual }
          }
        />
        {isCarousel && (
          <>
            <span className="absolute top-3 right-3" style={{ background: "rgba(0,0,0,.6)", color: FG, fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 12 }}>
              {slide + 1}/{IG_CAROUSEL.length}
            </span>
            <button
              onClick={() => setSlide((slide - 1 + IG_CAROUSEL.length) % IG_CAROUSEL.length)}
              className="absolute top-1/2 left-1 -translate-y-1/2 rounded-full p-1.5"
              style={{ background: "rgba(255,255,255,.85)" }}
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} color="#111" />
            </button>
            <button
              onClick={() => setSlide((slide + 1) % IG_CAROUSEL.length)}
              className="absolute top-1/2 right-1 -translate-y-1/2 rotate-180 rounded-full p-1.5"
              style={{ background: "rgba(255,255,255,.85)" }}
              aria-label="Next slide"
            >
              <ChevronLeft size={16} color="#111" />
            </button>
          </>
        )}
      </div>

      {/* Action row */}
      <div className="flex items-center gap-4 px-3.5 pt-3">
        <button onClick={() => setLiked({ ...liked, [key]: !isLiked })} aria-label="Like">
          <HeartIcon color={isLiked ? "#FF3040" : FG} filled={isLiked} />
        </button>
        <CommentIcon color={FG} />
        <ShareIcon color={FG} />
        <span className="ml-auto"><SaveIcon color={FG} /></span>
      </div>

      {isCarousel && (
        <div className="flex justify-center gap-1.5 pt-2.5">
          {IG_CAROUSEL.map((s, i) => (
            <button
              key={s.n}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${s.n}`}
              style={{ width: 6, height: 6, borderRadius: "50%", background: i === slide ? "#0095F6" : "#3a3a3a" }}
            />
          ))}
        </div>
      )}

      {/* The caption is the campaign copy, not a repeat of the slide line —
          the line is already on the card, and restating it under every post
          is exactly the repetition a real account avoids. */}
      <div className="px-3.5 pt-2.5 pb-4" style={{ color: FG, fontSize: 13.5, lineHeight: 1.45 }}>
        <div style={{ fontWeight: 600 }}>{isLiked ? "1,241" : "1,240"} likes</div>
        <div className="mt-1">
          <span style={{ fontWeight: 600, marginRight: 6 }}>{IG_PROFILE.handle.replace("@", "")}</span>
          {isCarousel
            ? "Six things nobody tells you about sending money abroad. Swipe →"
            : (item as { caption: string }).caption}
        </div>
        <div style={{ color: "#E0F1FF", marginTop: 4 }}>
          #CrossBorderPayments #ForeignExchange #SendMoney
        </div>
        <div style={{ color: DIM, fontSize: 11, marginTop: 8, textTransform: "uppercase" }}>2 days ago</div>
      </div>
    </div>
  );
}
