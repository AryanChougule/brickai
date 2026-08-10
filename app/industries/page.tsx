import Link from "next/link";
import { CtaBanner } from "@/components/patterns/CtaBanner";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatStrip } from "@/components/ui/StatPair";
import { getIndustries } from "@/lib/cms";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Industries",
  description:
    "Ten sectors, and the systems that fit them: manufacturing, healthcare, retail, logistics, construction, agriculture, education, finance, government and automotive.",
  path: "/industries",
  eyebrow: "Solutions by industry",
});

export default async function IndustriesPage() {
  const industries = await getIndustries();

  return (
    <>
      <PageHeader
        kicker="Solutions by industry"
        title="Where the software lands."
        lede="Ten sectors we work in. Each one has its own constraints — the ones that decide whether a system survives contact with the operation."
      />

      <ul className="grid grid-hairline border-x-0 border-t-0 lg:grid-cols-2">
        {industries.map((industry) => (
          <li key={industry.slug} className="flex flex-col bg-ground">
            <Link
              href={`/industries/${industry.slug}`}
              className="group flex h-full flex-col transition-colors duration-[--duration-hover] hover:bg-ground-hover"
            >
              {industry.image?.src ? (
                <ImageSlot
                  slot={industry.image}
                  grayscale
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="border-b border-hairline"
                />
              ) : null}

              <div className="flex flex-1 flex-col p-10">
                <span className="text-[13px] tracking-[0.12em] text-ink-faint">
                  {industry.num}
                </span>

                <h2 className="mb-3 mt-8 text-h3 text-ink">{industry.name}</h2>
                <p className="max-w-[520px] text-[15px] text-ink-mute">
                  {industry.blurb}
                </p>

                <StatStrip items={industry.outcomes} className="mt-8" />

                <span className="mt-auto pt-8 text-[13px] font-extrabold text-accent-text">
                  {industry.name} in depth →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <CtaBanner
        headline="Your sector not listed? The constraints are what matter, not the label."
        body="Most of what we build transfers across industries. Tell us the constraint and we will tell you whether we have solved it before."
      />
    </>
  );
}
