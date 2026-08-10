"use server";

import {
  validateEnquiry,
  type ContactField,
  type ContactState,
} from "@/lib/actions/contact-state";
import { recordEnquiry } from "@/lib/cms/enquiries";
import { site } from "@/lib/site";

/**
 * Discovery-call enquiry handler.
 *
 * Validation runs here because this is the only place it cannot be bypassed.
 * Delivery is deliberately unwired: adding an email or CRM call at the marked
 * point is the only change needed to make it live.
 *
 * This module exports exactly one async function — a `"use server"` file may not
 * export anything else. Shared shape and rules live in `contact-state.ts`.
 */
export async function submitEnquiry(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const read = (field: ContactField) =>
    String(formData.get(field) ?? "").trim();

  const values = {
    name: read("name"),
    email: read("email"),
    company: read("company"),
    problem: read("problem"),
    budget: read("budget"),
  };

  // Honeypot: a real visitor never sees this field, so anything in it is a bot.
  // Report success so the bot learns nothing, and send nothing onward.
  if (String(formData.get("website") ?? "").length > 0) {
    return {
      status: "success",
      message: "Thanks — we will be in touch within one working day.",
      errors: {},
      values: {},
    };
  }

  const errors = validateEnquiry(values);

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Some details need another look.",
      errors,
      values,
    };
  }

  // ── Delivery ─────────────────────────────────────────────────────────────
  // Two independent channels: the append-only log and the webhook. Which are
  // available depends entirely on where this is deployed, so success is defined
  // as "at least one of them worked".
  const { stored, notified } = await recordEnquiry({
    name: values.name,
    email: values.email,
    company: values.company || null,
    budget: values.budget || null,
    problem: values.problem,
  });

  if (!stored && !notified) {
    // Nothing captured the message anywhere. Saying "thanks" here would be a
    // lie that costs someone a real conversation — tell them the truth and
    // give them a route that works.
    console.error(
      "[contact] enquiry reached no channel — no writable store and no " +
        "working ENQUIRY_WEBHOOK_URL. Configure one immediately.",
    );
    return {
      status: "error",
      message:
        "We could not deliver your message. Please email us directly at " +
        `${site.contact.email} — we will pick it up from there.`,
      errors: {},
      values,
    };
  }

  return {
    status: "success",
    message: "Thanks — we will be in touch within one working day.",
    errors: {},
    values: {},
  };
}
