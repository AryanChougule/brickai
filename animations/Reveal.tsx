"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const VARIANTS: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0 },
};

const TRANSITION = { duration: 0.9, ease: [0.16, 1, 0.3, 1] } as const;

/** The element types content reveals actually need. */
const MOTION = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
  section: motion.section,
} as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset in seconds, for sibling reveals. */
  delay?: number;
  as?: keyof typeof MOTION;
}

/**
 * Fade-up on first scroll into view — the only entrance animation used on
 * content. Matches the hero's 900ms fade-up so the page reads as one system.
 *
 * Under reduced motion the children render in their final state, with no
 * wrapper transform and no observer attached.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const reduced = usePrefersReducedMotion();
  const Component = MOTION[as];

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      // Marks the element for the no-JS override in the root layout: server
      // HTML carries the hidden initial state, so without this a visitor with
      // JavaScript disabled would get a page of invisible sections.
      data-reveal=""
      className={className}
      variants={VARIANTS}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ ...TRANSITION, delay }}
    >
      {children}
    </Component>
  );
}

/**
 * Reveals a list with a fixed stagger, so callers do not compute per-item
 * delays at the call site.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.06,
  as = "div",
}: {
  children: ReactNode[];
  className?: string;
  stagger?: number;
  as?: keyof typeof MOTION;
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <Reveal key={index} delay={index * stagger} as={as}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
