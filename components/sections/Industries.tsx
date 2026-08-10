"use client";

import Link from "next/link";
import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatStrip } from "@/components/ui/StatPair";
import { homeSection } from "@/lib/site";
import type { Industry } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Master/detail selector over the ten sectors. Under 1024px the two panes stack,
 * per section 6 of the spec.
 *
 * The list is a tablist rather than a set of links: it swaps a panel in place
 * rather than navigating, and the industry's own page is reachable from the
 * panel itself.
 */
export function Industries({ industries }: { industries: Industry[] }) {
  const { id, num, label } = homeSection("industries");
  const [activeIndex, setActiveIndex] = useState(0);
  const active = industries[activeIndex];

  return (
    <Section id={id}>
      <SectionHeader
        num={num}
        kicker={label}
        title="Where the software lands."
        className="mb-12"
      />

      <div className="grid items-start gap-12 lg:grid-cols-[minmax(220px,380px)_1fr]">
        {/* Master */}
        <div
          role="tablist"
          aria-label="Industries"
          aria-orientation="vertical"
          className="flex flex-col rule-t"
        >
          {industries.map((industry, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={industry.slug}
                type="button"
                role="tab"
                id={`industry-tab-${industry.slug}`}
                aria-selected={selected}
                aria-controls="industry-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => {
                  // Roving tabindex: arrows move selection, as a tablist should.
                  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                    event.preventDefault();
                    setActiveIndex((index + 1) % industries.length);
                  }
                  if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                    event.preventDefault();
                    setActiveIndex(
                      (index - 1 + industries.length) % industries.length,
                    );
                  }
                }}
                className={cn(
                  "flex min-h-[52px] cursor-pointer items-baseline gap-4 border-b border-hairline px-2 py-[14px] text-left transition-colors duration-[--duration-hover]",
                  selected
                    ? "bg-accent text-ground"
                    : "text-ink-soft hover:bg-ground-hover",
                )}
              >
                <span
                  className={cn(
                    "w-6 text-[11px]",
                    selected ? "text-ground" : "text-ink-faint",
                  )}
                >
                  {industry.num}
                </span>
                <span className="text-[19px] font-extrabold tracking-[-0.01em]">
                  {industry.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div
          id="industry-panel"
          role="tabpanel"
          aria-labelledby={`industry-tab-${active.slug}`}
          className="flex min-h-[420px] flex-col rule-all p-9"
        >
          <p className="mb-2 text-micro uppercase text-accent-text">
            Selected industry
          </p>
          <h3 className="text-h3">{active.name}</h3>
          <p className="mt-3 max-w-[560px] text-[15px] text-ink-mute">
            {active.blurb}
          </p>

          <StatStrip items={active.outcomes} className="mt-7" />

          <div className="mt-7">
            <p className="mb-3 text-micro uppercase text-accent-text">
              What we build here
            </p>
            <ul className="grid grid-hairline-inner grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
              {active.solutions.map((solution) => (
                <li key={solution} className="bg-ground p-4 text-sm">
                  <span aria-hidden="true" className="font-extrabold text-accent">
                    →{" "}
                  </span>
                  {solution}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={`/industries/${active.slug}`}
            className="mt-auto pt-8 text-[13px] font-extrabold text-accent-text hover:text-accent-soft"
          >
            {active.name} in depth →
          </Link>
        </div>
      </div>
    </Section>
  );
}
