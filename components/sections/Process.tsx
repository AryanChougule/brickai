import { Reveal } from "@/animations/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getPhases } from "@/lib/cms";
import { homeSection } from "@/lib/site";

export async function Process() {
  const phases = await getPhases();
  const { id, num, label } = homeSection("process");

  return (
    <Section id={id}>
      <SectionHeader
        num={num}
        kicker={label}
        title="Six phases. No black box."
        lede="Each phase ends in something you can read, run or reject — not a status update."
        className="mb-12"
      />

      <ul className="grid grid-hairline grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {phases.map((phase, index) => (
          <Reveal
            key={phase.num}
            as="li"
            delay={index * 0.05}
            className="flex min-h-[300px] flex-col bg-ground p-6 transition-colors duration-[--duration-hover] hover:bg-ground-hover"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[32px] font-extrabold leading-none tracking-[-0.02em] text-accent">
                {phase.num}
              </span>
              <span className="text-micro uppercase text-ink-faint">
                {phase.duration}
              </span>
            </div>

            <h3 className="mb-2 mt-8 text-xl font-extrabold tracking-[-0.02em]">
              {phase.name}
            </h3>
            <p className="text-[12.5px] text-ink-mute">{phase.description}</p>

            <ul className="mt-auto flex flex-col gap-1 pt-6 text-[12.5px] text-ink-dim">
              {phase.deliverables.map((deliverable) => (
                <li key={deliverable} className="flex gap-2">
                  <span aria-hidden="true" className="text-accent">
                    ·
                  </span>
                  {deliverable}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
