/** Site-wide constants. Anything that appears in more than one route lives here. */

export const site = {
  name: "BrickAI",
  /** Rendered as BRICK + AI, the second half in accent. */
  wordmark: ["BRICK", "AI"] as const,
  tagline: "We solve complex business problems with software.",
  description:
    "BrickAI engineers AI systems, industrial automation and custom software. Build AI. Automate business. Transform industries.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://brickai.com",
  locale: "en_US",
  founded: "2026",

  /**
   * Who an enquiry actually reaches. Kept as one object so the contact page,
   * the form's failure message and the JSON-LD cannot drift apart.
   */
  contact: {
    name: "Aryan Chougule",
    email: "aryanchougule4747@gmail.com",
    /** Display form, with spacing for readability. */
    phone: "+91 9373447919",
    /** Dial form — `tel:` needs no spaces to work reliably on mobile. */
    phoneHref: "tel:+919373447919",
  },

  cta: {
    label: "Book discovery call",
    href: "/contact",
  },
} as const;

/** Shorthand — used wherever only the address is needed. */
export const contactEmail = site.contact.email;

/** Primary navigation, in spec order. */
export const navLinks = [
  { label: "What we build", href: "/what-we-build" },
  { label: "Industries", href: "/industries" },
  { label: "Work", href: "/work" },
  { label: "Stack", href: "/stack" },
  { label: "Process", href: "/#process" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/#about" },
] as const;

export const footerLinks = [
  { label: "Capabilities", href: "/what-we-build" },
  { label: "Industries", href: "/industries" },
  { label: "Case studies", href: "/work" },
  { label: "Technology", href: "/stack" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Section numbering on the home page. The kicker for each section reads
 * "NN — Label", and the numbers must stay contiguous.
 */
export const homeSections = [
  { id: "build", num: "01", label: "What we build" },
  { id: "automation", num: "02", label: "Industrial automation" },
  { id: "industries", num: "03", label: "Solutions by industry" },
  { id: "work", num: "04", label: "Featured projects" },
  { id: "stack", num: "05", label: "Technology stack" },
  { id: "process", num: "06", label: "Development process" },
  { id: "testimonials", num: "07", label: "What clients say" },
  { id: "about", num: "08", label: "About BrickAI" },
  { id: "contact", num: "09", label: "Contact" },
] as const;

export type HomeSectionId = (typeof homeSections)[number]["id"];

export function homeSection(id: HomeSectionId) {
  const section = homeSections.find((s) => s.id === id);
  if (!section) throw new Error(`Unknown home section: ${id}`);
  return section;
}
