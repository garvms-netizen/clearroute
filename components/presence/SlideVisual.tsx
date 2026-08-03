import { SpeedContrast } from "@/components/art/SpeedContrast";
import { FeeStack } from "@/components/art/FeeStack";
import { RouteContrast } from "@/components/art/RouteContrast";
import { STROKE } from "@/components/art/art-shared";

/**
 * The artwork behind each campaign slide and ad.
 *
 * Two visuals are only used here, so they live here rather than in
 * components/art: a bank glyph carrying a question mark, and a phone showing
 * an instant confirmation. Both are drawn as paths — the question mark is a
 * pictogram, not a label, and there are still no numerals or words inside any
 * SVG on this site.
 */
export function SlideVisual({
  kind,
  className,
}: {
  kind: "speed" | "bank" | "feestack" | "phone" | "route" | "offer";
  className?: string;
}) {
  if (kind === "speed") return <SpeedContrast className={className} />;
  if (kind === "feestack") return <FeeStack className={className} />;
  if (kind === "route") return <RouteContrast className={className} decorative />;

  if (kind === "bank") {
    return (
      <svg
        viewBox="0 0 200 160"
        className={className}
        fill="none"
        role="img"
        aria-label="A bank building with a question mark hanging over it"
      >
        <title>A bank building with a question mark hanging over it</title>
        {/* Bank: pediment, columns, plinth. */}
        <path d="M40 66 L100 38 L160 66 Z" stroke="var(--line)" strokeWidth={STROKE} strokeLinejoin="round" />
        <path d="M40 70 h120" stroke="var(--line)" strokeWidth={STROKE} strokeLinecap="round" />
        {[58, 82, 106, 130].map((x) => (
          <path key={x} d={`M${x} 74 v42`} stroke="var(--line)" strokeWidth={STROKE} strokeLinecap="round" />
        ))}
        <path d="M36 120 h128" stroke="var(--line)" strokeWidth="2" strokeLinecap="round" />

        {/* The question, drawn rather than typed. */}
        <path
          d="M92 24 a10 10 0 1 1 10 10 v6"
          stroke="var(--accent)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="102" cy="48" r="2.4" fill="var(--accent)" />
      </svg>
    );
  }

  if (kind === "phone") {
    return (
      <svg
        viewBox="0 0 200 160"
        className={className}
        fill="none"
        role="img"
        aria-label="A phone showing an instant confirmation tick"
      >
        <title>A phone showing an instant confirmation tick</title>
        <rect x="70" y="16" width="60" height="128" rx="9" stroke="var(--line)" strokeWidth={STROKE} />
        <path d="M90 26 h20" stroke="var(--line)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="100" cy="80" r="22" fill="var(--accent)" />
        <path
          d="M90 80 l7 7 l14 -15"
          stroke="var(--bg)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Two settled lines beneath, standing in for a receipt. */}
        <path d="M82 116 h36 M88 126 h24" stroke="var(--line)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // offer — Amber, and only ever on a Conversion-stage asset.
  return (
    <svg
      viewBox="0 0 200 160"
      className={className}
      fill="none"
      role="img"
      aria-label="A highlighted panel marking the first-transfer offer"
    >
      <title>A highlighted panel marking the first-transfer offer</title>
      <rect
        x="24"
        y="40"
        width="152"
        height="80"
        rx="6"
        stroke="var(--highlight)"
        strokeWidth="2"
        fill="color-mix(in srgb, var(--highlight) 10%, transparent)"
      />
      <path d="M44 74 L84 74 L124 54" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="44" cy="74" r="5" fill="var(--mark)" />
      <circle cx="84" cy="74" r="5" fill="var(--accent)" />
      <circle cx="124" cy="54" r="5" fill="var(--mark)" />
      <path d="M44 96 h72" stroke="var(--highlight)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
