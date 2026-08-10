import type { Metadata } from "next";
import { AMBIENT_SCHEME, DEFAULT_THEME, themeInitScript } from "@/config/theme";
import { FONT_CLASSNAMES } from "../fonts";
import "../globals.css";

/**
 * The cockpit's OWN root layout — R-27.2.
 *
 * WHY A SECOND ROOT LAYOUT AND NOT A CONDITIONAL. Until this existed every
 * cockpit page rendered inside the public site's shell, so the writing surface
 * carried the marketing nav, the sticky brief CTA, the footer and the assistant
 * launcher. That is not a cosmetic complaint: at 1280 the sticky public header
 * sat over the cockpit's own bar, and the launcher's fixed button sat over the
 * bottom right of the editor. Both are in the screenshots from 10 August.
 *
 * A conditional inside one root layout was the alternative and it is worse in
 * the way that matters: it would put "is this the cockpit" in a server component
 * that has no route, reading a header set by middleware, and every piece of
 * public chrome would stay in the cockpit's module graph whether it rendered or
 * not. Two top-level route groups is what Next provides for exactly this, and
 * the boundary is then a fact about the file tree rather than a runtime
 * decision that can be got wrong.
 *
 * WHAT IS DELIBERATELY ABSENT. No `NavBar`, no `Footer`, no `StickyBriefCTA`, no
 * `AssistantLauncherMount`, and no `MotionProvider` — nothing under `/admin`
 * uses Framer Motion, and a provider that wraps nothing is a client boundary
 * for nothing. No JSON-LD: a noindex surface has no structured data to publish.
 *
 * WHAT IS DELIBERATELY PRESENT. The same fonts and the same `globals.css`, so
 * the cockpit is the same design system rather than a second one; the pre-paint
 * theme script, so a writer who chose dark on the site is not flashed light
 * here; and `data-ambient`, because the token layer resolves through it.
 *
 * NOINDEX IN THREE PLACES, unchanged and all three still load-bearing:
 * `robots.ts` disallows `/admin/`, the metadata below emits the meta tag, and
 * middleware sets `X-Robots-Tag` on every response including those no page's
 * metadata touches. `scripts/check-admin-isolation.mjs` asserts each one.
 */
export const metadata: Metadata = {
  title: "Yallo admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      data-theme={DEFAULT_THEME}
      data-ambient={AMBIENT_SCHEME}
      className={FONT_CLASSNAMES}
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: pre-hydration theme script — trusted static string built in src/config/theme.ts, sets data-theme on <html> before first paint to prevent a flash of the wrong register
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        {/* THE ONE `main` FOR EVERY ADMIN SURFACE, and it has to be here rather
            than in the cockpit shell. Sign-in and the preview route sit outside
            the `(cockpit)` group, so with the landmark down there those two
            pages would have all of their content outside any landmark — which
            they did not before, because the public layout's `main` used to wrap
            them. The cockpit shell keeps its own class on a `div`: two `main`
            elements on one page is worse than none. */}
        <main className="flex-1" id="main" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
