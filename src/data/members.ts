// src/data/members.ts
export type LinkKind =
  | "website"
  | "instagram"
  | "discord"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "x"
  | "linkedin"
  | "imdb"
  | "email"
  | "backstage";

export type MemberLink = {
  kind: LinkKind;
  href: string; // verified URL (or mailto:)
  label?: string;
};

export type Member = {
  name: string;
  location?: string;
  roles: string[];
  bio: string;
  image: {
    src: string; // /public path
    alt: string;
  };
  links: MemberLink[];
  keywords?: string[];
};

export const MEMBERS: Member[] = [
  {
    name: "Steven 'Jesse Lee' Bumbera",
    location: "Fort Worth",
    roles: ["Actor", "Writer", "Production Assistant (PA)"],
    bio: "Marine veteran and entrepreneur with a strong foundation in discipline, leadership, and execution. Actor and writer with extensive experience in short-form narrative projects, currently building toward producing through hands-on work as a production assistant.",
    image: {
      src: "/members/s-bumbera.jpeg",
      alt: "Steven Bumbera",
    },
    links: [
      {
        kind: "website",
        href: "https://fwfilmmakers.org/",
        label: "Website",
      },
      {
        kind: "instagram",
        href: "https://www.instagram.com/jesseleebumbera/",
        label: "Instagram",
      },
      {
        kind: "youtube",
        href: "https://www.youtube.com/@jesseleebumbera",
      },
      {
        kind: "backstage",
        href: "https://www.backstage.com/u/steven-bumbera/",
        label: "Backstage",
      },
      {
        kind: "imdb",
        href: "https://www.imdb.com/name/nm17860284/",
        label: "IMDB",
      },
    ],
    keywords: ["FWFA", "Actor", "Writer", "Production Assistant", "PA"],
  },
  {
    name: "Paul Curry",
    location: "Fort Worth",
    roles: ["Actor"],
    bio: "British airborne veteran and former police officer with strong discipline and integrity. I am an English speaking actor with a north-east English accent. While speaking roles may be limited because of my accent, I do offer diversity  depending on the type of role and actor required that American speaking actors can’t provide. I will always offer enthusiasm and professionalism in any role.",
    image: {
      src: "/members/p-curry.png",
      alt: "Paul Curry",
    },
    links: [
      {
        kind: "instagram",
        href: "https://www.instagram.com/paulc130/",
        label: "Instagram",
      },
    ],
    keywords: ["Actor"],
  },
  {
    name: "Marianna Repetto",
    location: "Fort Worth",
    roles: ["Actress"],
    bio: "Mariana tried to pursue acting while living in Los Angeles but ended up moving to Maryland to care for her father. 5 years later, she found herself giving acting a second try now that she has moved to Texas. She is excited to see how much the industry has grown here and honored to attempt to represent Texas as a local actress, amongst so many kind and talented professionals.",
    image: {
      src: "/members/m-repetto.jpg",
      alt: "Marianna Repetto",
    },
    links: [
      {
        kind: "instagram",
        href: "https://www.instagram.com/marimarisdiary/",
        label: "Instagram",
      },
      {
        kind: "imdb",
        href: "https://m.imdb.com/name/nm6210165/",
        label: "IMDB",
      },
    ],
    keywords: ["Actress"],
  },
  {
    name: "Tyler Henize",
    location: "Fort Worth",
    roles: [
      "Actor",
      "Lighting Technician",
      "Grip",
      "Production Assistant (PA)",
    ],
    bio: "Tyler Henize is a U.S. Navy veteran and Dallas–Fort Worth–based actor and film crew professional with experience across narrative film, music videos, and commercial projects. Trained through the Tarrant County College Film Collaborative, he works both in front of and behind the camera in acting and grip & electric roles, bringing a strong technical understanding of lighting, camera support, and on-set workflow, along with a disciplined, collaborative presence.",
    image: {
      src: "/members/t-henize.jpg",
      alt: "Tyler Henize",
    },
    links: [
      {
        kind: "instagram",
        href: "https://www.instagram.com/tyler_henizeofficial/",
        label: "Instagram",
      },
      {
        kind: "backstage",
        href: "https://www.backstage.com/tal/tyler-henize",
        label: "Backstage",
      },
    ],
  },
];
