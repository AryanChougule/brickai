import { ResultPanel } from "@/components/results/ResultPanel";

/**
 * Predictive-maintenance output: a bearing's vibration envelope drifting up,
 * the point the model raised it, and the lead time that buys.
 *
 * The series is generated from a fixed formula rather than random values, so
 * the server and client render identical markup and the curve tells the same
 * story every time — a long flat baseline, then an exponential climb, which is
 * what incipient bearing wear actually looks like in an envelope spectrum.
 */

const DAYS = 30;
/** Day the model raises it — while the machine is still inside Zone B. */
const FLAG_DAY = 22;

/**
 * ISO 10816-3, Group 2 (medium machines, 15–75 kW, rigid mount). The zone
 * boundaries are the standard's, not invented:
 *   Zone A ≤ 1.4   newly commissioned
 *   Zone B ≤ 2.8   acceptable for unrestricted long-term running
 *   Zone C ≤ 4.5   unsatisfactory — plan an intervention
 *   Zone D  > 4.5  unacceptable — damage is occurring
 *
 * The point of the chart is that the alert fires inside Zone B, six days
 * before the machine reaches Zone D, which is the whole commercial argument
 * for condition monitoring over a calendar.
 */
function rms(day: number) {
  const baseline = 1.05 + Math.sin(day * 0.7) * 0.05;
  // Negligible until the spall propagates, then compounds.
  const wear = day < 16 ? 0 : Math.pow((day - 16) / 14, 1.8) * 4.6;
  return baseline + wear;
}

const W = 640;
const H = 200;
const PAD = { top: 14, right: 14, bottom: 22, left: 34 };
const MAX_Y = 6;
/** Zone B/C — plan an intervention. */
const ALERT = 2.8;
/** Zone C/D — damage is occurring. */
const DANGER = 4.5;

const x = (day: number) =>
  PAD.left + (day / DAYS) * (W - PAD.left - PAD.right);
const y = (value: number) =>
  H - PAD.bottom - (value / MAX_Y) * (H - PAD.top - PAD.bottom);

export function AnomalyTimeline() {
  const points = Array.from({ length: DAYS + 1 }, (_, day) => ({
    day,
    value: rms(day),
  }));

  const line = points.map((p) => `${x(p.day)},${y(p.value)}`).join(" ");
  const flagged = points[FLAG_DAY];

  return (
    <ResultPanel
      title="Bearing envelope — drive-end, motor 3"
      meta="RMS mm/s · 30d · ISO 10816-3 Grp 2"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Bearing vibration rises from 1.1 to ${rms(DAYS).toFixed(1)} millimetres per second RMS over 30 days. The model raises it on day ${FLAG_DAY} at 2.05, still inside ISO 10816-3 Zone B, six days before the machine reaches Zone D.`}
      >
        {/* ISO 10816-3 zone boundaries */}
        {[
          { v: ALERT, label: "ZONE C 2.8", dim: true },
          { v: DANGER, label: "ZONE D 4.5", dim: false },
        ].map((band) => (
          <g key={band.label}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(band.v)}
              y2={y(band.v)}
              stroke={
                band.dim ? "rgba(255,167,107,0.35)" : "rgba(242,101,17,0.7)"
              }
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={W - PAD.right}
              y={y(band.v) - 5}
              textAnchor="end"
              className={
                band.dim
                  ? "fill-[var(--color-ink-faint)]"
                  : "fill-[var(--color-accent)]"
              }
              style={{ fontSize: 9, letterSpacing: "0.12em" }}
            >
              {band.label}
            </text>
          </g>
        ))}

        {/* Y axis ticks */}
        {[0, 2, 4, 6].map((v) => (
          <text
            key={v}
            x={PAD.left - 6}
            y={y(v) + 3}
            textAnchor="end"
            className="fill-[var(--color-ink-faint)]"
            style={{ fontSize: 9 }}
          >
            {v}
          </text>
        ))}

        {/* The trace */}
        <polyline
          points={line}
          fill="none"
          stroke="var(--color-accent-text)"
          strokeWidth="1.75"
        />

        {/* Where the model raised it */}
        <line
          x1={x(FLAG_DAY)}
          x2={x(FLAG_DAY)}
          y1={PAD.top}
          y2={H - PAD.bottom}
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        <circle
          cx={x(FLAG_DAY)}
          cy={y(flagged.value)}
          r="4"
          fill="var(--color-accent)"
        />
        <text
          x={x(FLAG_DAY) - 8}
          y={PAD.top + 10}
          textAnchor="end"
          className="fill-[var(--color-accent)]"
          style={{ fontSize: 9, letterSpacing: "0.12em", fontWeight: 800 }}
        >
          FLAGGED d{FLAG_DAY}
        </text>

        {/* X axis */}
        {[0, 10, 20, 30].map((d) => (
          <text
            key={d}
            x={x(d)}
            y={H - 6}
            textAnchor="middle"
            className="fill-[var(--color-ink-faint)]"
            style={{ fontSize: 9 }}
          >
            d{d}
          </text>
        ))}
      </svg>

      <dl className="mt-4 grid grid-cols-3 grid-hairline-inner">
        {[
          { k: "Raised at", v: "2.05 mm/s" },
          { k: "Lead time to Zone D", v: "6 days", accent: true },
          { k: "Zone at alert", v: "B (acceptable)" },
        ].map((s) => (
          <div key={s.k} className="bg-ground p-3">
            <dt className="text-micro uppercase text-ink-faint">{s.k}</dt>
            <dd
              className={
                s.accent
                  ? "text-base font-extrabold text-accent"
                  : "text-base font-extrabold text-ink"
              }
            >
              {s.v}
            </dd>
          </div>
        ))}
      </dl>
    </ResultPanel>
  );
}
