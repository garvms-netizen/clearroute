/**
 * RouteMark — the logo.
 *
 * Geometry is taken verbatim from the transaction-flow prototypes
 * (`M6 30 L30 30 L54 6` in a 60×36 box): one continuous stroke left to right
 * with a single bend. The minimality is the message — the fewest hops between
 * origin and destination.
 *
 * The prototypes drew two nodes; §6.2 calls for three, the middle one in
 * Signal Teal. Both are satisfied by putting the third node on the elbow at
 * (30,30), which the path already passes through. Nothing about the mark's
 * shape changes, and the teal node lands exactly on the single intermediary —
 * the one thing this product claims to have fewer of, and so the one thing
 * the logo colours as live.
 *
 * Outer nodes carry the brand colour via --mark (Deep Route Blue on light
 * grounds, a lighter tint of the same hue on the dark institutional ground,
 * where #1B3A6B would be invisible).
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
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": title };

  return (
    <svg
      viewBox="0 0 60 36"
      width={(size * 60) / 36}
      height={size}
      fill="none"
      className={className}
      {...a11y}
    >
      {!decorative && <title>{title}</title>}
      <path
        d="M6 30 L30 30 L54 6"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="30" r="4" fill="var(--mark)" />
      <circle cx="30" cy="30" r="4" fill="var(--accent)" />
      <circle cx="54" cy="6" r="4" fill="var(--mark)" />
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
