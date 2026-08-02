import type { Mode } from "./mode";

/**
 * Navigation structure, §5.1 and §5.2.
 *
 * Shared routes (/pricing, /security, /blog…) are written without a mode
 * prefix — they render in whichever mode the visitor is currently in. Only
 * How it works carries the prefix, because it is the one nav item that has a
 * genuinely different page per mode.
 */

export type NavLink = { label: string; href: string };
export type NavItem = NavLink | { label: string; items: NavLink[] };

export const isDropdown = (i: NavItem): i is { label: string; items: NavLink[] } =>
  "items" in i;

const RESOURCES: NavLink[] = [
  { label: "Blog", href: "/blog" },
  { label: "Product demo", href: "/demo" },
  { label: "Our presence", href: "/presence" },
  { label: "Insights", href: "/insights" },
  { label: "FAQ", href: "/faq" },
];

const COMPANY: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Legal", href: "/legal/terms" },
];

export function primaryNav(mode: Mode): NavItem[] {
  const shared: NavItem[] = [
    { label: "Resources", items: RESOURCES },
    { label: "Company", items: COMPANY },
  ];

  if (mode === "institutional") {
    return [
      { label: "How it works", href: "/institutional/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Security", href: "/security" },
      { label: "Customers", href: "/customers" },
      ...shared,
    ];
  }

  // Retail drops Security from the top level — it is still linked from the
  // footer and from the objection section, but leading a nervous first-time
  // sender with a compliance page is the institutional instinct, not theirs.
  return [
    { label: "How it works", href: "/personal/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Reviews", href: "/customers" },
    ...shared,
  ];
}

export function primaryCta(mode: Mode): NavLink {
  return mode === "institutional"
    ? { label: "Request a callback", href: "/institutional/callback" }
    : { label: "Get the app", href: "/personal/get-the-app" };
}

export function homeHref(mode: Mode): string {
  return mode === "institutional" ? "/institutional" : "/personal";
}

/** Footer columns, §5.2. */
export function footerColumns(mode: Mode): Array<{ title: string; links: NavLink[] }> {
  return [
    {
      title: "Product",
      links: [
        { label: "How it works", href: `${homeHref(mode)}/how-it-works` },
        { label: "Pricing", href: "/pricing" },
        { label: "Security", href: "/security" },
        { label: "Product demo", href: "/demo" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Customers", href: "/customers" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/about" },
      ],
    },
    {
      title: "Resources",
      links: RESOURCES,
    },
    {
      title: "Connect",
      // All four point at /presence. There are no real accounts to link to,
      // and a dead external link would be worse than an honest internal one.
      links: [
        { label: "Instagram", href: "/presence/instagram" },
        { label: "LinkedIn", href: "/presence/linkedin" },
        { label: "X", href: "/presence" },
        { label: "YouTube", href: "/demo" },
      ],
    },
  ];
}

export const LEGAL_LINKS: NavLink[] = [
  { label: "Terms", href: "/legal/terms" },
  { label: "Privacy", href: "/legal/privacy" },
];
