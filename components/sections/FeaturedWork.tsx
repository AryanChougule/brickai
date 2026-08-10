import Link from "next/link";
import { Reveal } from "@/animations/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getFeaturedProjects } from "@/lib/cms";
import { homeSection } from "@/lib/site";

export async function FeaturedWork() {
  const projects = await getFeaturedProjects();
  const { id, num, label } = homeSection("work");

  return (
    <Section id={id}>
      <SectionHeader
        num={num}
        kicker={label}
        title="Proof over promises."
        action={
          <Link
            href="/work"
            className="text-[13px] font-extrabold text-accent-text hover:text-accent-soft"
          >
            All case studies →
          </Link>
        }
        className="mb-12"
      />

      <div className="flex flex-col grid-hairline">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.05}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
