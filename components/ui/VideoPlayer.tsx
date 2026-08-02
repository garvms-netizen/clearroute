"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "./Badge";

/**
 * VideoPlayer — native <video controls>, playing inline. No redirect to a
 * video platform, no embedded third-party player.
 *
 * The video files are optional. If one is absent the element fires `error`
 * and we swap to a bordered placeholder naming the film and its intended
 * runtime, so the site builds and deploys cleanly whether or not the files
 * exist. Existence can't be checked at build time on a static export, so
 * this is handled at runtime rather than guessed.
 */
export function VideoPlayer({
  src,
  poster,
  title,
  runtime,
  onPlay,
  className,
}: {
  /** Path under /public, without basePath — added here. */
  src: string;
  /** Rendered React node used as the poster frame (RouteContrast). */
  poster?: React.ReactNode;
  title: string;
  runtime: string;
  onPlay?: () => void;
  className?: string;
}) {
  const [missing, setMissing] = useState(false);
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

  /**
   * Detect a missing file via a ref callback rather than the onError prop.
   *
   * This site is a static export: the browser begins loading the video from
   * the prerendered HTML well before React hydrates, so on a real deployment
   * the 404 has usually already resolved by the time an onError handler is
   * attached — the event fires into the void and the player sits blank
   * forever. A local dev server is slow enough to hide this, which is why it
   * only showed up on the deployed site.
   *
   * The ref callback runs at commit, attaches the listener for a failure
   * still to come, *and* inspects the element's current state for one that
   * already happened.
   */
  const watchForMissingFile = useCallback((el: HTMLVideoElement | null) => {
    if (!el) return;
    const check = () => {
      if (el.error || el.networkState === el.NETWORK_NO_SOURCE) setMissing(true);
    };
    el.addEventListener("error", check);
    check();
    return () => el.removeEventListener("error", check);
  }, []);

  if (missing) {
    return (
      <div
        className={cn(
          "flex aspect-video w-full flex-col items-center justify-center gap-3 border border-dashed p-6 text-center",
          className,
        )}
        style={{
          borderColor: "var(--line)",
          borderRadius: "var(--radius-lg)",
          background: "var(--surface-2)",
        }}
      >
        {poster && (
          <div className="w-full max-w-sm opacity-40" aria-hidden="true">
            {poster}
          </div>
        )}
        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
          {title}
        </p>
        <p className="mono text-[11px]" style={{ color: "var(--text-dim)" }}>
          {runtime}
        </p>
        <Badge tone="muted">Video file to be added</Badge>
      </div>
    );
  }

  return (
    <video
      ref={watchForMissingFile}
      controls
      preload="metadata"
      playsInline
      onPlay={onPlay}
      // src goes on the element rather than a <source> child on purpose: a
      // failed <source> fires `error` on the source element, which does not
      // bubble, so the video would sit there permanently blank instead of
      // falling back. With src here, the video itself reports the failure.
      src={`${base}${src}`}
      className={cn("aspect-video w-full", className)}
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      Your browser doesn&rsquo;t support embedded video. The film is a {runtime}{" "}
      walkthrough titled &ldquo;{title}&rdquo;.
    </video>
  );
}
