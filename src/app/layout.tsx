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
    "Specialist-screened shortlists in 72 hours. Middle East · Europe · India. Enterprise platforms: SAP, Oracle, Microsoft, Salesforce, Blue Yonder, Workday.",
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
      className={`${newsreader.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
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
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <StickyBriefCTA />
        </MotionProvider>
      </body>
    </html>
  );
}
