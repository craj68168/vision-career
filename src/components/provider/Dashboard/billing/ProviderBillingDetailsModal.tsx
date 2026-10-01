"use client";

import { useEffect } from "react";

import {
  CircleDollarSign,
  FileText,
  ReceiptText,
  RotateCcw,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type {
  ProviderPlacementBilling,
  ProviderPlacementBillingStatus,
} from "./types";

type Props = {
  billing: ProviderPlacementBilling | null;
  lang: string;
  onClose: () => void;
};

// Shared tokens: keep in sync with vacancies.tsx / provider-dashboard.tsx
const PANEL = "rounded-[14px] bg-white/70 ring-1 ring-black/5";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-800/50 focus-visible:ring-offset-1";

const BTN = `inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-[12px] text-sm font-medium transition-colors ${FOCUS}`;

// Status colours follow the same meaning as vacancies:
// emerald = done/good, amber = waiting, red = failed/cancelled, slate = neutral.
const RAIL: Record<ProviderPlacementBillingStatus, string> = {
  issued: "bg-amber-600",
  paid: "bg-emerald-600",
  partially_refunded: "bg-teal-700",
  refunded: "bg-slate-400",
  cancelled: "bg-red-700",
};

const TONE: Record<ProviderPlacementBillingStatus, string> = {
  issued: "text-amber-700",
  paid: "text-emerald-700",
  partially_refunded: "text-teal-700",
  refunded: "text-slate-500",
  cancelled: "text-red-700",
};

export default function ProviderBillingDetailsModal({
  billing,
  lang,
  onClose,
}: Props) {
  const t = useTranslations("provider.billing.details");

  const isOpen = Boolean(billing);

  // Close on Escape while open
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!billing) {
    return null;
  }

  const showsPaymentBreakdown = [
    "paid",
    "partially_refunded",
    "refunded",
  ].includes(billing.status);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-0 sm:p-4">
      <button
        type="button"
        aria-label={t("close")}
        tabIndex={-1}
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="billing-details-title"
        className="relative z-10 flex max-h-dvh w-full max-w-3xl flex-col overflow-hidden bg-[#f4f5f8] text-[#1b1c21] shadow-2xl sm:max-h-[92vh] sm:rounded-[14px]"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-black/[0.06] bg-white/85 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <BillingStatusLabel status={billing.status} />
              <span className="text-xs text-slate-500">{t("title")}</span>
            </div>

            <h2
              id="billing-details-title"
              className="mt-1 break-all font-mono text-xl font-semibold tabular-nums leading-tight"
            >
              {billing.billingId}
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              {billing.companyName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className={`${BTN} w-9 shrink-0 bg-white/80 text-slate-600 ring-1 ring-black/10 hover:bg-white hover:text-slate-900`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        {/* Body */}
        <div className="space-y-5 overflow-y-auto p-5 sm:p-6">
          {/* Placement details */}
          <section
            className={`relative overflow-hidden p-5 pl-6 ${PANEL}`}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-y-0 left-0 w-1.5 ${RAIL[billing.status]}`}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Info label={t("fields.candidate")} value={billing.candidateName} />
              <Info label={t("fields.position")} value={billing.jobTitle} />
              <Info
                label={t("fields.placementDate")}
                value={formatDate(billing.placementDate, lang)}
                mono
              />
              <Info
                label={t("fields.dueDate")}
                value={formatDate(billing.dueDate, lang)}
                mono
              />
            </div>
          </section>

          {/* Invoice summary */}
          <section className={`${PANEL} p-5`}>
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="grid h-8 w-8 place-items-center rounded-full bg-teal-800/5 text-teal-800/70 ring-1 ring-teal-800/10"
              >
                <ReceiptText className="h-4 w-4" />
              </span>
              <h3 className="text-base font-semibold">{t("invoiceSummary")}</h3>
            </div>

            <dl className="mt-3">
              <MoneyRow
                label={t("fields.placementFee")}
                value={billing.placementFee}
                lang={lang}
              />
              <MoneyRow
                label={t("fields.tax", { rate: billing.taxRate })}
                value={billing.taxAmount}
                lang={lang}
              />

              <div className="my-3 border-t border-black/5" />

              <MoneyRow
                label={t("fields.total")}
                value={billing.totalAmount}
                lang={lang}
                strong
              />

              {billing.status === "issued" && (
                <MoneyRow
                  label={t("fields.amountDue")}
                  value={billing.amountDue}
                  lang={lang}
                  strong
                />
              )}

              {showsPaymentBreakdown && (
                <>
                  <MoneyRow
                    label={t("fields.paid")}
                    value={billing.paidAmount}
                    lang={lang}
                  />
                  <MoneyRow
                    label={t("fields.refunded")}
                    value={billing.refundedAmount}
                    lang={lang}
                  />
                  <MoneyRow
                    label={t("fields.netPaid")}
                    value={billing.netPaidAmount}
                    lang={lang}
                    strong
                  />
                </>
              )}
            </dl>
          </section>

          {/* Awaiting payment */}
          {billing.status === "issued" && (
            <div className="flex items-start gap-3 rounded-[14px] bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
              <CircleDollarSign
                className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  {t("paymentPendingTitle")}
                </p>
                <p className="mt-1 text-sm leading-6 text-amber-700">
                  {t("paymentPendingDescription")}
                </p>
              </div>
            </div>
          )}

          {/* Cancelled */}
          {billing.status === "cancelled" && (
            <div
              role="status"
              className="rounded-[14px] bg-red-50 px-4 py-3 ring-1 ring-red-100"
            >
              <p className="text-sm font-medium text-red-700">
                {t("invoiceCancelled")}
              </p>
              <p className="mt-1 text-sm text-red-700">
                {billing.cancellationReason || "-"}
              </p>
            </div>
          )}

          {/* Notes */}
          {billing.notes && (
            <section className={`${PANEL} p-5`}>
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText
                  className="h-4 w-4 shrink-0 text-slate-500"
                  aria-hidden="true"
                />
                {t("notes")}
              </div>

              <p className="mt-2 max-w-[75ch] whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                {billing.notes}
              </p>
            </section>
          )}

          {/* Refund history */}
          {billing.refundHistory.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <RotateCcw
                  className="h-4 w-4 shrink-0 text-slate-500"
                  aria-hidden="true"
                />
                <h3 className="text-base font-semibold">{t("refundHistory")}</h3>
              </div>

              <ul className="space-y-3">
                {billing.refundHistory.map((refund) => (
                  <li key={refund.refundId} className={`${PANEL} p-4`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="break-all font-mono text-sm font-medium tabular-nums">
                          {refund.refundId}
                        </p>
                        <p className="mt-1 break-words text-sm text-slate-500">
                          {refund.reason}
                        </p>
                      </div>

                      <p className="shrink-0 font-mono text-base font-medium tabular-nums text-red-700">
                        -{formatMoney(refund.amount, lang)}
                      </p>
                    </div>

                    <p className="mt-2 font-mono text-xs tabular-nums text-slate-500">
                      {formatDate(refund.refundedAt, lang)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* References */}
          <section className={`grid gap-4 p-5 sm:grid-cols-3 ${PANEL}`}>
            <Info
              label={t("fields.placementRequest")}
              value={billing.recruitId}
              mono
            />
            <Info
              label={t("fields.placementCandidate")}
              value={billing.placementCandidateId}
              mono
            />
            <Info
              label={t("fields.issuedAt")}
              value={formatDate(billing.issuedAt, lang)}
              mono
            />
          </section>
        </div>

        {/* Footer */}
        <footer className="flex justify-end border-t border-black/[0.06] bg-white/85 px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className={`${BTN} bg-white/80 px-5 text-slate-700 ring-1 ring-black/10 hover:bg-white`}
          >
            {t("close")}
          </button>
        </footer>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-slate-500">{label}</p>

      <p
        className={`mt-1 break-words text-sm font-medium ${
          mono ? "font-mono tabular-nums" : ""
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}

function MoneyRow({
  label,
  value,
  lang,
  strong = false,
}: {
  label: string;
  value: number;
  lang: string;
  strong?: boolean;
}) {
  return (
    <div className="mt-2.5 flex items-center justify-between gap-4">
      <dt
        className={strong ? "text-sm font-semibold" : "text-sm text-slate-600"}
      >
        {label}
      </dt>

      <dd
        className={`font-mono tabular-nums ${
          strong ? "text-lg font-semibold" : "text-sm font-medium"
        }`}
      >
        {formatMoney(value, lang)}
      </dd>
    </div>
  );
}

function BillingStatusLabel({
  status,
}: {
  status: ProviderPlacementBillingStatus;
}) {
  const t = useTranslations("provider.billing.list.statuses");

  return (
    <span
      className={`text-xs font-medium uppercase tracking-[0.15em] ${TONE[status]}`}
    >
      {t(status === "partially_refunded" ? "partiallyRefunded" : status)}
    </span>
  );
}

function formatMoney(value: number, lang = "en") {
  return `¥${new Intl.NumberFormat(lang === "ja" ? "ja-JP" : "en-US").format(
    Number(value || 0),
  )}`;
}

function formatDate(value?: string | null, lang = "en") {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}