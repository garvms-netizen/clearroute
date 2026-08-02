import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

/**
 * Callout — info, offer, project-note.
 *
 * `offer` is the Amber one. It carries the first-transfer terms and appears
 * **exactly once per page, nowhere else** — Amber is reserved for it across
 * the whole project, which is what keeps it meaning something.
 *
 * `project-note` is the fictional-company disclosure. It is deliberately
 * styled *unlike* product copy — dashed rule, no fill, mono label — so a
 * reader can tell at a glance that it is the project speaking about itself
 * rather than ClearRoute making a claim. Blending it in would defeat it.
 */
type Variant = "info" | "offer" | "project-note";

export function Callout({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (variant === "project-note") {
    return (
      <aside
        className={cn("border border-dashed p-4 sm:p-5", className)}
        style={{
          borderColor: "var(--text-dim)",
          borderRadius: "var(--radius)",
          background: "transparent",
        }}
      >
        <Eyebrow className="mb-2">Project note</Eyebrow>
        <div
          className="text-[13px] leading-relaxed"
          style={{ color: "var(--text-dim)", maxWidth: "68ch" }}
        >
          {children}
        </div>
      </aside>
    );
  }

  if (variant === "offer") {
    return (
      <aside
        className={cn("border p-5 sm:p-6", className)}
        style={{
          borderColor: "var(--highlight)",
          borderRadius: "var(--radius-lg)",
          // A wash rather than a fill: Amber at full strength behind text
          // fails contrast in personal mode and shouts in institutional.
          background: "color-mix(in srgb, var(--highlight) 8%, transparent)",
        }}
      >
        {title && (
          <p
            className="mb-2 text-[15px] font-semibold"
            style={{ color: "var(--highlight-ink)" }}
          >
            {title}
          </p>
        )}
        <div
          className="text-[13px] leading-relaxed sm:text-sm"
          style={{ color: "var(--text)", maxWidth: "68ch" }}
        >
          {children}
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn("border-l-2 py-3 pl-4", className)}
      style={{ borderColor: "var(--accent)" }}
    >
      {title && (
        <p className="mb-1 text-sm font-semibold" style={{ color: "var(--text)" }}>
          {title}
        </p>
      )}
      <div
        className="text-[13px] leading-relaxed sm:text-sm"
        style={{ color: "var(--text-dim)", maxWidth: "68ch" }}
      >
        {children}
      </div>
    </aside>
  );
}
