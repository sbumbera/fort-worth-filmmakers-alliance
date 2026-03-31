// src/lib/nonUnionCalc.ts

export type DayEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  inTime: string; // HH:MM
  outTime: string; // HH:MM
  lunchStart: string; // HH:MM
  lunchEnd: string; // HH:MM
};

export type LineItem = {
  id: string;
  title: string;
  description: string;
  cost: string; // store as string for blanking
};

export type InvoiceParty = {
  name: string;
  email: string;
  phone: string; // raw digits
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
};

export type InvoiceMeta = {
  invoiceNumber: string;
  invoiceDate: string; // YYYY-MM-DD
  productionName: string;
  jobNumber: string;
  termsDays: number; // -1 means none
  notes: string;
  guaranteedHours: number;
};

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function safeNumber(n: unknown) {
  const v = Number(String(n ?? "").trim());
  if (!Number.isFinite(v)) return 0;
  return v;
}

export function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatMoney(n: number) {
  const v = round2(n);
  return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function parseISODateOrNull(iso: string) {
  const v = (iso || "").trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return null;
  const yyyy = Number(m[1]);
  const mm = Number(m[2]);
  const dd = Number(m[3]);
  const d = new Date(yyyy, mm - 1, dd);
  if (Number.isNaN(d.getTime())) return null;
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd)
    return null;
  return d;
}

export function formatDateShort(iso: string) {
  const d = parseISODateOrNull(iso);
  if (!d) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export function addDaysISO(iso: string, days: number) {
  const base = parseISODateOrNull(iso) ?? new Date();
  const d = new Date(base.getTime());
  d.setDate(d.getDate() + Math.max(0, Math.floor(days || 0)));
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function parseTimeToMinutes(t: string) {
  const m = /^(\d{2}):(\d{2})$/.exec((t || "").trim());
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  if (hh < 0 || hh > 23) return null;
  if (mm < 0 || mm > 59) return null;
  return hh * 60 + mm;
}

export function minutesDiff(startMin: number, endMin: number) {
  let diff = endMin - startMin;
  if (diff < 0) diff += 24 * 60;
  return diff;
}

export function computeWeightedHours(guaranteedHours: number) {
  const safeGuaranteed = Math.max(0, guaranteedHours);
  const oneXHours = Math.min(8, safeGuaranteed);
  const onePointFiveHours = Math.max(0, safeGuaranteed - oneXHours);
  return oneXHours + onePointFiveHours * 1.5;
}

export function computeBaseHourly(dayRate: number, guaranteedHours: number) {
  if (dayRate <= 0 || guaranteedHours <= 0) return 0;
  const weightedHours = computeWeightedHours(guaranteedHours);
  if (weightedHours <= 0) return 0;
  return dayRate / weightedHours;
}

export type DayCalc = {
  ok: boolean;
  errors: string[];
  paidHours: number;

  dayPay: number;
  regularPay: number;
  otBeyondGuaranteedHours: number;
  otBeyondGuaranteedPay: number;

  // Kept for compatibility with existing totals/UI names
  otBeyond12Hours: number;
  otBeyond12Pay: number;

  lunchMinutes: number;
  guaranteedHours: number;
  baseHourly: number;
};

export function calcDay({
  dayRate,
  baseHourly,
  guaranteedHours,
  inTime,
  outTime,
  lunchStart,
  lunchEnd,
}: {
  dayRate: number;
  baseHourly: number;
  guaranteedHours: number;
  inTime: string;
  outTime: string;
  lunchStart: string;
  lunchEnd: string;
}): DayCalc {
  const start = parseTimeToMinutes(inTime);
  const end = parseTimeToMinutes(outTime);

  const lunchStartMin = lunchStart ? parseTimeToMinutes(lunchStart) : null;
  const lunchEndMin = lunchEnd ? parseTimeToMinutes(lunchEnd) : null;

  const errors: string[] = [];
  if (start === null) errors.push("Invalid In time.");
  if (end === null) errors.push("Invalid Out time.");
  if (
    (lunchStart && lunchStartMin === null) ||
    (lunchEnd && lunchEndMin === null)
  ) {
    errors.push("Invalid lunch time.");
  }
  if ((lunchStart && !lunchEnd) || (!lunchStart && lunchEnd)) {
    errors.push(
      "Lunch start and lunch end must both be filled or both be blank.",
    );
  }
  if (guaranteedHours <= 0)
    errors.push("Guaranteed hours must be greater than zero.");

  if (errors.length || start === null || end === null) {
    return {
      ok: false,
      errors,
      paidHours: 0,
      dayPay: 0,
      regularPay: 0,
      otBeyondGuaranteedHours: 0,
      otBeyondGuaranteedPay: 0,
      otBeyond12Hours: 0,
      otBeyond12Pay: 0,
      lunchMinutes: 0,
      guaranteedHours,
      baseHourly,
    };
  }

  const totalMinutes = minutesDiff(start, end);

  let lunchMinutes = 0;
  if (lunchStartMin !== null && lunchEndMin !== null) {
    lunchMinutes = minutesDiff(lunchStartMin, lunchEndMin);
  }

  const paidMinutes = Math.max(0, totalMinutes - lunchMinutes);
  const paidHours = paidMinutes / 60;

  const otBeyondGuaranteedHours = Math.max(0, paidHours - guaranteedHours);
  const otBeyondGuaranteedPay = otBeyondGuaranteedHours * baseHourly * 2.0;

  const regularPay = dayRate;
  const dayPay =
    paidHours <= guaranteedHours ? dayRate : dayRate + otBeyondGuaranteedPay;

  return {
    ok: true,
    errors: [],
    paidHours,
    dayPay,
    regularPay,
    otBeyondGuaranteedHours,
    otBeyondGuaranteedPay,
    otBeyond12Hours: otBeyondGuaranteedHours,
    otBeyond12Pay: otBeyondGuaranteedPay,
    lunchMinutes,
    guaranteedHours,
    baseHourly,
  };
}

export function sumExpenses(items: LineItem[]) {
  return items.reduce((acc, it) => acc + safeNumber(it.cost), 0);
}

export function sumMileage(miles: number, rate: number) {
  return safeNumber(miles) * safeNumber(rate);
}

export function sumLabor(dayPays: number[]) {
  return dayPays.reduce((a, b) => a + safeNumber(b), 0);
}

// Phone helpers
export function digitsOnly(s: string) {
  return (s || "").replace(/\D/g, "");
}

export function formatPhone(digits: string) {
  const d = digitsOnly(digits).slice(0, 10);
  if (!d) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
