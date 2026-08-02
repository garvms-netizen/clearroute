"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Modal — focus-trapped, Escape-closable, scroll-locked.
 *
 * Carries the Instagram carousel viewer and the post caption dialogs, so the
 * arrow-key handling lives here as an optional prop rather than being
 * reimplemented per caller.
 *
 * Focus moves into the dialog on open and returns to the trigger on close.
 * Without that return, a keyboard user closing the carousel would be dumped
 * back at the top of the document with no idea which tile they came from.
 */
export function Modal({
  open,
  onClose,
  label,
  children,
  onPrev,
  onNext,
  className,
}: {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  label: string;
  children: React.ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const restoreTimer = useRef<number | null>(null);

  // Callers pass inline arrow functions for these, so they are new on every
  // render. Reading them through a ref keeps the key handler stable, which
  // lets the effect below depend on `open` alone — see the note there.
  const handlers = useRef({ onClose, onPrev, onNext });
  useEffect(() => {
    handlers.current = { onClose, onPrev, onNext };
  });

  const trapKeys = useCallback((e: KeyboardEvent) => {
    const { onClose: close, onPrev: prev, onNext: next } = handlers.current;

    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowLeft" && prev) {
      e.preventDefault();
      prev();
      return;
    }
    if (e.key === "ArrowRight" && next) {
      e.preventDefault();
      next();
      return;
    }
    if (e.key !== "Tab") return;

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const activeEl = document.activeElement;

      if (e.shiftKey && (activeEl === first || activeEl === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
  }, []);

  // Depends on `open` alone, deliberately. If this effect re-ran on every
  // render it would run its own cleanup each time — restoring focus to the
  // trigger — so focus could never settle inside the dialog and the scroll
  // lock would be torn down and rebuilt continuously. trapKeys is stable
  // precisely so that can't happen.
  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;

    const { overflow, paddingRight } = document.body.style;
    // Compensate for the vanishing scrollbar so the page behind doesn't shift.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    document.addEventListener("keydown", trapKeys);

    // A pending restore from a previous teardown would steal focus straight
    // back out of the dialog. In development React mounts effects twice
    // (setup → cleanup → setup), so without this the cleanup's restore lands
    // after this setup's focus call and focus never enters the panel at all.
    if (restoreTimer.current !== null) {
      clearTimeout(restoreTimer.current);
      restoreTimer.current = null;
    }

    // The portal is already in the DOM by the time effects run, so this can
    // be direct. Focus the panel itself rather than its first control, so a
    // screen reader announces the dialog before its contents.
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", trapKeys);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      // Deferred by a tick so a remount can cancel it, per above. On a real
      // close nothing cancels it and focus returns to the trigger — without
      // which a keyboard user closing the carousel would be dumped at the top
      // of the document with no idea which tile they came from.
      restoreTimer.current = window.setTimeout(() => {
        restoreTo.current?.focus?.();
        restoreTimer.current = null;
      }, 0);
    };
  }, [open, trapKeys]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(4, 8, 16, 0.72)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cn(
          "relative max-h-[90vh] w-full max-w-lg overflow-y-auto outline-none",
          className,
        )}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center"
          style={{
            color: "var(--text-dim)",
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M1 1l10 10M11 1L1 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
