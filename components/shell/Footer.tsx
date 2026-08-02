"use client";

import Link from "next/link";
import { useMode } from "@/components/ModeProvider";
import { Wordmark } from "@/components/art/Wordmark";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { ModeSwitch } from "./ModeSwitch";
import { footerColumns, LEGAL_LINKS } from "@/lib/nav";
import { TAGLINE } from "@/lib/copy";

/**
 * The global footer — four columns on desktop, stacked on mobile.
 *
 * Carries the mode switch at every breakpoint (the header only shows it on
 * wide screens), and the §21 disclaimer, which appears on every page.
 */
export function Footer() {
  const { mode } = useMode();
  const columns = footerColumns(mode);

  return (
    <footer
      className="mt-auto border-t"
      style={{ background: "var(--surface-2)", borderColor: "var(--line)" }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="eyebrow mb-3">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] underline-offset-4 hover:underline"
                      style={{ color: "var(--text-dim)" }}
                    >
                      {link.label}
                      {link.label === "Careers" && (
                        <span className="mono ml-1.5 text-[10px]">(placeholder)</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div
          className="mt-10 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-start sm:justify-between"
          style={{ borderColor: "var(--line)" }}
        >
          <div>
            <Wordmark size={20} />
            <p className="mt-2 text-[13px]" style={{ color: "var(--text-dim)" }}>
              {TAGLINE}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <ModeSwitch />
            <ul className="flex gap-4">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] underline-offset-4 hover:underline"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <Disclaimer />
        </div>
      </div>
    </footer>
  );
}
