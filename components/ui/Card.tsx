import { cn } from "@/lib/cn";

/**
 * Card — a raised panel on --surface with a hairline border.
 *
 * Radius comes from the mode token (2px institutional, 16px personal), which
 * is most of why the same component reads as an instrument panel in one mode
 * and a friendly card in the other.
 */
export function Card({
  children,
  className,
  padded = true,
  raised = false,
  as: Tag = "div",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  /** Uses --surface-2 — for nested panels and table rows. */
  raised?: boolean;
  as?: "div" | "article" | "li" | "section";
  style?: React.CSSProperties;
}) {
  return (
    <Tag
      className={cn("border", padded && "p-5 sm:p-6", className)}
      style={{
        background: raised ? "var(--surface-2)" : "var(--surface)",
        borderColor: "var(--line)",
        borderRadius: "var(--radius-lg)",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
