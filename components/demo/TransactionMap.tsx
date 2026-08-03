"use client";

import { Reveal } from "@/components/ui/Reveal";
import { TRANSACTION_MAP } from "@/lib/workedExample";
import { formatElapsed } from "./useTransfer";
import type { Mode } from "@/lib/mode";

/**
 * The transaction map, §9.3 step 4.
 *
 * A dense hairline table in institutional mode; a sequence of soft cards that
 * animate in on scroll in personal. Same rows, same figures, same states.
 *
 * The in-progress row runs a live mm:ss counter. That counter is the one
 * moving number on this site, and it is honest precisely because it measures
 * elapsed demo time rather than pretending to observe a payment.
 */
export function TransactionMap({
  mode,
  elapsed,
}: {
  mode: Mode;
  elapsed: number;
}) {
  const institutional = mode === "institutional";

  const dot = (state: string) => {
    if (state === "done")
      return (
        <span
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--accent)" }}
          aria-hidden="true"
        >
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5l2 2 4-4"
              stroke="var(--bg)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );
    if (state === "active")
      return (
        <span
          className="pulse-dot h-5 w-5 shrink-0 rounded-full border-2"
          style={{ borderColor: "var(--accent)", background: "var(--bg)" }}
          aria-hidden="true"
        />
      );
    return (
      <span
        className="h-3.5 w-3.5 shrink-0 rounded-full border"
        style={{ borderColor: "var(--line)", background: "var(--bg)" }}
        aria-hidden="true"
      />
    );
  };

  return (
    <ol className="relative">
      {TRANSACTION_MAP.map((r, i) => {
        const last = i === TRANSACTION_MAP.length - 1;
        const body = (
          <li
            key={r.row}
            className={
              institutional
                ? "relative flex gap-4 border-b py-3 last:border-b-0"
                : "relative flex gap-4 pb-6 last:pb-0"
            }
            style={institutional ? { borderColor: "var(--line)" } : undefined}
          >
            {/* The spine, drawn behind the markers. */}
            {!last && (
              <span
                aria-hidden="true"
                className="absolute top-6 bottom-0 left-[9px] w-px"
                style={{
                  background:
                    r.state === "done" ? "var(--accent)" : "var(--line)",
                }}
              />
            )}

            <span className="relative z-10 mt-1 flex w-[19px] justify-center">
              {dot(r.state)}
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                {r.row}
              </p>
              <p className="mono mt-0.5 text-[12px]" style={{ color: "var(--text-dim)" }}>
                {r.detail}
              </p>
            </div>

            <p
              className="mono shrink-0 self-start text-[12px]"
              style={{
                color: r.state === "active" ? "var(--accent-ink)" : "var(--text-dim)",
              }}
            >
              {r.state === "active" ? (
                <>
                  in progress · <span aria-live="off">{formatElapsed(elapsed)}</span>
                </>
              ) : (
                r.time
              )}
            </p>
          </li>
        );

        // Personal mode brings each node in as it is scrolled to; institutional
        // renders the whole table at once, because a finance page that
        // withholds rows until you scroll is withholding evidence.
        return institutional ? (
          body
        ) : (
          <Reveal key={r.row} delay={i * 60}>
            {body}
          </Reveal>
        );
      })}
    </ol>
  );
}
