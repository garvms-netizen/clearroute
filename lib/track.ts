/**
 * Anonymous event tracking.
 *
 * GitHub Pages is static, so events POST to a Google Apps Script Web App
 * (see scripts/apps-script.gs) which appends them to a private Sheet. The
 * endpoint lives in NEXT_PUBLIC_SHEETS_ENDPOINT and is never hard-coded.
 *
 * ## What is deliberately not collected
 *
 * No cookies, no fingerprinting, no personal data, no third-party trackers,
 * no advertising pixels. The session id is a random string held in
 * sessionStorage, so it dies with the tab and cannot follow anyone between
 * visits. /legal/privacy describes exactly this, and it has to stay true.
 *
 * ## Why the request looks odd
 *
 * Apps Script rejects preflighted JSON from a browser, so the body goes as
 * text/plain with mode: "no-cors". That makes the response opaque — a
 * resolved promise means "the request left the building", not "the server
 * accepted it". Nothing in the UI is allowed to depend on the result, which
 * is why every caller here is fire-and-forget. Failures are console.warn'd
 * so they stay debuggable rather than silently vanishing.
 */

import type { Mode } from "./mode";

export type TrackedEvent =
  | "page_view"
  | "mode_selected"
  | "demo_step"
  | "cta_click"
  | "video_play"
  | "carousel_open"
  | "callback_submitted"
  | "contact_submitted"
  | "blog_read";

const SESSION_KEY = "clearroute:session";

function sessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return ""; // storage disabled — the event still sends, just unattributed
  }
}

export const ENDPOINT = process.env.NEXT_PUBLIC_SHEETS_ENDPOINT ?? "";

/** True when an endpoint is configured. Used by /insights to explain itself. */
export const isTrackingConfigured = () => ENDPOINT.length > 0;

export function track(event: TrackedEvent, label?: string): void {
  if (typeof window === "undefined") return;

  // Unset endpoint is a normal state, not an error: the site is meant to
  // build and run before anyone has deployed the Apps Script.
  if (!ENDPOINT) return;

  const mode = (document.documentElement.dataset.mode as Mode | undefined) ?? "none";

  const payload = JSON.stringify({
    type: "event",
    event,
    page: window.location.pathname,
    mode,
    label: label ?? "",
    session: sessionId(),
  });

  void fetch(ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: payload,
    keepalive: true, // survives the page unloading on a CTA click
  }).catch((err) => {
    console.warn("[clearroute] event not recorded:", event, err);
  });
}

/** Submit a form payload. Same transport, same opaque-response caveat. */
export async function submitForm(
  payload: Record<string, string> & { type: "callback" | "contact" },
): Promise<void> {
  if (!ENDPOINT) {
    console.warn(
      "[clearroute] NEXT_PUBLIC_SHEETS_ENDPOINT is unset — form not delivered.",
    );
    return;
  }
  await fetch(ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
}
