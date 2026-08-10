/** First focusable element on the page. Visible only when focused. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only-focusable focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:bg-accent focus-visible:px-4 focus-visible:py-3 focus-visible:text-sm focus-visible:font-extrabold focus-visible:text-ground"
    >
      Skip to content
    </a>
  );
}
