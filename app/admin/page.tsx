import { notFound, redirect } from "next/navigation";
import { EnquiryInbox } from "@/components/admin/EnquiryInbox";
import { MediaRow } from "@/components/admin/MediaRow";
import { TestimonialEditor } from "@/components/admin/TestimonialEditor";
import { Kicker } from "@/components/ui/Kicker";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { signOut } from "@/lib/actions/auth";
import {
  adminCredentialsConfigured,
  adminEnabled,
  isAuthenticated,
} from "@/lib/admin/guard";
import { getTestimonials } from "@/lib/cms";
import { readEnquiries } from "@/lib/cms/enquiries";
import { readOverrides, storeIsWritable } from "@/lib/cms/overrides";
import { mediaInventory, summarise } from "@/lib/media/inventory";
import { resolveMediaSlot } from "@/lib/media/resolve";
import type { Metadata } from "next";

/** Never indexed, never cached — it reads a file that changes under it. */
export const metadata: Metadata = {
  title: "Content admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // A disabled admin is a 404, not a 403: an unauthenticated visitor learns
  // nothing about whether the route exists.
  if (!adminEnabled()) notFound();

  // Middleware already redirects unauthenticated requests. This is the second
  // lock: server components can be reached by paths middleware does not cover,
  // and this page reads the enquiry inbox.
  if (!(await isAuthenticated())) redirect("/admin/login");

  const [overrides, writable, testimonials, enquiries] = await Promise.all([
    readOverrides(),
    storeIsWritable(),
    getTestimonials(),
    readEnquiries(),
  ]);

  const newEnquiries = enquiries.filter((e) => e.status === "new").length;
  const notifyConfigured = Boolean(process.env.ENQUIRY_WEBHOOK_URL);

  const inventory = mediaInventory();
  const stats = summarise(inventory);

  // Group by the section of the site each slot belongs to.
  const groups = inventory.reduce<Record<string, typeof inventory>>(
    (acc, row) => {
      const key = row.usedIn.split(" · ")[0];
      (acc[key] ??= []).push(row);
      return acc;
    },
    {},
  );

  return (
    <>
      <header className="px-page rule-b pb-12 pt-[calc(var(--nav-h)+64px)]">
        <Kicker>Content admin</Kicker>
        <h1 className="mt-4 max-w-[20ch] text-h2">Media and testimonials.</h1>
        <p className="mt-5 max-w-[70ch] text-base text-ink-mute">
          Every image, video and quote on the site, in one place. Changes are
          written to <code>content/overrides.json</code> and merged over the
          defaults in <code>lib/content</code> — the source files are never
          modified, so an override can always be reset.
        </p>

        {!writable ? (
          <p className="mt-6 max-w-[70ch] border border-accent-hairline px-4 py-3 text-sm text-accent-soft">
            <strong className="font-extrabold">Store is not writable.</strong>{" "}
            This deployment has a read-only filesystem, so the admin is
            read-only too. Run it locally, deploy to a host with a writable
            volume, or swap <code>lib/cms/overrides.ts</code> for a database.
          </p>
        ) : null}

        {adminCredentialsConfigured() ? (
          <form action={signOut} className="mt-6">
            <button
              type="submit"
              className="touch-target cursor-pointer border border-edge px-4 py-2 text-[13px] font-extrabold text-ink hover:bg-[rgba(248,244,244,0.08)]"
            >
              Sign out
            </button>
          </form>
        ) : (
          <p className="mt-6 max-w-[70ch] border border-accent-hairline px-4 py-3 text-[13px] text-accent-soft">
            <strong className="font-extrabold">No password is set.</strong> This
            admin is unprotected — allowed only because you are on localhost in
            development. Run{" "}
            <code>npm run admin:password -- &quot;your-password&quot;</code>{" "}
            before deploying; production refuses to serve this page at all
            without credentials.
          </p>
        )}

        {newEnquiries > 0 ? (
          <p className="mt-6 max-w-[70ch] border border-accent bg-accent px-4 py-3 text-sm font-extrabold text-ground">
            {newEnquiries} new{" "}
            {newEnquiries === 1 ? "enquiry" : "enquiries"} waiting —{" "}
            <a href="#enquiries" className="underline">
              open the inbox
            </a>
            .
          </p>
        ) : null}
      </header>

      {/* Enquiries — first, because an unanswered lead outranks everything else */}
      <Section id="enquiries">
        <SectionHeader
          num="01"
          kicker="Contact form"
          title="Enquiries."
          lede="Every submission from the contact form, newest first. Stored on receipt, before any notification is attempted."
          className="mb-8"
        />

        <div className="mb-8 flex max-w-[80ch] flex-col gap-4">
          <p className="border border-divider p-6 text-sm text-ink-dim">
            <strong className="font-extrabold text-ink">Notifications.</strong>{" "}
            {notifyConfigured ? (
              <>
                <code>ENQUIRY_WEBHOOK_URL</code> is set, so every enquiry is
                pushed to that endpoint as it arrives.
              </>
            ) : (
              <>
                <code>ENQUIRY_WEBHOOK_URL</code> is <strong>not set</strong>.
                Point it at a Slack, Teams or Discord incoming webhook to get
                each enquiry pushed to you.
              </>
            )}
          </p>

          {!writable ? (
            <p className="border border-accent-hairline p-6 text-sm text-accent-soft">
              <strong className="font-extrabold">
                No inbox on this deployment.
              </strong>{" "}
              The filesystem here is read-only, so enquiries are not stored —
              they are delivered by webhook only.{" "}
              {notifyConfigured
                ? "The webhook is configured, so submissions do reach you."
                : "With no webhook configured either, the contact form currently tells visitors it cannot deliver, rather than accepting a message that would go nowhere. Set ENQUIRY_WEBHOOK_URL now."}
            </p>
          ) : null}
        </div>

        <EnquiryInbox enquiries={enquiries} />
      </Section>

      {/* Inventory summary */}
      <Section id="summary">
        <SectionHeader
          num="02"
          kicker="Coverage"
          title="What is filled, and what is waiting."
          className="mb-10"
        />

        <dl className="grid grid-hairline grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          <Stat label="Slots total" value={String(stats.total)} />
          <Stat label="Filled" value={String(stats.filled)} accent />
          <Stat label="Awaiting asset" value={String(stats.awaiting)} />
          <Stat
            label="Photos filled"
            value={`${stats.byKind.photo.filled} / ${stats.byKind.photo.total}`}
          />
          <Stat
            label="Product UI captures"
            value={`${stats.byKind.screenshot.filled} / ${stats.byKind.screenshot.total}`}
          />
          <Stat
            label="Videos"
            value={`${stats.byKind.video.filled} / ${stats.byKind.video.total}`}
          />
        </dl>

        <div className="mt-8 max-w-[80ch] border border-divider p-6 text-sm text-ink-dim">
          <p className="mb-3 text-micro uppercase text-accent-text">
            Why the product-UI slots are empty
          </p>
          <p>
            Slots marked <strong className="font-extrabold">product UI</strong>{" "}
            depict our own interfaces — consoles, dashboards, review queues. A
            stock photograph cannot fill one honestly: the page would be
            presenting someone else&apos;s software as ours. They stay on
            labelled placeholders until a real capture exists, and you can point
            them at one here.
          </p>
          <p className="mt-3">
            Slots marked <strong className="font-extrabold">photo</strong> show
            physical context — a line, a warehouse, a site — so licensed
            photography fills them legitimately. Those are already populated
            from the manifest.
          </p>
        </div>
      </Section>

      {/* Licence provenance */}
      <Section id="licence">
        <SectionHeader
          num="03"
          kicker="Licence"
          title="Where the assets came from."
          className="mb-10"
        />
        <div className="max-w-[80ch] border border-divider p-6 text-sm text-ink-dim">
          <p>
            All bundled photography and video is from{" "}
            <a
              href="https://www.pexels.com/license/"
              target="_blank"
              rel="noreferrer noopener"
              className="text-accent-text hover:text-accent-soft"
            >
              Pexels
            </a>
            : commercial use permitted, modification permitted, attribution not
            required, no watermark. Provenance for every file is recorded in{" "}
            <code>public/media/credits.json</code> and each row below links to
            its source page.
          </p>
          <p className="mt-3">
            Assets are vendored into <code>public/media</code> by{" "}
            <code>npm run media</code> rather than hotlinked, so the site has no
            runtime dependency on a third-party CDN.
          </p>
        </div>
      </Section>

      {/* Media slots */}
      <Section id="media">
        <SectionHeader
          num="04"
          kicker="Media slots"
          title="Images and video."
          lede="Point a slot at any file under /public, or an https URL. Leave the field empty to clear it back to its placeholder."
          className="mb-10"
        />

        <div className="mb-10 max-w-[80ch] border border-divider p-6 text-sm text-ink-dim">
          <p className="mb-4 text-micro uppercase text-accent-text">
            Where to put a new image
          </p>

          <ol className="flex flex-col gap-4">
            <li>
              <strong className="font-extrabold text-ink">
                1 · Drop the file in <code>public/media/</code>
              </strong>
              <p className="mt-1">
                Everything under <code>public/</code> is served from the site
                root, so <code>public/media/line.jpg</code> becomes{" "}
                <code>/media/line.jpg</code>. That is what you type in the
                Source field below — the <code>public</code> part is never in
                the URL.
              </p>
            </li>
            <li>
              <strong className="font-extrabold text-ink">
                2 · Commit and push
              </strong>
              <p className="mt-1">
                The file has to be in the repository to exist on the deployed
                site. Vercel rebuilds on push and the image goes live.
              </p>
            </li>
            <li>
              <strong className="font-extrabold text-ink">
                3 · Set the path — permanently
              </strong>
              <p className="mt-1">
                Edits made here are stored in{" "}
                <code>content/overrides.json</code>, which{" "}
                <strong className="text-accent-soft">
                  cannot be written on this deployment
                </strong>
                . For a change that survives, add the file to{" "}
                <code>lib/media/manifest.ts</code> against the slot id instead,
                then commit. This panel is the right tool locally; the manifest
                is the right tool for production.
              </p>
            </li>
          </ol>

          <p className="mt-5 border-t border-hairline pt-4 text-[13px] text-ink-faint">
            An <code>https://</code> URL also works and needs no file at all,
            but it renders unoptimised and breaks if the far end moves it — fine
            for trying something out, not for launch.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {Object.entries(groups).map(([group, rows]) => (
            <section key={group}>
              <h3 className="mb-4 text-micro uppercase text-accent-text">
                {group} — {rows.length} slots
              </h3>
              <ul className="flex flex-col grid-hairline">
                {rows.map((row) => {
                  const resolved = resolveMediaSlot(
                    { id: row.id, caption: row.caption },
                    overrides.media,
                  );
                  return (
                    <MediaRow
                      key={row.id}
                      slot={row}
                      currentSrc={resolved.src}
                      overridden={Boolean(overrides.media[row.id])}
                    />
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials" rule={false}>
        <SectionHeader
          num="05"
          kicker="Testimonials"
          title="Client quotes."
          lede="A quote may only be marked approved once it carries a real name, role and company — the server re-checks this on save."
          className="mb-10"
        />
        <TestimonialEditor testimonials={testimonials} />
      </Section>
    </>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-ground p-6">
      <dt className="text-micro uppercase text-ink-faint">{label}</dt>
      <dd
        className={
          accent
            ? "mt-2 text-3xl font-extrabold text-accent"
            : "mt-2 text-3xl font-extrabold text-ink"
        }
      >
        {value}
      </dd>
    </div>
  );
}
