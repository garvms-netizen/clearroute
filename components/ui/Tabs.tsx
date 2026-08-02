"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Tabs — full ARIA tab pattern with roving tabindex.
 *
 * Arrow keys move between tabs, Home/End jump to the ends, and only the
 * active tab is in the tab order, so a keyboard user tabs *past* the strip
 * rather than through every tab in it. Used for the institutional demo step
 * strip, the campaigns gallery, and the customer filter.
 */

export type Tab = {
  id: string;
  label: React.ReactNode;
  /** Optional mono index shown before the label — "1", "2"… in the demo. */
  index?: string;
  content: React.ReactNode;
};

export function Tabs({
  tabs,
  initialId,
  onChange,
  label,
  className,
}: {
  tabs: Tab[];
  initialId?: string;
  onChange?: (id: string) => void;
  /** Accessible name for the tablist. */
  label: string;
  className?: string;
}) {
  const uid = useId();
  const [active, setActive] = useState(initialId ?? tabs[0]?.id);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === active);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    const id = tabs[next].id;
    select(id);
    refs.current[id]?.focus();
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-px border-b"
        style={{ borderColor: "var(--line)" }}
      >
        {tabs.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[t.id] = el;
              }}
              role="tab"
              id={`${uid}-tab-${t.id}`}
              aria-controls={`${uid}-panel-${t.id}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(t.id)}
              className="-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm sm:px-4"
              style={{
                borderColor: selected ? "var(--accent)" : "transparent",
                color: selected ? "var(--text)" : "var(--text-dim)",
                fontWeight: selected ? 600 : 400,
                transition: "color var(--motion) var(--ease)",
              }}
            >
              {t.index && (
                <span
                  className="mono text-xs"
                  style={{ color: selected ? "var(--accent-ink)" : "var(--text-dim)" }}
                >
                  {t.index}
                </span>
              )}
              {t.label}
            </button>
          );
        })}
      </div>

      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${uid}-panel-${t.id}`}
          aria-labelledby={`${uid}-tab-${t.id}`}
          hidden={t.id !== active}
          tabIndex={0}
          className={cn("pt-6", t.id !== active && "hidden")}
        >
          {t.id === active && t.content}
        </div>
      ))}
    </div>
  );
}
