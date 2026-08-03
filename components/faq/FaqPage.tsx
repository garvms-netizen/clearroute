"use client";

import Link from "next/link";
import { useMode } from "@/components/ModeProvider";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";
import { FAQ_COUNT, FAQ_GROUPS } from "@/lib/faq";

/**
 * /faq, §16.1.
 *
 * Five groups, every question deep-linkable by hash. The Accordion reads
 * location.hash on mount and on hashchange, so /faq#is-the-rate-marked-up
 * opens that answer and scrolls to it — which is what makes the in-page group
 * links below actually useful rather than decorative.
 */
export function FaqPage() {
  const { mode } = useMode();

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="FAQ"
          level={1}
          title="The questions worth asking before you send money anywhere."
          lede={`${FAQ_COUNT} answers, each kept short and specific. Where the honest answer is that Clear Route is fictional and holds no licence, that is the answer given.`}
        />

        <nav aria-label="FAQ sections" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {FAQ_GROUPS.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="inline-block border px-3.5 py-2 text-[13px]"
                  style={{
                    borderColor: "var(--line)",
                    borderRadius: "var(--radius)",
                    color: "var(--text-dim)",
                  }}
                >
                  {g.title}{" "}
                  <span className="mono text-[11px]">{g.items.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {FAQ_GROUPS.map((g) => (
        <Section key={g.id} labelledBy={g.id}>
          <h2 id={g.id} className="text-[20px] font-semibold sm:text-[24px]">
            {g.title}
          </h2>
          <Accordion
            className="mt-6"
            multiple
            items={g.items.map((i) => ({
              id: i.id,
              question: i.q,
              answer: i.a,
            }))}
          />
        </Section>
      ))}

      <Section labelledBy="faq-cta">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 id="faq-cta" className="text-[20px] font-semibold sm:text-[24px]">
              Still deciding?
            </h2>
            <p
              className="mt-2 text-[15px]"
              style={{ color: "var(--text-dim)", maxWidth: "var(--measure)" }}
            >
              The interactive demo answers most of this by showing it — the
              rate, the fee breakdown, the route, and what a second currency
              leg actually looks like.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={`/${mode}/how-it-works`} size="lg">
              Try the interactive demo →
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Ask us directly
            </Button>
          </div>
        </div>

        <p className="mt-6 text-sm">
          <Link
            href="/security"
            className="underline underline-offset-4"
            style={{ color: "var(--accent-ink)" }}
          >
            Read the full security and compliance posture →
          </Link>
        </p>
      </Section>
    </>
  );
}
