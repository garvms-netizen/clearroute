"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RouteMark } from "@/components/art/RouteMark";
import { beatAt, type Beat, type Film } from "@/lib/films";
import { track } from "@/lib/track";

/**
 * Plays a film.
 *
 * Behaves like a video player — play/pause, scrub, elapsed and total, restart
 * at the end — but draws each frame rather than decoding one. See lib/films.ts
 * for why the films are animated rather than encoded.
 *
 * Respects prefers-reduced-motion by not auto-advancing: the transport still
 * works, so someone who does not want motion can step through the beats
 * themselves instead of being denied the content.
 */
export function FilmPlayer({ film, onPlay }: { film: Film; onPlay?: () => void }) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | null>(null);
  const startedAt = useRef<number | null>(null);
  const offset = useRef(0);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!playing) return;
    startedAt.current = Date.now();
    const tick = () => {
      const elapsed = offset.current + (Date.now() - (startedAt.current ?? Date.now())) / 1000;
      if (elapsed >= film.runtime) {
        setT(film.runtime);
        setPlaying(false);
        return;
      }
      setT(elapsed);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      offset.current = offset.current + (Date.now() - (startedAt.current ?? Date.now())) / 1000;
    };
  }, [playing, film.runtime]);

  const toggle = useCallback(() => {
    if (t >= film.runtime) {
      offset.current = 0;
      setT(0);
      setPlaying(true);
      return;
    }
    if (!playing) {
      offset.current = t;
      onPlay?.();
      track("video_play", film.mode);
    }
    setPlaying((p) => !p);
  }, [t, film.runtime, film.mode, playing, onPlay]);

  const scrub = (v: number) => {
    offset.current = v;
    setT(v);
  };

  const beat = beatAt(film, t);
  const ended = t >= film.runtime;

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      {/* Stage */}
      <div className="relative aspect-video w-full overflow-hidden" style={{ background: "var(--bg)" }}>
        <Scene beat={beat} t={t} />

        {/* Play overlay before first play, and at the end */}
        {(!playing || ended) && (
          <button
            type="button"
            onClick={toggle}
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: t === 0 || ended ? "color-mix(in srgb, var(--bg) 55%, transparent)" : "transparent" }}
            aria-label={ended ? "Replay the film" : "Play the film"}
          >
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "var(--accent)" }}
            >
              {ended ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5" stroke="#04211F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true">
                  <path d="M2 1.5 18 11 2 20.5V1.5Z" fill="#04211F" />
                </svg>
              )}
            </span>
          </button>
        )}
      </div>

      {/* Transport */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="shrink-0">
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <rect x="2.5" y="1.5" width="4" height="13" rx="1" fill="var(--accent-ink)" />
              <rect x="9.5" y="1.5" width="4" height="13" rx="1" fill="var(--accent-ink)" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 1.5 14 8 3 14.5V1.5Z" fill="var(--accent-ink)" />
            </svg>
          )}
        </button>

        <input
          type="range"
          min={0}
          max={film.runtime}
          step={0.1}
          value={t}
          onChange={(e) => scrub(Number(e.target.value))}
          aria-label="Seek"
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full"
          style={{
            background: `linear-gradient(to right, var(--accent) ${(t / film.runtime) * 100}%, var(--line) ${(t / film.runtime) * 100}%)`,
          }}
        />

        <span className="mono shrink-0 text-[11px]" style={{ color: "var(--text-dim)" }}>
          {fmt(t)} / {fmt(film.runtime)}
        </span>
      </div>

      {/* Beat markers, doubling as a chapter list */}
      <div className="flex gap-px px-4 pb-3" aria-hidden="true">
        {film.beats.map((b, i) => {
          const next = film.beats[i + 1]?.at ?? film.runtime;
          return (
            <button
              key={b.at}
              onClick={() => scrub(b.at)}
              className="h-1 flex-1 rounded-full"
              style={{
                background: t >= b.at ? "var(--accent)" : "var(--line)",
                flexGrow: next - b.at,
              }}
              tabIndex={-1}
            />
          );
        })}
      </div>

      {reduced && (
        <p className="mono px-4 pb-3 text-[10px]" style={{ color: "var(--text-dim)" }}>
          Reduced motion is on — use the scrubber or the markers to step through.
        </p>
      )}
    </div>
  );
}

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/* ------------------------------------------------------------- Scenes --- */

/**
 * Each beat draws a composition built from the same route motif the rest of
 * the site uses, so the films look like they belong to the brand rather than
 * to a stock template.
 */
function Scene({ beat, t }: { beat: Beat; t: number }) {
  // Local progress within the beat, for the entrance transitions.
  const local = Math.min(1, (t - beat.at) / 0.6);

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-9">
      <div
        style={{
          opacity: local,
          transform: `translateY(${(1 - local) * 10}px)`,
          transition: "none",
        }}
      >
        <Visual scene={beat.scene} t={t - beat.at} />
      </div>

      <div
        style={{
          opacity: local,
          transform: `translateY(${(1 - local) * 14}px)`,
        }}
      >
        {beat.figure && (
          <p
            className="mono mb-2 text-2xl font-medium sm:text-4xl"
            style={{ color: "var(--accent-ink)" }}
          >
            {beat.figure}
          </p>
        )}
        <p
          className="max-w-[22ch] text-[22px] leading-[1.15] font-semibold sm:max-w-[26ch] sm:text-[34px]"
          style={{ letterSpacing: "-0.02em", color: "var(--text)" }}
        >
          {beat.line}
        </p>
        {beat.sub && (
          <p
            className="mt-2 max-w-[38ch] text-[13px] leading-relaxed sm:text-[15px]"
            style={{ color: "var(--text-dim)" }}
          >
            {beat.sub}
          </p>
        )}
      </div>
    </div>
  );
}

function Visual({ scene, t }: { scene: Beat["scene"]; t: number }) {
  const draw = Math.min(1, t / 1.4);

  if (scene === "signoff") {
    return (
      <span className="flex items-center gap-3">
        <RouteMark size={34} decorative />
        <span
          className="text-xl font-semibold sm:text-2xl"
          style={{ letterSpacing: "-0.02em", color: "var(--text)" }}
        >
          Clear Route
        </span>
      </span>
    );
  }

  if (scene === "quote-vs-applied") {
    return (
      <svg viewBox="0 0 320 70" className="h-14 w-full max-w-md sm:h-20" fill="none" aria-hidden="true">
        <path d="M4 18 H316" stroke="var(--line)" strokeWidth="2" />
        <path d="M4 52 H316" stroke="var(--line)" strokeWidth="2" />
        <path d="M4 18 H316" stroke="var(--accent)" strokeWidth="2" strokeDasharray="312" strokeDashoffset={312 * (1 - draw)} />
        <path d="M4 52 H240" stroke="var(--highlight)" strokeWidth="2" strokeDasharray="236" strokeDashoffset={236 * (1 - draw)} />
        <circle cx="316" cy="18" r="4" fill="var(--accent)" opacity={draw} />
        <circle cx="240" cy="52" r="4" fill="var(--highlight)" opacity={draw} />
      </svg>
    );
  }

  if (scene === "fee-stack") {
    return (
      <svg viewBox="0 0 220 70" className="h-14 w-full max-w-xs sm:h-20" fill="none" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={10 + i * 14 * draw}
            y={6 + i * 15}
            width="70"
            height="12"
            rx="2"
            fill="var(--line)"
            opacity={draw}
          />
        ))}
        <rect x="10" y="52" width="70" height="14" rx="2" fill="var(--accent)" />
      </svg>
    );
  }

  if (scene === "chain") {
    return (
      <svg viewBox="0 0 320 60" className="h-12 w-full max-w-md sm:h-16" fill="none" aria-hidden="true">
        <path
          d="M10 46 L80 16 L150 46 L220 16 L310 46"
          stroke="var(--line)"
          strokeWidth="2"
          strokeDasharray="360"
          strokeDashoffset={360 * (1 - draw)}
        />
        {[80, 150, 220].map((x, i) => (
          <circle key={x} cx={x} cy={i % 2 === 0 ? 16 : 46} r="6" fill="var(--line)" opacity={draw} />
        ))}
        <circle cx="10" cy="46" r="6" fill="var(--mark)" />
        <circle cx="310" cy="46" r="6" fill="var(--mark)" />
      </svg>
    );
  }

  if (scene === "settle") {
    const steps = 5;
    const on = Math.min(steps, Math.floor(t / 0.9) + 1);
    return (
      <svg viewBox="0 0 320 40" className="h-10 w-full max-w-md sm:h-14" fill="none" aria-hidden="true">
        <path d="M14 20 H306" stroke="var(--line)" strokeWidth="2" />
        <path
          d="M14 20 H306"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeDasharray="292"
          strokeDashoffset={292 * (1 - Math.min(1, on / steps))}
        />
        {Array.from({ length: steps }, (_, i) => (
          <circle
            key={i}
            cx={14 + (i * 292) / (steps - 1)}
            cy="20"
            r={i < on ? 7 : 5}
            fill={i < on ? "var(--accent)" : "var(--bg)"}
            stroke={i < on ? "var(--accent)" : "var(--line)"}
            strokeWidth="2"
          />
        ))}
      </svg>
    );
  }

  if (scene === "offer") {
    return (
      <svg viewBox="0 0 300 60" className="h-12 w-full max-w-sm sm:h-16" fill="none" aria-hidden="true">
        <rect
          x="4"
          y="6"
          width="292"
          height="48"
          rx="4"
          stroke="var(--highlight)"
          strokeWidth="2"
          fill="color-mix(in srgb, var(--highlight) 10%, transparent)"
          opacity={draw}
        />
        <path d="M28 40 L110 40 L190 18" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" strokeDashoffset={200 * (1 - draw)} />
        <circle cx="28" cy="40" r="5" fill="var(--mark)" />
        <circle cx="110" cy="40" r="5" fill="var(--accent)" />
        <circle cx="190" cy="18" r="5" fill="var(--mark)" />
      </svg>
    );
  }

  if (scene === "route") {
    return (
      <svg viewBox="0 0 320 60" className="h-12 w-full max-w-md sm:h-16" fill="none" aria-hidden="true">
        <path
          d="M12 46 L150 46 L308 14"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="330"
          strokeDashoffset={330 * (1 - draw)}
        />
        <circle cx="12" cy="46" r="7" fill="var(--mark)" />
        <circle cx="150" cy="46" r="7" fill="var(--accent)" opacity={draw} />
        <circle cx="308" cy="14" r="7" fill="var(--mark)" opacity={draw} />
      </svg>
    );
  }

  // hook
  return (
    <svg viewBox="0 0 320 60" className="h-12 w-full max-w-md sm:h-16" fill="none" aria-hidden="true">
      {Array.from({ length: 22 }, (_, i) => (
        <circle
          key={i}
          cx={12 + i * 14}
          cy={30 + Math.sin(i * 0.7 + t * 1.4) * 9}
          r="2.4"
          fill="var(--line)"
        />
      ))}
      <circle cx={12 + 21 * 14} cy={30 + Math.sin(21 * 0.7 + t * 1.4) * 9} r="5" fill="var(--accent)" />
    </svg>
  );
}
