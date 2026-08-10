import { CtaBanner } from "@/components/patterns/CtaBanner";
import { TechStackExplorer } from "@/components/stack/TechStackExplorer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCapabilities, getTechGraph } from "@/lib/cms";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Technology stack",
  description:
    "The connected stack behind every system we build — languages, AI and agents, vision and edge, interfaces, data and platform — and what each part is actually for.",
  path: "/stack",
  eyebrow: "Technology",
});

/** Choices we are willing to defend in writing, rather than a logo wall. */
const PRINCIPLES = [
  {
    title: "Boring where it counts",
    body: "Postgres, Docker, plain SQL. The interesting engineering belongs in your domain, not in the infrastructure underneath it.",
  },
  {
    title: "Model-agnostic",
    body: "Retrieval and evaluation layers do not care which model wins. Swapping is a configuration change, so we are never locked to one vendor's roadmap.",
  },
  {
    title: "Your account, your repository",
    body: "Everything is deployed into infrastructure you own, defined as code. There is no version of this where you cannot leave.",
  },
  {
    title: "Reached for, not defaulted to",
    body: "Kubernetes when scale genuinely calls for it. A single container when it does not. The second case is more common than vendors admit.",
  },
] as const;

export default async function StackPage() {
  const [{ nodes, edges }, capabilities] = await Promise.all([
    getTechGraph(),
    getCapabilities(),
  ]);

  return (
    <>
      <PageHeader
        kicker="Technology"
        title="The knowledge graph."
        lede="Every system draws on a connected stack. Move your cursor through the graph, or pick any node from the index to see what it does and where we use it."
      />

      <Section id="graph">
        <TechStackExplorer
          nodes={nodes}
          edges={edges}
          capabilities={capabilities}
        />
      </Section>

      <Section id="principles" rule={false}>
        <SectionHeader
          num="01"
          kicker="How we choose"
          title="Four rules behind the list."
          className="mb-12"
        />
        <ul className="grid grid-hairline grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {PRINCIPLES.map((principle) => (
            <li key={principle.title} className="flex min-h-[220px] flex-col bg-ground p-7">
              <h3 className="text-xl font-extrabold tracking-[-0.02em]">
                {principle.title}
              </h3>
              <p className="mt-auto text-sm text-ink-mute">{principle.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBanner
        headline="Curious whether your stack and ours can meet in the middle?"
        body="They usually can. Integration at the API and data layer is most of what we do."
      />
    </>
  );
}
