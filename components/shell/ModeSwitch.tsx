"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMode } from "@/components/ModeProvider";
import { otherMode, switchLabel, switchModeHref } from "@/lib/mode";
import { cn } from "@/lib/cn";

/**
 * The mode switch.
 *
 * Phrased as an invitation rather than a toggle — "Sending money yourself? →"
 * rather than "Personal / Business" — because the question it answers is who
 * the visitor is, not which theme they prefer.
 *
 * Switching preserves the equivalent page where one exists and lands on that
 * mode's home where it doesn't (see switchModeHref). Deliberately a real link:
 * mode lives in the URL, so this has to be navigable, shareable and
 * middle-clickable like any other link.
 */
export function ModeSwitch({ className }: { className?: string }) {
  const pathname = usePathname() ?? "/";
  const { mode, choose } = useMode();
  const target = otherMode(mode);

  return (
    <Link
      href={switchModeHref(pathname, target)}
      onClick={() => choose(target)}
      className={cn("text-[13px] underline-offset-4 hover:underline", className)}
      style={{ color: "var(--text-dim)" }}
    >
      {switchLabel(target)}
    </Link>
  );
}
