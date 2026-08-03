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
 * The live rate status strip — institutional mode's signature element.
 *
 * Pinned below the header, showing the three corridors in mono with a pulsing
 * teal dot. It is the thesis of the whole site: this company shows you the
 * number before you ask.
 *
 * ## Why nothing here fetches, and nothing here moves
 *
 * The data is Yahoo Finance daily closes, baked into the build (see
 * lib/rates.ts). No request is made from the browser, so the strip is correct
 * on first paint — no spinner, no layout shift, no failure state.
 *
 * The prototype this replaces re-jittered every figure every 2.2 seconds with
 * `rate + rate * (Math.random() - 0.5) * 0.0008`. That looks like a market
 * feed, but these are daily closes: those digits would have been movement
 * that never happened, on the one claim the entire site rests on.
 *
 * The movement shown instead is real — day-over-day change against the
 * previous published close, and a trend line whose every vertex is an actual
 * close on an actual date. Both are checkable against Yahoo.
 *
 * A server component: it has no state, no effects and no interactivity, so it
 * ships as markup with no JavaScript attached.
 */
export function StatusStrip() {
  const latestStamp = latestClose("USD").date;

  return (
    <div
      className="w-full overflow-x-auto border-b"
      style={{ background: "var(--surface)", borderColor: "var(--line)" }}
      aria-label="Indicative exchange rates"
    >
      <div className="mx-auto flex w-full max-w-7xl items-stretch">
        {CORRIDORS.map((c) => {
          // The trend line draws real 5-minute bars, so it shows movement that
          // happened within the day rather than a flat step between closes.
          const bars = intradayFor(c);
          const change = changeVsPreviousClose(c);

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

              {bars.length > 1 && (
                <Sparkline closes={bars.slice(-72)} className="shrink-0" />
              )}

              <span className="ml-auto flex shrink-0 items-baseline gap-2">
                <span
                  className="mono text-[13px] font-medium"
                  style={{ color: "var(--accent-ink)" }}
                >
                  {formatRate(latestClose(c).rate)}
                </span>
                {change && (
                  // Direction is a glyph, not a colour. Whether the rupee
                  // moving is good news depends entirely on which way you are
                  // sending, and this site doesn't editorialise about that.
                  <span
                    className="mono text-[10px]"
                    style={{ color: "var(--text-dim)" }}
                    title={`Change against the previous daily close (${change.previousDate})`}
                  >
                    {change.direction === "up"
                      ? "▲"
                      : change.direction === "down"
                        ? "▼"
                        : "—"}{" "}
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
          {hasLiveData
            ? `Yahoo Finance · as of ${formatRateTime(latestStamp)} · vs previous close`
            : "Sample rates · no published data available"}
        </p>
      </div>
    </div>
  );
}
