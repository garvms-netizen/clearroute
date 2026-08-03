import { RouteMark } from "./RouteMark";

/**
 * Wordmark — set in real type rather than drawn, so it stays crisp at every
 * size and inherits the mode's text colour without a second asset.
 * RouteMark sits at cap height to its left.
 */
export function Wordmark({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <RouteMark size={size} decorative />
      <span
        className="font-semibold whitespace-nowrap"
        style={{
          fontSize: size * 0.82,
          letterSpacing: "-0.02em",
          // Two words need a line-height above zero or the descender in the
          // space between them clips at small sizes; leading-none was fine for
          // a single lowercase word and is not here.
          lineHeight: 1.1,
          color: "var(--text)",
        }}
      >
        Clear Route
      </span>
    </span>
  );
}
