import type { LegalPageData } from "@/components/blocks/editorial/LegalPageShell";

export const cookiesData: LegalPageData = {
  title: "Cookies notice",
  lastUpdated: "2026-07-27",
  lede: "How Yallo Talent uses cookies and similar technologies on talent.yallo.co. Short version: we keep it minimal.",
  sections: [
    {
      heading: "What cookies do we use?",
      body: [
        "We use a small set of cookies and browser storage to make the site work and to understand which pages are useful. We don't use cross-site tracking cookies.",
      ],
    },
    {
      heading: "Strictly necessary",
      body: [
        "yallo-theme (localStorage) — remembers whether you set the site to light or dark mode. No personal data.",
        "Session cookies from our hosting provider (Vercel) — routing and load-balancing. These are set by the infrastructure and expire when you close the browser.",
      ],
    },
    {
      heading: "Analytics",
      body: [
        "We use privacy-friendly, aggregate analytics to see which pages are viewed and where the experience needs improvement. We don't set cross-site tracking cookies for advertising purposes.",
        "The analytics we use don't identify you personally and don't share data with advertising networks.",
      ],
    },
    {
      heading: "Third-party services",
      body: [
        "Image assets are served from images.unsplash.com. Font files are served from fonts.gstatic.com. These providers may log basic request data (IP, browser) as part of standard CDN operation — governed by their own privacy policies.",
        "Form submissions from /brief and /jobs go through our email service (Resend). See our Privacy notice for how submissions are handled.",
      ],
    },
    {
      heading: "Managing cookies",
      body: [
        "You can clear cookies and localStorage at any time via your browser settings. Clearing yallo-theme will simply reset the site to its default (auto) theme preference.",
        "Because we don't use marketing or advertising cookies, there's no separate consent banner to manage.",
      ],
    },
    {
      heading: "Changes to this notice",
      body: [
        "If we start using new categories of cookies, we'll update this notice and, where legally required, ask for your consent before setting them.",
      ],
    },
  ],
};
