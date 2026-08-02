"use client";

/**
 * STAGE 0 PLACEHOLDER — replaced by the entry fork (§7) at Stage 4.
 *
 * Its only job is to prove the foundation before another line gets written:
 * the static export resolves under basePath, both fonts load, and every token
 * repaints when data-mode changes.
 */

import { useState } from "react";
import type { Mode } from "@/lib/mode";

const TOKENS = [
  "--bg",
  "--surface",
  "--surface-2",
  "--line",
  "--text",
  "--text-dim",
  "--brand",
  "--accent",
  "--highlight",
  "--warm",
] as const;

const FIGURES: [string, string][] = [
  ["Send", "₹5,00,000.00"],
  ["INR → USD", "83.4210"],
  ["Recipient receives", "$5,994.89"],
  ["ClearRoute margin (0.40%)", "₹0.00 — waived"],
  ["Debited", "09:14:02 IST"],
];

export default function StageZeroCheck() {
  const [mode, setMode] = useState<Mode | null>(null);

  const apply = (next: Mode | null) => {
    setMode(next);
    const el = document.documentElement;
    if (next) el.setAttribute("data-mode", next);
    else el.removeAttribute("data-mode");
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="eyebrow">STAGE 0 · FOUNDATION CHECK</p>

      <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
        See every step your money takes. Every time.
      </h1>

      <p className="mt-4 max-w-[var(--measure)] text-[var(--text-dim)]">
        Inter renders this sentence. The figures below render in IBM Plex Mono
        with tabular figures, and every swatch is a CSS custom property scoped
        to <code>[data-mode]</code>.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {([null, "institutional", "personal"] as const).map((m) => (
          <button
            key={String(m)}
            onClick={() => apply(m)}
            aria-pressed={mode === m}
            className="border px-4 py-2 text-sm"
            style={{
              borderColor: mode === m ? "var(--accent)" : "var(--line)",
              color: mode === m ? "var(--accent)" : "var(--text)",
              borderRadius: "var(--radius)",
              transition: "all var(--motion) var(--ease)",
            }}
          >
            {m ?? "fork (no mode)"}
          </button>
        ))}
      </div>

      <dl className="mt-10 border-t" style={{ borderColor: "var(--line)" }}>
        {FIGURES.map(([label, value]) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-4 border-b py-3"
            style={{ borderColor: "var(--line)" }}
          >
            <dt className="text-sm text-[var(--text-dim)]">{label}</dt>
            <dd className="mono text-sm">{value}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {TOKENS.map((t) => (
          <li key={t}>
            <div
              className="h-14 w-full border"
              style={{
                background: `var(${t})`,
                borderColor: "var(--line)",
                borderRadius: "var(--radius)",
              }}
            />
            <span className="mono mt-1 block text-[10px] text-[var(--text-dim)]">
              {t}
            </span>
          </li>
        ))}
      </ul>

      <p className="mono mt-12 text-[11px] leading-relaxed text-[var(--text-dim)]">
        ClearRoute is a fictional company created for an academic marketing
        project. It is not a real financial services provider, is not licensed
        or regulated, and does not process real transactions.
      </p>
    </main>
  );
}
