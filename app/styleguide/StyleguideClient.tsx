"use client";

import { useState } from "react";
import type { Mode } from "@/lib/mode";
import { OFFER_TERMS, OFFER_HEADLINE, OFFER_NO_PRESSURE } from "@/lib/copy";

import { RouteMark } from "@/components/art/RouteMark";
import { Wordmark } from "@/components/art/Wordmark";
import { RouteContrast } from "@/components/art/RouteContrast";
import { GlobeConnection } from "@/components/art/GlobeConnection";
import { FeeStack } from "@/components/art/FeeStack";
import { SpeedContrast } from "@/components/art/SpeedContrast";
import { TransferTimeline } from "@/components/art/TransferTimeline";
import { PersonaRohan, PersonaPriya } from "@/components/art/Personas";
import { WorldPresence } from "@/components/art/WorldPresence";
import { SecurityShield } from "@/components/art/SecurityShield";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { DataList, DataRow } from "@/components/ui/DataRow";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Modal } from "@/components/ui/Modal";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { PostCard } from "@/components/ui/PostCard";
import { Rating } from "@/components/ui/Rating";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatTile } from "@/components/ui/StatTile";
import { Tabs } from "@/components/ui/Tabs";
import { VideoPlayer } from "@/components/ui/VideoPlayer";

const MODES: Mode[] = ["institutional", "personal"];

/**
 * Renders its children once per mode, side by side.
 *
 * The token blocks are plain attribute selectors, so `data-mode` scopes them
 * to any subtree — not just <html>. That is what makes a true side-by-side
 * comparison possible on one page rather than requiring two screenshots.
 */
function Both({
  children,
}: {
  children: (mode: Mode) => React.ReactNode;
}) {
  return (
    <div className="grid gap-px sm:grid-cols-2" style={{ background: "#2a3444" }}>
      {MODES.map((m) => (
        <div
          key={m}
          data-mode={m}
          className="p-5 sm:p-6"
          style={{ background: "var(--bg)", color: "var(--text)" }}
        >
          <p
            className="mono mb-4 text-[10px] tracking-[0.14em] uppercase"
            style={{ color: "var(--text-dim)" }}
          >
            {m}
          </p>
          {children(m)}
        </div>
      ))}
    </div>
  );
}

function Spec({
  name,
  note,
  children,
}: {
  name: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-2 flex flex-wrap items-baseline gap-3">
        <h2 className="mono text-sm font-semibold text-white">{name}</h2>
        {note && <p className="text-xs text-neutral-400">{note}</p>}
      </div>
      <div className="overflow-hidden border border-neutral-700">{children}</div>
    </section>
  );
}

export function StyleguideClient() {
  const [modalOpen, setModalOpen] = useState(false);
  const [slide, setSlide] = useState(0);

  return (
    // The frame itself is mode-agnostic neutral so neither palette gets a
    // sympathetic backdrop that flatters it.
    <main className="min-h-screen bg-neutral-900 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="mono text-[10px] tracking-[0.14em] text-neutral-500 uppercase">
            Internal · not linked from navigation · noindex
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            Clear Route component styleguide
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-400">
            Every component from §5.3 rendered in both modes. Each pair below is
            the same component with the same props — only the{" "}
            <code className="text-neutral-300">data-mode</code> wrapper differs.
            Colour, radius, rhythm and transition speed all come from tokens, so
            no component knows which mode it is in.
          </p>
        </header>

        <Spec name="RouteMark · Wordmark" note="20 / 24 / 40px, plus the rating glyph">
          <Both>
            {() => (
              <div className="flex flex-wrap items-end gap-8">
                <RouteMark size={20} />
                <RouteMark size={24} />
                <RouteMark size={40} />
                <Wordmark size={24} />
                <div className="flex flex-col gap-1">
                  <Rating value={5} />
                  <Rating value={4} />
                </div>
              </div>
            )}
          </Both>
        </Spec>

        <Spec
          name="Art · full size"
          note="every graphic reads CSS custom properties — no hex, no second export, no text inside any SVG"
        >
          <Both>
            {(m) => (
              <div className="space-y-6">
                <RouteContrast animate={m === "personal"} />
                <GlobeConnection />
                <WorldPresence />
                <div className="flex flex-wrap items-end gap-8">
                  <FeeStack className="h-40" />
                  <SpeedContrast className="h-28" />
                  <TransferTimeline className="h-44" />
                  <SecurityShield className="h-40" />
                </div>
                <div className="flex flex-wrap gap-6">
                  <PersonaRohan className="w-56" />
                  <PersonaPriya className="w-56" />
                </div>
              </div>
            )}
          </Both>
        </Spec>

        <Spec
          name="Art · 120px legibility check"
          note="§6.3 requires every graphic to read clearly at 120px wide"
        >
          <Both>
            {() => (
              <div className="flex flex-wrap items-end gap-4">
                {[
                  <RouteContrast key="rc" decorative />,
                  <GlobeConnection key="gc" decorative />,
                  <WorldPresence key="wp" decorative />,
                  <FeeStack key="fs" decorative />,
                  <SpeedContrast key="sc" decorative />,
                  <TransferTimeline key="tt" decorative />,
                  <SecurityShield key="ss" decorative />,
                  <PersonaRohan key="pr" decorative />,
                  <PersonaPriya key="pp" decorative />,
                ].map((node, i) => (
                  <div key={i} style={{ width: 120 }}>
                    {node}
                  </div>
                ))}
              </div>
            )}
          </Both>
        </Spec>

        <Spec name="Button" note="primary / secondary / ghost · sm / md / lg">
          <Both>
            {() => (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Request a callback</Button>
                  <Button size="md">Request a callback</Button>
                  <Button size="lg">Request a callback</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="secondary" size="sm">
                    See how it works →
                  </Button>
                  <Button variant="secondary" size="md">
                    See how it works →
                  </Button>
                  <Button variant="ghost">More questions →</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button disabled>Download the app</Button>
                  <Button variant="secondary" disabled>
                    Coming soon
                  </Button>
                </div>
              </div>
            )}
          </Both>
        </Spec>

        <Spec name="SectionHeader · Eyebrow">
          <Both>
            {() => (
              <div className="space-y-6">
                <SectionHeader
                  eyebrow="CROSS-BORDER PAYMENTS · INDIA OUTBOUND"
                  title="The rate you're quoted and the rate you get are usually two different numbers."
                  lede="Most cross-border payments pass through two or three correspondent banks. Each one takes a fee."
                />
                <Eyebrow>SECURITY &amp; COMPLIANCE</Eyebrow>
              </div>
            )}
          </Both>
        </Spec>

        <Spec name="Card · StatTile" note="StatTile figures are larger than their labels by design">
          <Both>
            {() => (
              <div className="space-y-4">
                <Card>
                  <p className="text-sm">
                    Fewer banks in the chain means fewer fees deducted and less
                    time in transit.
                  </p>
                </Card>
                <Card raised>
                  <p className="text-sm">Nested panel on --surface-2.</p>
                </Card>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                  <StatTile figure="₹0" label="markup on first transfer" accent />
                  <StatTile figure="2–3" label="hops typical" />
                  <StatTile figure="40+" label="currency corridors" />
                  <StatTile figure="~90 sec" label="average settlement" />
                </div>
              </div>
            )}
          </Both>
        </Spec>

        <Spec name="DataRow · DataList" note="the itemised breakdown from §9.2 — figures reconcile">
          <Both>
            {() => (
              <DataList>
                <DataRow label="You send" value="₹5,00,000.00" />
                <DataRow label="Exchange rate applied" value="83.4210" />
                <DataRow
                  label="Clear Route margin"
                  note="standard 0.40%"
                  value="₹0.00 — waived"
                  accent
                />
                <DataRow label="Network & correspondent fees" value="₹0.00" />
                <DataRow label="Recipient receives" value="$5,994.89" strong />
              </DataList>
            )}
          </Both>
        </Spec>

        <Spec
          name="Callout"
          note="info / offer (Amber, once per page) / project-note (deliberately unlike product copy)"
        >
          <Both>
            {() => (
              <div className="space-y-4">
                <Callout title="What you're seeing">
                  Every timestamp above is recorded and exportable — the audit
                  trail your finance team or auditor can actually work from.
                </Callout>
                <Callout variant="offer" title={OFFER_HEADLINE}>
                  {OFFER_TERMS}{" "}
                  <span style={{ color: "var(--text-dim)" }}>
                    {OFFER_NO_PRESSURE}
                  </span>
                </Callout>
                <Callout variant="project-note">
                  Clear Route is fictional and holds no licence. In a real
                  deployment every field above must contain the actual licence
                  type, issuing regulator and registration number, verifiable
                  independently.
                </Callout>
              </div>
            )}
          </Both>
        </Spec>

        <Spec name="Badge">
          <Both>
            {() => (
              <div className="flex flex-wrap gap-2">
                <Badge>For businesses</Badge>
                <Badge tone="accent">Published</Badge>
                <Badge tone="warn">Conversion</Badge>
                <Badge tone="muted">Planned</Badge>
              </div>
            )}
          </Both>
        </Spec>

        <Spec name="Tabs" note="roving tabindex · ← → Home End">
          <Both>
            {(m) => (
              <Tabs
                label={`Demo steps (${m})`}
                tabs={[
                  {
                    id: "route",
                    index: "1",
                    label: "Choose your route",
                    content: (
                      <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                        No account needed to see this. The rate above is the real
                        reference rate — not a marked-up customer rate.
                      </p>
                    ),
                  },
                  {
                    id: "lock",
                    index: "2",
                    label: "Lock your rate",
                    content: (
                      <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                        Locked before you confirm, held through settlement.
                      </p>
                    ),
                  },
                  {
                    id: "leg",
                    index: "3",
                    label: "Add another leg",
                    content: (
                      <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                        KYC, beneficiary and source-of-funds details carried over
                        from Leg 1.
                      </p>
                    ),
                  },
                ]}
              />
            )}
          </Both>
        </Spec>

        <Spec name="Accordion" note="deep-linkable via URL hash">
          <Both>
            {(m) => (
              <Accordion
                items={[
                  {
                    id: `sg-${m}-rate-marked-up`,
                    question: "Is the rate marked up?",
                    answer:
                      "No. The rate applied is the live interbank reference rate, locked at confirmation. Our margin is a separate, itemised line shown before you confirm.",
                  },
                  {
                    id: `sg-${m}-receiving-fees`,
                    question: "Are there receiving fees?",
                    answer:
                      "Network and correspondent fees are absorbed by Clear Route. A recipient's own bank may apply its own charge, which we show as an estimate before you send.",
                  },
                ]}
              />
            )}
          </Both>
        </Spec>

        <Spec name="Rating" note="five RouteMark nodes, not stars">
          <Both>
            {() => (
              <div className="space-y-3">
                <Rating value={5} size={16} />
                <p className="text-sm" style={{ color: "var(--text)" }}>
                  &ldquo;The rate we were quoted was the rate we got.&rdquo;
                </p>
                <p className="mono text-[11px]" style={{ color: "var(--text-dim)" }}>
                  INR→USD · ~90 sec settlement
                </p>
              </div>
            )}
          </Both>
        </Spec>

        <Spec name="PhoneFrame" note="generic device shell — no manufacturer likeness">
          <Both>
            {() => (
              <PhoneFrame width={260} statusLabel="Clear Route">
                <div className="space-y-3 p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ background: "var(--brand)" }}
                    >
                      <RouteMark size={20} decorative />
                    </span>
                    <div>
                      <p className="mono text-xs" style={{ color: "var(--text)" }}>
                        @clearroute
                      </p>
                      <p className="mono text-[10px]" style={{ color: "var(--text-dim)" }}>
                        1,284 followers
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {Array.from({ length: 6 }, (_, i) => (
                      <div
                        key={i}
                        className="aspect-square"
                        style={{ background: "var(--surface-2)" }}
                      />
                    ))}
                  </div>
                </div>
              </PhoneFrame>
            )}
          </Both>
        </Spec>

        <Spec name="PostCard" note="engagement glyphs drawn from the route motif">
          <Both>
            {() => (
              <PostCard
                meta="Cross-border payments · 11–50 employees · Mumbai"
                reactions={184}
                comments={23}
                topComment="What's actually made you switch cross-border providers in the past — cost, speed, or visibility?"
                body={
                  <>
                    <p>Your finance team probably knows your wire transfer fee.</p>
                    <p>They almost certainly don&rsquo;t know the real cost.</p>
                  </>
                }
              />
            )}
          </Both>
        </Spec>

        <Spec
          name="VideoPlayer"
          note="no file present, so both render the placeholder — which is the point"
        >
          <Both>
            {() => (
              <VideoPlayer
                src="/video/clearroute-institutional.mp4"
                title="The number you were never shown."
                runtime="50s"
              />
            )}
          </Both>
        </Spec>

        <Spec name="Modal" note="focus-trapped · Escape closes · ← → navigate · focus returns to trigger">
          <Both>
            {(m) => (
              <div>
                <Button variant="secondary" onClick={() => setModalOpen(true)}>
                  Open carousel viewer ({m})
                </Button>
              </div>
            )}
          </Both>
        </Spec>

        <Spec name="Disclaimer" note="required in the footer of every page">
          <Both>{() => <Disclaimer />}</Both>
        </Spec>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          label="Carousel preview"
          onPrev={() => setSlide((s) => (s + 5) % 6)}
          onNext={() => setSlide((s) => (s + 1) % 6)}
        >
          <div data-mode="personal" style={{ background: "var(--bg)" }}>
            <div className="p-8">
              <p className="mono text-[10px] tracking-[0.14em] uppercase" style={{ color: "var(--text-dim)" }}>
                Slide {slide + 1} of 6
              </p>
              <p className="mt-4 text-xl font-semibold" style={{ color: "var(--text)" }}>
                Your online order arrives in 10 minutes. Sending money abroad:
                still 3–5 days. Why?
              </p>
              <div className="mt-6 flex justify-center gap-1.5">
                {Array.from({ length: 6 }, (_, i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: i === slide ? "var(--accent)" : "var(--line)",
                    }}
                  />
                ))}
              </div>
              <p className="mt-6 text-xs" style={{ color: "var(--text-dim)" }}>
                Use ← and → to move between slides. Escape closes and returns
                focus to the button that opened this.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  );
}
