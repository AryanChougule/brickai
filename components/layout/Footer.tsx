import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { footerLinks, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="px-page flex flex-wrap items-center gap-6 border-t-2 border-divider py-7 text-[12px] text-ink-faint">
      <Wordmark size="sm" />
      <p>{site.tagline}</p>
      <nav aria-label="Footer" className="ml-auto">
        <ul className="flex flex-wrap items-center gap-5">
          {footerLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-ink-mute transition-colors duration-[--duration-hover] hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>© {site.founded} {site.name}</li>
        </ul>
      </nav>
    </footer>
  );
}
