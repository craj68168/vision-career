"use client";

import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Eye,
  ReceiptText,
  RefreshCw,
  Search,
} from "lucide-react";

import { useProviderBilling } from "./hook";

import ProviderBillingDetailsModal from "./ProviderBillingDetailsModal";

import type { ProviderPlacementBillingStatus } from "./types";

type Props = {
  lang: string;

  refreshVersion: number;
};

export default function Billing({ lang, refreshVersion }: Props) {
  const {
    search,

    setSearch,

    statusFilter,

    setStatusFilter,

    viewingBilling,

    setViewingBilling,

    billingsQuery,

    summary,

    filteredBillings,
  } = useProviderBilling({
    refreshVersion,
  });

  return (
    <>
      <section className="mt-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              {lang === "ja" ? "採用請求" : "Placement Billing"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {lang === "ja"
                ? "発行済みの採用請求、支払い状況、返金状況を確認できます。"
                : "Review issued placement invoices, payment status, and refunds."}
            </p>
          </div>

          <button
            type="button"
            disabled={billingsQuery.isFetching}
            onClick={() => void billingsQuery.refetch()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                billingsQuery.isFetching ? "animate-spin" : ""
              }`}
            />

            {lang === "ja" ? "更新" : "Refresh"}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MoneyCard
            label={lang === "ja" ? "請求総額" : "Total Billed"}
            value={summary?.billedTotal || 0}
            icon={<ReceiptText className="h-5 w-5" />}
          />

          <MoneyCard
            label={lang === "ja" ? "未払額" : "Outstanding"}
            value={summary?.outstandingTotal || 0}
            icon={<CalendarDays className="h-5 w-5" />}
          />

          <MoneyCard
            label={lang === "ja" ? "支払済" : "Net Paid"}
            value={summary?.paidTotal || 0}
            icon={<CheckCircle2 className="h-5 w-5" />}
          />

          <MoneyCard
            label={lang === "ja" ? "期限超過" : "Overdue"}
            value={summary?.overdueTotal || 0}
            icon={<AlertTriangle className="h-5 w-5" />}
          />
        </div>

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                lang === "ja"
                  ? "請求、候補者、職種を検索..."
                  : "Search invoice, candidate, position..."
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-indigo-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "ALL" | ProviderPlacementBillingStatus,
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none"
          >
            <option value="ALL">
              {lang === "ja" ? "すべて" : "All statuses"}
            </option>

            <option value="issued">Issued</option>

            <option value="paid">Paid</option>

            <option value="partially_refunded">Partially Refunded</option>

            <option value="refunded">Refunded</option>

            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Invoice</th>

                  <th className="px-5 py-4">Candidate</th>

                  <th className="px-5 py-4">Position</th>

                  <th className="px-5 py-4">Total</th>

                  <th className="px-5 py-4">Amount Due</th>

                  <th className="px-5 py-4">Due Date</th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {billingsQuery.isLoading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-sm text-slate-500"
                    >
                      {lang === "ja"
                        ? "請求を読み込み中..."
                        : "Loading placement billings..."}
                    </td>
                  </tr>
                )}

                {!billingsQuery.isLoading && filteredBillings.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-sm text-slate-500"
                    >
                      {lang === "ja"
                        ? "発行済みの請求はありません。"
                        : "No issued placement invoices found."}
                    </td>
                  </tr>
                )}

                {!billingsQuery.isLoading &&
                  filteredBillings.map((billing) => (
                    <tr
                      key={billing.billingId}
                      className="border-t border-slate-100"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-950">
                          {billing.billingId}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {billing.recruitId}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-900">
                        {billing.candidateName}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {billing.jobTitle}
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        {formatMoney(billing.totalAmount)}
                      </td>

                      <td className="px-5 py-4">
                        {billing.status === "issued"
                          ? formatMoney(billing.amountDue)
                          : "-"}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {formatDate(billing.dueDate)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={billing.status} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setViewingBilling(billing)}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                          <Eye className="h-4 w-4" />

                          {lang === "ja" ? "詳細" : "View Invoice"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ProviderBillingDetailsModal
        billing={viewingBilling}
        lang={lang}
        onClose={() => setViewingBilling(null)}
      />
    </>
  );
}

// ======================================================
// HELPERS
// ======================================================

function MoneyCard({
  label,
  value,
  icon,
}: {
  label: string;

  value: number;

  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{label}</p>

        <div className="text-slate-400">{icon}</div>
      </div>

      <p className="mt-3 text-2xl font-bold text-slate-950">
        {formatMoney(value)}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: ProviderPlacementBillingStatus }) {
  const classes: Record<ProviderPlacementBillingStatus, string> = {
    issued: "bg-blue-50 text-blue-700",

    paid: "bg-emerald-50 text-emerald-700",

    partially_refunded: "bg-amber-50 text-amber-700",

    refunded: "bg-violet-50 text-violet-700",

    cancelled: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${classes[status]}`}
    >
      {status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase())}
    </span>
  );
}

function formatMoney(value: number) {
  return `¥${Number(value || 0).toLocaleString()}`;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",

    month: "short",

    day: "numeric",
  }).format(date);
}
