"use client";

import { useState } from "react";

import { RotateCcw, X } from "lucide-react";

import type { PlacementBilling, RefundPlacementBillingPayload } from "./types";

type Props = {
  billing: PlacementBilling | null;

  loading: boolean;

  onClose: () => void;

  onSubmit: (billingId: string, payload: RefundPlacementBillingPayload) => void;
};

export default function RefundBillingModal({
  billing,
  loading,
  onClose,
  onSubmit,
}: Props) {
  if (!billing) {
    return null;
  }

  return (
    <RefundForm
      key={billing.billingId}
      billing={billing}
      loading={loading}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function RefundForm({
  billing,
  loading,
  onClose,
  onSubmit,
}: {
  billing: PlacementBilling;

  loading: boolean;

  onClose: () => void;

  onSubmit: (billingId: string, payload: RefundPlacementBillingPayload) => void;
}) {
  const refundable = Math.max(billing.paidAmount - billing.refundedAmount, 0);

  const [amount, setAmount] = useState(String(refundable));

  const [reason, setReason] = useState("");

  const numericAmount = Number(amount) || 0;

  const remaining = Math.max(refundable - numericAmount, 0);

  const invalid =
    numericAmount <= 0 || numericAmount > refundable || !reason.trim();

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-red-600">
              Payment Refund
            </p>

            <h2 className="mt-1 text-2xl font-bold">Refund Billing</h2>

            <p className="mt-1 text-sm text-slate-500">{billing.billingId}</p>
          </div>

          <button type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-5 p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <Money label="Original Paid" value={billing.paidAmount} />

            <Money label="Already Refunded" value={billing.refundedAmount} />

            <Money label="Refundable" value={refundable} />
          </div>

          <label className="block">
            <span className="text-sm font-semibold">Refund Amount</span>

            <input
              type="number"
              min="1"
              max={refundable}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-red-400"
            />

            {numericAmount > refundable && (
              <p className="mt-2 text-sm text-red-600">
                Refund cannot exceed ¥{refundable.toLocaleString()}.
              </p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-semibold">Refund Reason</span>

            <textarea
              rows={4}
              maxLength={1000}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Explain why this payment is being refunded..."
              className="mt-2 w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-red-400"
            />
          </label>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Net paid after this refund</p>

            <p className="mt-1 text-2xl font-bold">
              ¥{remaining.toLocaleString()}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {remaining === 0
                ? "This will fully refund the billing."
                : "This will create a partial refund."}
            </p>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading || invalid}
            onClick={() =>
              onSubmit(billing.billingId, {
                amount: numericAmount,

                reason: reason.trim(),
              })
            }
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            Process Refund
          </button>
        </footer>
      </div>
    </div>
  );
}

function Money({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 font-bold">¥{value.toLocaleString()}</p>
    </div>
  );
}
