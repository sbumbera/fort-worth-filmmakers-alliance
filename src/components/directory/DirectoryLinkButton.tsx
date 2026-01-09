// src/components/directory/DirectoryLinkButton.tsx
import Link from "next/link";
import type { DirectoryLink } from "@/data/directory";
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
} from "@/components/icons";

export default function DirectoryLinkButton({ link }: { link: DirectoryLink }) {
  const isEmail = link.kind === "email";
  const isExternal = !isEmail;

  const icon =
    link.kind === "instagram" ? (
      <InstagramIcon className="h-4 w-4" />
    ) : link.kind === "discord" ? (
      <DiscordIcon className="h-4 w-4" />
    ) : link.kind === "website" ? (
      <WebsiteIcon className="h-4 w-4" />
    ) : link.kind === "facebook" ? (
      <FacebookIcon className="h-4 w-4" />
    ) : link.kind === "youtube" ? (
      <YouTubeIcon className="h-4 w-4" />
    ) : link.kind === "tiktok" ? (
      <TikTokIcon className="h-4 w-4" />
    ) : link.kind === "x" ? (
      <XIcon className="h-4 w-4" />
    ) : link.kind === "linkedin" ? (
      <LinkedInIcon className="h-4 w-4" />
    ) : (
      <EmailIcon className="h-4 w-4" />
    );

  return (
    <Link
      href={link.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white"
    >
      {icon}
      <span className="whitespace-nowrap">{link.label}</span>
    </Link>
  );
}
