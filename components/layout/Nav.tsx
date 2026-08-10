"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Fixed 64px bar with a blurred backdrop and a 2px bottom rule.
 * Under 768px it collapses to brand + CTA with the links behind a toggle,
 * per section 6 of the spec.
 */
export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Route changes close the panel; the pathname is the only trigger needed
  // because every nav item is a real navigation.
  useEffect(() => setOpen(false), [pathname]);

  // While the panel is open, lock the page behind it and honour Escape.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-[var(--nav-h)]",
        "border-b-2 border-divider bg-[rgba(23,21,21,0.82)] backdrop-blur-[14px]",
      )}
    >
      <nav
        aria-label="Primary"
        className="px-page flex h-full items-center gap-8"
      >
        <Wordmark />

        <ul className="hidden flex-1 items-center gap-6 text-[13px] lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <NavLink href={link.href} pathname={pathname}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <Button href={site.cta.href} size="sm" className="hidden sm:inline-flex">
            {site.cta.label}
          </Button>
          <MenuToggle open={open} onToggle={() => setOpen((v) => !v)} />
        </div>
      </nav>

      {open ? <MobilePanel pathname={pathname} /> : null}
    </header>
  );
}

function NavLink({
  href,
  pathname,
  children,
  className,
}: {
  href: string;
  pathname: string;
  children: string;
  className?: string;
}) {
  // Hash links point at home-page sections and never read as current.
  const isSection = href.includes("#");
  const current =
    !isSection && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "transition-colors duration-[--duration-hover] hover:text-ink",
        current ? "text-ink" : "text-ink-soft",
        className,
      )}
    >
      {children}
    </Link>
  );
}

function MenuToggle({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-nav"
      aria-label={open ? "Close menu" : "Open menu"}
      className="touch-target -mr-2 flex items-center justify-center text-ink lg:hidden"
    >
      <span aria-hidden="true" className="flex h-4 w-6 flex-col justify-between">
        <span
          className={cn(
            "h-0.5 w-full bg-current transition-transform duration-200",
            open && "translate-y-[7px] rotate-45",
          )}
        />
        <span
          className={cn(
            "h-0.5 w-full bg-current transition-opacity duration-200",
            open && "opacity-0",
          )}
        />
        <span
          className={cn(
            "h-0.5 w-full bg-current transition-transform duration-200",
            open && "-translate-y-[7px] -rotate-45",
          )}
        />
      </span>
    </button>
  );
}

function MobilePanel({ pathname }: { pathname: string }) {
  return (
    <div
      id="mobile-nav"
      className="px-page fixed inset-x-0 top-[var(--nav-h)] bottom-0 z-40 overflow-y-auto border-t-2 border-divider bg-ground pb-10 pt-6 lg:hidden"
    >
      <ul className="flex flex-col">
        {navLinks.map((link) => (
          <li key={link.href} className="border-b border-hairline">
            <NavLink
              href={link.href}
              pathname={pathname}
              className="flex min-h-[56px] items-center text-xl font-extrabold tracking-[-0.01em]"
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <Button href={site.cta.href} size="lg" className="mt-8 w-full">
        {site.cta.label} →
      </Button>
    </div>
  );
}
