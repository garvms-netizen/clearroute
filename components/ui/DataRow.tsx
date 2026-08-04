import { cn } from "@/lib/cn";

/**
 * DataRow — label on the left, mono value on the right, hairline beneath.
 *
 * The workhorse of institutional mode. Used for the pricing model, the
 * itemised fee breakdown, the regulatory posture table, and the corridor
 * list. Composes into a <dl>; pass `as="div"` when the parent isn't one.
 */
export function DataRow({
  label,
  value,
  note,
  accent = false,
  strong = false,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Small dim line under the label — for "standard 0.40%" style asides. */
  note?: React.ReactNode;
  /** Teal value — waived fees, locked rates, the figures that carry weight. */
  accent?: boolean;
  /** The total row. */
  strong?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-6 border-b py-3",
        className,
      )}
      style={{ borderColor: "var(--line)" }}
    >
      <dt className="min-w-0">
        <span
          className={cn("text-sm", strong && "font-semibold")}
          style={{ color: strong ? "var(--text)" : "var(--text-dim)" }}
        >
          {label}
        </span>
        {note && (
          <span
            className="mt-0.5 block text-xs"
            style={{ color: "var(--text-dim)" }}
          >
            {note}
          </span>
        )}
      </dt>
      {/* min-w-0 rather than shrink-0. Short mono figures never wrap anyway,
          but a long prose value in a shrink-0 box cannot break — one such row
          measured 403px inside a 360px viewport and pushed the whole page
          sideways. */}
      <dd
        className={cn(
          "mono min-w-0 text-right text-sm text-pretty",
          strong && "text-base font-medium",
        )}
        style={{ color: accent ? "var(--accent-ink)" : "var(--text)" }}
      >
        {value}
      </dd>
    </div>
  );
}

/** Wrapper that makes a run of DataRows a proper definition list. */
export function DataList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <dl
      className={cn("border-t", className)}
      style={{ borderColor: "var(--line)" }}
    >
      {children}
    </dl>
  );
}
