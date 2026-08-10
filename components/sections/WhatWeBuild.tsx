import Link from "next/link";
import { CapabilityCatalogue } from "@/components/capabilities/CapabilityCatalogue";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCapabilities } from "@/lib/cms";
import { homeSection } from "@/lib/site";

/**
 * The centerpiece section: the capability catalogue as a product index rather
 * than a service list. Server component — only the accordion's open state is
 * client-side.
 */
export async function WhatWeBuild() {
  const capabilities = await getCapabilities();
  const { id, num, label } = homeSection("build");

  return (
    <Section id={id}>
      <SectionHeader
        num={num}
        kicker={label}
        title="A product ecosystem, not a service list."
        lede="Each capability is a system we design, build and operate. Select one to see the problems it solves — or open its full specification."
        action={
          <Link
            href="/what-we-build"
            className="text-[13px] font-extrabold text-accent-text hover:text-accent-soft"
          >
            Full capability index →
          </Link>
        }
        className="mb-12"
      />

      <CapabilityCatalogue capabilities={capabilities} />
    </Section>
  );
}
