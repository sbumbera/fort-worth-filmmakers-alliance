// src/lib/nonUnionCalc.ts

export type DayEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  inTime: string; // HH:MM
  outTime: string; // HH:MM
  mealMinutes: string; // store as string for blanking
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
  termsDays: number;
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

export function computeBaseHourly(dayRate: number) {
  if (dayRate <= 0) return 0;
  return dayRate / 14;
}

export type DayCalc = {
  ok: boolean;
  errors: string[];
  paidHours: number;

  dayPay: number;
  otBeyond12Hours: number;
  otBeyond12Pay: number;

  baseHourly: number;
};

export function calcDay({
  dayRate,
  baseHourly,
  inTime,
  outTime,
  mealMinutes,
}: {
  dayRate: number;
  baseHourly: number;
  inTime: string;
  outTime: string;
  mealMinutes: number;
}): DayCalc {
  const start = parseTimeToMinutes(inTime);
  const end = parseTimeToMinutes(outTime);

  const errors: string[] = [];
  if (start === null) errors.push("Invalid In time.");
  if (end === null) errors.push("Invalid Out time.");
  if (mealMinutes < 0) errors.push("Meal minutes cannot be negative.");

  if (errors.length || start === null || end === null) {
    return {
      ok: false,
      errors,
      paidHours: 0,
      dayPay: 0,
      otBeyond12Hours: 0,
      otBeyond12Pay: 0,
      baseHourly,
    };
  }

  const totalMinutes = minutesDiff(start, end);
  const paidMinutes = Math.max(0, totalMinutes - mealMinutes);
  const paidHours = paidMinutes / 60;

  const otBeyond12Hours = Math.max(0, paidHours - 12);
  const otBeyond12Pay = otBeyond12Hours * baseHourly * 2.0;

  // Guarantee: day rate covers <= 12 paid hours
  const dayPay = paidHours <= 12 ? dayRate : dayRate + otBeyond12Pay;

  return {
    ok: true,
    errors: [],
    paidHours,
    dayPay,
    otBeyond12Hours,
    otBeyond12Pay,
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
