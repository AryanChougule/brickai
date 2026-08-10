import Link from "next/link";
import { notFound } from "next/navigation";
import { CapabilityIcon } from "@/components/icons/CapabilityIcon";
import { CtaBanner } from "@/components/patterns/CtaBanner";
import { ProjectCard } from "@/components/work/ProjectCard";
import { ArrowList } from "@/components/ui/FieldBlock";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatStrip } from "@/components/ui/StatPair";
import { getIndustryPage, industrySlugs } from "@/lib/cms";
import { pageMetadata } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return industrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await getIndustryPage(slug);
  if (!page) return {};

  return pageMetadata({
    title: `${page.industry.name} software`,
    description: page.industry.blurb,
    path: `/industries/${slug}`,
    eyebrow: "Industry",
  });
}

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getIndustryPage(slug);
  if (!page) notFound();

  const { industry, capabilities, projects } = page;

  return (
    <>
      <PageHeader
        kicker={`Industry ${industry.num}`}
        title={industry.name}
        lede={industry.blurb}
      >
        <StatStrip items={industry.outcomes} />
      </PageHeader>

      {industry.image?.src ? (
        <div className="rule-b">
          <ImageSlot
            slot={industry.image}
            grayscale
            priority
            sizes="100vw"
            className="max-h-[420px]"
          />
        </div>
      ) : null}

      <Section
        id="context"
        className="grid gap-12 lg:grid-cols-[minmax(280px,1fr)_1.3fr]"
      >
        <SectionHeader num="01" kicker="The picture" title="What we see here." />
        <div className="flex flex-col gap-8">
          <p className="max-w-[62ch] text-base text-ink-dim">
            {industry.narrative}
          </p>
          <div>
            <h3 className="mb-4 text-micro uppercase text-accent-text">
              Constraints that shape every build
            </h3>
            <ArrowList
              items={industry.constraints}
              className="text-sm text-ink-dim"
            />
          </div>
        </div>
      </Section>

      <Section id="capabilities">
        <SectionHeader
          num="02"
          kicker="What we build here"
          title="The systems that fit."
          lede={`Ordered by how often they apply in ${industry.name.toLowerCase()}.`}
          className="mb-12"
        />

        <ul className="grid grid-hairline grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {capabilities.map((capability) => (
            <li key={capability.slug} className="bg-ground">
              <Link
                href={`/what-we-build/${capability.slug}`}
                className="flex h-full min-h-[200px] flex-col p-6 transition-colors duration-[--duration-hover] hover:bg-ground-hover"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[11px] tracking-[0.12em] text-ink-faint">
                    {capability.num}
                  </span>
                  <CapabilityIcon
                    name={capability.icon}
                    className="text-ink-faint"
                  />
                </div>
                <h3 className="mb-2 mt-auto text-xl font-extrabold tracking-[-0.02em] text-ink">
                  {capability.name}
                </h3>
                <p className="text-[13px] text-ink-mute">{capability.tagline}</p>
                <p className="mt-4 text-[12px] text-accent-text">
                  {capability.impact}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="solutions">
        <SectionHeader
          num="03"
          kicker="Typical engagements"
          title="Where projects usually start."
          className="mb-12"
        />
        <ul className="grid grid-hairline grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
          {industry.solutions.map((solution) => (
            <li key={solution} className="bg-ground p-6 text-base text-ink-dim">
              <span aria-hidden="true" className="font-extrabold text-accent">
                →{" "}
              </span>
              {solution}
            </li>
          ))}
        </ul>
      </Section>

      {projects.length > 0 ? (
        <Section id="work" rule={false}>
          <SectionHeader
            num="04"
            kicker="Delivered here"
            title="Case studies."
            className="mb-12"
          />
          <div className="flex flex-col grid-hairline">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBanner
        headline={`Working in ${industry.name.toLowerCase()}? Bring us the constraint.`}
        body="A 30-minute discovery call. You describe the problem; we sketch the system. No deck, no pitch."
      />
    </>
  );
}
