"use client";

import { useState } from "react";
import { RouteContrast } from "@/components/art/RouteContrast";
import { RouteMark } from "@/components/art/RouteMark";
import { SlideVisual } from "../SlideVisual";
import { LI_POSTS, LI_PROFILE } from "@/lib/campaign";
import { CommentIcon, GlobeIcon, RepostIcon, SearchIcon, SendIcon, ThumbIcon } from "./icons";

/**
 * A desktop professional-network mockup.
 *
 * As with the photo-app mockup, this deliberately ignores the site's design
 * tokens: showing a LinkedIn asset in Clear Route's dark palette shows it in a
 * context it will never appear in. The chrome is the platform's real values —
 * the #F4F2EE page wash, white cards at 8px radius, #0A66C2 action blue,
 * #666666 secondary type, the reaction pills, the four-action bar.
 *
 * No platform logo or wordmark appears. The top bar carries a search field and
 * generic nav glyphs drawn from scratch, and the only brand mark on screen is
 * Clear Route's own — which is correct, since this is Clear Route's page.
 */

const WASH = "#F4F2EE";
const CARD = "#FFFFFF";
const INK = "#000000E6";
const DIM = "#00000099";
const RULE = "#E8E8E8";
const BLUE = "#0A66C2";

const POST_VISUALS = ["feestack", "route", "phone"] as const;

export function LinkedInApp() {
  const [reacted, setReacted] = useState<Record<string, boolean>>({});

  return (
    <div style={{ background: WASH, borderRadius: 10, overflow: "hidden", border: `1px solid ${RULE}` }}>
      {/* Top nav */}
      <div style={{ background: CARD, borderBottom: `1px solid ${RULE}` }}>
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-2">
          <span
            style={{
              width: 34, height: 34, borderRadius: 5, background: BLUE,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <RouteMark size={15} decorative />
          </span>
          <span
            className="flex items-center gap-2 px-3"
            style={{ background: "#EDF3F8", borderRadius: 4, height: 34, flex: 1, maxWidth: 280 }}
          >
            <SearchIcon size={16} color={DIM} />
            <span style={{ color: DIM, fontSize: 13.5 }}>Search</span>
          </span>
          <span className="ml-auto hidden gap-6 sm:flex" style={{ color: DIM, fontSize: 12 }}>
            {["Home", "Network", "Jobs", "Messaging", "Notifications"].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-5">
        {/* Company header card */}
        <div style={{ background: CARD, borderRadius: 8, border: `1px solid ${RULE}`, overflow: "hidden" }}>
          <div style={{ height: 130, background: "#1B3A6B", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <div data-mode="institutional" style={{ width: "100%" }}>
              <RouteContrast className="w-full" decorative />
            </div>
          </div>

          <div className="px-6 pb-5">
            <span
              style={{
                display: "flex", width: 88, height: 88, marginTop: -44, borderRadius: 8,
                background: "#1B3A6B", border: `4px solid ${CARD}`,
                alignItems: "center", justifyContent: "center",
              }}
            >
              <RouteMark size={34} decorative />
            </span>

            <h3 style={{ color: INK, fontSize: 24, fontWeight: 600, marginTop: 12 }}>{LI_PROFILE.name}</h3>
            <p style={{ color: INK, fontSize: 14.5, marginTop: 2 }}>
              Cross-border payments with a visible route
            </p>
            <p style={{ color: DIM, fontSize: 13.5, marginTop: 4 }}>
              Financial Services · Mumbai, Maharashtra · {LI_PROFILE.followers}
            </p>
            <p style={{ color: DIM, fontSize: 13.5 }}>11–50 employees</p>

            <div className="mt-3.5 flex flex-wrap gap-2">
              <button style={{ background: BLUE, color: "#fff", fontSize: 15, fontWeight: 600, borderRadius: 20, padding: "6px 18px" }}>
                + Follow
              </button>
              <button style={{ color: BLUE, fontSize: 15, fontWeight: 600, borderRadius: 20, padding: "6px 18px", border: `1.5px solid ${BLUE}` }}>
                Visit website
              </button>
              <button style={{ color: DIM, fontSize: 15, fontWeight: 600, borderRadius: 20, padding: "6px 18px", border: `1.5px solid ${DIM}` }}>
                More
              </button>
            </div>

            <div className="mt-4 flex gap-6" style={{ borderTop: `1px solid ${RULE}`, paddingTop: 10 }}>
              {["Home", "About", "Posts", "Jobs", "People"].map((t, i) => (
                <span
                  key={t}
                  style={{
                    color: i === 2 ? "#01754F" : DIM,
                    fontSize: 14,
                    fontWeight: i === 2 ? 600 : 400,
                    borderBottom: i === 2 ? "2px solid #01754F" : "none",
                    paddingBottom: 8,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Feed */}
        {LI_POSTS.map((post, i) => {
          const on = Boolean(reacted[post.id]);
          return (
            <article
              key={post.id}
              style={{ background: CARD, borderRadius: 8, border: `1px solid ${RULE}`, marginTop: 12, overflow: "hidden" }}
            >
              <header className="flex items-start gap-2.5 px-4 pt-3">
                <span style={{ width: 48, height: 48, borderRadius: 4, background: "#1B3A6B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <RouteMark size={20} decorative />
                </span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: "block", color: INK, fontSize: 14, fontWeight: 600 }}>{LI_PROFILE.name}</span>
                  <span style={{ display: "block", color: DIM, fontSize: 12 }}>{LI_PROFILE.followers}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, color: DIM, fontSize: 12 }}>
                    {2 + i}w · <GlobeIcon size={12} color={DIM} />
                  </span>
                </span>
                <span style={{ color: BLUE, fontSize: 14, fontWeight: 600 }}>+ Follow</span>
              </header>

              <div className="px-4 pt-2.5" style={{ color: INK, fontSize: 14, lineHeight: 1.5 }}>
                {post.body.map((p) => (
                  <p key={p.slice(0, 20)} style={{ marginBottom: 10, whiteSpace: "pre-line" }}>{p}</p>
                ))}
                <p style={{ color: BLUE, fontSize: 14 }}>{post.tags.map((t) => `#${t}`).join(" ")}</p>
              </div>

              <div className="mt-3 flex items-center justify-center" style={{ background: "#F3F6F8", borderTop: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}`, padding: "22px 0" }}>
                <SlideVisual kind={POST_VISUALS[i] ?? "route"} className="h-28" />
              </div>

              {/* Reaction counts */}
              <div className="flex items-center gap-1.5 px-4 py-2" style={{ color: DIM, fontSize: 12.5 }}>
                <span style={{ display: "inline-flex" }}>
                  {["#0A66C2", "#01754F", "#B24020"].map((c, k) => (
                    <span key={c} style={{ width: 16, height: 16, borderRadius: "50%", background: c, border: "1.5px solid #fff", marginLeft: k ? -5 : 0 }} />
                  ))}
                </span>
                <span>{post.reactions + (on ? 1 : 0)}</span>
                <span style={{ marginLeft: "auto" }}>{post.comments} comments</span>
              </div>

              {/* Action bar */}
              <div className="flex" style={{ borderTop: `1px solid ${RULE}` }}>
                {([
                  ["Like", ThumbIcon],
                  ["Comment", CommentIcon],
                  ["Repost", RepostIcon],
                  ["Send", SendIcon],
                ] as const).map(([label, Icon]) => {
                  const active = label === "Like" && on;
                  return (
                    <button
                      key={label}
                      onClick={() => label === "Like" && setReacted({ ...reacted, [post.id]: !on })}
                      className="flex flex-1 items-center justify-center gap-1.5 py-2.5"
                      style={{ color: active ? BLUE : DIM, fontSize: 14, fontWeight: 600 }}
                    >
                      <Icon size={19} color={active ? BLUE : DIM} />
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Pinned comment — the engagement prompt */}
              <div className="flex gap-2.5 px-4 py-3" style={{ borderTop: `1px solid ${RULE}`, background: "#fff" }}>
                <span style={{ width: 32, height: 32, borderRadius: "50%", background: "#1B3A6B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <RouteMark size={13} decorative />
                </span>
                <span style={{ background: "#F2F2F2", borderRadius: 8, padding: "8px 12px", flex: 1 }}>
                  <span style={{ display: "block", color: INK, fontSize: 13, fontWeight: 600 }}>{LI_PROFILE.name}</span>
                  <span style={{ display: "block", color: INK, fontSize: 13.5, marginTop: 2 }}>{post.prompt}</span>
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
