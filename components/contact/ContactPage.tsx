"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/home/Section";
import { submitForm, track, isTrackingConfigured } from "@/lib/track";

/**
 * /contact, §16.2.
 *
 * Three routes to a person, presented as equals rather than as a hierarchy
 * with a form at the bottom. No phone number appears: §16.2 is explicit that
 * publishing one that does not exist is worse than not having one, so business
 * enquiries route to the callback form instead.
 */

type Status = "idle" | "sending" | "sent";

export function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = "Enter your name so we know who is writing.";
    if (!values.email.trim()) next.email = "Enter an email address so we can reply.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email))
      next.email = "That doesn't look like an email address — check for a typo.";
    if (!values.message.trim()) next.message = "Tell us what you'd like to know.";
    else if (values.message.trim().length < 10)
      next.message = "A little more detail will get you a better answer.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");

    // The response is opaque by design (see lib/track.ts), so a resolved
    // promise means the request left — not that it was accepted. The success
    // state is shown either way, and failures are warned to the console so
    // they stay debuggable.
    await submitForm({ type: "contact", ...values }).catch((err) =>
      console.warn("[clearroute] contact form:", err),
    );
    track("contact_submitted");
    setStatus("sent");
  };

  const field = (
    id: "name" | "email" | "message",
    label: string,
    type: "text" | "email" | "textarea",
  ) => (
    <div className="mb-5">
      <label htmlFor={id} className="mb-2 block text-[13px]" style={{ color: "var(--text-dim)" }}>
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          rows={5}
          value={values[id]}
          onChange={(e) => setValues({ ...values, [id]: e.target.value })}
          aria-invalid={Boolean(errors[id])}
          aria-describedby={errors[id] ? `${id}-error` : undefined}
          className="w-full px-3.5 py-3 text-[15px]"
          style={{
            background: "var(--surface-2)",
            border: `1px solid ${errors[id] ? "var(--highlight)" : "var(--line)"}`,
            borderRadius: "var(--radius)",
            color: "var(--text)",
          }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={values[id]}
          onChange={(e) => setValues({ ...values, [id]: e.target.value })}
          aria-invalid={Boolean(errors[id])}
          aria-describedby={errors[id] ? `${id}-error` : undefined}
          className="w-full px-3.5 py-3 text-[15px]"
          style={{
            background: "var(--surface-2)",
            border: `1px solid ${errors[id] ? "var(--highlight)" : "var(--line)"}`,
            borderRadius: "var(--radius)",
            color: "var(--text)",
          }}
        />
      )}
      {errors[id] && (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-[12px]"
          style={{ color: "var(--highlight-ink)" }}
        >
          {errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="CONTACT"
          level={1}
          title="Three ways to reach a person."
          lede="No queue system, no ticket number quoted back at you. Pick whichever fits what you need."
        />
      </div>

      <Section labelledBy="routes">
        <h2 id="routes" className="sr-only">
          Ways to get in touch
        </h2>
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="flex flex-col">
            <p className="eyebrow mb-2">Support</p>
            <h3 className="text-[17px] font-semibold">Something about a transfer</h3>
            <p className="mt-2 flex-1 text-[13px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
              For anything in flight, or a question about a rate you were shown.
            </p>
            <p className="mono mt-4 text-[13px]" style={{ color: "var(--accent-ink)" }}>
              support@clearroute.app
            </p>
            <p className="mono mt-1 text-[11px]" style={{ color: "var(--text-dim)" }}>
              Mon–Fri, 09:00–18:00 IST
            </p>
          </Card>

          <Card className="flex flex-col">
            <p className="eyebrow mb-2">Business enquiries</p>
            <h3 className="text-[17px] font-semibold">Moving company money</h3>
            <p className="mt-2 flex-1 text-[13px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
              For vendor payments, subsidiary funding or contractor payouts, a
              short call is usually faster than a thread.
            </p>
            <div className="mt-4">
              <Button href="/institutional/callback" size="sm">
                Request a callback
              </Button>
            </div>
          </Card>

          <Card className="flex flex-col">
            <p className="eyebrow mb-2">Press</p>
            <h3 className="text-[17px] font-semibold">Questions about the project</h3>
            <p className="mt-2 flex-1 text-[13px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
              Clear Route is an academic marketing project, so press enquiries
              are really questions about the coursework behind it.
            </p>
            <p className="mono mt-4 text-[13px]" style={{ color: "var(--accent-ink)" }}>
              press@clearroute.app
            </p>
          </Card>
        </div>

        {/* No phone number appears anywhere on this page, on purpose. */}
        <Callout className="mt-6">
          There is deliberately no phone number here. Publishing one that nobody
          answers is worse than not having one — business enquiries go through
          the callback form, where you leave a number and we call you.
        </Callout>
      </Section>

      {/* ---------- General message form ---------- */}
      {/* The section heading id is deliberately not "message": the textarea
          below already owns that id, and a duplicate meant the field's own
          <label for="message"> resolved to this heading instead — so clicking
          the label focused nothing and assistive tech announced the wrong
          element. */}
      <Section labelledBy="message-section">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <SectionHeader
            id="message-section"
            eyebrow="SEND A MESSAGE"
            title="Or just write."
            lede="Three fields. Anything you'd like to ask about how this works, or about the project behind it."
          />

          <div>
            {status === "sent" ? (
              <Card>
                <p className="text-[16px] font-semibold" style={{ color: "var(--accent-ink)" }}>
                  Thanks — your message is with us.
                </p>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
                  We&rsquo;ll reply to {values.email || "the address you gave"} within
                  one business day.
                </p>
                {!isTrackingConfigured() && (
                  <Callout variant="project-note" className="mt-4">
                    No form endpoint is configured on this deployment, so this
                    message was not actually delivered anywhere. The success
                    state is shown because that is what the real flow does — see
                    the README for how to connect a Google Sheet.
                  </Callout>
                )}
              </Card>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                {field("name", "Your name", "text")}
                {field("email", "Email address", "email")}
                {field("message", "Message", "textarea")}

                <p
                  className="mb-4 text-[12px] leading-relaxed"
                  style={{ color: "var(--text-dim)", maxWidth: "62ch" }}
                >
                  By sending this you agree that Clear Route may reply at the
                  address provided. This is a student project — submitted
                  details are stored in a private spreadsheet for demonstration
                  purposes only and are not used for any commercial activity.
                </p>

                <Button type="submit" size="lg" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send message"}
                </Button>
              </form>
            )}
          </div>
        </div>

        <p className="mt-8 text-sm">
          <Link href="/faq" className="underline underline-offset-4" style={{ color: "var(--accent-ink)" }}>
            Most questions are answered in the FAQ →
          </Link>
        </p>
      </Section>
    </>
  );
}
