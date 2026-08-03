"use client";

import Link from "next/link";
import { useMode } from "@/components/ModeProvider";
import { Callout } from "@/components/ui/Callout";
import { DataList, DataRow } from "@/components/ui/DataRow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";
import { SecurityShield } from "@/components/art/SecurityShield";

/**
 * /security, §14.
 *
 * For a payments brand this page carries as much conversion weight as the
 * homepage. Institutional by default; personal mode simplifies the language
 * without removing a single fact — a nervous first-time sender deserves the
 * same information, not less of it.
 *
 * The project note beneath the regulatory table is the most important element
 * on the page. Generic reassurance in place of verifiable specifics is the
 * clearest warning sign in financial services marketing, and a fictional
 * company publishing a licence table without saying so would be modelling
 * exactly the behaviour this project is meant to critique.
 */

const REGULATORY: Array<[string, string]> = [
  ["Licence type", "Authorised Payment Institution (cross-border remittance)"],
  ["Issuing regulator", "— not held —"],
  ["Registration number", "— not held —"],
  ["KYC procedure", "Document + liveness verification before first transfer"],
  ["Sanctions screening", "Every party, every transfer, pre-settlement"],
  ["FEMA reporting", "Purpose code captured per transfer; filed per RBI schedule"],
  ["Record retention", "8 years from transaction date"],
];

const FUNDS: Array<[string, string]> = [
  ["Client funds", "Segregated, held apart from operating capital"],
  ["Partner banking", "Regulated partner banks in each settlement corridor"],
  ["If a transfer is held", "Visible at the hop where it stopped, with the reason"],
  ["Resolution SLA", "Same business day acknowledgement, worked to closure"],
];

const PLATFORM: Array<[string, string]> = [
  ["Encryption in transit", "TLS 1.3"],
  ["Encryption at rest", "AES-256"],
  ["Access control", "Role-based, least privilege, reviewed quarterly"],
  ["Audit logging", "Immutable, covering every balance-affecting action"],
  ["Incident response", "Defined severity ladder with named owners"],
  ["Penetration testing", "Independent, annually and on major release"],
];

const NEVER = [
  "Never quote one rate and apply another.",
  "Never bury a fee inside an exchange rate.",
  "Never contact you asking for credentials, an OTP, or a password.",
];

export function SecurityPage() {
  const { mode } = useMode();
  const institutional = mode === "institutional";

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <SectionHeader
            eyebrow="SECURITY & COMPLIANCE"
            level={1}
            title="Safety here means you can see the path."
            lede={
              institutional
                ? "Where the money sits, who touches it, what is logged, and what we will never do — stated as facts rather than badges."
                : "You can see where your money is at every step. That visibility is the security model, not a feature on top of it."
            }
          />
          <SecurityShield className="mx-auto h-44 lg:h-52" />
        </div>
      </div>

      {/* ---------- Regulatory posture ---------- */}
      <Section labelledBy="regulatory">
        <SectionHeader
          id="regulatory"
          eyebrow="REGULATORY POSTURE"
          title="Licensing and reporting"
        />
        <DataList className="mt-6 max-w-3xl">
          {REGULATORY.map(([k, v]) => (
            <DataRow key={k} label={k} value={v} />
          ))}
        </DataList>

        <Callout variant="project-note" className="mt-6 max-w-3xl">
          ClearRoute is fictional and holds no licence. In a real deployment
          every field above must contain the actual licence type, issuing
          regulator and registration number, verifiable independently. Generic
          reassurance in place of specifics is the single clearest warning sign
          in financial services marketing — which is why the two fields that
          would carry a real registration are left explicitly empty here rather
          than filled with something plausible.
        </Callout>
      </Section>

      {/* ---------- How funds are handled ---------- */}
      <Section labelledBy="funds">
        <SectionHeader
          id="funds"
          eyebrow="HOW FUNDS ARE HANDLED"
          title={institutional ? "Custody and settlement" : "Where your money sits"}
        />
        <DataList className="mt-6 max-w-3xl">
          {FUNDS.map(([k, v]) => (
            <DataRow key={k} label={k} value={v} />
          ))}
        </DataList>
      </Section>

      {/* ---------- Platform security ---------- */}
      <Section labelledBy="platform">
        <SectionHeader
          id="platform"
          eyebrow="PLATFORM SECURITY"
          title="Controls"
          lede="Presented as a definition list rather than a wall of certification badges. A badge is a picture; these are claims someone can hold us to."
        />
        <DataList className="mt-6 max-w-3xl">
          {PLATFORM.map(([k, v]) => (
            <DataRow key={k} label={k} value={v} />
          ))}
        </DataList>
      </Section>

      {/* ---------- Your data ---------- */}
      <Section labelledBy="data">
        <SectionHeader id="data" eyebrow="YOUR DATA" title="What we collect, and why" />
        <div
          className="mt-6 space-y-4 text-[15px] leading-relaxed"
          style={{ color: "var(--text-dim)", maxWidth: "var(--measure)" }}
        >
          <p>
            Identity documents and transfer details, because a regulated
            cross-border payment cannot be made without them. Beneficiary
            details, so the money reaches the right account. That is the whole
            list.
          </p>
          <p>
            Records are kept for eight years from the transaction date, which
            is the retention period Indian reporting requirements set. Outside
            that obligation, you can ask for your account data to be deleted and
            we will do it.
          </p>
          <p>
            This website itself collects far less: anonymous page and
            interaction counts with a random per-session identifier, no cookies,
            no third-party trackers and no advertising pixels.{" "}
            <Link
              href="/legal/privacy"
              className="underline underline-offset-4"
              style={{ color: "var(--accent-ink)" }}
            >
              The privacy page describes exactly that →
            </Link>
          </p>
        </div>
      </Section>

      {/* ---------- What we will never do ---------- */}
      <Section labelledBy="never">
        <SectionHeader id="never" eyebrow="COMMITMENTS" title="What we will never do" />
        <ul className="mt-6 max-w-3xl">
          {NEVER.map((line) => (
            <li
              key={line}
              className="flex items-start gap-3 border-b py-3.5 last:border-b-0"
              style={{ borderColor: "var(--line)" }}
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <span className="text-[15px]">{line}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
