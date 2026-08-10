import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** BRICK + AI, the second half in accent. Wrapped in a home link by default. */
export function Wordmark({
  className,
  href = "/",
  size = "md",
}: {
  className?: string;
  /** Pass null to render the mark without a link (e.g. inside the footer note). */
  href?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const [first, second] = site.wordmark;
  const content = (
    <>
      {first}
      <span className="text-accent">{second}</span>
    </>
  );

  const classes = cn(
    "font-extrabold tracking-[-0.01em] text-ink",
    size === "sm" && "text-sm",
    size === "md" && "text-lg",
    size === "lg" && "text-2xl",
    className,
  );

  if (href === null) {
    return <span className={classes}>{content}</span>;
  }

  return (
    <Link href={href} className={classes} aria-label={`${site.name} — home`}>
      {content}
    </Link>
  );
}
