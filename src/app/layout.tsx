import type { Metadata } from "next";
import { DM_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { NavBar } from "@/components/layout/NavBar";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yallo Talent — Contract, Permanent, EOR, Managed Delivery",
  description:
    "Architect-screened contractor shortlists in 72 hours. UK · ME · India. Enterprise platforms: SAP, Oracle, Microsoft, Salesforce, Blue Yonder, Workday.",
};

const themeInitScript = `
(function(){try{
  var stored=localStorage.getItem('yallo-theme');
  var theme=(stored==='light'||stored==='dark')?stored:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
  var root=document.documentElement;
  root.classList.toggle('light',theme==='light');
  root.classList.toggle('dark',theme==='dark');
}catch(e){}})();
`.trim();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${dmMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: pre-hydration theme script — trusted static string, sets class on <html> before body paint to prevent FOUC
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <NavBar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
