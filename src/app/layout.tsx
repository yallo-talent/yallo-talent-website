import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Newsreader } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { NavBar } from "@/components/layout/NavBar";
import { StickyBriefCTA } from "@/components/layout/StickyBriefCTA";
import { AMBIENT_SCHEME, DEFAULT_THEME, themeInitScript } from "@/config/theme";
import { organisationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import "./globals.css";

/* Three faces, divided strictly by job: serif asserts, sans is read, mono was
   measured. Newsreader carries optical sizing, so it holds at 72px without the
   brittleness a display serif would show. */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yallo Talent — Contract, Permanent, EOR, Managed Delivery",
  description:
    "Specialist-screened shortlists in 72 hours. Middle East · Europe. Enterprise platforms: SAP, Oracle, Microsoft, Salesforce, Blue Yonder, Workday.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      data-theme={DEFAULT_THEME}
      data-ambient={AMBIENT_SCHEME}
      /* No `h-full` on <html>, and this is the sticky-header fix rather than
          tidying. `h-full` sets html to height:100% — measured at 800px against
          7740px of content — so the header's sticky containing block was one
          viewport tall and it unstuck after the first screen, leaving the L1
          sub-nav pinned at 68px with nothing above it. That is the "floats
          mid-way on scroll-up" bug: the sub-nav was correct all along and the
          header was not. body keeps min-h-full, which is what the full-height
          layout actually needed. */
      className={`${newsreader.variable} ${inter.variable} ${plexMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: pre-hydration theme script — trusted static string built in src/config/theme.ts, sets data-theme on <html> before first paint to prevent a flash of the wrong register
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        {/* Organisation and the four legal entities. Deliberately carries no
            street address or telephone: those facts are not established, and
            fabricated LocalBusiness detail is exactly the wrong thing to feed
            a search engine. */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD built from typed data in src/lib/jsonld.ts, serialised with JSON.stringify
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organisationJsonLd(), websiteJsonLd()]),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <MotionProvider>
          <NavBar />
          {/* tabIndex -1 so the skip link MOVES FOCUS rather than only scrolling.
              Measured before: activeElement stayed on <body>, and Chromium's
              sequential-focus starting point happened to rescue traversal — which
              is luck, not conformance. scroll-margin-top clears the sticky header,
              which had been burying the hero eyebrow by its full 40px height. */}
          <main
            id="main"
            className="flex-1"
            tabIndex={-1}
            style={{ scrollMarginTop: "96px" }}
          >
            {children}
          </main>
          <Footer />
          <StickyBriefCTA />
        </MotionProvider>
      </body>
    </html>
  );
}
