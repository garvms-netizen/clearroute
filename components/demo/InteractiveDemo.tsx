"use client";

import { useEffect, useRef } from "react";
import type { Mode } from "@/lib/mode";
import { track } from "@/lib/track";
import { Callout } from "@/components/ui/Callout";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DEMO_DATA_NOTE } from "@/lib/copy";
import { useTransfer, type Step } from "./useTransfer";
import { StepLock, StepRoute, StepSecondLeg, StepWatch } from "./steps";

/**
 * The interactive transaction demo, §9 — the product proof, and the most
 * important page on the site.
 *
 * Same logic and same numbers in both modes; only presentation changes.
 *
 * - **Institutional** presents the four steps as a horizontal strip with mono
 *   numerals, and shows every step's panel in dense hairline-bordered tables.
 * - **Personal** runs the same four steps as a vertical narrative, one step
 *   per screen, with map nodes arriving as they are scrolled to and friendlier
 *   headings.
 */

const HEADINGS: Record<Mode, string[]> = {
  institutional: [
    "Choose your route",
    "Lock your rate",
    "Add another leg",
    "Watch it move",
  ],
  personal: [
    "Pick where it's going",
    "Lock in your rate",
    "Send more than one currency",
    "Watch it arrive",
  ],
};

export function InteractiveDemo({ mode }: { mode: Mode }) {
  const t = useTransfer();
  const institutional = mode === "institutional";
  const headings = HEADINGS[mode];
  const lastTracked = useRef<Step | null>(null);

  // Report progress through the funnel. Guarded so re-renders don't re-fire
  // the same step, which would make the Interest-stage numbers meaningless.
  useEffect(() => {
    if (lastTracked.current === t.step) return;
    lastTracked.current = t.step;
    track("demo_step", `${mode}:${t.step}`);
  }, [t.step, mode]);

  const panels: React.ReactNode[] = [
    <StepRoute key="1" t={t} mode={mode} />,
    <StepLock key="2" t={t} />,
    <StepSecondLeg key="3" t={t} />,
    <StepWatch key="4" t={t} mode={mode} />,
  ];

  const reached = (i: number) => i + 1 <= t.step;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-[var(--section-y)] sm:px-6">
      <SectionHeader
        eyebrow="HOW IT WORKS"
        level={1}
        title={
          institutional
            ? "Four steps. Nothing hidden at any of them."
            : "See exactly how your money gets there."
        }
        lede={
          institutional
            ? "A worked transfer, end to end. Every figure below reconciles with the pricing page."
            : "Walk through a real transfer at your own pace. Nothing here costs anything or asks for an account."
        }
      />

      {institutional ? (
        /* ---- Institutional: horizontal step strip, dense panels ---- */
        <div className="mt-10">
          <div
            className="flex flex-wrap gap-px border-b"
            style={{ borderColor: "var(--line)" }}
            role="tablist"
            aria-label="Transfer steps"
          >
            {headings.map((h, i) => {
              const selected = t.step === i + 1;
              return (
                <button
                  key={h}
                  role="tab"
                  aria-selected={selected}
                  // Steps unlock as they are reached — jumping to the
                  // transaction map before locking a rate would show a route
                  // for a transfer that was never set up.
                  disabled={!reached(i)}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => t.setStep((i + 1) as Step)}
                  className="-mb-px flex items-center gap-2 border-b-2 px-3 py-3 text-sm disabled:opacity-35 sm:px-4"
                  style={{
                    borderColor: selected ? "var(--accent)" : "transparent",
                    color: selected ? "var(--text)" : "var(--text-dim)",
                    fontWeight: selected ? 600 : 400,
                  }}
                >
                  <span
                    className="mono text-xs"
                    style={{ color: selected ? "var(--accent-ink)" : "var(--text-dim)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {h}
                </button>
              );
            })}
          </div>

          <div className="pt-8">{panels[t.step - 1]}</div>
        </div>
      ) : (
        /* ---- Personal: vertical narrative, one step per screen ---- */
        <div className="mt-12 space-y-[var(--section-y)]">
          {headings.map((h, i) => {
            if (!reached(i)) return null;
            return (
              <section key={h} aria-labelledby={`step-${i + 1}`}>
                <Eyebrow className="mb-2">Step {i + 1} of 4</Eyebrow>
                <h2 id={`step-${i + 1}`} className="text-[24px] font-semibold sm:text-[30px]">
                  {h}
                </h2>
                <div className="mt-6">{panels[i]}</div>
              </section>
            );
          })}
        </div>
      )}

      <Callout variant="project-note" className="mt-12">
        {DEMO_DATA_NOTE}
      </Callout>
    </div>
  );
}
