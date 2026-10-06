"use client";

import {
  CheckCircle2,
  Eye,
  Pencil,
  RefreshCw,
  Search,
  Send,
} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import BillingDetails from "./BillingDetails";

import BillingEditModal from "./BillingEditModal";

import IssueBillingModal from "./IssueBillingModal";

import MarkPaidModal from "./MarkPaidModal";

import {
  formatBillingDate,
  formatMoney,
  getBillingStatusClass,
} from "./helper";

import { useStaffPlacementBillings } from "./hook";

import type { PlacementBillingStatus } from "./types";

export default function StaffPlacementBillings() {
  const t = useTranslations("staffPlacementBillings");

  const locale = useLocale();

  const {
    billings,
    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    canView,
    canManage,

    viewingBillingId,
    viewingBilling,
    setViewingBillingId,

    editingBilling,
    setEditingBilling,

    issuingBilling,
    setIssuingBilling,

    payingBilling,
    setPayingBilling,

    isLoading,
    isFetching,
    isDetailsLoading,

    isUpdating,
    isIssuing,
    isMarkingPaid,
    isSaving,

    error,

    refresh,

    updateBilling,
    issueBilling,
    markPaid,
  } = useStaffPlacementBillings();

  // ====================================================
  // PERMISSION
  // ====================================================

  if (!isLoading && !canView) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
          {t("permissionDenied")}
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="mx-auto max-w-7xl space-y-6 px-6 py-10">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">{t("title")}</h1>

            <p className="mt-1 text-sm text-slate-500">{t("description")}</p>
          </div>

          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refresh()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />

            {t("refresh")}
          </button>
        </div>

        {/* STATUS SUMMARY */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <Summary label={t("summary.total")} value={summary?.total ?? 0} />

          <Summary label={t("summary.draft")} value={summary?.draft ?? 0} />

          <Summary label={t("summary.issued")} value={summary?.issued ?? 0} />

          <Summary label={t("summary.paid")} value={summary?.paid ?? 0} />

          <Summary
            label={t("summary.partialRefund")}
            value={summary?.partiallyRefunded ?? 0}
          />

          <Summary
            label={t("summary.refunded")}
            value={summary?.refunded ?? 0}
          />

          <Summary
            label={t("summary.cancelled")}
            value={summary?.cancelled ?? 0}
          />
        </div>

        {/* MONEY */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MoneySummary
            label={t("summary.totalBilled")}
            value={summary?.billedTotal ?? 0}
            locale={locale}
          />

          <MoneySummary
            label={t("summary.netPaid")}
            value={summary?.paidTotal ?? 0}
            locale={locale}
          />

          <MoneySummary
            label={t("summary.refundedTotal")}
            value={summary?.refundedTotal ?? 0}
            locale={locale}
          />

          <MoneySummary
            label={t("summary.outstanding")}
            value={summary?.outstandingTotal ?? 0}
            locale={locale}
          />
        </div>

        {/* VIEW ONLY NOTICE */}

        {!canManage && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            {t("viewOnlyNotice")}
          </div>
        )}

        {/* FILTER */}

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-indigo-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "ALL" | PlacementBillingStatus,
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm"
          >
            <option value="ALL">{t("allStatuses")}</option>

            <option value="draft">{t("statuses.draft")}</option>

            <option value="issued">{t("statuses.issued")}</option>

            <option value="paid">{t("statuses.paid")}</option>

            <option value="partially_refunded">
              {t("statuses.partially_refunded")}
            </option>

            <option value="refunded">{t("statuses.refunded")}</option>

            <option value="cancelled">{t("statuses.cancelled")}</option>
          </select>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">{t("table.billing")}</th>

                  <th className="px-5 py-4">{t("table.company")}</th>

                  <th className="px-5 py-4">{t("table.candidate")}</th>

                  <th className="px-5 py-4">{t("table.position")}</th>

                  <th className="px-5 py-4">{t("table.total")}</th>

                  <th className="px-5 py-4">{t("table.netPaid")}</th>

                  <th className="px-5 py-4">{t("table.status")}</th>

                  <th className="px-5 py-4">{t("table.dueDate")}</th>

                  <th className="px-5 py-4 text-right">{t("table.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-16 text-center text-sm text-slate-500"
                    >
                      {t("loading")}
                    </td>
                  </tr>
                ) : billings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-16 text-center text-sm text-slate-500"
                    >
                      {t("empty")}
                    </td>
                  </tr>
                ) : (
                  billings.map((billing) => (
                    <tr
                      key={billing.billingId}
                      className="border-t border-slate-100"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">{billing.billingId}</p>

                        <p className="mt-1 text-xs text-slate-400">
                          {billing.invoiceNumber || billing.recruitId}
                        </p>
                      </td>

                      <td className="px-5 py-4">{billing.companyName}</td>

                      <td className="px-5 py-4 font-medium">
                        {billing.candidateName}
                      </td>

                      <td className="px-5 py-4">{billing.jobTitle}</td>

                      <td className="px-5 py-4 font-semibold">
                        {formatMoney(
                          billing.totalAmount,
                          billing.currency,
                          locale,
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {["paid", "partially_refunded", "refunded"].includes(
                          billing.status,
                        )
                          ? formatMoney(
                              billing.netPaidAmount,
                              billing.currency,
                              locale,
                            )
                          : "-"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getBillingStatusClass(
                            billing.status,
                          )}`}
                        >
                          {t(`statuses.${billing.status}`)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {formatBillingDate(billing.dueDate, locale)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setViewingBillingId(billing.billingId)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                          >
                            <Eye className="h-4 w-4" />

                            {t("actions.view")}
                          </button>

                          {canManage && billing.status === "draft" && (
                            <>
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => setEditingBilling(billing)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-sm text-white disabled:opacity-50"
                              >
                                <Pencil className="h-4 w-4" />

                                {t("actions.edit")}
                              </button>

                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => setIssuingBilling(billing)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                              >
                                <Send className="h-4 w-4" />

                                {t("actions.issue")}
                              </button>
                            </>
                          )}

                          {canManage && billing.status === "issued" && (
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() => setPayingBilling(billing)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                            >
                              <CheckCircle2 className="h-4 w-4" />

                              {t("actions.markPaid")}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* DETAILS */}

      {viewingBillingId && (
        <BillingDetails
          billing={viewingBilling}
          loading={isDetailsLoading}
          onClose={() => setViewingBillingId(null)}
        />
      )}

      {/* EDIT */}

      <BillingEditModal
        billing={editingBilling}
        loading={isUpdating}
        onClose={() => setEditingBilling(null)}
        onSubmit={updateBilling}
      />

      {/* ISSUE */}

      <IssueBillingModal
        billing={issuingBilling}
        isSaving={isIssuing}
        onClose={() => setIssuingBilling(null)}
        onConfirm={issueBilling}
      />

      {/* MARK PAID */}

      <MarkPaidModal
        billing={payingBilling}
        isSaving={isMarkingPaid}
        onClose={() => setPayingBilling(null)}
        onConfirm={markPaid}
      />
    </>
  );
}

// ======================================================
// SUMMARY
// ======================================================

function Summary({
  label,
  value,
}: {
  label: string;

  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

// ======================================================
// MONEY SUMMARY
// ======================================================

function MoneySummary({
  label,
  value,
  locale,
}: {
  label: string;

  value: number;

  locale: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-2xl font-bold">
        {formatMoney(value, "JPY", locale)}
      </p>
    </div>
  );
}
