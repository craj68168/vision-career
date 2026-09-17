"use client";

import {
  CheckCircle2,
  Eye,
  Pencil,
  RefreshCw,
  Search,
  Send,
  XCircle,
} from "lucide-react";

import BillingDetailsModal from "./BillingDetailsModal";
import BillingEditModal from "./BillingEditModal";

import { usePlacementBillings } from "./hook";

import type { PlacementBillingStatus } from "./types";

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

    isLoading,
    isFetching,
    isSaving,

    refresh,

    updateBilling,
    issueBilling,
    markPaid,
    cancelBilling,
  } = usePlacementBillings();

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-10">
        {/* HEADER */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Placement Billings</h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage billing generated from successful candidate placements.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* SUMMARY */}

        <div className="grid gap-4 md:grid-cols-4">
          <SummaryCard label="Total Billings" value={summary?.total ?? 0} />

          <SummaryCard label="Draft" value={summary?.draft ?? 0} />

          <SummaryCard label="Issued" value={summary?.issued ?? 0} />

          <SummaryCard label="Paid" value={summary?.paid ?? 0} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MoneyCard label="Total Billed" value={summary?.billedTotal ?? 0} />

          <MoneyCard label="Paid" value={summary?.paidTotal ?? 0} />

          <MoneyCard
            label="Outstanding"
            value={summary?.outstandingTotal ?? 0}
          />
        </div>

        {/* SEARCH */}

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_200px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search billing, company, candidate..."
              className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "ALL" | PlacementBillingStatus,
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-3"
          >
            <option value="ALL">All statuses</option>

            <option value="draft">Draft</option>

            <option value="issued">Issued</option>

            <option value="paid">Paid</option>

            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Billing</th>

                  <th className="px-5 py-4">Company</th>

                  <th className="px-5 py-4">Candidate</th>

                  <th className="px-5 py-4">Position</th>

                  <th className="px-5 py-4">Amount</th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4">Due Date</th>

                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-slate-500"
                    >
                      Loading placement billings...
                    </td>
                  </tr>
                ) : billings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-slate-500"
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
                      <td className="px-5 py-4 font-medium">
                        {billing.billingId}
                      </td>

                      <td className="px-5 py-4">{billing.companyName}</td>

                      <td className="px-5 py-4">{billing.candidateName}</td>

                      <td className="px-5 py-4">{billing.jobTitle}</td>

                      <td className="px-5 py-4 font-semibold">
                        ¥{billing.totalAmount.toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={billing.status} />
                      </td>

                      <td className="px-5 py-4">
                        {billing.dueDate
                          ? new Date(billing.dueDate).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingBilling(billing)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>

                          {billing.status === "draft" && (
                            <>
                              <button
                                type="button"
                                onClick={() => setEditingBilling(billing)}
                                className="inline-flex items-center gap-1 rounded-lg bg-slate-950 px-3 py-2 text-sm text-white"
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
                                className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white"
                              >
                                <Send className="h-4 w-4" />
                                Issue
                              </button>
                            </>
                          )}

                          {billing.status === "issued" && (
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
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Mark Paid
                            </button>
                          )}

                          {["draft", "issued"].includes(billing.status) && (
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() => {
                                const reason = window.prompt(
                                  "Enter cancellation reason:",
                                );

                                if (reason?.trim()) {
                                  cancelBilling(
                                    billing.billingId,
                                    reason.trim(),
                                  );
                                }
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"
                            >
                              <XCircle className="h-4 w-4" />
                              Cancel
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
    </>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function MoneyCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-2xl font-bold">¥{value.toLocaleString()}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: PlacementBillingStatus }) {
  const classes = {
    draft: "bg-slate-100 text-slate-700",

    issued: "bg-blue-50 text-blue-700",

    paid: "bg-emerald-50 text-emerald-700",

    cancelled: "bg-red-50 text-red-700",

    refunded: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${classes[status]}`}
    >
      {status}
    </span>
  );
}
