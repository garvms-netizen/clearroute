"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatTile } from "@/components/ui/StatTile";
import { Section } from "@/components/home/Section";
import {
  CHANNEL_ATTRIBUTION,
  CTA_PERFORMANCE,
  DROP_OFF,
  FUNNEL_DATA,
  MOCK_NOTE,
  WEEKLY_TRAFFIC,
} from "@/lib/mockAnalytics";
import { ENDPOINT, isTrackingConfigured } from "@/lib/track";

/**
 * /insights, §18.
 *
 * Two halves, and keeping them visibly separate is the whole point. One is
 * modelled campaign data for a campaign that was never run; the other is real
 * counts from this deployment. Blending them into one dashboard would make
 * both untrustworthy — separating them is the honest version and the stronger
 * result.
 *
 * The live half degrades openly: with no endpoint configured it says so and
 * explains how to connect one, rather than rendering zeros that look like
 * nobody visited.
 */

type Live = {
  ok: boolean;
  totals?: Record<string, number>;
  byPage?: Record<string, number>;
  byMode?: Record<string, number>;
  count?: number;
  sessions?: number;
  forms?: Record<string, number>;
  updated?: string;
};

export function InsightsPage() {
  const [live, setLive] = useState<Live | null>(null);
  const [liveState, setLiveState] = useState<"off" | "loading" | "ready" | "failed">(
    isTrackingConfigured() ? "loading" : "off",
  );

  useEffect(() => {
    if (!isTrackingConfigured()) return;
    const ac = new AbortController();
    fetch(ENDPOINT, { signal: ac.signal })
      .then((r) => r.json())
      .then((d: Live) => {
        setLive(d);
        setLiveState("ready");
      })
      .catch(() => setLiveState("failed"));
    return () => ac.abort();
  }, []);

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHeader
          eyebrow="INSIGHTS"
          level={1}
          title="Two dashboards, deliberately not merged."
          lede="One half models a campaign that was never run. The other counts what has actually happened on this site. Presenting them as one number would make both worthless."
        />
      </div>

      {/* ================= A · Illustrative campaign data ================= */}
      <Section labelledBy="modelled">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge tone="muted">A · Modelled</Badge>
          <h2 id="modelled" className="text-[20px] font-semibold sm:text-[24px]">
            Illustrative campaign data
          </h2>
        </div>

        <Callout variant="project-note">{MOCK_NOTE}</Callout>

        {/* Funnel */}
        <div className="mt-8">
          <p className="eyebrow mb-3">Stage-to-stage funnel</p>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={FUNNEL_DATA} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
                <CartesianGrid stroke="var(--line)" vertical={false} />
                <XAxis dataKey="stage" stroke="var(--text-dim)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-dim)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "var(--text)" }}
                  formatter={(v) => [Number(v ?? 0).toLocaleString("en-IN"), "users"]}
                />
                <Bar dataKey="users" fill="var(--accent)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            className="mt-4 grid gap-px sm:grid-cols-3 lg:grid-cols-6"
            style={{ background: "var(--line)" }}
          >
            {FUNNEL_DATA.map((f) => (
              <div key={f.stage} className="p-3" style={{ background: "var(--bg)" }}>
                <StatTile
                  figure={`${f.conversion}%`}
                  label={`${f.stage} — ${f.users.toLocaleString("en-IN")}`}
                  size="sm"
                  accent={f.stage === "Conversion"}
                />
              </div>
            ))}
          </div>

          <p
            className="mt-4 text-[13px] leading-relaxed"
            style={{ color: "var(--text-dim)", maxWidth: "var(--measure)" }}
          >
            The steepest loss is Awareness to Interest, which is expected and
            not the problem worth solving — most of that traffic was never
            sending money abroad. The one worth acting on is inside Conversion,
            below.
          </p>
        </div>

        {/* Weekly traffic by mode */}
        <div className="mt-10">
          <p className="eyebrow mb-3">Weekly sessions, split by mode</p>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={WEEKLY_TRAFFIC} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
                <CartesianGrid stroke="var(--line)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--text-dim)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-dim)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey="personal" stroke="var(--accent)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="institutional" stroke="var(--highlight)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mono mt-2 text-[11px]" style={{ color: "var(--text-dim)" }}>
            <span style={{ color: "var(--accent-ink)" }}>—</span> personal ·{" "}
            <span style={{ color: "var(--highlight-ink)" }}>—</span> institutional
          </p>
        </div>

        {/* Drop-off */}
        <div className="mt-10">
          <p className="eyebrow mb-3">Where conversion actually stalls</p>
          <ul className="max-w-xl">
            {DROP_OFF.map((d, i) => (
              <li
                key={d.point}
                className="flex items-center gap-4 border-b py-3 last:border-b-0"
                style={{ borderColor: "var(--line)" }}
              >
                <span className="min-w-0 flex-1 text-[14px]">{d.point}</span>
                <span
                  className="h-1.5 w-32 overflow-hidden rounded-full"
                  style={{ background: "var(--line)" }}
                  aria-hidden="true"
                >
                  <span
                    className="block h-full"
                    style={{
                      width: `${d.share}%`,
                      background: i === 2 ? "var(--highlight)" : "var(--accent)",
                    }}
                  />
                </span>
                <span className="mono w-12 shrink-0 text-right text-[13px]">{d.share}%</span>
              </li>
            ))}
          </ul>
          <p
            className="mt-3 text-[13px] leading-relaxed"
            style={{ color: "var(--text-dim)", maxWidth: "var(--measure)" }}
          >
            27 points are lost inside KYC, not at the rate or the fee. That is a
            verification-experience problem, and no amount of additional ad
            spend fixes it.
          </p>
        </div>

        {/* CTA performance */}
        <div className="mt-10 overflow-x-auto">
          <p className="eyebrow mb-3">CTA performance</p>
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)" }}>
                {["CTA", "Page", "Views", "Clicks", "Rate"].map((h) => (
                  <th key={h} className="eyebrow px-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CTA_PERFORMANCE.map((r) => (
                <tr key={r.cta + r.page} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td className="px-3 py-2.5 text-[13px]">{r.cta}</td>
                  <td className="mono px-3 py-2.5 text-[12px]" style={{ color: "var(--text-dim)" }}>{r.page}</td>
                  <td className="mono px-3 py-2.5 text-[13px]">{r.views.toLocaleString("en-IN")}</td>
                  <td className="mono px-3 py-2.5 text-[13px]">{r.clicks.toLocaleString("en-IN")}</td>
                  <td className="mono px-3 py-2.5 text-[13px]" style={{ color: "var(--accent-ink)" }}>{r.rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Channel attribution */}
        <div className="mt-10 overflow-x-auto">
          <p className="eyebrow mb-3">Channel attribution</p>
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)" }}>
                {["Channel", "Persona", "Impressions", "Clicks", "CTR", "CPC"].map((h) => (
                  <th key={h} className="eyebrow px-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHANNEL_ATTRIBUTION.map((r) => (
                <tr key={r.channel} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td className="px-3 py-2.5 text-[13px]">{r.channel}</td>
                  <td className="px-3 py-2.5 text-[12px]" style={{ color: "var(--text-dim)" }}>{r.persona}</td>
                  <td className="mono px-3 py-2.5 text-[13px]">{r.impressions.toLocaleString("en-IN")}</td>
                  <td className="mono px-3 py-2.5 text-[13px]">{r.clicks.toLocaleString("en-IN")}</td>
                  <td className="mono px-3 py-2.5 text-[13px]">{r.ctr}%</td>
                  <td className="mono px-3 py-2.5 text-[13px]">
                    {r.cpcInr === 0 ? "organic" : `₹${r.cpcInr}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ===================== B · Live site activity ===================== */}
      <Section labelledBy="live">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge tone="accent">B · Real</Badge>
          <h2 id="live" className="text-[20px] font-semibold sm:text-[24px]">
            Live site activity
          </h2>
        </div>

        <p
          className="mb-6 text-[15px] leading-relaxed"
          style={{ color: "var(--text-dim)", maxWidth: "var(--measure)" }}
        >
          Actual anonymous counts from this deployment — page views, which mode
          visitors chose, how far into the demo they got, which calls-to-action
          they clicked. No cookies, no personal data, and a session identifier
          that expires when the tab closes.
        </p>

        {liveState === "off" && (
          <Callout variant="project-note">
            No analytics endpoint is configured on this deployment, so there is
            nothing real to show here. Showing zeros instead would look like
            nobody has visited, which is a different claim entirely.{" "}
            <span className="mono">scripts/README.md</span> has the ten-minute
            setup.
          </Callout>
        )}

        {liveState === "loading" && (
          <p className="mono text-[13px]" style={{ color: "var(--text-dim)" }}>
            Reading counts…
          </p>
        )}

        {liveState === "failed" && (
          <Callout>
            The analytics endpoint is configured but did not respond. Nothing is
            shown rather than a guess — check the deployment is live and set to
            &ldquo;Anyone&rdquo; access.
          </Callout>
        )}

        {liveState === "ready" && live?.ok && (
          <>
            <div
              className="grid gap-px sm:grid-cols-2 lg:grid-cols-4"
              style={{ background: "var(--line)" }}
            >
              <div className="p-4" style={{ background: "var(--bg)" }}>
                <StatTile figure={String(live.count ?? 0)} label="events recorded" accent />
              </div>
              <div className="p-4" style={{ background: "var(--bg)" }}>
                <StatTile figure={String(live.sessions ?? 0)} label="sessions" />
              </div>
              <div className="p-4" style={{ background: "var(--bg)" }}>
                <StatTile figure={String(live.byMode?.institutional ?? 0)} label="institutional events" />
              </div>
              <div className="p-4" style={{ background: "var(--bg)" }}>
                <StatTile figure={String(live.byMode?.personal ?? 0)} label="personal events" />
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <LiveTable title="By event" data={live.totals ?? {}} />
              <LiveTable title="By page" data={live.byPage ?? {}} mono />
            </div>

            {live.forms && (
              <div className="mt-8">
                <p className="eyebrow mb-3">Form submissions</p>
                <div
                  className="grid gap-px sm:grid-cols-2"
                  style={{ background: "var(--line)" }}
                >
                  {Object.entries(live.forms).map(([k, v]) => (
                    <div key={k} className="p-4" style={{ background: "var(--bg)" }}>
                      <StatTile figure={String(v)} label={k} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Section>
    </>
  );
}

function LiveTable({
  title,
  data,
  mono,
}: {
  title: string;
  data: Record<string, number>;
  mono?: boolean;
}) {
  const rows = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = rows[0]?.[1] ?? 1;

  return (
    <div>
      <p className="eyebrow mb-3">{title}</p>
      {rows.length === 0 ? (
        <p className="text-[13px]" style={{ color: "var(--text-dim)" }}>
          Nothing recorded yet.
        </p>
      ) : (
        <ul>
          {rows.map(([k, v]) => (
            <li
              key={k}
              className="flex items-center gap-4 border-b py-2.5 last:border-b-0"
              style={{ borderColor: "var(--line)" }}
            >
              <span className={`min-w-0 flex-1 truncate text-[13px] ${mono ? "mono" : ""}`}>{k}</span>
              <span
                className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full"
                style={{ background: "var(--line)" }}
                aria-hidden="true"
              >
                <span className="block h-full" style={{ width: `${(v / max) * 100}%`, background: "var(--accent)" }} />
              </span>
              <span className="mono w-10 shrink-0 text-right text-[13px]">{v}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
