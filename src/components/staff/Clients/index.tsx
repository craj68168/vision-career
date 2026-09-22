"use client";

import { Eye, RefreshCw, Search } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { getCurrentStaff } from "@/components/auth/Staff/api";

import {
  getProviderStatusClass,
  getReviewClass,
  getReviewLabel,
} from "./helper";

import { useStaffProviders } from "./hook";

import ClientDetails from "./ClientDetails";
import ReviewClientModal from "./ReviewClientModal";

import type { ProviderReviewStatus, ProviderStatus } from "./types";

export default function StaffClients() {
  const {
    providers,
    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    reviewFilter,
    setReviewFilter,

    viewingProvider,

    reviewingProvider,

    isLoading,
    isFetching,
    isReviewing,

    openView,
    closeView,

    openReview,
    closeReview,

    submitReview,

    refetch,
  } = useStaffProviders();

  // ====================================================
  // CURRENT STAFF
  // ====================================================

  const staffQuery = useQuery({
    queryKey: ["current-staff"],

    queryFn: getCurrentStaff,
  });

  const canManage =
    staffQuery.data?.data.permissions.includes("providers:manage") ?? false;

  return (
    <>
      <main className="mx-auto w-full max-w-7xl space-y-6 px-6 py-10">
        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Clients</h1>

            <p className="mt-1 text-sm text-slate-500">
              Review registered client companies and Provider information.
            </p>
          </div>

          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refetch()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* SUMMARY */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <Summary label="Total" value={summary?.total ?? 0} />

          <Summary label="Active" value={summary?.active ?? 0} />

          <Summary label="Inactive" value={summary?.inactive ?? 0} />

          <Summary label="Not Reviewed" value={summary?.notReviewed ?? 0} />

          <Summary label="Reviewed" value={summary?.reviewed ?? 0} />

          <Summary
            label="Needs Attention"
            value={summary?.needsAttention ?? 0}
          />
        </div>

        {/* FILTERS */}

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search client, company, email or industry..."
              className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "ALL" | ProviderStatus)
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4"
          >
            <option value="ALL">All Account Statuses</option>

            <option value="active">Active</option>

            <option value="inactive">Inactive</option>

            <option value="suspended">Suspended</option>
          </select>

          <select
            value={reviewFilter}
            onChange={(event) =>
              setReviewFilter(
                event.target.value as "ALL" | ProviderReviewStatus,
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4"
          >
            <option value="ALL">All Staff Reviews</option>

            <option value="NOT_REVIEWED">Not Reviewed</option>

            <option value="REVIEWED">Reviewed</option>

            <option value="NEEDS_ATTENTION">Needs Attention</option>
          </select>
        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">ID</th>

                  <th className="px-5 py-4">Provider</th>

                  <th className="px-5 py-4">Company</th>

                  <th className="px-5 py-4">Account</th>

                  <th className="px-5 py-4">Staff Review</th>

                  <th className="px-5 py-4 text-center">Vacancies</th>

                  <th className="px-5 py-4 text-center">Applications</th>

                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-slate-500"
                    >
                      Loading client companies...
                    </td>
                  </tr>
                ) : providers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-slate-500"
                    >
                      No clients found.
                    </td>
                  </tr>
                ) : (
                  providers.map((provider) => (
                    <tr key={provider.registerId} className="hover:bg-slate-50">
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {provider.registerId}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold">{provider.name}</p>

                        <p className="mt-1 text-xs text-slate-500">
                          {provider.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {provider.companyName}

                        {provider.industry && (
                          <p className="mt-1 text-xs text-slate-500">
                            {provider.industry}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getProviderStatusClass(
                            provider.status,
                          )}`}
                        >
                          {provider.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getReviewClass(
                            provider.staffReview.status,
                          )}`}
                        >
                          {getReviewLabel(provider.staffReview.status)}
                        </span>

                        {provider.staffReview.status === "NEEDS_ATTENTION" &&
                          provider.staffReview.note && (
                            <p className="mt-1 max-w-[190px] truncate text-xs text-red-500">
                              {provider.staffReview.note}
                            </p>
                          )}
                      </td>

                      <td className="px-5 py-4 text-center font-semibold">
                        {provider.vacancyCount}
                      </td>

                      <td className="px-5 py-4 text-center font-semibold">
                        {provider.applicationCount}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openView(provider.registerId)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>

                          {canManage && (
                            <button
                              type="button"
                              onClick={() => openReview(provider)}
                              className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white"
                            >
                              {provider.staffReview.status === "NOT_REVIEWED"
                                ? "Review"
                                : "Edit Review"}
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

        {!canManage && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            Your Staff account has view-only Client access. An Admin must grant
            providers:manage before you can perform operational reviews.
          </div>
        )}
      </main>

      {/* DETAILS */}

      <ClientDetails
        provider={viewingProvider}
        canManage={canManage}
        onClose={closeView}
        onReview={(provider) => {
          closeView();

          openReview(provider);
        }}
      />

      {/* REVIEW */}

      <ReviewClientModal
        provider={reviewingProvider}
        isSaving={isReviewing}
        onClose={closeReview}
        onSubmit={submitReview}
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
