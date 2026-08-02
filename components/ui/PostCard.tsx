import { cn } from "@/lib/cn";
import { RouteMark } from "@/components/art/RouteMark";

/**
 * PostCard — a generic social post frame for the LinkedIn and paid-social
 * previews.
 *
 * The engagement affordances are drawn here from the route motif rather than
 * copied from any platform's icon set: a node glyph for reactions, a bracket
 * for comments, an arrow for shares. Same reason the frame carries no
 * platform logo — these are concept previews of ClearRoute's own assets, not
 * reproductions of someone else's interface.
 */
export function PostCard({
  author = "ClearRoute",
  meta,
  body,
  visual,
  reactions,
  comments,
  topComment,
  className,
}: {
  author?: string;
  meta?: string;
  body: React.ReactNode;
  visual?: React.ReactNode;
  reactions?: number;
  comments?: number;
  /** Rendered as the pinned top comment — used for the engagement prompt. */
  topComment?: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn("overflow-hidden border", className)}
      style={{
        background: "var(--surface)",
        borderColor: "var(--line)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <header className="flex items-center gap-3 p-4">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius)",
          }}
        >
          <RouteMark size={18} decorative />
        </span>
        <span className="min-w-0">
          <span
            className="block truncate text-sm font-semibold"
            style={{ color: "var(--text)" }}
          >
            {author}
          </span>
          {meta && (
            <span
              className="mono block truncate text-[11px]"
              style={{ color: "var(--text-dim)" }}
            >
              {meta}
            </span>
          )}
        </span>
      </header>

      <div
        className="space-y-3 px-4 pb-4 text-sm leading-relaxed"
        style={{ color: "var(--text)" }}
      >
        {body}
      </div>

      {visual && (
        <div
          style={{
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
            background: "var(--surface-2)",
          }}
        >
          {visual}
        </div>
      )}

      {(reactions !== undefined || comments !== undefined) && (
        <div
          className="flex items-center gap-4 px-4 py-3"
          style={{ color: "var(--text-dim)" }}
        >
          {reactions !== undefined && (
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 12 12" aria-hidden="true">
                <circle cx="6" cy="6" r="4" fill="var(--accent)" />
              </svg>
              <span className="mono text-[11px]">{reactions}</span>
            </span>
          )}
          {comments !== undefined && (
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M2 3h10v6H6l-3 2.5V9H2z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mono text-[11px]">{comments}</span>
            </span>
          )}
          <span className="ml-auto flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M2 7h9M8 4l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[11px]">Share</span>
          </span>
        </div>
      )}

      {topComment && (
        <div
          className="px-4 py-3 text-[13px] leading-relaxed"
          style={{
            borderTop: "1px solid var(--line)",
            background: "var(--surface-2)",
            color: "var(--text-dim)",
          }}
        >
          {topComment}
        </div>
      )}
    </article>
  );
}
