"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_MODE,
  isForkPath,
  modeFromPath,
  readStoredMode,
  readStoredModeServer,
  storeMode,
  subscribeStoredMode,
  type Mode,
} from "@/lib/mode";

type ModeContextValue = {
  /** The mode to render in. On the fork this is DEFAULT_MODE for convenience. */
  mode: Mode;
  /** True on `/` only, where no mode is applied to <html>. */
  isFork: boolean;
  /** True once the persisted choice has been read in the browser. */
  hydrated: boolean;
  /** The visitor's previous choice, or null on a first visit. */
  storedMode: Mode | null;
  /** Record a choice. Called from the entry fork and the mode switch. */
  choose: (mode: Mode) => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);

const subscribeNever = () => () => {};

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const routeMode = modeFromPath(pathname);
  const fork = isForkPath(pathname);

  // Reading localStorage through useSyncExternalStore rather than an effect:
  // the server snapshot is null, the client snapshot is the real value, and
  // React handles the changeover without a cascading re-render. It also picks
  // up a write from another tab for free.
  const storedMode = useSyncExternalStore(
    subscribeStoredMode,
    readStoredMode,
    readStoredModeServer,
  );

  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

  const mode: Mode = routeMode ?? storedMode ?? DEFAULT_MODE;

  // Keep <html data-mode> in step with client-side navigation. The pre-paint
  // script in app/layout.tsx only runs on a full page load, so without this a
  // soft navigation from /pricing to /personal would keep the old palette.
  useEffect(() => {
    const el = document.documentElement;
    if (fork) el.removeAttribute("data-mode");
    else el.setAttribute("data-mode", mode);
  }, [fork, mode]);

  // A route that pins a mode is itself a choice — arriving at /personal from a
  // shared link should be what shared routes remember afterwards. This writes
  // to an external system, which is what an effect is actually for; the store
  // notifies its own subscribers, so there is no setState here.
  useEffect(() => {
    if (routeMode) storeMode(routeMode);
  }, [routeMode]);

  const choose = useCallback((next: Mode) => storeMode(next), []);

  const value = useMemo(
    () => ({ mode, isFork: fork, hydrated, storedMode, choose }),
    [mode, fork, hydrated, storedMode, choose],
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used inside <ModeProvider>");
  return ctx;
}

/** Pick one of two values by current mode. Keeps mode-forked copy readable. */
export function useByMode<T>(institutional: T, personal: T): T {
  const { mode } = useMode();
  return mode === "institutional" ? institutional : personal;
}
