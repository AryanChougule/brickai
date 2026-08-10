import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";

export default function NotFound() {
  return (
    <section className="px-page flex min-h-svh flex-col justify-center pb-24 pt-[calc(var(--nav-h)+96px)]">
      <div className="absolute inset-0 -z-10 wire-grid opacity-60" aria-hidden="true" />

      <Kicker>Error 404</Kicker>
      <h1 className="mt-4 max-w-[18ch] text-poster">
        That page isn&apos;t here
        <span className="text-accent">.</span>
      </h1>
      <p className="mt-6 max-w-[52ch] text-base text-ink-mute">
        The link is wrong, or the page has moved. The capability index is the
        fastest way back into the site — it lists everything we build.
      </p>

      <div className="mt-9 flex flex-wrap gap-3">
        <Button href="/what-we-build" size="lg">
          Capability index →
        </Button>
        <Button href="/" size="lg" variant="secondary">
          Back to home
        </Button>
      </div>
    </section>
  );
}
