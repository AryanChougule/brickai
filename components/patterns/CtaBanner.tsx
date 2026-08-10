import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

/**
 * The accent poster field. Full-bleed orange with dark display type and one
 * black inverse button — the site's closing move on every route below the home
 * page.
 *
 * Text on the poster is `ground`, not `ink`: dark on orange is 5.7:1, light on
 * orange is 2.8:1 and fails even the large-text floor.
 */
export function CtaBanner({
  headline,
  body,
  action = site.cta.label,
  href = site.cta.href,
}: {
  headline: string;
  body?: string;
  action?: string;
  href?: string;
}) {
  return (
    <section className="px-page bg-accent py-[90px] text-ground">
      <h2 className="max-w-[1100px] text-poster">{headline}</h2>
      {body ? (
        <p className="mt-6 max-w-[520px] text-base opacity-90">{body}</p>
      ) : null}
      <Button href={href} variant="inverse" size="lg" className="mt-8">
        {action} →
      </Button>
    </section>
  );
}
