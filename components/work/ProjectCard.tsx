import Link from "next/link";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { StatPair } from "@/components/ui/StatPair";
import { TagRow } from "@/components/ui/Tag";
import type { MediaSlot, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Case-study card: copy on the left, media well on the right, with the
 * before/after pair anchored to the bottom of the copy column.
 *
 * The media well is a wire-grid placeholder with an accent scan line that sweeps
 * on hover — motion that belongs to the card rather than to the page, so it
 * never competes with scroll.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className={cn(
        "group grid min-h-[420px] bg-ground transition-colors duration-[--duration-hover]",
        "hover:bg-ground-hover-soft lg:grid-cols-2",
      )}
    >
      <div className="flex flex-col p-10">
        <TagRow items={project.tags} className="mb-5" />

        <h3 className="text-h3">
          <Link
            href={`/work/${project.slug}`}
            className="text-ink hover:text-accent-soft"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-3 max-w-[480px] text-[15px] text-ink-mute">
          {project.description}
        </p>

        <p className="mt-4 text-[13px] text-ink-faint">
          {project.client} · {project.year}
        </p>

        <StatPair
          before={project.before}
          after={project.after}
          className="mt-auto pt-6"
        />
      </div>

      <MediaWell label={project.media} image={project.cardImage} />
    </article>
  );
}

function MediaWell({
  label,
  image,
}: {
  label: string;
  image?: MediaSlot;
}) {
  return (
    <div className="relative flex items-center justify-center overflow-hidden bg-ground-deep lg:rule-l">
      {image?.src ? (
        <ImageSlot
          slot={image}
          grayscale
          className="absolute inset-0 h-full"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      ) : (
        <>
          <div className="absolute inset-0 wire-grid" aria-hidden="true" />
          <p className="relative border border-dashed border-edge px-9 py-7 text-center text-kicker uppercase text-ink-ghost">
            {label}
            <span className="mt-1 block text-micro uppercase text-ink-vapor">
              image / video placeholder
            </span>
          </p>
        </>
      )}

      {/* Scan line. Removed under reduced motion by the global rule. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-accent-wash), transparent)",
          animation: "sweep 2.4s linear infinite",
        }}
      />
    </div>
  );
}
