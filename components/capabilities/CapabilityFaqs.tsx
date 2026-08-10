interface Faq {
  question: string;
  answer: string;
}

/**
 * The three questions this capability actually gets asked. Native `details`
 * elements: keyboard-operable and expandable with no JavaScript at all.
 */
export function CapabilityFaqs({ faqs }: { faqs: Faq[] }) {
  return (
    <ul className="flex flex-col rule-all">
      {faqs.map((faq, index) => (
        <li key={faq.question} className="border-b border-hairline last:border-0">
          <details className="group">
            <summary className="flex cursor-pointer items-baseline gap-4 p-6 text-base font-extrabold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="text-[11px] tracking-[0.12em] text-ink-faint">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">{faq.question}</span>
              <span
                aria-hidden="true"
                className="text-lg leading-none text-accent group-open:hidden"
              >
                +
              </span>
              <span
                aria-hidden="true"
                className="hidden text-lg leading-none text-accent group-open:inline"
              >
                −
              </span>
            </summary>
            <p className="max-w-[720px] pb-6 pl-[52px] pr-6 text-sm text-ink-dim">
              {faq.answer}
            </p>
          </details>
        </li>
      ))}
    </ul>
  );
}
