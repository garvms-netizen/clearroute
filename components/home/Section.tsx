import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";

/**
 * A home page section.
 *
 * Vertical rhythm comes from --section-y, which is 48px institutional and
 * 96px personal — one of the larger contributors to the two modes reading as
 * different companies from identical markup. Institutional additionally gets
 * a hairline top rule, because dense rule-work is its register.
 */
export function Section({
  children,
  className,
  ruled = true,
  id,
  labelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  /** Hairline top rule. Institutional only — CSS decides. */
  ruled?: boolean;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "px-4 py-[var(--section-y)] sm:px-6",
        ruled && "[[data-mode='institutional']_&]:border-t",
        className,
      )}
      style={{ borderColor: "var(--line)" }}
    >
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>{children}</Reveal>
      </div>
    </section>
  );
}
