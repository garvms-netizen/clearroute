"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Breadcrumbs } from "./Breadcrumbs";
import { isForkPath, stripBasePath } from "@/lib/mode";

/**
 * Wraps every page in header, main landmark and footer — except the two
 * routes that deliberately have no chrome:
 *
 * - `/` is the entry fork. §7: no navigation beyond the wordmark, because the
 *   fork is the only decision on the page. Giving it a nav would offer a way
 *   around the question the page exists to ask.
 * - `/styleguide` is an internal tool and renders its own frame.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const here = stripBasePath(pathname);
  const bare = isForkPath(pathname) || here.startsWith("/styleguide");

  if (bare) return <>{children}</>;

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <Breadcrumbs />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
