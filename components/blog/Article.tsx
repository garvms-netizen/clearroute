"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/home/Section";
import { ARTICLE, type Block } from "@/lib/article";
import { track } from "@/lib/track";

/**
 * The published article.
 *
 * Reading width is capped at 68ch and every figure renders in mono. The table
 * of contents is generated from the section headings rather than maintained
 * by hand, so it cannot fall out of step with the article.
 *
 * Text is rendered verbatim from lib/article.ts — §23 is final copy and
 * nothing here paraphrases it.
 */
export function Article() {
  const [activeId, setActiveId] = useState(ARTICLE.sections[0].id);

  // Fires once, when someone has actually read into the body rather than
  // bounced off the header — a page view already covers arriving.
  useEffect(() => {
    let fired = false;
    const onScroll = () => {
      if (fired || window.scrollY < 600) return;
      fired = true;
      track("blog_read", ARTICLE.slug);
      window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view in the sticky contents.
  useEffect(() => {
    const headings = ARTICLE.sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-120px 0px -70% 0px" },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <Eyebrow>BLOG · CROSS-BORDER PAYMENTS</Eyebrow>
        <h1
          className="mt-3 text-[28px] leading-[1.15] font-semibold sm:text-[38px]"
          style={{ maxWidth: "20ch" }}
        >
          {ARTICLE.title}
        </h1>
        <p className="mono mt-4 text-[12px]" style={{ color: "var(--text-dim)" }}>
          {ARTICLE.readingTime}
        </p>
      </div>

      <Section labelledBy="article-body">
        <h2 id="article-body" className="sr-only">
          Article
        </h2>

        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,68ch)] lg:gap-16">
          {/* Sticky contents — desktop only. */}
          <nav
            aria-label="On this page"
            className="hidden lg:block"
            style={{ position: "sticky", top: 120, alignSelf: "start" }}
          >
            <Eyebrow className="mb-3">On this page</Eyebrow>
            <ol className="space-y-2">
              {ARTICLE.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={activeId === s.id ? "true" : undefined}
                    className="block text-[13px] leading-snug"
                    style={{
                      color: activeId === s.id ? "var(--accent-ink)" : "var(--text-dim)",
                      fontWeight: activeId === s.id ? 600 : 400,
                      borderLeft: `2px solid ${activeId === s.id ? "var(--accent)" : "var(--line)"}`,
                      paddingLeft: 12,
                    }}
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article style={{ maxWidth: "68ch" }}>
            {ARTICLE.intro.map((p) => (
              <p
                key={p.slice(0, 24)}
                className="mb-4 text-[16px] leading-[1.75]"
                style={{ color: "var(--text)" }}
              >
                <Rich text={p} />
              </p>
            ))}

            {ARTICLE.sections.map((s) => (
              <section key={s.id} className="mt-10">
                <h2
                  id={s.id}
                  className="text-[21px] leading-snug font-semibold sm:text-[24px]"
                >
                  {s.heading}
                </h2>
                <div className="mt-4">
                  {s.blocks.map((b, i) => (
                    <BlockView key={i} block={b} />
                  ))}
                </div>
              </section>
            ))}

            <p
              className="mt-12 border-t pt-5 text-[12px] leading-relaxed"
              style={{ borderColor: "var(--line)", color: "var(--text-dim)" }}
            >
              {ARTICLE.sources}
            </p>

            <Callout variant="project-note" className="mt-6">
              Clear Route is a fictional company created for an academic
              marketing project. The industry figures cited above are drawn from
              the published sources listed, but Clear Route itself is not a real
              financial services provider and does not process transactions.
            </Callout>
          </article>
        </div>
      </Section>

      {/* Related band */}
      <Section labelledBy="related">
        <h2 id="related" className="text-[20px] font-semibold sm:text-[24px]">
          See the mechanism, not just the argument
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/institutional/how-it-works" size="lg">
            Try the interactive demo →
          </Button>
          <Button href="/demo" variant="secondary" size="lg">
            Watch the product demo
          </Button>
        </div>
        <p className="mt-6 text-sm">
          <Link href="/blog" className="underline underline-offset-4" style={{ color: "var(--accent-ink)" }}>
            ← All articles
          </Link>
        </p>
      </Section>
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  if (block.t === "h3") {
    return (
      <h3 className="mt-6 mb-2 text-[16px] font-semibold" style={{ color: "var(--text)" }}>
        {block.text}
      </h3>
    );
  }

  if (block.t === "ul") {
    return (
      <ul className="my-4 space-y-3">
        {block.items.map((item) => (
          <li
            key={item.text.slice(0, 24)}
            className="flex gap-3 text-[16px] leading-[1.75]"
            style={{ color: "var(--text)" }}
          >
            <span
              aria-hidden="true"
              className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            <span>
              {item.lead && <strong style={{ color: "var(--text)" }}>{item.lead}</strong>}{" "}
              <Rich text={item.text} />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="mb-4 text-[16px] leading-[1.75]" style={{ color: "var(--text)" }}>
      <Rich text={block.text} />
    </p>
  );
}

/**
 * Renders **bold** spans, and sets every figure in mono.
 *
 * The figures are the argument in this article — 6.2–6.4%, $30–90, 68%, $150
 * trillion — so they get the same monospaced treatment as every other number
 * on the site rather than disappearing into the prose.
 */
function Rich({ text }: { text: string }) {
  // Split on bold markers first, then on figures within each plain run.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} style={{ color: "var(--text)" }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <Figures key={i} text={part} />;
      })}
    </>
  );
}

const FIGURE =
  /(\$[\d,.]+(?:[–-]\d[\d,.]*)?(?:\s?(?:trillion|billion|million))?|\d+(?:\.\d+)?(?:[–-]\d+(?:\.\d+)?)?%|USD\s\d+)/g;

function Figures({ text }: { text: string }) {
  // String.split with a capturing group puts every match at an odd index, so
  // position alone identifies the figures. Calling FIGURE.test() here instead
  // would be wrong: a /g regex carries lastIndex between calls and would
  // return alternating results for the same input.
  const parts = text.split(FIGURE);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} className="mono text-[0.94em]">
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
