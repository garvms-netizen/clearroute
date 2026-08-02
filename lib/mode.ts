/**
 * Mode resolution.
 *
 * Mode is derived from the URL path segment, not from client state, so links
 * are shareable and each mode indexes independently for SEO.
 *
 *   /institutional/*  → institutional
 *   /personal/*       → personal
 *   /                 → null (the entry fork; no mode applied)
 *   everything else   → shared route; falls back to the persisted choice
 *
 * The persisted value is used to theme shared routes and to pre-highlight the
 * visitor's previous choice on the fork. It is never used to redirect — that
 * would trap someone who chose wrong the first time.
 */

export type Mode = "institutional" | "personal";

export const MODES: Mode[] = ["institutional", "personal"];

export const STORAGE_KEY = "clearroute:mode";

export const DEFAULT_MODE: Mode = "institutional";

/** Strip the GitHub Pages basePath so path matching works in prod and dev. */
export function stripBasePath(pathname: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (base && pathname.startsWith(base)) {
    return pathname.slice(base.length) || "/";
  }
  return pathname || "/";
}

/** The mode a route pins by itself, or null if the route is shared. */
export function modeFromPath(pathname: string): Mode | null {
  const p = stripBasePath(pathname);
  if (p === "/institutional" || p.startsWith("/institutional/")) {
    return "institutional";
  }
  if (p === "/personal" || p.startsWith("/personal/")) return "personal";
  return null;
}

/** True for `/` only — the one page that renders with no mode applied. */
export function isForkPath(pathname: string): boolean {
  const p = stripBasePath(pathname);
  return p === "/" || p === "";
}

/* --------------------------------------------------------------------------
   The persisted choice, modelled as an external store.

   localStorage is exactly the kind of thing useSyncExternalStore is for: it
   lives outside React, it can change in another tab, and reading it during
   render would break hydration. Exposing subscribe/read here lets the
   provider consume it without a setState-in-effect cascade.
   -------------------------------------------------------------------------- */

const listeners = new Set<() => void>();

export function readStoredMode(): Mode | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "institutional" || v === "personal" ? v : null;
  } catch {
    return null; // private browsing, storage disabled — not worth surfacing
  }
}

/** Server snapshot: nothing is persisted during prerender, by definition. */
export function readStoredModeServer(): Mode | null {
  return null;
}

export function subscribeStoredMode(onChange: () => void): () => void {
  listeners.add(onChange);
  // Fires when another tab writes — keeps two open tabs in agreement.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function storeMode(mode: Mode): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* no-op */
  }
  // `storage` doesn't fire in the tab that wrote, so notify locally.
  listeners.forEach((l) => l());
}

export const otherMode = (m: Mode): Mode =>
  m === "institutional" ? "personal" : "institutional";

/**
 * Switching modes preserves the equivalent page where one exists, and lands on
 * that mode's home where it doesn't. `/institutional/callback` has no personal
 * twin, so it maps to `/personal`; `/institutional/how-it-works` maps straight
 * across.
 */
const EQUIVALENTS: Record<string, string> = {
  "how-it-works": "how-it-works",
  "who-its-for": "who-its-for",
};

export function switchModeHref(pathname: string, target: Mode): string {
  const p = stripBasePath(pathname);
  const current = modeFromPath(p);

  // Shared route (/pricing, /security, /blog/...) — same page, new mode.
  if (!current) return p === "/" ? `/${target}` : p;

  const segments = p.split("/").filter(Boolean); // ["institutional", "callback"]
  const sub = segments.slice(1).join("/");
  if (!sub) return `/${target}`;

  const twin = EQUIVALENTS[sub];
  return twin ? `/${target}/${twin}` : `/${target}`;
}

/** Copy for the mode-switch link, phrased as an invitation rather than a toggle. */
export function switchLabel(target: Mode): string {
  return target === "institutional"
    ? "Sending money as a business? →"
    : "Sending money yourself? →";
}
