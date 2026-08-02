/**
 * Shared plumbing for the illustration set.
 *
 * Every graphic in components/art/ is authored as inline SVG reading CSS
 * custom properties, never hard-coded hex, so one component renders correctly
 * in both modes with no second export and no drift from the palette. Raster
 * assets would need two exports each — and image models garble small
 * numerals, which on a brand whose entire claim is numerical precision would
 * be self-defeating. Hence: no text, letters or numerals inside any SVG.
 * Labels are always HTML alongside.
 */

export type ArtProps = {
  className?: string;
  /** Accessible description. Omit only when `decorative` is set. */
  title?: string;
  /** Hides from assistive tech — for when adjacent HTML already says it. */
  decorative?: boolean;
};

export function a11yProps(title: string, decorative?: boolean) {
  return decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": title } as const);
}

/**
 * Stroke weight is a mode signal: 1.5px institutional, 2.5px personal.
 * Exposed as a token so every graphic stays consistent within a mode without
 * each one knowing which mode it is in.
 */
export const STROKE = "var(--stroke, 1.5px)";

/**
 * Self-drawing stroke.
 *
 * `data-draw` is the hook the reduced-motion block in globals.css uses to
 * force the path to its finished state, so the drawing never becomes a
 * barrier to reading the graphic.
 */
export function drawStyle(length: number, duration = 1.2, delay = 0.15) {
  return {
    strokeDasharray: length,
    strokeDashoffset: length,
    animation: `cr-draw ${duration}s var(--ease) ${delay}s forwards`,
  } satisfies React.CSSProperties;
}
