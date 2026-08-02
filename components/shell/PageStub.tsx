import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * A placeholder for routes not yet built out.
 *
 * Exists so the whole sitemap is navigable from Stage 3 onward — routing,
 * mode inheritance and the header/footer can be checked across every page
 * before any page has content. Each stub names the stage that will replace
 * it, so a half-built site never looks accidentally broken.
 */
export function PageStub({
  eyebrow,
  title,
  stage,
  children,
}: {
  eyebrow: string;
  title: string;
  stage: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-[var(--section-y)] sm:px-6">
      <SectionHeader eyebrow={eyebrow} title={title} level={1} />
      <div className="mt-6">
        <Badge tone="muted">Builds in {stage}</Badge>
      </div>
      {children && <div className="mt-8">{children}</div>}
    </div>
  );
}
