"use client";

import { CheckCircle2, Loader2, ShieldCheck, X } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { formatMoney } from "./helper";

import type { PlacementBilling } from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  billing: PlacementBilling | null;

  isSaving: boolean;

  onClose: () => void;

  onConfirm: (billingId: string) => void;
};

// ======================================================
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const secondaryButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50";

// ======================================================
// COMPONENT
// ======================================================

export default function MarkPaidModal({
  billing,
  isSaving,
  onClose,
  onConfirm,
}: Props) {
  const t = useTranslations("staffPlacementBillings");

  const locale = useLocale();

  if (!billing) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("paidModal.title")}
      className="fixed inset-0 z-[170] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      {/* BACKDROP */}

      <button
        type="button"
        className="absolute inset-0 cursor-default"
        disabled={isSaving}
        onClick={onClose}
        aria-label={t("paidModal.close")}
      />

      {/* MODAL */}

      <div className="relative z-10 flex max-h-[94dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-slate-200 sm:max-h-[92dvh] sm:rounded-2xl">
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
              <CheckCircle2 className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                {t("paidModal.eyebrow")}
              </p>

              <h2 className="mt-0.5 break-words text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
                {t("paidModal.title")}
              </h2>

              <p className="mt-1 break-all text-xs text-slate-500">
                {billing.invoiceNumber || billing.billingId}
              </p>
            </div>

            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              aria-label={t("paidModal.close")}
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

            <div className="min-w-0 rounded-xl bg-white p-3.5 ring-1 ring-inset ring-slate-200">
              <p className="break-words text-sm font-semibold text-slate-950">
                {billing.companyName}
              </p>

              <p className="mt-1 break-words text-xs text-slate-500">
                {billing.candidateName}
                {" • "}
                {billing.jobTitle}
              </p>
            </div>

            {/* AMOUNT */}

            <div className="rounded-xl bg-[linear-gradient(180deg,#ecfdf5,#ffffff_75%)] p-5 text-center ring-1 ring-inset ring-emerald-200">
              <span
                aria-hidden="true"
                className="mx-auto grid h-9 w-9 place-items-center rounded-lg bg-white text-emerald-600 ring-1 ring-inset ring-emerald-200"
              >
                <CheckCircle2 className="h-4 w-4" />
              </span>

              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                {t("paidModal.amount")}
              </p>

              <p className="mt-2 break-words text-2xl font-semibold leading-none tabular-nums text-slate-950 sm:text-[32px]">
                {formatMoney(billing.totalAmount, billing.currency, locale)}
              </p>
            </div>

            {/* PAYMENT NOTICE */}

            <div className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 ring-1 ring-inset ring-amber-200">
              {t("paidModal.paymentNotice")}
            </div>

            {/* ADMIN NOTICE */}

            <div className="flex gap-3 rounded-xl bg-blue-50 p-4 ring-1 ring-inset ring-blue-200">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
              />

              <p className="text-sm leading-6 text-blue-700">
                {t("paidModal.adminNotice")}
              </p>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex shrink-0 flex-col-reverse gap-2 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[inset_0_1px_0_0_#e2e8f0] sm:flex-row sm:justify-end sm:px-6 sm:py-4">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className={secondaryButton}
          >
            {t("paidModal.cancel")}
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => onConfirm(billing.billingId)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}

            {isSaving ? t("paidModal.saving") : t("paidModal.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}