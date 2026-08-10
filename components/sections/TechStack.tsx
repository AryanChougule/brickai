import Link from "next/link";
import { TechStackExplorer } from "@/components/stack/TechStackExplorer";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCapabilities, getTechGraph } from "@/lib/cms";
import { homeSection } from "@/lib/site";

export async function TechStack() {
  const [{ nodes, edges }, capabilities] = await Promise.all([
    getTechGraph(),
    getCapabilities(),
  ]);
  const { id, num, label } = homeSection("stack");

  return (
    <Section id={id}>
      <SectionHeader
        num={num}
        kicker={label}
        title="The knowledge graph."
        lede="Every system draws on a connected stack. Move your cursor through it, or pick a node to see where we use it."
        action={
          <Link
            href="/stack"
            className="text-[13px] font-extrabold text-accent-text hover:text-accent-soft"
          >
            Full stack index →
          </Link>
        }
        className="mb-12"
      />

      <TechStackExplorer
        nodes={nodes}
        edges={edges}
        capabilities={capabilities}
        showGroups={false}
      />
    </Section>
  );
}
