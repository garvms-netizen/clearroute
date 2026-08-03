import { cn } from "@/lib/cn";

/**
 * PhoneFrame — a generic device shell for the social channel previews.
 *
 * Deliberately not a replica of any real handset: a plain rounded rectangle,
 * a speaker slot, and a home indicator, drawn in Clear Route's own tokens.
 * The presence pages are concept previews, and imitating a manufacturer's
 * industrial design would undercut that framing as much as copying a
 * platform's UI chrome would.
 */
export function PhoneFrame({
  children,
  className,
  width = 320,
  /** Shown in the status bar strip. Kept generic — no carrier, no real time. */
  statusLabel,
}: {
  children: React.ReactNode;
  className?: string;
  width?: number;
  statusLabel?: string;
}) {
  return (
    <div
      className={cn("shrink-0 overflow-hidden", className)}
      style={{
        width,
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: 28,
        padding: 8,
        boxShadow: "none", // flat system — no drop shadows anywhere
      }}
    >
      <div
        className="overflow-hidden"
        style={{
          background: "var(--bg)",
          border: "1px solid var(--line)",
          borderRadius: 21,
        }}
      >
        {/* Status strip — a speaker slot and an optional label, nothing more. */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          <span
            className="mono text-[9px] tracking-[0.12em] uppercase"
            style={{ color: "var(--text-dim)" }}
          >
            {statusLabel ?? ""}
          </span>
          <span
            aria-hidden="true"
            style={{
              display: "block",
              width: 34,
              height: 4,
              borderRadius: 2,
              background: "var(--line)",
            }}
          />
          <span style={{ width: 40 }} />
        </div>

        {children}

        {/* Home indicator. */}
        <div className="flex justify-center py-2">
          <span
            aria-hidden="true"
            style={{
              display: "block",
              width: 92,
              height: 4,
              borderRadius: 2,
              background: "var(--line)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
