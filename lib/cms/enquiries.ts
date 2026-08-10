import "server-only";

import { appendFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { dirname, join } from "node:path";

/**
 * Contact-form enquiry store.
 *
 * Two files, deliberately:
 *
 *  - `enquiries.jsonl` — the submissions themselves, one JSON object per line,
 *    append-only. `appendFile` never rewrites existing bytes, so two people
 *    submitting at the same moment cannot overwrite each other. A read-modify-
 *    write of a single JSON array could silently lose an enquiry, and losing a
 *    sales lead is the worst failure this code could have.
 *
 *  - `enquiry-status.json` — read/archived flags keyed by id, written
 *    atomically. Kept separate so marking one enquiry as read never rewrites
 *    the log that submissions are being appended to.
 *
 * ⚠ PRIVACY: these files contain names, email addresses and whatever a visitor
 * typed. They are gitignored — do not commit them. Set a retention policy
 * before this handles real traffic, and prefer a real CRM once volume justifies
 * it: swap the two functions below and nothing else changes.
 */

const DIR = join(process.cwd(), "content");
const LOG_PATH = join(DIR, "enquiries.jsonl");
const STATUS_PATH = join(DIR, "enquiry-status.json");

export type EnquiryStatus = "new" | "read" | "archived";

export interface Enquiry {
  id: string;
  receivedAt: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  problem: string;
  status: EnquiryStatus;
}

type StoredEnquiry = Omit<Enquiry, "status">;
type StatusMap = Record<string, EnquiryStatus>;

export interface RecordResult {
  record: StoredEnquiry;
  /** Written to the append-only log. False on a read-only filesystem. */
  stored: boolean;
  /** Delivered to ENQUIRY_WEBHOOK_URL. False when unset or the POST failed. */
  notified: boolean;
}

/**
 * Capture an enquiry through every channel available, and report honestly on
 * each.
 *
 * Both paths are optional and independent, because the deployment target
 * decides which exist: a serverless host has no writable disk, and a host
 * without a webhook configured has no push channel. The caller decides what to
 * tell the visitor based on whether *either* succeeded — the one unacceptable
 * outcome is thanking someone for a message that reached nobody.
 */
export async function recordEnquiry(
  input: Omit<StoredEnquiry, "id" | "receivedAt">,
): Promise<RecordResult> {
  const record: StoredEnquiry = {
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    ...input,
  };

  const [stored, notified] = await Promise.all([
    persist(record),
    notifyOwner(record),
  ]);

  return { record, stored, notified };
}

async function persist(record: StoredEnquiry): Promise<boolean> {
  try {
    await mkdir(dirname(LOG_PATH), { recursive: true });
    await appendFile(LOG_PATH, `${JSON.stringify(record)}\n`, "utf8");
    return true;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    // EROFS/EACCES/EPERM on a read-only serverless filesystem is expected, not
    // a fault — log it quietly and let the webhook carry the enquiry.
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      console.warn(
        "[enquiries] filesystem is read-only; relying on the webhook. " +
          "Add a database to keep an inbox on this deployment.",
      );
    } else {
      console.error("[enquiries] could not store enquiry", error);
    }
    return false;
  }
}

async function readStatuses(): Promise<StatusMap> {
  try {
    return JSON.parse(await readFile(STATUS_PATH, "utf8")) as StatusMap;
  } catch {
    return {};
  }
}

/** Every enquiry, newest first, with its current status merged in. */
export async function readEnquiries(): Promise<Enquiry[]> {
  let raw: string;
  try {
    raw = await readFile(LOG_PATH, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const statuses = await readStatuses();

  return raw
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as StoredEnquiry];
      } catch {
        // One corrupt line must not hide every other enquiry.
        console.error("[enquiries] skipping unparseable line");
        return [];
      }
    })
    .map((entry) => ({ ...entry, status: statuses[entry.id] ?? "new" }))
    .sort((a, b) => Date.parse(b.receivedAt) - Date.parse(a.receivedAt));
}

export async function setEnquiryStatus(id: string, status: EnquiryStatus) {
  const statuses = await readStatuses();
  statuses[id] = status;

  await mkdir(dirname(STATUS_PATH), { recursive: true });
  const temporary = `${STATUS_PATH}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(statuses, null, 2)}\n`, "utf8");
  await rename(temporary, STATUS_PATH);
}

/**
 * Push a notification so the owner learns about an enquiry without opening the
 * admin.
 *
 * Set `ENQUIRY_WEBHOOK_URL` to a Slack/Teams/Discord incoming webhook, or any
 * endpoint that accepts JSON. Deliberately provider-agnostic: no SDK, no API
 * key handling, and swapping to an email service is one fetch call.
 *
 * Failure here must never fail the submission — the enquiry is already durably
 * stored by the time this runs.
 */
export async function notifyOwner(enquiry: StoredEnquiry): Promise<boolean> {
  const url = process.env.ENQUIRY_WEBHOOK_URL;
  if (!url) return false;

  const summary =
    `New enquiry from ${enquiry.name} (${enquiry.email})` +
    (enquiry.company ? ` at ${enquiry.company}` : "") +
    (enquiry.budget ? ` — budget: ${enquiry.budget}` : "") +
    `\n\n${enquiry.problem}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // `text` is what Slack, Teams and Discord all read, and harmless elsewhere.
      body: JSON.stringify({ text: summary, enquiry }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error(
        `[enquiries] webhook responded ${response.status} ${response.statusText}`,
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("[enquiries] webhook delivery failed", error);
    return false;
  }
}
