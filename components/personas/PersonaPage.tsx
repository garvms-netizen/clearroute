"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { DataList, DataRow } from "@/components/ui/DataRow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";
import { PersonaRohan, PersonaPriya } from "@/components/art/Personas";
import { Rating } from "@/components/ui/Rating";
import { PERSONAS } from "@/lib/personas";
import { testimonialsFor } from "@/lib/testimonials";
import type { Mode } from "@/lib/mode";

/**
 * /{mode}/who-its-for.
 *
 * One component, two personas. The structure is deliberately identical —
 * profile, what they send, what they need, what worries them — because the
 * argument is that the same product serves both; only the register changes.
 *
 * The concerns section is not decoration. Naming what someone is actually
 * worried about and answering it directly is more persuasive than a longer
 * list of benefits, and for a payments product aimed at first-time senders it
 * is most of the job.
 */
export function PersonaPage({ mode }: { mode: Mode }) {
  const p = PERSONAS[mode];
  const institutional = mode === "institutional";
  const voices = testimonialsFor(mode, 2);
  const Art = institutional ? PersonaRohan : PersonaPriya;

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <SectionHeader
            eyebrow={p.eyebrow}
            level={1}
            title={p.headline}
            lede={p.lede}
          />
          <Art className="mx-auto w-full max-w-sm" />
        </div>
      </div>

      {/* ---------- The profile ---------- */}
      <Section labelledBy="profile">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              id="profile"
              eyebrow="THE PERSON"
              title={p.name}
              lede={p.role}
            />
            <DataList className="mt-6">
              {p.profile.map(([k, v]) => (
                <DataRow key={k} label={k} value={v} />
              ))}
            </DataList>
            <Callout variant="project-note" className="mt-5">
              An illustrative persona — a composite written to represent this
              campaign&rsquo;s target audience, not a real customer.
            </Callout>
          </div>

          <div>
            <SectionHeader eyebrow="WHAT THEY SEND" title="Typical transfers" />
            <ul className="mt-6">
              {p.uses.map((u) => (
                <li
                  key={u}
                  className="flex items-start gap-3 border-b py-3.5 last:border-b-0"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                  <span className="text-[15px]">{u}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ---------- Needs, each answered ---------- */}
      <Section labelledBy="needs">
        <SectionHeader
          id="needs"
          eyebrow="WHAT THEY NEED"
          title="And what answers it."
          lede="Each need paired with the specific mechanism that addresses it, rather than a claim that it is addressed."
        />
        <div className="mt-8 grid gap-x-10 gap-y-6 lg:grid-cols-2">
          {p.needs.map((n) => (
            <div key={n.need}>
              <h3 className="text-[15px] font-semibold">{n.need}</h3>
              <p
                className="mt-1.5 text-[13px] leading-relaxed"
                style={{ color: "var(--text-dim)", maxWidth: "var(--measure)" }}
              >
                {n.answer}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- Concerns ---------- */}
      <Section labelledBy="concerns">
        <SectionHeader id="concerns" eyebrow="HONESTLY" title={p.concernsTitle} />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {p.concerns.map((c) => (
            <Card key={c.concern} className="flex flex-col">
              <h3 className="text-[15px] font-semibold">{c.concern}</h3>
              <p
                className="mt-2.5 flex-1 text-[13px] leading-relaxed"
                style={{ color: "var(--text-dim)" }}
              >
                {c.answer}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ---------- Voices ---------- */}
      <Section labelledBy="voices">
        <SectionHeader
          id="voices"
          eyebrow="IN THEIR WORDS"
          title={institutional ? "Others in the same seat" : "People sending the same way"}
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {voices.map((t) => (
            <Card key={t.name} as="article" className="flex flex-col">
              <div className="flex items-center justify-between gap-3">
                <Rating value={5} />
                <Badge tone="muted">Illustrative</Badge>
              </div>
              <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <footer className="mt-4">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-[13px]" style={{ color: "var(--text-dim)" }}>
                  {t.role}, {t.context}
                </p>
              </footer>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-sm">
          <Link
            href="/customers"
            className="underline underline-offset-4"
            style={{ color: "var(--accent-ink)" }}
          >
            Read all customer stories →
          </Link>
        </p>
      </Section>

      {/* ---------- Closing ---------- */}
      <Section labelledBy="persona-cta">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <h2 id="persona-cta" className="text-[20px] font-semibold sm:text-[24px]">
            {institutional
              ? "Sound like your finance calendar?"
              : "Sound like the transfer you're about to make?"}
          </h2>
          <Button href={p.cta.href} size="lg">
            {p.cta.label} →
          </Button>
        </div>
      </Section>
    </>
  );
}
