import type { Close } from "@/lib/rates";

/**
 * A trend line of real published closes.
 *
 * Every vertex is an actual ECB close on an actual date — no interpolation,
 * no smoothing, no invented points for the days the ECB doesn't publish. The
 * line is drawn straight between consecutive publishing days, which is the
 * truthful shape: the rate genuinely has no observed value over a weekend.
 *
 * No text inside the SVG, per §6.3 — the figure and date live in HTML beside
 * it, where they can be kept in step with the rest of the page.
 */
export function Sparkline({
  closes,
  width = 68,
  height = 20,
  className,
}: {
  closes: Close[];
  width?: number;
  height?: number;
  className?: string;
}) {
  if (closes.length < 2) return null;

  const values = closes.map((c) => c.rate);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1; // a perfectly flat series would divide by zero

  const pad = 2;
  const points = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (width - pad * 2);
    // SVG y grows downward, so invert: the highest rate sits at the top.
    const y = height - pad - ((v - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });

  const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d={d}
        stroke="var(--accent)"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      {/* Marks where the series actually ends, so the eye lands on today. */}
      <circle cx={last[0]} cy={last[1]} r="1.9" fill="var(--accent)" />
    </svg>
  );
}
