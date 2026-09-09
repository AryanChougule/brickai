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
/** Day the model raises the alert; failure would land at day 30. */
const FLAG_DAY = 22;

/** RMS velocity in mm/s — ISO 10816 territory, so the numbers read as real. */
function rms(day: number) {
  const baseline = 1.8 + Math.sin(day * 0.7) * 0.06;
  // Wear is negligible until the defect propagates, then compounds.
  const wear = day < 14 ? 0 : Math.pow((day - 14) / 16, 2.4) * 6.2;
  return baseline + wear;
}

const W = 640;
const H = 200;
const PAD = { top: 14, right: 14, bottom: 22, left: 34 };
const MAX_Y = 9;
/** ISO alarm band for this machine class. */
const THRESHOLD = 4.5;

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
      meta="RMS mm/s · 30d · ISO 10816"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Vibration rises from 1.8 to ${rms(DAYS).toFixed(1)} millimetres per second over 30 days. The model flags it on day ${FLAG_DAY}, eight days before the alarm threshold would be reached.`}
      >
        {/* Alarm band */}
        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={y(THRESHOLD)}
          y2={y(THRESHOLD)}
          stroke="rgba(255,167,107,0.45)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x={W - PAD.right}
          y={y(THRESHOLD) - 6}
          textAnchor="end"
          className="fill-[var(--color-accent-text)]"
          style={{ fontSize: 9, letterSpacing: "0.12em" }}
        >
          ALARM 4.5
        </text>

        {/* Y axis ticks */}
        {[0, 3, 6, 9].map((v) => (
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
          { k: "Raised at", v: "2.9 mm/s" },
          { k: "Lead time", v: "8 days", accent: true },
          { k: "Alarm avoided", v: "4.5 mm/s" },
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
