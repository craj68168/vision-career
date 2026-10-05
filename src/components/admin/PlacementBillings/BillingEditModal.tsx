"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";
import type { PlacementBilling, UpdatePlacementBillingPayload } from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-zinc-900 dark:text-white";

type Props = {
  billing: PlacementBilling | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (billingId: string, payload: UpdatePlacementBillingPayload) => void;
};
export default function BillingEditModal(props: Props) {
  if (!props.billing) return null;
  return <BillingEditForm key={props.billing.billingId} {...props} billing={props.billing} />;
}
function BillingEditForm({ billing, loading, onClose, onSubmit }: Omit<Props, "billing"> & { billing: PlacementBilling }) {
  const t = useTranslations("adminPlacementBillings");
  const [placementFee, setPlacementFee] = useState(String(billing.placementFee));
  const [taxRate, setTaxRate] = useState(String(billing.taxRate));
  const [dueDate, setDueDate] = useState(billing.dueDate ? billing.dueDate.slice(0, 10) : "");
  const [notes, setNotes] = useState(billing.notes || "");
  const fee = Number(placementFee) || 0;
  const tax = fee * ((Number(taxRate) || 0) / 100);
  const total = fee + tax;
  const close = () => { if (!loading) onClose(); };
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm">
      <button type="button" aria-label={t("close")} disabled={loading} className="absolute inset-0" onClick={close} />
      <div role="dialog" aria-modal="true" aria-labelledby="billing-edit-title" className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
        <header className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
          <div className="min-w-0"><p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{t("placementBilling")}</p><h2 id="billing-edit-title" className="mt-0.5 text-lg font-semibold text-zinc-950 dark:text-white">{t("editBilling")}</h2><p className="mt-0.5 truncate text-sm text-zinc-500 dark:text-zinc-400">{billing.billingId}</p></div>
          <button type="button" disabled={loading} onClick={close} aria-label={t("close")} className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10 ${focusRing}`}><X className="h-5 w-5" /></button>
        </header>
        <div className="space-y-4 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2"><Field label={t("company")} value={billing.companyName} /><Field label={t("candidate")} value={billing.candidateName} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label><span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("placementFee")}</span><input disabled={loading} type="number" min="0" value={placementFee} onChange={(event) => setPlacementFee(event.target.value)} className={`${fieldClass} h-10`} /></label>
            <label><span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("taxRate")}</span><input disabled={loading} type="number" min="0" value={taxRate} onChange={(event) => setTaxRate(event.target.value)} className={`${fieldClass} h-10`} /></label>
          </div>
          <label className="block"><span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("dueDate")}</span><input disabled={loading} type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className={`${fieldClass} h-10`} /></label>
          <label className="block"><span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("notes")}</span><textarea disabled={loading} rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} className={`${fieldClass} p-3`} /></label>
          <div className="grid gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-white/5 sm:grid-cols-3"><Amount label={t("subtotal")} value={fee} /><Amount label={t("tax")} value={tax} /><Amount label={t("total")} value={total} /></div>
        </div>
        <footer className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 px-4 py-3 dark:border-white/10 sm:px-5">
          <button type="button" disabled={loading} onClick={close} className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}>{t("cancel")}</button>
          <button type="button" disabled={loading} onClick={() => onSubmit(billing.billingId, { placementFee: Number(placementFee) || 0, taxRate: Number(taxRate) || 0, dueDate, notes })} className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${focusRing}`}>{t(loading ? "saving" : "saveBilling")}</button>
        </footer>
      </div>
    </div>
  );
}
function Field({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-zinc-50 p-3 dark:bg-white/5"><p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p><p className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{value}</p></div>;
}
function Amount({ label, value }: { label: string; value: number }) {
  const format = useFormatter();
  return <div><p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p><p className="mt-1 font-semibold text-zinc-950 dark:text-white">{format.number(Math.round(value), { style: "currency", currency: "JPY", maximumFractionDigits: 0 })}</p></div>;
}
