import type { TechEdge, TechGroup, TechNode } from "@/lib/types";

/** Group labels and accent treatment for the stack legend and filters. */
export const techGroups: Record<TechGroup, { label: string; caption: string }> =
  {
    languages: {
      label: "Languages & runtime",
      caption: "What everything else is written in",
    },
    ai: { label: "AI & agents", caption: "Reasoning, retrieval and tool use" },
    vision: { label: "Vision & edge", caption: "Inference at the point of capture" },
    frontend: { label: "Interfaces", caption: "What people actually touch" },
    data: { label: "Data", caption: "Movement, storage and modelling" },
    infra: { label: "Platform", caption: "Where it runs, and how it stays up" },
  };

/**
 * Nodes for the force-directed knowledge graph. `hub` nodes render as filled
 * accent chips and are pulled toward the centre by the layout.
 */
export const techNodes: TechNode[] = [
  {
    id: "python",
    label: "Python",
    group: "languages",
    hub: true,
    blurb:
      "The default for models, pipelines and integration work. Typed, tested and packaged like production code rather than notebook output.",
    capabilities: [
      "computer-vision",
      "factory-automation",
      "enterprise-automation",
      "data-platforms",
    ],
  },
  {
    id: "typescript",
    label: "TypeScript",
    group: "languages",
    blurb:
      "Every interface and API surface we ship. Types are a design tool here, not decoration on top of JavaScript.",
    capabilities: ["web-development", "custom-software", "saas-products"],
  },
  {
    id: "fastapi",
    label: "FastAPI",
    group: "languages",
    blurb:
      "Service layer of choice for Python backends — schema-first, fast, and honest about async.",
    capabilities: ["api-integrations", "custom-software", "ai-chatbots"],
  },
  {
    id: "llms",
    label: "LLMs",
    group: "ai",
    hub: true,
    blurb:
      "Model-agnostic by design. Whichever model wins on your evaluation set at acceptable cost and latency is the one that ships.",
    capabilities: ["llm-applications", "ai-chatbots", "agentic-ai"],
  },
  {
    id: "rag",
    label: "RAG",
    group: "ai",
    blurb:
      "Hybrid retrieval with reranking and mandatory citations. The retrieval quality, not the prompt, decides whether an answer is usable.",
    capabilities: ["llm-applications", "ai-chatbots"],
  },
  {
    id: "langgraph",
    label: "LangGraph",
    group: "ai",
    blurb:
      "Agent orchestration as an explicit state machine, which is what makes a run replayable and a failure diagnosable.",
    capabilities: ["agentic-ai", "ai-chatbots"],
  },
  {
    id: "mcp",
    label: "MCP",
    group: "ai",
    blurb:
      "Model Context Protocol for tool exposure. One scoped, logged interface per capability instead of bespoke glue per model.",
    capabilities: ["agentic-ai", "llm-applications", "api-integrations"],
  },
  {
    id: "pytorch",
    label: "PyTorch",
    group: "vision",
    blurb:
      "Training and fine-tuning for vision models, with the export path to TensorRT designed in from the start.",
    capabilities: ["computer-vision"],
  },
  {
    id: "opencv",
    label: "OpenCV",
    group: "vision",
    blurb:
      "Everything around the model: calibration, tracking, preprocessing. Half of a vision project's accuracy lives here.",
    capabilities: ["computer-vision"],
  },
  {
    id: "nvidia",
    label: "NVIDIA edge",
    group: "vision",
    blurb:
      "Jetson and industrial GPUs beside the line, so inference and actuation never wait on a network round trip.",
    capabilities: ["computer-vision", "factory-automation"],
  },
  {
    id: "react",
    label: "React",
    group: "frontend",
    hub: true,
    blurb:
      "The interface layer across web, operator terminals and mobile. One mental model, three delivery targets.",
    capabilities: ["web-development", "custom-software", "saas-products"],
  },
  {
    id: "nextjs",
    label: "Next.js",
    group: "frontend",
    blurb:
      "App Router, server components and edge rendering. Static wherever possible, dynamic only where it earns its cost.",
    capabilities: ["web-development", "saas-products"],
  },
  {
    id: "react-native",
    label: "React Native",
    group: "frontend",
    blurb:
      "One codebase for both platforms, with native modules only where a feature genuinely requires them.",
    capabilities: ["mobile-apps"],
  },
  {
    id: "postgres",
    label: "Postgres",
    group: "data",
    blurb:
      "The default system of record. Row-level security is what makes multi-tenant isolation provable rather than promised.",
    capabilities: ["custom-software", "saas-products", "data-platforms"],
  },
  {
    id: "kafka",
    label: "Kafka",
    group: "data",
    blurb:
      "Durable, ordered, replayable transport. Replay is the feature that makes integration failure survivable.",
    capabilities: ["factory-automation", "data-platforms", "api-integrations"],
  },
  {
    id: "timescale",
    label: "TimescaleDB",
    group: "data",
    blurb:
      "Machine and sensor history at plant scale, queryable on the same clock as everything else on the floor.",
    capabilities: ["factory-automation", "data-platforms"],
  },
  {
    id: "dbt",
    label: "dbt",
    group: "data",
    blurb:
      "Transformations as version-controlled, tested SQL with generated lineage. Your repository, your models.",
    capabilities: ["data-platforms"],
  },
  {
    id: "opcua",
    label: "OPC-UA",
    group: "data",
    blurb:
      "Protocol translation at the cell, with retrofit sensors wherever a machine predates anything readable.",
    capabilities: ["factory-automation"],
  },
  {
    id: "docker",
    label: "Docker",
    group: "infra",
    blurb:
      "Identical artefacts from a developer laptop to an edge device to production. No environment drift.",
    capabilities: ["custom-software", "computer-vision", "api-integrations"],
  },
  {
    id: "kubernetes",
    label: "Kubernetes",
    group: "infra",
    hub: true,
    blurb:
      "Where multi-tenant platforms run. Reached for when scale genuinely calls for it, not by default.",
    capabilities: ["saas-products", "data-platforms"],
  },
  {
    id: "azure",
    label: "Azure",
    group: "infra",
    blurb:
      "Frequent home for regulated workloads, deployed inside the customer's own tenancy.",
    capabilities: ["data-platforms", "llm-applications", "enterprise-automation"],
  },
  {
    id: "aws",
    label: "AWS",
    group: "infra",
    blurb:
      "The other default. Infrastructure is defined as code either way, so the choice stays a choice.",
    capabilities: ["data-platforms", "saas-products", "api-integrations"],
  },
  {
    id: "stripe",
    label: "Stripe",
    group: "infra",
    blurb:
      "Billing, metering and entitlements as code — the commercial mechanics of a SaaS product, versioned like the rest of it.",
    capabilities: ["saas-products"],
  },
  {
    id: "vercel",
    label: "Vercel",
    group: "infra",
    blurb:
      "Edge delivery with cache-tag invalidation and preview builds per pull request.",
    capabilities: ["web-development"],
  },
];

/** Undirected edges. Each pair must reference ids that exist above. */
export const techEdges: TechEdge[] = [
  { from: "python", to: "fastapi" },
  { from: "python", to: "pytorch" },
  { from: "python", to: "opencv" },
  { from: "python", to: "llms" },
  { from: "python", to: "dbt" },
  { from: "python", to: "docker" },
  { from: "fastapi", to: "postgres" },
  { from: "fastapi", to: "docker" },
  { from: "fastapi", to: "mcp" },
  { from: "typescript", to: "react" },
  { from: "typescript", to: "nextjs" },
  { from: "typescript", to: "react-native" },
  { from: "react", to: "nextjs" },
  { from: "react", to: "react-native" },
  { from: "nextjs", to: "vercel" },
  { from: "nextjs", to: "postgres" },
  { from: "pytorch", to: "nvidia" },
  { from: "opencv", to: "nvidia" },
  { from: "nvidia", to: "docker" },
  { from: "docker", to: "kubernetes" },
  { from: "kubernetes", to: "azure" },
  { from: "kubernetes", to: "aws" },
  { from: "kubernetes", to: "stripe" },
  { from: "kafka", to: "timescale" },
  { from: "kafka", to: "opcua" },
  { from: "kafka", to: "aws" },
  { from: "timescale", to: "postgres" },
  { from: "dbt", to: "postgres" },
  { from: "dbt", to: "azure" },
  { from: "llms", to: "rag" },
  { from: "llms", to: "langgraph" },
  { from: "llms", to: "mcp" },
  { from: "llms", to: "azure" },
  { from: "rag", to: "postgres" },
  { from: "langgraph", to: "mcp" },
  { from: "react", to: "llms" },
  { from: "opcua", to: "timescale" },
  { from: "stripe", to: "nextjs" },
];
