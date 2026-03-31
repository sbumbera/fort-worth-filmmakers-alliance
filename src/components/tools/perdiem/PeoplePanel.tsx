"use client";

import React, { useMemo, useState } from "react";
import type { Person } from "@/lib/perDiem";
import {
  parsePeopleFromPaste,
  titleCaseName,
  uid,
  normalizeName,
} from "@/lib/perDiem";

export default function PeoplePanel({
  people,
  setPeople,
}: {
  people: Person[];
  setPeople: (next: Person[]) => void;
}) {
  const [newName, setNewName] = useState("");
  const [pasteText, setPasteText] = useState("");

  const normalizedSet = useMemo(() => {
    const s = new Set<string>();
    for (const p of people) s.add(normalizeName(p.name));
    return s;
  }, [people]);

  function addOne() {
    const name = titleCaseName(newName);
    if (!name) return;
    if (normalizedSet.has(normalizeName(name))) {
      setNewName("");
      return;
    }
    setPeople([...people, { id: uid(), name }]);
    setNewName("");
  }

  function addFromPaste() {
    const names = parsePeopleFromPaste(pasteText)
      .map((x) => titleCaseName(x))
      .filter(Boolean);

    const next = [...people];
    for (const name of names) {
      const key = normalizeName(name);
      if (normalizedSet.has(key)) continue;
      normalizedSet.add(key);
      next.push({ id: uid(), name });
    }

    setPeople(next);
    setPasteText("");
  }

  function removePerson(id: string) {
    setPeople(people.filter((p) => p.id !== id));
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-white">People</div>
          <div className="mt-1 text-sm text-white/70">
            Add names once, then select them in batches.
          </div>
        </div>
        <div className="text-xs font-semibold text-white/60">
          Total: {people.length}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs font-semibold text-white/70">Add one</div>
          <div className="mt-2 flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Steven Bumbera"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40"
            />
            <button
              type="button"
              onClick={addOne}
              className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
            >
              Add
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs font-semibold text-white/70">
            Paste many (one per line or comma-separated)
          </div>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={4}
            placeholder={"Steve\nBrian\nFred"}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={addFromPaste}
              className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
            >
              Add names
            </button>
          </div>
        </div>
      </div>

      {people.length ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <div className="border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold text-white/70">
            Current list
          </div>
          <div className="max-h-[260px] overflow-auto">
            {people.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3 last:border-b-0"
              >
                <div className="text-sm text-white">{p.name}</div>
                <button
                  type="button"
                  onClick={() => removePerson(p.id)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 hover:bg-white/10"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
          Add at least 1 person to start building batches.
        </div>
      )}
    </div>
  );
}
