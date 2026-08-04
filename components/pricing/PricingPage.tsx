"use client";

import Link from "next/link";
import { useMode } from "@/components/ModeProvider";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { DataList, DataRow } from "@/components/ui/DataRow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";
import { formatMoney, formatRate } from "@/lib/rates";
import { OFFER_HEADLINE, OFFER_NO_PRESSURE, OFFER_TERMS } from "@/lib/copy";
import {
  BANK_RATE,
  BANK_SETTLEMENT,
  BANK_USD,
  DIFFERENCE_USD,
  HOPS,
  HOURS,
  LEG1_RATE,
  LEG1_USD,
  MARGIN_INR,
  MARGIN_PCT,
  SEND_INR,
} from "@/lib/workedExample";

/**
 * /pricing, §15.
 *
 * Fully visible without signing up. Hiding it would contradict the entire
 * value proposition — a page that says "see the number before you commit"
 * cannot itself withhold the number.
 *
 * Every figure is imported from lib/workedExample, the same source the demo
 * reads, so the two pages cannot drift.
 */
export function PricingPage() {
  const { mode } = useMode();
  const institutional = mode === "institutional";

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="PRICING"
          level={1}
          title="One margin, shown before every transfer."
          lede="No tiering, no hidden spread, and nothing folded into the exchange rate. The figures below are the same ones used in the interactive demo."
        />
      </div>

      {/* ---------- The model ---------- */}
      <Section labelledBy="model">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeader id="model" eyebrow="THE MODEL" title="What you pay" />
            <DataList className="mt-6">
              <DataRow
                label="Clear Route margin"
                note="of the send amount"
                value={`${MARGIN_PCT.toFixed(2)}%`}
                accent
              />
              <DataRow
                label="Network & correspondent fees"
                note="absorbed by us"
                value={formatMoney(0, "INR")}
              />
              <DataRow
                label="Rate applied"
                value="live interbank reference, locked at confirmation"
              />
            </DataList>
          </div>

          <div>
            <SectionHeader
              eyebrow="WORKED EXAMPLE"
              title={`On ${formatMoney(SEND_INR, "INR")}`}
            />
            <DataList className="mt-6">
              <DataRow label="You send" value={formatMoney(SEND_INR, "INR")} />
              <DataRow label="Exchange rate applied" value={formatRate(LEG1_RATE)} />
              <DataRow
                label="Clear Route margin"
                note={`standard ${MARGIN_PCT.toFixed(2)}% — ${formatMoney(MARGIN_INR, "INR")}`}
                value={`${formatMoney(0, "INR")} — waived`}
                accent
              />
              <DataRow label="Network & correspondent fees" value={formatMoney(0, "INR")} />
              <DataRow
                label="Recipient receives"
                value={formatMoney(LEG1_USD, "USD")}
                strong
              />
            </DataList>
            <p className="mono mt-3 text-[11px]" style={{ color: "var(--text-dim)" }}>
              Margin waived under the first-transfer offer. Shown rather than
              hidden, so what is being given up is legible.
            </p>
          </div>
        </div>
      </Section>

      {/* ---------- Comparison ---------- */}
      <Section labelledBy="comparison">
        <SectionHeader
          id="comparison"
          eyebrow="COMPARISON"
          title="The same rupees, two routes."
          lede="A typical bank route against Clear Route on an identical transfer. We never name a competitor — the comparison is to the ordinary path money takes."
        />

        <div
          className="mt-8 grid grid-cols-2 gap-px"
          style={{ background: "var(--line)", border: "1px solid var(--line)" }}
        >
          {[
            {
              head: "A typical bank route",
              rate: formatRate(BANK_RATE),
              hops: "3",
              settlement: BANK_SETTLEMENT,
              received: formatMoney(BANK_USD, "USD"),
              accent: false,
            },
            {
              head: "Clear Route",
              rate: formatRate(LEG1_RATE),
              hops: String(HOPS.leg1),
              settlement: HOURS.leg1,
              received: formatMoney(LEG1_USD, "USD"),
              accent: true,
            },
          ].map((col) => (
            <div key={col.head} className="p-5" style={{ background: "var(--surface)" }}>
              <p className="text-[15px] font-semibold">{col.head}</p>
              <dl className="mt-4 space-y-3">
                {[
                  ["Rate applied", col.rate],
                  ["Hops", col.hops],
                  ["Settlement window", col.settlement],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[12px]" style={{ color: "var(--text-dim)" }}>
                      {k}
                    </dt>
                    <dd className="mono text-sm">{v}</dd>
                  </div>
                ))}
                <div className="pt-1">
                  <dt className="text-[12px]" style={{ color: "var(--text-dim)" }}>
                    Recipient receives
                  </dt>
                  <dd
                    className="mono text-xl font-medium"
                    style={{ color: col.accent ? "var(--accent-ink)" : "var(--text)" }}
                  >
                    {col.received}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[15px]" style={{ color: "var(--text-dim)" }}>
          A difference of{" "}
          <span className="mono font-medium" style={{ color: "var(--accent-ink)" }}>
            {formatMoney(DIFFERENCE_USD, "USD")}
          </span>{" "}
          on a single transfer — almost none of which appears as a fee on
          either side.
        </p>
      </Section>

      {/* ---------- The offer. Amber, once. ---------- */}
      <Section labelledBy="offer">
        <h2 id="offer" className="sr-only">
          The first-transfer offer
        </h2>
        <Callout variant="offer" title={OFFER_HEADLINE}>
          {OFFER_TERMS}{" "}
          <span style={{ color: "var(--text-dim)" }}>{OFFER_NO_PRESSURE}</span>
        </Callout>
      </Section>

      {/* ---------- Mode-specific band ---------- */}
      <Section labelledBy="band">
        {institutional ? (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <SectionHeader
                id="band"
                eyebrow="FOR HIGHER VOLUMES"
                title="Above a monthly threshold, the margin is worth a conversation."
                lede="Firms moving regular volume can have the 0.40% reviewed against their actual corridors and frequency. That is a conversation, not a hidden tier — the standard rate stays published on this page either way."
              />
            </div>
            <Button href="/institutional/callback" size="lg">
              Request a callback
            </Button>
          </div>
        ) : (
          <div>
            <SectionHeader
              id="band"
              eyebrow="FOR INDIVIDUALS"
              title="The same 0.40%, whoever you are."
              lede="No tiers, no minimums, and no pricing that depends on how much you send. You'll see the exact figure before you confirm, every single time."
            />
          </div>
        )}
      </Section>

      {/* ---------- Pricing FAQ ---------- */}
      <Section labelledBy="pricing-faq">
        <SectionHeader id="pricing-faq" eyebrow="PRICING FAQ" title="Questions about cost" />
        {/* These are questions the FAQ does *not* answer. The general ones —
            is the rate marked up, are there receiving fees, what happens on a
            failure — live at /faq, and repeating them here word for word made
            two accordions with identical contents. */}
        <Accordion
          className="mt-8"
          items={[
            {
              id: "why-a-percentage-not-a-flat-fee",
              question: "Why a percentage rather than a flat fee?",
              answer:
                "A flat fee punishes small transfers and undercharges large ones, which pushes providers into hiding the difference in the rate. A percentage scales honestly with what is at risk, and stays visible as its own line.",
            },
            {
              id: "how-does-this-compare-on-small-transfers",
              question: "Is 0.40% competitive on a small transfer?",
              answer:
                "On ₹10,000 the margin is ₹40, against roughly ₹300–500 of hidden spread on a typical bank route at 3%. The gap narrows in absolute terms on small amounts but the proportion does not.",
            },
            {
              id: "who-absorbs-the-network-fees",
              question: "How can network fees be absorbed?",
              answer:
                "Because there are fewer of them. Pre-funding the destination account removes the correspondent hops that charge per transaction, so what is absorbed is a much smaller bill than a routed payment would generate.",
            },
            {
              id: "will-the-margin-change",
              question: "Will the 0.40% change?",
              answer:
                "Any change would be published here before it applied, and the rate shown before you confirm is always the rate charged. Volume-based review is a conversation, not a hidden tier.",
            },
          ]}
        />

        <p className="mt-6 text-sm">
          <Link
            href="/faq#rates-and-fees"
            className="underline underline-offset-4"
            style={{ color: "var(--accent-ink)" }}
          >
            Rate mark-ups, receiving fees and failed transfers are answered in the FAQ →
          </Link>
        </p>
      </Section>
    </>
  );
}
