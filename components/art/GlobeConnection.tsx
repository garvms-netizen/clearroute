"use client";

import { a11yProps, drawStyle, type ArtProps } from "./art-shared";

/**
 * GlobeConnection — the retail signature.
 *
 * Two simplified figures at opposite edges of a curved horizon, joined by an
 * arc that draws itself once on load. The route motif re-rendered as human
 * connection rather than network path: this is the moment money arrives and
 * someone is relieved, not a diagram of infrastructure.
 *
 * Geometry follows the personal prototype's arc (M 70 150 Q 320 20 570 150)
 * and its figure construction. Two changes from that draft: the `<text>`
 * label inside the SVG moves out to HTML (per §6.3, no numerals inside any
 * graphic — a figure baked into a path can't be kept in step with the rest of
 * the page), and the fills read from tokens rather than hex.
 */
export function GlobeConnection({
  className,
  title = "Two people at opposite ends of a curved horizon, connected by a single arc",
  decorative,
}: ArtProps) {
  return (
    <svg
      viewBox="0 0 640 200"
      className={className}
      fill="none"
      {...a11yProps(title, decorative)}
    >
      {!decorative && <title>{title}</title>}

      {/* The horizon — one shallow curve, suggesting a globe without drawing one. */}
      <path
        d="M20 186 Q320 150 620 186"
        stroke="var(--line)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* The connection. Draws once, then rests. */}
      <path
        d="M 70 150 Q 320 20 570 150"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        data-draw=""
        style={drawStyle(560, 1.2, 0.25)}
      />

      {/* Sender and recipient. Simplified to a head and shoulders — no facial
          features, no identifiable person, legible at 120px wide. */}
      {[70, 570].map((cx) => (
        <g key={cx} fill="var(--warm)">
          <circle cx={cx} cy="118" r="13" />
          <path d={`M${cx - 20} 168 Q${cx} 138 ${cx + 20} 168 L${cx + 20} 178 L${cx - 20} 178 Z`} />
        </g>
      ))}

      {/* The single intermediary, at the apex of the arc. */}
      <circle cx="320" cy="85" r="6" fill="var(--accent)" />
    </svg>
  );
}
