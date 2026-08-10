import { PostCard } from "@/components/blog/PostCard";
import { CtaBanner } from "@/components/patterns/CtaBanner";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPosts } from "@/lib/cms";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Journal",
  description:
    "Engineering notes from delivered work: why lighting decides a vision project, why agents need a blast radius, and why multi-tenancy is never a later problem.",
  path: "/blog",
  eyebrow: "Engineering journal",
});

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHeader
        kicker="Engineering journal"
        title="Notes from the build."
        lede="Written by the engineers who did the work, about the decisions that actually mattered — including the ones we got wrong first."
      />

      <ul className="grid grid-hairline border-x-0 border-t-0 lg:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug} className="flex flex-col">
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      <CtaBanner
        headline="Have a problem that would make a good post?"
        body="Those are the ones we most want to hear about."
      />
    </>
  );
}
