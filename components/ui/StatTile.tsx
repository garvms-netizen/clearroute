import { cn } from "@/lib/cn";

/**
 * StatTile — a mono figure above its label.
 *
 * The figure is deliberately larger than the label it belongs to: in this
 * brand the number is the claim, and the words are the caption.
 */
export function StatTile({
  figure,
  label,
  accent = false,
  size = "md",
  className,
}: {
  figure: string;
  label: string;
  /** Teal — for the figures that carry the argument. */
  accent?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const figureSize = {
    sm: "text-xl sm:text-2xl",
    md: "text-2xl sm:text-3xl",
    lg: "text-3xl sm:text-4xl",
  }[size];

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span
        className={cn("mono font-medium leading-none", figureSize)}
        style={{ color: accent ? "var(--accent-ink)" : "var(--text)" }}
      >
        {figure}
      </span>
      <span
        className="text-[13px] leading-snug"
        style={{ color: "var(--text-dim)" }}
      >
        {label}
      </span>
    </div>
  );
}
