// src/components/members/EmptyState.tsx
export default function EmptyState() {
  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
      <div className="font-semibold text-white">No matches yet.</div>
      <div className="mt-1">Try a different spelling, acronym, or role.</div>
    </div>
  );
}
