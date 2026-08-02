import { cn } from "@/lib/cn";

/**
 * Eyebrow — mono, uppercase, wide-tracked section marker.
 * Used constantly in institutional mode; sparingly in personal.
 */
export function Eyebrow({
  children,
  className,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
}) {
  return <Tag className={cn("eyebrow", className)}>{children}</Tag>;
}
