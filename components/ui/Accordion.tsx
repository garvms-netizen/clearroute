"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Accordion — used for the FAQ, the pricing FAQ, and the objection section.
 *
 * Each item takes a stable `id` that becomes its element id, so
 * `/faq#is-the-rate-marked-up` opens that question directly. On mount the
 * component reads location.hash and opens the matching item; it also listens
 * for hashchange, so in-page links to a question work after first load.
 */

export type AccordionItem = {
  id: string;
  question: React.ReactNode;
  answer: React.ReactNode;
};

export function Accordion({
  items,
  className,
  /** Allow several open at once. Default is one at a time. */
  multiple = false,
}: {
  items: AccordionItem[];
  className?: string;
  multiple?: boolean;
}) {
  const [open, setOpen] = useState<string[]>([]);

  useEffect(() => {
    const openFromHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!hash) return;
      if (!items.some((i) => i.id === hash)) return;
      setOpen((prev) => (prev.includes(hash) ? prev : multiple ? [...prev, hash] : [hash]));
      // Let the panel expand before scrolling, or the target lands short.
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
      });
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [items, multiple]);

  const toggle = (id: string) =>
    setOpen((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : multiple
          ? [...prev, id]
          : [id],
    );

  return (
    <div
      className={cn("border-t", className)}
      style={{ borderColor: "var(--line)" }}
    >
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div
            key={item.id}
            id={item.id}
            className="border-b"
            style={{ borderColor: "var(--line)", scrollMarginTop: "120px" }}
          >
            <h3>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={`${item.id}-panel`}
                className="flex w-full items-start justify-between gap-6 py-4 text-left"
              >
                <span
                  className="text-[15px] font-medium"
                  style={{ color: "var(--text)" }}
                >
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0"
                  style={{
                    color: isOpen ? "var(--accent-ink)" : "var(--text-dim)",
                    transform: isOpen ? "rotate(45deg)" : "none",
                    transition: "transform var(--motion) var(--ease)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M7 1v12M1 7h12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={`${item.id}-panel`}
              role="region"
              hidden={!isOpen}
              className="pb-5"
            >
              <div
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-dim)", maxWidth: "68ch" }}
              >
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
