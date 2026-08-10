import type { Metadata, Viewport } from "next";
import { LoadShell } from "@/components/loader/LoadShell";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { SkipLink } from "@/components/layout/SkipLink";
import { archivo } from "@/lib/fonts";
import { organizationSchema } from "@/lib/metadata";
import { site } from "@/lib/site";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Engineering the future of intelligent software`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "AI systems",
    "computer vision",
    "industrial automation",
    "agentic AI",
    "custom software",
    "data platforms",
    "software engineering company",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: `${site.name} — Engineering the future of intelligent software`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#171515",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={archivo.variable}>
      <head>
        {/*
          Scroll reveals render their hidden initial state into the server HTML.
          Without JavaScript nothing would ever reveal them, so force the final
          state instead of shipping an invisible page.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <SkipLink />
        <LoadShell>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </LoadShell>
        <script
          type="application/ld+json"
          // Static, locally-constructed object — no external input reaches this.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />
      </body>
    </html>
  );
}
