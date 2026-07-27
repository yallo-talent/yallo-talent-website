export type InsightType = "article" | "research" | "paper";
export type InsightHue =
  | "blue"
  | "green"
  | "orange"
  | "teal"
  | "violet"
  | "rose";

export interface Insight {
  slug: string;
  title: string;
  type: InsightType;
  label: string;
  hue: InsightHue;
  readTime: string;
  eyebrow: string;
  image: string;
  imageAlt: string;
  excerpt: string;
}

export const insights: Insight[] = [
  {
    slug: "gcc-ai-skills-gap",
    title: "How GCC enterprises are closing the AI skills gap",
    type: "article",
    label: "Article",
    hue: "blue",
    readTime: "6 min read",
    eyebrow: "AI · Talent",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80&auto=format&fit=crop",
    imageAlt: "AI abstract data visualisation",
    excerpt:
      "GCC enterprises are competing globally for AI talent — and quietly winning. Here's how the smart programmes are structuring their bench, and where the market rate now sits.",
  },
  {
    slug: "2-to-1-cv-ratio",
    title: "Close talent gaps without the 200-CV pile",
    type: "article",
    label: "Article",
    hue: "orange",
    readTime: "5 min read",
    eyebrow: "Your screening",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Recruiter reviewing candidate profiles",
    excerpt:
      "The average corporate opening attracts 250+ applications and only 4–6 are worth interviewing. Here's why the 2:1 CV-to-interview ratio matters more than volume.",
  },
  {
    slug: "sap-talent-gcc",
    title: "SAP talent in the GCC: what your peers are paying",
    type: "research",
    label: "Research",
    hue: "teal",
    readTime: "12 min read",
    eyebrow: "Market data",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Analytics and market data",
    excerpt:
      "Compensation windows, availability by module, and where the SAP bench is actually located across UAE, KSA and Bengaluru delivery centres.",
  },
  {
    slug: "gcc-engineering-centre-90-days",
    title: "Stand up your GCC engineering centre in 90 days",
    type: "paper",
    label: "White Paper",
    hue: "green",
    readTime: "20 min read",
    eyebrow: "Capability build",
    image:
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Modern engineering office space",
    excerpt:
      "A day-by-day operational blueprint for building a Global Capability Centre in India — from leadership team through to full engineering bench, in the first 90 days.",
  },
  {
    slug: "cio-hiring-problem",
    title: "Stop your roadmap slipping on open seats",
    type: "article",
    label: "Article",
    hue: "rose",
    readTime: "7 min read",
    eyebrow: "For CIOs",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Enterprise leadership meeting",
    excerpt:
      "Every open specialist seat is a milestone slipping. What CIOs can do differently to keep delivery on track when specialist hires are the bottleneck.",
  },
  {
    slug: "eor-vs-entity-uae",
    title: "EOR vs. UAE entity — the maths at 5, 10 and 25 hires",
    type: "research",
    label: "Research",
    hue: "teal",
    readTime: "9 min read",
    eyebrow: "UAE market",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Dubai skyline",
    excerpt:
      "When does an Employer of Record arrangement stop making sense and an owned UAE entity become cheaper? The break-even analysis at three headcount tiers.",
  },
  {
    slug: "sap-vs-oracle-migration",
    title: "SAP vs. Oracle — 2026 migration playbook",
    type: "paper",
    label: "White Paper",
    hue: "violet",
    readTime: "24 min read",
    eyebrow: "Platform strategy",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Analytics dashboard",
    excerpt:
      "The decision matrix for enterprise buyers considering an SAP S/4HANA or Oracle Fusion migration in 2026 — with team-shape and talent-availability inputs.",
  },
  {
    slug: "contract-vs-permanent-when",
    title: "Contract vs. permanent — the honest guide",
    type: "article",
    label: "Article",
    hue: "orange",
    readTime: "8 min read",
    eyebrow: "Engagement models",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Team meeting",
    excerpt:
      "The right engagement model isn't the one your finance director prefers. It's the one that matches how you want to hold the delivery risk. Rules of thumb inside.",
  },
];
