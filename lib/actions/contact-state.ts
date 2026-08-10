/**
 * Shared shape and validation for the discovery-call enquiry.
 *
 * Kept out of the `"use server"` module on purpose: a server-action file may only
 * export async functions, so a plain object exported from one is turned into a
 * server reference and arrives at the client as `undefined`.
 */

export type ContactField = "name" | "email" | "company" | "problem" | "budget";

export interface ContactState {
  status: "idle" | "success" | "error";
  message: string;
  errors: Partial<Record<ContactField, string>>;
  /** Echoed back so a failed submit does not clear the form. */
  values: Partial<Record<ContactField, string>>;
}

export const initialContactState: ContactState = {
  status: "idle",
  message: "",
  errors: {},
  values: {},
};

export const CONTACT_LIMITS = {
  name: { min: 2, max: 120 },
  email: { max: 200 },
  company: { max: 160 },
  problem: { min: 30, max: 4000 },
} as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface EnquiryValues {
  name: string;
  email: string;
  company: string;
  problem: string;
  budget: string;
}

/**
 * Pure validation, usable on either side of the boundary. The server calls this
 * as the authority; the client may call it for immediate feedback.
 */
export function validateEnquiry(values: EnquiryValues) {
  const errors: ContactState["errors"] = {};

  if (values.name.length < CONTACT_LIMITS.name.min) {
    errors.name = "Please give us a name we can address you by.";
  } else if (values.name.length > CONTACT_LIMITS.name.max) {
    errors.name = "That name is longer than we can store.";
  }

  if (!values.email) {
    errors.email = "We need an address to reply to.";
  } else if (
    !EMAIL.test(values.email) ||
    values.email.length > CONTACT_LIMITS.email.max
  ) {
    errors.email = "That does not look like a working email address.";
  }

  if (values.company.length > CONTACT_LIMITS.company.max) {
    errors.company = "Company name is too long.";
  }

  if (values.problem.length < CONTACT_LIMITS.problem.min) {
    errors.problem =
      "A sentence or two more, please — enough for us to come to the call prepared.";
  } else if (values.problem.length > CONTACT_LIMITS.problem.max) {
    errors.problem = "Please trim this to under 4,000 characters.";
  }

  return errors;
}
