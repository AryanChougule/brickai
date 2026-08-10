/**
 * Shared content types. The content layer in `lib/content` is the single
 * source of truth for copy; every route reads from it through `lib/cms`,
 * so swapping in a real CMS later means reimplementing that adapter only.
 */

/**
 * A reserved location for an image.
 *
 * `src` is filled in by `lib/media/resolve` from the asset manifest and any
 * admin overrides; a slot with no resolved `src` renders its labelled
 * placeholder instead. Content files never set `src` themselves.
 */
export interface MediaSlot {
  /** Stable id — the key used by the manifest, the admin and the placeholder. */
  id: string;
  caption: string;
  /** CSS aspect-ratio value, e.g. "16 / 10". */
  aspect?: string;
  /** Resolved public path. Set by the resolver, not by content. */
  src?: string;
  /** Resolved alt text, describing what the photograph actually shows. */
  alt?: string;
}

/** A reserved location for a demo video, resolved the same way as MediaSlot. */
export interface VideoSlot {
  id: string;
  title: string;
  /** Human-readable runtime, e.g. "2:40". */
  duration: string;
  synopsis: string;
  /** Resolved public path to an .mp4. Set by the resolver. */
  src?: string;
  /** Resolved poster image path. */
  poster?: string;
}

/** One tier of an architecture diagram, rendered as procedural SVG. */
export interface ArchitectureLayer {
  title: string;
  caption: string;
  nodes: string[];
  /** Marks the tier where model inference happens, so it can be accented. */
  accent?: boolean;
}

export interface Architecture {
  title: string;
  description: string;
  layers: ArchitectureLayer[];
}

/** A single before/after ROI row. */
export interface RoiMetric {
  label: string;
  before: string;
  after: string;
  note?: string;
}

export interface Roi {
  headline: string;
  payback: string;
  metrics: RoiMetric[];
}

/** Catalogue entry — the twelve system categories we build. */
export interface Capability {
  slug: string;
  /** Two-digit catalogue number, e.g. "01". */
  num: string;
  name: string;
  /** One line, used on the card face. */
  tagline: string;
  /** Two sentences, used on the detail page hero. */
  summary: string;
  problems: string[];
  useCases: string[];
  /** Industry slugs this capability most often lands in. */
  industries: string[];
  technologies: string[];
  /** Headline outcome, e.g. "60–80% of tier-1 tickets deflected". */
  impact: string;
  /** react-icons identifier, resolved in components/icons. */
  icon: string;
}

/** Deep-dive content for a capability's own page. */
export interface CapabilityDetail {
  slug: string;
  architecture: Architecture;
  roi: Roi;
  screenshots: MediaSlot[];
  demo: VideoSlot;
  cta: {
    headline: string;
    body: string;
    action: string;
  };
  faqs: Array<{ question: string; answer: string }>;
}

export interface Industry {
  slug: string;
  num: string;
  name: string;
  /** One line for the master/detail panel. */
  blurb: string;
  /** Long-form opener for the industry page. */
  narrative: string;
  /** Header photograph, resolved by the CMS adapter from `industry-<slug>`. */
  image?: MediaSlot;
  solutions: string[];
  outcomes: Array<{ label: string; value: string }>;
  /** Capability slugs, ordered by how often they apply here. */
  capabilities: string[];
  /** Constraints that shape every build in this sector. */
  constraints: string[];
}

export interface Project {
  slug: string;
  title: string;
  client: string;
  year: string;
  tags: string[];
  /** Card-level description. */
  description: string;
  /** Before/after stat pair shown on the card. */
  before: string;
  after: string;
  /** Label for the card's media placeholder. */
  media: string;
  /** Card photograph, resolved by the CMS adapter from `work-<slug>`. */
  cardImage?: MediaSlot;
  industry: string;
  capabilities: string[];
  featured: boolean;
  /** Long-form case-study body. */
  challenge: string;
  approach: Array<{ title: string; body: string }>;
  outcomes: Array<{ label: string; value: string }>;
  stack: string[];
  gallery: MediaSlot[];
  demo?: VideoSlot;
}

export interface Phase {
  num: string;
  name: string;
  description: string;
  deliverables: string[];
  /** Typical elapsed time, e.g. "1–2 weeks". */
  duration: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Case-study slug this quote refers to, for cross-linking. */
  project?: string;
  /**
   * True until a real, attributable client has approved this wording.
   *
   * A sample renders with a visible "sample" marker and is excluded from
   * review structured data. Publishing an unapproved quote as a genuine
   * endorsement is a fabricated review — this flag is what stops that
   * happening by accident, so do not default it to false in bulk.
   */
  sample: boolean;
}

export type TechGroup =
  | "languages"
  | "ai"
  | "frontend"
  | "data"
  | "infra"
  | "vision";

export interface TechNode {
  id: string;
  label: string;
  group: TechGroup;
  /** Hubs render as filled accent chips and sit higher in the layout. */
  hub?: boolean;
  blurb: string;
  /** Capability slugs this technology serves. */
  capabilities: string[];
}

export interface TechEdge {
  from: string;
  to: string;
}

export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "list"; items: string[] }
  | { type: "code"; language: string; code: string };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date. */
  date: string;
  readingTime: string;
  author: { name: string; role: string };
  tags: string[];
  body: PostBlock[];
}
