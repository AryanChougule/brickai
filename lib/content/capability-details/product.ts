import type { CapabilityDetail } from "@/lib/types";

/** Deep-dive content for the product-engineering capabilities. */
export const productCapabilityDetails: Record<string, CapabilityDetail> = {
  "custom-software": {
    slug: "custom-software",
    architecture: {
      title: "A modular core your team can still change in year three",
      description:
        "Custom software earns its cost only if it stays cheap to modify. Domain logic stays isolated from delivery mechanisms, so a new interface or integration never means reopening the rules.",
      layers: [
        {
          title: "Interfaces",
          caption: "Many front ends, one set of rules",
          nodes: ["Web app", "Operator terminal", "Mobile", "Public API"],
        },
        {
          title: "Application",
          caption: "Use cases as explicit, testable units",
          nodes: ["Command handlers", "Query services", "Validation", "Authorisation"],
        },
        {
          title: "Domain",
          caption: "Your process, expressed once",
          nodes: ["Entities", "Business rules", "Domain events", "State machines"],
          accent: true,
        },
        {
          title: "Infrastructure",
          caption: "Replaceable by design",
          nodes: ["Postgres", "Object storage", "Job runner", "Integration adapters"],
        },
        {
          title: "Operations",
          caption: "Owned, not abandoned",
          nodes: ["CI/CD", "Migrations", "Observability", "Backup / restore drills"],
        },
      ],
    },
    roi: {
      headline: "One system replaces five tools",
      payback: "Typical payback: 8–14 months",
      metrics: [
        { label: "Tools in the daily workflow", before: "5", after: "1" },
        { label: "Licence and subscription spend", before: "$94k/yr", after: "$18k/yr" },
        {
          label: "Process steps needing manual re-entry",
          before: "11",
          after: "0",
        },
        { label: "Order-to-quote cycle", before: "2 days", after: "20 minutes" },
        { label: "Onboarding time for a new hire", before: "5 weeks", after: "6 days" },
      ],
    },
    screenshots: [
      {
        id: "custom-ops",
        caption: "Operations console — the whole process on one board",
        aspect: "16 / 10",
      },
      {
        id: "custom-quote",
        caption: "Quoting engine — rules-driven configuration and pricing",
        aspect: "16 / 10",
      },
      {
        id: "custom-admin",
        caption: "Admin — rules and reference data editable without a deploy",
        aspect: "16 / 10",
      },
    ],
    demo: {
      id: "custom-demo",
      title: "One order through the whole system",
      duration: "3:10",
      synopsis:
        "Enquiry to invoice in a single platform: configuration, pricing rules, scheduling, dispatch and the integration writes that used to be five separate logins.",
    },
    cta: {
      headline: "Bring the spreadsheet that runs your business",
      body: "It is the best specification you have. We will read it with you and tell you what should become software and what should stay a spreadsheet.",
      action: "Book a build assessment",
    },
    faqs: [
      {
        question: "Why not configure an off-the-shelf platform?",
        answer:
          "Often you should, and we will say so. Custom wins when the process is your competitive advantage or when configuration cost plus workaround cost exceeds the build — we help you work out which case you are in.",
      },
      {
        question: "What happens if we want to take it in-house?",
        answer:
          "You can. The repository, infrastructure definitions and documentation are yours from the first commit, and the architecture is deliberately conventional so a new team can read it.",
      },
      {
        question: "How do you avoid a two-year project?",
        answer:
          "A fixed first-release scope, agreed in writing, that solves one complete slice of the process. Everything after that is funded by the value the first release already produced.",
      },
    ],
  },

  "web-development": {
    slug: "web-development",
    architecture: {
      title: "Rendered at the edge, measured in milliseconds",
      description:
        "A marketing site is a performance product. Content is authored where marketing can reach it, rendered statically where possible, and budgeted in CI so it cannot silently regress.",
      layers: [
        {
          title: "Authoring",
          caption: "Marketing ships without a developer",
          nodes: ["Headless CMS", "Preview builds", "Structured content", "Roles"],
        },
        {
          title: "Build & render",
          caption: "Static first, dynamic only where needed",
          nodes: ["Next.js App Router", "ISR", "Server components", "Image pipeline"],
          accent: true,
        },
        {
          title: "Delivery",
          caption: "Close to the visitor",
          nodes: ["Edge CDN", "Cache tags", "Redirect map", "Bot rules"],
        },
        {
          title: "Conversion",
          caption: "Instrumented, not guessed at",
          nodes: ["Forms API", "CRM handoff", "Consent-aware analytics", "A/B tests"],
        },
        {
          title: "Guardrails",
          caption: "Quality that holds after launch",
          nodes: ["Lighthouse CI", "Bundle budgets", "Accessibility tests", "Visual diffs"],
        },
      ],
    },
    roi: {
      headline: "Sub-second loads, higher conversion",
      payback: "Typical payback: 2–6 months",
      metrics: [
        { label: "Largest contentful paint", before: "4.1s", after: "0.8s" },
        { label: "Lighthouse performance", before: "38", after: "99" },
        {
          label: "Form conversion rate",
          before: "1.4%",
          after: "3.1%",
          note: "Same traffic mix",
        },
        { label: "Time to publish a page", before: "5 days", after: "10 minutes" },
        { label: "Organic sessions", before: "baseline", after: "+64%" },
      ],
    },
    screenshots: [
      {
        id: "web-cms",
        caption: "Authoring — structured content with live preview",
        aspect: "16 / 10",
      },
      {
        id: "web-vitals",
        caption: "Core Web Vitals — field data by route and device",
        aspect: "16 / 10",
      },
      {
        id: "web-budgets",
        caption: "CI performance budgets blocking a regressing pull request",
        aspect: "16 / 10",
      },
    ],
    demo: {
      id: "web-demo",
      title: "Publishing a page and watching it go live",
      duration: "1:50",
      synopsis:
        "An editor changes copy in the CMS, previews it, publishes, and the edge cache invalidates by tag — with the performance budget check shown in CI alongside.",
    },
    cta: {
      headline: "Send us your URL",
      body: "You will get a specific read on what is costing you load time and conversion, with the fixes ordered by impact. No generic audit template.",
      action: "Request a site teardown",
    },
    faqs: [
      {
        question: "Can our team keep editing content?",
        answer:
          "That is the point of the CMS layer. Content types are modelled around what marketing actually publishes, with preview and roles, so routine changes never queue behind engineering.",
      },
      {
        question: "Do you work with our existing brand and design?",
        answer:
          "Yes. We implement to a design system — yours if you have one, ours if you do not — and hand over the tokens and components either way.",
      },
      {
        question: "How do you keep it fast a year later?",
        answer:
          "Performance budgets run in CI. A pull request that pushes the bundle or LCP past the agreed threshold fails, so regressions are caught before they ship rather than after a quarterly audit.",
      },
    ],
  },

  "mobile-apps": {
    slug: "mobile-apps",
    architecture: {
      title: "Offline-first, because signal is not a requirement you control",
      description:
        "In the field, the network is the least reliable component. The local database is the source of truth for the session, and sync reconciles deterministically when connectivity returns.",
      layers: [
        {
          title: "Device",
          caption: "Full function with no connection",
          nodes: ["React Native app", "Local DB", "Media queue", "Device sensors"],
        },
        {
          title: "Sync",
          caption: "Deterministic reconciliation",
          nodes: ["Change log", "Conflict resolution", "Delta transfer", "Retry queue"],
          accent: true,
        },
        {
          title: "Backend",
          caption: "One API for every client",
          nodes: ["Sync API", "Auth / MDM", "Object storage", "Push service"],
        },
        {
          title: "Integration",
          caption: "Field work reaching the business",
          nodes: ["ERP / FSM writes", "Scheduling", "Reporting feed", "Webhooks"],
        },
        {
          title: "Release",
          caption: "Fleet management as a first-class concern",
          nodes: ["OTA updates", "Store pipelines", "Crash reporting", "Feature flags"],
        },
      ],
    },
    roi: {
      headline: "Field data latency: days → minutes",
      payback: "Typical payback: 4–9 months",
      metrics: [
        { label: "Field data latency", before: "2–3 days", after: "under 2 minutes" },
        { label: "Paper forms per technician per week", before: "45", after: "0" },
        {
          label: "Jobs completed per technician per day",
          before: "5.2",
          after: "7.1",
        },
        { label: "Re-visits caused by missing information", before: "14%", after: "3%" },
        { label: "Data lost in dead zones", before: "occasional", after: "none" },
      ],
    },
    screenshots: [
      {
        id: "mobile-job",
        caption: "Job view — checklist, capture and signature, fully offline",
        aspect: "9 / 16",
      },
      {
        id: "mobile-sync",
        caption: "Sync state — queued changes and conflict resolution",
        aspect: "9 / 16",
      },
      {
        id: "mobile-dispatch",
        caption: "Dispatch console — live fleet and job status",
        aspect: "16 / 10",
      },
    ],
    demo: {
      id: "mobile-demo",
      title: "A job completed in a dead zone",
      duration: "2:15",
      synopsis:
        "A technician works a full job with airplane mode on — checklist, photos, parts, signature — then reconnects and watches the queue drain and dispatch update.",
    },
    cta: {
      headline: "Describe one day in the field",
      body: "Walk us through a technician's shift and we will map which parts belong in an app, which belong on paper, and what sync has to guarantee.",
      action: "Book a field-workflow session",
    },
    faqs: [
      {
        question: "Native or cross-platform?",
        answer:
          "React Native for almost everything, because one codebase serving both platforms is worth more than marginal native performance. Where a feature genuinely needs it, we drop to a native module for that piece only.",
      },
      {
        question: "What happens when two people edit the same job?",
        answer:
          "Conflicts are resolved by explicit rules per field — last-write-wins where it is safe, and a surfaced conflict where it is not. Silent overwrites are never the default.",
      },
      {
        question: "Do we have to publish to the app stores?",
        answer:
          "Not for internal fleets. We can distribute through your MDM with over-the-air updates, which also removes store review from your release cycle.",
      },
    ],
  },

  "saas-products": {
    slug: "saas-products",
    architecture: {
      title: "Multi-tenant from the first commit",
      description:
        "Tenancy, billing and metering are architectural decisions, not features to add at Series A. Retrofitting isolation into a single-tenant prototype costs more than building it correctly on day one.",
      layers: [
        {
          title: "Tenancy",
          caption: "Isolation you can prove to a security review",
          nodes: ["Tenant context", "Row-level security", "Per-tenant config", "Data residency"],
          accent: true,
        },
        {
          title: "Product",
          caption: "The thing customers pay for",
          nodes: ["App surface", "Admin console", "Public API", "Webhooks"],
        },
        {
          title: "Commercial",
          caption: "Revenue mechanics as code",
          nodes: ["Stripe billing", "Usage metering", "Plan entitlements", "Trials / dunning"],
        },
        {
          title: "Platform",
          caption: "Scales per tenant, not per deploy",
          nodes: ["Kubernetes", "Postgres", "Queue workers", "Object storage"],
        },
        {
          title: "Growth",
          caption: "Instrumented from launch",
          nodes: ["Product analytics", "Feature flags", "Onboarding flows", "SLA monitoring"],
        },
      ],
    },
    roi: {
      headline: "MVP in weeks, not quarters",
      payback: "Typical payback: first paying cohort",
      metrics: [
        { label: "Time to first paying customer", before: "9 months", after: "11 weeks" },
        {
          label: "Onboarding a new tenant",
          before: "manual, 3 days",
          after: "self-serve, 4 minutes",
        },
        { label: "Gross margin per tenant", before: "41%", after: "78%" },
        { label: "Engineering time on billing questions", before: "6h/wk", after: "20m/wk" },
        { label: "Security review pass", before: "blocked", after: "cleared" },
      ],
    },
    screenshots: [
      {
        id: "saas-app",
        caption: "Product surface — tenant-scoped workspace",
        aspect: "16 / 10",
      },
      {
        id: "saas-billing",
        caption: "Billing and entitlements — plans, usage and overage",
        aspect: "16 / 10",
      },
      {
        id: "saas-admin",
        caption: "Operator console — tenants, health and impersonation with audit",
        aspect: "16 / 10",
      },
    ],
    demo: {
      id: "saas-demo",
      title: "Signup to first invoice",
      duration: "2:45",
      synopsis:
        "A new tenant self-provisions, hits a plan limit, upgrades, and generates metered usage — with the operator console showing isolation holding throughout.",
    },
    cta: {
      headline: "Have a product idea and a first customer?",
      body: "That is the ideal starting point. We scope a first release you can charge for, and design the tenancy model to survive the tenth customer.",
      action: "Scope an MVP",
    },
    faqs: [
      {
        question: "Shared database or one per tenant?",
        answer:
          "Shared schema with row-level security by default — it is the cheapest to operate and passes most security reviews. Regulated customers who require physical separation get a dedicated schema or database on the same codebase.",
      },
      {
        question: "Can we start single-tenant and add tenancy later?",
        answer:
          "You can, and it is consistently the most expensive shortcut in this category. Tenant context threaded through from the first commit costs days; retrofitting it costs months and a data migration.",
      },
      {
        question: "Do you help after launch?",
        answer:
          "Yes — an SLA, a roadmap and ongoing engineering. Most of our SaaS clients keep us on for the two or three releases after launch, when the real usage patterns arrive.",
      },
    ],
  },
};
