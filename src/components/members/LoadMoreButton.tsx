// src/components/members/LoadMoreButton.tsx
export default function LoadMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-8 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
      >
        Load more
      </button>
    </div>
  );
}
