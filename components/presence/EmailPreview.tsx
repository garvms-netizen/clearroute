"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";
import { RouteMark } from "@/components/art/RouteMark";
import { TransferTimeline } from "@/components/art/TransferTimeline";
import { ConceptNote } from "./ConceptNote";
import { EMAILS, type EmailGroup } from "@/lib/campaign";

const GROUPS: EmailGroup[] = ["Conversion", "Onboarding", "Retention"];

/**
 * A stylised two-pane inbox — message list on the left, selected message on
 * the right, rendered in a Clear Route-branded template.
 *
 * Generic client styling, not a reproduction of any mail provider's UI. Merge
 * fields stay literal ({{first_name}}) because this is a campaign artifact
 * rather than a live send, and resolving them to invented names would make
 * these look like real messages to real people.
 */
export function EmailPreview() {
  const [group, setGroup] = useState<EmailGroup>("Conversion");
  const [selectedId, setSelectedId] = useState(EMAILS[0].id);

  const inGroup = EMAILS.filter((e) => e.group === group);
  const selected = EMAILS.find((e) => e.id === selectedId) ?? inGroup[0];

  const chooseGroup = (g: EmailGroup) => {
    setGroup(g);
    const first = EMAILS.find((e) => e.group === g);
    if (first) setSelectedId(first.id);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="OUR PRESENCE · EMAIL"
          level={1}
          title="Nine messages, each with one job."
          lede="The sequence that carries someone from signup to a completed first transfer, then to a second. Every message states what triggers it and what it is for — none of them are a generic newsletter."
        />
        <div className="mt-8">
          <ConceptNote channel="email" />
        </div>
      </div>

      <Section labelledBy="inbox">
        <h2 id="inbox" className="sr-only">
          Email sequence preview
        </h2>

        {/* Group tabs */}
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Sequence stage">
          {GROUPS.map((g) => {
            const active = group === g;
            const count = EMAILS.filter((e) => e.group === g).length;
            return (
              <button
                key={g}
                type="button"
                onClick={() => chooseGroup(g)}
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
                {g}{" "}
                <span className="mono text-[11px]" style={{ color: "var(--text-dim)" }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className="grid overflow-hidden border lg:grid-cols-[minmax(240px,320px)_1fr]"
          style={{ borderColor: "var(--line)", borderRadius: "var(--radius-lg)" }}
        >
          {/* Message list */}
          <ul
            className="lg:border-r"
            style={{ background: "var(--surface-2)", borderColor: "var(--line)" }}
          >
            {inGroup.map((e) => {
              const active = e.id === selected?.id;
              return (
                <li key={e.id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(e.id)}
                    aria-current={active}
                    className="w-full px-4 py-3.5 text-left"
                    style={{
                      background: active ? "var(--surface)" : "transparent",
                      borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                    }}
                  >
                    <span className="flex items-baseline gap-2">
                      <span className="mono shrink-0 text-[10px]" style={{ color: "var(--accent-ink)" }}>
                        {String(e.n).padStart(2, "0")}
                      </span>
                      <span
                        className="text-[13px] leading-snug font-medium"
                        style={{ color: "var(--text)" }}
                      >
                        {e.subject}
                      </span>
                    </span>
                    <span
                      className="mt-1 block text-[11px] leading-relaxed"
                      style={{ color: "var(--text-dim)" }}
                    >
                      {e.trigger}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Selected message, in a Clear Route-branded template */}
          {selected && (
            <div style={{ background: "var(--surface)" }}>
              <div
                className="flex items-center gap-3 px-5 py-4"
                style={{ borderBottom: "1px solid var(--line)" }}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center"
                  style={{ background: "var(--brand)", borderRadius: "var(--radius)" }}
                >
                  <RouteMark size={16} decorative />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                    Clear Route
                  </span>
                  <span className="mono block text-[11px]" style={{ color: "var(--text-dim)" }}>
                    hello@clearroute.app → {"{{email}}"}
                  </span>
                </span>
                <Badge tone={selected.group === "Conversion" ? "warn" : "accent"}>
                  {selected.group}
                </Badge>
              </div>

              <div className="px-5 pt-5 pb-2">
                <p className="text-[17px] leading-snug font-semibold" style={{ color: "var(--text)" }}>
                  {selected.subject}
                </p>
                <p className="mt-1.5 text-[12px]" style={{ color: "var(--text-dim)" }}>
                  <span className="mono">Job:</span> {selected.job}
                </p>
              </div>

              <div className="flex gap-5 px-5 py-4">
                {/* The timeline in the header, per the brief's template. */}
                <TransferTimeline className="hidden h-40 shrink-0 sm:block" decorative />

                <div className="min-w-0 flex-1 space-y-3">
                  {selected.body.map((para) => (
                    <p
                      key={para.slice(0, 24)}
                      className="text-[13px] leading-relaxed"
                      style={{ color: "var(--text)", whiteSpace: "pre-line" }}
                    >
                      {para}
                    </p>
                  ))}

                  <div className="flex flex-wrap gap-2 pt-2">
                    {selected.buttons.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center px-4 py-2 text-[13px] font-medium"
                        style={{
                          background: "var(--accent)",
                          color: "#04211F",
                          border: "1px solid var(--accent-ink)",
                          borderRadius: "var(--radius)",
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p
                className="mono px-5 pt-2 pb-5 text-[10px] leading-relaxed"
                style={{ color: "var(--text-dim)", borderTop: "1px solid var(--line)" }}
              >
                Merge fields are shown literally. This is a campaign artifact,
                not a live send — nothing here was ever delivered to anyone.
              </p>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
