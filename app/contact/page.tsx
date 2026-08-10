import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { Kicker } from "@/components/ui/Kicker";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Book a discovery call",
  description:
    "A 30-minute discovery call. You describe the problem; we sketch the system. No deck, no pitch — and an honest answer if we are not the right people.",
  path: "/contact",
  eyebrow: "Contact",
});

/** What actually happens on the call, so nobody has to guess. */
const AGENDA = [
  {
    minutes: "0–10",
    title: "You talk",
    body: "The problem, what you have tried, and what it costs you today. We ask questions and take notes. No slides from us.",
  },
  {
    minutes: "10–25",
    title: "We sketch",
    body: "A rough architecture on a shared screen: where the data comes from, where a model sits, what writes back, what a person still decides.",
  },
  {
    minutes: "25–30",
    title: "An honest read",
    body: "Whether this is worth building, roughly what it costs, and whether we are the right people. Sometimes the answer is a configuration change to software you already own.",
  },
] as const;

const EXPECT = [
  "A reply within one working day, from an engineer",
  "No sales sequence, no newsletter, no follow-up drip",
  "We will tell you if an off-the-shelf tool solves it more cheaply",
  "Anything you share stays between us, NDA or not",
] as const;

export default function ContactPage() {
  return (
    <>
      {/* Poster field carrying the form, so the primary action is above the fold */}
      <section className="px-page bg-accent pb-[90px] pt-[calc(var(--nav-h)+96px)] text-ground">
        <div className="grid items-start gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-kicker uppercase opacity-85">Contact</p>
            <h1 className="mt-5 max-w-[16ch] text-poster">
              Have a problem worth solving?
            </h1>
            <p className="mt-7 max-w-[46ch] text-base opacity-90">
              A 30-minute discovery call. You describe the problem; we sketch the
              system. No deck, no pitch.
            </p>

            <dl className="mt-10 flex flex-col gap-4 text-sm">
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-micro uppercase opacity-80">
                  Speak to
                </dt>
                <dd className="font-extrabold">{site.contact.name}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-micro uppercase opacity-80">
                  Email
                </dt>
                <dd className="font-extrabold">
                  <a href={`mailto:${site.contact.email}`} className="underline">
                    {site.contact.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-micro uppercase opacity-80">
                  Phone
                </dt>
                <dd className="font-extrabold">
                  <a href={site.contact.phoneHref} className="underline">
                    {site.contact.phone}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-micro uppercase opacity-80">
                  Response
                </dt>
                <dd>Within one working day</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-micro uppercase opacity-80">
                  Call length
                </dt>
                <dd>30 minutes</dd>
              </div>
            </dl>
          </div>

          <div className="lg:pt-2">
            <ContactForm tone="accent" extended />
          </div>
        </div>
      </section>

      <Section id="agenda">
        <SectionHeader
          num="01"
          kicker="The call"
          title="Thirty minutes, three parts."
          lede="We run every discovery call the same way, so you know what you are agreeing to."
          className="mb-12"
        />

        <ol className="grid grid-hairline grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {AGENDA.map((item) => (
            <li key={item.title} className="flex min-h-[240px] flex-col bg-ground p-7">
              <span className="text-[13px] tracking-[0.12em] text-accent">
                {item.minutes} min
              </span>
              <h3 className="mb-3 mt-8 text-xl font-extrabold tracking-[-0.02em]">
                {item.title}
              </h3>
              <p className="mt-auto text-sm text-ink-mute">{item.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="expect"
        rule={false}
        className="grid gap-12 lg:grid-cols-[minmax(280px,1fr)_1.2fr]"
      >
        <SectionHeader num="02" kicker="What to expect" title="And what not to." />

        <div className="flex flex-col gap-10">
          <ul className="flex flex-col gap-3">
            {EXPECT.map((item) => (
              <li key={item} className="flex gap-3 text-base text-ink-dim">
                <span aria-hidden="true" className="font-extrabold text-accent">
                  →
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="rule-all p-7">
            <Kicker size="micro">Not ready for a call?</Kicker>
            <p className="mt-3 max-w-[52ch] text-sm text-ink-mute">
              The{" "}
              <Link
                href="/what-we-build"
                className="text-accent-text hover:text-accent-soft"
              >
                capability index
              </Link>{" "}
              lists twelve system categories with the problems each one solves and
              what it typically returns. Most people recognise their problem there
              before they contact us.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
