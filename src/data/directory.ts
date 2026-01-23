// src/data/directory.ts

export type LinkKind =
  | "website"
  | "instagram"
  | "discord"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "x"
  | "linkedin"
  | "email"
  | "phone";

export type DirectoryLink = {
  kind: LinkKind;
  href: string;
  label?: string;
};

export type MeetupRecurrence =
  | {
      kind: "weekly";
      dayOfWeek: number; // 0=Sun..6=Sat
      hour24: number;
      minute: number;
    }
  | {
      kind: "monthlyNthDow";
      nth: number; // 1..5
      dayOfWeek: number; // 0=Sun..6=Sat
      hour24: number;
      minute: number;
    }
  | {
      kind: "monthlyOnDay";
      dayOfMonth: number; // 1..31 (if invalid for a month, clamp to last day)
      hour24: number;
      minute: number;
    }
  | {
      kind: "quarterlyOnDay";
      months: number[]; // e.g., [0,3,6,9] for Jan/Apr/Jul/Oct. Must be 4 months.
      dayOfMonth: number; // 1..31 (clamp to last day when needed)
      hour24: number;
      minute: number;
    }
  | {
      kind: "quarterlyNthDow";
      months: number[]; // e.g., [0,3,6,9] or any 4 fixed months
      nth: number; // 1..5
      dayOfWeek: number; // 0=Sun..6=Sat
      hour24: number;
      minute: number;
    }
  | {
      kind: "annualOnDate";
      month: number; // 0=Jan..11=Dec
      dayOfMonth: number; // 1..31 (clamp to last day when needed)
      hour24: number;
      minute: number;
    }
  | {
      kind: "annualNthDow";
      month: number; // 0=Jan..11=Dec
      nth: number; // 1..5
      dayOfWeek: number; // 0=Sun..6=Sat
      hour24: number;
      minute: number;
    };

export type DirectoryMeetup = {
  title?: string;
  recurrence: MeetupRecurrence;

  // If true, UI should display TBA and avoid generating directions.
  isTBA?: boolean;

  locationName?: string; // "Strangeways"
  locationCity?: string; // "Dallas, TX"
  address?: string; // Optional: full address
  mapsQuery?: string; // Optional: override query string for maps
  notes?: string; // Optional: additional note shown in modal and included in Add-to-Calendar notes

  // Optional: override default duration used in calendar instances.
  durationMinutes?: number;

  // Optional: Only for event links to show up on modal.
  rsvpUrl?: string;
  rsvpLabel?: string;
};

export type DirectoryItem = {
  id: string; // generated from name
  name: string;
  description: string;
  location?: string;
  links: DirectoryLink[];

  // Optional recurring meetups, used by /events calendar + homepage widgets
  meetups?: DirectoryMeetup[];

  /**
   * If true, this org is the “featured” org for the homepage “Next” meetup card.
   * Used by getHomeFeaturedOrg() so Home and Events pull from the same source of truth.
   */
  isHomeFeatured?: boolean;
};

export type DirectorySection = {
  id: string;
  title: string;
  subtitle?: string;
  items: DirectoryItem[];
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function withIds(
  sections: Array<
    Omit<DirectorySection, "items"> & { items: Omit<DirectoryItem, "id">[] }
  >,
): DirectorySection[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.map((it) => ({
      ...it,
      id: slugify(it.name),
    })),
  }));
}

// ============================================================================
// SECTIONS (ADD NEW SECTION HERE)
// ============================================================================

const SECTIONS_RAW: Array<
  Omit<DirectorySection, "items"> & { items: Omit<DirectoryItem, "id">[] }
> = [
  // ==========================================================================
  // GOVERNMENT (ADD ORGS HERE)
  // ==========================================================================
  {
    id: "government",
    title: "Government",
    subtitle:
      "Film commissions and official offices that help productions navigate DFW.",
    items: [
      {
        name: "Dallas Film & Creative Industries Office",
        location: "Dallas",
        description:
          "Official City of Dallas film office supporting productions with permitting, locations, and local creative industry development.",
        links: [
          {
            kind: "website",
            href: "https://dallascreates.org",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/dallasfilmcommission",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/dallasfilmcommission",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Fort Worth Film Commission",
        location: "Fort Worth",
        description:
          "Official film commission established in 2015 to assist with permits, locations, and local production needs in Fort Worth.",
        links: [
          {
            kind: "website",
            href: "https://fortworth.com/film",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/filmfortworth",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Texas Film Commission",
        location: "Texas (Statewide)",
        description:
          "The Governor’s film office providing statewide resources, incentives, Film Friendly Texas certification, and workforce support.",
        links: [
          {
            kind: "website",
            href: "https://gov.texas.gov/film",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/TexasFilmCommission",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/texasfilmcomm",
            label: "Instagram",
          },
          {
            kind: "linkedin",
            href: "https://www.linkedin.com/company/texas-film-commission",
            label: "LinkedIn",
          },
          {
            kind: "youtube",
            href: "https://www.youtube.com/@texasfilmcommission",
            label: "YouTube",
          },
        ],
      },
      {
        name: "City of Arlington – Film Friendly Office",
        location: "Arlington",
        description:
          "Arlington is a Film Friendly Texas community with filming coordinated through the city’s communications office and guidelines.",
        links: [
          {
            kind: "website",
            href: "https://www.arlingtontx.gov/Business/Film-Friendly-City",
            label: "Website",
          },
          {
            kind: "email",
            href: "mailto:film@arlingtontx.gov",
            label: "Email",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/cityofarlington",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/cityofarlington",
            label: "Instagram",
          },
        ],
      },
      {
        name: "City of Denton – Economic Development",
        location: "Denton",
        description:
          "Denton is a Film Friendly Texas city with a local permit process and support coordinated through city economic development.",
        links: [
          {
            kind: "website",
            href: "https://www.cityofdenton.com/1073/Film-Friendly-Denton",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/dentoneconomicdevelopment/",
            label: "Instagram",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/DentonEconomicDevelopment",
            label: "Facebook",
          },
          {
            kind: "linkedin",
            href: "https://www.linkedin.com/company/denton-tx-office-of-economic-development ",
            label: "LinkedIn",
          },
          {
            kind: "email",
            href: "mailto:economic.development@cityofdenton.com",
            label: "Email",
          },
          {
            kind: "phone",
            href: "tel:+19403497776",
            label: "(940) 349-7776",
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // INDUSTRY ORGANIZATIONS (ADD ORGS HERE)
  // ==========================================================================
  {
    id: "industry",
    title: "Industry Organizations",
    subtitle:
      "Networking, advocacy, and community organizations that support filmmakers across DFW.",
    items: [
      {
        name: "Dallas Film Society",
        location: "Dallas",
        description:
          "Nonprofit that produces the Dallas International Film Festival and year-round programs supporting film culture in Dallas.",
        links: [
          { kind: "website", href: "https://dallasfilm.org", label: "Website" },
          {
            kind: "instagram",
            href: "https://www.instagram.com/dallasiff",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Dallas Film Social",
        location: "Dallas",
        description:
          "A film and photography social founded by a local director. Hosts 4 meetups each year.",
        links: [
          {
            kind: "instagram",
            href: "https://www.instagram.com/dallas.film.social",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Dallas Producers Association (DPA)",
        location: "Dallas",
        description:
          "Professional trade organization representing producers and production industry vendors in North Texas through advocacy and networking.",
        links: [
          {
            kind: "website",
            href: "https://dallasproducers.org",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/dallasproducers",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/dallasproducers",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Dallas Screenwriters Association (DSA)",
        location: "Dallas",
        description:
          "Nonprofit founded in 1986 offering meetings, workshops, and speakers to help writers develop screenplays and industry knowledge.",
        links: [
          {
            kind: "website",
            href: "https://dallasscreenwriters.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/dallasscreenwriters",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/dallasscreenwriters",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Dallas Filmmakers Alliance (DFA)",
        location: "Dallas",
        description:
          "Nonprofit community focused on collaboration, education, and advancing indie film development through regular meetups and showcases.",
        links: [
          {
            kind: "website",
            href: "https://dallasfilmmakers.org",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/DallasFilmmakersAlliance",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/dallasfilmmakers",
            label: "Instagram",
          },
        ],
        meetups: [
          {
            title: "DFA Weekly Meetup",
            recurrence: { kind: "weekly", dayOfWeek: 3, hour24: 19, minute: 0 },
            locationName: "Strangeways",
            locationCity: "Dallas, TX",
            address: "2429 N Fitzhugh Ave, Dallas, TX 75204",
            mapsQuery: "Strangeways Dallas TX",
            notes:
              "Recurring listing only; confirm updates and special events on DFA channels.",
          },
        ],
      },
      {
        name: "Women in Film Dallas (WIFD)",
        location: "Dallas",
        description:
          "Nonprofit membership organization empowering and mentoring women in film, TV, and media through events, education, and grants.",
        links: [
          { kind: "website", href: "https://wifdallas.org", label: "Website" },
          {
            kind: "facebook",
            href: "https://www.facebook.com/wifdallas",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/wifdallas",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Texas Media Production Alliance (TXMPA)",
        location: "Texas (Statewide)",
        description:
          "Statewide nonprofit advocacy group working to grow the Texas film, TV, commercial, and digital media industries through policy and community.",
        links: [
          { kind: "website", href: "https://txmpa.org", label: "Website" },
          {
            kind: "instagram",
            href: "https://www.instagram.com/_txmpa",
            label: "Instagram",
          },
          { kind: "x", href: "https://x.com/TXMPA", label: "X" },
        ],
      },
      {
        name: "Texas Association of Motion Media Professionals (TAMMP)",
        location: "Texas (Statewide)",
        description:
          "Trade organization promoting Texas crew and vendor talent and connecting below-the-line professionals with productions.",
        links: [
          {
            kind: "facebook",
            href: "https://www.facebook.com/TxAMMP",
            label: "Facebook",
          },
        ],
      },
      {
        name: "Fort Worth Filmmakers (FWF)",
        location: "Fort Worth",
        description:
          "A nonprofit filmmaker community based in Fort Worth focused on connecting local crew and talent, supporting independent projects, and strengthening North Texas’s film ecosystem through collaboration and visibility.",
        links: [
          {
            kind: "website",
            href: "https://fwfilmmakers.org/",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/fortworthfilmmakers",
            label: "Instagram",
          },
          {
            kind: "discord",
            href: "https://discord.gg/aJrsuTHg5Z",
            label: "Discord",
          },
        ],

        // Home “Next” card uses this org. Only set ONE org to true.
        isHomeFeatured: true,

        meetups: [
          {
            title: "FWF Meetup",
            isTBA: true,
            recurrence: { kind: "weekly", dayOfWeek: 0, hour24: 19, minute: 0 },
            notes:
              "Meetup details are TBA. Check Instagram and Discord for updates.",
          },
        ],
      },
      {
        name: "Ladies in Film & Television (Dallas)",
        location: "Arlington",
        description:
          "A nonprofit organization championing the advancement, visibility, and professional development of women in the film and television industries through networking events, workshops, and community support.",
        links: [
          {
            kind: "website",
            href: "https://ladiesinfilm.org/",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/LadiesInFilmAndTelevision",
            label: "Facebook",
          },
        ],
      },
      {
        name: "A Bunch of Short Guys (ABOSG)",
        location: "Coppell",
        description:
          "An independent film collective and exhibition group focused on short films, community screenings, and filmmaker support in North Texas.",
        links: [
          {
            kind: "website",
            href: "https://abunchofshortguys.com",
            label: "Website",
          },
        ],
      },
      {
        name: "AICP Southwest",
        location: "Dallas",
        description:
          "Regional chapter of the Association of Independent Commercial Producers supporting the commercial production industry through education and networking.",
        links: [
          { kind: "website", href: "https://www.aicp.com/", label: "Website" },
        ],
      },
      {
        name: "American Advertising Federation Dallas (AAF Dallas)",
        location: "Dallas",
        description:
          "Professional association serving the advertising and marketing community through education, networking, and industry advocacy.",
        links: [
          {
            kind: "website",
            href: "https://www.aafdallas.org",
            label: "Website",
          },
        ],
      },
      {
        name: "Arlington Film Society",
        location: "Arlington",
        description:
          "Community organization dedicated to supporting film culture in Arlington through screenings, education, and filmmaker engagement.",
        links: [
          {
            kind: "website",
            href: "https://www.arlingtonfilmsociety.org",
            label: "Website",
          },
        ],
      },
      {
        name: "Dallas Society of Visual Communications (DSVC)",
        location: "Dallas",
        description:
          "Professional association for visual communicators supporting film, video, design, and creative professionals through events and education.",
        links: [
          { kind: "website", href: "https://dsvc.org", label: "Website" },
        ],
      },
      {
        name: "Video Association of Dallas",
        location: "Dallas",
        description:
          "Professional association connecting video production professionals through networking, education, and industry events.",
        links: [
          { kind: "website", href: "https://videofest.org/", label: "Website" },
          {
            kind: "facebook",
            href: "https://www.facebook.com/VADallas/",
            label: "Facebook",
          },
        ],
      },
      {
        name: "Visual Effects Society (VES) – Texas Section",
        location: "Dallas",
        description:
          "Texas section of the global professional society representing visual effects artists and supporting VFX education and community.",
        links: [
          {
            kind: "website",
            href: "https://vesglobal.org/sections/texas",
            label: "Website",
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // CONTESTS AND COMPETITIONS (ADD ORGS HERE)
  // ==========================================================================
  {
    id: "contests",
    title: "Contests and Competitions",
    subtitle:
      "Timeboxed challenges and competitions that regularly activate the DFW indie scene.",
    items: [
      {
        name: "Texas Horror Cult",
        location: "Dallas",
        description:
          "Themed horror filmmaking challenges and festival screenings that build community through recurring short-film contests.",
        links: [
          {
            kind: "website",
            href: "https://texashorrorcult.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/texashorrorcult",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/texashorrorcult",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Rack Focus",
        location: "Dallas–Fort Worth",
        description:
          "Three-month indie short-film race culminating in a public screening where completed shorts premiere and awards are presented.",
        links: [
          {
            kind: "website",
            href: "https://rackfocusdallas.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/RackFocusDallas",
            label: "Facebook",
          },
        ],
      },
      {
        name: "48 Hour Film Project – Dallas",
        location: "Dallas",
        description:
          "International competition where teams write, shoot, and edit a short film in 48 hours before a city screening and awards.",
        links: [
          {
            kind: "website",
            href: "https://www.48hourfilm.com/dallas",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/48HourFilmProject",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/48hourfilmproject",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Video Fest",
        location: "Dallas",
        description:
          "Dedicated to showcasing independent and experimental film and media through screenings, competitions, and community programming.",
        links: [
          { kind: "website", href: "https://videofest.org/", label: "Website" },
          {
            kind: "facebook",
            href: "https://www.facebook.com/videofest",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/videofest",
            label: "Instagram",
          },
          { kind: "x", href: "https://x.com/videofest", label: "X" },
        ],
      },
    ],
  },

  // ==========================================================================
  // FILM FESTIVALS (ADD FESTIVALS HERE)
  // ==========================================================================
  {
    id: "festivals",
    title: "Film Festivals",
    subtitle:
      "DFW festivals that screen work, build audiences, and connect filmmakers with the local scene.",
    items: [
      {
        name: "Dallas International Film Festival (DIFF)",
        location: "Dallas",
        description:
          "Flagship annual festival presented by Dallas Film, showcasing international and local films with talks, awards, and premieres.",
        links: [
          {
            kind: "website",
            href: "https://dallasfilm.org/diff",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/wearediffdallas/",
            label: "Instagram",
          },
        ],
        meetups: [
          {
            title: "DIFF Monthly Mixer",
            recurrence: {
              kind: "monthlyNthDow",
              nth: 2, // every second
              dayOfWeek: 3, // Wednesday (0=Sun..6=Sat)
              hour24: 17, // 5:30 PM
              minute: 30,
            },
            durationMinutes: 120, // 5:30–7:30 PM
            locationName: "Commons Club inside Virgin Hotels Dallas",
            locationCity: "Dallas, TX",
            address: "1445 Turtle Creek Blvd, Dallas, TX 75207",
            mapsQuery:
              "Commons Club inside Virgin Hotels Dallas 1445 Turtle Creek Blvd Dallas TX 75207",
            rsvpUrl:
              "https://www.eventbrite.com/e/diff-december-mixer-at-virgin-hotels-dallas-tickets-1972823670706?aff=oddtdtcreator",
            rsvpLabel: "RSVP on Eventbrite",
            notes:
              "Parking: Enjoy complimentary valet parking with purchase of food & beverage. Valet parking is available for $10. If you wish to self-park, there is a paid lot to the right of the hotel. Fees vary based on week day and parking duration.\n\n" +
              "Food & Beverage: Happy hour specials will be available for purchase, including cocktails that steal the spotlight, lite bites to pair, and more!\n\n" +
              "Giveaways: Registered guests are entered for giveaways!\n\n" +
              "There is no charge to attend.",
          },
        ],
      },
      {
        name: "Oak Cliff Film Festival (OCFF)",
        location: "Dallas",
        description:
          "Prestigious annual festival centered around Texas Theatre, known for a curated lineup of indie narratives, docs, and repertory screenings.",
        links: [
          {
            kind: "website",
            href: "https://oakclifffilmfestival.com",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/filmoakcliff",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Denton Black Film Festival (DBFF)",
        location: "Denton",
        description:
          "Annual multi-day festival celebrating Black storytellers through film screenings alongside music, art, and community events.",
        links: [
          { kind: "website", href: "https://dentonbff.com", label: "Website" },
          {
            kind: "facebook",
            href: "https://www.facebook.com/dentonbff",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/dentonbff",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Thin Line Fest",
        location: "Denton",
        description:
          "Documentary-focused festival that blends nonfiction film with photography and music programming, emphasizing truth in visual media.",
        links: [
          { kind: "website", href: "https://thinline.us", label: "Website" },
          {
            kind: "facebook",
            href: "https://www.facebook.com/thinlinefest",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/thinlinefest",
            label: "Instagram",
          },
        ],
      },
      {
        name: "USA Film Festival",
        location: "Dallas",
        description:
          "Long-running festival founded in 1970 focused on American film, featuring Q&As, tributes, and new features, shorts, and docs.",
        links: [
          {
            kind: "website",
            href: "https://usafilmfestival.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/usafilmfestival",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/usafilmfestival",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Asian Film Festival of Dallas (AFFD)",
        location: "Dallas",
        description:
          "North Texas showcase of Asian and Asian-American cinema featuring filmmaker appearances and cultural programming.",
        links: [
          {
            kind: "website",
            href: "https://asianfilmdallas.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/AsianFilmFestivalDallas",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/asianfilmdallas",
            label: "Instagram",
          },
          { kind: "x", href: "https://x.com/AFFD", label: "X" },
        ],
      },
      {
        name: "Lone Star Film Festival",
        location: "Fort Worth",
        description:
          "Prominent Fort Worth festival hosted by Lone Star Film Society each November with screenings, workshops, and gala events.",
        links: [
          {
            kind: "website",
            href: "https://www.lonestarfilmfestival.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/lonestarfilmfestival",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/lonestarfilmfest",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Panther City Film Festival",
        location: "Fort Worth",
        description:
          "Indie-focused festival and script competition built to spotlight filmmakers and foster collaboration in a filmmaker-friendly environment.",
        links: [
          {
            kind: "website",
            href: "https://panthercityff.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/FWIFS",
            label: "Facebook",
          },
        ],
      },
      {
        name: "African Film Festival (TAFF)",
        location: "Dallas",
        description:
          "Annual festival celebrating African cinema and storytelling, highlighting filmmakers from Africa and the African diaspora.",
        links: [
          {
            kind: "website",
            href: "https://theafricanfilmfestival.org",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/theafricanfilmfestival",
            label: "Instagram",
          },
        ],
      },
      {
        name: "EarthxFilm",
        location: "Dallas",
        description:
          "Environmental film festival presented as part of EarthX, spotlighting films focused on conservation, climate, and sustainability.",
        links: [
          { kind: "website", href: "https://earthx.org/", label: "Website" },
          {
            kind: "instagram",
            href: "https://www.instagram.com/earthxfilm",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Jewish Film Festival of Dallas",
        location: "Dallas",
        description:
          "Annual festival presenting films that explore Jewish culture, history, and identity from around the world.",
        links: [
          {
            kind: "website",
            href: "https://www.jccdallas.org/film-festival",
            label: "Website",
          },
        ],
      },
      {
        name: "Pegasus Film Festival",
        location: "Dallas",
        description:
          "Student-focused film festival hosted by Dallas College, showcasing emerging filmmakers and student-produced work.",
        links: [
          {
            kind: "website",
            href: "https://www.pegasusfilmfestival.com",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/pegasusfilmfestival",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Topaz Film Festival",
        location: "Dallas",
        description:
          "Independent film festival dedicated to showcasing bold voices and underrepresented perspectives in cinema.",
        links: [
          {
            kind: "website",
            href: "https://www.wifdallas.org/TopazFilmFestival",
            label: "Website",
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // CONFERENCES (ADD CONFERENCES HERE)
  // ==========================================================================
  {
    id: "conferences",
    title: "Conferences",
    subtitle:
      "Industry conferences and large-scale events that bring creators, technologists, and media professionals together.",
    items: [
      {
        name: "Industry Giants",
        location: "Dallas",
        description:
          "A large-scale creator and influencer conference featuring panels, workshops, and networking across digital media, film, and online platforms.",
        links: [
          {
            kind: "website",
            href: "https://industrygiants.org/",
            label: "Website",
          },
        ],
      },
      {
        name: "Texas Production Expo",
        location: "Grapevine",
        description:
          "Annual film and video production trade show featuring equipment vendors, workshops, seminars, and networking for North Texas production professionals.",
        links: [
          {
            kind: "website",
            href: "https://www.texasproductionexpo.com",
            label: "Website",
          },
        ],
      },
      {
        name: "CinéShow",
        location: "Allen",
        description:
          "Cinema industry conference bringing together studios, exhibitors, vendors, and professionals for presentations, panels, and business-focused sessions.",
        links: [
          { kind: "website", href: "https://cineshow.org", label: "Website" },
        ],
      },
      {
        name: "Circles Conference",
        location: "Grapevine",
        description:
          "Creative conference with dedicated film and storytelling tracks, offering workshops and talks focused on filmmaking, narrative craft, and production skills.",
        links: [
          {
            kind: "website",
            href: "https://circlesconference.com",
            label: "Website",
          },
        ],
      },
      {
        name: "Texas Mixer Mixer",
        location: "Dallas",
        description:
          "This annual event brings aimed at location and post production audio brings together the industries top gear manufacturers and talent. Chalk full of seminas, gear expo, food, and beverages it's always an excellent opportunity to learn, network, and check out all the latest gear.",
        links: [
          {
            kind: "website",
            href: "https://www.texasmixermixer.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/people/Texas-Mixer-Mixer/61582856901442/",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/texasmixermixer/",
            label: "Instagram",
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // STUDIOS AND SOUNDSTAGES (ADD STUDIOS HERE)
  // ==========================================================================
  {
    id: "studios",
    title: "Studios and Soundstages",
    subtitle:
      "From self-serve rental listings to major studio campuses shaping the region’s production capacity.",
    items: [
      {
        name: "South Side Studios",
        location: "Dallas",
        description:
          "Large production facility offering multiple soundstages, production offices, and support spaces for commercial and narrative shoots.",
        links: [
          {
            kind: "website",
            href: "https://southsidestudiosdallas.com",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/dallassoundstages",
            label: "Instagram",
          },
        ],
      },
      {
        name: "XR Studios 214",
        location: "Dallas",
        description:
          "Virtual production facility providing an LED volume stage and XR capabilities for real-time environments and mixed-reality shoots.",
        links: [
          {
            kind: "website",
            href: "https://www.xr214studios.com/",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/xr214studios",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/xr214studios",
            label: "Instagram",
          },
        ],
      },
      {
        name: "SGS Studios at AllianceTexas (Hillwood)",
        location: "Fort Worth",
        description:
          "Major studio campus in the Alliance area associated with Taylor Sheridan’s SGS and industry partners, built for large-scale productions.",
        links: [
          {
            kind: "website",
            href: "https://www.sgs-studios.com/",
            label: "Website",
          },
        ],
      },
      {
        name: "101 Studios",
        location: "North Texas presence",
        description:
          "Production company behind major series and a key player in expanding large-scale production activity and infrastructure in North Texas.",
        links: [
          {
            kind: "website",
            href: "https://101studiosco.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/101StudiosCo",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/101studiosco/",
            label: "Instagram",
          },
          {
            kind: "linkedin",
            href: "https://www.linkedin.com/company/101-sudios",
            label: "LinkedIn",
          },
        ],
      },
      {
        name: "Red Productions",
        location: "Fort Worth",
        description:
          "A full-service production company and studio serving film, television, commercial, and branded content, with facilities and crews supporting projects from indie productions to national campaigns.",
        links: [
          {
            kind: "website",
            href: "https://www.redproductions.com",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/redproductions",
            label: "Instagram",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/redprod",
            label: "Facebook",
          },
          {
            kind: "linkedin",
            href: "https://www.linkedin.com/company/red-productions",
            label: "LinkedIn",
          },
        ],
      },
      {
        name: "Capernaum Studios",
        location: "Poolville",
        description:
          "A purpose-built film studio and backlot featuring permanent exterior sets and production facilities, best known for hosting large-scale narrative projects and long-form series filmed in North Texas.",
        links: [
          {
            kind: "website",
            href: "https://capernaumstudios.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/CapernaumStudios",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/capernaumstudios",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Air Studios",
        location: "Dallas",
        description:
          "A Dallas-based studio facility offering production space and services for film, video, and commercial projects.",
        links: [
          {
            kind: "website",
            href: "https://airstudiosdallas.com",
            label: "Website",
          },
        ],
      },
      {
        name: "AMS Pictures",
        location: "Dallas",
        description:
          "A full-service production company and studio providing soundstages, production services, and post-production for commercial and film projects.",
        links: [
          {
            kind: "website",
            href: "https://www.amspictures.com",
            label: "Website",
          },
        ],
      },
      {
        name: "Backlot Studio and Workspace",
        location: "Fort Worth",
        description:
          "A flexible studio and creative workspace in Fort Worth offering soundstage-style environments for film, video, and photography.",
        links: [
          { kind: "website", href: "https://backlotfw.com", label: "Website" },
          {
            kind: "instagram",
            href: "https://www.instagram.com/backlotfw",
            label: "Instagram",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/backlotfw",
            label: "Facebook",
          },
        ],
      },
      {
        name: "CRM Studios",
        location: "Irving",
        description:
          "A studio facility in Irving providing production space and support services for video, film, and commercial shoots.",
        links: [
          { kind: "website", href: "https://crmstudios.com", label: "Website" },
          {
            kind: "facebook",
            href: "https://www.facebook.com/crmstudios",
            label: "Facebook",
          },
        ],
      },
      {
        name: "DHD Films",
        location: "Dallas",
        description:
          "A Dallas-based production studio offering creative services and studio space for commercial and narrative projects.",
        links: [
          { kind: "website", href: "https://dhdfilms.com", label: "Website" },
          {
            kind: "instagram",
            href: "https://www.instagram.com/dhdfilms",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Eyecon Video Productions",
        location: "Plano",
        description:
          "A Plano-based video production company providing studio facilities and end-to-end production services.",
        links: [
          {
            kind: "website",
            href: "https://eyeconvideo.com/",
            label: "Website",
          },
        ],
      },
      {
        name: "Frisco Studios",
        location: "Frisco",
        description:
          "A Frisco-area studio offering production space and services for film, video, and branded content.",
        links: [
          {
            kind: "website",
            href: "https://friscostudios.us/",
            label: "Website",
          },
        ],
      },
      {
        name: "Gracepoint Media",
        location: "Dallas",
        description:
          "A Dallas-based media studio providing production facilities and creative services for video and film projects.",
        links: [
          {
            kind: "website",
            href: "https://gracepoint.media",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/gracepointmedia",
            label: "Instagram",
          },
        ],
      },
      {
        name: "IdeaMan Studios",
        location: "Dallas",
        description:
          "A creative studio in Dallas offering production space and services for commercial and narrative media.",
        links: [
          {
            kind: "website",
            href: "https://ideamanstudios.com",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/ideamanstudios",
            label: "Instagram",
          },
        ],
      },
      {
        name: "MPS Studios Dallas",
        location: "Dallas",
        description:
          "A long-standing Dallas studio complex offering soundstages, production offices, and full equipment support.",
        links: [
          { kind: "website", href: "https://mpsfilm.com", label: "Website" },
          {
            kind: "instagram",
            href: "https://www.instagram.com/mpsfilm",
            label: "Instagram",
          },
        ],
      },
      {
        name: "VFX Studios",
        location: "Irving",
        description:
          "A studio facility in Irving supporting visual effects, post-production, and media production workflows.",
        links: [
          { kind: "website", href: "https://vfxstudios.com", label: "Website" },
          {
            kind: "instagram",
            href: "https://www.instagram.com/vfxstudiosga/",
            label: "Instagram",
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // CASTING AND AGENCIES (ADD CASTING/AGENCIES HERE)
  // ==========================================================================
  {
    id: "casting-agencies",
    title: "Casting and Agencies",
    subtitle:
      "Casting offices and talent agencies connecting local actors and creatives with productions.",
    items: [
      {
        name: "Cast-O-Matic",
        location: "Dallas",
        description:
          "Casting company and platform helping productions find on-camera talent and extras through an online database and casting calls.",
        links: [
          {
            kind: "website",
            href: "https://cast-o-matic.com",
            label: "Website",
          },
        ],
      },
      {
        name: "Katz Kasting",
        location: "Dallas–Fort Worth",
        description:
          "Casting office known for background and principal casting across commercials, TV, film, and events, often posting local calls.",
        links: [
          {
            kind: "website",
            href: "https://katzkasting.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/KatzKasting",
            label: "Facebook",
          },
        ],
      },
      {
        name: "Buffalo Casting",
        location: "Dallas",
        description:
          "Casting office recognized for work across national commercials, films, and print campaigns, with a curated Texas talent pool.",
        links: [
          {
            kind: "website",
            href: "https://buffalocasting.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/buffalocasting",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/buffalocasting",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Legacy Casting",
        location: "National",
        description:
          "Casting agency specializing in background casting for major productions, connecting North Texas locals with on-set opportunities.",
        links: [
          {
            kind: "website",
            href: "https://legacycasting.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/LegacyCasting",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/legacycasting_global",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Kim Dawson Agency",
        location: "Dallas",
        description:
          "Longstanding Texas talent agency representing actors, models, and creatives for film/TV, commercials, voiceover, and print.",
        links: [
          {
            kind: "website",
            href: "https://kimdawsonagency.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/KimDawsonAgency",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/kimdawsonagency",
            label: "Instagram",
          },
        ],
      },
      {
        name: "The Campbell Agency",
        location: "Dallas",
        description:
          "Boutique full-service agency representing models and talent, with a strong regional presence across fashion and on-camera work.",
        links: [
          {
            kind: "website",
            href: "https://thecampbellagency.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/thecampbellagency",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/campbellagencytalent",
            label: "Instagram (Talent)",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/campbellmodels",
            label: "Instagram (Models)",
          },
        ],
      },
      {
        name: "Mary Collins Agency",
        location: "Dallas",
        description:
          "Prestigious agency with strengths in voiceover and on-camera talent for commercials, corporate work, animation, and gaming.",
        links: [
          {
            kind: "website",
            href: "https://marycollins.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/MaryCollinsAgency",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/marycollinsagency",
            label: "Instagram",
          },
          {
            kind: "linkedin",
            href: "https://www.linkedin.com/company/mary-collins-agency",
            label: "LinkedIn",
          },
        ],
      },
      {
        name: "Grogan Management (Damaris Grogan)",
        location: "Dallas–Fort Worth",
        description:
          "A boutique talent management company led by Damaris Grogan, representing actors and creatives for film, television, and commercial work with a focus on career development and strategic placement.",
        links: [
          {
            kind: "website",
            href: "https://www.groganmanagement.com",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/groganmanagement",
            label: "Instagram",
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // UNIONS AND GUILDS (ADD UNIONS HERE)
  // ==========================================================================
  {
    id: "unions",
    title: "Unions and Guilds",
    subtitle:
      "Labor organizations supporting performers and crew across film, TV, and media work.",
    items: [
      {
        name: "SAG-AFTRA",
        location: "National",
        description:
          "Union representing actors and media performers, supporting members with contracts, education, and local industry resources.",
        links: [
          {
            kind: "website",
            href: "https://www.sagaftra.org/",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/sagaftra",
            label: "Instagram",
          },
          {
            kind: "youtube",
            href: "https://www.youtube.com/@sagaftra",
            label: "YouTube",
          },
        ],
      },
      {
        name: "IATSE Local 484",
        location: "Texas",
        description:
          "Crew technicians union representing below-the-line roles and providing training and support for film and TV productions.",
        links: [
          {
            kind: "website",
            href: "https://www.iatse484.org/",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/iatselocal484",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Teamsters Local 745",
        location: "Dallas–Fort Worth",
        description:
          "Teamsters local covering transportation roles and support personnel crucial for moving gear, vehicles, and crew safely on productions.",
        links: [
          {
            kind: "website",
            href: "https://www.teamsters745.org/",
            label: "Website",
          },
        ],
      },
      {
        name: "Directors Guild of America (DGA)",
        location: "National",
        description:
          "Guild representing directors, assistant directors, and UPMs; productions working under DGA agreements coordinate through the guild.",
        links: [
          { kind: "website", href: "https://www.dga.org", label: "Website" },
          {
            kind: "facebook",
            href: "https://www.facebook.com/directorsguildofamericadga",
            label: "Facebook",
          },
        ],
      },
      {
        name: "Writers Guild of America West (WGAW)",
        location: "National",
        description:
          "Guild representing professional screenwriters; Texas projects engaging WGA writers typically coordinate through WGA West.",
        links: [
          { kind: "website", href: "https://www.wga.org", label: "Website" },
        ],
      },
    ],
  },

  // ==========================================================================
  // POST-PRODUCTION (ADD POST HOUSES HERE)
  // ==========================================================================
  {
    id: "post",
    title: "Post-Production",
    subtitle:
      "Editorial, color, VFX, and sound facilities that finish work at a professional level in DFW.",
    items: [
      {
        name: "charlieuniformtango",
        location: "Dallas",
        description:
          "High-end post-production and production studio providing editorial, color, VFX, motion design, and sound for premium campaigns.",
        links: [
          {
            kind: "website",
            href: "https://charlieuniformtango.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/charlieuniformtango",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/charlieuniformtango",
            label: "Instagram",
          },
          {
            kind: "linkedin",
            href: "https://www.linkedin.com/company/charlieuniformtango",
            label: "LinkedIn",
          },
        ],
      },
      {
        name: "Reel FX",
        location: "Dallas",
        description:
          "Major animation and VFX studio creating feature animation and visual effects for studios, streamers, and brands.",
        links: [
          { kind: "website", href: "https://www.reelfx.com", label: "Website" },
          {
            kind: "facebook",
            href: "https://www.facebook.com/wearereelfx",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/wearereelfx",
            label: "Instagram",
          },
          {
            kind: "youtube",
            href: "https://www.youtube.com/@ReelFXAnimation",
            label: "YouTube",
          },
        ],
      },
      {
        name: "Dallas Audio Post",
        location: "Dallas",
        description:
          "Audio post facility offering ADR, sound design, mixing, and voiceover services for film, TV, commercials, and games.",
        links: [
          {
            kind: "website",
            href: "https://dallasaudiopost.com",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/dallasaudiopost",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Camp Lucky",
        location: "Dallas",
        description:
          "Full-service post and production studio offering editorial, color, VFX, sound, and virtual production capabilities.",
        links: [
          { kind: "website", href: "https://camp-lucky.com", label: "Website" },
          {
            kind: "facebook",
            href: "https://www.facebook.com/campluckystudio",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/camp__lucky",
            label: "Instagram",
          },
          {
            kind: "linkedin",
            href: "https://www.linkedin.com/company/camp-lucky",
            label: "LinkedIn",
          },
        ],
      },
      {
        name: "Republic (The Republic)",
        location: "Dallas",
        description:
          "Post-production collective providing editorial, design/motion graphics, finishing, and production support for brand and agency work.",
        links: [
          { kind: "website", href: "https://therepublic.co", label: "Website" },
          {
            kind: "facebook",
            href: "https://www.facebook.com/therepublicco",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/the.republic.co",
            label: "Instagram",
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // SELF-SERVE RESOURCES (ADD PLATFORMS HERE)
  // ==========================================================================
  {
    id: "self-serve",
    title: "Self-Serve Resources",
    subtitle:
      "Directories, platforms, and tools that help you crew up, learn, and find gear or vendors quickly.",
    items: [
      {
        name: "Peerspace",
        location: "National",
        description:
          "Marketplace for renting filming locations and studios by the hour, from small cyc spaces to warehouses, homes, and unique sets.",
        links: [
          {
            kind: "website",
            href: "https://www.peerspace.com/",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/peerspace",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/peerspace",
            label: "Instagram",
          },
          {
            kind: "linkedin",
            href: "https://www.linkedin.com/company/peerspace",
            label: "LinkedIn",
          },
          {
            kind: "youtube",
            href: "https://www.youtube.com/@Peerspace",
            label: "YouTube",
          },
        ],
      },
      {
        name: "ShareGrid (Dallas)",
        location: "Dallas",
        description:
          "Peer-to-peer marketplace for renting cameras, lenses, and gear from local owners with insurance and reviews built in.",
        links: [
          {
            kind: "website",
            href: "https://www.sharegrid.com/dallas",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/sharegrid",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/sharegrid",
            label: "Instagram",
          },
          {
            kind: "youtube",
            href: "https://www.youtube.com/@ShareGrid",
            label: "YouTube",
          },
        ],
      },
      {
        name: "ProductionHUB",
        location: "Global",
        description:
          "Crew and vendor directory that makes it easy to search DFW for freelancers, production companies, and services by role.",
        links: [
          {
            kind: "website",
            href: "https://www.productionhub.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/prohub",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/productionhub",
            label: "Instagram",
          },
          {
            kind: "linkedin",
            href: "https://www.linkedin.com/company/productionhub",
            label: "LinkedIn",
          },
        ],
      },
      {
        name: "Stage 32",
        location: "Global",
        description:
          "Networking and education platform for film and TV creatives offering webinars, courses, and community collaboration.",
        links: [
          {
            kind: "website",
            href: "https://www.stage32.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/stage32",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/stage32",
            label: "Instagram",
          },
          { kind: "x", href: "https://x.com/Stage32", label: "X" },
          {
            kind: "linkedin",
            href: "https://www.linkedin.com/company/stage-32",
            label: "LinkedIn",
          },
        ],
      },
      {
        name: "Texas Production Directory (Texas Film Commission)",
        location: "Texas (Statewide)",
        description:
          "Official searchable directory of Texas crew and support services to help productions crew up and locate vendors statewide.",
        links: [
          {
            kind: "website",
            href: "https://gov.texas.gov/film/production-directory",
            label: "Website",
          },
        ],
      },
      {
        name: "Staff Me Up",
        location: "Global",
        description:
          "Job board for freelance gigs across TV, film, reality, and digital media, with searchable postings by city and role.",
        links: [
          { kind: "website", href: "https://staffmeup.com", label: "Website" },
          {
            kind: "facebook",
            href: "https://www.facebook.com/staffmeup",
            label: "Facebook",
          },
          {
            kind: "linkedin",
            href: "https://www.linkedin.com/company/staff-me-up",
            label: "LinkedIn",
          },
        ],
      },
      {
        name: "Backstage",
        location: "National",
        description:
          "A leading casting and career platform for actors and filmmakers, offering casting calls, industry news, training resources, and talent profiles for film, TV, theater, and digital media.",
        links: [
          {
            kind: "website",
            href: "https://www.backstage.com",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/backstagecast",
            label: "Instagram",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/Backstage",
            label: "Facebook",
          },
        ],
      },
      {
        name: "MyCastingFile (MCF)",
        location: "National",
        description:
          "A casting submission platform used by casting directors to review talent profiles, reels, and headshots for commercials, film, and television projects.",
        links: [
          {
            kind: "website",
            href: "https://mycastingfile.com/",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/mycastingfile",
            label: "Instagram",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/mycastingfile",
            label: "Facebook",
          },
        ],
      },
      {
        name: "Casting Networks",
        location: "National",
        description:
          "One of the largest online casting platforms connecting actors with casting directors for film, television, commercials, and digital media through verified casting notices and submissions.",
        links: [
          {
            kind: "website",
            href: "https://www.castingnetworks.com",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/castingnetworks",
            label: "Instagram",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/CastingNetworks",
            label: "Facebook",
          },
        ],
      },
      {
        name: "Onset",
        location: "Dallas-Fort Worth",
        description:
          "A professional casting and production management platform designed to streamline casting breakdowns, submissions, scheduling, and communication between casting directors, producers, and talent.",
        links: [
          {
            kind: "website",
            href: "https://www.onsetwork.com",
            label: "Website",
          },
          {
            kind: "linkedin",
            href: "https://www.linkedin.com/company/onsetwork",
            label: "LinkedIn",
          },
        ],
      },
      {
        name: "ActorBay",
        location: "National",
        description:
          "An online casting and talent platform providing actors with casting calls, profile hosting, and submission tools for film, television, commercial, and digital productions.",
        links: [
          {
            kind: "website",
            href: "https://www.actorbay.io",
            label: "Website",
          },
        ],
      },
      {
        name: "Production Contacts",
        location: "National",
        description:
          "Simple, straight forward staff and crew directory for the TV, film, commercial and theater industries.",
        links: [
          {
            kind: "website",
            href: "https://productioncontacts.com/",
            label: "Website",
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // FORMAL TRAINING (ADD SCHOOLS/PROGRAMS HERE)
  // ==========================================================================
  {
    id: "formal-training",
    title: "Formal Training",
    subtitle:
      "Schools, programs, and acting studios that build real skills for camera, crew, and performance.",
    items: [
      {
        name: "TCC Fort Worth Film Collaborative",
        location: "Fort Worth",
        description:
          "A workforce training initiative led by Tarrant County College in partnership with the Fort Worth Film Commission, designed to prepare local crew for on-set roles through hands-on certification programs aligned with current industry needs.",
        links: [
          {
            kind: "website",
            href: "https://www.fortworth.com/film/tcc-workforce-development/",
            label: "Website",
          },
        ],
      },
      {
        name: "KD Conservatory College of Film & Dramatic Arts",
        location: "Dallas",
        description:
          "Accredited programs in acting and motion picture production focused on hands-on training and portfolio-building work.",
        links: [
          { kind: "website", href: "https://kdstudio.com", label: "Website" },
          {
            kind: "instagram",
            href: "https://www.instagram.com/kdconservatory",
            label: "Instagram",
          },
        ],
      },
      {
        name: "MediaTech Institute (Dallas)",
        location: "Dallas",
        description:
          "Career-focused school offering training in digital film and video arts alongside audio programs for production and post skills.",
        links: [
          {
            kind: "website",
            href: "https://mediatech.edu/dallas",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/mediatechinstitute",
            label: "Facebook",
          },
        ],
      },
      {
        name: "Dallas Young Actors Studio (DYAS)",
        location: "Dallas",
        description:
          "On-camera acting training and workshops for kids and teens, with programs designed to build audition-ready skills for film and TV.",
        links: [
          { kind: "website", href: "https://dallasyas.com", label: "Website" },
          {
            kind: "instagram",
            href: "https://www.instagram.com/dallasyas",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Nancy Chartier Studios",
        location: "Dallas",
        description:
          "On-camera acting studio focused on auditions, cold reads, and scene study for actors aiming to work in film and television.",
        links: [
          {
            kind: "website",
            href: "https://nancychartierstudios.com",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/nancychartierstudios",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Cathryn Sullivan’s Acting for Film",
        location: "Lewisville",
        description:
          "Well-known on-camera acting program offering multi-level training for youth and teens focused on professional film and TV work.",
        links: [
          {
            kind: "website",
            href: "https://cathrynsullivan.com",
            label: "Website",
          },
        ],
      },
      {
        name: "Sherrill Actors Studio",
        location: "Dallas",
        description:
          "Meisner-based acting training for film and TV emphasizing truthful performance and strong on-camera fundamentals.",
        links: [
          {
            kind: "website",
            href: "https://sherrillactorsstudio.com",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/sherrillactorsstudio",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Fort Worth Actors Studio",
        location: "Fort Worth",
        description:
          "Fort Worth Actors Studio offers on-camera acting classes for teens and adults with recurring Monday and Tuesday night sessions (Acting for the Camera, 6:45-9:15 PM), focusing on cold reading, audition skills, scene study, and improv to help students grow as confident performers in film and TV.",
        links: [
          { kind: "website", href: "https://fwactors.com", label: "Website" },
        ],
        meetups: [
          {
            title: "FW Actors Studio Class",
            recurrence: {
              kind: "weekly",
              dayOfWeek: 1, // Monday
              hour24: 18,
              minute: 45,
            },
            durationMinutes: 150, // ✅ 6:45 PM → 9:15 PM
            locationName: "Fort Worth Actors Studio",
            locationCity: "Fort Worth, TX",
            address: "2212 W Peter Smith St, Fort Worth, TX 76102",
            mapsQuery: "2212 W Peter Smith St, Fort Worth, TX 76102",
            notes:
              "Acting for the Camera classes every Monday and Tuesday night, typically 6:45-9:15 PM; verify current schedule before attending.",
          },
          {
            title: "FW Actors Studio Class",
            recurrence: {
              kind: "weekly",
              dayOfWeek: 2, // Tuesday
              hour24: 18,
              minute: 45,
            },
            durationMinutes: 150, // ✅ 6:45 PM → 9:15 PM
            locationName: "Fort Worth Actors Studio",
            locationCity: "Fort Worth, TX",
            address: "2212 W Peter Smith St, Fort Worth, TX 76102",
            mapsQuery: "2212 W Peter Smith St, Fort Worth, TX 76102",
            notes:
              "Acting for the Camera classes every Monday and Tuesday night, typically 6:45-9:15 PM; verify current schedule before attending.",
          },
        ],
      },
      {
        name: "TBell Actors Studio",
        location: "Dallas",
        description:
          "Film acting technique and scene-study classes with small class sizes geared toward practical on-camera performance.",
        links: [
          {
            kind: "website",
            href: "https://tbellactorsstudio.com",
            label: "Website",
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // EQUIPMENT RENTALS (ADD RENTAL HOUSES HERE)
  // ==========================================================================
  {
    id: "equipment",
    title: "Equipment and Rentals",
    subtitle:
      "Rental houses and vendors supplying camera, lighting, grip, power, and support gear in DFW.",
    items: [
      {
        name: "MPS Film (Rentals)",
        location: "Dallas",
        description:
          "Major Texas rental provider for camera, lighting, grip, and power, with deep inventory and experienced support staff.",
        links: [
          { kind: "website", href: "https://mpsfilm.com", label: "Website" },
          {
            kind: "facebook",
            href: "https://www.facebook.com/MPSStudiosDallas",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/mpsfilm",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Panavision Dallas",
        location: "Irving",
        description:
          "High-end camera and lens rental house serving major productions, known for premium systems and specialized lens packages.",
        links: [
          {
            kind: "website",
            href: "https://www.panavision.com/",
            label: "Website",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/panavisionofficial",
            label: "Instagram",
          },
          {
            kind: "linkedin",
            href: "https://www.linkedin.com/company/panavision",
            label: "LinkedIn",
          },
        ],
      },
      {
        name: "Bolt Productions",
        location: "Dallas",
        description:
          "Local rental house focused on still and motion gear, offering cameras, lighting, grip, and studio support for shoots of all sizes.",
        links: [
          {
            kind: "website",
            href: "https://boltproductions.com",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/BoltProductionsDallas",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/boltprod",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Electric Light & Power Co.",
        location: "Dallas",
        description:
          "Grip and lighting rental company providing lighting packages, power, distro, generators, and support services for productions.",
        links: [
          {
            kind: "website",
            href: "https://electriclight.com",
            label: "Website",
          },
        ],
      },
      {
        name: "MP&E Camera and Lighting (HDgear)",
        location: "Carrollton",
        description:
          "Regional rental provider offering motion picture camera, lenses, lighting, and grip gear with package deals for longer shoots.",
        links: [
          { kind: "website", href: "https://www.hdgear.tv", label: "Website" },
          {
            kind: "instagram",
            href: "https://www.instagram.com/beyondtherental",
            label: "Instagram",
          },
        ],
      },
      {
        name: "Black Bird Carts",
        location: "Dallas",
        description:
          "Equipment carts for sound mixers, DIT, and video assist. Choose from existing designs or contact us for a custom build.",
        links: [
          {
            kind: "website",
            href: "https://www.blackbirdcarts.com/",
            label: "Website",
          },
          {
            kind: "facebook",
            href: "https://www.facebook.com/BlackbirdCarts/",
            label: "Facebook",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/blackbirdcarts",
            label: "Instagram",
          },
          {
            kind: "youtube",
            href: "https://www.youtube.com/channel/UCu-LIlU9TnI1-syHLe0_-lA",
            label: "YouTube",
          },
        ],
      },
      {
        name: "Shine Cine",
        location: "Fort Worth",
        description:
          "Cinema equipment rental house offering high-quality cameras, lenses, lighting, grip gear, and a dedicated camera prep space to support local filmmakers",
        links: [
          {
            kind: "website",
            href: "https://www.shinecine.com/",
            label: "Website",
          },
          {
            kind: "phone",
            href: "tel:+16823646778",
            label: "(682) 364-6778",
          },
          {
            kind: "instagram",
            href: "https://www.instagram.com/shinecinefw/",
            label: "Instagram",
          },
        ],
      },
    ],
  },
];

export const SECTIONS: DirectorySection[] = withIds(SECTIONS_RAW);

// ============================================================================
// Helpers: used by /events and homepage widgets
// ============================================================================

export function flattenDirectoryItems(): DirectoryItem[] {
  return SECTIONS.flatMap((s) => s.items);
}

export function findDirectoryItemById(id: string): DirectoryItem | undefined {
  return flattenDirectoryItems().find((x) => x.id === id);
}

export function findDirectoryItemByName(
  name: string,
): DirectoryItem | undefined {
  return flattenDirectoryItems().find((x) => x.name === name);
}

export function getHomeFeaturedOrg(): DirectoryItem | undefined {
  return flattenDirectoryItems().find((x) => x.isHomeFeatured);
}
