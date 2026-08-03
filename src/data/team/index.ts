/**
 * The leadership roster — ratified 3 August 2026, context-round11-scope.md §2.
 *
 * Five real people, named for public credibility. §2.1 is the hard constraint
 * on this file and outranks the instruction to add bios: Sumeet did not supply
 * bios for the other four, so `bio` is absent for them — never an empty
 * string, never a placeholder. Do not add tenure, past employer or capability
 * claims for any entry but Sumeet's, and his is assembled only from sentences
 * already published elsewhere on this site (the Richemont / Landmark Group /
 * Alshaya EMEA history on /why-yallo and /leadership's own hero copy) — no
 * fact appears here that a reader could not already find published.
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
    /* No LinkedIn URL supplied this round (§2 table). Absent rather than
       invented from a name pattern. */
    bio: "Enterprise IT operator at Richemont, retail transformation lead at Landmark Group and programme director at Alshaya EMEA, before founding Yallo Talent. The operators who shipped those programmes are the ones who review every shortlist today.",
  },
  {
    slug: "chandrasekharkolar",
    /* Display spelling is Sumeet's own, corrected live to "Chandrashekhar"
       during round 11 (superseding the scope doc's transcription,
       "Chandrashekar"). The LinkedIn slug below is exactly as supplied and is
       a different transliteration of the same name — flagged, not
       reconciled, per §2.3. Do not derive one from the other. */
    name: "Chandrashekhar Kolar",
    role: "Head of Managed Delivery",
    linkedin: "https://www.linkedin.com/in/chandrasekharkolar/",
  },
  {
    slug: "niharika-patir",
    name: "Niharika Patir",
    /* Head of Talent Operations, per Sumeet's 3 August ruling, which
       supersedes the "Talent Acquisition" title recorded elsewhere in this
       project (§2.3). */
    role: "Head of Talent Operations",
    linkedin: "https://www.linkedin.com/in/patirniharika/",
  },
  {
    slug: "raphy-varghese",
    name: "Raphy Varghese",
    role: "Head of Marketing & Growth",
    linkedin: "https://www.linkedin.com/in/vargheseraphy/",
  },
  {
    slug: "kritika-poddar",
    name: "Kritika Poddar",
    role: "Head of Finance & PMO",
    linkedin: "https://www.linkedin.com/in/kritikapo/",
  },
];
