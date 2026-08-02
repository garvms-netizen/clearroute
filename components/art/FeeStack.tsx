import { a11yProps, type ArtProps } from "./art-shared";

/**
 * FeeStack — a vertical bar of money split into four segments.
 *
 * The largest segment sits at the bottom in Signal Teal: what actually
 * arrives. The three above are what gets taken, each offset sideways as if
 * peeling away from the stack. The offsets increase up the bar, so the eye
 * reads the deductions as drifting off rather than stacking neatly — which is
 * the point, since none of them appear as line items either.
 *
 * Labels are HTML beside the graphic, never inside it.
 */
export function FeeStack({
  className,
  title = "A bar of money split into four parts: three small deductions peeling away above one large remainder",
  decorative,
}: ArtProps) {
  // [y, height, sideways offset]. Bottom segment is the survivor.
  const taken: Array<[number, number, number]> = [
    [8, 22, 34],
    [36, 22, 22],
    [64, 22, 11],
  ];

  return (
    <svg
      viewBox="0 0 160 200"
      className={className}
      fill="none"
      {...a11yProps(title, decorative)}
    >
      {!decorative && <title>{title}</title>}

      {taken.map(([y, h, dx], i) => (
        <rect
          key={i}
          x={40 + dx}
          y={y}
          width="64"
          height={h}
          rx="2"
          fill="var(--line)"
        />
      ))}

      {/* What arrives. */}
      <rect x="40" y="92" width="64" height="100" rx="2" fill="var(--accent)" />
    </svg>
  );
}
