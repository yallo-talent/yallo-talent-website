/**
 * The leadership roster — ratified 3 August 2026, context-round11-scope.md §2.
 *
 * Five real people, named for public credibility.
 *
 * BIOS, ratified 7 August 2026, context-round19-scope.md §4.2. Every sentence
 * below was supplied or ratified by Sumeet on that date. That ruling supersedes
 * two earlier constraints on this file, and it supersedes them for exactly
 * these five entries and nothing else: §2.1's "no bio for anyone but Sumeet",
 * and round 18 §3's "no biography for any real named person". The text ships
 * VERBATIM — its typography may not be "improved", and no fact may be added to
 * it, generalised from it, or derived from a name pattern. A new person, a
 * changed role or an extra sentence needs its own ratification, not this one.
 *
 * No `image` field: canon bans photography sitewide, PetalPlate is the only
 * imagery system, and team portraits are an unratified canon amendment
 * (§2.2). This index has no field for one because the round must not ship a
 * silhouette, monogram or PetalPlate-as-portrait under another name.
 */

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  /** Absent, never an empty string, where no URL has been supplied. */
  linkedin?: string;
  bio?: string;
}

export const teamIndex: TeamMember[] = [
  {
    slug: "sumeet-goenka",
    name: "Sumeet Goenka",
    role: "Founder & CEO",
    /* Supplied by Sumeet, 7 August 2026, closing round 19 §7 item 1. Exactly as
       given, never derived from the name pattern the other four happen to share. */
    linkedin: "https://www.linkedin.com/in/sumeetgoenka/",
    bio: "Before founding Yallo, he was Group Chief Architect, SVP at Richemont, Chief Enterprise Architect at Landmark Group and Head of Enterprise Architecture at Alshaya EMEA, with earlier roles across Microsoft, Deloitte, Burberry, Vodafone and Oracle, spanning the UK, Europe, Middle East and APAC. The IT leader who delivered those complex transformations for 23+ years now builds your talent backbone today.",
  },
  {
    slug: "chandrasekharkolar",
    /* Display spelling is Sumeet's own, corrected live to "Chandrashekhar"
       during round 11 (superseding the scope doc's transcription,
       "Chandrashekar"). The LinkedIn slug below is exactly as supplied and is
       a different transliteration of the same name — flagged, not
       reconciled, per §2.3. Do not derive one from the other. */
    name: "Chandrashekhar Kolar",
    /* "from Head to Director", Sumeet's instruction of 7 August 2026, §4.1. */
    role: "Director of Managed Delivery",
    linkedin: "https://www.linkedin.com/in/chandrasekharkolar/",
    bio: "Twenty years in enterprise solution architecture and programme delivery across TCS, ITC Infotech, Oracle, EPAM and Landmark Group, with deep retail, loyalty and customer-data work in the Middle East. Based in Dubai, he has taken complex platform programmes from architecture through to go-live, and now owns Yallo's fixed-scope Managed Delivery engagements end to end.",
  },
  {
    slug: "niharika-patir",
    name: "Niharika Patir",
    /* Head of Talent Operations, per Sumeet's 3 August ruling, which
       supersedes the "Talent Acquisition" title recorded elsewhere in this
       project (§2.3). */
    role: "Head of Talent Operations",
    linkedin: "https://www.linkedin.com/in/patirniharika/",
    bio: "Fourteen years in recruitment across corporate and agency environments, with a Masters in Human Resources and Organisational Development from the Delhi School of Economics. From Bengaluru, she runs the screening and delivery operation behind every shortlist, owning the client's experience from brief to onboarding.",
  },
  {
    slug: "raphy-varghese",
    name: "Raphy Varghese",
    role: "Head of Marketing & Growth",
    linkedin: "https://www.linkedin.com/in/vargheseraphy/",
    bio: "An engineer by training, he leads marketing, growth and the web platforms Yallo's businesses run on. From Bengaluru, he builds the route that brings enterprise platform buyers to Yallo, and keeps it short from first contact to brief.",
  },
  {
    slug: "kritika-poddar",
    name: "Kritika Poddar",
    role: "Head of Finance & PMO",
    linkedin: "https://www.linkedin.com/in/kritikapo/",
    bio: "She runs finance, commercial governance and the PMO across Yallo Talent's contract and delivery book. Every engagement's commercials, from rate card to invoice, run through her office.",
  },
];
