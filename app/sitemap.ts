import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "@/lib/routes";

/**
 * Generated from the route registry, so it cannot drift from what exists.
 *
 * Note the site currently serves `noindex` site-wide while it is under
 * construction (see app/layout.tsx). The sitemap ships anyway so it is ready
 * the moment that comes off — an absent sitemap is a second thing to remember.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path === "/" ? "/" : `${r.path}/`}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: r.priority,
  }));
}
