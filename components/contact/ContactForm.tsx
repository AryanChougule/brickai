"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry } from "@/lib/actions/contact";
import {
  initialContactState,
  type ContactField,
  type ContactState,
} from "@/lib/actions/contact-state";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  /**
   * `accent` sits on the orange poster, where the surrounding text is dark;
   * `ground` sits on the dark page. The two tones invert every field colour.
   */
  tone?: "accent" | "ground";
  /** Extra fields shown on the dedicated contact page but not on the home poster. */
  extended?: boolean;
}

/**
 * Discovery-call form. Progressive enhancement by construction: it is a real
 * `<form>` posting to a server action, so it works before hydration and the
 * client only adds inline error display and a pending state.
 */
export function ContactForm({ tone = "accent", extended }: ContactFormProps) {
  const [state, action] = useActionState<ContactState, FormData>(
    submitEnquiry,
    initialContactState,
  );

  if (state.status === "success") {
    return <Confirmation tone={tone} message={state.message} />;
  }

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      {state.status === "error" ? (
        <p
          role="alert"
          className={cn(
            "border px-4 py-3 text-sm",
            tone === "accent"
              ? // A solid dark panel rather than a translucent one: stacking
                // black over orange would leave the message on a muddy field.
                "border-ground bg-ground text-ink"
              : "border-accent-field text-accent-soft",
          )}
        >
          {state.message}
        </p>
      ) : null}

      <Field
        name="name"
        label="Name"
        placeholder="Jane Doe"
        tone={tone}
        state={state}
        autoComplete="name"
        required
      />
      <Field
        name="email"
        label="Work email"
        type="email"
        placeholder="jane@company.com"
        tone={tone}
        state={state}
        autoComplete="email"
        required
      />

      {extended ? (
        <>
          <Field
            name="company"
            label="Company"
            placeholder="Company name"
            tone={tone}
            state={state}
            autoComplete="organization"
          />
          <Select
            name="budget"
            label="Indicative budget"
            tone={tone}
            options={[
              "Not sure yet",
              "Under £25k",
              "£25k – £75k",
              "£75k – £200k",
              "Over £200k",
            ]}
          />
        </>
      ) : null}

      <Field
        name="problem"
        label="The problem"
        placeholder="What should software be doing for you that it isn't?"
        tone={tone}
        state={state}
        multiline
        required
      />

      {/* Honeypot — off-screen, never announced, never focusable. */}
      <div aria-hidden="true" className="sr-only-focusable">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton tone={tone} />

      <p
        className={cn(
          "text-[12px]",
          tone === "accent" ? "opacity-80" : "text-ink-faint",
        )}
      >
        We reply within one working day. No sequences, no newsletter.
      </p>
    </form>
  );
}

function SubmitButton({ tone }: { tone: "accent" | "ground" }) {
  // useFormStatus reads the enclosing form, so this must be its own component.
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "touch-target mt-2 inline-flex cursor-pointer items-center justify-center self-start px-7 py-4 text-[15px] font-extrabold transition-colors duration-[--duration-hover] disabled:cursor-wait disabled:opacity-70",
        tone === "accent"
          ? "bg-ground text-ink hover:bg-ground-black"
          : "bg-accent text-ink hover:bg-accent-hover",
      )}
    >
      {pending ? "Sending…" : "Book discovery call →"}
    </button>
  );
}

interface FieldProps {
  name: ContactField;
  label: string;
  tone: "accent" | "ground";
  state: ContactState;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  required?: boolean;
  autoComplete?: string;
}

function Field({
  name,
  label,
  tone,
  state,
  placeholder,
  type = "text",
  multiline,
  required,
  autoComplete,
}: FieldProps) {
  const error = state.errors[name];
  const errorId = `${name}-error`;

  const control = cn(
    "w-full min-h-[48px] px-3 py-2 text-sm",
    "border transition-colors duration-[--duration-hover]",
    tone === "accent"
      ? "bg-[rgba(23,21,21,0.10)] border-[rgba(23,21,21,0.55)] text-ground placeholder:text-[rgba(23,21,21,0.55)]"
      : "bg-ground-raised border-divider text-ink hover:border-edge",
    error && "border-ground-black",
    multiline && "min-h-[120px] resize-y",
  );

  return (
    <div>
      <label
        htmlFor={name}
        className={cn(
          "mb-[6px] block text-micro uppercase",
          tone === "accent" ? "opacity-85" : "text-ink-mute",
        )}
      >
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>

      {multiline ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          defaultValue={state.values[name]}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={control}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={state.values[name]}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={control}
        />
      )}

      {error ? (
        <p id={errorId} className="mt-[6px] text-[12px] font-extrabold">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Select({
  name,
  label,
  tone,
  options,
}: {
  name: ContactField;
  label: string;
  tone: "accent" | "ground";
  options: string[];
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className={cn(
          "mb-[6px] block text-micro uppercase",
          tone === "accent" ? "opacity-85" : "text-ink-mute",
        )}
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue=""
        className={cn(
          "min-h-[48px] w-full border px-3 py-2 text-sm",
          tone === "accent"
            ? "bg-[rgba(23,21,21,0.10)] border-[rgba(23,21,21,0.55)] text-ground"
            : "bg-ground-raised border-divider text-ink",
        )}
      >
        <option value="">Select one</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-ground text-ink">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Confirmation({
  tone,
  message,
}: {
  tone: "accent" | "ground";
  message: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col gap-3 border p-7",
        tone === "accent"
          ? "border-ground bg-ground text-ink"
          : "border-divider bg-ground-raised",
      )}
    >
      <p className="text-h4">Enquiry received.</p>
      <p className={tone === "accent" ? "text-sm text-ink-dim" : "text-sm text-ink-mute"}>
        {message}
      </p>
      <p className="text-[13px] text-ink-faint">
        In the meantime, the capability index is the fastest way to see whether
        we have solved something like your problem before.
      </p>
    </div>
  );
}
