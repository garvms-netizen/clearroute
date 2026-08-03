"use client";

import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";
import { ConceptNote } from "./ConceptNote";
import { InstagramApp } from "./platform/InstagramApp";
import { IG_CAROUSEL } from "@/lib/campaign";

/**
 * The Instagram channel page.
 *
 * The mockup itself is a platform-accurate phone screen (see
 * platform/InstagramApp) rather than the asset restyled in Clear Route's
 * palette — a channel preview only tells you anything if it shows the asset
 * where it will actually be seen.
 *
 * The slide inventory beside it stays in the site's own styling, because that
 * is documentation *about* the campaign rather than a preview *of* it.
 */
export function InstagramPreview() {
  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="OUR PRESENCE · INSTAGRAM"
          level={1}
          title="The awareness layer, built for a silent scroll."
          lede="A six-slide carousel aimed at Priya — the freelancer, the parent paying tuition, the person sending money themselves. It argues from a familiar experience rather than from product features, and never mentions the offer."
        />
        <div className="mt-8">
          <ConceptNote channel="Instagram" />
        </div>
      </div>

      <Section labelledBy="ig-mockup">
        <h2 id="ig-mockup" className="sr-only">
          Instagram profile mockup
        </h2>

        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start">
          <InstagramApp />

          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge tone="accent">Awareness</Badge>
              <Badge tone="muted">Priya</Badge>
              <span className="mono text-[11px]" style={{ color: "var(--text-dim)" }}>
                6 slides · 1:1 with a 4:5 variant
              </span>
            </div>

            <p
              className="mb-5 text-[14px] leading-relaxed"
              style={{ color: "var(--text-dim)", maxWidth: "62ch" }}
            >
              Tap any tile in the mockup to open it. The first tile is the
              six-slide carousel; the arrows and dots work exactly as they would
              on the phone.
            </p>

            <ol className="border-t" style={{ borderColor: "var(--line)" }}>
              {IG_CAROUSEL.map((s) => (
                <li
                  key={s.n}
                  className="flex items-start gap-4 border-b py-3.5"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span className="mono shrink-0 text-[11px]" style={{ color: "var(--accent-ink)" }}>
                    {String(s.n).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-[14px] leading-snug" style={{ color: "var(--text)" }}>
                      {s.copy}
                    </span>
                    {s.sub && (
                      <span className="mt-1 block text-[12px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
                        {s.sub}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>

            <p
              className="mt-5 text-[12px] leading-relaxed"
              style={{ color: "var(--text-dim)", maxWidth: "62ch" }}
            >
              Online ordering is referenced generically and never by brand name.
              Google Pay is named in slide 4&rsquo;s copy only — never depicted,
              and never implying a partnership. Amber appears on slide 6 alone,
              which is the only Conversion-stage asset in this set.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
