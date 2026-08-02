"use client";

import Link from "next/link";
import { useMode } from "@/components/ModeProvider";
import { RouteMark } from "@/components/art/RouteMark";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { track } from "@/lib/track";
import { H1_SHARED, PITCH_15 } from "@/lib/copy";
import type { Mode } from "@/lib/mode";

/**
 * The entry fork (§7) — the first thing every visitor sees.
 *
 * No mode is applied to this page. It renders on the Deep Route Blue field
 * with off-white type, using only the shared spine, so the brand is
 * established before either expression of it is.
 *
 * There is no navigation beyond the wordmark. The fork is the only decision
 * on the page, and a nav bar would offer a way around the question the page
 * exists to ask.
 *
 * The two panels don't describe the difference between the modes — they
 * *are* the difference. Each card carries its own `data-mode`, so the token
 * blocks paint it in that mode's real palette, radius and transition speed.
 * The visitor sees both worlds before reading a word about either, and the
 * hover line moves at each mode's own pace: 120ms institutional, 300ms
 * personal. Same mechanism as the rest of the site, no special-casing.
 */

type Choice = {
  mode: Mode;
  eyebrow: string;
  heading: string;
  body: string;
  href: string;
};

const CHOICES: Choice[] = [
  {
    mode: "institutional",
    eyebrow: "FOR BUSINESSES",
    heading: "Moving company money",
    body: "Vendor payments, subsidiary funding, contractor payouts — with the rate transparency and audit trail your CFO expects.",
    href: "/institutional",
  },
  {
    mode: "personal",
    eyebrow: "FOR INDIVIDUALS",
    heading: "Sending money yourself",
    body: "Tuition, family support, freelance income — sent at a rate you can see, tracked the whole way.",
    href: "/personal",
  },
];

export function EntryFork() {
  const { storedMode, choose } = useMode();

  return (
    <div className="flex min-h-screen flex-col px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
        <header className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2.5">
            <RouteMark size={30} decorative />
            <span
              className="text-2xl leading-none font-semibold"
              style={{ letterSpacing: "-0.02em", color: "var(--text)" }}
            >
              clearroute
            </span>
          </span>

          <h1 className="mt-10 max-w-2xl text-[30px] leading-[1.12] font-semibold sm:text-[42px]">
            {H1_SHARED}
          </h1>

          <p
            className="mt-4 max-w-xl text-[15px] leading-relaxed sm:text-base"
            style={{ color: "var(--text-dim)" }}
          >
            {PITCH_15}
          </p>
        </header>

        <section className="mt-12 sm:mt-14" aria-labelledby="who">
          <h2
            id="who"
            className="text-center text-lg font-semibold sm:text-xl"
          >
            Who&rsquo;s sending?
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5">
            {CHOICES.map((c) => (
              <ForkCard
                key={c.mode}
                choice={c}
                previouslyChosen={storedMode === c.mode}
                onChoose={() => {
                  choose(c.mode);
                  track("mode_selected", c.mode);
                }}
              />
            ))}
          </div>
        </section>

        <p className="mt-8 text-center text-sm">
          <Link
            href="/personal/how-it-works"
            className="underline-offset-4 hover:underline"
            style={{ color: "var(--text-dim)" }}
          >
            Not sure? Start with how a transfer actually works →
          </Link>
        </p>

        <footer className="mt-auto pt-14">
          <Disclaimer className="mx-auto text-center" />
        </footer>
      </div>
    </div>
  );
}

function ForkCard({
  choice,
  previouslyChosen,
  onChoose,
}: {
  choice: Choice;
  previouslyChosen: boolean;
  onChoose: () => void;
}) {
  const institutional = choice.mode === "institutional";

  return (
    <Link
      href={choice.href}
      onClick={onChoose}
      data-mode={choice.mode}
      className="group relative flex flex-col overflow-hidden border p-6 sm:p-7"
      style={{
        // Every value here comes from the card's own data-mode, so this is
        // genuinely that mode's palette rather than an approximation of it.
        background: "var(--bg)",
        borderColor: "var(--line)",
        // --radius, not --radius-lg: §7 asks for sharp corners on the
        // institutional card and 16px on the individual one, which is exactly
        // what the base radius token carries in each mode.
        borderRadius: "var(--radius)",
        color: "var(--text)",
      }}
    >
      <span className="eyebrow">{choice.eyebrow}</span>

      <span
        className="mt-3 text-xl font-semibold sm:text-[22px]"
        style={{ color: "var(--text)" }}
      >
        {choice.heading}
      </span>

      <span
        className="mt-2.5 text-sm leading-relaxed"
        style={{ color: "var(--text-dim)" }}
      >
        {choice.body}
      </span>

      {/* A taste of each mode's motion personality: the accent line wipes in
          at the pace that mode moves at everywhere else. */}
      <span
        aria-hidden="true"
        className="mt-6 block h-px w-full origin-left scale-x-0 transition-transform group-hover:scale-x-100 group-focus-visible:scale-x-100"
        style={{
          background: "var(--accent)",
          transitionDuration: "var(--motion)",
          transitionTimingFunction: "var(--ease)",
        }}
      />

      <span
        className="mt-4 text-sm font-medium"
        style={{ color: "var(--accent-ink)" }}
      >
        Enter →
      </span>

      {previouslyChosen && (
        <span
          className="mono absolute top-4 right-4 text-[10px] tracking-[0.1em] uppercase"
          style={{ color: "var(--text-dim)" }}
        >
          Last time you chose this
        </span>
      )}

      {/* Institutional gets a hairline rule top-right, personal doesn't —
          a small density cue rather than a decoration. */}
      {institutional && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "var(--line)" }}
        />
      )}
    </Link>
  );
}
