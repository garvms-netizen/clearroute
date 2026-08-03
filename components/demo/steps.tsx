"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { DataList, DataRow } from "@/components/ui/DataRow";
import { StatTile } from "@/components/ui/StatTile";
import { TransactionMap } from "./TransactionMap";
import { formatMoney, formatRate, formatRateDate } from "@/lib/rates";
import {
  BANK_RATE,
  BANK_SETTLEMENT,
  BANK_USD,
  DIFFERENCE_USD,
  MARGIN_PCT,
} from "@/lib/workedExample";
import { OFFER_HEADLINE, OFFER_TERMS } from "@/lib/copy";
import type { Mode } from "@/lib/mode";
import type { useTransfer } from "./useTransfer";

type T = ReturnType<typeof useTransfer>;

const fieldStyle: React.CSSProperties = {
  background: "var(--surface-2)",
  border: "1px solid var(--line)",
  borderRadius: "var(--radius)",
  color: "var(--text)",
};

/* ---------------------------------------------------------------- Step 1 -- */

export function StepRoute({ t, mode }: { t: T; mode: Mode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <div className="mb-5">
          <label htmlFor="amount" className="mb-2 block text-[13px]" style={{ color: "var(--text-dim)" }}>
            Amount to send
          </label>
          <div className="flex items-center gap-2">
            <span className="mono text-sm" style={{ color: "var(--text-dim)" }}>
              ₹
            </span>
            <input
              id="amount"
              type="number"
              min={1}
              inputMode="numeric"
              value={t.amount}
              onChange={(e) => t.setAmount(Math.max(0, Number(e.target.value) || 0))}
              className="mono w-full px-3.5 py-3 text-[15px]"
              style={fieldStyle}
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="corridor" className="mb-2 block text-[13px]" style={{ color: "var(--text-dim)" }}>
            Sending in / receiving in
          </label>
          <select
            id="corridor"
            value={t.corridor}
            onChange={(e) => t.setCorridor(e.target.value as typeof t.corridor)}
            className="w-full px-3.5 py-3 text-[15px]"
            style={fieldStyle}
          >
            {t.corridors.map((c) => (
              <option key={c} value={c}>
                INR → {c}
              </option>
            ))}
          </select>
        </div>

        <Button size="lg" onClick={t.lockLeg1}>
          Lock this rate →
        </Button>

        <p className="mt-5 text-[13px] leading-relaxed" style={{ color: "var(--text-dim)", maxWidth: "56ch" }}>
          No account needed to see this. The rate above is the real reference
          rate — not a marked-up customer rate.
        </p>
      </div>

      <div
        className="p-5 sm:p-6"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">
              {t.isWorkedExample ? "Illustrative example" : "Indicative rate"}
            </p>
            <p className="mono text-3xl font-medium sm:text-4xl" style={{ color: "var(--accent-ink)" }}>
              {formatRate(t.quotedRate)}
            </p>
            <p className="mono mt-1 text-[12px]" style={{ color: "var(--text-dim)" }}>
              INR → {t.corridor}
            </p>
          </div>
          <span
            className="pulse-dot mt-1 h-2 w-2 shrink-0 rounded-full"
            style={{ background: "var(--accent)" }}
            aria-hidden="true"
          />
        </div>

        <DataList className="mt-5">
          <DataRow label="You send" value={formatMoney(t.amount, "INR")} />
          <DataRow
            label="Recipient receives"
            value={formatMoney(t.receiveAmount, t.corridor)}
            strong
          />
          <DataRow label="Estimated hops" value="2" />
          <DataRow label="Estimated settlement" value="~4 hours" />
        </DataList>

        {/* The page is explicit about which number the visitor is looking at.
            Blurring the illustrative example into the live rate is how a demo
            ends up quietly contradicting the pricing page beside it. */}
        <p className="mono mt-4 text-[11px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
          {t.isWorkedExample ? (
            <>
              Worked example at the brief&rsquo;s illustrative rate, so these
              figures match /pricing exactly. Change the amount or currency to
              quote from today&rsquo;s live reference instead.
            </>
          ) : t.rateState === "fallback" ? (
            <>Showing sample rates — live reference unavailable.</>
          ) : (
            <>
              Indicative rate · ECB reference · close{" "}
              {formatRateDate(t.live.date)}. Published once per working day, not
              tick-by-tick.
            </>
          )}
        </p>

        {mode === "institutional" && (
          <p className="mono mt-2 text-[11px]" style={{ color: "var(--text-dim)" }}>
            Rate held from confirmation through settlement.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Step 2 -- */

export function StepLock({ t }: { t: T }) {
  const leg = t.legs[0];
  if (!leg) return null;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <DataList>
          <DataRow label="You send" value={formatMoney(leg.sendAmount, "INR")} />
          <DataRow label="Exchange rate applied" value={formatRate(leg.rate)} />
          <DataRow
            label="ClearRoute margin"
            note={`standard ${MARGIN_PCT.toFixed(2)}%`}
            value={`${formatMoney(0, "INR")} — waived`}
            accent
          />
          <DataRow label="Network & correspondent fees" value={formatMoney(0, "INR")} />
          <DataRow
            label="Recipient receives"
            value={formatMoney(leg.receiveAmount, leg.to)}
            strong
          />
        </DataList>

        <p className="mono mt-3 text-[11px]" style={{ color: "var(--text-dim)" }}>
          Locked at {leg.lockedAt} · held through settlement
        </p>

        <Callout variant="offer" title={OFFER_HEADLINE} className="mt-6">
          {OFFER_TERMS}
        </Callout>
      </div>

      <div>
        <p className="eyebrow mb-3">Same rupees, two routes</p>
        <div
          className="grid grid-cols-2 gap-px"
          style={{ background: "var(--line)", border: "1px solid var(--line)" }}
        >
          {[
            {
              head: "A typical bank route",
              rate: formatRate(BANK_RATE),
              hops: "3",
              time: BANK_SETTLEMENT,
              got: formatMoney(BANK_USD, "USD"),
              accent: false,
            },
            {
              head: "ClearRoute",
              rate: formatRate(leg.rate),
              hops: String(leg.hops),
              time: leg.eta,
              got: formatMoney(leg.receiveAmount, leg.to),
              accent: true,
            },
          ].map((col) => (
            <div key={col.head} className="p-4" style={{ background: "var(--surface)" }}>
              <p className="text-[13px] font-semibold">{col.head}</p>
              <dl className="mt-3 space-y-2">
                {[
                  ["Rate applied", col.rate],
                  ["Hops", col.hops],
                  ["Settlement", col.time],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[11px]" style={{ color: "var(--text-dim)" }}>
                      {k}
                    </dt>
                    <dd className="mono text-[13px]">{v}</dd>
                  </div>
                ))}
                <div className="pt-1">
                  <dt className="text-[11px]" style={{ color: "var(--text-dim)" }}>
                    Recipient receives
                  </dt>
                  <dd
                    className="mono text-base font-medium"
                    style={{ color: col.accent ? "var(--accent-ink)" : "var(--text)" }}
                  >
                    {col.got}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[13px]" style={{ color: "var(--text-dim)" }}>
          A difference of{" "}
          <span className="mono" style={{ color: "var(--accent-ink)" }}>
            {formatMoney(DIFFERENCE_USD, "USD")}
          </span>{" "}
          on the same ₹5,00,000 — almost none of it visible as a fee.
        </p>

        <Button className="mt-6" size="lg" onClick={t.addSecondLeg}>
          Add another leg →
        </Button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Step 3 -- */

export function StepSecondLeg({ t }: { t: T }) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {t.legs.map((leg, i) => (
          <div
            key={leg.id}
            className="p-5"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[15px] font-semibold">
                Leg {i + 1} · {leg.from} → {leg.to}
              </p>
              <Badge tone="accent">Locked</Badge>
            </div>
            <DataList>
              <DataRow label="Sending" value={formatMoney(leg.sendAmount, leg.from)} />
              <DataRow label="Rate locked" value={formatRate(leg.rate)} />
              <DataRow label="Receiving" value={formatMoney(leg.receiveAmount, leg.to)} strong />
              <DataRow label="Hops" value={String(leg.hops)} />
              <DataRow label="Estimated" value={leg.eta} />
            </DataList>
          </div>
        ))}
      </div>

      {t.legs.length > 1 && (
        <>
          <p
            className="mt-5 flex items-start gap-2 text-[13px] leading-relaxed"
            style={{ color: "var(--accent-ink)" }}
          >
            <span aria-hidden="true">✓</span>
            KYC, beneficiary and source-of-funds details carried over from Leg 1.
          </p>

          <div
            className="mt-6 grid gap-px sm:grid-cols-3"
            style={{ background: "var(--line)", border: "1px solid var(--line)" }}
          >
            <div className="p-4" style={{ background: "var(--surface)" }}>
              <StatTile figure={String(t.legs.length)} label="legs, one session" size="sm" accent />
            </div>
            <div className="p-4" style={{ background: "var(--surface)" }}>
              <StatTile figure={String(t.sessionHops)} label="hops in total" size="sm" accent />
            </div>
            <div className="p-4" style={{ background: "var(--surface)" }}>
              <StatTile
                figure={formatMoney(t.legs[t.legs.length - 1].receiveAmount, t.legs[t.legs.length - 1].to)}
                label="finally received"
                size="sm"
                accent
              />
            </div>
          </div>

          <p className="mt-5 text-[13px] leading-relaxed" style={{ color: "var(--text-dim)", maxWidth: "62ch" }}>
            On most platforms this is two separate transactions, started an hour
            apart, with every detail typed twice.
          </p>

          <Button className="mt-6" size="lg" onClick={() => t.setStep(4)}>
            Confirm and watch it move →
          </Button>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Step 4 -- */

export function StepWatch({ t, mode }: { t: T; mode: Mode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <TransactionMap mode={mode} elapsed={t.elapsed} />
      </div>
      <div>
        <Callout>
          {mode === "institutional"
            ? "Every timestamp above is recorded and exportable — the audit trail your finance team or auditor can actually work from."
            : "Every step is saved, so you always know exactly where your money is."}
        </Callout>

        <p className="mono mt-5 text-[11px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
          The counter on the in-progress row measures elapsed time on this
          page. It is the only figure here that moves, and it moves because
          time does — nothing on this page simulates market movement.
        </p>

        <Button variant="secondary" className="mt-6" onClick={t.reset}>
          Start over
        </Button>
      </div>
    </div>
  );
}
