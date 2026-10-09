"use client";

import { useState } from "react";

import { Loader2, Pencil, X } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { formatMoney } from "./helper";

import type { PlacementBilling, UpdatePlacementBillingPayload } from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  billing: PlacementBilling | null;

  loading: boolean;

  onClose: () => void;

  onSubmit: (billingId: string, payload: UpdatePlacementBillingPayload) => void;
};

// ======================================================
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const fieldClass =
  "mt-2 h-11 w-full rounded-xl bg-white px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 outline-none transition-shadow placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-wide text-slate-500";

const secondaryButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50";

// ======================================================
// WRAPPER (resets the form whenever the billing changes)
// ======================================================

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

// ======================================================
// FORM
// ======================================================

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
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("editModal.title")}
      className="fixed inset-0 z-[150] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      {/* BACKDROP */}

      <button
        type="button"
        className="absolute inset-0 cursor-default"
        disabled={loading}
        onClick={onClose}
        aria-label={t("editModal.close")}
      />

      {/* MODAL */}

      <div className="relative z-10 flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-slate-200 sm:max-h-[92dvh] sm:rounded-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="relative shrink-0 overflow-hidden bg-[linear-gradient(120deg,#eef2ff_0%,#f5f3ff_45%,#ffffff_100%)] px-4 py-4 shadow-[inset_0_-1px_0_0_#e0e7ff] sm:px-6 sm:py-5">
          {/* decorative grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.07)_1px,transparent_1px)] bg-[length:44px_44px] [mask-image:linear-gradient(90deg,#000,transparent)]"
          />

          <div className="relative flex items-start gap-3 sm:gap-4">
            <span
              aria-hidden="true"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-white shadow-md shadow-indigo-600/30"
            >
              <Pencil className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                {t("editModal.eyebrow")}
              </p>

              <h2 className="mt-0.5 break-words text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
                {t("editModal.title")}
              </h2>

              <p className="mt-1 break-all text-xs text-slate-500">
                {billing.billingId}
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              aria-label={t("editModal.close")}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-slate-600 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* SCROLLABLE CONTENT */}
        {/* ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/60">
          <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
            {/* PLACEMENT */}

            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label={t("editModal.company")}
                value={billing.companyName}
              />

              <Field
                label={t("editModal.candidate")}
                value={billing.candidateName}
              />
            </div>

            {/* FIELDS */}

            <div className="rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>
                    {t("editModal.placementFee")}
                  </span>

                  <input
                    type="number"
                    min="0"
                    disabled={loading}
                    value={placementFee}
                    onChange={(event) => setPlacementFee(event.target.value)}
                    className={`${fieldClass} tabular-nums`}
                  />
                </label>

                <label className="block">
                  <span className={labelClass}>{t("editModal.taxRate")}</span>

                  <input
                    type="number"
                    min="0"
                    disabled={loading}
                    value={taxRate}
                    onChange={(event) => setTaxRate(event.target.value)}
                    className={`${fieldClass} tabular-nums`}
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className={labelClass}>{t("editModal.dueDate")}</span>

                <input
                  type="date"
                  disabled={loading}
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className={fieldClass}
                />
              </label>

              <label className="mt-4 block">
                <span className={labelClass}>{t("editModal.notes")}</span>

                <textarea
                  rows={4}
                  maxLength={2000}
                  disabled={loading}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder={t("editModal.notesPlaceholder")}
                  className="mt-2 w-full resize-none rounded-xl bg-white p-4 text-sm leading-6 text-slate-900 ring-1 ring-inset ring-slate-200 outline-none transition-shadow placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-1 text-right text-xs tabular-nums text-slate-400">
                  {notes.length} / 2000
                </p>
              </label>
            </div>

            {/* TOTALS */}

            <div className="grid gap-3 rounded-xl bg-[linear-gradient(180deg,#eef2ff,#ffffff_75%)] p-4 ring-1 ring-inset ring-indigo-200 sm:grid-cols-3 sm:p-5">
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
                strong
              />
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex shrink-0 flex-col-reverse gap-2 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[inset_0_1px_0_0_#e2e8f0] sm:flex-row sm:justify-end sm:px-6 sm:py-4">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className={secondaryButton}
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
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}

            {loading ? t("editModal.saving") : t("editModal.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// FIELD (read-only info tile)
// ======================================================

function Field({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-white p-3.5 ring-1 ring-inset ring-slate-200">
      <p className={labelClass}>{label}</p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-950">
        {value || "-"}
      </p>
    </div>
  );
}

// ======================================================
// AMOUNT
// ======================================================

function Amount({
  label,
  value,
  currency,
  locale,
  strong = false,
}: {
  label: string;

  value: number;

  currency: string;

  locale: string;

  strong?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className={labelClass}>{label}</p>

      <p
        className={`mt-1 break-words tabular-nums text-slate-950 ${
          strong ? "text-lg font-bold" : "text-sm font-semibold"
        }`}
      >
        {formatMoney(value, currency, locale)}
      </p>
    </div>
  );
}