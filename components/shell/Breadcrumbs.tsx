"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { stripBasePath } from "@/lib/mode";
import { trailFor } from "@/lib/routes";

/**
 * Where you are, and one click back up.
 *
 * The primary nav hides half the site behind two dropdowns, which is fine for
 * finding things but useless for knowing where you already are. On a site with
 * four levels and two parallel journeys, a trail is the cheapest way to stop
 * someone feeling lost — and it gives every inner page a route back to its
 * section without hunting through a menu.
 *
 * Hidden on top-level pages, where it would only repeat the heading.
 */
export function Breadcrumbs() {
  const pathname = usePathname() ?? "/";
  const trail = trailFor(stripBasePath(pathname));

  if (trail.length < 2) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6"
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {trail.map((r, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={r.path} className="flex items-center gap-2">
              {last ? (
                <span
                  aria-current="page"
                  className="text-[12px]"
                  style={{ color: "var(--text)" }}
                >
                  {r.label}
                </span>
              ) : (
                <>
                  <Link
                    href={r.path}
                    className="text-[12px] underline-offset-4 hover:underline"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {r.label}
                  </Link>
                  <span aria-hidden="true" style={{ color: "var(--line)" }}>
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
