import { cn } from "@/lib/cn";

/**
 * The disclaimer that appears in the footer of every page.
 *
 * Exported as a constant as well as a component so the same wording can be
 * reused in metadata and in the legal pages without drifting.
 */
export const DISCLAIMER_TEXT =
  "Clear Route is a fictional company created for an academic marketing project. " +
  "It is not a real financial services provider, is not licensed or regulated, " +
  "and does not process real transactions. Do not submit sensitive financial information.";

export function Disclaimer({ className }: { className?: string }) {
  return (
    <p
      className={cn("text-[11px] leading-relaxed", className)}
      style={{ color: "var(--text-dim)", maxWidth: "72ch" }}
    >
      {DISCLAIMER_TEXT}
    </p>
  );
}
