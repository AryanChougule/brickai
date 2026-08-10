import { ImpactNote } from "@/components/ui/FieldBlock";
import type { Roi } from "@/lib/types";

/**
 * Expected business ROI, as a before/after table. Real numbers from delivered
 * work, so each row carries the measure rather than a percentage in isolation.
 */
export function RoiTable({ roi }: { roi: Roi }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="text-h3 text-ink">{roi.headline}</p>
        <ImpactNote className="whitespace-nowrap">{roi.payback}</ImpactNote>
      </div>

      <div className="overflow-x-auto rule-all">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <caption className="sr-only">
            Expected return: {roi.headline}. {roi.payback}.
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="border-b-2 border-divider p-4 text-left text-micro uppercase text-ink-faint"
              >
                Measure
              </th>
              <th
                scope="col"
                className="border-b-2 border-divider p-4 text-left text-micro uppercase text-ink-faint"
              >
                Before
              </th>
              <th
                scope="col"
                className="border-b-2 border-divider p-4 text-left text-micro uppercase text-accent-text"
              >
                After
              </th>
            </tr>
          </thead>
          <tbody>
            {roi.metrics.map((metric) => (
              <tr key={metric.label} className="border-b border-hairline last:border-0">
                <th scope="row" className="p-4 text-left font-normal text-ink-dim">
                  {metric.label}
                  {metric.note ? (
                    <span className="mt-1 block text-[12px] text-ink-faint">
                      {metric.note}
                    </span>
                  ) : null}
                </th>
                <td className="p-4 font-extrabold text-ink-mute">
                  {metric.before}
                </td>
                <td className="p-4 font-extrabold text-accent">
                  {metric.after}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="max-w-[640px] text-[13px] text-ink-faint">
        Figures are medians from delivered engagements in this category, not
        modelled projections. Yours will differ — we size them against your own
        baseline during discovery.
      </p>
    </div>
  );
}
