/**
 * Shared shape for the login action. Separate from the `"use server"` module,
 * which may only export async functions.
 */
export interface LoginState {
  status: "idle" | "error";
  message: string;
}

export const initialLoginState: LoginState = { status: "idle", message: "" };
