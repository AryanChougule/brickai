import Link from "next/link";
import { notFound } from "next/navigation";
import { ScreenshotGallery } from "@/components/capabilities/ScreenshotGallery";
import { CtaBanner } from "@/components/patterns/CtaBanner";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatPair, StatStrip } from "@/components/ui/StatPair";
import { TagRow } from "@/components/ui/Tag";
import { VideoSlot } from "@/components/ui/VideoSlot";
import { getProjectPage, projectSlugs } from "@/lib/cms";
import { pageMetadata } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await getProjectPage(slug);
  if (!page) return {};

  return pageMetadata({
    title: page.project.title,
    description: page.project.description,
    path: `/work/${slug}`,
    eyebrow: "Case study",
    type: "article",
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getProjectPage(slug);
  if (!page) notFound();

  const { project, capabilities, industry, next } = page;

  return (
    <>
      <PageHeader
        kicker={`Case study — ${project.client}, ${project.year}`}
        title={project.title}
        lede={project.description}
      >
        <div className="flex flex-col gap-8">
          <TagRow items={project.tags} tone="accent" />
          <StatPair
            before={project.before}
            after={project.after}
            className="max-w-[460px]"
          />
        </div>
      </PageHeader>

      <Section
        id="challenge"
        className="grid gap-12 lg:grid-cols-[minmax(280px,1fr)_1.3fr]"
      >
        <SectionHeader num="01" kicker="The challenge" title="Where it started." />
        <p className="max-w-[62ch] text-base text-ink-dim">{project.challenge}</p>
      </Section>

      <Section id="approach">
        <SectionHeader
          num="02"
          kicker="The approach"
          title="What we actually did."
          lede="In the order it happened, including the parts that were unglamorous."
          className="mb-12"
        />

        <ol className="grid grid-hairline grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {project.approach.map((step, index) => (
            <li key={step.title} className="flex flex-col bg-ground p-7">
              <span className="text-[32px] font-extrabold leading-none tracking-[-0.02em] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mb-3 mt-8 text-xl font-extrabold tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="text-sm text-ink-mute">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="outcomes">
        <SectionHeader
          num="03"
          kicker="Outcomes"
          title="What changed."
          className="mb-12"
        />
        <StatStrip items={project.outcomes} />
        <div className="mt-10">
          <h3 className="mb-4 text-micro uppercase text-accent-text">
            Stack
          </h3>
          <TagRow items={project.stack} />
        </div>
      </Section>

      <Section id="screens">
        <SectionHeader
          num="04"
          kicker="The system"
          title="Screens from the build."
          className="mb-12"
        />
        <ScreenshotGallery screenshots={project.gallery} />
      </Section>

      {project.demo ? (
        <Section id="demo">
          <SectionHeader
            num="05"
            kicker="Demo"
            title={project.demo.title}
            lede={project.demo.synopsis}
            className="mb-12"
          />
          <div className="rule-all">
            <VideoSlot slot={project.demo} />
          </div>
        </Section>
      ) : null}

      <Section id="related" rule={false}>
        <SectionHeader
          num={project.demo ? "06" : "05"}
          kicker="Context"
          title="Related work."
          className="mb-12"
        />

        <div className="grid grid-hairline lg:grid-cols-2">
          <div className="flex flex-col gap-5 bg-ground p-7">
            <h3 className="text-micro uppercase text-accent-text">
              Capabilities used
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              {capabilities.map((capability) => (
                <li key={capability.slug}>
                  <Link
                    href={`/what-we-build/${capability.slug}`}
                    className="flex gap-2 text-ink-dim hover:text-accent-soft"
                  >
                    <span aria-hidden="true" className="font-extrabold text-accent">
                      →
                    </span>
                    {capability.name}
                  </Link>
                </li>
              ))}
            </ul>
            {industry ? (
              <p className="text-[13px] text-ink-faint">
                Sector:{" "}
                <Link
                  href={`/industries/${industry.slug}`}
                  className="text-accent-text hover:text-accent-soft"
                >
                  {industry.name}
                </Link>
              </p>
            ) : null}
          </div>

          <Link
            href={`/work/${next.slug}`}
            className="flex flex-col bg-ground p-7 transition-colors duration-[--duration-hover] hover:bg-ground-hover"
          >
            <span className="text-micro uppercase text-accent-text">
              Next case study
            </span>
            <span className="mb-3 mt-auto text-h4 text-ink">{next.title}</span>
            <span className="text-[13px] text-ink-mute">
              {next.before} → {next.after}
            </span>
          </Link>
        </div>
      </Section>

      <CtaBanner
        headline="Recognise the problem? The conversation is 30 minutes."
        body="You describe the problem; we sketch the system. No deck, no pitch."
      />
    </>
  );
}
