"use client";

import { useLocale, useTranslations } from "next-intl";

import { X } from "lucide-react";

import {
  formatBillingDate,
  formatBillingDateTime,
  formatMoney,
  getBillingStatusClass,
} from "./helper";

import type { BillingAuditEntry, PlacementBilling } from "./types";

type Props = {
  billing: PlacementBilling | undefined;

  loading: boolean;

  onClose: () => void;
};

export default function BillingDetails({ billing, loading, onClose }: Props) {
  const t = useTranslations("staffPlacementBillings");

  const locale = useLocale();

  if (loading) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/50">
        <div className="rounded-2xl bg-white px-8 py-6 shadow-xl">
          {t("details.loading")}
        </div>
      </div>
    );
  }

  if (!billing) {
    return null;
  }

  const auditLabel = (action: BillingAuditEntry["action"]) => {
    switch (action) {
      case "CREATED":
        return t("auditActions.CREATED");

      case "UPDATED":
        return t("auditActions.UPDATED");

      case "ISSUED":
        return t("auditActions.ISSUED");

      case "MARKED_PAID":
        return t("auditActions.MARKED_PAID");

      case "CANCELLED":
        return t("auditActions.CANCELLED");

      case "REFUND_PROCESSED":
        return t("auditActions.REFUND_PROCESSED");

      default:
        return action;
    }
  };

  const actorLabel = (actor: "system" | "admin" | "staff") => {
    switch (actor) {
      case "admin":
        return t("actorTypes.admin");

      case "staff":
        return t("actorTypes.staff");

      default:
        return t("actorTypes.system");
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label={t("details.close")}
      />

      <div className="relative z-10 max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <header className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              {t("details.eyebrow")}
            </p>

            <h2 className="mt-1 text-2xl font-bold">{billing.billingId}</h2>

            {billing.invoiceNumber && (
              <p className="mt-1 text-sm font-medium text-indigo-600">
                {t("details.invoiceNumber")}: {billing.invoiceNumber}
              </p>
            )}

            <p className="mt-1 text-sm text-slate-500">{billing.companyName}</p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getBillingStatusClass(
                billing.status,
              )}`}
            >
              {t(`statuses.${billing.status}`)}
            </span>

            <button
              type="button"
              onClick={onClose}
              aria-label={t("details.close")}
              className="rounded-full p-2 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="space-y-7 p-6">
          {/* PLACEMENT */}

          <section>
            <h3 className="mb-4 font-bold">{t("details.placement")}</h3>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Info
                label={t("details.candidate")}
                value={billing.candidateName}
              />

              <Info label={t("details.position")} value={billing.jobTitle} />

              <Info label={t("details.recruitId")} value={billing.recruitId} />

              <Info
                label={t("details.candidateId")}
                value={billing.placementCandidateId}
              />

              <Info
                label={t("details.providerId")}
                value={billing.providerId}
              />

              <Info
                label={t("details.placementDate")}
                value={formatBillingDate(billing.placementDate, locale)}
              />
            </div>
          </section>

          {/* BILLING */}

          <section>
            <h3 className="mb-4 font-bold">{t("details.billing")}</h3>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Money
                label={t("details.placementFee")}
                value={billing.placementFee}
                currency={billing.currency}
                locale={locale}
              />

              <Money
                label={t("details.tax", {
                  rate: billing.taxRate,
                })}
                value={billing.taxAmount}
                currency={billing.currency}
                locale={locale}
              />

              <Money
                label={t("details.totalAmount")}
                value={billing.totalAmount}
                currency={billing.currency}
                locale={locale}
              />

              <Info
                label={t("details.dueDate")}
                value={formatBillingDate(billing.dueDate, locale)}
              />
            </div>
          </section>

          {/* PAYMENT */}

          <section>
            <h3 className="mb-4 font-bold">{t("details.payment")}</h3>

            <div className="grid gap-3 sm:grid-cols-3">
              <Money
                label={t("details.paid")}
                value={billing.paidAmount}
                currency={billing.currency}
                locale={locale}
              />

              <Money
                label={t("details.refunded")}
                value={billing.refundedAmount}
                currency={billing.currency}
                locale={locale}
              />

              <Money
                label={t("details.netPaid")}
                value={billing.netPaidAmount}
                currency={billing.currency}
                locale={locale}
              />
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Info
                label={t("details.issuedAt")}
                value={formatBillingDateTime(billing.issuedAt, locale)}
              />

              <Info
                label={t("details.paidAt")}
                value={formatBillingDateTime(billing.paidAt, locale)}
              />
            </div>
          </section>

          {/* NOTES */}

          {billing.notes && (
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                {t("details.notes")}
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm">
                {billing.notes}
              </p>
            </section>
          )}

          {/* CANCELLATION */}

          {billing.cancellationReason && (
            <section className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <p className="font-semibold">{t("details.cancellationReason")}</p>

              <p className="mt-1 text-sm">{billing.cancellationReason}</p>
            </section>
          )}

          {/* REFUNDS */}

          <section>
            <h3 className="font-bold">{t("details.refundHistory")}</h3>

            {billing.refundHistory.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">
                {t("details.noRefunds")}
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {billing.refundHistory.map((refund, index) => (
                  <div
                    key={refund._id || `${refund.refundId}-${index}`}
                    className="rounded-xl border border-red-100 bg-red-50/50 p-4"
                  >
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <p className="font-semibold">{refund.refundId}</p>

                        <p className="mt-1 text-sm text-slate-500">
                          {actorLabel(refund.actor_type)}
                          {" • "}
                          {refund.actor_id}
                        </p>
                      </div>

                      <p className="font-bold text-red-600">
                        {formatMoney(refund.amount, billing.currency, locale)}
                      </p>
                    </div>

                    <p className="mt-3 text-sm">{refund.reason}</p>

                    <p className="mt-2 text-xs text-slate-400">
                      {formatBillingDateTime(refund.refunded_at, locale)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* AUDIT */}

          <section>
            <h3 className="font-bold">{t("details.auditHistory")}</h3>

            {billing.auditHistory.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">
                {t("details.noAudit")}
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {billing.auditHistory.map((entry, index) => (
                  <div
                    key={entry._id || `${entry.action}-${index}`}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap justify-between gap-3">
                      <p className="font-semibold">
                        {auditLabel(entry.action)}
                      </p>

                      <p className="text-xs text-slate-400">
                        {formatBillingDateTime(entry.created_at, locale)}
                      </p>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {actorLabel(entry.actor_type)}

                      {entry.actor_id ? ` • ${entry.actor_id}` : ""}
                    </p>

                    {entry.reason && (
                      <p className="mt-2 text-sm">{entry.reason}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <footer className="flex justify-end border-t border-slate-200 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5"
          >
            {t("details.close")}
          </button>
        </footer>
      </div>
    </div>
  );
}

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

function Money({
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
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 font-bold">{formatMoney(value, currency, locale)}</p>
    </div>
  );
}
