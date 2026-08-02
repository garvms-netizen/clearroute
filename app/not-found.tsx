import Link from "next/link";

/**
 * Exported to `out/404.html`, which GitHub Pages serves for any unmatched
 * path — so deep links that miss still land somewhere useful rather than on
 * the default Pages error page.
 */
export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-24">
      <p className="eyebrow">ERROR · 404</p>
      <h1 className="mt-4 text-3xl font-semibold">
        That page isn&rsquo;t on this route.
      </h1>
      <p className="mt-4 text-[var(--text-dim)]">
        The link may be out of date, or the address may have a typo in it.
      </p>
      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/" className="underline underline-offset-4">
          Start from the beginning →
        </Link>
        <Link
          href="/institutional/how-it-works"
          className="text-[var(--accent)] underline underline-offset-4"
        >
          See how a transfer works →
        </Link>
      </div>
    </main>
  );
}
