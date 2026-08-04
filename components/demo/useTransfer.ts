"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { crossRate, hasLiveData, latestClose } from "@/lib/rates";
import { LEG1_RATE, LEG2_RATE, MARGIN_PCT, SEND_INR } from "@/lib/workedExample";
import { SETTLEMENT_TIME } from "@/lib/settlement";

/**
 * The transfer model behind the interactive demo.
 *
 * Ported from the transaction-flow prototypes — amount entry, pair selection,
 * rate lock, multi-leg in one session, settlement tracking — with three
 * changes:
 *
 * 1. **No simulated ticker.** The prototypes re-jittered the quoted rate every
 *    1.2 seconds with Math.random(). The rate here is a published quote,
 *    fetched at build time and held. Animating movement between publications
 *    would be inventing price action on the one claim the site rests on.
 * 2. **Defaults are the §9.2 worked example**, so the page a visitor first
 *    sees reconciles exactly with /pricing and /demo. Changing the amount or
 *    either currency recomputes from the published quote, and the page says
 *    which of the two is on screen.
 * 3. **The margin is shown, then waived** — "₹0.00 — waived" against the
 *    stated 0.40%, rather than a bare zero. Showing what is being given up
 *    makes the offer legible instead of looking like there was never a fee.
 *
 * Both sides of the pair are free-form. Any of the 144 quoted currencies can
 * send to any other, because every pair derives from one USD-based table (see
 * crossRate) rather than needing its own lookup.
 */

export type Leg = {
  id: string;
  from: string;
  to: string;
  /** Units of `from` per 1 unit of `to`. */
  rate: number;
  sendAmount: number;
  receiveAmount: number;
  hops: number;
  eta: string;
  lockedAt: string | null;
};

export type Step = 1 | 2 | 3 | 4;

const round2 = (n: number) => Math.round(n * 100) / 100;

const nowLabel = () =>
  new Date().toLocaleTimeString("en-IN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export function useTransfer() {
  const [step, setStep] = useState<Step>(1);
  const [amount, setAmount] = useState<number>(SEND_INR);
  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState("USD");

  const [legs, setLegs] = useState<Leg[]>([]);
  const [elapsed, setElapsed] = useState(0);

  /**
   * True while the inputs still match the brief's worked example. The page
   * uses this to decide whether to present the illustrative figures (which
   * reconcile with /pricing) or figures derived from the published quote.
   * Conflating the two is how a demo ends up contradicting the pricing page.
   */
  const isWorkedExample = amount === SEND_INR && from === "INR" && to === "USD";

  const published = crossRate(from, to);

  // Published quotes are baked into the build, so they are correct on first
  // paint — no fetch, no loading state, no failure state to design for.
  const quotedRate = isWorkedExample ? LEG1_RATE : published;

  /** Timestamp of the quote, for the "as of" line. */
  const close = latestClose("USD");

  const receiveAmount = useMemo(
    () => (quotedRate ? round2(amount / quotedRate) : null),
    [amount, quotedRate],
  );

  const marginAmount = useMemo(
    () => round2((amount * MARGIN_PCT) / 100),
    [amount],
  );

  const lockLeg1 = useCallback(() => {
    if (!quotedRate || receiveAmount === null) return;
    setLegs([
      {
        id: "leg-1",
        from,
        to,
        rate: quotedRate,
        sendAmount: amount,
        receiveAmount,
        hops: 2,
        eta: SETTLEMENT_TIME,
        lockedAt: nowLabel(),
      },
    ]);
    setStep(2);
  }, [amount, from, to, quotedRate, receiveAmount]);

  /**
   * The second leg spends what the first produced — that is what makes it one
   * session rather than two transfers.
   *
   * It converts into EUR by default, unless the first leg already landed in
   * EUR, in which case GBP. Sending a currency to itself is not a leg.
   */
  const addSecondLeg = useCallback(() => {
    setLegs((prev) => {
      if (prev.length !== 1) return prev;
      const first = prev[0];
      const target = first.to === "EUR" ? "GBP" : "EUR";

      // The worked example keeps its published USD→EUR figure so the demo
      // still reconciles with /pricing; any other pair derives from the table.
      const rate =
        first.to === "USD" && target === "EUR"
          ? 1 / LEG2_RATE
          : crossRate(first.to, target);
      if (!rate) return prev;

      return [
        ...prev,
        {
          id: "leg-2",
          from: first.to,
          to: target,
          rate,
          sendAmount: first.receiveAmount,
          receiveAmount: round2(first.receiveAmount / rate),
          hops: 1,
          eta: "~45 sec",
          lockedAt: nowLabel(),
        },
      ];
    });
    setStep(3);
  }, []);

  const reset = useCallback(() => {
    setLegs([]);
    setAmount(SEND_INR);
    setFrom("INR");
    setTo("USD");
    setStep(1);
    setElapsed(0);
  }, []);

  // The elapsed counter on the in-progress row. This one is honest: it counts
  // real time spent on the demo, not simulated market movement.
  useEffect(() => {
    if (step !== 4) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [step]);

  const sessionHops = legs.reduce((n, l) => n + l.hops, 0);

  return {
    step,
    setStep,
    amount,
    setAmount,
    from,
    setFrom,
    to,
    setTo,
    close,
    hasLiveData,
    quotedRate,
    receiveAmount,
    marginAmount,
    isWorkedExample,
    legs,
    lockLeg1,
    addSecondLeg,
    reset,
    sessionHops,
    elapsed,
  };
}

export const formatElapsed = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
