import type { Testimonial } from "@/lib/types";

/**
 * ⚠ SAMPLE CONTENT — NOT REAL CLIENT QUOTES.
 *
 * Every entry below carries `sample: true`. They are written to match the
 * corresponding case study so the section can be designed and reviewed against
 * realistic length and tone, and for no other purpose.
 *
 * Nobody said these words. Publishing them with a real name attached would be
 * a fabricated endorsement, so the site renders a visible "sample" marker on
 * any quote still flagged, and the admin refuses to clear the flag without a
 * name, role and company.
 *
 * To replace one: get the quote in writing from the client, put their real
 * name, role and company in, and set `sample: false`.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "The part that convinced the floor wasn't the accuracy number. It was that a supervisor could open any rejected unit, see the frame it was judged on, and disagree with it. Once they could argue with the model, they started trusting it.",
    name: "Name to be confirmed",
    role: "Plant Manager",
    company: "Consumer packaging manufacturer",
    project: "vision-qc-packaging-line",
    sample: true,
  },
  {
    quote:
      "We expected to argue about the seventeen percent it escalates. Instead the planners asked whether it could take more, because the exceptions it hands them are the only interesting quotes in the queue.",
    name: "Name to be confirmed",
    role: "Chief Operating Officer",
    company: "Mid-market freight brokerage",
    project: "autonomous-freight-quoting-agent",
    sample: true,
  },
  {
    quote:
      "They built the tenancy model before they built a single feature, and I did not understand why until our second customer turned out to be our first customer's biggest competitor. That decision is the reason we still have both.",
    name: "Name to be confirmed",
    role: "Chief Technology Officer",
    company: "Industrial machine OEM",
    project: "oee-platform-machine-builder",
    sample: true,
  },
  {
    quote:
      "The weekly demo was uncomfortable in the best way. There was never a month where we found out late that something had gone sideways, because we saw the working system every Thursday whether it was ready or not.",
    name: "Name to be confirmed",
    role: "Head of Claims Operations",
    company: "Regional health insurer",
    project: "claims-document-intelligence",
    sample: true,
  },
];

/** Quotes cleared for publication. Empty until real ones are approved. */
export const approvedTestimonials = testimonials.filter((t) => !t.sample);
