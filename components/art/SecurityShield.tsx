import { a11yProps, STROKE, type ArtProps } from "./art-shared";

/**
 * SecurityShield — a shield built out of the route motif.
 *
 * The same three-node line the logo uses, enclosed in a shield silhouette.
 * The argument is deliberate: safety here comes from a path you can see, not
 * from an opaque vault. A padlock would say the opposite of what this page
 * claims, which is that visibility *is* the security model.
 */
export function SecurityShield({
  className,
  title = "A shield outline enclosing the Clear Route three-node route line",
  decorative,
}: ArtProps) {
  return (
    <svg
      viewBox="0 0 160 180"
      className={className}
      fill="none"
      {...a11yProps(title, decorative)}
    >
      {!decorative && <title>{title}</title>}

      <path
        d="M80 8 L146 34 V88 C146 128 116 156 80 172 C44 156 14 128 14 88 V34 Z"
        stroke="var(--line)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* The mark's own geometry, scaled into the shield. */}
      <path
        d="M42 108 L80 108 L118 62"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="42" cy="108" r="6" fill="var(--mark)" />
      <circle cx="80" cy="108" r="6" fill="var(--accent)" />
      <circle cx="118" cy="62" r="6" fill="var(--mark)" />

      {/* Hairline inner rule, echoing the dense rule-work of institutional mode. */}
      <path
        d="M28 44 V88 C28 118 52 140 80 154"
        stroke="var(--line)"
        strokeWidth={STROKE}
        opacity="0.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
