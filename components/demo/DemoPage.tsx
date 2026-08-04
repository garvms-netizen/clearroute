"use client";

import { useState } from "react";
import { useMode } from "@/components/ModeProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";
import { FilmPlayer } from "./FilmPlayer";
import { FILMS } from "@/lib/films";
import type { Mode } from "@/lib/mode";

/**
 * /demo, §10.
 *
 * Both films, playing inline. No external links, no redirect to a video
 * platform — a page that sends you elsewhere to see the product is not a
 * demo page.
 *
 * The visitor's current mode renders first and expanded; the other collapses
 * to a card they can open. Mode-appropriate without hiding anything: the other
 * film is one click away and clearly labelled, not omitted.
 */

const MODES: Mode[] = ["institutional", "personal"];

/** What each film's beats demonstrate, so the page teaches with sound off. */
const MECHANISMS: Record<Mode, Array<{ beat: string; mechanism: string }>> = {
  institutional: [
    { beat: "The quoted rate and the applied rate, side by side", mechanism: "Live locked rate" },
    { beat: "Two correspondent banks, each taking a cut", mechanism: "Minimal intermediaries" },
    { beat: "The route, timestamped end to end", mechanism: "Transaction map" },
    { beat: "The difference, on one transfer", mechanism: "Itemised pricing" },
  ],
  personal: [
    { beat: "The rate shown before anything is entered", mechanism: "Live locked rate" },
    { beat: "Two hops instead of five", mechanism: "Minimal intermediaries" },
    { beat: "The arrival, watched as it happens", mechanism: "Transaction map" },
    { beat: "First transfer at no markup", mechanism: "Risk reversal" },
  ],
};

export function DemoPage() {
  const { mode } = useMode();
  const [expanded, setExpanded] = useState<Mode | null>(null);

  // The visitor's mode leads; the other follows, collapsed.
  const ordered = [...MODES].sort((a) => (a === mode ? -1 : 1));

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="PRODUCT DEMO"
          level={1}
          title="Watch a transfer, end to end."
          lede="Two short films — one for finance teams moving company money, one for people sending money to family, students and freelancers."
        />
        <Callout variant="project-note" className="mt-8">
          These films are drawn and animated in the browser rather than encoded
          as video. Every figure in them is imported from the same source the
          pricing page uses, so a film cannot drift out of step with the rest of
          the site the way a rendered file would the moment a number changed.
        </Callout>
      </div>

      {ordered.map((m) => {
        const film = FILMS[m];
        const isPrimary = m === mode;
        const isOpen = isPrimary || expanded === m;

        return (
          <Section key={m} labelledBy={`film-${m}`}>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <Badge tone={isPrimary ? "accent" : "muted"}>{film.badge}</Badge>
              <h2 id={`film-${m}`} className="text-[20px] font-semibold sm:text-[24px]">
                {film.title}
              </h2>
              <span className="mono text-[12px]" style={{ color: "var(--text-dim)" }}>
                {film.runtime}s
              </span>
            </div>

            <p
              className="mb-6 text-[15px]"
              style={{ color: "var(--text-dim)", maxWidth: "var(--measure)" }}
            >
              {film.description}
            </p>

            {isOpen ? (
              <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
                <FilmPlayer film={film} />

                {/* The page teaches with the sound off — each beat tied to the
                    mechanism it demonstrates. */}
                <div>
                  <p className="eyebrow mb-3">What you&rsquo;re seeing</p>
                  <ul>
                    {MECHANISMS[m].map((b) => (
                      <li
                        key={b.beat}
                        className="border-b py-3 last:border-b-0"
                        style={{ borderColor: "var(--line)" }}
                      >
                        <p className="text-[14px]">{b.beat}</p>
                        <p className="mono mt-1 text-[11px]" style={{ color: "var(--accent-ink)" }}>
                          {b.mechanism}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Button variant="secondary" onClick={() => setExpanded(m)}>
                Play the {film.badge.toLowerCase()} film →
              </Button>
            )}
          </Section>
        );
      })}

      <Section labelledBy="try-demo">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <SectionHeader
            id="try-demo"
            eyebrow="GO DEEPER"
            title="Prefer to drive it yourself?"
            lede="The interactive demo walks the same transfer step by step, with live published rates and the full settlement running in front of you."
          />
          <Button href={`/${mode}/how-it-works`} size="lg">
            Try the interactive demo →
          </Button>
        </div>
      </Section>
    </>
  );
}
