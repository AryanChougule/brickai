import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchitectureDiagram } from "@/components/capabilities/ArchitectureDiagram";
import { CapabilityFaqs } from "@/components/capabilities/CapabilityFaqs";
import { RelatedCapabilities } from "@/components/capabilities/RelatedCapabilities";
import { RoiTable } from "@/components/capabilities/RoiTable";
import { ScreenshotGallery } from "@/components/capabilities/ScreenshotGallery";
import { CtaBanner } from "@/components/patterns/CtaBanner";
import { ArrowList } from "@/components/ui/FieldBlock";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TagRow } from "@/components/ui/Tag";
import { VideoSlot } from "@/components/ui/VideoSlot";
import { capabilitySlugs, getCapabilityPage } from "@/lib/cms";
import { pageMetadata } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return capabilitySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await getCapabilityPage(slug);
  if (!page) return {};

  return pageMetadata({
    title: page.capability.name,
    description: page.capability.summary,
    path: `/what-we-build/${slug}`,
    eyebrow: `Capability ${page.capability.num}`,
  });
}

export default async function CapabilityPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getCapabilityPage(slug);
  if (!page) notFound();

  const { capability, detail, related, industries } = page;

  return (
    <>
      <PageHeader
        kicker={`Capability ${capability.num} — ${capability.tagline}`}
        title={capability.name}
        lede={capability.summary}
      >
        <TagRow items={capability.technologies} tone="accent" />
      </PageHeader>

      {/* Problems, and the use cases they turn into */}
      <Section
        id="problems"
        className="grid gap-12 lg:grid-cols-[minmax(280px,1fr)_1.4fr]"
      >
        <SectionHeader
          num="01"
          kicker="The problem class"
          title="What this fixes."
          lede="If two or more of these describe your operation, this is the right category to start in."
        />
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 text-micro uppercase text-accent-text">
              Problems solved
            </h3>
            <ArrowList items={capability.problems} className="text-sm text-ink-dim" />
          </div>
          <div>
            <h3 className="mb-4 text-micro uppercase text-accent-text">
              Example use cases
            </h3>
            <ArrowList items={capability.useCases} className="text-sm text-ink-dim" />
          </div>
        </div>
      </Section>

      {/* Architecture */}
      <Section id="architecture">
        <SectionHeader
          num="02"
          kicker="Architecture"
          title={detail.architecture.title}
          className="mb-12"
        />
        <ArchitectureDiagram architecture={detail.architecture} />
      </Section>

      {/* Screenshots */}
      <Section id="screenshots">
        <SectionHeader
          num="03"
          kicker="What it looks like"
          title="Example screens."
          lede="Interfaces from delivered work in this category. Client-identifying detail is removed before publication."
          className="mb-12"
        />
        <ScreenshotGallery screenshots={detail.screenshots} />
      </Section>

      {/* ROI */}
      <Section id="roi">
        <SectionHeader
          num="04"
          kicker="Expected business ROI"
          title="What it returns."
          className="mb-12"
        />
        <RoiTable roi={detail.roi} />
      </Section>

      {/* Demo */}
      <Section id="demo">
        <SectionHeader
          num="05"
          kicker="Demo"
          title={detail.demo.title}
          lede={detail.demo.synopsis}
          className="mb-12"
        />
        <div className="rule-all">
          <VideoSlot slot={detail.demo} />
        </div>
      </Section>

      {/* Industries and stack */}
      <Section
        id="where"
        className="grid gap-12 lg:grid-cols-[minmax(280px,1fr)_1.4fr]"
      >
        <SectionHeader
          num="06"
          kicker="Where it lands"
          title="Industries and stack."
        />
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 text-micro uppercase text-accent-text">
              Industries
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              {industries.map((industry) => (
                <li key={industry.slug}>
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="flex gap-2 text-ink-dim hover:text-accent-soft"
                  >
                    <span aria-hidden="true" className="font-extrabold text-accent">
                      →
                    </span>
                    {industry.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-micro uppercase text-accent-text">
              Technologies
            </h3>
            <TagRow items={capability.technologies} />
            <p className="mt-4 text-[13px] text-ink-faint">
              See how these connect in the{" "}
              <Link href="/stack" className="text-accent-text hover:text-accent-soft">
                technology graph
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      {/* FAQs */}
      <Section id="questions">
        <SectionHeader
          num="07"
          kicker="Questions we get"
          title="Asked and answered."
          className="mb-12"
        />
        <CapabilityFaqs faqs={detail.faqs} />
      </Section>

      {/* Related */}
      {related.length > 0 ? (
        <Section id="related" rule={false}>
          <SectionHeader
            num="08"
            kicker="Adjacent systems"
            title="Often built alongside."
            className="mb-12"
          />
          <RelatedCapabilities capabilities={related} />
        </Section>
      ) : null}

      <CtaBanner
        headline={detail.cta.headline}
        body={detail.cta.body}
        action={detail.cta.action}
      />
    </>
  );
}
