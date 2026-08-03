"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CORRIDORS,
  hasLiveData,
  latestClose,
  type Corridor,
} from "@/lib/rates";
import { LEG1_RATE, LEG2_RATE, MARGIN_PCT, SEND_INR } from "@/lib/workedExample";

/**
 * The transfer model behind the interactive demo.
 *
 * Ported from the transaction-flow prototypes — amount entry, pair selection,
 * rate lock, multi-leg in one session, settlement tracking — with three
 * changes:
 *
 * 1. **No simulated ticker.** The prototypes re-jittered the quoted rate every
 *    1.2 seconds with Math.random(). The rate here is fetched once and held.
 *    ECB reference rates publish daily; animating movement between
 *    publications would be inventing price action on the one claim the site
 *    rests on.
 * 2. **Defaults are the §9.2 worked example**, so the page a visitor first
 *    sees reconciles exactly with /pricing and /demo. Changing the amount or
 *    pair recomputes honestly from the live rate and the page says which is
 *    which.
 * 3. **The margin is shown, then waived** — "₹0.00 — waived" against the
 *    stated 0.40%, rather than a bare zero. Showing what is being given up
 *    makes the offer legible instead of looking like there was never a fee.
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
  const [corridor, setCorridor] = useState<Corridor>("USD");

  const [legs, setLegs] = useState<Leg[]>([]);
  const [elapsed, setElapsed] = useState(0);

  // Published closes are baked into the build, so they are already correct on
  // first paint — no fetch, no loading state, no failure state to design for.
  const close = latestClose(corridor);

  /**
   * True while the inputs still match the brief's worked example. The page
   * uses this to decide whether to present the illustrative figures (which
   * reconcile with /pricing) or figures derived from today's live rate.
   * Conflating the two is how a demo ends up contradicting the pricing page.
   */
  const isWorkedExample = amount === SEND_INR && corridor === "USD";

  const quotedRate = isWorkedExample ? LEG1_RATE : close.rate;

  const receiveAmount = useMemo(
    () => Math.round((amount / quotedRate) * 100) / 100,
    [amount, quotedRate],
  );

  const marginInr = useMemo(
    () => Math.round(((amount * MARGIN_PCT) / 100) * 100) / 100,
    [amount],
  );

  const lockLeg1 = useCallback(() => {
    setLegs([
      {
        id: "leg-1",
        from: "INR",
        to: corridor,
        rate: quotedRate,
        sendAmount: amount,
        receiveAmount,
        hops: 2,
        eta: "~4 hours",
        lockedAt: nowLabel(),
      },
    ]);
    setStep(2);
  }, [amount, corridor, quotedRate, receiveAmount]);

  const addSecondLeg = useCallback(() => {
    setLegs((prev) => {
      if (prev.length !== 1) return prev;
      const first = prev[0];
      // The second leg spends what the first leg produced — that is what
      // makes it one session rather than two transfers.
      const out = Math.round(first.receiveAmount * LEG2_RATE * 100) / 100;
      return [
        ...prev,
        {
          id: "leg-2",
          from: first.to,
          to: "EUR",
          rate: LEG2_RATE,
          sendAmount: first.receiveAmount,
          receiveAmount: out,
          hops: 1,
          eta: "~2 hours",
          lockedAt: nowLabel(),
        },
      ];
    });
    setStep(3);
  }, []);

  const reset = useCallback(() => {
    setLegs([]);
    setAmount(SEND_INR);
    setCorridor("USD");
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
    corridor,
    setCorridor,
    corridors: CORRIDORS,
    close,
    hasLiveData,
    quotedRate,
    receiveAmount,
    marginInr,
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
