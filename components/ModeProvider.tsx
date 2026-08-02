"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_MODE,
  isForkPath,
  modeFromPath,
  readStoredMode,
  storeMode,
  type Mode,
} from "@/lib/mode";

type ModeContextValue = {
  /** The mode to render in. On the fork this is DEFAULT_MODE for convenience. */
  mode: Mode;
  /** True on `/` only, where no mode is applied to <html>. */
  isFork: boolean;
  /** True once the persisted choice has been read from localStorage. */
  hydrated: boolean;
  /** The visitor's previous choice, or null on a first visit. */
  storedMode: Mode | null;
  /** Record a choice. Called from the entry fork and the mode switch. */
  choose: (mode: Mode) => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const routeMode = modeFromPath(pathname);
  const fork = isForkPath(pathname);

  // Shared routes fall back to the persisted choice, but that can only be read
  // in the browser. Initialising to DEFAULT_MODE keeps the first client render
  // identical to the prerendered HTML; the effect below corrects it a tick
  // later. The <html data-mode> attribute is already correct by then, because
  // the pre-paint script in app/layout.tsx set it before anything painted — so
  // the correction is a content swap, never a colour flash.
  const [storedMode, setStoredMode] = useState<Mode | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStoredMode(readStoredMode());
    setHydrated(true);
  }, []);

  const mode: Mode = routeMode ?? storedMode ?? DEFAULT_MODE;

  // Keep <html data-mode> in step with client-side navigation. The pre-paint
  // script only runs on a full page load.
  useEffect(() => {
    const el = document.documentElement;
    if (fork) el.removeAttribute("data-mode");
    else el.setAttribute("data-mode", mode);
  }, [fork, mode]);

  // A route that pins a mode is itself a choice — landing on /personal from a
  // shared link should be what a shared route remembers afterwards.
  useEffect(() => {
    if (routeMode) {
      storeMode(routeMode);
      setStoredMode(routeMode);
    }
  }, [routeMode]);

  const choose = useCallback((next: Mode) => {
    storeMode(next);
    setStoredMode(next);
  }, []);

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
