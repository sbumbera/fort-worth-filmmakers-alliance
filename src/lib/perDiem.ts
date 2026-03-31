// lib/perDiem.ts

export type Person = {
  id: string;
  name: string;
};

export type Batch = {
  id: string;
  job: string;
  dates: string[]; // ISO: YYYY-MM-DD
  amountStr: string; // keep string for input
  personIds: string[];
  createdAt: number;
};

export type Entry = {
  id: string;
  personId: string;
  personName: string;
  job: string;
  date: string; // ISO
  amount: number;
  batchId: string;
};

export type DuplicatePolicy = "skip" | "allow";

export type BuildResult = {
  entries: Entry[];
  warnings: string[];
};

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function safeNumber(v: unknown): number {
  const n = typeof v === "number" ? v : Number(String(v ?? "").trim());
  return Number.isFinite(n) ? n : 0;
}

export function money(n: number): string {
  return `$${round2(n).toFixed(2)}`;
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

export function titleCaseName(name: string): string {
  const cleaned = name.trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  return cleaned
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatDateShort(iso: string): string {
  // Expect YYYY-MM-DD
  const t = String(iso || "").trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (!m) return t || "N/A";
  const mm = String(Number(m[2]));
  const dd = String(Number(m[3]));
  const yyyy = m[1];
  return `${mm}/${dd}/${yyyy}`;
}

export function isISODate(iso: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(iso || "").trim());
}

export function parseDatesFromTextarea(text: string): string[] {
  const parts = String(text || "")
    .split(/[\n,]+/g)
    .map((x) => x.trim())
    .filter(Boolean);

  const out: string[] = [];
  for (const p of parts) {
    const iso = coerceToISODate(p);
    if (iso && isISODate(iso)) out.push(iso);
  }
  return Array.from(new Set(out));
}

export function coerceToISODate(input: string): string | null {
  const s = String(input || "").trim();
  if (!s) return null;

  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // Accept M/D/YYYY or MM/DD/YYYY
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
  if (m) {
    const mm = String(Number(m[1])).padStart(2, "0");
    const dd = String(Number(m[2])).padStart(2, "0");
    const yyyy = m[3];
    return `${yyyy}-${mm}-${dd}`;
  }

  return null;
}

export function parsePeopleFromPaste(text: string): string[] {
  // One name per line. Also supports comma-separated.
  return String(text || "")
    .split(/\n|,/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

export function makeNewBatchPrefilled(prev?: Batch): Batch {
  return {
    id: uid(),
    job: prev?.job ? prev.job : "",
    dates: prev?.dates?.length ? prev.dates.slice() : [],
    amountStr: "",
    personIds: [],
    createdAt: Date.now(),
  };
}

export function buildEntriesFromBatches(opts: {
  people: Person[];
  batches: Batch[];
  duplicatePolicy?: DuplicatePolicy; // default "skip"
}): BuildResult {
  const duplicatePolicy: DuplicatePolicy = opts.duplicatePolicy || "skip";

  const peopleById = new Map<string, Person>();
  for (const p of opts.people) peopleById.set(p.id, p);

  const warnings: string[] = [];
  const entries: Entry[] = [];

  const seenKey = new Set<string>();
  // key: job|personId|date
  const keyOf = (job: string, personId: string, date: string) =>
    `${job.trim()}|${personId}|${date}`;

  for (const batch of opts.batches) {
    const job = (batch.job || "").trim();
    const amount = round2(safeNumber(batch.amountStr));
    const dates = (batch.dates || []).map((d) => String(d || "").trim());
    const personIds = batch.personIds || [];

    if (!job) continue;
    if (!amount || amount <= 0) continue;
    if (!dates.length) continue;
    if (!personIds.length) continue;

    for (const personId of personIds) {
      const p = peopleById.get(personId);
      if (!p) continue;

      for (const date of dates) {
        if (!isISODate(date)) continue;

        const key = keyOf(job, personId, date);
        if (seenKey.has(key) && duplicatePolicy === "skip") {
          warnings.push(
            `Skipped duplicate: ${p.name} already has an entry for ${formatDateShort(
              date,
            )} on job ${job}.`,
          );
          continue;
        }

        seenKey.add(key);

        entries.push({
          id: uid(),
          personId,
          personName: p.name,
          job,
          date,
          amount,
          batchId: batch.id,
        });
      }
    }
  }

  // stable sort for display: personName, then date
  entries.sort((a, b) => {
    const pn = a.personName.localeCompare(b.personName);
    if (pn !== 0) return pn;
    return a.date.localeCompare(b.date);
  });

  return { entries, warnings };
}

export type CardRow = {
  dateISO: string;
  amount: number;
};

export type PerDiemCard = {
  personName: string;
  job: string;
  rows: CardRow[];
  total: number;
};

export function groupEntriesIntoCards(entries: Entry[]): PerDiemCard[] {
  // group by personName + job
  const map = new Map<string, PerDiemCard>();

  for (const e of entries) {
    const key = `${normalizeName(e.personName)}|${e.job}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        personName: e.personName,
        job: e.job,
        rows: [{ dateISO: e.date, amount: e.amount }],
        total: round2(e.amount),
      });
    } else {
      existing.rows.push({ dateISO: e.date, amount: e.amount });
      existing.total = round2(existing.total + e.amount);
    }
  }

  const cards = Array.from(map.values());
  for (const c of cards) {
    c.rows.sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  }

  cards.sort((a, b) => {
    const pn = a.personName.localeCompare(b.personName);
    if (pn !== 0) return pn;
    return a.job.localeCompare(b.job);
  });

  return cards;
}
