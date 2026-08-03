"use client";

import { useState } from "react";
import { useMode } from "@/components/ModeProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Rating } from "@/components/ui/Rating";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatTile } from "@/components/ui/StatTile";
import { Section } from "@/components/home/Section";
import { WorldPresence } from "@/components/art/WorldPresence";
import { CASE_STUDIES, TESTIMONIALS, TRUST_ROW } from "@/lib/testimonials";
import { TESTIMONIAL_DISCLOSURE } from "@/lib/copy";
import type { Mode } from "@/lib/mode";

/**
 * /customers, §12.
 *
 * The disclosure comes first, above the fold, before a single quote. That
 * ordering is the whole point: fabricated reviews presented as real are an
 * ethical problem anywhere and a regulatory one in financial services, and
 * labelling them costs nothing. Putting the label after the testimonials
 * would let someone read and believe them first, which is the same as not
 * labelling them.
 */

type Filter = "all" | Mode;

export function CustomersPage() {
  const { mode } = useMode();
  // Defaults to the visitor's own mode, per §12.1 — a finance manager should
  // land on the business stories without having to filter for them.
  const [filter, setFilter] = useState<Filter>(mode);

  const shown = TESTIMONIALS.filter((t) => filter === "all" || t.audience === filter);
  const studies = CASE_STUDIES;

  const FILTERS: Array<{ id: Filter; label: string }> = [
    { id: "all", label: "All" },
    { id: "institutional", label: "Businesses" },
    { id: "personal", label: "Individuals" },
  ];

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="CUSTOMERS"
          level={1}
          title="Built for two very different people."
          lede="A finance manager signing off on vendor payments, and someone sending a tuition fee they cannot afford to lose. The same mechanisms serve both — the reassurance each one needs is completely different."
        />

        {/* Prominent, not buried. This is non-negotiable. */}
        <Callout variant="project-note" className="mt-8">
          <strong style={{ color: "var(--text)" }}>Illustrative testimonials.</strong>{" "}
          {TESTIMONIAL_DISCLOSURE.replace("Illustrative testimonials. ", "")}
        </Callout>
      </div>

      {/* ---------- Trust row ---------- */}
      <Section labelledBy="trust">
        <h2 id="trust" className="sr-only">
          Product figures
        </h2>
        <div
          className="grid gap-px sm:grid-cols-2 lg:grid-cols-4"
          style={{ background: "var(--line)" }}
        >
          {TRUST_ROW.map((t) => (
            <div key={t.figure} className="p-4" style={{ background: "var(--bg)" }}>
              <StatTile figure={t.figure} label={t.label} size="sm" accent />
            </div>
          ))}
        </div>
        <p className="mono mt-3 text-[11px]" style={{ color: "var(--text-dim)" }}>
          Illustrative product figures, consistent with the worked example on the
          pricing page and in the demo.
        </p>
      </Section>

      {/* ---------- Segmented testimonials ---------- */}
      <Section labelledBy="stories">
        <SectionHeader id="stories" eyebrow="IN THEIR WORDS" title="Written personas" />

        <div
          className="mt-6 flex flex-wrap gap-px"
          role="group"
          aria-label="Filter testimonials by audience"
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className="border px-4 py-2 text-[13px]"
                style={{
                  background: active ? "var(--surface-2)" : "transparent",
                  borderColor: active ? "var(--accent)" : "var(--line)",
                  color: active ? "var(--text)" : "var(--text-dim)",
                  borderRadius: "var(--radius)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((t) => (
            <Card key={t.name} as="article" className="flex flex-col">
              <div className="flex items-center justify-between gap-3">
                <Rating value={5} />
                <Badge tone="muted">
                  {t.audience === "institutional" ? "Business" : "Individual"}
                </Badge>
              </div>
              <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <footer className="mt-4">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-[13px]" style={{ color: "var(--text-dim)" }}>
                  {t.role}, {t.context}
                </p>
                <p className="mono mt-2 text-[11px]" style={{ color: "var(--text-dim)" }}>
                  {t.corridor} · {t.stat}
                </p>
              </footer>
            </Card>
          ))}
        </div>

        {shown.length === 0 && (
          <p className="mt-8 text-sm" style={{ color: "var(--text-dim)" }}>
            No stories in this segment yet.
          </p>
        )}
      </Section>

      {/* ---------- Case studies ---------- */}
      <Section labelledBy="scenarios">
        <SectionHeader
          id="scenarios"
          eyebrow="SCENARIOS"
          title="How the pieces get used together."
          lede="Three situations the product was designed around. Each describes an intended use, not an engagement that happened."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {studies.map((c) => (
            <Card key={c.id} as="article" className="flex flex-col">
              <Badge tone="muted">Illustrative scenario</Badge>
              <h3 className="mt-3 text-[16px] font-semibold">{c.title}</h3>
              <dl className="mt-4 flex-1 space-y-3">
                {[
                  ["Situation", c.situation],
                  ["What changed", c.change],
                  ["Outcome", c.outcome],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="eyebrow mb-1">{k}</dt>
                    <dd className="text-[13px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          ))}
        </div>
      </Section>

      {/* ---------- Where we operate ---------- */}
      <Section labelledBy="corridors">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <SectionHeader
            id="corridors"
            eyebrow="CORRIDORS"
            title="Where these transfers go."
            lede="India outbound, across the corridors these personas actually use — USD, EUR and GBP most, with AED, SGD, AUD and CAD behind them."
          />
          <WorldPresence className="w-full" />
        </div>
      </Section>

      {/* ---------- Closing ---------- */}
      <Section labelledBy="closing">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 id="closing" className="text-[20px] font-semibold sm:text-[24px]">
              Every number on this page is illustrative.
            </h2>
            <p
              className="mt-2 text-[15px]"
              style={{ color: "var(--text-dim)", maxWidth: "var(--measure)" }}
            >
              And consistent with the figures shown in the product demo — the
              same worked example, the same rate, the same hop counts.
            </p>
          </div>
          <Button
            href={mode === "institutional" ? "/institutional/callback" : "/personal/get-the-app"}
            size="lg"
          >
            {mode === "institutional" ? "Request a callback" : "Get the app"}
          </Button>
        </div>
      </Section>
    </>
  );
}
