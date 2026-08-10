import type { Industry } from "@/lib/types";

/** The ten sectors we sell into, in the order the home-page selector lists them. */
export const industries: Industry[] = [
  {
    slug: "manufacturing",
    num: "01",
    name: "Manufacturing",
    blurb:
      "Software for the plant floor: vision QC, machine data, and the systems that connect them to the business.",
    narrative:
      "Manufacturing is where the gap between what a business knows and what is actually happening is widest — and most expensive. A line runs at a rate nobody can verify, a defect escapes because inspection is a 2% sample, a bearing fails on a Thursday that a vibration signature predicted on Monday. Everything we build in this sector closes one of those loops, and every rollout starts on a single line.",
    solutions: [
      "Industrial vision inspection",
      "Predictive maintenance",
      "OEE and downtime analytics",
      "MES / ERP integration",
    ],
    outcomes: [
      { label: "OEE improvement", value: "10–25%" },
      { label: "Defect escape", value: "−90%" },
      { label: "Unplanned downtime", value: "−38%" },
    ],
    capabilities: [
      "computer-vision",
      "factory-automation",
      "data-platforms",
      "custom-software",
    ],
    constraints: [
      "Inference and control cannot depend on an internet uplink",
      "Retrofit beats replacement — most machines predate any usable protocol",
      "Controls engineering signs off every write path before it exists",
    ],
  },
  {
    slug: "healthcare",
    num: "02",
    name: "Healthcare",
    blurb:
      "Compliant automation that gives clinical and admin staff their hours back.",
    narrative:
      "Clinical time is the scarcest resource in the system, and administrative load is what consumes it. The work here is unglamorous and high-value: intake that does not need re-typing, claims that process without a chase, records that are searchable in the language clinicians actually use. Every deployment is designed against the audit requirement first.",
    solutions: [
      "Patient intake automation",
      "Document and claims processing",
      "Clinical data platforms",
      "Scheduling systems",
    ],
    outcomes: [
      { label: "Admin hours returned", value: "6,200/yr" },
      { label: "Claims cycle time", value: "−82%" },
      { label: "Audit trail coverage", value: "100%" },
    ],
    capabilities: [
      "enterprise-automation",
      "llm-applications",
      "data-platforms",
      "mobile-apps",
    ],
    constraints: [
      "PHI never leaves the customer's cloud tenancy",
      "Every automated decision carries an attributable audit record",
      "Clinical workflows change only with clinician sign-off",
    ],
  },
  {
    slug: "retail",
    num: "03",
    name: "Retail",
    blurb: "Systems that see the shelf and read the demand curve.",
    narrative:
      "Retail runs on two questions: what is actually on the shelf, and what will sell next. Cameras answer the first better than cycle counts do, and forecasting answers the second better than last year's spreadsheet. Layered on top, conversational systems absorb the support volume that scales with every promotion.",
    solutions: [
      "Shelf and planogram vision",
      "Demand forecasting",
      "Customer chatbots",
      "E-commerce platforms",
    ],
    outcomes: [
      { label: "Tier-1 tickets deflected", value: "60–80%" },
      { label: "On-shelf availability", value: "+11pts" },
      { label: "Forecast error", value: "−34%" },
    ],
    capabilities: [
      "computer-vision",
      "ai-chatbots",
      "data-platforms",
      "web-development",
    ],
    constraints: [
      "Store hardware must survive a retail environment unattended",
      "Peak trading periods are a hard freeze window",
      "Customer-facing latency budgets are set in milliseconds",
    ],
  },
  {
    slug: "logistics",
    num: "04",
    name: "Logistics",
    blurb: "Visibility and orchestration across every leg of the chain.",
    narrative:
      "A shipment crosses six systems and four companies, and the handoffs are where margin disappears. The wins here come from integration and agency: making systems agree without re-keying, then letting agents run the quoting and exception work that used to consume a planner's day.",
    solutions: [
      "Fleet and route optimisation",
      "Warehouse vision counting",
      "Shipment tracking platforms",
      "EDI / API integrations",
    ],
    outcomes: [
      { label: "Time per quote", value: "4h → 6m" },
      { label: "Records re-keyed", value: "0" },
      { label: "Runs unattended", value: "83%" },
    ],
    capabilities: [
      "agentic-ai",
      "api-integrations",
      "mobile-apps",
      "custom-software",
    ],
    constraints: [
      "Partner systems are fixed points — integration adapts, they do not",
      "Field connectivity is intermittent by default",
      "Every automated write is idempotent and replayable",
    ],
  },
  {
    slug: "construction",
    num: "05",
    name: "Construction",
    blurb: "Site intelligence from cameras, sensors and schedules.",
    narrative:
      "A site is a factory that moves, with no fixed infrastructure and a workforce that changes weekly. Progress and safety are both observable problems, and the reporting layer above them is what turns observation into a decision the programme can act on.",
    solutions: [
      "Site safety monitoring",
      "Progress tracking vision",
      "Equipment utilisation",
      "Project dashboards",
    ],
    outcomes: [
      { label: "Safety incidents", value: "−47%" },
      { label: "Progress reporting", value: "weekly → live" },
      { label: "Plant utilisation", value: "+22%" },
    ],
    capabilities: [
      "computer-vision",
      "mobile-apps",
      "data-platforms",
      "custom-software",
    ],
    constraints: [
      "Hardware is temporary, weatherproof and often battery-powered",
      "Workforce turnover rules out long training cycles",
      "Connectivity cannot be assumed anywhere on site",
    ],
  },
  {
    slug: "agriculture",
    num: "06",
    name: "Agriculture",
    blurb: "Models that watch crops and machines so people don't have to.",
    narrative:
      "Agricultural decisions are made against a clock nobody controls, on land too large to inspect. Vision and sensor models turn scale from a liability into an advantage: every hectare measured, every machine reporting, every intervention timed against data rather than a calendar.",
    solutions: [
      "Crop health vision",
      "Yield prediction",
      "Sensor data platforms",
      "Farm ops software",
    ],
    outcomes: [
      { label: "Input use", value: "−19%" },
      { label: "Yield forecast error", value: "−28%" },
      { label: "Scouting labour", value: "−60%" },
    ],
    capabilities: [
      "computer-vision",
      "data-platforms",
      "factory-automation",
      "mobile-apps",
    ],
    constraints: [
      "Bandwidth at the field edge is minimal and metered",
      "Seasonality gives one window per year to get it right",
      "Equipment operates far from any power or network drop",
    ],
  },
  {
    slug: "education",
    num: "07",
    name: "Education",
    blurb: "Platforms that scale teaching, not admin.",
    narrative:
      "Institutions accumulate administrative process faster than they accumulate students. The value is in removing that load — enrolment that processes itself, assistants that answer the same question for the thousandth time — so that teaching capacity goes to teaching.",
    solutions: [
      "Learning platforms",
      "AI tutoring assistants",
      "Enrolment automation",
      "Analytics dashboards",
    ],
    outcomes: [
      { label: "Enrolment processing", value: "−74%" },
      { label: "Support response", value: "6h → 9s" },
      { label: "Reporting effort", value: "days → live" },
    ],
    capabilities: [
      "web-development",
      "ai-chatbots",
      "enterprise-automation",
      "saas-products",
    ],
    constraints: [
      "Term-start load is 40× the annual average",
      "Student data handling is governed and non-negotiable",
      "Accessibility conformance is a requirement, not a preference",
    ],
  },
  {
    slug: "finance",
    num: "08",
    name: "Finance",
    blurb: "Automation with an audit trail.",
    narrative:
      "In finance, an automated decision that cannot be explained is worse than a manual one. Everything we build here is designed to be reconstructed after the fact: document intelligence with citations, anomaly detection with reasons, reporting with lineage back to source.",
    solutions: [
      "Document intelligence",
      "Fraud and anomaly detection",
      "Reporting automation",
      "Client portals",
    ],
    outcomes: [
      { label: "Touchless processing", value: "87%" },
      { label: "Review time per document", value: "−88%" },
      { label: "Metrics in dispute", value: "0" },
    ],
    capabilities: [
      "llm-applications",
      "enterprise-automation",
      "data-platforms",
      "api-integrations",
    ],
    constraints: [
      "Every model output is traceable to its source document",
      "Segregation of duties is enforced in software, not policy",
      "Regulatory reporting deadlines are immovable",
    ],
  },
  {
    slug: "government",
    num: "09",
    name: "Government",
    blurb: "Dependable systems for public workflows.",
    narrative:
      "Public-sector software is judged on reliability and access before anything else. The brief is rarely novel technology — it is digitising a records backlog, making a case management system usable, and building services that work for every citizen on every device.",
    solutions: [
      "Citizen service portals",
      "Records digitisation",
      "Case management",
      "Process automation",
    ],
    outcomes: [
      { label: "Case handling time", value: "−58%" },
      { label: "Digital self-service", value: "+66%" },
      { label: "Records searchable", value: "100%" },
    ],
    capabilities: [
      "enterprise-automation",
      "llm-applications",
      "web-development",
      "custom-software",
    ],
    constraints: [
      "WCAG conformance and assisted-digital routes are mandatory",
      "Procurement and security review shape the delivery plan",
      "Data residency is fixed by statute, not preference",
    ],
  },
  {
    slug: "automotive",
    num: "10",
    name: "Automotive",
    blurb: "From the line to the dealership.",
    narrative:
      "Automotive spans the tightest quality tolerances in manufacturing and one of the most fragmented retail networks. Traceability is the thread between them: knowing exactly what went into a unit, and being able to prove it years later from either end of the chain.",
    solutions: [
      "Assembly vision QC",
      "Parts traceability",
      "Dealer platforms",
      "Telematics data systems",
    ],
    outcomes: [
      { label: "Trace a batch", value: "2 days → 60s" },
      { label: "Escaped defects", value: "−90%" },
      { label: "Warranty investigation", value: "−71%" },
    ],
    capabilities: [
      "computer-vision",
      "factory-automation",
      "data-platforms",
      "saas-products",
    ],
    constraints: [
      "Traceability records must survive a decade of retention",
      "Takt time sets a hard ceiling on inspection latency",
      "Tier-1 quality standards govern every change",
    ],
  },
];
