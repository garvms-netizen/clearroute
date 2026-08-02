import { cn } from "@/lib/cn";

/**
 * Badge — a small mono chip. Mode labels, funnel stages, PLANNED markers,
 * "Illustrative scenario" tags.
 */
type Tone = "neutral" | "accent" | "warn" | "muted";

// Label takes the ink variant, border keeps the full-strength colour — the
// badge stays visually teal/amber while the 10px text stays readable.
const TONES: Record<Tone, React.CSSProperties> = {
  neutral: { color: "var(--text)", borderColor: "var(--line)" },
  accent: { color: "var(--accent-ink)", borderColor: "var(--accent)" },
  warn: { color: "var(--highlight-ink)", borderColor: "var(--highlight)" },
  muted: { color: "var(--text-dim)", borderColor: "var(--line)" },
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "mono inline-flex items-center border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] whitespace-nowrap",
        className,
      )}
      style={{ ...TONES[tone], borderRadius: "var(--radius)" }}
    >
      {children}
    </span>
  );
}
