import type { MetadataRoute } from "next";
import {
  capabilitySlugs,
  industrySlugs,
  postSlugs,
  projectSlugs,
} from "@/lib/cms";
import { posts } from "@/lib/content/posts";
import { site } from "@/lib/site";

/**
 * Sitemap generated from the content layer, so a new capability, industry,
 * case study or post is listed without anyone remembering to add it here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    { path: "/what-we-build", changeFrequency: "monthly", priority: 0.9 },
    { path: "/industries", changeFrequency: "monthly", priority: 0.8 },
    { path: "/work", changeFrequency: "monthly", priority: 0.8 },
    { path: "/stack", changeFrequency: "yearly", priority: 0.6 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.9 },
  ].map(({ path, changeFrequency, priority }) => ({
    url: url(path),
    lastModified: now,
    // Narrowed at the boundary: a bare object literal in an array widens
    // `changeFrequency` to `string`, which the Sitemap type rejects.
    changeFrequency: changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority,
  }));

  const capabilityRoutes: MetadataRoute.Sitemap = capabilitySlugs().map(
    (slug) => ({
      url: url(`/what-we-build/${slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const industryRoutes: MetadataRoute.Sitemap = industrySlugs().map((slug) => ({
    url: url(`/industries/${slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projectSlugs().map((slug) => ({
    url: url(`/work/${slug}`),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = postSlugs().map((slug) => {
    const post = posts.find((entry) => entry.slug === slug);
    return {
      url: url(`/blog/${slug}`),
      // Real publication date, not the build time — it is the honest signal.
      lastModified: post ? new Date(post.date) : now,
      changeFrequency: "yearly",
      priority: 0.6,
    };
  });

  return [
    ...staticRoutes,
    ...capabilityRoutes,
    ...industryRoutes,
    ...projectRoutes,
    ...postRoutes,
  ];
}
