import Image from "next/image";
import type { Member } from "@/data/members";
import ExternalLinkButton from "@/components/members/ExternalLinkButton";

function RolePill({ role }: { role: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
      {role}
    </span>
  );
}

export default function MemberCard({ member }: { member: Member }) {
  // All links are treated equally (Website included)
  const links = member.links;

  return (
    <div className="group flex min-h-[280px] min-w-0 flex-col rounded-3xl border border-white/10 bg-black/25 p-5 transition hover:border-white/20">
      {/* Top row: avatar + identity */}
      <div className="flex min-w-0 items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
          <Image
            src={member.image.src}
            alt={member.image.alt}
            fill
            sizes="64px"
            className="object-cover"
            style={{ objectPosition: "50% 20%" }}
            loading="lazy"
          />
        </div>

        <div className="min-w-0">
          {/* Name */}
          <div className="text-lg font-semibold leading-snug text-white break-words">
            {member.name}
          </div>

          {/* Location */}
          {member.location ? (
            <div className="mt-1 text-sm text-white/60">{member.location}</div>
          ) : null}
        </div>
      </div>

      {/* Roles */}
      {member.roles?.length ? (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {member.roles.map((r) => (
              <RolePill key={`${member.name}-${r}`} role={r} />
            ))}
          </div>
        </div>
      ) : null}

      {/* Bio */}
      <div className="mt-4 text-sm leading-relaxed text-white/75">
        {member.bio}
      </div>

      {/* Links */}
      {links.length > 0 ? (
        <div className="mt-auto pt-5">
          <div className="grid grid-cols-2 gap-2">
            {links.map((l) => (
              <ExternalLinkButton
                key={`${member.name}-${l.kind}-${l.href}`}
                link={l}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
