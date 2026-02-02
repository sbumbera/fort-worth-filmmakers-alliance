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
  | "backstage"
  | "actorbay"
  | "phone";

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
    bio: "Marine veteran, software engineer and entrepreneur with a strong foundation in discipline, leadership, and execution. Actor and writer with extensive experience in short-form narrative projects, currently building toward producing through hands-on work as a production assistant.",
    image: {
      src: "/members/s-bumbera.jpeg",
      alt: "Steven Bumbera",
    },
    links: [
      {
        kind: "imdb",
        href: "https://www.imdb.com/name/nm17860284/",
        label: "IMDB",
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
        kind: "website",
        href: "https://www.groganmanagement.com/",
        label: "Agent",
      },
    ],
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
  },
  {
    name: "Marianna Repetto",
    location: "Fort Worth",
    roles: ["Actress"],
    bio: "Mariana tried to pursue acting while living in Los Angeles but ended up moving to Maryland to care for her father. 5 years later, she found herself giving acting a second try now that she has moved to Texas. She is excited to see how much the industry has grown here and honored to attempt to represent Texas as a local actress, amongst so many kind and talented professionals.",
    image: {
      src: "/members/m-repetto2.jpg",
      alt: "Marianna Repetto",
    },
    links: [
      {
        kind: "imdb",
        href: "https://m.imdb.com/name/nm6210165/",
        label: "IMDB",
      },
      {
        kind: "instagram",
        href: "https://www.instagram.com/marimarisdiary/",
        label: "Instagram",
      },
    ],
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
  {
    name: "Calvin Cooper Hall",
    location: "Fort Worth",
    roles: ["Actor"],
    bio: "American actor working in film, television, and immersive theater. He has appeared in Paramount’s Landman (Season 1 and 2) and Taylor Sheridan–universe projects The Madison and Dutton Ranch (2026), along with independent films Daisy and Pickleball – The Movie. He earned his first featured background role in the short film Virgin Birth (K-LOVE Radio) and his first speaking role as Captain John Parker, co-lead of Independence Day Experience, produced by Capernaum Studios.",
    image: {
      src: "/members/c-hall2.jpeg",
      alt: "Calvin Cooper Hall",
    },
    links: [
      {
        kind: "imdb",
        href: "https://www.imdb.com/name/nm17438598/",
        label: "IMDb",
      },
      {
        kind: "actorbay",
        href: "https://actorbay.io/profile/calvin-cooper-hall",
      },
    ],
  },
  {
    name: "Jairo Gutierrez",
    location: "Fort Worth",
    roles: ["Writer", "Director", "Sound Mixer"],
    bio: "Jairo Ramon Gutier, who also goes by 'J.R. Gutier' and 'The Masked Director', is just a man who loves films. He loves film so much that when his favorite genre was not being created  here in the states, he decided to bring his own version here. Jairo films his own brand of V-Cinema, when he is not writing and directing , you can find him helping out on many film projects as the Sound Mixer. Helping out people create their dreams, brings much joy to him, and he hopes to continue working in the film industry for as long as he lives.",
    image: {
      src: "/members/j-gutierrez.jpg",
      alt: "Jairo Gutierrez",
    },
    links: [
      {
        kind: "youtube",
        href: "https://youtube.com/@maskedguyproductions9501",
        label: "YouTube",
      },
      {
        kind: "instagram",
        href: "https://www.instagram.com/j.r._gutier",
        label: "Instagram",
      },
    ],
  },
  {
    name: "Nathan Paine",
    location: "Fort Worth",
    roles: ["Director of Photography (DP)", "Camera Operator"],
    bio: "Howdy! My name is Nathan. I am a Fort Worth DP and Camera Operator with over a decade of narrative experience working my way up in Grip, Electric, and Camera Departments. I love storytelling with cinema and would love to chat about films and filmmaking with anyone who cares as much as I do. Let's bring back Texas indy films!",
    image: {
      src: "/members/n-paine.jpg",
      alt: "Nathan Paine",
    },
    links: [
      {
        kind: "imdb",
        href: "https://www.imdb.com/name/nm6153669/",
        label: "IMDB",
      },
      {
        kind: "instagram",
        href: "https://www.instagram.com/nathanaelpaine_dp/",
        label: "Instagram",
      },
    ],
  },
  {
    name: "Thomas Collins",
    location: "Fort Worth",
    roles: ["Actor"],
    bio: "A recent AADA graduate looking to make a big splash back home! With his background in theater, his conservatory training, and his love for the art; he’s got a lot to offer you! Whether you need a goof ball hero, or a dark heart; Thomas has got you covered!",
    image: {
      src: "/members/t-collins.jpg",
      alt: "Thomas Collins",
    },
    links: [
      {
        kind: "imdb",
        href: "https://www.imdb.com/name/nm17860288/",
        label: "IMDB",
      },
      {
        kind: "backstage",
        href: "https://www.backstage.com/tal/thomas-collins-1",
        label: "Backstage",
      },
      {
        kind: "website",
        href: "https://whomanagement.com/",
        label: "Agent",
      },
    ],
  },
  {
    name: "Alexa Estrada",
    location: "Dallas",
    roles: ["Actress"],
    bio: "DFW local actress, profesional show girl (Veronica Valentine) and Selena Quintanilla Impersonator. Credits: “Timeless- Soldiers Wife” | “Veiled in Flesh” | “Zombie, Party Goer”. Can be contacted by Instagram, Email, Or Text.",
    image: {
      src: "/members/a-estrada.jpg",
      alt: "Alexa Estrada",
    },
    links: [
      {
        kind: "phone",
        href: "tel:+14696627968",
        label: "(469) 662-7968",
      },
      {
        kind: "email",
        href: "Alexama017@gmail.com ",
        label: "Email",
      },

      {
        kind: "instagram",
        href: "https://www.instagram.com/chanclaphobia/",
        label: "Actress IG",
      },
      {
        kind: "instagram",
        href: "https://www.instagram.com/theveronicavalentine/",
        label: "Show Girl IG",
      },
    ],
  },
  {
    name: "Jett Dinh",
    location: "Dallas",
    roles: ["Actor"],
    bio: "Jett Dinh is an actor and remote capable voice talent based in Dallas-Fort Worth, Texas. A versatile performer, he has appeared in short films, commercials, and live theatrical productions throughout the DFW area. In voiceover, Jett has credits in original Webtoon animated series, audio drama series with ARC Productions, and more. He began his acting career after first training in audio-visual production at Dallas College. Being mixed-race and Vietnamese American, Jett draws on his own life experiences, and his work often gravitates toward complex, layered characters and narrative-driven projects in both live-action and voiceover.",
    image: {
      src: "/members/j-dinh.jpg",
      alt: "Jett Dinh",
    },
    links: [
      {
        kind: "imdb",
        href: "https://www.imdb.com/name/nm17611552/",
        label: "IMDB",
      },
      {
        kind: "website",
        href: "https://jettdinh.carrd.co/",
        label: "Website",
      },
      {
        kind: "instagram",
        href: "https://instagram.com/jett.dinh/",
        label: "Instagram",
      },
    ],
  },
  {
    name: "Rachel Peck",
    location: "Dallas",
    roles: ["Makeup Artist", "Hair and Makeup Artist", "SFX Makeup Artist"],
    bio: "Rachel Peck is a professional hair and makeup artist specializing in on-camera work for film, runway, and special effects. Her focus is creating camera-ready hair and makeup that translate seamlessly under studio lighting, movement, and high-resolution capture. Based in DFW, she works closely with directors, photographers, and production teams to support visual storytelling through intentional, refined artistry.",
    image: {
      src: "/members/r-peck.jpg",
      alt: "Rachel Peck",
    },
    links: [
      {
        kind: "instagram",
        href: "https://www.instagram.com/makeupxrachel",
        label: "Instagram",
      },
    ],
  },
  {
    name: 'Michelle "Vee" McGehee',
    location: "Fort Worth",
    roles: [
      "Makeup Artist",
      "Hair and Makeup Artist",
      "SFX Makeup Artist",
      "Key Makeup Artist",
    ],
    bio: 'Michelle "Vee" McGehee is a seasoned hair, makeup, and makeup effects professional with over 20 years of experience in production.',
    image: {
      src: "/members/m-mcgehee3.jpg",
      alt: 'Michelle "Vee" McGehee',
    },
    links: [
      {
        kind: "website",
        href: "https://www.makeupartbyvivienne.com",
        label: "Website",
      },
      {
        kind: "email",
        href: "mailto:Vforvermuth@gmail.com",
        label: "Email",
      },
      {
        kind: "phone",
        href: "tel:+14692680213",
        label: "(469) 268-0213",
      },
    ],
  },
];
