import type { Metadata } from "next";
import { site } from "@/lib/site";

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}

/** OG image route for a given title/eyebrow pair. */
export function ogImage(params: { title: string; eyebrow?: string }) {
  const search = new URLSearchParams({ title: params.title });
  if (params.eyebrow) search.set("eyebrow", params.eyebrow);
  return `/api/og?${search.toString()}`;
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  /** Kicker rendered above the title on the generated OG image. */
  eyebrow?: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
}

/**
 * Per-route metadata. Keeps canonical URLs, OG and Twitter cards consistent so
 * no route has to remember the full shape.
 */
export function pageMetadata({
  title,
  description,
  path,
  eyebrow,
  type = "website",
  publishedTime,
  tags,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const image = ogImage({ title, eyebrow });

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: `${title} — ${site.name}`,
      description,
      siteName: site.name,
      locale: site.locale,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(tags ? { tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.name}`,
      description,
      images: [image],
    },
  };
}

/** Organisation JSON-LD, emitted once from the root layout. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.contact.email,
    telephone: site.contact.phone,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      name: site.contact.name,
      email: site.contact.email,
      telephone: site.contact.phone,
    },
    foundingDate: site.founded,
    slogan: site.tagline,
    knowsAbout: [
      "Artificial intelligence",
      "Computer vision",
      "Industrial automation",
      "Agentic AI",
      "Data platforms",
      "Custom software engineering",
    ],
  };
}
