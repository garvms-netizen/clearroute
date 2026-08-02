import { a11yProps, STROKE, type ArtProps } from "./art-shared";

/**
 * TransferTimeline — four nodes on a vertical stroke, read like parcel
 * tracking, which is exactly the mental model the product wants borrowed.
 *
 * Top two are complete (filled, checked). The third is larger and outlined —
 * in progress. The fourth is a faint outline — pending. Node *size* carries
 * the state as well as colour, so the current step is findable without
 * relying on hue.
 *
 * Reused at full size as the transaction map in the demo, and shrunk into the
 * email previews and ad end-frames.
 */
export function TransferTimeline({
  className,
  title = "A four-step vertical tracking timeline: two steps complete, one in progress, one pending",
  decorative,
  /** 0-3. Steps before this are done; this one is active; after it, pending. */
  activeIndex = 2,
}: ArtProps & { activeIndex?: number }) {
  const ys = [26, 82, 138, 194];

  return (
    <svg
      viewBox="0 0 80 220"
      className={className}
      fill="none"
      {...a11yProps(title, decorative)}
    >
      {!decorative && <title>{title}</title>}

      {/* The spine, drawn in two tones so progress is legible at a glance. */}
      <path d={`M40 ${ys[0]} V${ys[activeIndex]}`} stroke="var(--accent)" strokeWidth="2" />
      <path
        d={`M40 ${ys[activeIndex]} V${ys[ys.length - 1]}`}
        stroke="var(--line)"
        strokeWidth="2"
      />

      {ys.map((y, i) => {
        if (i < activeIndex) {
          return (
            <g key={y}>
              <circle cx="40" cy={y} r="11" fill="var(--accent)" />
              <path
                d={`M34 ${y} l4 4 l8 -8`}
                stroke="var(--bg)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        }
        if (i === activeIndex) {
          return (
            <circle
              key={y}
              cx="40"
              cy={y}
              r="14"
              fill="var(--bg)"
              stroke="var(--accent)"
              strokeWidth="3"
            />
          );
        }
        return (
          <circle
            key={y}
            cx="40"
            cy={y}
            r="9"
            fill="var(--bg)"
            stroke="var(--line)"
            strokeWidth={STROKE}
          />
        );
      })}
    </svg>
  );
}
