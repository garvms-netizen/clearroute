import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import { ModeProvider } from "@/components/ModeProvider";
import { SiteChrome } from "@/components/shell/SiteChrome";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Every rate, fee, amount, timestamp and ID in the project renders in this
// face with tabular figures. Monospaced numerals are the typographic
// expression of precision, which is the brand's entire claim.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ClearRoute — See every step your money takes. Every time.",
    template: "%s · ClearRoute",
  },
  description:
    "Cross-border payments with nothing hidden — live rates, minimal intermediaries, full transaction tracking, and multi-currency transfers in one session.",
  applicationName: "ClearRoute",
  robots: { index: true, follow: true },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  // Both mode grounds, so the mobile browser chrome matches the page.
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B1220" },
    { media: "(prefers-color-scheme: light)", color: "#FBF7F2" },
  ],
};

/**
 * Runs before first paint. Resolving mode here — rather than in an effect —
 * is what stops a shared route from flashing institutional dark before
 * repainting to personal warm. Deliberately dependency-free and wrapped in
 * try/catch: if it throws, the page still renders in the fork palette.
 */
const MODE_BOOTSTRAP = `
(function(){
  try {
    var base = ${JSON.stringify(process.env.NEXT_PUBLIC_BASE_PATH || "")};
    var p = location.pathname;
    if (base && p.indexOf(base) === 0) p = p.slice(base.length) || "/";
    var m = null;
    if (p === "/institutional" || p.indexOf("/institutional/") === 0) m = "institutional";
    else if (p === "/personal" || p.indexOf("/personal/") === 0) m = "personal";
    else if (p !== "/" && p !== "") {
      var s = localStorage.getItem("clearroute:mode");
      m = (s === "institutional" || s === "personal") ? s : "institutional";
    }
    if (m) document.documentElement.setAttribute("data-mode", m);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plexMono.variable} h-full`}
    >
      <head>
        {/* next/script with beforeInteractive rather than a bare <script>:
            React 19 warns that script tags inside the component tree are not
            executed on client render, and this has to run before first paint
            on a full page load. */}
        <Script
          id="clearroute-mode-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: MODE_BOOTSTRAP }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ModeProvider>
          <SiteChrome>{children}</SiteChrome>
        </ModeProvider>
      </body>
    </html>
  );
}
