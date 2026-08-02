import { a11yProps, type ArtProps } from "./art-shared";

/**
 * WorldPresence — a dot-grid world with the supported corridors lit.
 *
 * Fourteen nodes in Signal Teal joined by hairlines back to a single origin,
 * which is India: this is an India-outbound product, and a map showing
 * connections in every direction would overstate what the corridor list on
 * the page actually claims. Corridor names live in HTML beside the graphic.
 */
export function WorldPresence({
  className,
  title = "A dotted world map with fourteen supported corridors lit and connected back to a single origin",
  decorative,
}: ArtProps) {
  const dots: Array<[number, number]> = [];
  for (let y = 20; y <= 176; y += 16) {
    for (let x = 20; x <= 620; x += 16) {
      const edge = Math.abs(x - 320) / 320;
      const vert = Math.abs(y - 98) / 98;
      if (edge * edge + vert * vert > 1.05) continue;
      dots.push([x, y]);
    }
  }

  const origin: [number, number] = [420, 116];
  const corridors: Array<[number, number]> = [
    [116, 84], [148, 116], [180, 60], [212, 132],
    [268, 52], [300, 100], [332, 148], [364, 68],
    [468, 76], [500, 140], [532, 92], [564, 60],
    [396, 164], [244, 92],
  ];

  return (
    <svg
      viewBox="0 0 640 196"
      className={className}
      fill="none"
      {...a11yProps(title, decorative)}
    >
      {!decorative && <title>{title}</title>}

      <g opacity="0.45">
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.4" fill="var(--line)" />
        ))}
      </g>

      <g opacity="0.5">
        {corridors.map(([x, y], i) => (
          <path
            key={i}
            d={`M${origin[0]} ${origin[1]} Q${(origin[0] + x) / 2} ${Math.min(origin[1], y) - 26} ${x} ${y}`}
            stroke="var(--accent)"
            strokeWidth="1"
          />
        ))}
      </g>

      {corridors.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="var(--accent)" />
      ))}

      <circle cx={origin[0]} cy={origin[1]} r="7" fill="var(--mark)" />
    </svg>
  );
}
