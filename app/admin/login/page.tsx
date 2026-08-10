import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Kicker } from "@/components/ui/Kicker";
import { Wordmark } from "@/components/ui/Wordmark";
import {
  adminCredentialsConfigured,
  adminEnabled,
  isAuthenticated,
} from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (!adminEnabled()) notFound();

  // Already signed in — no reason to show a login form.
  if (await isAuthenticated()) redirect("/admin");

  const configured = adminCredentialsConfigured();

  return (
    <section className="px-page flex min-h-svh flex-col justify-center py-24">
      <div className="absolute inset-0 -z-10 wire-grid opacity-50" aria-hidden="true" />

      <Wordmark href={null} size="lg" />
      <Kicker className="mt-8">Content admin</Kicker>
      <h1 className="mb-8 mt-4 max-w-[16ch] text-h2">Sign in.</h1>

      {configured ? (
        <LoginForm />
      ) : (
        <div className="max-w-[560px] border border-accent-hairline p-6 text-sm text-accent-soft">
          <p className="font-extrabold">No admin credentials are configured.</p>
          <p className="mt-3">
            Generate them, then restart the dev server:
          </p>
          <pre className="mt-3 overflow-x-auto border border-hairline bg-ground-graph p-4 text-[12.5px]">
            <code>npm run admin:password -- &quot;your-password&quot;</code>
          </pre>
          <p className="mt-3">
            Paste the output into <code>.env.local</code>.
          </p>
        </div>
      )}

      <p className="mt-10 max-w-[52ch] text-[13px] text-ink-faint">
        This page controls the enquiry inbox and every piece of site content.
        Sessions last 8 hours.
      </p>
    </section>
  );
}
