"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import { Section } from "@/components/home/Section";
import { ConceptNote } from "./ConceptNote";
import { SlideVisual } from "./SlideVisual";
import { SEARCH_ADS, SOCIAL_ADS } from "@/lib/campaign";

/**
 * Search and paid-social ad previews.
 *
 * Generic result-style and paid-social cards in ClearRoute's palette — not a
 * clone of any SERP unit or ad frame. Every landing page link is live, so a
 * reviewer can follow the intent straight through to the destination and
 * check that the promise on the ad is the promise on the page.
 */
export function CampaignsPreview() {
  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="OUR PRESENCE · ADS"
          level={1}
          title="Paid, matched to intent."
          lede="Three search ad groups and seven paid-social variants. Each is labelled with the keyword cluster or audience segment it runs against, and every landing page link below is live."
        />
        <div className="mt-8">
          <ConceptNote channel="search and social platforms" />
        </div>
      </div>

      <Section labelledBy="ads">
        <h2 id="ads" className="sr-only">
          Ad previews
        </h2>
        <Tabs
          label="Ad formats"
          tabs={[
            { id: "search", label: "Search ads", content: <SearchAds /> },
            { id: "social", label: "Social ads", content: <SocialAds /> },
          ]}
        />
      </Section>
    </>
  );
}

function SearchAds() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {SEARCH_ADS.map((g) => (
        <div key={g.id}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-semibold">{g.name}</span>
            <Badge tone="accent">{g.stage}</Badge>
          </div>

          {/* Generic result-style card — not a reproduction of any SERP unit. */}
          <div
            className="border p-4"
            style={{
              background: "var(--surface)",
              borderColor: "var(--line)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <p className="mono text-[10px] tracking-[0.1em] uppercase" style={{ color: "var(--text-dim)" }}>
              Sponsored
            </p>
            <p className="mono mt-1.5 text-[11px]" style={{ color: "var(--text-dim)" }}>
              clearroute.app{g.landing}
            </p>

            <Link
              href={g.landing}
              className="mt-1 block text-[16px] leading-snug font-medium underline-offset-4 hover:underline"
              style={{ color: "var(--accent-ink)" }}
            >
              {g.headlines[0]}
            </Link>

            <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
              {g.descriptions[0]}
            </p>

            {g.sitelinks && (
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {g.sitelinks.map((s) => (
                  <li key={s}>
                    <span className="text-[12px]" style={{ color: "var(--accent-ink)" }}>
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <dl className="mt-4 space-y-3">
            <div>
              <dt className="eyebrow mb-1">Keywords</dt>
              <dd className="mono text-[11px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
                {g.keywords.join(" · ")}
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">All headlines · ≤30 chars</dt>
              <dd className="text-[12px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
                {g.headlines.join(" · ")}
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">Descriptions · ≤90 chars</dt>
              <dd className="text-[12px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
                {g.descriptions.map((d) => (
                  <span key={d.slice(0, 20)} className="mb-1 block">
                    {d}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">Landing page</dt>
              <dd>
                <Link
                  href={g.landing}
                  className="mono text-[11px] underline underline-offset-4"
                  style={{ color: "var(--accent-ink)" }}
                >
                  {g.landing} →
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
}

function SocialAds() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {SOCIAL_ADS.map((ad) => (
        <article
          key={ad.id}
          className="flex flex-col overflow-hidden border"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <div className="flex flex-wrap items-center gap-2 p-4 pb-3">
            <Badge tone={ad.stage === "Conversion" ? "warn" : "accent"}>{ad.stage}</Badge>
            <span className="mono text-[10px]" style={{ color: "var(--text-dim)" }}>
              {ad.audience}
            </span>
          </div>

          <p className="px-4 pb-4 text-[13px] leading-relaxed" style={{ color: "var(--text)" }}>
            {ad.primary}
          </p>

          <div
            className="flex items-center justify-center px-6 py-6"
            style={{
              background: "var(--surface-2)",
              borderTop: "1px solid var(--line)",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <SlideVisual kind={ad.visual} className="h-24" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <span className="min-w-0">
              <span className="mono block text-[10px]" style={{ color: "var(--text-dim)" }}>
                clearroute.app
              </span>
              <span className="block text-[14px] font-semibold" style={{ color: "var(--text)" }}>
                {ad.headline}
              </span>
            </span>
            <Button size="sm" variant="secondary" href="/personal/how-it-works">
              {ad.cta}
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
