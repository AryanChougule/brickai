"use client";

import { useState } from "react";
import { Kicker } from "@/components/ui/Kicker";
import { Section } from "@/components/ui/Section";
import { homeSection } from "@/lib/site";
import type { Testimonial } from "@/lib/types";

/**
 * Quote rotator with a controlled index. `aria-live="polite"` so the quote is
 * announced when it changes, and the buttons meet the 44px touch minimum.
 */
export function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const { id, num, label } = homeSection("testimonials");
  const [index, setIndex] = useState(0);
  const quote = testimonials[index];
  const count = testimonials.length;

  return (
    <Section id={id} ariaLabel={label}>
      <Kicker num={num}>{label}</Kicker>

      <div className="max-w-[1100px]">
        <blockquote
          aria-live="polite"
          className="my-8 min-h-[3.4em] text-quote text-ink"
        >
          <span aria-hidden="true" className="text-accent">
            “
          </span>
          {quote.quote}
          <span aria-hidden="true" className="text-accent">
            ”
          </span>
        </blockquote>

        <div className="flex flex-wrap items-center gap-5">
          <div>
            <p className="text-[15px] font-extrabold">{quote.name}</p>
            <p className="text-[13px] text-ink-mute">
              {quote.role}, {quote.company}
            </p>
            {/* Visible on the page, not just in the source: an unapproved
                quote must never read as a genuine endorsement. */}
            {quote.sample ? (
              <p className="mt-2 inline-flex border border-accent-hairline px-2 py-1 text-micro uppercase text-accent-soft">
                Sample — awaiting client approval
              </p>
            ) : null}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <p className="text-[13px] tabular-nums text-ink-faint">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </p>
            <div className="flex gap-2">
              <RotatorButton
                label="Previous testimonial"
                onClick={() => setIndex((i) => (i - 1 + count) % count)}
              >
                ←
              </RotatorButton>
              <RotatorButton
                label="Next testimonial"
                primary
                onClick={() => setIndex((i) => (i + 1) % count)}
              >
                →
              </RotatorButton>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function RotatorButton({
  label,
  primary,
  onClick,
  children,
}: {
  label: string;
  primary?: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={
        primary
          ? "h-11 w-11 cursor-pointer bg-accent text-base text-ground transition-colors duration-[--duration-hover] hover:bg-accent-hover"
          : "h-11 w-11 cursor-pointer border border-edge text-base text-ink transition-colors duration-[--duration-hover] hover:bg-[rgba(248,244,244,0.08)]"
      }
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
