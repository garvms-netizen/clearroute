import { Callout } from "@/components/ui/Callout";

/**
 * The framing every presence page carries.
 *
 * These pages are the one place on the site where imitating someone else's
 * interface would be an easy shortcut, so the constraint is stated out loud:
 * nothing here reproduces a platform's logo, icon set or chrome. The frames
 * are Clear Route's own, in Clear Route's palette.
 */
export function ConceptNote({ channel }: { channel?: string }) {
  return (
    <Callout variant="project-note">
      <strong style={{ color: "var(--text)" }}>Concept preview.</strong> This
      shows how Clear Route&rsquo;s campaign assets are designed to appear
      {channel ? ` on ${channel}` : " on each channel"} — it is not a
      reproduction of that platform. No platform logo, icon set or interface
      chrome is used anywhere on these pages; the frames are drawn in
      Clear Route&rsquo;s own palette. Clear Route is a fictional company created
      for an academic marketing project, and none of these assets were
      published.
    </Callout>
  );
}
