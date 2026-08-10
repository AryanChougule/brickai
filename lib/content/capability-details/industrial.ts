import type { CapabilityDetail } from "@/lib/types";

/** Deep-dive content for the operations, data and integration capabilities. */
export const industrialCapabilityDetails: Record<string, CapabilityDetail> = {
  "factory-automation": {
    slug: "factory-automation",
    architecture: {
      title: "One timeline for the floor, and a way to act on it",
      description:
        "Machine signals are only useful once they share a clock and a schema. Everything above the historian is a read of the same timeline; everything below it is a controlled write.",
      layers: [
        {
          title: "Machines",
          caption: "Whatever is already on the floor",
          nodes: ["PLCs", "CNC controllers", "Retrofit sensors", "Barcode scanners"],
        },
        {
          title: "Acquisition",
          caption: "Protocol translation at the cell",
          nodes: ["OPC-UA gateway", "MQTT bridge", "Modbus adapters", "Edge buffer"],
        },
        {
          title: "Stream & store",
          caption: "One clock, one schema, replayable",
          nodes: ["Kafka topics", "TimescaleDB", "Unified namespace", "Downtime coding"],
          accent: true,
        },
        {
          title: "Decisions",
          caption: "Where the data becomes an instruction",
          nodes: ["OEE engine", "Anomaly models", "Maintenance scheduler", "Rules"],
        },
        {
          title: "Surfaces & write-back",
          caption: "The loop closes on the floor",
          nodes: ["Andon boards", "Operator terminals", "MES / ERP writes", "Work orders"],
        },
      ],
    },
    roi: {
      headline: "10–25% OEE improvement",
      payback: "Typical payback: 6–11 months",
      metrics: [
        { label: "Overall equipment effectiveness", before: "61%", after: "78%" },
        { label: "Unplanned downtime", before: "baseline", after: "−38%" },
        {
          label: "Downtime reasons captured",
          before: "31%",
          after: "96%",
          note: "Coded at the machine, not from memory",
        },
        { label: "Manual data entry per shift", before: "90 min", after: "0 min" },
        { label: "Time to trace a batch", before: "2 days", after: "under a minute" },
      ],
    },
    screenshots: [
      {
        id: "factory-andon",
        caption: "Digital andon board — live state across every cell",
        aspect: "16 / 9",
      },
      {
        id: "factory-oee",
        caption: "OEE breakdown — availability, performance and quality by shift",
        aspect: "16 / 10",
      },
      {
        id: "factory-health",
        caption: "Machine health — vibration and temperature anomaly timeline",
        aspect: "16 / 10",
      },
    ],
    demo: {
      id: "factory-demo",
      title: "Plant walkthrough — the loop running live",
      duration: "2:40",
      synopsis:
        "See, predict, act on one line: cameras and machine signals streaming in, a bearing flagged four days before failure, and the work order raised without anyone calling a meeting.",
    },
    cta: {
      headline: "Start with one line",
      body: "One cell instrumented end to end is enough to prove the numbers before you commit the plant. That is where every rollout we have done began.",
      action: "Scope a single-line pilot",
    },
    faqs: [
      {
        question: "Our machines are 30 years old. Does that rule us out?",
        answer:
          "No — it is the normal case. Where there is no protocol to read we retrofit sensors on the outside of the machine: current clamps, vibration pucks, light-barrier counters. The timeline does not care how a signal was acquired.",
      },
      {
        question: "Will this touch machine control?",
        answer:
          "Only where you ask it to, and never in the first phase. We read first, prove the data, then agree an explicit write scope with your controls engineer.",
      },
      {
        question: "Does it depend on your cloud?",
        answer:
          "The acquisition and decision layers run on-premise. Cloud is for long-term history and cross-site comparison, and the floor keeps operating if the link drops.",
      },
    ],
  },

  "enterprise-automation": {
    slug: "enterprise-automation",
    architecture: {
      title: "A process engine with humans at the judgment points",
      description:
        "Automating a workflow means naming every step, its owner and its failure mode. The engine is the easy part; the exception design is what determines whether it survives contact with month-end.",
      layers: [
        {
          title: "Intake",
          caption: "However the work arrives today",
          nodes: ["Email / shared inbox", "Portal upload", "SFTP drops", "API"],
        },
        {
          title: "Understanding",
          caption: "Unstructured in, structured out",
          nodes: ["Document AI", "Field extraction", "Validation rules", "Master-data match"],
          accent: true,
        },
        {
          title: "Orchestration",
          caption: "Durable steps with retries and timers",
          nodes: ["Workflow engine", "SLA timers", "Idempotent tasks", "Compensation"],
        },
        {
          title: "Execution",
          caption: "Writes into the systems of record",
          nodes: ["ERP posting", "Payment run", "HRIS updates", "Notifications"],
        },
        {
          title: "Control",
          caption: "What the auditors will ask for",
          nodes: ["Approval matrix", "Exception queue", "Audit trail", "Segregation of duties"],
        },
      ],
    },
    roi: {
      headline: "Thousands of hours returned per year",
      payback: "Typical payback: 3–7 months",
      metrics: [
        { label: "Invoice processing cost", before: "$11.40", after: "$1.60" },
        { label: "Touchless completion rate", before: "12%", after: "87%" },
        { label: "Cycle time, receipt to posting", before: "9 days", after: "4 hours" },
        {
          label: "Hours returned per year",
          before: "—",
          after: "6,200",
          note: "Across AP and onboarding",
        },
        { label: "Month-end overtime", before: "3 nights", after: "none" },
      ],
    },
    screenshots: [
      {
        id: "ea-queue",
        caption: "Work queue — SLA state and owner for every in-flight case",
        aspect: "16 / 10",
      },
      {
        id: "ea-extract",
        caption: "Extraction review — low-confidence fields flagged for a human",
        aspect: "16 / 10",
      },
      {
        id: "ea-audit",
        caption: "Audit trail — every step, actor and decision on one case",
        aspect: "16 / 10",
      },
    ],
    demo: {
      id: "ea-demo",
      title: "An invoice from inbox to posted",
      duration: "2:20",
      synopsis:
        "A PDF invoice arrives, fields are extracted and matched against the purchase order, a tolerance breach is routed for approval, and the posting is written back to the ERP.",
    },
    cta: {
      headline: "Bring one process and its exceptions",
      body: "We will model the happy path in a workshop and spend the rest of the time on the exceptions — that is where automation projects actually succeed or fail.",
      action: "Book a process workshop",
    },
    faqs: [
      {
        question: "How is this different from the RPA we already own?",
        answer:
          "RPA drives screens and breaks when they change. We integrate at the API and data layer, with durable workflow state, so a restart resumes rather than reruns.",
      },
      {
        question: "What about the 15% that needs a person?",
        answer:
          "It is designed for, not treated as failure. Exceptions arrive in a queue with the extracted data, the rule that stopped them and the history — so a decision takes seconds instead of an investigation.",
      },
      {
        question: "Can we keep our approval hierarchy?",
        answer:
          "Yes. The approval matrix and segregation-of-duties rules are configuration, mapped from your existing delegation of authority rather than replacing it.",
      },
    ],
  },

  "data-platforms": {
    slug: "data-platforms",
    architecture: {
      title: "Lineage from the sensor to the boardroom slide",
      description:
        "A number is only trusted when someone can walk backwards from it to the system that produced it. Every layer here is versioned, tested and traceable in that direction.",
      layers: [
        {
          title: "Sources",
          caption: "Everything that already holds truth",
          nodes: ["ERP", "CRM", "Machine historian", "SaaS APIs", "Files"],
        },
        {
          title: "Ingestion",
          caption: "Batch and stream, same contracts",
          nodes: ["CDC connectors", "Kafka", "Schema registry", "Landing zone"],
        },
        {
          title: "Transform",
          caption: "Version-controlled, tested, documented",
          nodes: ["dbt models", "Data tests", "Lineage graph", "Semantic layer"],
          accent: true,
        },
        {
          title: "Serve",
          caption: "One definition of every metric",
          nodes: ["Warehouse", "Metrics API", "Feature store", "Reverse ETL"],
        },
        {
          title: "Consume",
          caption: "Where people meet the numbers",
          nodes: ["Exec dashboards", "Self-serve explore", "Alerts", "Embedded analytics"],
        },
      ],
    },
    roi: {
      headline: "Reporting time: days → real time",
      payback: "Typical payback: 5–10 months",
      metrics: [
        { label: "Report preparation time", before: "3 days", after: "live" },
        { label: "Analyst hours on manual consolidation", before: "70/mo", after: "6/mo" },
        {
          label: "Metric definitions in dispute",
          before: "18",
          after: "0",
          note: "Single semantic layer",
        },
        { label: "Data freshness at the dashboard", before: "7 days", after: "5 minutes" },
        { label: "Failed loads discovered by a user", before: "most", after: "none" },
      ],
    },
    screenshots: [
      {
        id: "data-exec",
        caption: "Executive dashboard — one definition per metric, with lineage",
        aspect: "16 / 10",
      },
      {
        id: "data-lineage",
        caption: "Lineage graph — column-level path from source to tile",
        aspect: "16 / 10",
      },
      {
        id: "data-quality",
        caption: "Data quality — test results and freshness per model",
        aspect: "16 / 10",
      },
    ],
    demo: {
      id: "data-demo",
      title: "Tracing a boardroom number back to its sensor",
      duration: "2:30",
      synopsis:
        "Start at a KPI tile and walk backwards through the semantic layer, the dbt models and the ingestion job to the machine reading that produced it.",
    },
    cta: {
      headline: "Name the number nobody trusts",
      body: "We trace it end to end and show you exactly where it diverges. That trace is usually the business case on its own.",
      action: "Request a data trace",
    },
    faqs: [
      {
        question: "Do we need to replace our warehouse?",
        answer:
          "Almost never. We build on what you have — Snowflake, BigQuery, Databricks, Postgres — and add the transform, testing and semantic layers that are usually what is actually missing.",
      },
      {
        question: "Who owns the models afterwards?",
        answer:
          "You do. Everything is plain SQL and dbt in your repository, with documentation generated from the same source. We hand over and stay for support, not for lock-in.",
      },
      {
        question: "How do we stop dashboard sprawl returning?",
        answer:
          "Metrics are defined once in the semantic layer and consumed from there. A new dashboard cannot invent a second definition of revenue, because it does not have access to one.",
      },
    ],
  },

  "api-integrations": {
    slug: "api-integrations",
    architecture: {
      title: "Idempotent by design, observable by default",
      description:
        "Integration failure is normal operating condition, not an incident. Every message carries a key, every delivery can be replayed, and every mismatch is reconciled rather than discovered at audit.",
      layers: [
        {
          title: "Edges",
          caption: "The systems that must agree",
          nodes: ["ERP", "CRM", "Payments", "Partner / EDI", "Warehouse"],
        },
        {
          title: "Gateway",
          caption: "One front door, one auth model",
          nodes: ["API gateway", "Auth / mTLS", "Rate limits", "Schema validation"],
        },
        {
          title: "Transport",
          caption: "Durable, ordered, replayable",
          nodes: ["Message queue", "Idempotency keys", "Dead-letter queue", "Retry with backoff"],
          accent: true,
        },
        {
          title: "Mapping",
          caption: "Where the models are reconciled",
          nodes: ["Canonical model", "Field mapping", "Reference data", "Versioned contracts"],
        },
        {
          title: "Assurance",
          caption: "Proof that both sides match",
          nodes: ["Reconciliation jobs", "Drift alerts", "Replay console", "Delivery receipts"],
        },
      ],
    },
    roi: {
      headline: "Zero re-keying between systems",
      payback: "Typical payback: 2–5 months",
      metrics: [
        { label: "Records re-keyed by hand per week", before: "1,400", after: "0" },
        { label: "Sync error rate", before: "2.1%", after: "0.02%" },
        {
          label: "Time to detect a failed sync",
          before: "11 days",
          after: "40 seconds",
          note: "Alert, not an audit finding",
        },
        { label: "Order-to-fulfilment handoff", before: "4 hours", after: "under a minute" },
        { label: "Engineer hours per integration change", before: "32", after: "4" },
      ],
    },
    screenshots: [
      {
        id: "api-flows",
        caption: "Flow map — every integration, its volume and its health",
        aspect: "16 / 10",
      },
      {
        id: "api-replay",
        caption: "Replay console — dead-lettered messages with full payloads",
        aspect: "16 / 10",
      },
      {
        id: "api-recon",
        caption: "Reconciliation report — record counts matched across systems",
        aspect: "16 / 10",
      },
    ],
    demo: {
      id: "api-demo",
      title: "Surviving a downstream outage",
      duration: "2:00",
      synopsis:
        "An order syncs across four systems, the payment provider starts failing, messages dead-letter, and the replay console drains the backlog without a single duplicate charge.",
    },
    cta: {
      headline: "Show us the spreadsheet in the middle",
      body: "Wherever someone copies data between two systems, there is an integration waiting to be built. We will scope it in a single session.",
      action: "Scope an integration",
    },
    faqs: [
      {
        question: "What if a vendor has no API?",
        answer:
          "There is usually a file drop, a database replica or a report export we can build a contract around. We treat that as a legitimate transport with the same idempotency and reconciliation guarantees.",
      },
      {
        question: "How do you avoid duplicate writes?",
        answer:
          "Every message carries an idempotency key derived from the business event. A replayed or retried delivery hits the same key and becomes a no-op — which is what makes safe replay possible.",
      },
      {
        question: "Who gets alerted when it breaks?",
        answer:
          "Your on-call, through your existing paging tool, with the failing flow and payload attached. Silent failure is the one outcome the design does not permit.",
      },
    ],
  },
};
