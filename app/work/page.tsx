import { Reveal } from "@/animations/Reveal";
import { CtaBanner } from "@/components/patterns/CtaBanner";
import { ProjectCard } from "@/components/work/ProjectCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getProjects } from "@/lib/cms";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Case studies",
  description:
    "Delivered systems with the numbers attached: vision QC at 400 units a minute, an autonomous freight quoting agent, a multi-tenant OEE platform and more.",
  path: "/work",
  eyebrow: "Featured projects",
});

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        kicker="Featured projects"
        title="Proof over promises."
        lede="Each case study states the problem, what we actually did, and the numbers it moved. Client names are withheld until approved for publication."
      />

      <div className="flex flex-col grid-hairline border-x-0 border-t-0">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.04}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      <CtaBanner
        headline="Want the version of this with your numbers in it?"
        body="Discovery starts with your baseline. Without it, any figure we quote is someone else's."
      />
    </>
  );
}
