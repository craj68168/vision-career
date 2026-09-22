"use client";

import {
  CheckCircle2,
  Eye,
  Pencil,
  RefreshCw,
  Search,
  Send,
} from "lucide-react";

import BillingDetails from "./BillingDetails";

import BillingEditModal from "./BillingEditModal";

import {
  formatBillingDate,
  formatMoney,
  getBillingStatusClass,
  getBillingStatusLabel,
} from "./helper";

import { useStaffPlacementBillings } from "./hook";

import type { PlacementBillingStatus } from "./types";

export default function StaffPlacementBillings() {
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

    isLoading,
    isFetching,
    isDetailsLoading,
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
          You do not have permission to view placement billings.
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
            <h1 className="text-3xl font-bold text-slate-950">
              Placement Billings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage billing generated from successful placements.
            </p>
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
            Refresh
          </button>
        </div>

        {/* STATUS SUMMARY */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Summary label="Total" value={summary?.total ?? 0} />

          <Summary label="Draft" value={summary?.draft ?? 0} />

          <Summary label="Issued" value={summary?.issued ?? 0} />

          <Summary label="Paid" value={summary?.paid ?? 0} />

          <Summary
            label="Partial Refund"
            value={summary?.partiallyRefunded ?? 0}
          />

          <Summary label="Refunded" value={summary?.refunded ?? 0} />
        </div>

        {/* MONEY */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MoneySummary
            label="Total Billed"
            value={summary?.billedTotal ?? 0}
          />

          <MoneySummary label="Net Paid" value={summary?.paidTotal ?? 0} />

          <MoneySummary label="Refunded" value={summary?.refundedTotal ?? 0} />

          <MoneySummary
            label="Outstanding"
            value={summary?.outstandingTotal ?? 0}
          />
        </div>

        {!canManage && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            Your account has billing view access only. Editing, issuing and
            marking payments requires the billing:manage permission.
          </div>
        )}

        {/* FILTER */}

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search billing, company, candidate..."
              className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none"
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
            <option value="ALL">All statuses</option>

            <option value="draft">Draft</option>

            <option value="issued">Issued</option>

            <option value="paid">Paid</option>

            <option value="partially_refunded">Partially Refunded</option>

            <option value="refunded">Refunded</option>

            <option value="cancelled">Cancelled</option>
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
                  <th className="px-5 py-4">Billing</th>

                  <th className="px-5 py-4">Company</th>

                  <th className="px-5 py-4">Candidate</th>

                  <th className="px-5 py-4">Position</th>

                  <th className="px-5 py-4">Total</th>

                  <th className="px-5 py-4">Net Paid</th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4">Due Date</th>

                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-16 text-center text-sm text-slate-500"
                    >
                      Loading placement billings...
                    </td>
                  </tr>
                ) : billings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-16 text-center text-sm text-slate-500"
                    >
                      No placement billings found.
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
                          {billing.recruitId}
                        </p>
                      </td>

                      <td className="px-5 py-4">{billing.companyName}</td>

                      <td className="px-5 py-4 font-medium">
                        {billing.candidateName}
                      </td>

                      <td className="px-5 py-4">{billing.jobTitle}</td>

                      <td className="px-5 py-4 font-semibold">
                        {formatMoney(billing.totalAmount, billing.currency)}
                      </td>

                      <td className="px-5 py-4">
                        {["paid", "partially_refunded", "refunded"].includes(
                          billing.status,
                        )
                          ? formatMoney(billing.netPaidAmount, billing.currency)
                          : "-"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getBillingStatusClass(
                            billing.status,
                          )}`}
                        >
                          {getBillingStatusLabel(billing.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {formatBillingDate(billing.dueDate)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setViewingBillingId(billing.billingId)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          >
                            <Eye className="h-4 w-4" />
                            View
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
                                Edit
                              </button>

                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => {
                                  if (window.confirm("Issue this billing?")) {
                                    issueBilling(billing.billingId);
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                              >
                                <Send className="h-4 w-4" />
                                Issue
                              </button>
                            </>
                          )}

                          {canManage && billing.status === "issued" && (
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() => {
                                if (
                                  window.confirm("Mark this billing as paid?")
                                ) {
                                  markPaid(billing.billingId);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Mark Paid
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

      {viewingBillingId && (
        <BillingDetails
          billing={viewingBilling}
          loading={isDetailsLoading}
          onClose={() => setViewingBillingId(null)}
        />
      )}

      <BillingEditModal
        billing={editingBilling}
        loading={isSaving}
        onClose={() => setEditingBilling(null)}
        onSubmit={updateBilling}
      />
    </>
  );
}

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

function MoneySummary({
  label,
  value,
}: {
  label: string;

  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-2xl font-bold">{formatMoney(value)}</p>
    </div>
  );
}
