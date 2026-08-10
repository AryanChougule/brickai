"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveTestimonials } from "@/lib/actions/admin";
import { initialAdminResult, type AdminResult } from "@/lib/actions/admin-state";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

const BLANK: Testimonial = {
  quote: "",
  name: "",
  role: "",
  company: "",
  sample: true,
};

/**
 * Editor for the testimonial list.
 *
 * The approval checkbox is the important control here: a quote only stops
 * rendering its "sample" marker once it carries a real name, role and company,
 * and the server action re-checks that rather than trusting this form.
 */
export function TestimonialEditor({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [rows, setRows] = useState<Testimonial[]>(testimonials);
  const [state, action] = useActionState<AdminResult, FormData>(
    saveTestimonials,
    initialAdminResult,
  );

  const sampleCount = rows.filter((row) => row.sample).length;

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="count" value={rows.length} />

      {sampleCount > 0 ? (
        <p className="border border-accent-hairline px-4 py-3 text-sm text-accent-soft">
          <strong className="font-extrabold">
            {sampleCount} of {rows.length} quotes are samples.
          </strong>{" "}
          Nobody said these words. They render with a visible “sample” marker on
          the live page and must be replaced with real, written-approved quotes
          before launch — publishing them as genuine endorsements would be a
          fabricated review.
        </p>
      ) : null}

      <ul className="flex flex-col grid-hairline">
        {rows.map((row, index) => (
          <li key={index} className="flex flex-col gap-3 bg-ground p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-micro uppercase text-ink-faint">
                Quote {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "border px-2 py-1 text-micro uppercase",
                  row.sample
                    ? "border-accent-hairline text-accent-soft"
                    : "border-hairline text-ink-mute",
                )}
              >
                {row.sample ? "sample" : "approved"}
              </span>
            </div>

            <textarea
              name={`quote-${index}`}
              defaultValue={row.quote}
              rows={3}
              className="w-full resize-y border border-divider bg-ground-raised px-3 py-2 text-[13px] text-ink"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <Field name={`name-${index}`} label="Name" value={row.name} />
              <Field name={`role-${index}`} label="Role" value={row.role} />
              <Field
                name={`company-${index}`}
                label="Company"
                value={row.company}
              />
            </div>

            <input
              type="hidden"
              name={`project-${index}`}
              value={row.project ?? ""}
            />

            <label className="flex items-center gap-3 text-[13px] text-ink-dim">
              <input
                type="checkbox"
                name={`approved-${index}`}
                defaultChecked={!row.sample}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
              Client has approved this quote in writing (requires name, role and
              company)
            </label>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-3">
        <SaveButton />
        <button
          type="button"
          onClick={() => setRows((current) => [...current, { ...BLANK }])}
          className="touch-target cursor-pointer border border-edge px-4 py-2 text-[13px] font-extrabold text-ink hover:bg-[rgba(248,244,244,0.08)]"
        >
          Add quote
        </button>
        {rows.length > 1 ? (
          <button
            type="button"
            onClick={() => setRows((current) => current.slice(0, -1))}
            className="touch-target cursor-pointer border border-edge px-4 py-2 text-[13px] font-extrabold text-ink-mute hover:bg-[rgba(248,244,244,0.08)]"
          >
            Remove last
          </button>
        ) : null}

        {state.message ? (
          <p
            role="status"
            className={cn(
              "text-[13px]",
              state.status === "error" ? "text-accent-soft" : "text-ink-mute",
            )}
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-micro uppercase text-ink-mute">{label}</span>
      <input
        name={name}
        defaultValue={value}
        className="min-h-[44px] w-full border border-divider bg-ground-raised px-3 py-2 text-[13px] text-ink"
      />
    </label>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="touch-target cursor-pointer bg-accent px-5 py-3 text-[13px] font-extrabold text-ground hover:bg-accent-hover disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save testimonials"}
    </button>
  );
}
