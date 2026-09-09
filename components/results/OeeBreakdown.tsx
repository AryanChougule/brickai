import { ResultPanel } from "@/components/results/ResultPanel";

/**
 * The output of closing the loop: OEE decomposed, plus the coded downtime
 * pareto that explains it.
 *
 * OEE is the product of its three factors, not an average — so the headline is
 * computed here rather than typed, and cannot drift away from the bars above it.
 */

const FACTORS = [
  { label: "Availability", value: 91.2 },
  { label: "Performance", value: 88.4 },
  { label: "Quality", value: 97.6 },
];

/** Coded at the terminal by the operator, which is why the reasons are usable. */
const DOWNTIME = [
  { reason: "Changeover", minutes: 184 },
  { reason: "Material starve", minutes: 96 },
  { reason: "Jam clear", minutes: 61 },
  { reason: "Unplanned stop", minutes: 38 },
  { reason: "Uncoded", minutes: 9 },
];

export function OeeBreakdown() {
  const oee = FACTORS.reduce((acc, f) => acc * (f.value / 100), 1) * 100;
  const worst = Math.max(...DOWNTIME.map((d) => d.minutes));
  const total = DOWNTIME.reduce((sum, d) => sum + d.minutes, 0);
  const coded = ((total - DOWNTIME[DOWNTIME.length - 1].minutes) / total) * 100;

  return (
    <ResultPanel title="Line 3 — shift summary" meta="OEE · coded downtime · 8h">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-extrabold text-accent">
          {oee.toFixed(1)}%
        </span>
        <span className="text-micro uppercase text-ink-faint">
          OEE = A × P × Q
        </span>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {FACTORS.map((f) => (
          <li key={f.label} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-[11px] uppercase text-ink-mute">
              {f.label}
            </span>
            <span className="relative h-3 flex-1 bg-[rgba(248,244,244,0.08)]">
              <span
                className="absolute inset-y-0 left-0 bg-accent-text"
                style={{ width: `${f.value}%` }}
              />
            </span>
            <span className="w-12 shrink-0 text-right font-mono text-[11px] text-ink-dim">
              {f.value}%
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-6 mb-2 text-micro uppercase text-accent-text">
        Downtime pareto — minutes
      </p>
      <ul className="flex flex-col gap-1.5">
        {DOWNTIME.map((d) => (
          <li key={d.reason} className="flex items-center gap-3">
            <span className="w-28 shrink-0 truncate text-[11px] text-ink-mute">
              {d.reason}
            </span>
            <span className="relative h-2.5 flex-1 bg-[rgba(248,244,244,0.06)]">
              <span
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${(d.minutes / worst) * 100}%`,
                  background:
                    d.reason === "Uncoded"
                      ? "var(--color-ink-ghost)"
                      : "var(--color-accent)",
                }}
              />
            </span>
            <span className="w-10 shrink-0 text-right font-mono text-[11px] text-ink-dim">
              {d.minutes}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 border-t border-hairline pt-3 text-[12px] text-ink-faint">
        {coded.toFixed(0)}% of downtime carries a reason code. That number is
        what makes the pareto worth reading — an uncoded majority turns this
        chart into a guess.
      </p>
    </ResultPanel>
  );
}
