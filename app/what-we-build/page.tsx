import Link from "next/link";
import { CapabilityIcon } from "@/components/icons/CapabilityIcon";
import { CtaBanner } from "@/components/patterns/CtaBanner";
import { FieldBlock, ImpactNote } from "@/components/ui/FieldBlock";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCapabilities } from "@/lib/cms";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "What we build",
  description:
    "Twelve system categories — AI, vision, automation, data and product engineering. Each entry explains the problem class it solves, where it applies, and what it typically returns.",
  path: "/what-we-build",
  eyebrow: "Capability index",
});

export default async function WhatWeBuildPage() {
  const capabilities = await getCapabilities();

  return (
    <>
      <PageHeader
        kicker="Capability index"
        title="What we build, and what it fixes."
        lede="Twelve system categories. Each entry explains the problem class it solves, where it applies, and what it typically returns — so you can recognise your problem before we ever talk."
      />

      {capabilities.map((capability) => (
        <section
          key={capability.slug}
          id={capability.slug}
          aria-labelledby={`${capability.slug}-heading`}
          className="grid grid-hairline border-x-0 border-t-0 md:grid-cols-[minmax(280px,1.1fr)_2fr]"
        >
          <div className="flex min-h-[340px] flex-col bg-ground px-page py-12">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] tracking-[0.12em] text-ink-faint">
                {capability.num}
              </span>
              <CapabilityIcon
                name={capability.icon}
                size={22}
                className="text-ink-faint"
              />
            </div>

            <h2
              id={`${capability.slug}-heading`}
              className="mb-3 mt-auto text-h3"
            >
              <Link
                href={`/what-we-build/${capability.slug}`}
                className="text-ink hover:text-accent-soft"
              >
                {capability.name}
              </Link>
            </h2>
            <p className="text-[15px] text-ink-mute">{capability.tagline}</p>

            <ImpactNote className="mt-6">Impact — {capability.impact}</ImpactNote>

            <Link
              href={`/what-we-build/${capability.slug}`}
              className="mt-4 text-[13px] font-extrabold text-accent-text hover:text-accent-soft"
            >
              Architecture, ROI and demo →
            </Link>
          </div>

          <div className="grid content-start gap-8 bg-ground-raised px-page py-12 sm:grid-cols-2">
            <FieldBlock label="Problems solved">
              {capability.problems.join(". ")}.
            </FieldBlock>
            <FieldBlock label="Example use cases">
              {capability.useCases.join(". ")}.
            </FieldBlock>
            <FieldBlock label="Industries" tone="muted">
              {capability.industries
                .map((slug) => slug.replace(/-/g, " "))
                .join(", ")}
            </FieldBlock>
            <FieldBlock label="Technologies" tone="muted">
              {capability.technologies.join(", ")}
            </FieldBlock>
          </div>
        </section>
      ))}

      <CtaBanner
        headline="Don't see your problem? That's usually the interesting kind."
        body="A 30-minute discovery call. You describe the problem; we sketch the system."
      />
    </>
  );
}
