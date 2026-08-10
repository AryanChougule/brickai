import { About } from "@/components/sections/About";
import { AutomationStory } from "@/components/sections/AutomationStory";
import { ContactSection } from "@/components/sections/ContactSection";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Hero } from "@/components/sections/Hero";
import { Industries } from "@/components/sections/Industries";
import { Process } from "@/components/sections/Process";
import { TechStack } from "@/components/sections/TechStack";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import {
  getAutomationStages,
  getIndustries,
  getTestimonials,
  getWalkthroughVideo,
} from "@/lib/cms";

/**
 * The home page, in the section order fixed by the spec's component hierarchy:
 * Hero → WhatWeBuild → Industrial automation → Industries → Work → Stack →
 * Process → Testimonials → About → Contact.
 *
 * Each section owns its own data fetch where it can; the two that need data in a
 * client component receive it as props from here.
 */
export default async function HomePage() {
  const [industries, testimonials, stages, walkthrough] = await Promise.all([
    getIndustries(),
    getTestimonials(),
    getAutomationStages(),
    getWalkthroughVideo(),
  ]);

  return (
    <>
      <Hero />
      <WhatWeBuild />
      <AutomationStory stages={stages} walkthrough={walkthrough} />
      <Industries industries={industries} />
      <FeaturedWork />
      <TechStack />
      <Process />
      <Testimonials testimonials={testimonials} />
      <About />
      <ContactSection />
    </>
  );
}
