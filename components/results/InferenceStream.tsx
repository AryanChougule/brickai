"use client";

import { useCallback, useRef, useState } from "react";
import { useCanvas2D } from "@/hooks/useCanvas2D";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Mulberry32 — a small, uniformly-distributed PRNG.
 *
 * The shared `seededRandom` in lib/utils is a sin-hash. It is fine for
 * scattering geometry in the hero, where only the look matters, but it is
 * measurably biased: over 2,000 units it produced a 4.95% reject rate against
 * a 6% target and skewed the defect mix by up to a third. This panel *displays*
 * its reject rate, so the numbers have to match their own specification.
 */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Live inference view: units crossing a camera field of view, each classified
 * as it enters, with defects flagged and counted.
 *
 * This is a simulation, not a recording and not a model — badged as such on the
 * panel. It exists because the honest alternative on a site with no deployed
 * product is a static photograph, and a photograph cannot show the one thing
 * that matters about an inspection system: that a verdict lands on every single
 * unit, at rate, with nobody watching.
 *
 * Playback runs roughly 12x slower than the quoted 400 units/min. At true rate
 * a unit crosses the frame in 150ms and no label is readable, so the header
 * says the playback is slowed rather than implying the line is this leisurely.
 */

/** Defect mix, weighted the way a packaging line pareto actually looks. */
const DEFECTS = [
  { label: "seal-fault", weight: 0.45 },
  { label: "label-skew", weight: 0.3 },
  { label: "dent", weight: 0.15 },
  { label: "underfill", weight: 0.1 },
];

/** Roughly the reject rate implied by the numbers quoted elsewhere on the page. */
const DEFECT_RATE = 0.06;

const UNIT_W = 78;
const UNIT_H = 54;
const GAP = 132;
/** Pixels per second. Chosen for legibility, not realism. */
const SPEED = 96;

interface Unit {
  id: number;
  x: number;
  defect: string | null;
  score: number;
  /** Set once the unit first crosses into the field of view. */
  classifiedAt: number | null;
}

function makeUnit(id: number, x: number): Unit {
  // One generator per unit, drawn in a fixed order, so a given id always
  // produces the same unit no matter when it is created.
  const next = rng(id * 2654435761);
  const isDefect = next() < DEFECT_RATE;

  let defect: string | null = null;
  if (isDefect) {
    const pick = next();
    let acc = 0;
    for (const entry of DEFECTS) {
      acc += entry.weight;
      if (pick <= acc) {
        defect = entry.label;
        break;
      }
    }
    defect = defect ?? DEFECTS[DEFECTS.length - 1].label;
  } else {
    // Keep the draw count identical on both branches so the score below is
    // not correlated with whether the unit is a defect.
    next();
  }

  return {
    id,
    x,
    defect,
    // Defects score lower than good units. That gap is exactly why a review
    // queue exists rather than a hard threshold.
    score: isDefect ? 0.71 + next() * 0.23 : 0.94 + next() * 0.056,
    classifiedAt: null,
  };
}

interface Counters {
  inspected: number;
  rejected: number;
}

export function InferenceStream() {
  const reduced = usePrefersReducedMotion();
  const [running, setRunning] = useState(true);
  const [hud, setHud] = useState<Counters>({ inspected: 0, rejected: 0 });

  const unitsRef = useRef<Unit[] | null>(null);
  const nextIdRef = useRef(0);
  const countersRef = useRef<Counters>({ inspected: 0, rejected: 0 });
  const runningRef = useRef(true);
  const lastSyncRef = useRef(0);

  runningRef.current = running && !reduced;

  const setup = useCallback(({ width }: { width: number }) => {
    const units: Unit[] = [];
    let id = 0;
    for (let x = width + UNIT_W; x > -GAP; x -= GAP) {
      units.push(makeUnit(id++, x));
    }
    unitsRef.current = units;
    nextIdRef.current = id;
  }, []);

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      frame: { width: number; height: number; time: number; delta: number },
    ) => {
      const { width, height, time, delta } = frame;
      const units = unitsRef.current;
      if (!units) return;

      // The band where the camera can actually classify.
      const fovLeft = width * 0.22;
      const fovRight = width * 0.78;
      const beltY = height * 0.56;

      if (runningRef.current) {
        for (const unit of units) {
          unit.x -= SPEED * delta;

          // Classify on entering the field of view, and count once.
          if (unit.classifiedAt === null && unit.x < fovRight) {
            unit.classifiedAt = time;
            countersRef.current.inspected += 1;
            if (unit.defect) countersRef.current.rejected += 1;
          }
        }

        // Recycle units that have left the frame into fresh ones at the right.
        let rightmost = -Infinity;
        for (const unit of units) rightmost = Math.max(rightmost, unit.x);
        for (let i = 0; i < units.length; i++) {
          if (units[i].x < -UNIT_W * 2) {
            rightmost += GAP;
            units[i] = makeUnit(nextIdRef.current++, rightmost);
          }
        }
      }

      ctx.clearRect(0, 0, width, height);

      const beltTop = beltY + UNIT_H / 2 + 10;

      // Belt
      ctx.strokeStyle = "rgba(248,244,244,0.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, beltTop);
      ctx.lineTo(width, beltTop);
      ctx.stroke();

      // Scrolling tread, so motion reads even between units.
      ctx.strokeStyle = "rgba(248,244,244,0.07)";
      const tread = runningRef.current ? (time * SPEED) % 24 : 0;
      for (let x = -tread; x < width + 24; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, beltTop);
        ctx.lineTo(x - 8, beltTop + 10);
        ctx.stroke();
      }

      // Field-of-view markers
      ctx.strokeStyle = "rgba(255,167,107,0.35)";
      ctx.setLineDash([5, 5]);
      for (const x of [fovLeft, fovRight]) {
        ctx.beginPath();
        ctx.moveTo(x, 14);
        ctx.lineTo(x, height - 14);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(255,167,107,0.7)";
      ctx.font = "600 9px ui-monospace, Menlo, monospace";
      ctx.fillText("CAM-01 FOV", fovLeft + 6, 22);

      for (const unit of units) {
        const inFov = unit.x > fovLeft - UNIT_W && unit.x < fovRight;
        const left = unit.x - UNIT_W / 2;
        const top = beltY - UNIT_H / 2;

        // The unit itself
        ctx.fillStyle = "#2a2626";
        ctx.fillRect(left, top, UNIT_W, UNIT_H);
        ctx.strokeStyle = "rgba(248,244,244,0.22)";
        ctx.lineWidth = 1;
        ctx.strokeRect(left, top, UNIT_W, UNIT_H);

        if (!inFov || unit.classifiedAt === null) continue;

        const accent = unit.defect ? "#f26511" : "rgba(255,167,107,0.95)";
        const pad = 7;
        const bx = left - pad;
        const by = top - pad;
        const bw = UNIT_W + pad * 2;
        const bh = UNIT_H + pad * 2;

        // Corner brackets rather than a closed box: reads as a detection and
        // leaves the unit visible underneath.
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        const arm = 12;
        const corners: Array<[number, number, number, number]> = [
          [bx, by, 1, 1],
          [bx + bw, by, -1, 1],
          [bx, by + bh, 1, -1],
          [bx + bw, by + bh, -1, -1],
        ];
        for (const [cx, cy, dx, dy] of corners) {
          ctx.beginPath();
          ctx.moveTo(cx + dx * arm, cy);
          ctx.lineTo(cx, cy);
          ctx.lineTo(cx, cy + dy * arm);
          ctx.stroke();
        }

        // Class label and confidence
        const label = unit.defect
          ? unit.defect + " " + unit.score.toFixed(2)
          : "unit " + unit.score.toFixed(2);
        ctx.font = "700 10px ui-monospace, Menlo, monospace";
        const textWidth = ctx.measureText(label).width;
        ctx.fillStyle = accent;
        ctx.fillRect(bx, by - 16, textWidth + 12, 15);
        ctx.fillStyle = "#171515";
        ctx.fillText(label, bx + 6, by - 5);

        if (unit.defect) {
          ctx.fillStyle = "#f26511";
          ctx.fillText("REJECT", bx, by + bh + 14);
        }
      }

      // Scan line sweeping the field of view
      if (runningRef.current) {
        const t = (time * 0.55) % 1;
        const sx = fovLeft + (fovRight - fovLeft) * t;
        const gradient = ctx.createLinearGradient(sx - 30, 0, sx + 30, 0);
        gradient.addColorStop(0, "rgba(242,101,17,0)");
        gradient.addColorStop(0.5, "rgba(242,101,17,0.3)");
        gradient.addColorStop(1, "rgba(242,101,17,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(sx - 30, 14, 60, height - 28);
      }

      // Push counters to React a few times a second, never per frame.
      if (time - lastSyncRef.current > 0.25) {
        lastSyncRef.current = time;
        const { inspected, rejected } = countersRef.current;
        setHud((previous) =>
          previous.inspected === inspected && previous.rejected === rejected
            ? previous
            : { inspected, rejected },
        );
      }
    },
    [],
  );

  const canvasRef = useCanvas2D({ draw, setup });

  const rejectRate = hud.inspected ? (hud.rejected / hud.inspected) * 100 : 0;

  return (
    <figure className="flex flex-col rule-all bg-ground-graph">
      <figcaption className="flex flex-wrap items-baseline gap-3 border-b border-hairline px-5 py-3">
        <span className="text-[13px] font-extrabold text-ink">
          Line-side inference — CAM-01
        </span>
        <span className="font-mono text-[11px] text-ink-faint">
          TensorRT INT8 · 8ms verdict · playback ~12× slow
        </span>
        <span className="ml-auto border border-accent-hairline px-2 py-0.5 text-micro uppercase text-accent-soft">
          Simulated
        </span>
      </figcaption>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="block h-[260px] w-full"
          role="img"
          aria-label={
            "Simulated inspection stream. " +
            hud.inspected +
            " units classified, " +
            hud.rejected +
            " rejected, " +
            rejectRate.toFixed(1) +
            " percent reject rate."
          }
        />

        <button
          type="button"
          onClick={() => setRunning((value) => !value)}
          disabled={reduced}
          className="touch-target absolute bottom-3 right-3 cursor-pointer border border-edge bg-[rgba(23,21,21,0.85)] px-3 py-1.5 text-[12px] font-extrabold text-ink hover:bg-[rgba(248,244,244,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {reduced ? "Paused — reduced motion" : running ? "Pause" : "Play"}
        </button>
      </div>

      <dl className="grid grid-cols-2 grid-hairline-inner border-t border-hairline sm:grid-cols-4">
        {[
          { k: "Classified", v: String(hud.inspected) },
          { k: "Rejected", v: String(hud.rejected), accent: true },
          { k: "Reject rate", v: rejectRate.toFixed(1) + "%" },
          { k: "Line rate", v: "400/min" },
        ].map((stat) => (
          <div key={stat.k} className="bg-ground p-3">
            <dt className="text-micro uppercase text-ink-faint">{stat.k}</dt>
            <dd
              className={
                stat.accent
                  ? "font-mono text-base font-extrabold text-accent"
                  : "font-mono text-base font-extrabold text-ink"
              }
            >
              {stat.v}
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
