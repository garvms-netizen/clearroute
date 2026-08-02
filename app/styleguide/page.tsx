import type { Metadata } from "next";
import { StyleguideClient } from "./StyleguideClient";

/**
 * /styleguide — every component rendered in both modes, side by side.
 *
 * Stays in the repo permanently as the regression check for the rest of the
 * build: after any token or component change, this page shows the drift
 * immediately. Excluded from navigation and from robots.
 */
export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

export default function StyleguidePage() {
  return <StyleguideClient />;
}
