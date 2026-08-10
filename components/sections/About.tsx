import { Reveal } from "@/animations/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { aboutPillars } from "@/lib/content/process";
import { homeSection } from "@/lib/site";

export function About() {
  const { id, num, label } = homeSection("about");

  return (
    <Section id={id}>
      <SectionHeader
        num={num}
        kicker={label}
        title="Built brick by brick."
        className="mb-12"
      />

      <ul className="grid grid-hairline grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
        {aboutPillars.map((pillar, index) => (
          <Reveal
            key={pillar.title}
            as="li"
            delay={index * 0.06}
            className="flex min-h-[240px] flex-col bg-ground p-7"
          >
            <h3 className="text-micro uppercase text-accent-text">
              {pillar.title}
            </h3>
            <p className="mt-auto text-base text-ink-dim">{pillar.body}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
