"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";
import { isTrackingConfigured, submitForm, track } from "@/lib/track";

/**
 * /institutional/callback, §16.3.
 *
 * Exactly four required fields. Every extra field is data we don't need and a
 * reason not to submit, so there isn't one — no company size dropdown, no
 * "how did you hear about us", no monthly volume band.
 *
 * Validation messages name the specific problem ("Enter a work email
 * address") rather than saying "Invalid input", which tells someone nothing
 * about how to fix it.
 */

type Field = "name" | "company" | "email" | "phone";
type Status = "idle" | "sending" | "sent";

const FIELDS: Array<{ id: Field; label: string; type: string; hint?: string }> = [
  { id: "name", label: "Full name", type: "text" },
  { id: "company", label: "Company", type: "text" },
  { id: "email", label: "Work email", type: "email" },
  { id: "phone", label: "Phone number", type: "tel", hint: "Include the country code" },
];

/** Free-mail domains — a work address is the one thing this form actually needs. */
const CONSUMER = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "proton.me"];

export function CallbackForm() {
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    company: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};

    if (!values.name.trim()) next.name = "Enter your name so we know who we're calling.";
    if (!values.company.trim()) next.company = "Enter your company name.";

    const email = values.email.trim().toLowerCase();
    if (!email) next.email = "Enter a work email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      next.email = "That doesn't look like an email address — check for a typo.";
    else if (CONSUMER.includes(email.split("@")[1]))
      next.email = "Enter a work email address — this looks like a personal one.";

    const phone = values.phone.replace(/[\s()-]/g, "");
    if (!phone) next.phone = "Enter a phone number we can call you on.";
    else if (!/^\+?\d{7,15}$/.test(phone))
      next.phone = "Enter a phone number with 7–15 digits, including the country code.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    await submitForm({ type: "callback", ...values }).catch((err) =>
      console.warn("[clearroute] callback form:", err),
    );
    track("callback_submitted");
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <Section labelledBy="sent">
        <Card className="max-w-xl">
          <h2 id="sent" className="text-[18px] font-semibold" style={{ color: "var(--accent-ink)" }}>
            Thanks — we&rsquo;ve got your details.
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
            A member of the team will call you within one business day.
          </p>
          {!isTrackingConfigured() && (
            <Callout variant="project-note" className="mt-4">
              No form endpoint is configured on this deployment, so nothing was
              actually delivered. The success state shows because that is what
              the real flow does — see scripts/README.md to connect a sheet.
            </Callout>
          )}
        </Card>
      </Section>
    );
  }

  return (
    <Section labelledBy="callback-form">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <SectionHeader
          id="callback-form"
          eyebrow="FOUR FIELDS"
          title="Four fields, because that is all we need."
          lede="No volume band, no company size, no 'how did you hear about us'. Every extra field is data we don't need and a reason not to submit."
        />

        <form onSubmit={onSubmit} noValidate className="max-w-md">
          {FIELDS.map((f) => (
            <div key={f.id} className="mb-5">
              <label
                htmlFor={`cb-${f.id}`}
                className="mb-2 block text-[13px]"
                style={{ color: "var(--text-dim)" }}
              >
                {f.label}
                {f.hint && (
                  <span className="mono ml-2 text-[11px]" style={{ color: "var(--text-dim)" }}>
                    {f.hint}
                  </span>
                )}
              </label>
              <input
                id={`cb-${f.id}`}
                type={f.type}
                value={values[f.id]}
                onChange={(e) => setValues({ ...values, [f.id]: e.target.value })}
                aria-invalid={Boolean(errors[f.id])}
                aria-describedby={errors[f.id] ? `cb-${f.id}-error` : undefined}
                className="w-full px-3.5 py-3 text-[15px]"
                style={{
                  background: "var(--surface-2)",
                  border: `1px solid ${errors[f.id] ? "var(--highlight)" : "var(--line)"}`,
                  borderRadius: "var(--radius)",
                  color: "var(--text)",
                }}
              />
              {errors[f.id] && (
                <p
                  id={`cb-${f.id}-error`}
                  className="mt-1.5 text-[12px]"
                  style={{ color: "var(--highlight-ink)" }}
                >
                  {errors[f.id]}
                </p>
              )}
            </div>
          ))}

          {/* Consent sits directly above the button, per §16.3. */}
          <p
            className="mb-4 text-[12px] leading-relaxed"
            style={{ color: "var(--text-dim)", maxWidth: "62ch" }}
          >
            By submitting this form you agree that Clear Route may contact you at
            the details provided regarding your enquiry. This is a student
            project — submitted details are stored in a private spreadsheet for
            demonstration purposes only and are not used for any commercial
            activity.
          </p>

          <Button type="submit" size="lg" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Request a callback"}
          </Button>
        </form>
      </div>
    </Section>
  );
}
