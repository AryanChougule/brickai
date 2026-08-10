/**
 * Content adapter. Routes never import from `lib/content` directly — they call
 * these accessors, so replacing the local files with a real CMS means
 * reimplementing this module and nothing else.
 *
 * Accessors are synchronous today. They are also all `async` so that a network-
 * backed implementation is a drop-in: every caller already awaits.
 */
import { readOverrides } from "@/lib/cms/overrides";
import { capabilities } from "@/lib/content/capabilities";
import { capabilityDetails } from "@/lib/content/capability-details";
import { industries } from "@/lib/content/industries";
import { posts, sortedPosts } from "@/lib/content/posts";
import { projects } from "@/lib/content/projects";
import { automationStages, phases } from "@/lib/content/process";
import { techEdges, techNodes } from "@/lib/content/tech-graph";
import { testimonials } from "@/lib/content/testimonials";
import {
  resolveMediaSlot,
  resolveMediaSlots,
  resolveVideoSlot,
} from "@/lib/media/resolve";
import type {
  Capability,
  CapabilityDetail,
  Industry,
  MediaSlot,
  Phase,
  Post,
  Project,
  TechEdge,
  TechNode,
  Testimonial,
  VideoSlot,
} from "@/lib/types";

/* — capabilities ————————————————————————————————————————————————————— */

export async function getCapabilities(): Promise<Capability[]> {
  return capabilities;
}

export async function getCapability(
  slug: string,
): Promise<Capability | undefined> {
  return capabilities.find((capability) => capability.slug === slug);
}

/** Catalogue entry plus its deep-dive content, or undefined if the slug is unknown. */
export async function getCapabilityPage(slug: string): Promise<
  | {
      capability: Capability;
      detail: CapabilityDetail;
      related: Capability[];
      industries: Industry[];
    }
  | undefined
> {
  const capability = capabilities.find((entry) => entry.slug === slug);
  if (!capability) return undefined;

  const detail = capabilityDetails[slug];
  if (!detail) {
    // A catalogue entry without deep-dive content is an authoring mistake, not
    // a 404 — fail loudly in development rather than rendering a hollow page.
    throw new Error(`Capability "${slug}" has no entry in capabilityDetails.`);
  }

  const { media } = await readOverrides();

  return {
    capability,
    detail: {
      ...detail,
      screenshots: resolveMediaSlots(detail.screenshots, media),
      demo: resolveVideoSlot(detail.demo, media),
    },
    related: relatedCapabilities(capability),
    industries: industries.filter((industry) =>
      capability.industries.includes(industry.slug),
    ),
  };
}

/** Capabilities that share an industry, nearest first, excluding the subject. */
function relatedCapabilities(subject: Capability): Capability[] {
  return capabilities
    .filter((candidate) => candidate.slug !== subject.slug)
    .map((candidate) => ({
      candidate,
      overlap: candidate.industries.filter((industry) =>
        subject.industries.includes(industry),
      ).length,
    }))
    .filter((entry) => entry.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3)
    .map((entry) => entry.candidate);
}

/* — media attachment ————————————————————————————————————————————————
   Photographs are attached to industries and projects by convention: the slot
   id is `industry-<slug>` or `work-<slug>`. Content files therefore never name
   an image, and adding one is a manifest entry plus `npm run media`. */

function withIndustryImage(
  industry: Industry,
  media: Awaited<ReturnType<typeof readOverrides>>["media"],
): Industry {
  return {
    ...industry,
    image: resolveMediaSlot(
      {
        id: `industry-${industry.slug}`,
        caption: `${industry.name} — sector context`,
        aspect: "21 / 9",
      },
      media,
    ),
  };
}

function withProjectMedia(
  project: Project,
  media: Awaited<ReturnType<typeof readOverrides>>["media"],
): Project {
  return {
    ...project,
    cardImage: resolveMediaSlot(
      { id: `work-${project.slug}`, caption: project.media, aspect: "4 / 3" },
      media,
    ),
    gallery: resolveMediaSlots(project.gallery, media),
    demo: project.demo ? resolveVideoSlot(project.demo, media) : undefined,
  };
}

/* — industries ——————————————————————————————————————————————————————— */

export async function getIndustries(): Promise<Industry[]> {
  const { media } = await readOverrides();
  return industries.map((industry) => withIndustryImage(industry, media));
}

export async function getIndustryPage(slug: string): Promise<
  | {
      industry: Industry;
      capabilities: Capability[];
      projects: Project[];
    }
  | undefined
> {
  const industry = industries.find((entry) => entry.slug === slug);
  if (!industry) return undefined;

  const { media } = await readOverrides();

  return {
    industry: withIndustryImage(industry, media),
    capabilities: industry.capabilities
      .map((capabilitySlug) =>
        capabilities.find((entry) => entry.slug === capabilitySlug),
      )
      .filter((entry): entry is Capability => Boolean(entry)),
    projects: projects
      .filter((project) => project.industry === slug)
      .map((project) => withProjectMedia(project, media)),
  };
}

/* — projects ————————————————————————————————————————————————————————— */

export async function getProjects(): Promise<Project[]> {
  const { media } = await readOverrides();
  return projects.map((project) => withProjectMedia(project, media));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const { media } = await readOverrides();
  return projects
    .filter((project) => project.featured)
    .map((project) => withProjectMedia(project, media));
}

export async function getProjectPage(slug: string): Promise<
  | {
      project: Project;
      capabilities: Capability[];
      industry: Industry | undefined;
      next: Project;
    }
  | undefined
> {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return undefined;

  const { media } = await readOverrides();
  const project = projects[index];

  return {
    project: withProjectMedia(project, media),
    capabilities: project.capabilities
      .map((capabilitySlug) =>
        capabilities.find((entry) => entry.slug === capabilitySlug),
      )
      .filter((entry): entry is Capability => Boolean(entry)),
    industry: industries.find((entry) => entry.slug === project.industry),
    next: withProjectMedia(projects[(index + 1) % projects.length], media),
  };
}

/* — journal —————————————————————————————————————————————————————————— */

export async function getPosts(): Promise<Post[]> {
  return sortedPosts;
}

export async function getPostPage(slug: string): Promise<
  | {
      post: Post;
      more: Post[];
    }
  | undefined
> {
  const post = posts.find((entry) => entry.slug === slug);
  if (!post) return undefined;

  return {
    post,
    more: sortedPosts.filter((entry) => entry.slug !== slug).slice(0, 2),
  };
}

/* — supporting content ——————————————————————————————————————————————— */

export async function getPhases(): Promise<Phase[]> {
  return phases;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const overrides = await readOverrides();
  return overrides.testimonials ?? testimonials;
}

/**
 * The See / Predict / Act sequence, with its photographs resolved. Returned
 * from here rather than imported directly by the section, because the section
 * is a client component and overrides can only be read on the server.
 */
export async function getAutomationStages(): Promise<
  Array<{
    num: string;
    name: string;
    body: string;
    meta: string;
    slot: MediaSlot;
  }>
> {
  const { media } = await readOverrides();
  return automationStages.map((stage) => ({
    ...stage,
    slot: resolveMediaSlot({ ...stage.slot }, media),
  }));
}

/** The plant walkthrough video that closes the automation section. */
export async function getWalkthroughVideo(): Promise<VideoSlot> {
  const { media } = await readOverrides();
  return resolveVideoSlot(
    {
      id: "auto-walkthrough",
      title: "Watch the loop run",
      duration: "2:40",
      synopsis:
        "A plant walkthrough of one line running the whole loop: inspection at speed, a bearing flagged four days out, and the work order raised without a meeting.",
    },
    media,
  );
}

export async function getTechGraph(): Promise<{
  nodes: TechNode[];
  edges: TechEdge[];
}> {
  return { nodes: techNodes, edges: techEdges };
}

/* — static params ————————————————————————————————————————————————————
   Used by generateStaticParams so every content route prerenders. */

export function capabilitySlugs(): string[] {
  return capabilities.map((capability) => capability.slug);
}

export function industrySlugs(): string[] {
  return industries.map((industry) => industry.slug);
}

export function projectSlugs(): string[] {
  return projects.map((project) => project.slug);
}

export function postSlugs(): string[] {
  return posts.map((post) => post.slug);
}
