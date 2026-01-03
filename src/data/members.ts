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
  | "email";

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
        href: "https:/www.fwfilmmakers.org",
        label: "Website",
      },
      {
        kind: "instagram",
        href: "https://www.instagram.com/jesseleebumbera/",
        label: "Instagram",
      },
      {
        kind: "linkedin",
        href: "https://www.linkedin.com/in/stevenjbumbera/",
        label: "LinkedIn",
      },
      {
        kind: "youtube",
        href: "https://www.youtube.com/@jesseleebumbera",
      },
      { kind: "email", href: "mailto:sbumbera59@gmail.com", label: "Email" },
    ],
    keywords: ["FWFA", "Actor", "Writer", "Production Assistant", "PA"],
  },
];
