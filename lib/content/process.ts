import type { Phase } from "@/lib/types";

/** Six phases. No black box. */
export const phases: Phase[] = [
  {
    num: "01",
    name: "Discovery",
    description:
      "We map the problem, the data, and what success is worth before writing a line.",
    duration: "1–2 weeks",
    deliverables: [
      "Problem statement signed off by the people who own it",
      "Data audit — what exists, what is missing, what it costs to get",
      "Value model with the numbers you would defend internally",
      "Go / no-go recommendation, including 'do not build this'",
    ],
  },
  {
    num: "02",
    name: "Planning",
    description:
      "Architecture, milestones and a fixed first-release scope — in writing.",
    duration: "1–2 weeks",
    deliverables: [
      "Architecture decision records for every consequential choice",
      "Fixed first-release scope with an explicit exclusion list",
      "Milestone plan with demo dates, not status dates",
      "Risk register naming the three things most likely to go wrong",
    ],
  },
  {
    num: "03",
    name: "Design",
    description:
      "Flows and interfaces prototyped with the people who will use them.",
    duration: "2–3 weeks",
    deliverables: [
      "Clickable prototype tested with real operators",
      "Design system tokens and components, handed over",
      "Exception and edge-case flows, designed rather than discovered",
      "Accessibility criteria fixed before build starts",
    ],
  },
  {
    num: "04",
    name: "Development",
    description:
      "Senior engineers, weekly demos, code you can audit from day one.",
    duration: "6–16 weeks",
    deliverables: [
      "Working software demonstrated every week, no exceptions",
      "Your repository, your cloud account, from the first commit",
      "Test suite and CI gates covering the paths that matter",
      "Written decisions when the plan changes, and it will",
    ],
  },
  {
    num: "05",
    name: "Deployment",
    description: "Staged rollout with monitoring, training and rollback plans.",
    duration: "2–4 weeks",
    deliverables: [
      "Shadow or canary deployment before anything is load-bearing",
      "Monitoring and alerting wired into your on-call",
      "Operator training delivered to the actual operators",
      "Tested rollback path — not a paragraph, a rehearsal",
    ],
  },
  {
    num: "06",
    name: "Support",
    description:
      "SLAs, model retraining and a roadmap — we operate what we build.",
    duration: "Ongoing",
    deliverables: [
      "Response and resolution SLA in the contract",
      "Model retraining cadence with drift monitoring",
      "Quarterly roadmap review against the original value model",
      "Handover documentation good enough to leave on",
    ],
  },
];

/**
 * The industrial-automation narrative: one loop, three stages. Drives the
 * pinned scroll sequence on the home page.
 */
export const automationStages = [
  {
    num: "01",
    name: "See",
    body: "Cameras over every line, models beside them. Each unit is inspected, counted and traced at production speed — no sampling, no clipboard.",
    meta: "Industrial vision · edge GPUs · 400 units/min",
    // Captions describe the photograph, not a product screen. A stock image
    // captioned as our inspection overlay would be claiming something untrue.
    slot: {
      id: "auto-see",
      caption: "A production line running at inspection speed",
      aspect: "4 / 3",
    },
  },
  {
    num: "02",
    name: "Predict",
    body: "Machine signals stream into one timeline: vibration, temperature, cycle times. The models flag the bearing that will fail on Thursday — on Monday.",
    meta: "OPC-UA · Kafka · predictive maintenance",
    slot: {
      id: "auto-predict",
      caption: "Machine signals watched from the plant control room",
      aspect: "4 / 3",
    },
  },
  {
    num: "03",
    name: "Act",
    body: "The loop closes without a meeting: work orders raised, parts reserved, the line rebalanced. People handle the exceptions — the system handles the routine.",
    meta: "Agentic AI · ERP/MES integration · human sign-off on exceptions",
    slot: {
      id: "auto-act",
      caption: "Parts and stock moving on the floor after the call is made",
      aspect: "4 / 3",
    },
  },
] as const;

/** Stat pair shown under the Act stage. */
export const automationStats = [
  { label: "Unplanned downtime", value: "−38%", accent: false },
  { label: "Defect escape", value: "0.2%", accent: true },
] as const;

/** About quadrants. */
export const aboutPillars = [
  {
    title: "Mission",
    body: "Turn hard business problems into dependable software systems — and stay accountable for the outcome.",
  },
  {
    title: "Vision",
    body: "Every operation — from the factory floor to the boardroom — running on intelligent, observable software.",
  },
  {
    title: "Culture",
    body: "Small senior teams. Written decisions. Demos every week. No layers between engineers and the problem.",
  },
  {
    title: "Innovation",
    body: "A standing research practice in vision models, agentic systems and edge inference feeds every client build.",
  },
] as const;

/** Hero marquee terms. Duplicated at render time for the translateX loop. */
export const marqueeTerms = [
  "AI Systems",
  "Computer Vision",
  "Agentic AI",
  "Enterprise Automation",
  "Factory Automation",
  "Predictive Analytics",
  "SaaS Platforms",
  "Custom Software",
  "Mobile Applications",
  "Cloud Solutions",
  "Data Platforms",
  "AI Integrations",
] as const;
