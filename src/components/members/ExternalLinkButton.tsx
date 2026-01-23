// src/components/members/ExternalLinkButton.tsx
import type { MemberLink, LinkKind } from "@/data/members";
import {
  InstagramIcon,
  DiscordIcon,
  WebsiteIcon,
  FacebookIcon,
  YouTubeIcon,
  TikTokIcon,
  XIcon,
  LinkedInIcon,
  EmailIcon,
  PhoneIcon,
  IMDbIcon,
  BackstageIcon,
  ActorBayIcon,
} from "@/components/icons";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getKindLabel(kind: LinkKind) {
  switch (kind) {
    case "website":
      return "Website";
    case "instagram":
      return "Instagram";
    case "discord":
      return "Discord";
    case "facebook":
      return "Facebook";
    case "youtube":
      return "YouTube";
    case "tiktok":
      return "TikTok";
    case "x":
      return "X";
    case "linkedin":
      return "LinkedIn";
    case "email":
      return "Email";
    case "phone":
      return "Phone";
    case "imdb":
      return "IMDb";
    case "backstage":
      return "Backstage";
    case "actorbay":
      return "ActorBay";
    default:
      return "Link";
  }
}

function normalizeHref(kind: LinkKind, href: string) {
  const raw = (href ?? "").trim();

  if (kind === "email") {
    if (!raw) return "";
    return raw.toLowerCase().startsWith("mailto:") ? raw : `mailto:${raw}`;
  }

  if (kind === "phone") {
    if (!raw) return "";
    const cleaned = raw.replace(/[^\d+]/g, "");
    return cleaned.toLowerCase().startsWith("tel:")
      ? cleaned
      : `tel:${cleaned}`;
  }

  return raw;
}

export default function ExternalLinkButton({
  link,
  compactLabelOnMobile,
}: {
  link: MemberLink;
  compactLabelOnMobile?: boolean;
}) {
  const kind = link.kind;
  const label = link.label?.trim() ? link.label : getKindLabel(kind);
  const href = normalizeHref(kind, link.href);

  const isEmail = kind === "email";
  const isPhone = kind === "phone";
  const isExternal = !(isEmail || isPhone);

  const isLogoOnly = kind === "actorbay" || kind === "imdb";

  const icon =
    kind === "instagram" ? (
      <InstagramIcon className="h-4 w-4" />
    ) : kind === "discord" ? (
      <DiscordIcon className="h-4 w-4" />
    ) : kind === "website" ? (
      <WebsiteIcon className="h-4 w-4" />
    ) : kind === "facebook" ? (
      <FacebookIcon className="h-4 w-4" />
    ) : kind === "youtube" ? (
      <YouTubeIcon className="h-4 w-4" />
    ) : kind === "tiktok" ? (
      <TikTokIcon className="h-4 w-4" />
    ) : kind === "x" ? (
      <XIcon className="h-4 w-4" />
    ) : kind === "linkedin" ? (
      <LinkedInIcon className="h-4 w-4" />
    ) : kind === "email" ? (
      <EmailIcon className="h-4 w-4" />
    ) : kind === "phone" ? (
      <PhoneIcon className="h-4 w-4" />
    ) : kind === "imdb" ? (
      <IMDbIcon />
    ) : kind === "backstage" ? (
      <BackstageIcon className="h-4 w-4" />
    ) : kind === "actorbay" ? (
      <ActorBayIcon />
    ) : (
      <EmailIcon className="h-4 w-4" />
    );

  if (!href) return null;

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={isLogoOnly ? label : undefined}
      title={isLogoOnly ? label : undefined}
      className={cn(
        "inline-flex items-center rounded-xl border border-white/10 bg-white/5 text-sm text-white/85 hover:bg-white/10 hover:text-white",
        compactLabelOnMobile
          ? "h-10 w-10 justify-center px-0 sm:h-auto sm:w-auto sm:justify-start sm:px-3 sm:py-2"
          : "gap-2 px-3 py-2",
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center",
          isLogoOnly ? "h-6 w-full" : "h-5 w-5",
        )}
      >
        {icon}
      </span>

      {!isLogoOnly &&
        (compactLabelOnMobile ? (
          <span className="ml-2 hidden sm:inline">{label}</span>
        ) : (
          <span className="min-w-0 truncate">{label}</span>
        ))}
    </a>
  );
}
