"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";
import { ConceptNote } from "./ConceptNote";
import { SlideVisual } from "./SlideVisual";
import { CHANNELS, FUNNEL } from "@/lib/campaign";

/** Each channel card previews its own first asset, live-rendered. */
const THUMBS: Record<string, Parameters<typeof SlideVisual>[0]["kind"]> = {
  Instagram: "speed",
  LinkedIn: "feestack",
  "Search & social ads": "bank",
  Email: "phone",
  "Blog & SEO": "feestack",
  "Product demo": "route",
};

export function PresenceIndex() {
  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="OUR PRESENCE"
          level={1}
          title="One campaign. Every channel. One argument."
          lede="Every asset below was built from the same foundation — the same two audiences, the same voice, the same five claims. Nothing here contradicts anything else here."
        />
        <div className="mt-8">
          <ConceptNote />
        </div>
      </div>

      {/* ---------- Channel grid ---------- */}
      <Section labelledBy="channels">
        <h2 id="channels" className="sr-only">
          Channels
        </h2>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CHANNELS.map((c) => (
            <li key={c.name}>
              <Link
                href={c.href}
                className="group flex h-full flex-col overflow-hidden border transition-colors"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--line)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <span
                  className="flex items-center justify-center px-6 py-6"
                  style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--line)" }}
                >
                  <SlideVisual kind={THUMBS[c.name] ?? "route"} className="h-24" />
                </span>

                <span className="flex flex-1 flex-col p-5">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>
                      {c.name}
                    </span>
                    <span className="mono text-[11px]" style={{ color: "var(--text-dim)" }}>
                      {c.assets} assets
                    </span>
                  </span>

                  <span
                    className="mt-2 flex-1 text-[13px] leading-relaxed"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {c.blurb}
                  </span>

                  <span className="mt-4 flex flex-wrap items-center gap-1.5">
                    <Badge tone="muted">{c.persona}</Badge>
                    {c.stages.map((s) => (
                      <Badge key={s} tone={s === "Conversion" ? "warn" : "accent"}>
                        {s}
                      </Badge>
                    ))}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------- Funnel ---------- */}
      <Section labelledBy="funnel">
        <SectionHeader
          id="funnel"
          eyebrow="THE FUNNEL"
          title="Where each asset sits, and why."
          lede="The stage labels on the cards above map to these six. The one rule worth stating plainly: the zero-markup offer lives at Conversion and nowhere earlier."
        />

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)" }}>
                {["Stage", "Objective", "Channels", "Offer / feature emphasis"].map((h) => (
                  <th key={h} className="eyebrow px-3 py-2.5 align-bottom">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FUNNEL.map((f) => (
                <tr key={f.n} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td className="px-3 py-3 align-top">
                    <span className="mono text-[11px]" style={{ color: "var(--text-dim)" }}>
                      {f.n}
                    </span>{" "}
                    <span className="text-[13px] font-semibold">{f.stage}</span>
                  </td>
                  <td
                    className="px-3 py-3 align-top text-[13px] leading-relaxed"
                    style={{ color: "var(--text-dim)", maxWidth: "34ch" }}
                  >
                    {f.objective}
                  </td>
                  <td
                    className="px-3 py-3 align-top text-[13px]"
                    style={{ color: "var(--text-dim)", maxWidth: "24ch" }}
                  >
                    {f.channels}
                  </td>
                  <td
                    className="px-3 py-3 align-top text-[13px] leading-relaxed"
                    style={{
                      color: f.stage === "Conversion" ? "var(--highlight-ink)" : "var(--text-dim)",
                      maxWidth: "30ch",
                    }}
                  >
                    {f.emphasis}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p
          className="mt-5 text-[13px] leading-relaxed"
          style={{ color: "var(--text-dim)", maxWidth: "var(--measure)" }}
        >
          A risk-reversal offer only persuades someone who already understands
          the risk they are being asked to take. Led with too early it reads as
          a discount, attracts price-shoppers who churn, and trains the market
          to distrust the standard price. So no Awareness or Interest asset in
          this campaign mentions it — a rule the build checks rather than
          trusts.
        </p>
      </Section>
    </>
  );
}
