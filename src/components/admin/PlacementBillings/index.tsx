"use client";
import type { ComponentType } from "react";
import { useState } from "react";
import { useTranslations, useFormatter } from "next-intl";
import BillingActionModal from "./BillingActionModal";
import {
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Eye,
  FileText,
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

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

const selectClass =
  "h-9 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white";
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
  const setStatusSummary = (status: "ALL" | PlacementBillingStatus) => {
    setStatusFilter(status);
  };
  return (
    <>
      <div className="min-w-0 space-y-4">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-zinc-950 dark:text-white sm:text-2xl">
              {t("title")}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {t("description")}
            </p>
          </div>
          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refresh()}
            className={`inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          <SummaryCard
            label={t("totalBillings")}
            value={summary?.total ?? 0}
            icon={FileText}
            isActive={statusFilter === "ALL"}
            onClick={() => setStatusSummary("ALL")}
          />
          <SummaryCard
            label={t("draft")}
            value={summary?.draft ?? 0}
            icon={Pencil}
            isActive={statusFilter === "draft"}
            onClick={() => setStatusSummary("draft")}
          />
          <SummaryCard
            label={t("issued")}
            value={summary?.issued ?? 0}
            icon={Send}
            isActive={statusFilter === "issued"}
            onClick={() => setStatusSummary("issued")}
          />
          <SummaryCard
            label={t("paid")}
            value={summary?.paid ?? 0}
            icon={CheckCircle2}
            isActive={statusFilter === "paid"}
            onClick={() => setStatusSummary("paid")}
          />
          <SummaryCard
            label={t("partiallyRefunded")}
            value={summary?.partiallyRefunded ?? 0}
            icon={RotateCcw}
            isActive={statusFilter === "partially_refunded"}
            onClick={() => setStatusSummary("partially_refunded")}
          />
          <SummaryCard
            label={t("refunded")}
            value={summary?.refunded ?? 0}
            icon={XCircle}
            isActive={statusFilter === "refunded"}
            onClick={() => setStatusSummary("refunded")}
          />
        </div>
        {/* ================================================= */}
        {/* FINANCIAL SUMMARY */}
        {/* ================================================= */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MoneyCard label={t("totalBilled")} value={summary?.billedTotal ?? 0} icon={CircleDollarSign} />
          <MoneyCard label={t("netPaid")} value={summary?.paidTotal ?? 0} icon={CheckCircle2} />
          <MoneyCard label={t("refunded")} value={summary?.refundedTotal ?? 0} icon={RotateCcw} />
          <MoneyCard
            label={t("outstanding")}
            value={summary?.outstandingTotal ?? 0}
            icon={Clock3}
          />
        </div>
        {/* ================================================= */}
        {/* SEARCH / FILTER */}
        {/* ================================================= */}
        <div className="grid gap-2.5 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")} aria-label={t("searchPlaceholder")}
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
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
            className={selectClass}
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
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-left">
              <thead className="bg-zinc-50 text-xs text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-2 font-medium">{t("invoice")}</th>
                  <th className="px-4 py-2 font-medium">{t("company")}</th>
                  <th className="px-4 py-2 font-medium">{t("candidate")}</th>
                  <th className="px-4 py-2 font-medium">{t("position")}</th>
                  <th className="px-4 py-2 font-medium">{t("amount")}</th>
                  <th className="px-4 py-2 font-medium">{t("netPaid")}</th>
                  <th className="px-4 py-2 font-medium">{t("status")}</th>
                  <th className="px-4 py-2 font-medium">{t("dueDate")}</th>
                  <th className="px-4 py-2 text-right font-medium">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                {/* ========================================= */}
                {/* LOADING */}
                {/* ========================================= */}
                {isLoading && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-14 text-center text-sm text-zinc-500 dark:text-zinc-400"
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
                      className="py-14 text-center text-sm text-zinc-500 dark:text-zinc-400"
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
                        className="align-middle transition hover:bg-zinc-50 dark:hover:bg-white/5"
                      >
                        {/* =============================== */}
                        {/* INVOICE */}
                        {/* =============================== */}
                        <td className="px-4 py-2">
                          <p className="font-mono text-sm font-semibold text-zinc-950 dark:text-white">
                            {billing.invoiceNumber || billing.billingId}
                          </p>
                          {billing.invoiceNumber && (
                            <p className="mt-0.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                              {billing.billingId}
                            </p>
                          )}
                          <p className="mt-0.5 font-mono text-xs text-zinc-400 dark:text-zinc-500">
                            {billing.recruitId}
                          </p>
                        </td>
                        {/* =============================== */}
                        {/* COMPANY */}
                        {/* =============================== */}
                        <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">{billing.companyName}</td>
                        {/* =============================== */}
                        {/* CANDIDATE */}
                        {/* =============================== */}
                        <td className="px-4 py-2 text-sm font-medium text-zinc-950 dark:text-white">
                          {billing.candidateName}
                        </td>
                        {/* =============================== */}
                        {/* POSITION */}
                        {/* =============================== */}
                        <td className="max-w-[220px] px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">
                          {billing.jobTitle}
                        </td>
                        {/* =============================== */}
                        {/* ORIGINAL TOTAL */}
                        {/* =============================== */}
                        <td className="px-4 py-2 text-sm font-semibold text-zinc-950 dark:text-white">
                          {money(billing.totalAmount)}
                        </td>
                        {/* =============================== */}
                        {/* NET PAID */}
                        {/* =============================== */}
                        <td className="px-4 py-2 text-sm">
                          {["paid", "partially_refunded", "refunded"].includes(
                            billing.status,
                          ) ? (
                            <div>
                              <p className="font-semibold text-zinc-950 dark:text-white">
                                {money(effectiveNetPaid)}
                              </p>
                              {refundedAmount > 0 && (
                                <p className="mt-0.5 text-xs text-red-500 dark:text-red-300">
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
                        <td className="px-4 py-2">
                          <StatusBadge status={billing.status} />
                        </td>
                        {/* =============================== */}
                        {/* DUE DATE - JAPAN TIME */}
                        {/* =============================== */}
                        <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">
                          {formatJapanDate(billing.dueDate)}
                        </td>
                        {/* =============================== */}
                        {/* ACTIONS */}
                        {/* =============================== */}
                        <td className="px-4 py-2">
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setViewingBilling(billing)}
                              className={`inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
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
                                  className={`inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-zinc-950 px-3 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 ${focusRing}`}
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
                                  className={`inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
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
                                  className={`inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10 ${focusRing}`}
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
                                  className={`inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
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
                                  className={`inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10 ${focusRing}`}
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
                                  className={`inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10 ${focusRing}`}
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
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`min-w-0 cursor-pointer rounded-lg border bg-white p-3 text-left shadow-sm transition hover:border-emerald-500/50 hover:shadow-md dark:bg-zinc-900 ${focusRing} ${
        isActive
          ? "border-emerald-500 ring-2 ring-emerald-500/20"
          : "border-zinc-200 dark:border-white/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="mt-0.5 text-xl font-semibold leading-tight text-zinc-950 dark:text-white">{value}</p>
        </div>
      </div>
    </button>
  );
}
// ======================================================
// MONEY CARD
// ======================================================
function MoneyCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
}) {
  const format = useFormatter();
  return (
    <div className="min-w-0 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="mt-0.5 truncate text-lg font-semibold leading-tight text-zinc-950 dark:text-white">
            {format.number(value, { style: "currency", currency: "JPY", maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>
    </div>
  );
}
// ======================================================
// STATUS BADGE
// ======================================================
function StatusBadge({ status }: { status: PlacementBillingStatus }) {
  const t = useTranslations("adminPlacementBillings");
  const classes: Record<PlacementBillingStatus, string> = {
    draft: "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300",
    issued: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300",
    paid: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
    partially_refunded: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
    refunded: "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300",
    cancelled: "border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-white/10 dark:bg-white/10 dark:text-zinc-400",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${classes[status]}`}
    >
      {t(`statuses.${status}`)}
    </span>
  );
}
