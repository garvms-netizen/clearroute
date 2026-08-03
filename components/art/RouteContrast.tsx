"use client";

import { a11yProps, drawStyle, STROKE, type ArtProps } from "./art-shared";

/**
 * RouteContrast — the hero graphic, 16:9.
 *
 * States the differentiation wordlessly: a convoluted path through five nodes
 * sits behind at low opacity, and one clean accent arc passes through a single
 * intermediate node in front. Nobody has to read a caption to see which route
 * is shorter.
 *
 * Institutional renders it static — stillness reads as reliability. Personal
 * self-draws the foreground arc on load.
 */
export function RouteContrast({
  className,
  title = "Two routes across a dotted world map: a long path through five intermediary banks, and Clear Route's direct path through one",
  decorative,
  animate = false,
}: ArtProps & { animate?: boolean }) {
  // Dot grid standing in for a world. Deliberately abstract — a real
  // coastline would invite questions about which countries are supported.
  const dots: Array<[number, number]> = [];
  for (let y = 26; y <= 152; y += 18) {
    for (let x = 24; x <= 616; x += 18) {
      // Thin the grid toward the edges so the field reads as a globe rather
      // than wallpaper.
      const edge = Math.abs(x - 320) / 320;
      if (edge > 0.82 && y % 36 !== 26 % 36) continue;
      dots.push([x, y]);
    }
  }

  return (
    <svg
      viewBox="0 0 640 180"
      className={className}
      fill="none"
      {...a11yProps(title, decorative)}
    >
      {!decorative && <title>{title}</title>}

      <g opacity="0.5">
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.4" fill="var(--line)" />
        ))}
      </g>

      {/* The bank route: five intermediaries, doubling back on itself. */}
      <g opacity="0.2">
        <path
          d="M64 132 L152 60 L246 128 L340 52 L436 130 L576 56"
          stroke="var(--line)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[
          [152, 60],
          [246, 128],
          [340, 52],
          [436, 130],
        ].map(([x, y]) => (
          <circle key={`${x}`} cx={x} cy={y} r="5" fill="var(--line)" />
        ))}
      </g>

      {/* Clear Route: one bend, one intermediary — the same shape as the mark. */}
      <path
        d="M64 132 L320 132 L576 56"
        stroke="var(--accent)"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
        data-draw={animate ? "" : undefined}
        style={animate ? drawStyle(600, 1.2) : undefined}
      />

      <circle cx="64" cy="132" r="7" fill="var(--mark)" />
      <circle cx="320" cy="132" r="7" fill="var(--accent)" />
      <circle cx="576" cy="56" r="7" fill="var(--mark)" />
    </svg>
  );
}
