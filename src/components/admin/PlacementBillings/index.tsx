"use client";
import { useState } from "react";
import { useTranslations, useFormatter } from "next-intl";
import BillingActionModal from "./BillingActionModal";
import {
  CheckCircle2,
  Eye,
  Pencil,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  XCircle,
} from "lucide-react";
import BillingDetailsModal from "./BillingDetailsModal";
import BillingEditModal from "./BillingEditModal";
import RefundBillingModal from "./RefundBillingModal";
import { usePlacementBillings } from "./hook";
import type { PlacementBilling, PlacementBillingStatus } from "./types";
// ======================================================
// COMPONENT
// ======================================================
export default function PlacementBillings() {
  const t = useTranslations("adminPlacementBillings");
  const format = useFormatter();
  const money = (value: number) => format.number(value, { style: "currency", currency: "JPY", maximumFractionDigits: 0 });
  const formatJapanDate = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "-" : format.dateTime(date, { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" });
  };
  const [action, setAction] = useState<{ type: "issue" | "paid" | "cancel"; billingId: string } | null>(null);
  const {
    billings,
    summary,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    viewingBilling,
    setViewingBilling,
    editingBilling,
    setEditingBilling,
    refundingBilling,
    setRefundingBilling,
    isLoading,
    isFetching,
    isSaving,
    refresh,
    updateBilling,
    issueBilling,
    markPaid,
    cancelBilling,
    refundBilling,
  } = usePlacementBillings();
  // ====================================================
  // OPEN REFUND MODAL
  // ====================================================
  const openRefundModal = (billing: PlacementBilling) => {
    const effectivePaidAmount =
      billing.paidAmount > 0
        ? billing.paidAmount
        : ["paid", "partially_refunded", "refunded"].includes(billing.status)
          ? billing.totalAmount
          : 0;
    const refundedAmount = billing.refundedAmount || 0;
    const netPaidAmount = Math.max(effectivePaidAmount - refundedAmount, 0);
    setRefundingBilling({
      ...billing,
      paidAmount: effectivePaidAmount,
      refundedAmount,
      netPaidAmount,
    });
  };
  // ====================================================
  // CANCEL
  // ====================================================
  const handleCancelBilling = (billingId: string) => setAction({ type: "cancel", billingId });
  const handleIssueBilling = (billingId: string) => setAction({ type: "issue", billingId });
  const handleMarkPaid = (billingId: string) => setAction({ type: "paid", billingId });
  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-10">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">
              {t("title")}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {t("description")}
            </p>
          </div>
          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refresh()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            {t("refresh")}
          </button>
        </div>
        {/* ================================================= */}
        {/* STATUS SUMMARY */}
        {/* ================================================= */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <SummaryCard label={t("totalBillings")} value={summary?.total ?? 0} />
          <SummaryCard label={t("draft")} value={summary?.draft ?? 0} />
          <SummaryCard label={t("issued")} value={summary?.issued ?? 0} />
          <SummaryCard label={t("paid")} value={summary?.paid ?? 0} />
          <SummaryCard
            label={t("partiallyRefunded")}
            value={summary?.partiallyRefunded ?? 0}
          />
          <SummaryCard label={t("refunded")} value={summary?.refunded ?? 0} />
        </div>
        {/* ================================================= */}
        {/* FINANCIAL SUMMARY */}
        {/* ================================================= */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MoneyCard label={t("totalBilled")} value={summary?.billedTotal ?? 0} />
          <MoneyCard label={t("netPaid")} value={summary?.paidTotal ?? 0} />
          <MoneyCard label={t("refunded")} value={summary?.refundedTotal ?? 0} />
          <MoneyCard
            label={t("outstanding")}
            value={summary?.outstandingTotal ?? 0}
          />
        </div>
        {/* ================================================= */}
        {/* SEARCH / FILTER */}
        {/* ================================================= */}
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")} aria-label={t("searchPlaceholder")}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400"
            />
          </div>
          <select
            aria-label={t("status")}
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "ALL" | PlacementBillingStatus,
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none"
          >
            <option value="ALL">{t("allStatuses")}</option>
            <option value="draft">{t("draft")}</option>
            <option value="issued">{t("issued")}</option>
            <option value="paid">{t("paid")}</option>
            <option value="partially_refunded">{t("partiallyRefunded")}</option>
            <option value="refunded">{t("refunded")}</option>
            <option value="cancelled">{t("cancelled")}</option>
          </select>
        </div>
        {/* ================================================= */}
        {/* BILLING TABLE */}
        {/* ================================================= */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">{t("invoice")}</th>
                  <th className="px-5 py-4">{t("company")}</th>
                  <th className="px-5 py-4">{t("candidate")}</th>
                  <th className="px-5 py-4">{t("position")}</th>
                  <th className="px-5 py-4">{t("amount")}</th>
                  <th className="px-5 py-4">{t("netPaid")}</th>
                  <th className="px-5 py-4">{t("status")}</th>
                  <th className="px-5 py-4">{t("dueDate")}</th>
                  <th className="px-5 py-4 text-right">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {/* ========================================= */}
                {/* LOADING */}
                {/* ========================================= */}
                {isLoading && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-20 text-center text-sm text-slate-500"
                    >
                      {t("loading")}
                    </td>
                  </tr>
                )}
                {/* ========================================= */}
                {/* EMPTY */}
                {/* ========================================= */}
                {!isLoading && billings.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-20 text-center text-sm text-slate-500"
                    >
                      {t("empty")}
                    </td>
                  </tr>
                )}
                {/* ========================================= */}
                {/* ROWS */}
                {/* ========================================= */}
                {!isLoading &&
                  billings.map((billing) => {
                    const effectivePaidAmount =
                      billing.paidAmount > 0
                        ? billing.paidAmount
                        : ["paid", "partially_refunded", "refunded"].includes(
                              billing.status,
                            )
                          ? billing.totalAmount
                          : 0;
                    const refundedAmount = billing.refundedAmount || 0;
                    const effectiveNetPaid =
                      billing.netPaidAmount > 0
                        ? billing.netPaidAmount
                        : Math.max(effectivePaidAmount - refundedAmount, 0);
                    const refundableAmount = Math.max(
                      effectivePaidAmount - refundedAmount,
                      0,
                    );
                    return (
                      <tr
                        key={billing.billingId}
                        className="border-t border-slate-100 align-middle"
                      >
                        {/* =============================== */}
                        {/* INVOICE */}
                        {/* =============================== */}
                        <td className="px-5 py-4">
                          <p className="font-mono font-semibold text-slate-950">
                            {billing.invoiceNumber || billing.billingId}
                          </p>
                          {billing.invoiceNumber && (
                            <p className="mt-1 font-mono text-xs text-slate-500">
                              {billing.billingId}
                            </p>
                          )}
                          <p className="mt-1 font-mono text-xs text-slate-400">
                            {billing.recruitId}
                          </p>
                        </td>
                        {/* =============================== */}
                        {/* COMPANY */}
                        {/* =============================== */}
                        <td className="px-5 py-4">{billing.companyName}</td>
                        {/* =============================== */}
                        {/* CANDIDATE */}
                        {/* =============================== */}
                        <td className="px-5 py-4 font-medium">
                          {billing.candidateName}
                        </td>
                        {/* =============================== */}
                        {/* POSITION */}
                        {/* =============================== */}
                        <td className="max-w-[220px] px-5 py-4">
                          {billing.jobTitle}
                        </td>
                        {/* =============================== */}
                        {/* ORIGINAL TOTAL */}
                        {/* =============================== */}
                        <td className="px-5 py-4 font-semibold">
                          {money(billing.totalAmount)}
                        </td>
                        {/* =============================== */}
                        {/* NET PAID */}
                        {/* =============================== */}
                        <td className="px-5 py-4">
                          {["paid", "partially_refunded", "refunded"].includes(
                            billing.status,
                          ) ? (
                            <div>
                              <p className="font-semibold text-slate-950">
                                {money(effectiveNetPaid)}
                              </p>
                              {refundedAmount > 0 && (
                                <p className="mt-1 text-xs text-red-500">
                                  {t("refundedAmountInline", { amount: money(refundedAmount) })}
                                </p>
                              )}
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                        {/* =============================== */}
                        {/* STATUS */}
                        {/* =============================== */}
                        <td className="px-5 py-4">
                          <StatusBadge status={billing.status} />
                        </td>
                        {/* =============================== */}
                        {/* DUE DATE - JAPAN TIME */}
                        {/* =============================== */}
                        <td className="px-5 py-4">
                          {formatJapanDate(billing.dueDate)}
                        </td>
                        {/* =============================== */}
                        {/* ACTIONS */}
                        {/* =============================== */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setViewingBilling(billing)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                            >
                              <Eye className="h-4 w-4" />
                              {t("view")}
                            </button>
                            {billing.status === "draft" && (
                              <>
                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() => setEditingBilling(billing)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
                                >
                                  <Pencil className="h-4 w-4" />
                                  {t("edit")}
                                </button>
                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() =>
                                    handleIssueBilling(billing.billingId)
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                                >
                                  <Send className="h-4 w-4" />
                                  {t("issue")}
                                </button>
                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() =>
                                    handleCancelBilling(billing.billingId)
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                >
                                  <XCircle className="h-4 w-4" />
                                  {t("cancel")}
                                </button>
                              </>
                            )}
                            {billing.status === "issued" && (
                              <>
                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() =>
                                    handleMarkPaid(billing.billingId)
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                  {t("markPaid")}
                                </button>
                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() =>
                                    handleCancelBilling(billing.billingId)
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                >
                                  <XCircle className="h-4 w-4" />
                                  {t("cancel")}
                                </button>
                              </>
                            )}
                            {["paid", "partially_refunded"].includes(
                              billing.status,
                            ) &&
                              refundableAmount > 0 && (
                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() => openRefundModal(billing)}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                  {billing.status === "partially_refunded"
                                    ? t("refundAgain")
                                    : t("refund")}
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <BillingDetailsModal
        billing={viewingBilling}
        onClose={() => setViewingBilling(null)}
      />
      <BillingEditModal
        billing={editingBilling}
        loading={isSaving}
        onClose={() => setEditingBilling(null)}
        onSubmit={updateBilling}
      />
      <RefundBillingModal
        billing={refundingBilling}
        loading={isSaving}
        onClose={() => setRefundingBilling(null)}
        onSubmit={refundBilling}
      />
      {action && <BillingActionModal
        key={`${action.type}-${action.billingId}`}
        action={action.type}
        billingId={action.billingId}
        loading={isSaving}
        onClose={() => setAction(null)}
        onConfirm={(reason) => {
          if (action.type === "cancel") cancelBilling(action.billingId, reason);
          else if (action.type === "issue") issueBilling(action.billingId);
          else markPaid(action.billingId);
          setAction(null);
        }}
      />}
    </>
  );
}
// ======================================================
// SUMMARY CARD
// ======================================================
function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  );
}
// ======================================================
// MONEY CARD
// ======================================================
function MoneyCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const format = useFormatter();
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">
        {format.number(value, { style: "currency", currency: "JPY", maximumFractionDigits: 0 })}
      </p>
    </div>
  );
}
// ======================================================
// STATUS BADGE
// ======================================================
function StatusBadge({ status }: { status: PlacementBillingStatus }) {
  const t = useTranslations("adminPlacementBillings");
  const classes: Record<PlacementBillingStatus, string> = {
    draft: "bg-slate-100 text-slate-700",
    issued: "bg-blue-50 text-blue-700",
    paid: "bg-emerald-50 text-emerald-700",
    partially_refunded: "bg-amber-50 text-amber-700",
    refunded: "bg-red-50 text-red-700",
    cancelled: "bg-slate-100 text-slate-500",
  };
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classes[status]}`}
    >
      {t(`statuses.${status}`)}
    </span>
  );
}
