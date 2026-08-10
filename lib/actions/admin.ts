"use server";

import { revalidatePath } from "next/cache";
import { assertAdminEnabled } from "@/lib/admin/guard";
import { readOverrides, writeOverrides } from "@/lib/cms/overrides";
import { setEnquiryStatus, type EnquiryStatus } from "@/lib/cms/enquiries";
import type { AdminResult } from "@/lib/actions/admin-state";
import type { Testimonial } from "@/lib/types";

/** Content changes affect every route, so revalidate the whole tree. */
function revalidateSite() {
  revalidatePath("/", "layout");
}

/** Mark one enquiry read or archived. Enquiries are never deleted from here. */
export async function updateEnquiryStatus(
  _previous: AdminResult,
  formData: FormData,
): Promise<AdminResult> {
  try {
    await assertAdminEnabled();

    const id = String(formData.get("id") ?? "").trim();
    const status = String(formData.get("status") ?? "") as EnquiryStatus;

    if (!id) return { status: "error", message: "Missing enquiry id." };
    if (!["new", "read", "archived"].includes(status)) {
      return { status: "error", message: `Unknown status "${status}".` };
    }

    await setEnquiryStatus(id, status);
    revalidatePath("/admin");

    return { status: "saved", message: `Marked ${status}.` };
  } catch (error) {
    return { status: "error", message: (error as Error).message };
  }
}

/** Only allow same-origin public paths or https URLs — never javascript: etc. */
function sanitiseSrc(raw: string): string | null {
  const value = raw.trim();
  if (!value) return "";
  if (value.startsWith("/")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/**
 * Update one media slot.
 *
 * Save and reset share one action, dispatched on the submit button's `intent`.
 * Two actions would mean two `useActionState` results per row, and the row
 * would have to guess which message is the current one — which is exactly the
 * kind of staleness that makes an admin untrustworthy.
 */
export async function saveMediaSlot(
  _previous: AdminResult,
  formData: FormData,
): Promise<AdminResult> {
  try {
    await assertAdminEnabled();

    const id = String(formData.get("id") ?? "").trim();
    if (!id) return { status: "error", message: "Missing slot id." };

    if (formData.get("intent") === "reset") {
      const current = await readOverrides();
      const media = { ...current.media };
      delete media[id];

      await writeOverrides({ ...current, media });
      revalidateSite();

      return {
        status: "saved",
        message: `Reset ${id} to the manifest default.`,
      };
    }

    const src = sanitiseSrc(String(formData.get("src") ?? ""));
    if (src === null) {
      return {
        status: "error",
        message: "Source must be a /public path or an https URL.",
      };
    }

    const caption = String(formData.get("caption") ?? "").trim();
    const alt = String(formData.get("alt") ?? "").trim();

    const current = await readOverrides();
    const next = {
      ...current,
      media: {
        ...current.media,
        [id]: {
          src,
          ...(caption ? { caption } : {}),
          ...(alt ? { alt } : {}),
        },
      },
    };

    await writeOverrides(next);
    revalidateSite();

    return {
      status: "saved",
      message: src ? `Updated ${id}.` : `Cleared ${id} back to its placeholder.`,
    };
  } catch (error) {
    return { status: "error", message: (error as Error).message };
  }
}

/**
 * Replace the testimonial list.
 *
 * A quote may only lose its `sample` flag when it carries a real name, role and
 * company — an approved-but-anonymous quote is still an unattributable
 * endorsement, and this is the check that keeps a fabricated review off the
 * live site.
 */
export async function saveTestimonials(
  _previous: AdminResult,
  formData: FormData,
): Promise<AdminResult> {
  try {
    await assertAdminEnabled();

    const count = Number(formData.get("count") ?? 0);
    const next: Testimonial[] = [];

    for (let i = 0; i < count; i++) {
      const quote = String(formData.get(`quote-${i}`) ?? "").trim();
      if (!quote) continue;

      const name = String(formData.get(`name-${i}`) ?? "").trim();
      const role = String(formData.get(`role-${i}`) ?? "").trim();
      const company = String(formData.get(`company-${i}`) ?? "").trim();
      const approved = formData.get(`approved-${i}`) === "on";

      const attributable = Boolean(name && role && company);
      if (approved && !attributable) {
        return {
          status: "error",
          message: `Quote ${i + 1} cannot be approved without a name, role and company.`,
        };
      }

      next.push({
        quote,
        name: name || "Name to be confirmed",
        role: role || "Role to be confirmed",
        company: company || "Company to be confirmed",
        project: String(formData.get(`project-${i}`) ?? "").trim() || undefined,
        sample: !approved,
      });
    }

    if (next.length === 0) {
      return { status: "error", message: "At least one quote is required." };
    }

    const current = await readOverrides();
    await writeOverrides({ ...current, testimonials: next });
    revalidateSite();

    const stillSample = next.filter((t) => t.sample).length;
    return {
      status: "saved",
      message:
        stillSample > 0
          ? `Saved ${next.length} quotes — ${stillSample} still marked as samples.`
          : `Saved ${next.length} approved quotes.`,
    };
  } catch (error) {
    return { status: "error", message: (error as Error).message };
  }
}
