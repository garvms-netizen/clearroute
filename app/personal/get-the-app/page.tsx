import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";
import { PersonaPriya } from "@/components/art/Personas";

export const metadata: Metadata = {
  title: "Get the app",
  description:
    "There is nothing to download — this is a demonstration project. The interactive demo shows exactly how a transfer works.",
};

/**
 * /personal/get-the-app, §16.4.
 *
 * Deliberately honest. No fake app-store badges, no "coming soon" email
 * capture, no convincing dead link. A disabled button that says what it is
 * reads as more trustworthy than a working-looking one that goes nowhere —
 * and on a site whose entire argument is about not being misled, a fake store
 * badge would undo the argument in one image.
 */
export default function Page() {
  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <SectionHeader
            eyebrow="GET THE APP"
            level={1}
            title="The app isn't live yet."
            lede="This is a demonstration project, so there's nothing to download — but you can see exactly how a transfer works right now, with live published rates and the settlement running in front of you."
          />
          <PersonaPriya className="mx-auto w-full max-w-xs" />
        </div>
      </div>

      <Section labelledBy="what-you-can-do">
        <h2 id="what-you-can-do" className="sr-only">
          What you can do instead
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <Button href="/personal/how-it-works" size="lg">
            See the interactive demo →
          </Button>

          {/* Disabled, and honest about why. */}
          <span className="inline-flex flex-col gap-1.5">
            <Button disabled size="lg">
              Download the app
            </Button>
            <span className="mono text-[11px]" style={{ color: "var(--text-dim)" }}>
              Coming soon
            </span>
          </span>
        </div>

        <Callout variant="project-note" className="mt-8">
          There is no app-store badge on this page on purpose. Clear Route is a
          fictional company built for an academic marketing project, and a
          convincing badge linking nowhere would be exactly the kind of thing
          the rest of this site argues against.
        </Callout>
      </Section>

      <Section labelledBy="meanwhile">
        <SectionHeader
          id="meanwhile"
          eyebrow="MEANWHILE"
          title="Everything the app would do, you can already see."
        />
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["See the live rate", "Published market rates for 144 currencies, before you enter anything.", "/personal/how-it-works"],
            ["Watch it settle", "The full settlement, every stage, running in real time.", "/personal/how-it-works"],
            ["Check the pricing", "One margin, shown in full, with the bank comparison beside it.", "/pricing"],
          ].map(([title, body, href]) => (
            <li key={title}>
              <a
                href={href}
                className="block h-full border p-5"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--line)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <span className="block text-[15px] font-semibold">{title}</span>
                <span
                  className="mt-2 block text-[13px] leading-relaxed"
                  style={{ color: "var(--text-dim)" }}
                >
                  {body}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
