import Link from "next/link";
import { CapabilityIcon } from "@/components/icons/CapabilityIcon";
import type { Capability } from "@/lib/types";

/** Capabilities that share an industry with the one being viewed. */
export function RelatedCapabilities({
  capabilities,
}: {
  capabilities: Capability[];
}) {
  if (capabilities.length === 0) return null;

  return (
    <ul className="grid grid-hairline grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
      {capabilities.map((capability) => (
        <li key={capability.slug} className="bg-ground">
          <Link
            href={`/what-we-build/${capability.slug}`}
            className="flex h-full min-h-[160px] flex-col p-6 transition-colors duration-[--duration-hover] hover:bg-ground-hover"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] tracking-[0.12em] text-ink-faint">
                {capability.num}
              </span>
              <CapabilityIcon
                name={capability.icon}
                className="text-ink-faint"
              />
            </div>
            <h3 className="mb-2 mt-auto text-xl font-extrabold tracking-[-0.02em] text-ink">
              {capability.name}
            </h3>
            <p className="text-[13px] text-ink-mute">{capability.tagline}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
