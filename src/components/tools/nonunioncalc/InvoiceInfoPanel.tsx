import React from "react";
import FieldLabel from "@/components/tools/nonunioncalc/FieldLabel";
import type { InvoiceMeta, InvoiceParty } from "@/lib/nonUnionCalc";
import { digitsOnly, formatPhone, todayISO } from "@/lib/nonUnionCalc";

const TERMS_OPTIONS: Array<{ label: string; days: number }> = [
  { label: "None", days: -1 },
  { label: "Due on receipt", days: 0 },
  { label: "Net 15", days: 15 },
  { label: "Net 30", days: 30 },
  { label: "Net 45", days: 45 },
  { label: "Net 60", days: 60 },
];

export default function InvoiceInfoPanel({
  meta,
  setMeta,
  from,
  setFrom,
  to,
  setTo,
}: {
  meta: InvoiceMeta;
  setMeta: React.Dispatch<React.SetStateAction<InvoiceMeta>>;
  from: InvoiceParty;
  setFrom: React.Dispatch<React.SetStateAction<InvoiceParty>>;
  to: InvoiceParty;
  setTo: React.Dispatch<React.SetStateAction<InvoiceParty>>;
}) {
  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5">
      <div className="text-base font-semibold text-white">Invoice info</div>

      <div className="mt-4 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
          <div className="text-xs font-semibold text-white/70">
            Invoice details
          </div>

          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel title="Invoice number" />
              <input
                value={meta.invoiceNumber}
                onChange={(e) =>
                  setMeta((m) => ({ ...m, invoiceNumber: e.target.value }))
                }
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                placeholder="INV-001"
              />
            </div>

            <div>
              <FieldLabel title="Invoice date (YYYY-MM-DD)" />
              <input
                value={meta.invoiceDate}
                onChange={(e) =>
                  setMeta((m) => ({ ...m, invoiceDate: e.target.value }))
                }
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                placeholder={todayISO()}
              />
            </div>

            <div>
              <FieldLabel title="Production name" />
              <input
                value={meta.productionName}
                onChange={(e) =>
                  setMeta((m) => ({ ...m, productionName: e.target.value }))
                }
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                placeholder="Production (optional)"
              />
            </div>

            <div>
              <FieldLabel title="Job number" />
              <input
                value={meta.jobNumber}
                onChange={(e) =>
                  setMeta((m) => ({ ...m, jobNumber: e.target.value }))
                }
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                placeholder="Job # (optional)"
              />
            </div>

            <div>
              <FieldLabel
                title="Terms"
                help="Sets the due date based on the invoice date. Choose None if you do not want terms shown."
              />
              <select
                value={meta.termsDays}
                onChange={(e) =>
                  setMeta((m) => ({
                    ...m,
                    termsDays: Number(e.target.value),
                  }))
                }
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
              >
                {TERMS_OPTIONS.map((t) => (
                  <option key={`${t.label}-${t.days}`} value={t.days}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel
                title="Guaranteed hours"
                help="Used for invoice reference. The calculator's guaranteed-hours dropdown should match this."
              />
              <select
                value={meta.guaranteedHours}
                onChange={(e) =>
                  setMeta((m) => ({
                    ...m,
                    guaranteedHours: Number(e.target.value),
                  }))
                }
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
              >
                <option value={10}>10 hours</option>
                <option value={12}>12 hours</option>
                <option value={14}>14 hours</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <FieldLabel
                title="Notes"
                help="Optional custom note that appears under the invoice header."
              />
              <textarea
                value={meta.notes}
                onChange={(e) =>
                  setMeta((m) => ({ ...m, notes: e.target.value }))
                }
                rows={3}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                placeholder="Optional notes"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
          <div className="text-xs font-semibold text-white/70">From</div>

          <div className="mt-2 space-y-2">
            <div>
              <FieldLabel title="Name" />
              <input
                value={from.name}
                onChange={(e) =>
                  setFrom((p) => ({ ...p, name: e.target.value }))
                }
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                placeholder="Your name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel title="Email" />
                <input
                  value={from.email}
                  onChange={(e) =>
                    setFrom((p) => ({ ...p, email: e.target.value }))
                  }
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <FieldLabel
                  title="Phone"
                  help="Type digits only. It will format automatically."
                />
                <input
                  value={formatPhone(from.phone)}
                  onChange={(e) =>
                    setFrom((p) => ({
                      ...p,
                      phone: digitsOnly(e.target.value),
                    }))
                  }
                  inputMode="numeric"
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <FieldLabel title="Address line 1" />
              <input
                value={from.address1}
                onChange={(e) =>
                  setFrom((p) => ({ ...p, address1: e.target.value }))
                }
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                placeholder="123 Main St"
              />
            </div>

            <div>
              <FieldLabel title="Address line 2" />
              <input
                value={from.address2}
                onChange={(e) =>
                  setFrom((p) => ({ ...p, address2: e.target.value }))
                }
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                placeholder="Unit 1 (optional)"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <FieldLabel title="City" />
                <input
                  value={from.city}
                  onChange={(e) =>
                    setFrom((p) => ({ ...p, city: e.target.value }))
                  }
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                  placeholder="City"
                />
              </div>
              <div className="col-span-1">
                <FieldLabel title="State" />
                <input
                  value={from.state}
                  onChange={(e) =>
                    setFrom((p) => ({ ...p, state: e.target.value }))
                  }
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                  placeholder="ST"
                />
              </div>
              <div className="col-span-1">
                <FieldLabel title="ZIP" />
                <input
                  value={from.zip}
                  onChange={(e) =>
                    setFrom((p) => ({
                      ...p,
                      zip: e.target.value.replace(/\D/g, "").slice(0, 10),
                    }))
                  }
                  inputMode="numeric"
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                  placeholder="ZIP"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
          <div className="text-xs font-semibold text-white/70">Bill To</div>

          <div className="mt-2 space-y-2">
            <div>
              <FieldLabel title="Name" />
              <input
                value={to.name}
                onChange={(e) => setTo((p) => ({ ...p, name: e.target.value }))}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                placeholder="Company / person"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel title="Email" />
                <input
                  value={to.email}
                  onChange={(e) =>
                    setTo((p) => ({ ...p, email: e.target.value }))
                  }
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                  placeholder="billing@example.com"
                />
              </div>
              <div>
                <FieldLabel
                  title="Phone"
                  help="Type digits only. It will format automatically."
                />
                <input
                  value={formatPhone(to.phone)}
                  onChange={(e) =>
                    setTo((p) => ({
                      ...p,
                      phone: digitsOnly(e.target.value),
                    }))
                  }
                  inputMode="numeric"
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <FieldLabel title="Address line 1" />
              <input
                value={to.address1}
                onChange={(e) =>
                  setTo((p) => ({ ...p, address1: e.target.value }))
                }
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                placeholder="123 Main St"
              />
            </div>

            <div>
              <FieldLabel title="Address line 2" />
              <input
                value={to.address2}
                onChange={(e) =>
                  setTo((p) => ({ ...p, address2: e.target.value }))
                }
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                placeholder="Suite / optional"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <FieldLabel title="City" />
                <input
                  value={to.city}
                  onChange={(e) =>
                    setTo((p) => ({ ...p, city: e.target.value }))
                  }
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                  placeholder="City"
                />
              </div>
              <div className="col-span-1">
                <FieldLabel title="State" />
                <input
                  value={to.state}
                  onChange={(e) =>
                    setTo((p) => ({ ...p, state: e.target.value }))
                  }
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                  placeholder="ST"
                />
              </div>
              <div className="col-span-1">
                <FieldLabel title="ZIP" />
                <input
                  value={to.zip}
                  onChange={(e) =>
                    setTo((p) => ({
                      ...p,
                      zip: e.target.value.replace(/\D/g, "").slice(0, 10),
                    }))
                  }
                  inputMode="numeric"
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                  placeholder="ZIP"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
