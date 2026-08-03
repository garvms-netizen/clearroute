"use client";

import Link from "next/link";
import type { Mode } from "@/lib/mode";
import {
  conversionCopy,
  heroCopy,
  MECHANISMS,
  MECHANISMS_H2,
  OBJECTIONS,
  OBJECTIONS_H2,
  PROBLEM_BODY,
  PROBLEM_H2,
  PROBLEM_STATS,
  PROBLEM_STAT_INSTITUTIONAL,
  STEPS,
  STEPS_H2,
  videoFor,
} from "@/lib/homeContent";
import { OFFER_HEADLINE, OFFER_NO_PRESSURE, OFFER_TERMS } from "@/lib/copy";
import { testimonialsFor, TRUST_ROW } from "@/lib/testimonials";
import { track } from "@/lib/track";

import { Section } from "./Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Rating } from "@/components/ui/Rating";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatTile } from "@/components/ui/StatTile";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { RouteContrast } from "@/components/art/RouteContrast";
import { GlobeConnection } from "@/components/art/GlobeConnection";
import { FeeStack } from "@/components/art/FeeStack";

/**
 * The home page, section 8.
 *
 * Section order is locked in both modes: value proposition, then proof, then
 * social proof, then objections, then conversion. The mode arrives as a prop
 * rather than from context because these are two separate routes with a mode
 * each — no need to wait for hydration to know which one we are on.
 */
export function HomePage({ mode }: { mode: Mode }) {
  const institutional = mode === "institutional";
  const hero = heroCopy(mode);
  const conversion = conversionCopy(mode);
  const video = videoFor(mode);
  const testimonials = testimonialsFor(mode, 3);

  const stats = institutional
    ? [...PROBLEM_STATS, PROBLEM_STAT_INSTITUTIONAL]
    : PROBLEM_STATS;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="px-4 pt-10 pb-[var(--section-y)] sm:px-6 sm:pt-14">
        <div className="mx-auto w-full max-w-7xl">
          {institutional ? (
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
              <div>
                <Eyebrow>{hero.eyebrow}</Eyebrow>
                <h1 className="mt-4 max-w-xl text-[30px] leading-[1.13] font-semibold sm:text-[40px]">
                  {hero.h1}
                </h1>
                <p
                  className="mt-4 max-w-lg text-[15px] leading-relaxed sm:text-base"
                  style={{ color: "var(--text-dim)" }}
                >
                  {hero.sub}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button
                    href={hero.primary.href}
                    size="lg"
                    onClick={() => track("cta_click", hero.primary.label)}
                  >
                    {hero.primary.label}
                  </Button>
                  <Button href={hero.secondary.href} variant="secondary" size="lg">
                    {hero.secondary.label}
                  </Button>
                </div>
              </div>
              <RouteContrast className="w-full" />
            </div>
          ) : (
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-[32px] leading-[1.12] font-semibold sm:text-[52px]">
                {hero.h1}
              </h1>
              <p
                className="mx-auto mt-5 max-w-xl text-[17px] leading-[1.7]"
                style={{ color: "var(--text-dim)" }}
              >
                {hero.sub}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  href={hero.primary.href}
                  size="lg"
                  onClick={() => track("cta_click", hero.primary.label)}
                >
                  {hero.primary.label}
                </Button>
                <Button href={hero.secondary.href} variant="secondary" size="lg">
                  {hero.secondary.label}
                </Button>
              </div>
              <GlobeConnection className="mx-auto mt-12 w-full max-w-2xl" />
              <p className="mono mt-1 text-[11px]" style={{ color: "var(--text-dim)" }}>
                2 hops · ~4 hrs typical
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ---------- The problem ---------- */}
      <Section labelledBy="problem">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeader id="problem" eyebrow="THE PROBLEM" title={PROBLEM_H2} />
            <p
              className="mt-4 text-[15px] leading-relaxed"
              style={{ color: "var(--text-dim)", maxWidth: "var(--measure)" }}
            >
              {PROBLEM_BODY}
            </p>

            {institutional ? (
              <div
                className="mt-8 grid border-t border-l sm:grid-cols-2 lg:grid-cols-4"
                style={{ borderColor: "var(--line)" }}
              >
                {stats.map((s) => (
                  <div
                    key={s.figure}
                    className="border-r border-b p-4"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <StatTile figure={s.figure} label={s.label} size="sm" accent />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {stats.map((s) => (
                  <Card key={s.figure}>
                    <StatTile figure={s.figure} label={s.label} accent />
                  </Card>
                ))}
              </div>
            )}

            <p className="mt-6 text-sm">
              <Link
                href="/blog/why-cross-border-payments-are-still-broken"
                className="underline underline-offset-4"
                style={{ color: "var(--accent-ink)" }}
              >
                Read the full breakdown →
              </Link>
            </p>
          </div>

          <div className="flex items-center justify-center">
            <FeeStack className="h-56" />
          </div>
        </div>
      </Section>

      {/* ---------- How it works, teaser only ---------- */}
      <Section labelledBy="steps">
        <SectionHeader id="steps" eyebrow="HOW IT WORKS" title={STEPS_H2} />

        <ol
          className={
            institutional
              ? "mt-8 grid gap-px sm:grid-cols-2 lg:grid-cols-4"
              : "mt-10 grid gap-5 sm:grid-cols-2"
          }
          style={institutional ? { background: "var(--line)" } : undefined}
        >
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className={institutional ? "p-5" : ""}
              style={institutional ? { background: "var(--bg)" } : undefined}
            >
              {institutional ? (
                <>
                  <span className="mono text-xs" style={{ color: "var(--accent-ink)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-[15px] font-semibold">
                    {s.title}
                    {s.optional && (
                      <span
                        className="ml-1.5 text-[12px] font-normal"
                        style={{ color: "var(--text-dim)" }}
                      >
                        (optional)
                      </span>
                    )}
                  </h3>
                  <p
                    className="mt-1.5 text-[13px] leading-relaxed"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {s.body}
                  </p>
                </>
              ) : (
                <Card>
                  <span className="mono text-xs" style={{ color: "var(--accent-ink)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold">
                    {s.title}
                    {s.optional && (
                      <span
                        className="ml-1.5 text-[13px] font-normal"
                        style={{ color: "var(--text-dim)" }}
                      >
                        (optional)
                      </span>
                    )}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                    {s.body}
                  </p>
                </Card>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-8">
          <Button
            href={hero.primary.href}
            size="lg"
            onClick={() => track("cta_click", "Try the interactive demo")}
          >
            Try the interactive demo →
          </Button>
        </div>
      </Section>

      {/* ---------- Three mechanisms ---------- */}
      <Section labelledBy="mechanisms">
        <SectionHeader id="mechanisms" eyebrow="MECHANISMS" title={MECHANISMS_H2} />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {MECHANISMS.map((m) =>
            institutional ? (
              <div
                key={m.title}
                className="border-t pt-4"
                style={{ borderColor: "var(--accent)" }}
              >
                <h3 className="text-[15px] font-semibold">{m.title}</h3>
                <p
                  className="mt-2 text-[13px] leading-relaxed"
                  style={{ color: "var(--text-dim)" }}
                >
                  {m.body}
                </p>
              </div>
            ) : (
              <Card key={m.title}>
                <h3 className="text-lg font-semibold">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                  {m.body}
                </p>
              </Card>
            ),
          )}
        </div>
      </Section>

      {/* ---------- Video strip ---------- */}
      <Section labelledBy="see-it-work">
        {/* min-w-0 on the tracks: grid items default to min-width:auto, so a
            single wide child would otherwise push the row past the viewport
            instead of shrinking. */}
        <div className="grid min-w-0 gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div className="min-w-0">
            <SectionHeader id="see-it-work" eyebrow="PRODUCT DEMO" title="See it work" />
            <p className="mt-3 text-[15px]" style={{ color: "var(--text-dim)" }}>
              {video.title} <span className="mono text-[13px]">· {video.runtime}</span>
            </p>
            <p className="mt-5 text-sm">
              <Link
                href="/demo"
                className="underline underline-offset-4"
                style={{ color: "var(--accent-ink)" }}
              >
                More product demos →
              </Link>
            </p>
          </div>
          <VideoPlayer
            src={video.src}
            title={video.title}
            runtime={video.runtime}
            poster={<RouteContrast decorative />}
            onPlay={() => track("video_play", mode)}
          />
        </div>
      </Section>

      {/* ---------- Social proof ---------- */}
      <Section labelledBy="proof">
        <SectionHeader
          id="proof"
          eyebrow="CUSTOMERS"
          title={
            institutional
              ? "What finance teams say"
              : "People who've sent money with us"
          }
        />

        <div
          className="mt-8 grid gap-px sm:grid-cols-2 lg:grid-cols-4"
          style={{ background: "var(--line)" }}
        >
          {TRUST_ROW.map((t) => (
            <div key={t.figure} className="p-4" style={{ background: "var(--bg)" }}>
              <StatTile figure={t.figure} label={t.label} size="sm" accent />
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} as="article" className="flex flex-col">
              <Rating value={5} />
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

        {/* The illustrative label travels with the testimonials rather than
            living only on /customers — someone who never leaves the home page
            still needs to know these are written personas. */}
        <div className="mt-6">
          <Callout variant="project-note">
            These are written personas representing the target customers this
            campaign was designed for, not real customer feedback. Clear Route is
            a fictional company built for an academic marketing project.
          </Callout>
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

      {/* ---------- Objection handling ---------- */}
      <Section labelledBy="objections">
        <SectionHeader id="objections" eyebrow="QUESTIONS" title={OBJECTIONS_H2} />

        <div className="mt-8 grid gap-x-10 gap-y-8 lg:grid-cols-2">
          {OBJECTIONS.map((o) => (
            <div key={o.id}>
              <h3 className="text-[15px] font-semibold">{o.question}</h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "var(--text-dim)", maxWidth: "var(--measure)" }}
              >
                {o.answer}
              </p>
              {o.link && (
                <p className="mt-2 text-sm">
                  <Link
                    href={o.link.href}
                    className="underline underline-offset-4"
                    style={{ color: "var(--accent-ink)" }}
                  >
                    {o.link.label} →
                  </Link>
                </p>
              )}
              {o.projectNote && (
                <Callout variant="project-note" className="mt-3">
                  {o.projectNote}
                </Callout>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm">
          <Link
            href="/faq"
            className="underline underline-offset-4"
            style={{ color: "var(--accent-ink)" }}
          >
            More questions →
          </Link>
        </p>
      </Section>

      {/* ---------- Conversion and the offer ---------- */}
      <Section labelledBy="conversion">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <h2
              id="conversion"
              className="text-[22px] font-semibold sm:text-[26px] [[data-mode='personal']_&]:sm:text-[34px]"
            >
              {conversion.heading}
            </h2>
            <p
              className="mt-3 text-[15px] leading-relaxed"
              style={{ color: "var(--text-dim)", maxWidth: "var(--measure)" }}
            >
              {conversion.body}
            </p>
            <div className="mt-6">
              <Button
                href={conversion.cta.href}
                size="lg"
                onClick={() => track("cta_click", conversion.cta.label)}
              >
                {conversion.cta.label}
              </Button>
            </div>
          </div>

          {/* Amber appears exactly once per page, and this is it. */}
          <Callout variant="offer" title={OFFER_HEADLINE}>
            {OFFER_TERMS}{" "}
            <span style={{ color: "var(--text-dim)" }}>{OFFER_NO_PRESSURE}</span>
          </Callout>
        </div>
      </Section>
    </>
  );
}
