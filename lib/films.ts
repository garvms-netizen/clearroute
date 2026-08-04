import type { Mode } from "./mode";
import { BANK_SETTLEMENT_TIME, SETTLEMENT_TIME } from "./settlement";
import { BANK_USD, DIFFERENCE_USD, LEG1_USD, SEND_INR } from "./workedExample";
import { formatMoney } from "./rates";

/**
 * The two demo films, as shot lists.
 *
 * ## Why these are animated rather than video files
 *
 * There is no source footage and no encoder available — ffmpeg is not
 * installed, and adding a paid rendering service is off the table. So the
 * films are built as timed animations that play inline with real transport
 * controls, which turns out to be the better artifact anyway:
 *
 * - Nothing to 404. The site no longer depends on a file that may never arrive.
 * - Sharp at any size, on any display, at no bandwidth cost.
 * - They theme. The same film renders in either mode's palette.
 * - The figures are imported, so a film cannot drift out of step with the
 *   pricing page the way a rendered MP4 would the moment a number changed.
 *
 * Each beat carries its own copy and a visual key the player draws. Timings
 * are in seconds from the start of the film.
 */

export type Beat = {
  at: number;
  /** Big line, on screen. */
  line: string;
  /** Optional supporting line. */
  sub?: string;
  /** Which composition the player draws for this beat. */
  scene:
    | "hook"
    | "quote-vs-applied"
    | "fee-stack"
    | "chain"
    | "route"
    | "settle"
    | "offer"
    | "signoff";
  /** Mono figure to feature, if the beat is carrying a number. */
  figure?: string;
};

export type Film = {
  mode: Mode;
  title: string;
  runtime: number;
  badge: string;
  description: string;
  beats: Beat[];
};

/* ------------------------------------------------------ Institutional --- */

const INSTITUTIONAL: Film = {
  mode: "institutional",
  title: "The number you were never shown.",
  runtime: 50,
  badge: "For businesses",
  description:
    "A finance manager reconciles a vendor payment and finds the margin that was never itemised.",
  beats: [
    {
      at: 0,
      scene: "hook",
      line: "Your finance team knows the transfer fee.",
      sub: "It is the smallest number in the transaction.",
    },
    {
      at: 6,
      scene: "quote-vs-applied",
      line: "The rate you were quoted.",
      sub: "And the rate that was applied.",
    },
    {
      at: 13,
      scene: "fee-stack",
      line: "The difference never appears as a line item.",
      sub: "It is absorbed into the exchange rate itself.",
      figure: "1–3%",
    },
    {
      at: 20,
      scene: "chain",
      line: "Then two correspondent banks take a cut each.",
      sub: "Neither of them tells you when.",
      figure: BANK_SETTLEMENT_TIME,
    },
    {
      at: 27,
      scene: "route",
      line: "Clear Route removes both.",
      sub: "One conversion, one partner bank, one visible path.",
    },
    {
      at: 34,
      scene: "settle",
      line: "Every hop, fee and timestamp — recorded.",
      sub: "The audit trail your auditor can actually work from.",
      figure: SETTLEMENT_TIME,
    },
    {
      at: 42,
      scene: "offer",
      line: `${formatMoney(DIFFERENCE_USD, "USD")} more, on one transfer.`,
      sub: `On the same ${formatMoney(SEND_INR, "INR")}. ${formatMoney(LEG1_USD, "USD")} against ${formatMoney(BANK_USD, "USD")}.`,
    },
    {
      at: 47,
      scene: "signoff",
      line: "See every step your money takes.",
      sub: "Every time.",
    },
  ],
};

/* ------------------------------------------------------------ Personal --- */

const PERSONAL: Film = {
  mode: "personal",
  title: "The other end of the line.",
  runtime: 35,
  badge: "For individuals",
  description:
    "A tuition payment leaves Kochi and arrives in Frankfurt, watched the whole way.",
  beats: [
    {
      at: 0,
      scene: "hook",
      line: "You know where your parcel is.",
      sub: "Every minute of the way.",
    },
    {
      at: 5,
      scene: "quote-vs-applied",
      line: "You don't know where your money is.",
      sub: "Or what rate it will actually get.",
    },
    {
      at: 11,
      scene: "route",
      line: "See the rate before you send.",
      sub: "Lock it. It won't move.",
    },
    {
      at: 17,
      scene: "settle",
      line: "Then watch it arrive.",
      sub: "Like tracking a delivery, because that is all it should be.",
      figure: SETTLEMENT_TIME,
    },
    {
      at: 25,
      scene: "offer",
      line: "Your first transfer, zero forex markup.",
      sub: "The live rate, nothing added. No countdown, no expiry.",
    },
    {
      at: 31,
      scene: "signoff",
      line: "Send money home.",
      sub: "Watch every step of the way.",
    },
  ],
};

export const FILMS: Record<Mode, Film> = {
  institutional: INSTITUTIONAL,
  personal: PERSONAL,
};

/** The beat playing at time `t`. */
export function beatAt(film: Film, t: number): Beat {
  let current = film.beats[0];
  for (const b of film.beats) if (t >= b.at) current = b;
  return current;
}
