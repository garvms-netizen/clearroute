import { a11yProps, STROKE, type ArtProps } from "./art-shared";

/**
 * SpeedContrast — a split composition, used for the Instagram slide that asks
 * why a parcel arrives in ten minutes and money takes three days.
 *
 * Left: a parcel with a short timer arc in Signal Teal. Right: a globe with a
 * much longer arc in a dim tone. The two arcs are the whole argument — the
 * comparison is carried by arc length, so it survives being shrunk to a
 * thumbnail or read with the captions off.
 */
export function SpeedContrast({
  className,
  title = "A parcel with a short timer arc beside a globe with a much longer one",
  decorative,
}: ArtProps) {
  // Arc geometry: r=34, circumference ≈ 213.6. The short arc covers ~15% of
  // the circle, the long one ~85% — computed from the dash array rather than
  // eyeballed, so the ratio is the claim and not a drawing accident.
  const C = 2 * Math.PI * 34;

  return (
    <svg
      viewBox="0 0 320 160"
      className={className}
      fill="none"
      {...a11yProps(title, decorative)}
    >
      {!decorative && <title>{title}</title>}

      {/* ---- Left: the parcel ---- */}
      <g>
        <circle cx="80" cy="80" r="34" stroke="var(--line)" strokeWidth={STROKE} />
        <circle
          cx="80"
          cy="80"
          r="34"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${C * 0.15} ${C}`}
          transform="rotate(-90 80 80)"
        />
        <rect x="63" y="66" width="34" height="28" rx="2" stroke="var(--text)" strokeWidth={STROKE} />
        <path d="M63 76 h34" stroke="var(--text)" strokeWidth={STROKE} />
        <path d="M80 66 v10" stroke="var(--text)" strokeWidth={STROKE} />
      </g>

      {/* ---- Right: the globe ---- */}
      <g>
        <circle cx="240" cy="80" r="34" stroke="var(--line)" strokeWidth={STROKE} />
        <circle
          cx="240"
          cy="80"
          r="34"
          stroke="var(--text-dim)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${C * 0.85} ${C}`}
          transform="rotate(-90 240 80)"
        />
        <circle cx="240" cy="80" r="18" stroke="var(--text)" strokeWidth={STROKE} />
        <path d="M222 80 h36" stroke="var(--text)" strokeWidth={STROKE} />
        <path
          d="M240 62 Q231 80 240 98 Q249 80 240 62"
          stroke="var(--text)"
          strokeWidth={STROKE}
        />
      </g>
    </svg>
  );
}
