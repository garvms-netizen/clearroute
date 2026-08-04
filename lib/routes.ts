/**
 * Every public route, in one place.
 *
 * The sitemap, the breadcrumbs and the footer all read this, so a new page
 * cannot end up navigable but unlisted (or listed but missing).
 */
export type RouteDef = {
  path: string;
  label: string;
  /** Parent path, for breadcrumbs. */
  parent?: string;
  /** Sitemap weight. */
  priority: number;
};

export const ROUTES: RouteDef[] = [
  { path: "/", label: "Home", priority: 1 },

  { path: "/institutional", label: "For businesses", parent: "/", priority: 0.9 },
  { path: "/institutional/how-it-works", label: "How it works", parent: "/institutional", priority: 0.9 },
  { path: "/institutional/who-its-for", label: "Who it's for", parent: "/institutional", priority: 0.7 },
  { path: "/institutional/callback", label: "Request a callback", parent: "/institutional", priority: 0.8 },

  { path: "/personal", label: "For individuals", parent: "/", priority: 0.9 },
  { path: "/personal/how-it-works", label: "How it works", parent: "/personal", priority: 0.9 },
  { path: "/personal/who-its-for", label: "Who it's for", parent: "/personal", priority: 0.7 },
  { path: "/personal/get-the-app", label: "Get the app", parent: "/personal", priority: 0.6 },

  { path: "/pricing", label: "Pricing", parent: "/", priority: 0.9 },
  { path: "/security", label: "Security & compliance", parent: "/", priority: 0.8 },
  { path: "/customers", label: "Customers", parent: "/", priority: 0.7 },
  { path: "/demo", label: "Product demo", parent: "/", priority: 0.7 },

  { path: "/presence", label: "Our presence", parent: "/", priority: 0.6 },
  { path: "/presence/instagram", label: "Instagram", parent: "/presence", priority: 0.5 },
  { path: "/presence/linkedin", label: "LinkedIn", parent: "/presence", priority: 0.5 },
  { path: "/presence/campaigns", label: "Search & social ads", parent: "/presence", priority: 0.5 },
  { path: "/presence/email", label: "Email sequence", parent: "/presence", priority: 0.5 },

  { path: "/blog", label: "Blog", parent: "/", priority: 0.7 },
  { path: "/blog/why-cross-border-payments-are-still-broken", label: "Why cross-border payments are still broken", parent: "/blog", priority: 0.8 },

  { path: "/insights", label: "Insights", parent: "/", priority: 0.5 },
  { path: "/faq", label: "FAQ", parent: "/", priority: 0.7 },
  { path: "/about", label: "About", parent: "/", priority: 0.6 },
  { path: "/contact", label: "Contact", parent: "/", priority: 0.6 },
  { path: "/legal/terms", label: "Terms", parent: "/", priority: 0.3 },
  { path: "/legal/privacy", label: "Privacy", parent: "/", priority: 0.3 },
];

const BY_PATH = new Map(ROUTES.map((r) => [r.path, r]));

/** Ancestors then self, for a breadcrumb trail. */
export function trailFor(path: string): RouteDef[] {
  const clean = path.replace(/\/$/, "") || "/";
  const out: RouteDef[] = [];
  let cur = BY_PATH.get(clean);
  while (cur) {
    out.unshift(cur);
    cur = cur.parent ? BY_PATH.get(cur.parent) : undefined;
  }
  return out;
}

export const SITE_URL = "https://garvms-netizen.github.io/clearroute";
