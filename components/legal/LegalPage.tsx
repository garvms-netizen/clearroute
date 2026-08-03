"use client";

import Link from "next/link";
import { Callout } from "@/components/ui/Callout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";

/**
 * /legal/terms and /legal/privacy, §16.5.
 *
 * Real structure, plainly written, each opening with a banner stating these
 * carry no legal force.
 *
 * The privacy document is the one that has to be *accurate* rather than
 * merely plausible: it describes what this website genuinely does — form
 * submissions to a private Google Sheet, anonymous events with a session
 * identifier, no cookies, no third-party trackers, no advertising pixels.
 * Every one of those claims is checkable against the source, and a fictional
 * company publishing an inaccurate privacy policy would be modelling the
 * behaviour this project exists to criticise.
 */

export type LegalSection = { id: string; heading: string; paras: string[] };

export function LegalPage({
  eyebrow,
  title,
  lede,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader eyebrow={eyebrow} level={1} title={title} lede={lede} />
        <p className="mono mt-4 text-[11px]" style={{ color: "var(--text-dim)" }}>
          Last updated {updated}
        </p>

        <Callout variant="project-note" className="mt-8">
          <strong style={{ color: "var(--text)" }}>
            This is a fictional company created for an academic project.
          </strong>{" "}
          These documents are illustrative and carry no legal force. Clear Route
          is not a real financial services provider, holds no licence, and does
          not process transactions. Nothing here creates rights or obligations
          for anyone.
        </Callout>
      </div>

      <Section labelledBy="legal-body">
        <h2 id="legal-body" className="sr-only">
          {title}
        </h2>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,220px)_minmax(0,68ch)] lg:gap-16">
          <nav aria-label="Contents" className="hidden lg:block" style={{ position: "sticky", top: 120, alignSelf: "start" }}>
            <p className="eyebrow mb-3">Contents</p>
            <ol className="space-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block text-[13px] leading-snug"
                    style={{ color: "var(--text-dim)", borderLeft: "2px solid var(--line)", paddingLeft: 12 }}
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div style={{ maxWidth: "68ch" }}>
            {sections.map((s, i) => (
              <section key={s.id} className={i === 0 ? "" : "mt-9"}>
                <h3 id={s.id} className="text-[17px] font-semibold sm:text-[19px]">
                  <span className="mono mr-2 text-[13px]" style={{ color: "var(--text-dim)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.heading}
                </h3>
                {s.paras.map((p) => (
                  <p
                    key={p.slice(0, 24)}
                    className="mt-3 text-[15px] leading-[1.75]"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {p}
                  </p>
                ))}
              </section>
            ))}

            <p className="mt-10 text-sm">
              <Link
                href={eyebrow === "LEGAL · PRIVACY" ? "/legal/terms" : "/legal/privacy"}
                className="underline underline-offset-4"
                style={{ color: "var(--accent-ink)" }}
              >
                {eyebrow === "LEGAL · PRIVACY" ? "Read the terms →" : "Read the privacy policy →"}
              </Link>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
