"use client";

import { useState } from "react";
import { CapabilityCard } from "@/components/capabilities/CapabilityCard";
import type { Capability } from "@/lib/types";

/**
 * Single-open accordion over the catalogue grid, per the component spec.
 * Opening one card closes the other eleven, so the section never becomes a wall
 * of expanded detail.
 */
export function CapabilityCatalogue({
  capabilities,
}: {
  capabilities: Capability[];
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <ul className="grid grid-hairline grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
      {capabilities.map((capability) => (
        <CapabilityCard
          key={capability.slug}
          capability={capability}
          open={openSlug === capability.slug}
          onToggle={() =>
            setOpenSlug((current) =>
              current === capability.slug ? null : capability.slug,
            )
          }
        />
      ))}
    </ul>
  );
}
