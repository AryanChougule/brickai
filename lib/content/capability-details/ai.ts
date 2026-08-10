import type { CapabilityDetail } from "@/lib/types";

/** Deep-dive content for the AI and model-centric capabilities. */
export const aiCapabilityDetails: Record<string, CapabilityDetail> = {
  "ai-chatbots": {
    slug: "ai-chatbots",
    architecture: {
      title: "Grounded conversation, with an escalation path",
      description:
        "Every answer is retrieved before it is generated, and every generation is checked before it is sent. The escalation branch is a first-class path, not a fallback.",
      layers: [
        {
          title: "Channels",
          caption: "One brain, many front doors",
          nodes: ["Web widget", "WhatsApp", "Slack / Teams", "Email", "Voice"],
        },
        {
          title: "Orchestration",
          caption: "Intent, state and tool selection per turn",
          nodes: [
            "Intent router",
            "Conversation state",
            "LangGraph policy",
            "Tool registry",
          ],
        },
        {
          title: "Retrieval & reasoning",
          caption: "Grounding first, generation second",
          nodes: ["Hybrid search", "Reranker", "LLM", "Citation builder"],
          accent: true,
        },
        {
          title: "Systems of record",
          caption: "Reads and writes, scoped per user",
          nodes: ["Order DB", "CRM", "Ticketing", "Knowledge base"],
        },
        {
          title: "Guardrails & handoff",
          caption: "What the model may not do alone",
          nodes: [
            "PII redaction",
            "Confidence gate",
            "Human handoff",
            "Transcript audit",
          ],
        },
      ],
    },
    roi: {
      headline: "60–80% of tier-1 tickets deflected",
      payback: "Typical payback: 4–7 months",
      metrics: [
        {
          label: "First response time",
          before: "6h 20m",
          after: "9s",
          note: "Median across all channels",
        },
        { label: "Tier-1 volume reaching an agent", before: "100%", after: "24%" },
        {
          label: "Cost per resolved contact",
          before: "$5.90",
          after: "$0.71",
          note: "Blended, incl. inference",
        },
        { label: "After-hours coverage", before: "0%", after: "100%" },
        {
          label: "Answer consistency (audited sample)",
          before: "72%",
          after: "97%",
        },
      ],
    },
    screenshots: [
      {
        id: "chat-console",
        caption: "Agent console — live conversation with retrieved citations",
        aspect: "16 / 10",
      },
      {
        id: "chat-eval",
        caption: "Evaluation dashboard — deflection and escalation by intent",
        aspect: "16 / 10",
      },
      {
        id: "chat-handoff",
        caption: "Handoff view — confidence gate and full transcript",
        aspect: "16 / 10",
      },
    ],
    demo: {
      id: "chat-demo",
      title: "Resolving a returns request end to end",
      duration: "2:10",
      synopsis:
        "A customer asks about a return, the assistant retrieves the order, checks policy, issues the label, and files the ticket — with the escalation branch shown for a case it declines to handle.",
    },
    cta: {
      headline: "Bring us your ticket export",
      body: "We cluster a month of real tickets and tell you which intents are safely deflectable before you commit to a build.",
      action: "Book a deflection review",
    },
    faqs: [
      {
        question: "How do you stop it inventing answers?",
        answer:
          "Retrieval is mandatory: the model only sees content pulled from your sources, every claim carries a citation, and answers below the confidence gate are routed to a person instead of sent.",
      },
      {
        question: "Where does our data go?",
        answer:
          "Into your own vector store and your own model endpoint. We deploy inside your cloud account or VPC, and conversation data is never used for provider training.",
      },
      {
        question: "What happens to existing agents?",
        answer:
          "They stop doing password resets and start doing the work that needs judgment. Every deployment we have shipped raised agent-handled complexity and cut headcount pressure rather than headcount.",
      },
    ],
  },

  "computer-vision": {
    slug: "computer-vision",
    architecture: {
      title: "Inference at the line, evidence in the cloud",
      description:
        "Decisions happen on the edge in single-digit milliseconds. The cloud gets the evidence, the metrics and the training set — never the real-time responsibility.",
      layers: [
        {
          title: "Capture",
          caption: "Deterministic optics and triggering",
          nodes: [
            "Area / line-scan cameras",
            "Strobe lighting",
            "Encoder trigger",
            "Calibration target",
          ],
        },
        {
          title: "Edge inference",
          caption: "Beside the conveyor, no network in the loop",
          nodes: ["Frame grabber", "TensorRT engine", "Tracker", "Decision rules"],
          accent: true,
        },
        {
          title: "Actuation",
          caption: "The verdict leaves the software",
          nodes: ["PLC signal", "Reject actuator", "Andon light", "Line stop"],
        },
        {
          title: "Evidence store",
          caption: "Every judgment is reviewable",
          nodes: ["Image archive", "Verdict log", "Batch genealogy", "Audit export"],
        },
        {
          title: "Model lifecycle",
          caption: "The loop that keeps accuracy from decaying",
          nodes: [
            "Review UI",
            "Labelling queue",
            "Retraining",
            "Shadow deployment",
          ],
        },
      ],
    },
    roi: {
      headline: "Defect escape rate cut by 90%+",
      payback: "Typical payback: 5–9 months",
      metrics: [
        { label: "Defect escape rate", before: "3.1%", after: "0.2%" },
        {
          label: "Units inspected",
          before: "2% sample",
          after: "100%",
          note: "At 400 units/min line speed",
        },
        { label: "Inspection labour per shift", before: "3 FTE", after: "0.5 FTE" },
        { label: "Scrap attributable to late detection", before: "$41k/mo", after: "$6k/mo" },
        { label: "Decision latency", before: "manual, minutes", after: "8ms" },
      ],
    },
    screenshots: [
      {
        id: "vision-live",
        caption: "Line-side view — inspection overlay with per-unit verdict",
        aspect: "16 / 9",
      },
      {
        id: "vision-review",
        caption: "QA review queue — borderline calls escalated for labelling",
        aspect: "16 / 10",
      },
      {
        id: "vision-drift",
        caption: "Model monitoring — accuracy and drift by shift and SKU",
        aspect: "16 / 10",
      },
    ],
    demo: {
      id: "vision-demo",
      title: "Defect detection at 400 units per minute",
      duration: "2:40",
      synopsis:
        "A full pass over a packaging line: capture, inference, reject actuation, and the review UI where QA confirms the borderline cases that feed the next retraining run.",
    },
    cta: {
      headline: "Send us 500 images",
      body: "A labelled sample is enough for us to return a feasibility read: achievable accuracy, hardware needed, and where the hard cases will be.",
      action: "Request a feasibility read",
    },
    faqs: [
      {
        question: "How many images do you need to start?",
        answer:
          "Between 200 and 2,000 per defect class for a first usable model. Where defects are genuinely rare we bootstrap with synthetic and augmented data, then replace it as real examples accumulate.",
      },
      {
        question: "Does it need to reach the internet?",
        answer:
          "No. Inference and actuation run entirely on the edge device. If the uplink drops, the line keeps running and evidence is queued locally until it returns.",
      },
      {
        question: "What happens when the product changes?",
        answer:
          "New SKUs go through the same review-and-retrain loop that keeps existing accuracy from decaying — typically a few days from first samples to a shadow-deployed model.",
      },
    ],
  },

  "llm-applications": {
    slug: "llm-applications",
    architecture: {
      title: "Retrieval you can inspect, evaluation you can repeat",
      description:
        "The interesting engineering in an LLM application is not the prompt. It is the ingestion that makes documents retrievable and the evaluation that tells you a change was an improvement.",
      layers: [
        {
          title: "Ingestion",
          caption: "Documents become retrievable units",
          nodes: ["OCR / parsers", "Layout chunking", "Metadata extraction", "Dedupe"],
        },
        {
          title: "Index",
          caption: "Two retrieval paths, one ranking",
          nodes: ["Vector store", "BM25 index", "Entity graph", "ACL filters"],
        },
        {
          title: "Reasoning",
          caption: "Grounded generation with sources attached",
          nodes: ["Query rewrite", "Reranker", "LLM", "Citation binding"],
          accent: true,
        },
        {
          title: "Surfaces",
          caption: "Where the work actually happens",
          nodes: ["Search UI", "Draft assistant", "Review workspace", "API"],
        },
        {
          title: "Evaluation",
          caption: "Regression testing for non-deterministic systems",
          nodes: ["Golden set", "LLM-as-judge", "Human review", "Prompt versioning"],
        },
      ],
    },
    roi: {
      headline: "Document work 5–10× faster",
      payback: "Typical payback: 3–6 months",
      metrics: [
        { label: "Contract review time", before: "3h 40m", after: "26m" },
        { label: "Search time to first useful result", before: "12m", after: "20s" },
        {
          label: "Reviewer throughput",
          before: "9 docs/day",
          after: "58 docs/day",
        },
        {
          label: "Answers with a traceable source",
          before: "n/a",
          after: "100%",
          note: "Citation is a hard requirement",
        },
        { label: "Onboarding time for new reviewers", before: "6 weeks", after: "9 days" },
      ],
    },
    screenshots: [
      {
        id: "llm-workspace",
        caption: "Review workspace — clause extraction with source highlighting",
        aspect: "16 / 10",
      },
      {
        id: "llm-search",
        caption: "Semantic search across a document archive",
        aspect: "16 / 10",
      },
      {
        id: "llm-eval",
        caption: "Evaluation run — golden-set scores across prompt versions",
        aspect: "16 / 10",
      },
    ],
    demo: {
      id: "llm-demo",
      title: "Extracting obligations from a 90-page contract",
      duration: "3:05",
      synopsis:
        "Ingestion through to review: layout-aware chunking, hybrid retrieval, clause extraction with citations, and the evaluation run that gates the prompt change into production.",
    },
    cta: {
      headline: "Give us ten documents and a question",
      body: "We build a working retrieval prototype over your own material and show you where it succeeds and where it will need engineering.",
      action: "Request a retrieval prototype",
    },
    faqs: [
      {
        question: "Can it work over scanned paper?",
        answer:
          "Yes. OCR with layout reconstruction sits at the front of ingestion. Quality depends on the scans, so we measure extraction accuracy on your worst documents rather than your best.",
      },
      {
        question: "How do you know a prompt change helped?",
        answer:
          "A golden set of questions with human-approved answers runs on every change. A version ships only when it beats the incumbent on that set — the same discipline as a test suite.",
      },
      {
        question: "Which model do you use?",
        answer:
          "Whichever wins on your evaluation set at acceptable cost and latency. The retrieval and evaluation layers are model-agnostic, so swapping is a configuration change, not a rebuild.",
      },
    ],
  },

  "agentic-ai": {
    slug: "agentic-ai",
    architecture: {
      title: "Plan, act, verify — with a person on the exceptions",
      description:
        "An agent that can act needs a verification step and a blast radius. Both are architecture, not prompting: scoped tools, replayable runs, and a queue for anything that fails a check.",
      layers: [
        {
          title: "Triggers",
          caption: "What starts a run",
          nodes: ["Inbound email", "Webhook", "Schedule", "Operator request"],
        },
        {
          title: "Planner",
          caption: "Decompose, then commit to a step",
          nodes: ["Task graph", "State machine", "Budget guard", "Retry policy"],
          accent: true,
        },
        {
          title: "Tools",
          caption: "Every capability is scoped and logged",
          nodes: ["MCP servers", "ERP / TMS writes", "Search", "Calculators"],
        },
        {
          title: "Verification",
          caption: "The step that makes it safe to automate",
          nodes: ["Schema checks", "Business rules", "Cross-check pass", "Confidence score"],
        },
        {
          title: "Human loop",
          caption: "Exceptions only, with full context",
          nodes: ["Approval queue", "Run replay", "Override log", "Feedback capture"],
        },
      ],
    },
    roi: {
      headline: "Whole processes run unattended",
      payback: "Typical payback: 4–8 months",
      metrics: [
        { label: "Time per freight quote", before: "4h", after: "6m" },
        {
          label: "Runs completing without a human",
          before: "0%",
          after: "83%",
          note: "Remainder routed to the approval queue",
        },
        { label: "Quotes issued per week", before: "120", after: "740" },
        { label: "Pricing errors reaching the customer", before: "2.4%", after: "0.3%" },
        { label: "Coverage window", before: "business hours", after: "24/7" },
      ],
    },
    screenshots: [
      {
        id: "agent-runs",
        caption: "Run list — status, cost and verification result per run",
        aspect: "16 / 10",
      },
      {
        id: "agent-trace",
        caption: "Run replay — every plan step, tool call and check",
        aspect: "16 / 10",
      },
      {
        id: "agent-queue",
        caption: "Approval queue — exceptions with the reason they stopped",
        aspect: "16 / 10",
      },
    ],
    demo: {
      id: "agent-demo",
      title: "An RFQ arriving and a quote filing itself",
      duration: "2:55",
      synopsis:
        "An inbound RFQ is parsed, lanes and capacity checked, a quote drafted and priced, verification run, and the result written to the TMS — with one exception surfaced for sign-off.",
    },
    cta: {
      headline: "Pick one process that eats a day a week",
      body: "We map it into a task graph and tell you honestly which steps an agent should own and which ones it should never touch.",
      action: "Map a process with us",
    },
    faqs: [
      {
        question: "What stops it doing something expensive?",
        answer:
          "Tools are scoped per run with hard limits — value ceilings, rate caps and a token budget. Anything outside the envelope fails verification and lands in the approval queue instead of executing.",
      },
      {
        question: "Can we see why it did what it did?",
        answer:
          "Every run is replayable step by step: the plan, each tool call with its arguments and response, each check and its verdict. Audit gets a permanent record, not a screenshot.",
      },
      {
        question: "Is this just RPA with a model attached?",
        answer:
          "No. RPA replays fixed clicks and breaks when the screen moves. An agent reasons about state and calls APIs, which is why it can handle the judgment steps that made the process resist automation.",
      },
    ],
  },
};
