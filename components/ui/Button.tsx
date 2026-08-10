import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "inverse" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Buttons step down the accent ramp on hover. They never scale and never lift —
 * that is a system rule, so no variant here animates transform.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  // Dark label on the orange fill — 5.7:1. Light text would be 2.8:1.
  primary: "bg-accent text-ground hover:bg-accent-hover active:bg-accent-active",
  secondary:
    "border border-edge text-ink hover:bg-[rgba(248,244,244,0.08)] active:bg-[rgba(248,244,244,0.14)]",
  inverse: "bg-ground text-ink hover:bg-ground-black",
  ghost: "text-accent-text hover:text-accent-soft",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-[18px] py-[10px] text-[13px]",
  md: "px-[22px] py-[13px] text-[14px]",
  lg: "px-[28px] py-[16px] text-[15px]",
};

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

type AsLink = BaseProps & { href: string } & Omit<
    ComponentProps<typeof Link>,
    "href" | "className" | "children"
  >;

type AsButton = BaseProps & { href?: undefined } & Omit<
    ComponentProps<"button">,
    "className" | "children"
  >;

export function Button(props: AsLink | AsButton) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-extrabold leading-none",
    "touch-target transition-colors duration-[--duration-hover] cursor-pointer",
    VARIANTS[variant],
    variant === "ghost" ? "px-0 py-1 text-[13px]" : SIZES[size],
    className,
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...linkProps } = rest as Omit<AsLink, keyof BaseProps>;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = rest as Omit<AsButton, keyof BaseProps>;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
