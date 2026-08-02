import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

/**
 * SectionHeader — eyebrow, H2, optional lede.
 *
 * Headline size is capped well below display scale in institutional mode
 * (~28px against personal's ~40px): loud type undercuts the register the
 * institutional side is trying to hold.
 */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  level = 2,
  align = "left",
  className,
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  level?: 1 | 2 | 3;
  align?: "left" | "center";
  className?: string;
  id?: string;
}) {
  const Heading = `h${level}` as "h1" | "h2" | "h3";

  const size =
    level === 1
      ? "text-[28px] leading-[1.15] sm:text-4xl [[data-mode='personal']_&]:sm:text-5xl"
      : level === 2
        ? "text-[22px] leading-[1.2] sm:text-[26px] [[data-mode='personal']_&]:sm:text-[34px]"
        : "text-lg sm:text-xl";

  return (
    <header
      className={cn(
        align === "center" && "mx-auto text-center",
        "max-w-3xl",
        className,
      )}
      id={id}
    >
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <Heading className={cn("font-semibold", size)}>{title}</Heading>
      {lede && (
        <p
          className={cn(
            "mt-3 text-[15px] leading-relaxed sm:text-base",
            align === "center" && "mx-auto",
          )}
          style={{ color: "var(--text-dim)", maxWidth: "var(--measure)" }}
        >
          {lede}
        </p>
      )}
    </header>
  );
}
