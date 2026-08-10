/**
 * Shared result shape for the admin's server actions.
 *
 * Kept out of the `"use server"` module: a server-action file may only export
 * async functions, so a plain object exported from one becomes a server
 * reference and arrives at the client as `undefined`.
 */
export interface AdminResult {
  status: "idle" | "saved" | "error";
  message: string;
}

export const initialAdminResult: AdminResult = { status: "idle", message: "" };
