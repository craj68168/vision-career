"use client";

import { useState } from "react";

import { Loader2, X } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { formatMoney } from "./helper";

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
  const t = useTranslations("staffPlacementBillings");

  const locale = useLocale();

  const [placementFee, setPlacementFee] = useState(
    String(billing.placementFee),
  );

  const [taxRate, setTaxRate] = useState(String(billing.taxRate));

  const [dueDate, setDueDate] = useState(
    billing.dueDate ? billing.dueDate.slice(0, 10) : "",
  );

  const [notes, setNotes] = useState(billing.notes || "");

  const fee = Number(placementFee) || 0;

  const rate = Number(taxRate) || 0;

  const tax =
    billing.currency === "JPY"
      ? Math.round(fee * (rate / 100))
      : Math.round(fee * (rate / 100) * 100) / 100;

  const total =
    billing.currency === "JPY"
      ? Math.round(fee + tax)
      : Math.round((fee + tax) * 100) / 100;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        disabled={loading}
        onClick={onClose}
        aria-label={t("editModal.close")}
      />

      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <header className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              {t("editModal.eyebrow")}
            </p>

            <h2 className="mt-1 text-2xl font-bold">{t("editModal.title")}</h2>

            <p className="mt-1 text-sm text-slate-500">{billing.billingId}</p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            aria-label={t("editModal.close")}
            className="rounded-full p-2 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* BODY */}

        <div className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("editModal.company")} value={billing.companyName} />

            <Field
              label={t("editModal.candidate")}
              value={billing.candidateName}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="text-sm font-medium">
                {t("editModal.placementFee")}
              </span>

              <input
                type="number"
                min="0"
                disabled={loading}
                value={placementFee}
                onChange={(event) => setPlacementFee(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-indigo-400 disabled:opacity-50"
              />
            </label>

            <label>
              <span className="text-sm font-medium">
                {t("editModal.taxRate")}
              </span>

              <input
                type="number"
                min="0"
                disabled={loading}
                value={taxRate}
                onChange={(event) => setTaxRate(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-indigo-400 disabled:opacity-50"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium">
              {t("editModal.dueDate")}
            </span>

            <input
              type="date"
              disabled={loading}
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-indigo-400 disabled:opacity-50"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">{t("editModal.notes")}</span>

            <textarea
              rows={4}
              maxLength={2000}
              disabled={loading}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={t("editModal.notesPlaceholder")}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-indigo-400 disabled:opacity-50"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {notes.length} / 2000
            </p>
          </label>

          <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3">
            <Amount
              label={t("editModal.subtotal")}
              value={fee}
              currency={billing.currency}
              locale={locale}
            />

            <Amount
              label={t("editModal.tax")}
              value={tax}
              currency={billing.currency}
              locale={locale}
            />

            <Amount
              label={t("editModal.total")}
              value={total}
              currency={billing.currency}
              locale={locale}
            />
          </div>
        </div>

        {/* FOOTER */}

        <footer className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 disabled:opacity-50"
          >
            {t("editModal.cancel")}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              onSubmit(billing.billingId, {
                placementFee: Number(placementFee) || 0,

                taxRate: Number(taxRate) || 0,

                dueDate,

                notes: notes.trim(),
              })
            }
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}

            {loading ? t("editModal.saving") : t("editModal.save")}
          </button>
        </footer>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 font-medium">{value || "-"}</p>
    </div>
  );
}

function Amount({
  label,
  value,
  currency,
  locale,
}: {
  label: string;

  value: number;

  currency: string;

  locale: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 font-bold">{formatMoney(value, currency, locale)}</p>
    </div>
  );
}
