"use client";

import { useState } from "react";

import { X } from "lucide-react";

import type { PlacementBilling, UpdatePlacementBillingPayload } from "./types";

type Props = {
  billing: PlacementBilling | null;

  loading: boolean;

  onClose: () => void;

  onSubmit: (billingId: string, payload: UpdatePlacementBillingPayload) => void;
};

export default function BillingEditModal(props: Props) {
  if (!props.billing) {
    return null;
  }

  return (
    <BillingEditForm
      key={props.billing.billingId}
      {...props}
      billing={props.billing}
    />
  );
}

function BillingEditForm({
  billing,
  loading,
  onClose,
  onSubmit,
}: Omit<Props, "billing"> & {
  billing: PlacementBilling;
}) {
  const [placementFee, setPlacementFee] = useState(
    String(billing.placementFee),
  );

  const [taxRate, setTaxRate] = useState(String(billing.taxRate));

  const [dueDate, setDueDate] = useState(
    billing.dueDate ? billing.dueDate.slice(0, 10) : "",
  );

  const [notes, setNotes] = useState(billing.notes || "");

  const fee = Number(placementFee) || 0;

  const tax = fee * ((Number(taxRate) || 0) / 100);

  const total = fee + tax;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              Placement Billing
            </p>

            <h2 className="mt-1 text-2xl font-bold">Edit Billing</h2>

            <p className="mt-1 text-sm text-slate-500">{billing.billingId}</p>
          </div>

          <button type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company" value={billing.companyName} />

            <Field label="Candidate" value={billing.candidateName} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="text-sm font-medium">Placement Fee</span>

              <input
                type="number"
                min="0"
                value={placementFee}
                onChange={(event) => setPlacementFee(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none"
              />
            </label>

            <label>
              <span className="text-sm font-medium">Tax Rate (%)</span>

              <input
                type="number"
                min="0"
                value={taxRate}
                onChange={(event) => setTaxRate(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium">Due Date</span>

            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Notes</span>

            <textarea
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none"
            />
          </label>

          <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3">
            <Amount label="Subtotal" value={fee} />

            <Amount label="Tax" value={tax} />

            <Amount label="Total" value={total} />
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              onSubmit(billing.billingId, {
                placementFee: Number(placementFee) || 0,

                taxRate: Number(taxRate) || 0,

                dueDate,

                notes,
              })
            }
            className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            Save Billing
          </button>
        </footer>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function Amount({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 font-bold">¥{Math.round(value).toLocaleString()}</p>
    </div>
  );
}
