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
        className="font-semibold leading-none"
        style={{
          fontSize: size * 0.82,
          letterSpacing: "-0.02em",
          color: "var(--text)",
        }}
      >
        clearroute
      </span>
    </span>
  );
}
