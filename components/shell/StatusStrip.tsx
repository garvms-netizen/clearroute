"use client";

import { useEffect, useState } from "react";
import {
  CORRIDORS,
  FALLBACK_RATES,
  fetchRates,
  formatRate,
  formatRateDate,
  type RateSet,
} from "@/lib/rates";

/**
 * The live rate status strip — institutional mode's signature element.
 *
 * Pinned below the header, showing indicative rates for the three corridors
 * in mono with a pulsing teal dot. It is the thesis of the whole site: this
 * company shows you the number before you ask.
 *
 * What it deliberately does not do is move. The prototype this is derived
 * from re-jittered each figure every 2.2 seconds, which looks like a live
 * market feed — but ECB reference rates change once per working day, so those
 * digits would be movement that never happened, on the one claim the entire
 * site rests on. The pulsing dot carries "this is connected"; the date
 * carries "this is when it was published"; neither invents a number.
 *
 * Renders the fallback figures immediately rather than a spinner, so the
 * strip never appears empty and never shifts layout when the fetch lands.
 */
export function StatusStrip() {
  const [data, setData] = useState<RateSet>(FALLBACK_RATES);

  useEffect(() => {
    const ac = new AbortController();
    fetchRates(ac.signal)
      .then(setData)
      .catch(() => {
        /* keep the fallback; the label below already says which it is */
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
        {CORRIDORS.map((c) => (
          <div
            key={c}
            className="flex min-w-[168px] flex-1 items-center gap-2 border-r px-4 py-2 sm:px-6"
            style={{ borderColor: "var(--line)" }}
          >
            <span
              className="pulse-dot h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: "var(--accent)" }}
              aria-hidden="true"
            />
            <span className="mono text-[11px]" style={{ color: "var(--text-dim)" }}>
              INR → {c}
            </span>
            <span
              className="mono ml-auto text-[13px] font-medium"
              style={{ color: "var(--accent-ink)" }}
            >
              {formatRate(data.rates[c])}
            </span>
          </div>
        ))}

        <p
          className="mono hidden shrink-0 items-center px-4 py-2 text-[10px] tracking-[0.08em] uppercase lg:flex"
          style={{ color: "var(--text-dim)" }}
        >
          {data.isFallback
            ? "Sample rates · live reference unavailable"
            : `Indicative · ECB reference · ${formatRateDate(data.date)}`}
        </p>
      </div>
    </div>
  );
}
