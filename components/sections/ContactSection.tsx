import { ContactForm } from "@/components/contact/ContactForm";
import { homeSection } from "@/lib/site";

/**
 * The closing poster field: accent ground, dark display headline, form on the
 * right. Collapses to a single column under 768px per the responsive spec.
 */
export function ContactSection() {
  const { id, num, label } = homeSection("contact");

  return (
    <section
      id={id}
      className="px-page bg-accent pb-[90px] pt-[110px] text-ground"
    >
      <div className="grid items-end gap-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-kicker uppercase opacity-85">
            {num} — {label}
          </p>
          <h2 className="mt-5 text-poster">Have a problem worth solving?</h2>
          <p className="mt-6 max-w-[440px] text-base opacity-90">
            A 30-minute discovery call. You describe the problem; we sketch the
            system. No deck, no pitch.
          </p>
        </div>

        <ContactForm tone="accent" />
      </div>
    </section>
  );
}
