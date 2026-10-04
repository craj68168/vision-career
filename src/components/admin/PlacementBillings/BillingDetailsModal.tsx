"use client";
import { useTranslations, useFormatter } from "next-intl";
import { X } from "lucide-react";
import type { PlacementBilling } from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

type Props = {
  billing: PlacementBilling | null;
  onClose: () => void;
};
// ======================================================
// COMPONENT
// ======================================================
export default function BillingDetailsModal({ billing, onClose }: Props) {
  const t = useTranslations("adminPlacementBillings");
  const format = useFormatter();
  const money = (value: number) => format.number(value, { style: "currency", currency: "JPY", maximumFractionDigits: 0 });
  const formatJapanDate = (value?: string | null) => dateValue(value, false);
  const formatJapanDateTime = (value?: string | null) => dateValue(value, true);
 const dateValue = (
  value: string | null | undefined,
  withTime: boolean,
): string => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  if (withTime) {
    return format.dateTime(date, {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  return format.dateTime(date, {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
  if (!billing) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm">
      <button type="button" aria-label={t("close")} className="absolute inset-0" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={t("placementBilling")} className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}
        <header className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
          <div className="min-w-0">
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {t("placementBilling")}
            </p>
            <h2 className="mt-0.5 break-words text-lg font-semibold text-zinc-950 dark:text-white sm:text-xl">
              {billing.invoiceNumber || billing.billingId}
            </h2>
            {billing.invoiceNumber && (
              <p className="mt-1 font-mono text-xs text-zinc-400 dark:text-zinc-500">
                {t("billingIdInline", { id: billing.billingId })}
              </p>
            )}
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{billing.companyName}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("close")} className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10 ${focusRing}`}>
            <X className="h-5 w-5" />
          </button>
        </header>
        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}
        <div className="space-y-4 p-4 sm:p-5">
          {/* ================================================= */}
          {/* REFERENCES */}
          {/* ================================================= */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Info label={t("candidate")} value={billing.candidateName} />
            <Info label={t("position")} value={billing.jobTitle} />
            <Info label={t("recruitId")} value={billing.recruitId} />
            <Info
              label={t("placementCandidate")}
              value={billing.placementCandidateId}
            />
          </div>
          {/* ================================================= */}
          {/* FINANCIAL */}
          {/* ================================================= */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Money label={t("placementFee")} value={billing.placementFee} />
            <Money
              label={t("taxWithRate", { rate: format.number(billing.taxRate) })}
              value={billing.taxAmount}
            />
            <Money label={t("total")} value={billing.totalAmount} />
            <Info label={t("status")} value={t(`statuses.${billing.status}`)} />
          </div>
          {/* ================================================= */}
          {/* PAYMENT */}
          {/* ================================================= */}
          {["paid", "partially_refunded", "refunded"].includes(
            billing.status,
          ) && (
            <div className="grid gap-3 sm:grid-cols-3">
              <Money label={t("paidAmount")} value={billing.paidAmount} />
              <Money label={t("refundedAmount")} value={billing.refundedAmount} />
              <Money label={t("netPaidAmount")} value={billing.netPaidAmount} />
            </div>
          )}
          {/* ================================================= */}
          {/* INVOICE INFORMATION */}
          {/* ================================================= */}
          {billing.invoiceNumber && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-400/20 dark:bg-emerald-400/10">
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {t("invoiceInformation")}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Info label={t("invoiceNumber")} value={billing.invoiceNumber} />
                <Info label={t("internalBillingId")} value={billing.billingId} />
                <Info
                  label={t("issueDate")}
                  value={formatJapanDate(billing.issuedAt)}
                />
                <Info
                  label={t("paymentDueDate")}
                  value={formatJapanDate(billing.dueDate)}
                />
              </div>
            </div>
          )}
          {/* ================================================= */}
          {/* CANCELLATION */}
          {/* ================================================= */}
          {billing.cancellationReason && (
            <div className="rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-400/10 dark:text-red-300">
              <p className="font-semibold">{t("cancellationReason")}</p>
              <p className="mt-1">{billing.cancellationReason}</p>
            </div>
          )}
          {/* ================================================= */}
          {/* REFUND HISTORY */}
          {/* ================================================= */}
          {billing.refundHistory.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">{t("refundHistory")}</h3>
              <div className="mt-3 space-y-3">
                {billing.refundHistory.map((refund) => (
                  <div
                    key={refund._id || refund.refundId}
                    className="rounded-lg border border-zinc-200 p-3 dark:border-white/10"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-mono font-medium text-zinc-950 dark:text-white">
                          {refund.refundId}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          {refund.reason}
                        </p>
                      </div>
                      <p className="font-bold text-red-600">
                        {money(-Number(refund.amount || 0))}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                      {formatJapanDateTime(refund.refunded_at)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* ================================================= */}
          {/* AUDIT HISTORY */}
          {/* ================================================= */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">{t("auditHistory")}</h3>
            <div className="mt-3 space-y-3">
              {billing.auditHistory.map((entry, index) => (
                <div
                  key={entry._id || `${entry.action}-${index}`}
                  className="rounded-lg border border-zinc-200 p-3 dark:border-white/10"
                >
                  <div className="flex justify-between gap-4">
                    <p className="font-medium text-zinc-950 dark:text-white">
                      {t(`auditActions.${entry.action}`)}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {formatJapanDateTime(entry.created_at)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {t(`actors.${entry.actor_type}`)}
                    {entry.actor_id ? ` • ${entry.actor_id}` : ""}
                  </p>
                  {entry.reason && (
                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{entry.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ======================================================
// INFO
// ======================================================
function Info({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3 dark:bg-white/5">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 break-words font-medium text-zinc-900 dark:text-zinc-100">{value || "-"}</p>
    </div>
  );
}
// ======================================================
// MONEY
// ======================================================
function Money({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const format = useFormatter();
  return (
    <div className="rounded-lg bg-zinc-50 p-3 dark:bg-white/5">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 font-semibold text-zinc-950 dark:text-white">{format.number(Number(value || 0), { style: "currency", currency: "JPY", maximumFractionDigits: 0 })}</p>
    </div>
  );
}
