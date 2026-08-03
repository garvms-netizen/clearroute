"use client";

import { useState } from "react";
import { useMode } from "@/components/ModeProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { Section } from "@/components/home/Section";
import { RouteContrast } from "@/components/art/RouteContrast";
import { track } from "@/lib/track";
import type { Mode } from "@/lib/mode";

/**
 * /demo, §10.
 *
 * Both films, playing inline. No external links, no redirect to a video
 * platform — a page that sends you elsewhere to see the product is not a
 * demo page.
 *
 * The visitor's current mode renders first and expanded; the other collapses
 * to a card they can open. Mode-appropriate without hiding anything, which is
 * the distinction that matters: the other film is one click away and clearly
 * labelled, not omitted.
 */

type Film = {
  mode: Mode;
  badge: string;
  title: string;
  runtime: string;
  description: string;
  src: string;
  beats: Array<{ beat: string; mechanism: string }>;
};

const FILMS: Film[] = [
  {
    mode: "institutional",
    badge: "For businesses",
    title: "The number you were never shown.",
    runtime: "50s",
    description:
      "A finance manager reconciles a vendor payment and finds the margin that was never itemised.",
    src: "/video/clearroute-institutional.mp4",
    beats: [
      { beat: "The quoted rate and the applied rate side by side", mechanism: "Live locked rate" },
      { beat: "Three correspondent banks, each taking a cut", mechanism: "Minimal intermediaries" },
      { beat: "Two currency legs set up in one sitting", mechanism: "Multi-leg session" },
      { beat: "The route exported for the auditor", mechanism: "Transaction map" },
    ],
  },
  {
    mode: "personal",
    badge: "For individuals",
    title: "The other end of the line.",
    runtime: "35s",
    description:
      "A tuition payment leaves Kochi and arrives in Frankfurt, tracked the whole way.",
    src: "/video/clearroute-personal.mp4",
    beats: [
      { beat: "The rate shown before anything is entered", mechanism: "Live locked rate" },
      { beat: "Two hops instead of five", mechanism: "Minimal intermediaries" },
      { beat: "A second currency added without starting over", mechanism: "Multi-leg session" },
      { beat: "The arrival, watched in real time", mechanism: "Transaction map" },
    ],
  },
];

export function DemoPage() {
  const { mode } = useMode();
  const [expanded, setExpanded] = useState<Mode | null>(null);

  // The visitor's mode leads; the other film follows, collapsed.
  const ordered = [...FILMS].sort((a) => (a.mode === mode ? -1 : 1));

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="PRODUCT DEMO"
          level={1}
          title="Watch a transfer, end to end."
          lede="Two short films — one for finance teams moving company money, one for people sending money to family, students and freelancers."
        />
      </div>

      {ordered.map((film) => {
        const isPrimary = film.mode === mode;
        const isOpen = isPrimary || expanded === film.mode;

        return (
          <Section key={film.mode} labelledBy={`film-${film.mode}`}>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <Badge tone={isPrimary ? "accent" : "muted"}>{film.badge}</Badge>
              <h2 id={`film-${film.mode}`} className="text-[20px] font-semibold sm:text-[24px]">
                {film.title}
              </h2>
              <span className="mono text-[12px]" style={{ color: "var(--text-dim)" }}>
                {film.runtime}
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
                <VideoPlayer
                  src={film.src}
                  title={film.title}
                  runtime={film.runtime}
                  poster={<RouteContrast decorative />}
                  onPlay={() => track("video_play", film.mode)}
                />

                {/* The page teaches with the sound off — each beat is tied to
                    the mechanism it demonstrates. */}
                <div>
                  <p className="eyebrow mb-3">What you&rsquo;re seeing</p>
                  <ul>
                    {film.beats.map((b) => (
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
              <Button variant="secondary" onClick={() => setExpanded(film.mode)}>
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
            lede="The interactive demo walks the same transfer step by step, with the live rate and the full transaction map."
          />
          <Button href={`/${mode}/how-it-works`} size="lg">
            Try the interactive demo →
          </Button>
        </div>
      </Section>
    </>
  );
}
