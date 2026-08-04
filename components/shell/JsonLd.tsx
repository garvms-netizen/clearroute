import { FAQ_GROUPS } from "@/lib/faq";
import { SITE_URL } from "@/lib/routes";

/**
 * Structured data.
 *
 * Rendered as a <script type="application/ld+json"> — inert data, never
 * executed, so it does not trip the React rule about scripts in the tree the
 * way an executable inline script would.
 *
 * The Organization block states plainly that this is a fictional entity. A
 * search engine reading structured data that asserted a real financial
 * services provider would be the one place the disclaimer could not follow
 * the claim.
 */
export function JsonLd() {
  const organisation = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Clear Route",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    description:
      "A fictional cross-border payment platform created for an academic marketing project. Not a real financial services provider.",
    slogan: "See every step. Every time.",
    foundingLocation: { "@type": "Place", name: "Mumbai, India" },
    disambiguatingDescription:
      "Clear Route is not a real company. This site is coursework and does not process transactions.",
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_GROUPS.flatMap((g) =>
      g.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
