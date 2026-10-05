"use client";

import { useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";
import type { PlacementBilling, RefundPlacementBillingPayload } from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

type Props = {
  billing: PlacementBilling | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (billingId: string, payload: RefundPlacementBillingPayload) => void;
};

export default function RefundBillingModal({ billing, loading, onClose, onSubmit }: Props) {
  if (!billing) return null;
  return <RefundForm key={billing.billingId} billing={billing} loading={loading} onClose={onClose} onSubmit={onSubmit} />;
}

function RefundForm({ billing, loading, onClose, onSubmit }: Omit<Props, "billing"> & { billing: PlacementBilling }) {
  const t = useTranslations("adminPlacementBillings");
  const format = useFormatter();
  const refundable = Math.max(billing.paidAmount - billing.refundedAmount, 0);
  const [amount, setAmount] = useState(String(refundable));
  const [reason, setReason] = useState("");
  const numericAmount = Number(amount) || 0;
  const remaining = Math.max(refundable - numericAmount, 0);
  const invalid = numericAmount <= 0 || numericAmount > refundable || !reason.trim();
  const money = (value: number) => format.number(value, { style: "currency", currency: "JPY", maximumFractionDigits: 0 });

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm">
      <button type="button" aria-label={t("close")} className="absolute inset-0" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="billing-refund-title" className="relative z-10 w-full max-w-xl overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
        <header className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
          <div className="min-w-0">
            <p className="text-xs font-medium text-red-600 dark:text-red-300">{t("paymentRefund")}</p>
            <h2 id="billing-refund-title" className="mt-0.5 text-lg font-semibold text-zinc-950 dark:text-white">{t("refundBilling")}</h2>
            <p className="mt-0.5 truncate text-sm text-zinc-500 dark:text-zinc-400">{billing.billingId}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("close")} className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10 ${focusRing}`}><X className="h-5 w-5" /></button>
        </header>
        <div className="space-y-4 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Money label={t("originalPaid")} value={billing.paidAmount} />
            <Money label={t("alreadyRefunded")} value={billing.refundedAmount} />
            <Money label={t("refundable")} value={refundable} />
          </div>
          <label className="block">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("refundAmount")}</span>
            <input type="number" min="1" max={refundable} value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white" />
            {numericAmount > refundable && <p className="mt-2 text-sm text-red-600">{t("refundLimit", { amount: money(refundable) })}</p>}
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("refundReason")}</span>
            <textarea rows={4} maxLength={1000} value={reason} onChange={(event) => setReason(event.target.value)} placeholder={t("refundPlaceholder")} className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white" />
          </label>
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-white/5">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("netAfterRefund")}</p>
            <p className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">{money(remaining)}</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t(remaining === 0 ? "fullRefundNotice" : "partialRefundNotice")}</p>
          </div>
        </div>
        <footer className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 px-4 py-3 dark:border-white/10 sm:px-5">
          <button type="button" onClick={onClose} className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}>{t("cancel")}</button>
          <button type="button" disabled={loading || invalid} onClick={() => onSubmit(billing.billingId, { amount: numericAmount, reason: reason.trim() })} className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${focusRing}`}><RotateCcw className="h-4 w-4" />{t(loading ? "processing" : "processRefund")}</button>
        </footer>
      </div>
    </div>
  );
}

function Money({ label, value }: { label: string; value: number }) {
  const format = useFormatter();
  return <div className="rounded-lg bg-zinc-50 p-3 dark:bg-white/5"><p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p><p className="mt-1 font-semibold text-zinc-950 dark:text-white">{format.number(value, { style: "currency", currency: "JPY", maximumFractionDigits: 0 })}</p></div>;
}
