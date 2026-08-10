import type { PostBlock } from "@/lib/types";

/**
 * Renders a post from structured blocks rather than a markup string.
 *
 * Nothing here uses `dangerouslySetInnerHTML`, so a CMS-authored post can never
 * inject markup into the page — the block type decides the element, and the
 * text is always escaped by React.
 */
export function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="mt-6 max-w-[36ch] text-h4 text-ink">{block.text}</h2>
      );

    case "paragraph":
      return (
        <p className="max-w-[68ch] text-base leading-relaxed text-ink-dim">
          {block.text}
        </p>
      );

    case "quote":
      return (
        <blockquote className="max-w-[56ch] border-l-2 border-accent pl-6 text-xl font-extrabold tracking-[-0.01em] text-accent-soft">
          {block.text}
          {block.attribution ? (
            <footer className="mt-3 text-[13px] font-normal text-ink-faint">
              — {block.attribution}
            </footer>
          ) : null}
        </blockquote>
      );

    case "list":
      return (
        <ul className="flex max-w-[68ch] flex-col gap-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-base text-ink-dim">
              <span aria-hidden="true" className="font-extrabold text-accent">
                →
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "code":
      return (
        <figure className="max-w-[80ch] overflow-x-auto rule-all bg-ground-graph">
          <figcaption className="border-b border-hairline px-5 py-3 text-micro uppercase text-ink-faint">
            {block.language}
          </figcaption>
          <pre className="overflow-x-auto p-5 text-[12.5px] leading-relaxed">
            <code>{block.code}</code>
          </pre>
        </figure>
      );
  }
}
