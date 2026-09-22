"use client";

import { Eye, RefreshCw, Search } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { getCurrentStaff } from "@/components/auth/Staff/api";

import {
  getRequestStatusClass,
  getRequestStatusLabel,
  getScreeningClass,
  getScreeningLabel,
} from "./helper";

import { useStaffPlacementRequests } from "./hook";

import PlacementRequestDetails from "./PlacementRequestDetails";

import ScreenPlacementRequestModal from "./ScreenPlacementRequestModal";

import type {
  PlacementRequestScreeningStatus,
  PlacementRequestStatus,
} from "./types";

export default function StaffPlacementRequests() {
  const {
    requests,
    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    screeningFilter,
    setScreeningFilter,

    viewingRequest,
    viewingId,
    setViewingId,

    screeningRequest,
    setScreeningRequest,

    isLoading,
    isFetching,
    isScreening,

    submitScreening,

    refresh,
  } = useStaffPlacementRequests();

  // ====================================================
  // STAFF PERMISSIONS
  // ====================================================

  const staffQuery = useQuery({
    queryKey: ["current-staff"],

    queryFn: getCurrentStaff,
  });

  const canReview =
    staffQuery.data?.data.permissions.includes("placement_requests:review") ??
    false;

  return (
    <>
      <main className="mx-auto max-w-7xl space-y-6 px-6 py-10">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">
              Placement Requests
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Screen Provider placement requests before final Admin review.
            </p>
          </div>

          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refresh()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* SUMMARY */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <Summary label="Total" value={summary?.total ?? 0} />

          <Summary label="Pending" value={summary?.pendingReview ?? 0} />

          <Summary label="Not Screened" value={summary?.notScreened ?? 0} />

          <Summary label="Screened" value={summary?.screened ?? 0} />

          <Summary
            label="Needs Attention"
            value={summary?.needsAttention ?? 0}
          />

          <Summary label="Approved" value={summary?.approved ?? 0} />

          <Summary label="Rejected" value={summary?.rejected ?? 0} />
        </div>

        {/* FILTERS */}

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search request, company, job title..."
              className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "ALL" | PlacementRequestStatus,
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm"
          >
            <option value="ALL">All Request Statuses</option>

            <option value="pending_review">Pending Review</option>

            <option value="approved">Approved</option>

            <option value="rejected">Rejected</option>
          </select>

          <select
            value={screeningFilter}
            onChange={(event) =>
              setScreeningFilter(
                event.target.value as "ALL" | PlacementRequestScreeningStatus,
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm"
          >
            <option value="ALL">All Screening</option>

            <option value="NOT_SCREENED">Not Screened</option>

            <option value="SCREENED">Screened</option>

            <option value="NEEDS_ATTENTION">Needs Attention</option>
          </select>
        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Request</th>

                  <th className="px-5 py-4">Company</th>

                  <th className="px-5 py-4">Position</th>

                  <th className="px-5 py-4 text-center">People</th>

                  <th className="px-5 py-4">Location</th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4">Screening</th>

                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-sm text-slate-500"
                    >
                      Loading placement requests...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-sm text-slate-500"
                    >
                      No placement requests found.
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr
                      key={request.recruitId}
                      className="border-t border-slate-100 hover:bg-slate-50/60"
                    >
                      {/* REQUEST */}

                      <td className="px-5 py-4 text-sm font-medium">
                        {request.recruitId}
                      </td>

                      {/* COMPANY */}

                      <td className="px-5 py-4">
                        <p className="font-semibold">{request.companyName}</p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {request.providerName}
                        </p>
                      </td>

                      {/* POSITION */}

                      <td className="px-5 py-4 text-sm">
                        {request.jobTitle || "-"}
                      </td>

                      {/* PEOPLE */}

                      <td className="px-5 py-4 text-center">
                        {request.numberOfPositions}
                      </td>

                      {/* LOCATION */}

                      <td className="px-5 py-4 text-sm">
                        {request.workLocation || "-"}
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getRequestStatusClass(
                            request.status,
                          )}`}
                        >
                          {getRequestStatusLabel(request.status)}
                        </span>
                      </td>

                      {/* SCREENING */}

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getScreeningClass(
                            request.staffScreening.status,
                          )}`}
                        >
                          {getScreeningLabel(request.staffScreening.status)}
                        </span>

                        {request.staffScreening.status === "NEEDS_ATTENTION" &&
                          request.staffScreening.note && (
                            <p className="mt-1 max-w-[180px] truncate text-xs text-red-500">
                              {request.staffScreening.note}
                            </p>
                          )}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingId(request.recruitId)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>

                          {canReview && request.status === "pending_review" && (
                            <button
                              type="button"
                              onClick={() => setScreeningRequest(request)}
                              className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white"
                            >
                              {request.staffScreening.status === "NOT_SCREENED"
                                ? "Screen"
                                : "Edit Screening"}
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

        {!canReview && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            Your Staff account has view-only Placement Request access. An Admin
            must grant placement_requests:review before you can perform
            screening.
          </div>
        )}
      </main>

      {/* DETAILS */}

      {viewingId && (
        <PlacementRequestDetails
          request={viewingRequest}
          canReview={canReview}
          onClose={() => setViewingId(null)}
          onScreen={(request) => {
            setViewingId(null);

            setScreeningRequest(request);
          }}
        />
      )}

      {/* SCREEN */}

      <ScreenPlacementRequestModal
        request={screeningRequest}
        isSaving={isScreening}
        onClose={() => setScreeningRequest(null)}
        onSubmit={submitScreening}
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
