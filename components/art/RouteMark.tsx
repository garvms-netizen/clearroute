/**
 * RouteMark — the logo.
 *
 * One continuous stroke travelling left to right through exactly three nodes,
 * with a single gentle bend. The minimality is the message: the fewest hops
 * between origin and destination.
 *
 * Outer nodes carry the brand colour via --mark (Deep Route Blue on light
 * grounds, a lighter tint of the same hue on the dark institutional ground,
 * where #1B3A6B would be invisible). The middle node is Signal Teal — the
 * intermediary is the one thing ClearRoute claims to have fewer of, so it is
 * the one thing the mark colours as live.
 *
 * Also used as the rating glyph, the favicon, and the video end-frame.
 */

type Size = 20 | 24 | 40;

export function RouteMark({
  size = 24,
  className,
  title = "ClearRoute",
  decorative = false,
}: {
  size?: Size | number;
  className?: string;
  title?: string;
  /** True when adjacent text already names the thing — hides it from AT. */
  decorative?: boolean;
}) {
  // Geometry lives in a 40×24 box. The stroke is a single quadratic, so there
  // is exactly one bend; the middle node sits on the curve at t=0.5, which is
  // (20, 8.5) for these control points — computed, not eyeballed, so the node
  // never floats off the line at any size.
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": title };

  return (
    <svg
      viewBox="0 0 40 24"
      width={(size * 40) / 24}
      height={size}
      fill="none"
      className={className}
      {...a11y}
    >
      {!decorative && <title>{title}</title>}
      <path
        d="M4 17 Q20 5 36 7"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="4" cy="17" r="3" fill="var(--mark)" />
      <circle cx="20" cy="8.5" r="3" fill="var(--accent)" />
      <circle cx="36" cy="7" r="3" fill="var(--mark)" />
    </svg>
  );
}

/**
 * The rating glyph — the same mark reduced to a single filled node, so a
 * five-mark row reads as a row of route nodes rather than borrowed stars.
 */
export function RouteGlyph({
  filled,
  size = 14,
}: {
  filled: boolean;
  size?: number;
}) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} aria-hidden="true">
      <circle
        cx="6"
        cy="6"
        r="4"
        fill={filled ? "var(--accent)" : "none"}
        stroke={filled ? "var(--accent)" : "var(--line)"}
        strokeWidth="1.5"
      />
    </svg>
  );
}
