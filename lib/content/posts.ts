import type { Post } from "@/lib/types";

/**
 * Engineering journal. Shaped as structured blocks rather than raw markup so a
 * CMS can populate the same fields later without touching the renderer.
 */
export const posts: Post[] = [
  {
    slug: "half-of-computer-vision-is-lighting",
    title: "Half of computer vision is lighting",
    excerpt:
      "Two vendor trials failed on the same packaging line before we touched a model. The fix was optics, and it usually is.",
    date: "2026-07-14",
    readingTime: "6 min",
    author: { name: "BrickAI Engineering", role: "Vision practice" },
    tags: ["Computer Vision", "Manufacturing", "Edge AI"],
    body: [
      {
        type: "paragraph",
        text: "We were the third vendor on a packaging line running 400 units a minute. The two before us had shipped competent models and both had failed — one could not hold accuracy through a SKU changeover, the other needed a network round trip the line speed did not permit. The client's reasonable conclusion was that the problem was hard. It was, but not where they thought.",
      },
      {
        type: "paragraph",
        text: "We spent the first two weeks not training anything. We spent them on lighting, strobe timing and encoder triggering.",
      },
      { type: "heading", text: "A model cannot recover what the capture never had" },
      {
        type: "paragraph",
        text: "The failed trials were working from frames with motion blur on one edge and a specular hotspot that moved with ambient light through the day. A model trained on those frames learns the hotspot. It scores well in validation because validation came from the same afternoon, and it degrades the moment the sun moves or the line speeds up.",
      },
      {
        type: "list",
        items: [
          "Strobe synchronised to an encoder pulse, not a timer — the unit is always in the same place in frame",
          "Cross-polarised lighting to kill the specular return off shrink wrap",
          "A calibration target imaged at the start of every shift, logged and diffed",
          "Fixed exposure, because auto-exposure is a second uncontrolled variable",
        ],
      },
      {
        type: "paragraph",
        text: "None of that is machine learning. All of it moved accuracy more than any architecture change we made afterwards.",
      },
      { type: "heading", text: "What the numbers did" },
      {
        type: "paragraph",
        text: "On the original captures, our first model reached 91% on the defect classes that mattered. On the re-engineered captures, the same architecture and roughly the same training set reached 99.4%, and — more importantly — held it across changeovers and across the day.",
      },
      {
        type: "quote",
        text: "If your accuracy moves when the weather does, you have a capture problem wearing a model problem's clothes.",
      },
      { type: "heading", text: "The order of operations" },
      {
        type: "paragraph",
        text: "We now refuse to quote a vision project on accuracy numbers until we have seen images from the actual installation under actual conditions. Not a sample from the vendor's lab, and not the client's best photographs. The worst 10% of real frames tells you what the job is.",
      },
      {
        type: "list",
        items: [
          "Fix the optics and the trigger",
          "Establish a labelling loop with the people who know the defects",
          "Only then choose a model, and choose the smallest one that clears the bar",
          "Design the retraining path before the first deployment, not after the first drift",
        ],
      },
      {
        type: "paragraph",
        text: "It is a less interesting story than a novel architecture. It is also the reason the line has held 0.2% escape for fourteen months.",
      },
    ],
  },
  {
    slug: "agents-need-a-blast-radius",
    title: "Agents need a blast radius, not a better prompt",
    excerpt:
      "What made a freight quoting agent safe to run overnight was not the model. It was scoped tools, verification and replay.",
    date: "2026-06-02",
    readingTime: "8 min",
    author: { name: "BrickAI Engineering", role: "Agent systems" },
    tags: ["Agentic AI", "Logistics", "Architecture"],
    body: [
      {
        type: "paragraph",
        text: "The question every operations director asks about an agent is some version of: what stops it doing something expensive? Nobody has ever been reassured by an answer about prompt engineering, and they are right not to be.",
      },
      { type: "heading", text: "Three mechanisms, none of them prompts" },
      {
        type: "paragraph",
        text: "On the freight quoting build, the agent could read email, look up lanes, check capacity, price a load and write to the TMS. It ran unattended overnight on 83% of runs. Three pieces of architecture made that acceptable.",
      },
      {
        type: "list",
        items: [
          "Scoped tools. Each tool has a hard envelope — value ceilings, rate caps, a token budget per run. An action outside it does not get refused by the model; it fails at the tool boundary.",
          "Verification as a separate pass. Schema checks, margin rules, and a cross-check against comparable historical lanes. The agent's own confidence is an input, never the decision.",
          "Replay. Every run records the plan, each tool call with arguments and response, and each check verdict. Not a log line — a reconstructable run.",
        ],
      },
      {
        type: "paragraph",
        text: "The order matters. Scoping limits what can go wrong, verification catches what does, and replay is what makes the operations team willing to find out.",
      },
      { type: "heading", text: "The exception queue is the product" },
      {
        type: "paragraph",
        text: "We designed the 17% before the 83%. An exception arrives with the drafted quote, the rule that stopped it, the comparable lanes and the full run trace. A planner decides in about forty seconds. That is what makes an unattended process politically survivable — the humans left in the loop are doing judgment work, not archaeology.",
      },
      {
        type: "quote",
        text: "Design the exception path first. If it is unpleasant to work, the automation gets switched off in month three regardless of how well it performs.",
      },
      { type: "heading", text: "What we got wrong" },
      {
        type: "paragraph",
        text: "Our first version let the planner override without recording why. Six weeks later we had a pile of overrides and no signal to learn from. Capturing a one-line reason on every override was a small change that turned the queue into the most valuable training data on the project.",
      },
      {
        type: "code",
        language: "python",
        code: `# Every tool call carries the run's envelope. Exceeding it is a\n# tool-boundary failure, not a model decision.\n@tool(scope="quote.write", max_value_usd=25_000, rate_limit="30/min")\ndef file_quote(run: Run, quote: Quote) -> QuoteReceipt:\n    verify(quote, rules=MARGIN_RULES, comparables=lanes_for(quote))\n    return tms.submit(quote, idempotency_key=run.event_id)`,
      },
      {
        type: "paragraph",
        text: "The idempotency key on the last line is doing quiet, important work: a retried or replayed run files the same quote once. Safe replay is what lets you fix a bad night's runs without creating a worse morning.",
      },
    ],
  },
  {
    slug: "retrofit-beats-replacement",
    title: "Retrofit beats replacement on the plant floor",
    excerpt:
      "Machines that predate any usable protocol are the normal case, not the disqualifier. The timeline does not care how a signal was acquired.",
    date: "2026-04-21",
    readingTime: "5 min",
    author: { name: "BrickAI Engineering", role: "Industrial practice" },
    tags: ["Factory Automation", "Manufacturing", "Data Platforms"],
    body: [
      {
        type: "paragraph",
        text: "The most common reason a plant tells us it cannot start is machine age. Half the floor has no network port, let alone OPC-UA. It is offered as a blocker. It is closer to a routine engineering condition.",
      },
      { type: "heading", text: "Signals from the outside of a machine" },
      {
        type: "paragraph",
        text: "You do not need the controller's cooperation to know what a machine is doing. On a fleet spanning fifteen years of designs, we have read useful state from sensors bolted on externally:",
      },
      {
        type: "list",
        items: [
          "Current clamps on the drive — running, idling, or loaded, at very high confidence",
          "Vibration pucks on bearing housings — the earliest predictive signal available on rotating equipment",
          "Light-barrier or proximity counters at the outfeed — actual throughput, independent of the machine's own count",
          "Thermocouples where thermal drift precedes a quality problem",
        ],
      },
      {
        type: "paragraph",
        text: "Above the historian, none of this is distinguishable from a native protocol read. Same clock, same schema, same queries. That is the whole point of putting a unified namespace between acquisition and everything else.",
      },
      { type: "heading", text: "What retrofit will not give you" },
      {
        type: "paragraph",
        text: "It will not give you setpoints, recipe data or fault codes. If the use case genuinely needs those, retrofit is not a substitute and we say so. Most first-phase use cases — OEE, downtime reasons, predictive maintenance — do not need them.",
      },
      {
        type: "quote",
        text: "Read first, prove the data, then agree an explicit write scope with the controls engineer. In that order, every time.",
      },
      {
        type: "paragraph",
        text: "One line, instrumented end to end, is enough to establish whether the numbers are real. It also costs little enough that being wrong is survivable — which is the only honest way to start a plant-wide programme.",
      },
    ],
  },
  {
    slug: "multi-tenancy-is-not-a-later-problem",
    title: "Multi-tenancy is not a later problem",
    excerpt:
      "Threading tenant context through from the first commit costs days. Retrofitting it costs months and a data migration.",
    date: "2026-03-09",
    readingTime: "6 min",
    author: { name: "BrickAI Engineering", role: "Platform practice" },
    tags: ["SaaS Products", "Architecture", "Postgres"],
    body: [
      {
        type: "paragraph",
        text: "Every few months someone arrives with a working single-tenant prototype, a first paying customer, and a second customer who is a direct competitor of the first. The prototype has no tenant column. This is the most expensive shortcut in product engineering, and it is almost always taken for good reasons.",
      },
      { type: "heading", text: "Why the retrofit is so bad" },
      {
        type: "paragraph",
        text: "Adding tenancy late is not one change. It is a schema migration, an audit of every query in the codebase, a rewrite of every background job's scope, a new authorisation model, and a data migration you cannot test against production because production is the data. We have quoted this work. It is routinely three to five months.",
      },
      {
        type: "paragraph",
        text: "Doing it at the start is a tenant column, a session variable, and row-level security policies. Days, not months.",
      },
      {
        type: "code",
        language: "sql",
        code: `-- Isolation enforced by the database, not by every query author\nALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY tenant_isolation ON work_orders\n  USING (tenant_id = current_setting('app.tenant_id')::uuid);\n\n-- A query that forgets the tenant filter returns nothing,\n-- rather than returning everything.`,
      },
      {
        type: "paragraph",
        text: "The last comment is the argument. With row-level security, forgetting the filter fails closed. Without it, forgetting the filter is a cross-tenant data leak that passes code review because it looks like every other query.",
      },
      { type: "heading", text: "Shared schema until proven otherwise" },
      {
        type: "paragraph",
        text: "Shared schema with row-level security is cheapest to operate and passes most security reviews. Customers with a genuine physical-separation requirement get a dedicated schema or database on the same codebase — a deployment decision, not a fork.",
      },
      {
        type: "list",
        items: [
          "Tenant context resolved once, at the edge of the request",
          "Row-level security as the enforcement point, not application code",
          "Background jobs carry tenant context explicitly — they are the usual leak",
          "Impersonation for support, always logged, never silent",
        ],
      },
      {
        type: "paragraph",
        text: "If you are pre-first-customer and choosing between shipping a week earlier and threading tenant context, thread the tenant context. It is the one architectural decision in this category that does not get cheaper to fix later.",
      },
    ],
  },
];

export const sortedPosts = [...posts].sort(
  (a, b) => Date.parse(b.date) - Date.parse(a.date),
);
