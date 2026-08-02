import { RouteGlyph } from "@/components/art/RouteMark";

/**
 * Rating — five RouteMark nodes rather than five stars.
 *
 * A small brand-native touch: the rating row reads as a route, which is the
 * one shape this brand owns. Stars would be the generic choice.
 */
export function Rating({
  value,
  outOf = 5,
  size = 14,
}: {
  value: number;
  outOf?: number;
  size?: number;
}) {
  return (
    <span
      className="inline-flex items-center gap-1"
      role="img"
      aria-label={`Rated ${value} out of ${outOf}`}
    >
      {Array.from({ length: outOf }, (_, i) => (
        <RouteGlyph key={i} filled={i < value} size={size} />
      ))}
    </span>
  );
}
