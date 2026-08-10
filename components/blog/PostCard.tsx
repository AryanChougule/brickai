import Link from "next/link";
import { TagRow } from "@/components/ui/Tag";
import type { Post } from "@/lib/types";
import { formatDateShort } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="flex flex-col bg-ground">
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full flex-col p-8 transition-colors duration-[--duration-hover] hover:bg-ground-hover"
      >
        <div className="flex items-center gap-4 text-micro uppercase text-ink-faint">
          <time dateTime={post.date}>{formatDateShort(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
        </div>

        <h2 className="mb-3 mt-6 max-w-[34ch] text-h4 text-ink">{post.title}</h2>
        <p className="max-w-[52ch] text-[15px] text-ink-mute">{post.excerpt}</p>

        <div className="mt-auto pt-8">
          <TagRow items={post.tags} />
        </div>
      </Link>
    </article>
  );
}
