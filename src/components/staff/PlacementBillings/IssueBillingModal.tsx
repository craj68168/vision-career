"use client";

import { FileCheck2, Loader2, ShieldCheck, X } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { formatBillingDate, formatMoney } from "./helper";

import type { PlacementBilling } from "./types";

type Props = {
  billing: PlacementBilling | null;

  isSaving: boolean;

  onClose: () => void;

  onConfirm: (billingId: string) => void;
};

export default function IssueBillingModal({
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
    <div className="fixed inset-0 z-[170] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        disabled={isSaving}
        onClick={onClose}
        aria-label={t("issueModal.close")}
      />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              {t("issueModal.eyebrow")}
            </p>

            <h2 className="mt-1 text-2xl font-bold">{t("issueModal.title")}</h2>

            <p className="mt-1 text-sm text-slate-500">{billing.billingId}</p>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            aria-label={t("issueModal.close")}
            className="rounded-full p-2 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}

        <div className="space-y-5 p-6">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-bold">{billing.companyName}</p>

            <p className="mt-1 text-sm text-slate-500">
              {billing.candidateName}
              {" • "}
              {billing.jobTitle}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Info
              label={t("issueModal.total")}
              value={formatMoney(billing.totalAmount, billing.currency, locale)}
            />

            <Info
              label={t("issueModal.dueDate")}
              value={formatBillingDate(billing.dueDate, locale)}
            />
          </div>

          <div className="flex gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
            <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />

            <div>
              <p className="font-semibold text-indigo-800">
                {t("issueModal.invoiceTitle")}
              </p>

              <p className="mt-1 text-sm leading-6 text-indigo-700">
                {t("issueModal.invoiceNotice")}
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

            <p className="text-sm leading-6 text-blue-700">
              {t("issueModal.permissionNotice")}
            </p>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 disabled:opacity-50"
          >
            {t("issueModal.cancel")}
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => onConfirm(billing.billingId)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}

            {isSaving ? t("issueModal.issuing") : t("issueModal.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}
