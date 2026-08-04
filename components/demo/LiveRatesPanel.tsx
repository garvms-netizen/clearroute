import { Sparkline } from "@/components/ui/Sparkline";
import {
  changeVsPreviousClose,
  CORRIDORS,
  formatRate,
  formatRateTime,
  hasLiveData,
  intradayFor,
  latestClose,
} from "@/lib/rates";

/**
 * Published market rates, shown inside the demo.
 *
 * The status strip only exists in institutional mode, so a personal-mode
 * visitor never saw a live figure anywhere — on a product whose first claim is
 * "see the real rate", that was the wrong thing to hide. This panel puts the
 * real published rates in the demo itself, in both modes, on the step where
 * someone is deciding whether to believe the claim.
 *
 * A server component: no state, no effects, no JavaScript shipped. The data is
 * baked in at build time (see lib/rates.ts).
 */
export function LiveRatesPanel() {
  const stamp = latestClose("USD").date;

  return (
    <div
      className="overflow-hidden border"
      style={{ borderColor: "var(--line)", borderRadius: "var(--radius-lg)" }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5"
        style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--line)" }}
      >
        <span className="flex items-center gap-2">
          <span
            className="pulse-dot h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--accent)" }}
            aria-hidden="true"
          />
          <span className="eyebrow">Published market rates</span>
        </span>
        <span className="mono text-[10px]" style={{ color: "var(--text-dim)" }}>
          {hasLiveData ? `Yahoo Finance · ${formatRateTime(stamp)}` : "sample rates"}
        </span>
      </div>

      <ul>
        {CORRIDORS.map((c) => {
          const bars = intradayFor(c);
          const change = changeVsPreviousClose(c);
          return (
            <li
              key={c}
              className="flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0"
              style={{ borderColor: "var(--line)" }}
            >
              <span className="mono shrink-0 text-[12px]" style={{ color: "var(--text-dim)" }}>
                INR → {c}
              </span>
              {bars.length > 1 && (
                <Sparkline closes={bars.slice(-72)} width={56} className="shrink-0" />
              )}
              <span className="ml-auto flex shrink-0 items-baseline gap-2">
                <span className="mono text-[14px] font-medium" style={{ color: "var(--accent-ink)" }}>
                  {formatRate(latestClose(c).rate)}
                </span>
                {change && (
                  <span className="mono text-[10px]" style={{ color: "var(--text-dim)" }}>
                    {change.direction === "up" ? "▲" : change.direction === "down" ? "▼" : "—"}{" "}
                    {Math.abs(change.pct).toFixed(2)}%
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      <p
        className="mono px-4 py-2.5 text-[10px] leading-relaxed"
        style={{ color: "var(--text-dim)", borderTop: "1px solid var(--line)" }}
      >
        Real published closes with real day-over-day change. Nothing here is
        simulated — see any of these on Yahoo Finance.
      </p>
    </div>
  );
}
