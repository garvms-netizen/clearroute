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
      <dd
        className={cn(
          "mono shrink-0 text-right text-sm",
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
