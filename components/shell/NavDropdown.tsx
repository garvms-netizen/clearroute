"use client";

import Link from "next/link";
import { useCallback, useId, useRef, useState } from "react";
import type { NavLink } from "@/lib/nav";

/**
 * A header dropdown.
 *
 * Opens on hover for pointer users and on click/Enter for everyone else, and
 * the two have to coexist without fighting: hover-only would strand keyboard
 * and touch users, click-only would feel broken on desktop.
 *
 * Hover is gated behind `(hover: hover)` so a tap on a touch device doesn't
 * fire a phantom mouseenter that opens the menu and then immediately toggles
 * it shut again.
 *
 * Escape closes and returns focus to the trigger. Focus leaving the group
 * closes it too, so tabbing past the menu doesn't leave it hanging open.
 */
export function NavDropdown({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: NavLink[];
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  const canHover = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  return (
    <div
      ref={groupRef}
      className="relative"
      onMouseEnter={() => canHover() && setOpen(true)}
      onMouseLeave={() => canHover() && setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          close(true);
        }
      }}
      onBlur={(e) => {
        // relatedTarget is where focus is going; null means it left the document.
        if (!groupRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm"
        style={{ color: open ? "var(--text)" : "var(--text-dim)" }}
      >
        {label}
        <svg
          width="9"
          height="6"
          viewBox="0 0 9 6"
          fill="none"
          aria-hidden="true"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform var(--motion) var(--ease)",
          }}
        >
          <path
            d="M1 1l3.5 3.5L8 1"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Kept mounted-when-open rather than hidden, so the closed menu holds no
          tab stops at all. */}
      {open && (
        <div
          id={id}
          className="absolute top-full left-0 z-50 min-w-[200px] border py-1"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
            borderRadius: "var(--radius)",
          }}
        >
          {items.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="block px-4 py-2 text-sm hover:bg-[var(--surface-2)]"
              style={{ color: "var(--text)" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
