"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { StatTile } from "@/components/ui/StatTile";
import {
  BANK_SETTLEMENT_TIME,
  CLEARROUTE_STAGES,
  COMPRESSION_NOTE,
  DEMO_DURATION,
  DEMO_SPEEDUP,
  SETTLEMENT_STAGES,
  SETTLEMENT_TIME,
  STAGE_SCHEDULE,
  type Stage,
} from "@/lib/settlement";
import { formatElapsed } from "./useTransfer";
import type { Mode } from "@/lib/mode";

/**
 * The transaction map, running live.
 *
 * The product's claim is that a transfer is visible the whole way, on any
 * corridor. A static list of five rows asserts that; watching each stage clear
 * in front of you demonstrates it, which is the difference between a page that
 * says "you can see it" and one where you just did.
 *
 * Every stage of a genuine cross-border payment is shown — screening, the
 * debit, the FX execution, the partner-bank leg, local clearing — not a
 * simplified four-step version. The two correspondent hops a typical bank
 * route adds are rendered struck through, so what is being removed is visible
 * rather than merely claimed.
 *
 * Honest about compression: real stage durations sit beside the live timer on
 * every row. The demo clock is fast; the process is not being misrepresented.
 */
export function LiveSettlement({ mode }: { mode: Mode }) {
  const [elapsed, setElapsed] = useState(0);
  // Bumping this restarts the run. Whether the clock is running is derived
  // from elapsed rather than held in its own state — a second piece of state
  // saying the same thing is a second thing that can disagree.
  const [runId, setRunId] = useState(0);
  const startedAt = useRef<number | null>(null);

  // Wall-clock driven rather than tick-counted, so a background tab that
  // throttles timers doesn't quietly under-report how long this has taken.
  useEffect(() => {
    // Date.now() belongs here rather than in a ref initialiser — calling it
    // during render is impure and would answer differently on every pass.
    startedAt.current = Date.now();
    const id = setInterval(() => {
      const seconds = (Date.now() - (startedAt.current ?? Date.now())) / 1000;
      if (seconds >= DEMO_DURATION) clearInterval(id);
      // Never runs backwards, so "skip to the end" can't be undone by a tick
      // that was already in flight.
      setElapsed((prev) => Math.max(prev, Math.min(seconds, DEMO_DURATION)));
    }, 100);
    return () => clearInterval(id);
  }, [runId]);

  // The schedule is in *real* seconds; the demo runs DEMO_SPEEDUP times
  // faster. Converting here keeps one set of durations in lib/settlement.ts
  // rather than a real set and a demo set that can drift apart.
  const realPosition = elapsed * DEMO_SPEEDUP;

  const withState = STAGE_SCHEDULE.map(({ stage, start, end }) => {
    const state: "done" | "active" | "pending" =
      realPosition >= end ? "done" : realPosition >= start ? "active" : "pending";
    const progress =
      state === "active" ? Math.min(1, (realPosition - start) / stage.seconds) : state === "done" ? 1 : 0;
    return { stage, state, progress };
  });

  const complete = elapsed >= DEMO_DURATION;
  const doneCount = withState.filter((w) => w.state === "done").length;

  const restart = () => {
    setElapsed(0);
    setRunId((n) => n + 1); // re-runs the effect, which stamps a fresh start
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start">
      <div>
        {/* Progress header */}
        <div
          className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-b pb-4"
          style={{ borderColor: "var(--line)" }}
        >
          <StatTile
            figure={`${doneCount}/${CLEARROUTE_STAGES.length}`}
            label="stages cleared"
            size="sm"
            accent
          />
          <StatTile figure={formatElapsed(Math.floor(elapsed))} label="elapsed, live" size="sm" />
          <StatTile figure={SETTLEMENT_TIME} label="real-world settlement" size="sm" />
          {complete && <Badge tone="accent">Settled</Badge>}
          {!complete && <Badge tone="warn">In flight</Badge>}
        </div>

        <ol>
          {SETTLEMENT_STAGES.map((s) => {
            const w = withState.find((x) => x.stage.id === s.id);
            return (
              <StageRow
                key={s.id}
                stage={s}
                state={w?.state ?? "pending"}
                progress={w?.progress ?? 0}
                skipped={Boolean(s.bankOnly)}
              />
            );
          })}
        </ol>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={restart}>
            {complete ? "Run it again" : "Restart"}
          </Button>
          {!complete && (
            <Button variant="ghost" onClick={() => setElapsed(DEMO_DURATION)}>
              Skip to the end →
            </Button>
          )}
        </div>
      </div>

      <div>
        <Callout title={complete ? "Settled, end to end" : "Watch it clear"}>
          {mode === "institutional"
            ? "Every stage above is timestamped, recorded and exportable — the audit trail your finance team or auditor can actually work from, including the screening step most providers never surface."
            : "Every step is saved, so you always know exactly where your money is — including the checks that happen before it moves."}
        </Callout>

        <div
          className="mt-5 border p-4"
          style={{ borderColor: "var(--line)", borderRadius: "var(--radius-lg)" }}
        >
          <p className="eyebrow mb-2">Two stages you are not paying for</p>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
            The struck-through rows are the correspondent banks a typical route
            adds. Each holds the payment for 6–24 hours and deducts a fee on the
            way past. Removing them, and pre-funding the destination account, is
            what turns{" "}
            <span className="mono">{BANK_SETTLEMENT_TIME}</span> into{" "}
            <span className="mono" style={{ color: "var(--accent-ink)" }}>
              {SETTLEMENT_TIME}
            </span>
            .
          </p>
        </div>

        <p className="mono mt-5 text-[11px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
          {COMPRESSION_NOTE} Running at {DEMO_SPEEDUP}× real speed.
        </p>
      </div>
    </div>
  );
}

function StageRow({
  stage,
  state,
  progress,
  skipped,
}: {
  stage: Stage;
  state: "done" | "active" | "pending";
  progress: number;
  skipped: boolean;
}) {
  return (
    <li
      className="relative flex gap-4 border-b py-3.5 last:border-b-0"
      style={{ borderColor: "var(--line)", opacity: skipped ? 0.42 : 1 }}
    >
      {/* Marker */}
      <span className="relative mt-0.5 flex w-5 shrink-0 justify-center">
        {skipped ? (
          <span
            aria-hidden="true"
            className="mt-1 h-3.5 w-3.5 rounded-full border"
            style={{ borderColor: "var(--text-dim)", background: "transparent" }}
          />
        ) : state === "done" ? (
          <span
            aria-hidden="true"
            className="flex h-5 w-5 items-center justify-center rounded-full"
            style={{ background: "var(--accent)" }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2 2 4-4" stroke="var(--bg)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        ) : state === "active" ? (
          <span
            aria-hidden="true"
            className="pulse-dot h-5 w-5 rounded-full border-2"
            style={{ borderColor: "var(--accent)", background: "var(--bg)" }}
          />
        ) : (
          <span
            aria-hidden="true"
            className="mt-1 h-3.5 w-3.5 rounded-full border"
            style={{ borderColor: "var(--line)", background: "var(--bg)" }}
          />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p
          className="text-[14px] font-medium"
          style={{
            color: "var(--text)",
            textDecoration: skipped ? "line-through" : "none",
          }}
        >
          {stage.label}
          {skipped && (
            <span className="mono ml-2 text-[10px] tracking-[0.08em] uppercase" style={{ color: "var(--text-dim)" }}>
              removed
            </span>
          )}
        </p>
        <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
          {stage.detail}
        </p>
        <p className="mono mt-1.5 text-[11px]" style={{ color: "var(--text-dim)" }}>
          Custody: {stage.custody}
        </p>

        {/* Live progress on the stage currently clearing */}
        {state === "active" && (
          <span
            aria-hidden="true"
            className="mt-2 block h-0.5 w-full overflow-hidden"
            style={{ background: "var(--line)" }}
          >
            <span
              className="block h-full"
              style={{ width: `${progress * 100}%`, background: "var(--accent)" }}
            />
          </span>
        )}
      </div>

      <p
        className="mono shrink-0 self-start text-right text-[11px]"
        style={{ color: state === "active" ? "var(--accent-ink)" : "var(--text-dim)" }}
      >
        {stage.realWorld}
        {state === "active" && <span className="block">clearing…</span>}
        {state === "done" && !skipped && <span className="block">cleared</span>}
      </p>
    </li>
  );
}
