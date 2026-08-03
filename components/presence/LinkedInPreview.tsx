"use client";

import { Callout } from "@/components/ui/Callout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";
import { ConceptNote } from "./ConceptNote";
import { LinkedInApp } from "./platform/LinkedInApp";
import { LI_USAGE_NOTE } from "@/lib/campaign";

/**
 * The LinkedIn channel page.
 *
 * The mockup is a platform-accurate desktop screen (see platform/LinkedInApp)
 * rather than the posts restyled in Clear Route's palette — the point of a
 * channel preview is to show the asset where it will actually be read.
 */
export function LinkedInPreview() {
  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="OUR PRESENCE · LINKEDIN"
          level={1}
          title="Three posts, and only the last one sells."
          lede="Aimed at Rohan — the finance manager who will be asked to justify the choice. Two posts establish the insight; the third is the only one that names the product."
        />
        <div className="mt-8">
          <ConceptNote channel="LinkedIn" />
        </div>
        <Callout className="mt-5">{LI_USAGE_NOTE}</Callout>
      </div>

      <Section labelledBy="li-mockup">
        <h2 id="li-mockup" className="sr-only">
          LinkedIn company page mockup
        </h2>
        <LinkedInApp />
      </Section>
    </>
  );
}
