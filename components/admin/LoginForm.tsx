"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn } from "@/lib/actions/auth";
import { initialLoginState, type LoginState } from "@/lib/actions/auth-state";

export function LoginForm() {
  const [state, action] = useActionState<LoginState, FormData>(
    signIn,
    initialLoginState,
  );

  return (
    <form action={action} className="flex w-full max-w-[420px] flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-micro uppercase text-ink-mute">Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          autoFocus
          required
          aria-invalid={state.status === "error" ? true : undefined}
          aria-describedby={state.status === "error" ? "login-error" : undefined}
          className="min-h-[52px] w-full border border-divider bg-ground-raised px-4 py-3 text-base text-ink"
        />
      </label>

      {state.status === "error" ? (
        <p
          id="login-error"
          role="alert"
          className="border border-accent-hairline px-4 py-3 text-sm text-accent-soft"
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="touch-target mt-2 inline-flex cursor-pointer items-center justify-center bg-accent px-7 py-4 text-[15px] font-extrabold text-ground transition-colors duration-[--duration-hover] hover:bg-accent-hover disabled:opacity-60"
    >
      {pending ? "Checking…" : "Sign in"}
    </button>
  );
}
