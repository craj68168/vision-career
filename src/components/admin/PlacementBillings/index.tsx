"use client";

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
  //
  // Compatibility:
  //
  // Your existing PB-529BC3E3 became PAID before
  // paidAmount/refundedAmount/netPaidAmount were added.
  //
  // So if paidAmount is still 0 but status is paid,
  // use totalAmount as the original paid amount.
  // ====================================================

  const openRefundModal = (billing: PlacementBilling) => {
    const effectivePaidAmount =
      billing.paidAmount > 0 ? billing.paidAmount : billing.totalAmount;

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

  const handleCancelBilling = (billingId: string) => {
    const reason = window.prompt("Enter cancellation reason:");

    if (!reason?.trim()) {
      return;
    }

    cancelBilling(billingId, reason.trim());
  };

  // ====================================================
  // ISSUE
  // ====================================================

  const handleIssueBilling = (billingId: string) => {
    const confirmed = window.confirm("Issue this billing?");

    if (!confirmed) {
      return;
    }

    issueBilling(billingId);
  };

  // ====================================================
  // MARK PAID
  // ====================================================

  const handleMarkPaid = (billingId: string) => {
    const confirmed = window.confirm("Mark this billing as paid?");

    if (!confirmed) {
      return;
    }

    markPaid(billingId);
  };

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-10">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">
              Placement Billings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage billing generated from successful candidate placements.
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
            Refresh
          </button>
        </div>

        {/* ================================================= */}
        {/* STATUS SUMMARY */}
        {/* ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <SummaryCard label="Total Billings" value={summary?.total ?? 0} />

          <SummaryCard label="Draft" value={summary?.draft ?? 0} />

          <SummaryCard label="Issued" value={summary?.issued ?? 0} />

          <SummaryCard label="Paid" value={summary?.paid ?? 0} />

          <SummaryCard
            label="Partial Refund"
            value={summary?.partiallyRefunded ?? 0}
          />

          <SummaryCard label="Refunded" value={summary?.refunded ?? 0} />
        </div>

        {/* ================================================= */}
        {/* FINANCIAL SUMMARY */}
        {/* ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MoneyCard label="Total Billed" value={summary?.billedTotal ?? 0} />

          <MoneyCard label="Net Paid" value={summary?.paidTotal ?? 0} />

          <MoneyCard label="Refunded" value={summary?.refundedTotal ?? 0} />

          <MoneyCard
            label="Outstanding"
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
              placeholder="Search billing, company, candidate..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "ALL" | PlacementBillingStatus,
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none"
          >
            <option value="ALL">All statuses</option>

            <option value="draft">Draft</option>

            <option value="issued">Issued</option>

            <option value="paid">Paid</option>

            <option value="partially_refunded">Partially Refunded</option>

            <option value="refunded">Refunded</option>

            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* ================================================= */}
        {/* BILLING TABLE */}
        {/* ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Billing</th>

                  <th className="px-5 py-4">Company</th>

                  <th className="px-5 py-4">Candidate</th>

                  <th className="px-5 py-4">Position</th>

                  <th className="px-5 py-4">Amount</th>

                  <th className="px-5 py-4">Net Paid</th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4">Due Date</th>

                  <th className="px-5 py-4 text-right">Actions</th>
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
                      Loading placement billings...
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
                      No placement billings found.
                    </td>
                  </tr>
                )}

                {/* ========================================= */}
                {/* ROWS */}
                {/* ========================================= */}

                {!isLoading &&
                  billings.map((billing) => {
                    // =====================================
                    // LEGACY PAID RECORD COMPATIBILITY
                    // =====================================

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
                        {/* BILLING */}

                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-950">
                            {billing.billingId}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {billing.recruitId}
                          </p>
                        </td>

                        {/* COMPANY */}

                        <td className="px-5 py-4">{billing.companyName}</td>

                        {/* CANDIDATE */}

                        <td className="px-5 py-4 font-medium">
                          {billing.candidateName}
                        </td>

                        {/* POSITION */}

                        <td className="max-w-[220px] px-5 py-4">
                          {billing.jobTitle}
                        </td>

                        {/* ORIGINAL TOTAL */}

                        <td className="px-5 py-4 font-semibold">
                          ¥{billing.totalAmount.toLocaleString()}
                        </td>

                        {/* NET PAID */}

                        <td className="px-5 py-4">
                          {["paid", "partially_refunded", "refunded"].includes(
                            billing.status,
                          ) ? (
                            <div>
                              <p className="font-semibold text-slate-950">
                                ¥{effectiveNetPaid.toLocaleString()}
                              </p>

                              {refundedAmount > 0 && (
                                <p className="mt-1 text-xs text-red-500">
                                  Refunded: ¥{refundedAmount.toLocaleString()}
                                </p>
                              )}
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <StatusBadge status={billing.status} />
                        </td>

                        {/* DUE DATE */}

                        <td className="px-5 py-4">
                          {billing.dueDate
                            ? new Date(billing.dueDate).toLocaleDateString()
                            : "-"}
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() => setViewingBilling(billing)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>

                            {/* ================================= */}
                            {/* DRAFT ACTIONS */}
                            {/* ================================= */}

                            {billing.status === "draft" && (
                              <>
                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() => setEditingBilling(billing)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
                                >
                                  <Pencil className="h-4 w-4" />
                                  Edit
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
                                  Issue
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
                                  Cancel
                                </button>
                              </>
                            )}

                            {/* ================================= */}
                            {/* ISSUED ACTIONS */}
                            {/* ================================= */}

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
                                  Mark Paid
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
                                  Cancel
                                </button>
                              </>
                            )}

                            {/* ================================= */}
                            {/* REFUND ACTION */}
                            {/* ================================= */}

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
                                    ? "Refund Again"
                                    : "Refund"}
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

      {/* ================================================= */}
      {/* DETAILS MODAL */}
      {/* ================================================= */}

      <BillingDetailsModal
        billing={viewingBilling}
        onClose={() => setViewingBilling(null)}
      />

      {/* ================================================= */}
      {/* EDIT MODAL */}
      {/* ================================================= */}

      <BillingEditModal
        billing={editingBilling}
        loading={isSaving}
        onClose={() => setEditingBilling(null)}
        onSubmit={updateBilling}
      />

      {/* ================================================= */}
      {/* REFUND MODAL */}
      {/* ================================================= */}

      <RefundBillingModal
        billing={refundingBilling}
        loading={isSaving}
        onClose={() => setRefundingBilling(null)}
        onSubmit={refundBilling}
      />
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
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-2xl font-bold text-slate-950">
        ¥{value.toLocaleString()}
      </p>
    </div>
  );
}

// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({ status }: { status: PlacementBillingStatus }) {
  const classes: Record<PlacementBillingStatus, string> = {
    draft: "bg-slate-100 text-slate-700",

    issued: "bg-blue-50 text-blue-700",

    paid: "bg-emerald-50 text-emerald-700",

    partially_refunded: "bg-amber-50 text-amber-700",

    refunded: "bg-red-50 text-red-700",

    cancelled: "bg-slate-100 text-slate-500",
  };

  const labels: Record<PlacementBillingStatus, string> = {
    draft: "Draft",

    issued: "Issued",

    paid: "Paid",

    partially_refunded: "Partially Refunded",

    refunded: "Refunded",

    cancelled: "Cancelled",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classes[status]}`}
    >
      {labels[status]}
    </span>
  );
}
