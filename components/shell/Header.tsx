"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMode } from "@/components/ModeProvider";
import { Wordmark } from "@/components/art/Wordmark";
import { Button } from "@/components/ui/Button";
import { ModeSwitch } from "./ModeSwitch";
import { NavDropdown } from "./NavDropdown";
import { StatusStrip } from "./StatusStrip";
import { homeHref, isDropdown, primaryCta, primaryNav } from "@/lib/nav";
import { stripBasePath } from "@/lib/mode";

/**
 * The global header. Sticky, 64px, hairline bottom border, backdrop blur.
 *
 * In institutional mode the live rate status strip sits directly beneath it —
 * the one piece of chrome that states the product's thesis before the visitor
 * has read a word.
 */
export function Header() {
  const { mode } = useMode();
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [openedOn, setOpenedOn] = useState(pathname);

  const nav = primaryNav(mode);
  const cta = primaryCta(mode);
  const here = stripBasePath(pathname);

  // Close the mobile panel whenever the route changes — including via browser
  // back/forward, which no click handler on the links would catch.
  //
  // Adjusted during render rather than in an effect: React re-runs this
  // component immediately without painting the intermediate state, so the
  // panel never flashes over the new page. Doing it in an effect would both
  // paint that flash and set state in a cascading pass.
  if (menuOpen && openedOn !== pathname) {
    setMenuOpen(false);
    setOpenedOn(pathname);
  }

  // Lock the page behind the open panel.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isCurrent = (href: string) => here === href || here.startsWith(href + "/");

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b backdrop-blur"
        style={{
          background: "color-mix(in srgb, var(--surface) 88%, transparent)",
          borderColor: "var(--line)",
        }}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link
            href={homeHref(mode)}
            className="shrink-0"
            aria-label="ClearRoute — home"
          >
            <Wordmark size={22} />
          </Link>

          <nav
            className="ml-4 hidden items-center lg:flex"
            aria-label="Primary"
          >
            {nav.map((item) =>
              isDropdown(item) ? (
                <NavDropdown key={item.label} label={item.label} items={item.items} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className="px-3 py-2 text-sm"
                  style={{
                    color: isCurrent(item.href) ? "var(--text)" : "var(--text-dim)",
                    fontWeight: isCurrent(item.href) ? 600 : 400,
                  }}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <ModeSwitch className="hidden xl:inline" />
            <Button href={cta.href} size="sm" className="hidden sm:inline-flex">
              {cta.label}
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="flex h-9 w-9 items-center justify-center lg:hidden"
              style={{ color: "var(--text)" }}
            >
              <span className="sr-only">Open menu</span>
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
                <path
                  d="M0 1h18M0 7h18M0 13h18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* §3.1: the strip is institutional-only. Retail leads with a person, not
          an instrument panel. */}
      {mode === "institutional" && <StatusStrip />}

      {menuOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-50 flex flex-col lg:hidden"
          style={{ background: "var(--bg)" }}
        >
          <div
            className="flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-6"
            style={{ borderColor: "var(--line)" }}
          >
            <Wordmark size={22} />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center"
              style={{ color: "var(--text)" }}
            >
              <span className="sr-only">Close menu</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6 sm:px-6" aria-label="Primary">
            {nav.map((item) =>
              isDropdown(item) ? (
                <div key={item.label} className="mb-6">
                  <p className="eyebrow mb-2">{item.label}</p>
                  {item.items.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block py-2 text-[15px]"
                      style={{ color: "var(--text)" }}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-2.5 text-lg font-medium"
                  style={{ color: "var(--text)" }}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Mode switch pinned at the bottom, per §5.1. */}
          <div
            className="shrink-0 space-y-4 border-t px-4 py-5 sm:px-6"
            style={{ borderColor: "var(--line)" }}
          >
            <Button href={cta.href} className="w-full">
              {cta.label}
            </Button>
            <ModeSwitch className="block" />
          </div>
        </div>
      )}
    </>
  );
}
