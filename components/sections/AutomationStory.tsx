"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCell } from "@/components/ui/StatPair";
import { VideoSlot } from "@/components/ui/VideoSlot";
import { automationStats } from "@/lib/content/process";
import { homeSection } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import type { MediaSlot, VideoSlot as VideoSlotData } from "@/lib/types";

interface AutomationStage {
  num: string;
  name: string;
  body: string;
  meta: string;
  slot: MediaSlot;
}

/**
 * The industrial-automation narrative — one loop, three stages.
 *
 * Scroll storytelling via a sticky rail rather than a pinned, scroll-jacked
 * section: the page scrolls at its own speed and GSAP only *reads* the position
 * to advance the active stage. The spec rules out scroll-jacking anywhere.
 *
 * Stages and the walkthrough video arrive as props because this is a client
 * component and their media is resolved on the server.
 */
export function AutomationStory({
  stages: automationStages,
  walkthrough,
}: {
  stages: AutomationStage[];
  walkthrough: VideoSlotData;
}) {
  const { id, num, label } = homeSection("automation");
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const stages = gsap.utils.toArray<HTMLElement>("[data-stage]", root);

      stages.forEach((stage, index) => {
        ScrollTrigger.create({
          trigger: stage,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: ({ isActive }) => {
            if (isActive) setActive(index);
          },
        });

        // Each stage's copy and media arrive together, once.
        gsap.from(stage.querySelectorAll("[data-stage-item]"), {
          opacity: 0,
          y: 28,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: stage, start: "top 78%", once: true },
        });
      });

      // The rail fills in proportion to progress through the whole sequence.
      if (railRef.current) {
        gsap.fromTo(
          railRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: root,
              start: "top 60%",
              end: "bottom 70%",
              scrub: 0.4,
            },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <Section id={id} rhythm={false} gutter={false}>
      <div className="px-page section-pt">
        <SectionHeader
          num={num}
          kicker={label}
          title="The factory that watches itself."
          lede="How an automated plant actually works — one loop, three stages. Every system we ship on a factory floor is some version of it."
        />
      </div>

      <div
        ref={rootRef}
        className="mt-14 grid items-start rule-t lg:grid-cols-[minmax(240px,340px)_1fr]"
      >
        {/* Sticky rail: which stage you are in */}
        <div className="sticky top-[calc(var(--nav-h)+32px)] hidden px-page py-12 lg:block lg:rule-r">
          <p className="mb-6 text-micro uppercase text-accent-text">
            The loop
          </p>
          <ol className="relative flex flex-col gap-6 pl-6">
            {/* Track, plus the scrubbed fill on top of it */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-1 h-[calc(100%-8px)] w-[2px] bg-hairline"
            />
            <span
              ref={railRef}
              aria-hidden="true"
              className="absolute left-0 top-1 h-[calc(100%-8px)] w-[2px] origin-top bg-accent"
            />
            {automationStages.map((stage, index) => (
              <li
                key={stage.name}
                aria-current={index === active ? "step" : undefined}
                className={cn(
                  "transition-colors duration-200",
                  index === active ? "text-ink" : "text-ink-faint",
                )}
              >
                <span className="block text-[11px] tracking-[0.12em]">
                  {stage.num}
                </span>
                <span className="text-2xl font-extrabold tracking-[-0.02em]">
                  {stage.name}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* The three stages */}
        <div className="flex flex-col">
          {automationStages.map((stage, index) => (
            <article
              key={stage.name}
              data-stage
              className={cn(
                "flex flex-col px-page py-12",
                index > 0 && "rule-t",
              )}
            >
              <div data-stage-item className="flex items-baseline gap-4">
                <span className="text-[56px] font-extrabold leading-none tracking-[-0.03em] text-accent">
                  {stage.num}
                </span>
                <h3 className="text-h3">{stage.name}</h3>
              </div>

              <p
                data-stage-item
                className="mt-4 max-w-[560px] text-[15px] text-ink-dim"
              >
                {stage.body}
              </p>
              <p data-stage-item className="mt-2 text-[13px] text-ink-faint">
                {stage.meta}
              </p>

              <div data-stage-item className="mt-6 max-w-[720px]">
                <ImageSlot
                  slot={stage.slot}
                  grayscale
                  /* The registry decides: only vision slots have boxes, so
                     Predict and Act pass through untouched. */
                  annotate
                  className="border border-divider"
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* The loop, running */}
      <div className="grid rule-t lg:grid-cols-[minmax(280px,1fr)_1.6fr]">
        <div className="flex flex-col px-page py-12 lg:rule-r">
          <p className="text-micro uppercase text-accent-text">Outcome</p>
          <p className="mt-4 max-w-[420px] text-[15px] text-ink-dim">
            Across the rollouts we have delivered, the loop moves two numbers
            that plant managers are measured on.
          </p>
          <div className="mt-auto grid grid-cols-2 grid-hairline-inner pt-8">
            {automationStats.map((stat) => (
              <StatCell
                key={stat.label}
                label={stat.label}
                value={stat.value}
                accent={stat.accent}
              />
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px] bg-ground-deep">
          <VideoSlot slot={walkthrough} fill />
        </div>
      </div>
    </Section>
  );
}
