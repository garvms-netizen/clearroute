import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Button — primary, secondary, ghost, in three sizes.
 *
 * Signal Teal is the action colour in *both* modes. That is the single
 * strongest thing holding the two expressions together as one brand, so it
 * does not change with mode; only radius and transition speed do, both from
 * tokens. Buttons name what happens ("Request a callback"), never "Submit".
 */

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

/**
 * Note for callers: `inline-flex` here is not overridable from `className`.
 * Tailwind resolves same-specificity utilities by stylesheet order, not by
 * the order they appear in the class attribute, so passing `hidden` alongside
 * it does nothing. To hide a button responsively, wrap it in an element that
 * carries the visibility classes.
 */
const BASE =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap " +
  "disabled:opacity-40 disabled:cursor-not-allowed";

function styleFor(variant: Variant): React.CSSProperties {
  const shared: React.CSSProperties = {
    borderRadius: "var(--radius)",
    transition: "background-color var(--motion) var(--ease), border-color var(--motion) var(--ease), color var(--motion) var(--ease)",
  };
  if (variant === "primary") {
    return {
      ...shared,
      // The fill stays exactly Signal Teal in both modes — that is what keeps
      // the two expressions legibly one brand, so it does not get darkened.
      background: "var(--accent)",
      // Near-black teal rather than pure white: 6.8:1 on Signal Teal, where
      // white would be ~2.3:1 and fail AA outright.
      color: "#04211F",
      // On the warm personal ground the teal fill is only 2.34:1 against the
      // page, short of the 3:1 WCAG 1.4.11 wants for a component boundary.
      // The ink-variant border gives the button a discernible edge (4.9:1)
      // without touching the fill. In institutional mode --accent-ink resolves
      // to --accent, so this is a no-op there.
      border: "1px solid var(--accent-ink)",
    };
  }
  if (variant === "secondary") {
    return {
      ...shared,
      background: "transparent",
      color: "var(--text)",
      border: "1px solid var(--line)",
    };
  }
  return {
    ...shared,
    background: "transparent",
    color: "var(--accent-ink)", // teal as text — see the ink note in globals.css
    border: "1px solid transparent",
    paddingLeft: 0,
    paddingRight: 0,
  };
}

const HOVER: Record<Variant, string> = {
  primary: "hover:brightness-110",
  // Border takes --accent (a non-text use), the label takes --accent-ink.
  secondary: "hover:border-[var(--accent)] hover:text-[var(--accent-ink)]",
  ghost: "hover:underline underline-offset-4",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type AnchorProps = CommonProps & {
  /** Internal routes go through next/link so basePath is applied. */
  href: string;
  external?: boolean;
  /** Used for analytics on CTA links; never to block navigation. */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export function Button(props: ButtonProps | AnchorProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(BASE, SIZES[size], HOVER[variant], className);
  const style = styleFor(variant);

  if ("href" in props && props.href !== undefined) {
    const { href, external, onClick } = props as AnchorProps;
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          style={style}
          onClick={onClick}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} style={style} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    className: _c,
    children: _ch,
    ...buttonProps
  } = props as ButtonProps;
  void _v;
  void _s;
  void _c;
  void _ch;

  return (
    <button className={classes} style={style} {...buttonProps}>
      {children}
    </button>
  );
}
