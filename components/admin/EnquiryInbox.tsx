"use client";

import { useActionState, useState } from "react";
import { updateEnquiryStatus } from "@/lib/actions/admin";
import { initialAdminResult, type AdminResult } from "@/lib/actions/admin-state";
import type { Enquiry, EnquiryStatus } from "@/lib/cms/enquiries";
import { cn, formatDate } from "@/lib/utils";

const FILTERS: Array<{ key: EnquiryStatus | "all"; label: string }> = [
  { key: "new", label: "New" },
  { key: "read", label: "Read" },
  { key: "archived", label: "Archived" },
  { key: "all", label: "All" },
];

/**
 * The owner's inbox for contact-form submissions.
 *
 * Read-and-triage only: enquiries can be marked read or archived but never
 * deleted from here, because the underlying log is append-only and a lead
 * should not be destroyable by a misclick.
 */
export function EnquiryInbox({ enquiries }: { enquiries: Enquiry[] }) {
  const [filter, setFilter] = useState<EnquiryStatus | "all">("new");

  const counts = enquiries.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1;
    return acc;
  }, {});

  const visible =
    filter === "all"
      ? enquiries
      : enquiries.filter((enquiry) => enquiry.status === filter);

  if (enquiries.length === 0) {
    return (
      <div className="rule-all p-8">
        <p className="text-base text-ink">No enquiries yet.</p>
        <p className="mt-3 max-w-[60ch] text-sm text-ink-mute">
          Submissions from the contact form land here the moment they are
          received. Nothing is sent anywhere else unless{" "}
          <code>ENQUIRY_WEBHOOK_URL</code> is configured.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ key, label }) => {
          const count = key === "all" ? enquiries.length : (counts[key] ?? 0);
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(key)}
              className={cn(
                "touch-target cursor-pointer border px-4 py-2 text-[13px] font-extrabold transition-colors duration-[--duration-hover]",
                active
                  ? "border-accent bg-accent text-ground"
                  : "border-hairline text-ink-dim hover:border-edge hover:text-ink",
              )}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="rule-all p-6 text-sm text-ink-mute">
          Nothing in “{filter}”.
        </p>
      ) : (
        <ul className="flex flex-col grid-hairline">
          {visible.map((enquiry) => (
            <EnquiryRow key={enquiry.id} enquiry={enquiry} />
          ))}
        </ul>
      )}
    </div>
  );
}

function EnquiryRow({ enquiry }: { enquiry: Enquiry }) {
  const [state, action] = useActionState<AdminResult, FormData>(
    updateEnquiryStatus,
    initialAdminResult,
  );

  return (
    <li className="flex flex-col gap-4 bg-ground p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-base font-extrabold text-ink">
            {enquiry.name}
            {enquiry.company ? (
              <span className="font-normal text-ink-mute">
                {" "}
                · {enquiry.company}
              </span>
            ) : null}
          </p>
          <p className="mt-1 text-[13px]">
            {/* A mailto is the fastest possible path from lead to reply. */}
            <a
              href={`mailto:${enquiry.email}?subject=${encodeURIComponent(
                "Re: your enquiry to BrickAI",
              )}`}
              className="text-accent-text hover:text-accent-soft"
            >
              {enquiry.email}
            </a>
            <span className="text-ink-faint">
              {" "}
              · <time dateTime={enquiry.receivedAt}>
                {formatDate(enquiry.receivedAt)}
              </time>
              {enquiry.budget ? ` · ${enquiry.budget}` : null}
            </span>
          </p>
        </div>

        <span
          className={cn(
            "shrink-0 border px-2 py-1 text-micro uppercase",
            enquiry.status === "new"
              ? "border-accent bg-accent text-ground"
              : "border-hairline text-ink-faint",
          )}
        >
          {enquiry.status}
        </span>
      </div>

      <p className="max-w-[80ch] whitespace-pre-wrap border-l-2 border-accent-rule pl-4 text-sm text-ink-dim">
        {enquiry.problem}
      </p>

      <form action={action} className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="id" value={enquiry.id} />

        {enquiry.status !== "read" ? (
          <StatusButton value="read">Mark read</StatusButton>
        ) : null}
        {enquiry.status !== "archived" ? (
          <StatusButton value="archived">Archive</StatusButton>
        ) : null}
        {enquiry.status !== "new" ? (
          <StatusButton value="new">Mark unread</StatusButton>
        ) : null}

        {state.message ? (
          <span
            role="status"
            className={cn(
              "text-[12px]",
              state.status === "error" ? "text-accent-soft" : "text-ink-mute",
            )}
          >
            {state.message}
          </span>
        ) : null}
      </form>
    </li>
  );
}

function StatusButton({
  value,
  children,
}: {
  value: EnquiryStatus;
  children: string;
}) {
  return (
    <button
      type="submit"
      name="status"
      value={value}
      className="touch-target cursor-pointer border border-edge px-4 py-2 text-[13px] font-extrabold text-ink hover:bg-[rgba(248,244,244,0.08)]"
    >
      {children}
    </button>
  );
}
