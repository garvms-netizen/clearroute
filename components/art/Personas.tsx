import { a11yProps, STROKE, type ArtProps } from "./art-shared";

/**
 * PersonaRohan — a flat geometric figure at a desk, three-quarter view,
 * facing a monitor showing abstract bars and a line.
 *
 * The chart on the monitor is pure geometry with no readable labels, on
 * purpose: a legible figure on a decorative screen would be a number nobody
 * maintains, and it would contradict the real figures elsewhere on the page
 * the moment either changed. Features are simplified to a head shape — no
 * real or identifiable person.
 */
export function PersonaRohan({
  className,
  title = "A figure seated at a desk facing a monitor showing an abstract chart",
  decorative,
}: ArtProps) {
  return (
    <svg
      viewBox="0 0 260 200"
      className={className}
      fill="none"
      {...a11yProps(title, decorative)}
    >
      {!decorative && <title>{title}</title>}

      {/* Monitor */}
      <rect x="132" y="34" width="104" height="72" rx="3" stroke="var(--line)" strokeWidth={STROKE} />
      <path d="M184 106 v14 M168 120 h32" stroke="var(--line)" strokeWidth={STROKE} strokeLinecap="round" />

      {/* Abstract chart — bars plus one trend line. No axis, no labels. */}
      <rect x="146" y="76" width="10" height="18" fill="var(--line)" />
      <rect x="162" y="66" width="10" height="28" fill="var(--line)" />
      <rect x="178" y="82" width="10" height="12" fill="var(--line)" />
      <rect x="194" y="58" width="10" height="36" fill="var(--accent)" />
      <path
        d="M146 70 L167 60 L188 68 L212 48"
        stroke="var(--accent)"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Desk */}
      <path d="M24 148 h212" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" />

      {/* Figure, three-quarter, back to the viewer */}
      <circle cx="76" cy="66" r="18" fill="var(--mark)" />
      <path d="M46 148 Q48 96 76 96 Q104 96 106 148 Z" fill="var(--mark)" />
      {/* Forearm reaching toward the desk */}
      <path
        d="M104 120 Q126 122 134 140"
        stroke="var(--mark)"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* Chair back */}
      <path d="M40 196 v-38 a10 10 0 0 1 10 -10" stroke="var(--line)" strokeWidth={STROKE} strokeLinecap="round" />
    </svg>
  );
}

/**
 * PersonaPriya — a standing figure holding a phone showing a three-dot
 * progress indicator.
 *
 * The domestic setting is suggested with two shapes only, a window rectangle
 * and a chair outline, so the scene reads as home without becoming an
 * illustration of a specific home. Warm fills, matching the retail register.
 */
export function PersonaPriya({
  className,
  title = "A standing figure holding a phone that shows a three-step progress indicator, in a room suggested by a window and a chair",
  decorative,
}: ArtProps) {
  return (
    <svg
      viewBox="0 0 260 200"
      className={className}
      fill="none"
      {...a11yProps(title, decorative)}
    >
      {!decorative && <title>{title}</title>}

      {/* The room: two shapes, no more. */}
      <rect x="24" y="26" width="70" height="62" rx="2" stroke="var(--line)" strokeWidth={STROKE} />
      <path d="M59 26 v62 M24 57 h70" stroke="var(--line)" strokeWidth={STROKE} />
      <path
        d="M204 178 v-42 a12 12 0 0 1 12 -12 h14 a12 12 0 0 1 12 12 v42"
        stroke="var(--line)"
        strokeWidth={STROKE}
        strokeLinecap="round"
      />

      {/* Figure */}
      <circle cx="132" cy="62" r="19" fill="var(--warm)" />
      <path d="M100 180 Q102 94 132 94 Q162 94 164 180 Z" fill="var(--warm)" />

      {/* Phone, held at reading height */}
      <rect
        x="150"
        y="106"
        width="34"
        height="52"
        rx="5"
        fill="var(--surface)"
        stroke="var(--text)"
        strokeWidth={STROKE}
      />
      {/* Three-dot progress: two done, one pending. */}
      <circle cx="160" cy="132" r="3.5" fill="var(--accent)" />
      <circle cx="167" cy="132" r="3.5" fill="var(--accent)" />
      <circle cx="174" cy="132" r="3.5" fill="var(--line)" />

      {/* Arm to the phone */}
      <path
        d="M158 122 Q146 118 140 112"
        stroke="var(--warm)"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}
