import type { Project } from "@/lib/types";

/**
 * Case studies. The first three are the featured set on the home page, in the
 * order the design shows them. Client names are withheld pending approval —
 * `client` carries the descriptor used in the published version.
 */
export const projects: Project[] = [
  {
    slug: "vision-qc-packaging-line",
    title: "Vision QC for a packaging line",
    client: "Consumer packaging manufacturer",
    year: "2025",
    tags: ["Computer Vision", "Manufacturing", "Edge AI"],
    description:
      "Real-time defect detection on a 400-unit/minute line, running on edge GPUs beside the conveyor — with a review UI the QA team actually uses.",
    before: "3.1% defect escape",
    after: "0.2% escape",
    media: "Line-side camera footage",
    industry: "manufacturing",
    capabilities: ["computer-vision", "factory-automation"],
    featured: true,
    challenge:
      "Inspection was a 2% manual sample on a line running 400 units a minute, which meant defects were discovered by customers rather than by the plant. Two prior vendor trials had failed: one could not hold accuracy across SKU changeovers, the other needed a network round trip the line speed did not allow.",
    approach: [
      {
        title: "Fix the optics before the model",
        body: "Two weeks were spent on lighting, strobe timing and encoder triggering. Half the accuracy problem in the failed trials was image quality, and no model recovers information the capture never had.",
      },
      {
        title: "Inference at the conveyor",
        body: "A TensorRT engine on a line-side edge GPU delivers a verdict in 8ms and drives the reject actuator through the PLC directly. The network is not in the decision path at all.",
      },
      {
        title: "Make QA the labelling loop",
        body: "Borderline calls surface in a review queue built for the QA team's actual shift pattern. Their confirmations become the next training set, which is what keeps accuracy from decaying at changeover.",
      },
      {
        title: "Ship SKU by SKU",
        body: "One SKU went live behind a shadow deployment while the rest stayed manual. Each subsequent SKU followed the same gate, so no rollout step could take the line down.",
      },
    ],
    outcomes: [
      { label: "Defect escape rate", value: "3.1% → 0.2%" },
      { label: "Units inspected", value: "2% → 100%" },
      { label: "Decision latency", value: "8ms" },
      { label: "Scrap cost per month", value: "−$35k" },
    ],
    stack: [
      "PyTorch",
      "TensorRT",
      "NVIDIA Jetson",
      "OpenCV",
      "Python",
      "Postgres",
      "React",
    ],
    gallery: [
      {
        id: "proj-vision-line",
        caption: "Line-side inspection overlay at production speed",
        aspect: "16 / 9",
      },
      {
        id: "proj-vision-review",
        caption: "QA review queue — borderline verdicts awaiting confirmation",
        aspect: "16 / 10",
      },
      {
        id: "proj-vision-metrics",
        caption: "Accuracy and drift tracked per SKU and per shift",
        aspect: "16 / 10",
      },
    ],
    demo: {
      id: "proj-vision-demo",
      title: "Inspection running at 400 units per minute",
      duration: "2:40",
      synopsis:
        "Capture, inference and reject actuation on the live line, followed by the review queue that feeds retraining.",
    },
  },
  {
    slug: "autonomous-freight-quoting-agent",
    title: "Autonomous freight quoting agent",
    client: "Mid-market freight brokerage",
    year: "2025",
    tags: ["Agentic AI", "Logistics", "Automation"],
    description:
      "An agent that reads inbound RFQs, checks capacity and lanes, drafts quotes and files them in the TMS — with human sign-off on exceptions only.",
    before: "4h per quote",
    after: "6 min per quote",
    media: "Agent workflow recording",
    industry: "logistics",
    capabilities: ["agentic-ai", "api-integrations", "llm-applications"],
    featured: true,
    challenge:
      "Quotes arrived as free-text email and took a planner up to four hours each, which capped the brokerage at roughly 120 quotes a week and meant anything arriving after 4pm was answered the next day. Competitors were responding inside the hour.",
    approach: [
      {
        title: "Model the process as a task graph",
        body: "Before any model work, the quoting process was decomposed into explicit steps with owners and failure modes. Three of the fourteen steps were marked as never-automate, and that boundary held through delivery.",
      },
      {
        title: "Scope every tool the agent can reach",
        body: "Lane lookup, capacity check, rate calculation and TMS write are separate tools with hard value ceilings. An action outside the envelope fails verification rather than executing.",
      },
      {
        title: "Verification before submission",
        body: "Every drafted quote passes schema checks, margin rules and a cross-check pass against comparable historical lanes. Failures route to the approval queue with the reason attached.",
      },
      {
        title: "Replayable runs from day one",
        body: "Each run records its plan, every tool call and every check verdict. That trace is what made the operations team willing to let it run unattended overnight.",
      },
    ],
    outcomes: [
      { label: "Time per quote", value: "4h → 6m" },
      { label: "Quotes per week", value: "120 → 740" },
      { label: "Runs unattended", value: "83%" },
      { label: "Pricing errors reaching customers", value: "2.4% → 0.3%" },
    ],
    stack: [
      "LangGraph",
      "MCP",
      "FastAPI",
      "Postgres",
      "Kafka",
      "Next.js",
      "Python",
    ],
    gallery: [
      {
        id: "proj-agent-runs",
        caption: "Run list with verification status and cost per run",
        aspect: "16 / 10",
      },
      {
        id: "proj-agent-trace",
        caption: "Replay of a single run, step by step",
        aspect: "16 / 10",
      },
      {
        id: "proj-agent-queue",
        caption: "Exception queue — the 17% a human still decides",
        aspect: "16 / 10",
      },
    ],
    demo: {
      id: "proj-agent-demo",
      title: "An RFQ quoted and filed without a planner",
      duration: "2:55",
      synopsis:
        "Inbound email through to a TMS record, with one exception deliberately surfaced for sign-off.",
    },
  },
  {
    slug: "oee-platform-machine-builder",
    title: "OEE platform for a machine builder",
    client: "Industrial machine OEM",
    year: "2024",
    tags: ["SaaS", "Data Platform", "Manufacturing"],
    description:
      "A multi-tenant SaaS the OEM now sells with every machine: live OEE, downtime reasons and predictive alerts across customer fleets.",
    before: "Paper downtime logs",
    after: "Live fleet OEE",
    media: "Product dashboard tour",
    industry: "manufacturing",
    capabilities: ["saas-products", "data-platforms", "factory-automation"],
    featured: true,
    challenge:
      "The OEM sold excellent machines and had no visibility into how they ran once installed. Service was reactive, downtime disputes came down to paper logs, and there was no recurring revenue attached to a capital sale.",
    approach: [
      {
        title: "Tenancy first",
        body: "Row-level security and tenant context went in before the first feature, because the customers of a machine builder are competitors with each other. Isolation had to survive a security review, not a demo.",
      },
      {
        title: "One acquisition path, many machine generations",
        body: "An OPC-UA gateway with retrofit sensor fallback covers a fleet spanning fifteen years of machine designs. Above the historian, every generation looks the same.",
      },
      {
        title: "Downtime coding at the machine",
        body: "Operators code downtime on the terminal in the moment, from a short SKU-aware list. That single decision moved reason capture from 31% to 96% and made the analytics worth reading.",
      },
      {
        title: "Productise the service contract",
        body: "Alerting tiers, entitlements and metered usage were built as commercial mechanics, turning the platform into a subscription the OEM attaches to every machine sold.",
      },
    ],
    outcomes: [
      { label: "OEE across fleet", value: "61% → 78%" },
      { label: "Downtime reasons captured", value: "31% → 96%" },
      { label: "Recurring revenue per machine", value: "new line" },
      { label: "Time to trace a batch", value: "2 days → 60s" },
    ],
    stack: [
      "Next.js",
      "Postgres",
      "TimescaleDB",
      "Kafka",
      "OPC-UA",
      "Kubernetes",
      "Stripe",
    ],
    gallery: [
      {
        id: "proj-oee-fleet",
        caption: "Fleet view — OEE across every installed machine",
        aspect: "16 / 10",
      },
      {
        id: "proj-oee-downtime",
        caption: "Downtime pareto by coded reason and shift",
        aspect: "16 / 10",
      },
      {
        id: "proj-oee-terminal",
        caption: "Operator terminal — downtime coded at the machine",
        aspect: "16 / 9",
      },
    ],
    demo: {
      id: "proj-oee-demo",
      title: "Product dashboard tour",
      duration: "3:20",
      synopsis:
        "Fleet overview down to a single machine's downtime pareto, then the operator terminal that produces the data.",
    },
  },
  {
    slug: "claims-document-intelligence",
    title: "Claims document intelligence",
    client: "Regional health insurer",
    year: "2025",
    tags: ["LLM Applications", "Healthcare", "Automation"],
    description:
      "Structured extraction across scanned claim packets with citation back to the source page, and an exception queue built for adjusters rather than engineers.",
    before: "9 days to adjudicate",
    after: "4 hours",
    media: "Adjudication workspace tour",
    industry: "healthcare",
    capabilities: [
      "llm-applications",
      "enterprise-automation",
      "data-platforms",
    ],
    featured: false,
    challenge:
      "Claim packets arrived as scanned PDFs of wildly varying quality, and adjudication depended on a handful of experienced adjusters reading them end to end. Backlogs grew every quarter and the knowledge was entirely undocumented.",
    approach: [
      {
        title: "Measure on the worst scans",
        body: "Extraction accuracy was benchmarked on the least legible 10% of the archive rather than the average. Everything above that threshold then took care of itself.",
      },
      {
        title: "Citations as a hard requirement",
        body: "No extracted field ships without a page and region reference. Adjusters verify in one click, which is the difference between a tool they trust and one they route around.",
      },
      {
        title: "Golden-set evaluation in CI",
        body: "Nine hundred adjudicated claims form a regression suite. A prompt or model change ships only when it beats the incumbent on that set.",
      },
    ],
    outcomes: [
      { label: "Adjudication cycle", value: "9 days → 4h" },
      { label: "Adjuster throughput", value: "+6.4×" },
      { label: "Fields with a traceable source", value: "100%" },
      { label: "Backlog", value: "cleared in 7 weeks" },
    ],
    stack: ["Python", "RAG", "Vector DB", "FastAPI", "Next.js", "Azure"],
    gallery: [
      {
        id: "proj-claims-workspace",
        caption: "Adjudication workspace with source-page citations",
        aspect: "16 / 10",
      },
      {
        id: "proj-claims-eval",
        caption: "Golden-set evaluation gating a model change",
        aspect: "16 / 10",
      },
    ],
  },
  {
    slug: "field-service-offline-app",
    title: "Offline-first field service app",
    client: "National utilities contractor",
    year: "2024",
    tags: ["Mobile Apps", "Logistics", "Offline sync"],
    description:
      "A React Native app that completes a full job with no signal — checklists, photos, parts and signature — then reconciles deterministically on reconnect.",
    before: "2–3 day data latency",
    after: "Under 2 minutes",
    media: "Field workflow recording",
    industry: "logistics",
    capabilities: ["mobile-apps", "api-integrations", "custom-software"],
    featured: false,
    challenge:
      "Technicians worked from paper because the previous connected-only app failed in exactly the rural locations where most jobs were. Forms were re-keyed days later, and roughly one in seven jobs needed a return visit for missing information.",
    approach: [
      {
        title: "Local database as the session's source of truth",
        body: "The app never blocks on the network. Every capture writes locally first, and sync is a background reconciliation rather than a prerequisite for doing the work.",
      },
      {
        title: "Explicit conflict rules per field",
        body: "Last-write-wins where it is safe, surfaced conflict where it is not. Silent overwrite was ruled out during design, which is why dispatch trusts the data.",
      },
      {
        title: "Distribute through MDM",
        body: "Over-the-air updates through the existing device fleet removed app store review from the release cycle entirely.",
      },
    ],
    outcomes: [
      { label: "Field data latency", value: "2–3 days → 2m" },
      { label: "Jobs per technician per day", value: "5.2 → 7.1" },
      { label: "Return visits", value: "14% → 3%" },
      { label: "Data lost in dead zones", value: "none" },
    ],
    stack: [
      "React Native",
      "SQLite",
      "FastAPI",
      "Postgres",
      "Object storage",
      "MDM",
    ],
    gallery: [
      {
        id: "proj-field-job",
        caption: "Job checklist and capture, fully offline",
        aspect: "9 / 16",
      },
      {
        id: "proj-field-dispatch",
        caption: "Dispatch console with live fleet state",
        aspect: "16 / 10",
      },
    ],
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
