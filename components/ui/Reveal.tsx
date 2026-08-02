"use client";

import { useCallback } from "react";
import { cn } from "@/lib/cn";

/**
 * Fade-and-rise on scroll into view — personal mode only.
 *
 * Institutional neutralises `.reveal` in CSS (stillness reads as
 * reliability), and the reduced-motion block lands every element in its final
 * state, so this component is safe to wrap anything with: the mode and the OS
 * preference decide whether it actually animates.
 *
 * The observer is attached in a ref callback rather than an effect so it
 * binds the moment the node exists, and disconnects itself after firing once —
 * content that has appeared should stay appeared when scrolled back past.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const observe = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;

    // Anything already on screen at mount should not wait to be scrolled to.
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.visible = "true";
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.dataset.visible = "true";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={observe}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
