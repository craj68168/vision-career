"use client";

import { useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";
import type { PlacementBilling, RefundPlacementBillingPayload } from "./types";

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
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4">
      <button type="button" aria-label={t("close")} className="absolute inset-0" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="billing-refund-title" className="relative z-10 w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-red-600">{t("paymentRefund")}</p>
            <h2 id="billing-refund-title" className="mt-1 text-2xl font-bold">{t("refundBilling")}</h2>
            <p className="mt-1 text-sm text-slate-500">{billing.billingId}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("close")}><X className="h-5 w-5" /></button>
        </header>
        <div className="space-y-5 p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <Money label={t("originalPaid")} value={billing.paidAmount} />
            <Money label={t("alreadyRefunded")} value={billing.refundedAmount} />
            <Money label={t("refundable")} value={refundable} />
          </div>
          <label className="block">
            <span className="text-sm font-semibold">{t("refundAmount")}</span>
            <input type="number" min="1" max={refundable} value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-red-400" />
            {numericAmount > refundable && <p className="mt-2 text-sm text-red-600">{t("refundLimit", { amount: money(refundable) })}</p>}
          </label>
          <label className="block">
            <span className="text-sm font-semibold">{t("refundReason")}</span>
            <textarea rows={4} maxLength={1000} value={reason} onChange={(event) => setReason(event.target.value)} placeholder={t("refundPlaceholder")} className="mt-2 w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-red-400" />
          </label>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">{t("netAfterRefund")}</p>
            <p className="mt-1 text-2xl font-bold">{money(remaining)}</p>
            <p className="mt-2 text-sm text-slate-500">{t(remaining === 0 ? "fullRefundNotice" : "partialRefundNotice")}</p>
          </div>
        </div>
        <footer className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-2.5">{t("cancel")}</button>
          <button type="button" disabled={loading || invalid} onClick={() => onSubmit(billing.billingId, { amount: numericAmount, reason: reason.trim() })} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50"><RotateCcw className="h-4 w-4" />{t(loading ? "processing" : "processRefund")}</button>
        </footer>
      </div>
    </div>
  );
}

function Money({ label, value }: { label: string; value: number }) {
  const format = useFormatter();
  return <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-bold">{format.number(value, { style: "currency", currency: "JPY", maximumFractionDigits: 0 })}</p></div>;
}
