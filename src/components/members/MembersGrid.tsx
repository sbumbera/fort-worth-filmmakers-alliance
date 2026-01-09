// src/components/members/MembersGrid.tsx
import type { Member } from "@/data/members";
import MemberCard from "@/components/members/MemberCard";

export default function MembersGrid({ members }: { members: Member[] }) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {members.map((m) => (
        <MemberCard key={m.name} member={m} />
      ))}
    </div>
  );
}
