"use client";

import { useEffect, useState } from "react";
import { Sparkline } from "@/components/ui/Sparkline";
import {
  CORRIDORS,
  dayChange,
  FALLBACK_RATES,
  fetchRateHistory,
  fetchRates,
  formatRate,
  formatRateDate,
  type Close,
  type Corridor,
  type RateSet,
} from "@/lib/rates";

/**
 * The live rate status strip — institutional mode's signature element.
 *
 * Pinned below the header, showing the three corridors in mono with a pulsing
 * teal dot. It is the thesis of the whole site: this company shows you the
 * number before you ask.
 *
 * ## Why the movement here is real
 *
 * The prototype this replaces re-jittered each figure every 2.2 seconds with
 * `rate + rate * (Math.random() - 0.5) * 0.0008`. That looks like a market
 * feed, but ECB reference rates publish once per working day — those digits
 * would have been movement that never happened, on the one claim the entire
 * site rests on.
 *
 * There is no free, keyless, CORS-enabled source of intraday interbank rates,
 * so the alternative isn't "fetch faster". It's to show the movement that
 * genuinely exists: the day-over-day change against the previous published
 * close, and a trend line whose every vertex is a real close on a real date.
 * Both are independently checkable against the ECB. Nothing is interpolated.
 *
 * Renders fallback figures immediately rather than a spinner, so the strip
 * never appears empty and never shifts layout when the fetch lands.
 */
export function StatusStrip() {
  const [data, setData] = useState<RateSet>(FALLBACK_RATES);
  const [history, setHistory] = useState<Record<Corridor, Close[]> | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    fetchRates(ac.signal)
      .then(setData)
      .catch(() => {
        /* keep the fallback; the label already says which it is */
      });

    // Separate request, separate failure mode: if history is unavailable the
    // strip still shows a correct current rate, just without the trend.
    fetchRateHistory(45, ac.signal)
      .then((h) => setHistory(h.series))
      .catch(() => {
        /* no trend line; the figure stands on its own */
      });

    return () => ac.abort();
  }, []);

  return (
    <div
      className="w-full overflow-x-auto border-b"
      style={{ background: "var(--surface)", borderColor: "var(--line)" }}
      aria-label="Indicative exchange rates"
    >
      <div className="mx-auto flex w-full max-w-7xl items-stretch">
        {CORRIDORS.map((c) => {
          const closes = history?.[c] ?? [];
          const change = dayChange(closes);

          return (
            <div
              key={c}
              className="flex min-w-[210px] flex-1 items-center gap-2.5 border-r px-4 py-2 sm:px-5"
              style={{ borderColor: "var(--line)" }}
            >
              <span
                className="pulse-dot h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--accent)" }}
                aria-hidden="true"
              />
              <span
                className="mono shrink-0 text-[11px]"
                style={{ color: "var(--text-dim)" }}
              >
                INR → {c}
              </span>

              {closes.length > 1 && (
                <Sparkline closes={closes.slice(-30)} className="shrink-0" />
              )}

              <span className="ml-auto flex shrink-0 items-baseline gap-2">
                <span
                  className="mono text-[13px] font-medium"
                  style={{ color: "var(--accent-ink)" }}
                >
                  {formatRate(closes.at(-1)?.rate ?? data.rates[c])}
                </span>
                {change && (
                  // Direction is a glyph, not a colour. Whether the rupee
                  // moving is good news depends entirely on which way you're
                  // sending, and this site doesn't editorialise about that.
                  <span
                    className="mono text-[10px]"
                    style={{ color: "var(--text-dim)" }}
                    title={`Change from the ${formatRateDate(change.previousDate)} close`}
                  >
                    {change.direction === "up" ? "▲" : change.direction === "down" ? "▼" : "—"}{" "}
                    {Math.abs(change.pct).toFixed(2)}%
                  </span>
                )}
              </span>
            </div>
          );
        })}

        <p
          className="mono hidden shrink-0 items-center px-4 py-2 text-[10px] tracking-[0.08em] uppercase lg:flex"
          style={{ color: "var(--text-dim)" }}
        >
          {data.isFallback
            ? "Sample rates · live reference unavailable"
            : `ECB reference · close ${formatRateDate(data.date)} · 30-day trend`}
        </p>
      </div>
    </div>
  );
}
