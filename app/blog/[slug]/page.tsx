import { notFound } from "next/navigation";
import { PostBody } from "@/components/blog/PostBody";
import { PostCard } from "@/components/blog/PostCard";
import { CtaBanner } from "@/components/patterns/CtaBanner";
import { Kicker } from "@/components/ui/Kicker";
import { Section } from "@/components/ui/Section";
import { TagRow } from "@/components/ui/Tag";
import { getPostPage, postSlugs } from "@/lib/cms";
import { absoluteUrl, pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return postSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPostPage(slug);
  if (!page) return {};

  return pageMetadata({
    title: page.post.title,
    description: page.post.excerpt,
    path: `/blog/${slug}`,
    eyebrow: "Journal",
    type: "article",
    publishedTime: page.post.date,
    tags: [...page.post.tags],
  });
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPostPage(slug);
  if (!page) notFound();

  const { post, more } = page;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <article>
        <header className="px-page rule-b pb-14 pt-[calc(var(--nav-h)+var(--section-pt))]">
          <Kicker>Journal</Kicker>
          <h1 className="mt-4 max-w-[24ch] text-poster">{post.title}</h1>

          <div className="mt-8 flex flex-wrap items-center gap-5 text-[13px] text-ink-faint">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
            <span aria-hidden="true">·</span>
            <span>
              {post.author.name}, {post.author.role}
            </span>
          </div>

          <TagRow items={post.tags} className="mt-6" />
        </header>

        <Section id="post" rule={false}>
          <p className="mb-10 max-w-[62ch] text-xl leading-relaxed text-ink">
            {post.excerpt}
          </p>
          <PostBody blocks={post.body} />
        </Section>
      </article>

      {more.length > 0 ? (
        <Section id="more" rule={false}>
          <Kicker>More from the journal</Kicker>
          <ul className="mt-8 grid grid-hairline lg:grid-cols-2">
            {more.map((entry) => (
              <li key={entry.slug} className="flex flex-col">
                <PostCard post={entry} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CtaBanner
        headline="Working on something this applies to?"
        body="A 30-minute discovery call. You describe the problem; we sketch the system."
      />

      <script
        type="application/ld+json"
        // Built from local content only; no external input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  );
}
