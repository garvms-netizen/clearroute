"use client";

import { useMode } from "@/components/ModeProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { DataList, DataRow } from "@/components/ui/DataRow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";
import { RouteMark } from "@/components/art/RouteMark";
import { WorldPresence } from "@/components/art/WorldPresence";

/**
 * /about, §13.
 *
 * Three short paragraphs of story with no founder mythology — the
 * observation, the diagnosis, the decision. Team avatars are RouteMark-derived
 * marks rather than generated faces, because a fictional company inventing
 * photorealistic people would be the exact failure this project is about.
 */

const PRINCIPLES = [
  {
    title: "Show the number first.",
    body: "The rate appears before any beneficiary detail is entered. A price revealed at the end of a flow is a price designed not to be compared.",
  },
  {
    title: "Fewer hops beat faster pipes.",
    body: "Every institution in the chain takes a fee and adds delay. Removing one is worth more than speeding all of them up.",
  },
  {
    title: "One session, every currency.",
    body: "Needing a second currency should not mean starting again. The rails support it; the tools on top of them mostly don't.",
  },
  {
    title: "Trust is a receipt, not a promise.",
    body: "Every hop, fee and timestamp is recorded and exportable. Saying a transfer is safe is worth less than showing where it is.",
  },
];

const CORRIDORS: Array<[string, string]> = [
  ["INR → USD", "2 hops · ~4 hours"],
  ["INR → EUR", "2 hops · ~4 hours"],
  ["INR → GBP", "2 hops · ~5 hours"],
  ["INR → AED", "1 hop · ~2 hours"],
  ["INR → SGD", "2 hops · ~4 hours"],
  ["INR → AUD", "2 hops · ~6 hours"],
  ["INR → CAD", "2 hops · ~6 hours"],
];

const TEAM = [
  { name: "A. Raghunathan", role: "Founder", background: "Ten years in correspondent banking operations." },
  { name: "S. Bhattacharya", role: "Head of Product", background: "Built reconciliation tooling for a mid-market ERP." },
  { name: "N. Qureshi", role: "Head of Compliance", background: "Payments licensing and FEMA reporting." },
  { name: "D. Fernandes", role: "Head of Engineering", background: "Distributed settlement systems." },
];

const TIMELINE = [
  { when: "The observation", what: "A vendor payment arrives short. The fee was disclosed; the rate was not." },
  { when: "The diagnosis", what: "The fee stack is real, layered, and almost entirely invisible at the point of sending." },
  { when: "The decision", what: "Build the visibility layer rather than new rails — the rails mostly work." },
  { when: "Now", what: "A campaign and a product argument, presented as this site." },
];

export function AboutPage() {
  const { mode } = useMode();

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="COMPANY"
          level={1}
          title="We started with one question: where does the money actually go?"
        />
      </div>

      {/* ---------- The story ---------- */}
      <Section labelledBy="story">
        <h2 id="story" className="sr-only">
          The story
        </h2>
        <div
          className="space-y-5 text-[16px] leading-[1.75]"
          style={{ maxWidth: "var(--measure)" }}
        >
          <p>
            Someone sends a vendor payment. The transfer fee was disclosed up
            front and paid without complaint. Then the invoice comes back short,
            and the shortfall is larger than the fee was. Nothing was hidden,
            exactly — but nothing was shown either.
          </p>
          <p>
            The reason is structural. A cross-border payment passes through two
            or three correspondent banks, each taking a cut, and on top of that
            a margin is folded into the exchange rate itself rather than
            itemised beside it. The cost is real and layered, and almost none of
            it is visible at the moment you decide to send.
          </p>
          <p>
            The rails, mostly, work. Money does move, and recent infrastructure
            has made it move faster. What is missing is the layer that lets the
            person sending it see what is happening — the rate before
            committing, the route while it travels, the fee as a line rather
            than an absence. That is what we set out to build.
          </p>
        </div>
      </Section>

      {/* ---------- Principles ---------- */}
      <Section labelledBy="beliefs">
        <SectionHeader id="beliefs" eyebrow="WHAT WE BELIEVE" title="Four principles" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <Card key={p.title}>
              <h3 className="text-[16px] font-semibold">{p.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
                {p.body}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ---------- Where we operate ---------- */}
      <Section labelledBy="corridors">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <SectionHeader
              id="corridors"
              eyebrow="WHERE WE OPERATE"
              title="India outbound."
              lede="Hop counts and settlement windows are illustrative and consistent with the figures used in the demo."
            />
            <DataList className="mt-6">
              {CORRIDORS.map(([corridor, detail]) => (
                <DataRow key={corridor} label={corridor} value={detail} />
              ))}
            </DataList>
          </div>
          <WorldPresence className="w-full" />
        </div>
      </Section>

      {/* ---------- Team ---------- */}
      <Section labelledBy="team">
        <SectionHeader
          id="team"
          eyebrow="TEAM"
          title="Illustrative team — this is a fictional company."
          lede="These are placeholders standing in for roles a real deployment would need. The avatars are marks derived from the logo, not generated faces."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <Card key={m.name}>
              <span
                className="flex h-14 w-14 items-center justify-center"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius)",
                  // Rotating each mark makes four distinct avatars from one
                  // asset without inventing four faces.
                  transform: `rotate(${i * 90}deg)`,
                }}
              >
                <RouteMark size={20} decorative />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold">{m.name}</h3>
              <p className="mono text-[11px]" style={{ color: "var(--accent-ink)" }}>
                {m.role}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
                {m.background}
              </p>
            </Card>
          ))}
        </div>
        <Callout variant="project-note" className="mt-6">
          These people do not exist. Names, roles and backgrounds are
          placeholders for an academic project — no photograph, likeness or
          generated face of any person appears anywhere on this site.
        </Callout>
      </Section>

      {/* ---------- Timeline ---------- */}
      <Section labelledBy="timeline">
        <SectionHeader
          id="timeline"
          eyebrow="HOW WE GOT HERE"
          title="The product narrative"
          lede="Framed as the argument this project makes, rather than as company history — there is no company."
        />
        <ol className="mt-8" style={{ maxWidth: "var(--measure)" }}>
          {TIMELINE.map((t, i) => (
            <li key={t.when} className="relative flex gap-5 pb-7 last:pb-0">
              {i < TIMELINE.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-4 bottom-0 left-[5px] w-px"
                  style={{ background: "var(--line)" }}
                />
              )}
              <span
                aria-hidden="true"
                className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <div>
                <p className="eyebrow mb-1">{t.when}</p>
                <p className="text-[15px] leading-relaxed">{t.what}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* ---------- Careers + closing ---------- */}
      <Section labelledBy="closing">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="mb-2">
              <Badge tone="muted">Careers — placeholder</Badge>
            </div>
            <h2 id="closing" className="text-[20px] font-semibold sm:text-[24px]">
              There are no roles to apply for.
            </h2>
            <p
              className="mt-2 text-[15px]"
              style={{ color: "var(--text-dim)", maxWidth: "var(--measure)" }}
            >
              Clear Route is a university marketing project, so a careers page
              with open positions would be inventing jobs that do not exist.
            </p>
          </div>
          <Button
            href={mode === "institutional" ? "/institutional/callback" : "/personal/how-it-works"}
            size="lg"
          >
            {mode === "institutional" ? "Request a callback" : "See how it works →"}
          </Button>
        </div>
      </Section>
    </>
  );
}
