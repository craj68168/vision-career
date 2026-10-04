"use client";
import { useTranslations, useFormatter } from "next-intl";
import { X } from "lucide-react";
import type { PlacementBilling } from "./types";
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4">
      <button type="button" aria-label={t("close")} className="absolute inset-0" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={t("placementBilling")} className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}
        <header className="flex justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              {t("placementBilling")}
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              {billing.invoiceNumber || billing.billingId}
            </h2>
            {billing.invoiceNumber && (
              <p className="mt-1 font-mono text-xs text-slate-400">
                {t("billingIdInline", { id: billing.billingId })}
              </p>
            )}
            <p className="mt-2 text-sm text-slate-500">{billing.companyName}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("close")}>
            <X className="h-5 w-5" />
          </button>
        </header>
        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}
        <div className="space-y-6 p-6">
          {/* ================================================= */}
          {/* REFERENCES */}
          {/* ================================================= */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <div className="grid gap-4 sm:grid-cols-3">
              <Money label={t("paidAmount")} value={billing.paidAmount} />
              <Money label={t("refundedAmount")} value={billing.refundedAmount} />
              <Money label={t("netPaidAmount")} value={billing.netPaidAmount} />
            </div>
          )}
          {/* ================================================= */}
          {/* INVOICE INFORMATION */}
          {/* ================================================= */}
          {billing.invoiceNumber && (
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                {t("invoiceInformation")}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="rounded-2xl bg-red-50 p-4 text-red-700">
              <p className="font-semibold">{t("cancellationReason")}</p>
              <p className="mt-1">{billing.cancellationReason}</p>
            </div>
          )}
          {/* ================================================= */}
          {/* REFUND HISTORY */}
          {/* ================================================= */}
          {billing.refundHistory.length > 0 && (
            <div>
              <h3 className="font-semibold">{t("refundHistory")}</h3>
              <div className="mt-3 space-y-3">
                {billing.refundHistory.map((refund) => (
                  <div
                    key={refund._id || refund.refundId}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-mono font-medium">
                          {refund.refundId}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {refund.reason}
                        </p>
                      </div>
                      <p className="font-bold text-red-600">
                        {money(-Number(refund.amount || 0))}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
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
            <h3 className="font-semibold">{t("auditHistory")}</h3>
            <div className="mt-3 space-y-3">
              {billing.auditHistory.map((entry, index) => (
                <div
                  key={entry._id || `${entry.action}-${index}`}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex justify-between gap-4">
                    <p className="font-medium">
                      {t(`auditActions.${entry.action}`)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatJapanDateTime(entry.created_at)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {t(`actors.${entry.actor_type}`)}
                    {entry.actor_id ? ` • ${entry.actor_id}` : ""}
                  </p>
                  {entry.reason && (
                    <p className="mt-2 text-sm">{entry.reason}</p>
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
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 break-words font-medium">{value || "-"}</p>
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
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-bold">{format.number(Number(value || 0), { style: "currency", currency: "JPY", maximumFractionDigits: 0 })}</p>
    </div>
  );
}
