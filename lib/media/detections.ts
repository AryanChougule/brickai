/**
 * Illustrative detection boxes drawn over vision-related photography.
 *
 * These are hand-placed annotations, not model output. They exist to show what
 * an inspection frame looks like — the same reason a dataset preview shows
 * boxes — and every caption that accompanies them says "illustration" so the
 * page never implies these came from our software running on this photograph.
 *
 * Coordinates are percentages of the rendered image, so they track the photo at
 * any size or crop.
 */
export interface DetectionBox {
  /** Percentages: left, top, width, height. */
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  /** Rendered as a confidence score, e.g. 0.97. */
  score: number;
  /** Draws in the alert colour, for the one box that represents a reject. */
  reject?: boolean;
}

/** Keyed by media slot id — a slot with no entry simply renders no overlay. */
export const detections: Record<string, DetectionBox[]> = {
  "auto-see": [
    { x: 36, y: 16, w: 28, h: 30, label: "sensor-head", score: 0.97 },
    { x: 16, y: 52, w: 30, h: 30, label: "actuator", score: 0.92 },
    { x: 68, y: 46, w: 20, h: 24, label: "mount", score: 0.84 },
  ],
  "work-vision-qc-packaging-line": [
    { x: 28, y: 14, w: 36, h: 36, label: "unit", score: 0.96 },
    { x: 10, y: 56, w: 26, h: 28, label: "unit", score: 0.94 },
    { x: 62, y: 60, w: 24, h: 26, label: "defect", score: 0.78, reject: true },
  ],
};

export function detectionsFor(slotId: string): DetectionBox[] | undefined {
  return detections[slotId];
}
