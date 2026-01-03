// src/data/resources.ts

/**
 * FWFA RESOURCES DATA (MANUAL, VERIFIED LINKS ONLY)
 *
 * RULES:
 * - ZERO guessed links: only include verified URLs you provide.
 * - If you do not have the exact URL: omit that link.
 * - Each item must have at least 1 link (usually Website).
 *
 * HOW TO ADD:
 * - Add a NEW SECTION: scroll to "SECTIONS (ADD NEW SECTION HERE)".
 * - Add an ORG to a section: find the section, add a new item in its "items" list.
 */

export type LinkKind =
  | "website"
  | "instagram"
  | "discord"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "x"
  | "linkedin"
  | "email";

export type ResourceLink = {
  kind: LinkKind;
  href: string; // MUST be a verified URL (or mailto:)
  label: string;
};

export type ResourceItem = {
  name: string;
  location?: string;
  description: string; // one sentence
  links: ResourceLink[]; // must have at least 1; no guessed links
  keywords?: string[]; // acronyms, alt names, etc. for search
};

export type ResourceSection = {
  id: string;
  title: string;
  subtitle?: string;
  items: ResourceItem[];
};

// ============================================================================
// SECTIONS (ADD NEW SECTION HERE)
// ============================================================================

export const SECTIONS: ResourceSection[] = [
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
        keywords: ["Dallas Film Commission", "Dallas Creates"],
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
        keywords: ["Film Fort Worth"],
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
        keywords: ["TFC", "Film Friendly Texas", "TMIIIP"],
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
        keywords: ["Arlington Film Friendly", "Film Friendly Arlington"],
      },
      {
        name: "City of Denton – Film Friendly Office",
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
            href: "https://www.instagram.com/cityofdenton",
            label: "Instagram",
          },
        ],
        keywords: ["Film Friendly Denton"],
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
        keywords: ["DIFF", "Dallas International Film Festival"],
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
        keywords: ["DPA"],
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
        keywords: ["DSA"],
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
        keywords: ["DFA"],
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
        keywords: ["WIF Dallas", "WIFD"],
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
        keywords: ["TXMPA"],
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
        keywords: ["TAMMP", "TxAMMP"],
      },
      {
        name: "Fort Worth Filmmakers Alliance (FWFA)",
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
        keywords: ["FWFA", "Fort Worth Filmmakers"],
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
        keywords: ["Ladies in Film", "Women in Film", "WIF Dallas", "LIFT"],
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
        keywords: ["ABOSG", "short films"],
      },
      {
        name: "AICP Southwest",
        location: "Dallas",
        description:
          "Regional chapter of the Association of Independent Commercial Producers supporting the commercial production industry through education and networking.",
        links: [
          { kind: "website", href: "https://www.aicp.com/", label: "Website" },
        ],
        keywords: ["AICP", "commercial production"],
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
        keywords: ["AAF Dallas", "advertising"],
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
        keywords: ["Arlington Film Society"],
      },
      {
        name: "Dallas Society of Visual Communications (DSVC)",
        location: "Dallas",
        description:
          "Professional association for visual communicators supporting film, video, design, and creative professionals through events and education.",
        links: [
          { kind: "website", href: "https://dsvc.org", label: "Website" },
        ],
        keywords: ["DSVC", "visual communications"],
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
        keywords: ["video production", "VAD"],
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
        keywords: ["VES", "visual effects", "VFX"],
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
        keywords: ["Horror Cult"],
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
        keywords: ["RackFocus"],
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
        keywords: ["48HFP", "48 Hour"],
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
        keywords: ["Video Race", "Dallas VideoFest"],
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
            href: "https://www.instagram.com/dallasiff",
            label: "Instagram",
          },
        ],
        keywords: ["DIFF"],
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
        keywords: ["OCFF"],
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
        keywords: ["DBFF"],
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
        keywords: ["Thin Line"],
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
        keywords: ["USAFF"],
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
        keywords: ["AFFD"],
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
        keywords: ["LSFF"],
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
        keywords: ["FWIFS", "Panther City FF"],
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
        keywords: ["TAFF", "African Film Festival"],
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
        keywords: ["EarthxFilm", "EarthX"],
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
        keywords: ["JFFD", "Jewish Film Festival"],
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
        keywords: ["Pegasus Film Festival"],
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
        keywords: ["Topaz Film Festival"],
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
        keywords: ["creator economy", "influencers", "digital media"],
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
        keywords: [
          "production expo",
          "film gear",
          "video production",
          "trade show",
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
        keywords: [
          "cinema conference",
          "film exhibition",
          "industry conference",
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
        keywords: [
          "filmmaking conference",
          "storytelling",
          "creative conference",
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
        keywords: ["soundstages", "Dallas soundstage"],
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
        keywords: ["virtual production", "XR 214"],
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
        keywords: ["SGS", "AllianceTexas", "Hillwood", "Taylor Sheridan"],
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
        keywords: ["101", "Taylor Sheridan"],
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
        keywords: ["Red Productions", "production studio", "Dallas studio"],
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
        keywords: ["Capernaum Studios", "backlot", "North Texas studio"],
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
        keywords: ["Air Studios"],
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
        keywords: ["AMS Pictures"],
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
        keywords: ["Backlot", "BacklotFW"],
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
        keywords: ["CRM Studios"],
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
        keywords: ["DHD Films"],
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
        keywords: ["Eyecon Video"],
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
        keywords: ["Frisco Studios"],
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
        keywords: ["Gracepoint Media"],
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
        keywords: ["IdeaMan Studios"],
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
        keywords: ["MPS Studios"],
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
        keywords: ["VFX Studios"],
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
        keywords: ["casting", "extras"],
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
        keywords: ["Katz"],
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
        keywords: ["Buffalo"],
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
        keywords: ["Legacy"],
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
        keywords: ["Kim Dawson"],
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
        keywords: ["Campbell"],
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
        keywords: ["Mary Collins"],
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
        keywords: ["Grogan Management", "Damaris Grogan"],
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
        keywords: ["SAG", "AFTRA"],
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
        keywords: ["IATSE", "484"],
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
        keywords: ["Teamsters", "745"],
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
        keywords: ["DGA"],
      },
      {
        name: "Writers Guild of America West (WGAW)",
        location: "National",
        description:
          "Guild representing professional screenwriters; Texas projects engaging WGA writers typically coordinate through WGA West.",
        links: [
          { kind: "website", href: "https://www.wga.org", label: "Website" },
        ],
        keywords: ["WGA", "WGAW"],
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
        keywords: ["CUT", "Tango"],
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
        keywords: ["ReelFX"],
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
        keywords: ["DAP", "ADR", "mixing"],
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
        keywords: ["Lucky Post", "The Volume"],
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
        keywords: ["Republic Editorial"],
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
        keywords: ["location rentals", "studios for rent"],
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
        keywords: ["gear sharing"],
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
        keywords: ["crew directory", "vendor directory"],
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
        keywords: ["education", "networking"],
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
        keywords: ["crew search", "support services"],
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
        keywords: ["jobs", "crew gigs"],
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
        keywords: ["Backstage", "casting", "auditions"],
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
        keywords: ["MCF", "MyCastingFile", "casting"],
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
        keywords: ["Casting Networks", "casting"],
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
        keywords: ["Onset", "casting platform"],
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
        keywords: ["ActorBay", "casting"],
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
        keywords: [
          "TCC",
          "Fort Worth Film Collaborative",
          "film training",
          "crew training",
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
        keywords: ["KD Conservatory"],
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
        keywords: ["MediaTech"],
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
        keywords: ["DYAS"],
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
        keywords: ["Nancy Chartier"],
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
        keywords: ["Cathryn Sullivan"],
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
        keywords: ["Sherrill"],
      },
      {
        name: "Fort Worth Actors Studio",
        location: "Fort Worth",
        description:
          "On-camera acting courses in Fort Worth focused on audition prep and scene work for film and TV across teen and adult levels.",
        links: [
          { kind: "website", href: "https://fwactors.com", label: "Website" },
        ],
        keywords: ["FWAS"],
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
        keywords: ["TBell", "Teresa Bell"],
      },
    ],
  },

  // ==========================================================================
  // EQUIPMENT RENTALS (ADD RENTAL HOUSES HERE)
  // ==========================================================================
  {
    id: "equipment",
    title: "Equipment Rentals",
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
        keywords: ["camera rentals", "lighting rentals"],
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
        keywords: ["Panavision"],
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
        keywords: ["Bolt"],
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
        keywords: ["ELP", "grip", "lighting"],
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
        keywords: ["MP&E", "HDgear"],
      },
    ],
  },
];
