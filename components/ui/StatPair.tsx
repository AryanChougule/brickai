import { cn } from "@/lib/utils";

interface StatCellProps {
  label: string;
  value: string;
  /** The "after" side of a pair — accent value, accent label. */
  accent?: boolean;
}

/** One cell of a stat grid. */
export function StatCell({ label, value, accent }: StatCellProps) {
  return (
    <div className="bg-ground p-[14px]">
      <p
        className={cn(
          "text-micro uppercase",
          accent ? "text-accent-text" : "text-ink-faint",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "text-xl font-extrabold",
          accent ? "text-accent" : "text-ink-mute",
        )}
      >
        {value}
      </p>
    </div>
  );
}

/**
 * The Before/After pair from the project cards. The gap is the border, so this
 * sits on a divider-tinted ground rather than drawing its own rules.
 */
export function StatPair({
  before,
  after,
  labels = ["Before", "After"],
  className,
}: {
  before: string;
  after: string;
  labels?: [string, string];
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 grid-hairline-inner", className)}>
      <StatCell label={labels[0]} value={before} />
      <StatCell label={labels[1]} value={after} accent />
    </div>
  );
}

/** A wider stat strip — used for outcome rows on case studies. */
export function StatStrip({
  items,
  className,
}: {
  items: ReadonlyArray<{ label: string; value: string }>;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid grid-hairline-inner",
        "grid-cols-[repeat(auto-fit,minmax(160px,1fr))]",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="bg-ground p-4">
          <dt className="text-micro uppercase text-ink-faint">{item.label}</dt>
          <dd className="mt-1 text-xl font-extrabold text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
