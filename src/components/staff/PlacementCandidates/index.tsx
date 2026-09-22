"use client";

import { Eye, RefreshCw, Search } from "lucide-react";

import {
  getCandidateStatusClass,
  getCandidateStatusLabel,
  getReviewClass,
  getReviewLabel,
} from "./helper";

import { useStaffPlacementCandidates } from "./hook";

import CandidateDetails from "./CandidateDetails";

import ReviewCandidateModal from "./ReviewCandidateModal";

import type {
  CandidateStaffReviewStatus,
  PlacementCandidateStatus,
} from "./types";

// ======================================================
// COMPONENT
// ======================================================

export default function StaffPlacementCandidates() {
  const {
    candidates,
    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    reviewFilter,
    setReviewFilter,

    viewingId,
    viewingCandidate,
    setViewingId,

    reviewingCandidate,
    setReviewingCandidate,

    isLoading,
    isFetching,
    isReviewing,

    error,

    submitReview,

    refresh,
  } = useStaffPlacementCandidates();

  return (
    <>
      <main className="mx-auto max-w-7xl space-y-6 px-6 py-10">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">
              Placement Candidates
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review candidates matched by Admin and monitor their Provider
              hiring progress.
            </p>
          </div>

          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refresh()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* SUMMARY */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <Summary label="Total Candidates" value={summary?.total ?? 0} />

          <Summary label="Not Reviewed" value={summary?.notReviewed ?? 0} />

          <Summary
            label="Needs Attention"
            value={summary?.needsAttention ?? 0}
          />

          <Summary label="Interview" value={summary?.interview ?? 0} />

          <Summary label="Placed" value={summary?.placed ?? 0} />
        </div>

        {/* FILTERS */}

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search candidate, company, request, job..."
              className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none"
            />
          </div>

          {/* PIPELINE */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "ALL" | PlacementCandidateStatus,
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm"
          >
            <option value="ALL">All Pipeline Statuses</option>

            <option value="MATCHED">Matched</option>

            <option value="UNDER_REVIEW">Under Review</option>

            <option value="INTERVIEW">Interview</option>

            <option value="SELECTED">Selected</option>

            <option value="PLACED">Placed</option>

            <option value="REJECTED">Rejected</option>
          </select>

          {/* REVIEW */}

          <select
            value={reviewFilter}
            onChange={(event) =>
              setReviewFilter(
                event.target.value as "ALL" | CandidateStaffReviewStatus,
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm"
          >
            <option value="ALL">All Staff Reviews</option>

            <option value="NOT_REVIEWED">Not Reviewed</option>

            <option value="REVIEWED">Reviewed</option>

            <option value="NEEDS_ATTENTION">Needs Attention</option>
          </select>
        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">Candidate</th>

                  <th className="px-5 py-4">Company</th>

                  <th className="px-5 py-4">Placement Request</th>

                  <th className="px-5 py-4">Pipeline</th>

                  <th className="px-5 py-4">Staff Review</th>

                  <th className="px-5 py-4">Japanese</th>

                  <th className="px-5 py-4">Visa</th>

                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-sm text-slate-500"
                    >
                      Loading placement candidates...
                    </td>
                  </tr>
                ) : candidates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-sm text-slate-500"
                    >
                      No placement candidates found.
                    </td>
                  </tr>
                ) : (
                  candidates.map((item) => (
                    <tr
                      key={item.placementCandidateId}
                      className="hover:bg-slate-50/70"
                    >
                      {/* CANDIDATE */}

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-950">
                          {item.candidate.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.seekerId}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {item.placementCandidateId}
                        </p>
                      </td>

                      {/* COMPANY */}

                      <td className="px-5 py-4">
                        <p className="font-medium">
                          {item.provider?.companyName || "-"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.provider?.name || "-"}
                        </p>
                      </td>

                      {/* REQUEST */}

                      <td className="px-5 py-4">
                        <p className="font-medium">
                          {item.request?.jobTitle || "-"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.recruitId}
                        </p>
                      </td>

                      {/* PIPELINE */}

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getCandidateStatusClass(
                            item.status,
                          )}`}
                        >
                          {getCandidateStatusLabel(item.status)}
                        </span>
                      </td>

                      {/* STAFF REVIEW */}

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getReviewClass(
                            item.staffReview.status,
                          )}`}
                        >
                          {getReviewLabel(item.staffReview.status)}
                        </span>

                        {item.staffReview.status === "NEEDS_ATTENTION" &&
                          item.staffReview.note && (
                            <p className="mt-1 max-w-[180px] truncate text-xs text-red-500">
                              {item.staffReview.note}
                            </p>
                          )}
                      </td>

                      {/* JAPANESE */}

                      <td className="px-5 py-4 text-sm">
                        {item.candidate.japanese_level || "-"}
                      </td>

                      {/* VISA */}

                      <td className="px-5 py-4 text-sm">
                        {item.candidate.visa_type || "-"}
                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setViewingId(item.placementCandidateId)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => setReviewingCandidate(item)}
                            className={`rounded-lg px-3 py-2 text-xs font-semibold text-white ${
                              item.staffReview.status === "NEEDS_ATTENTION"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-slate-950 hover:bg-slate-800"
                            }`}
                          >
                            {item.staffReview.status === "NOT_REVIEWED"
                              ? "Review"
                              : "Edit Review"}
                          </button>
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

      {viewingId && viewingCandidate && (
        <CandidateDetails
          candidate={viewingCandidate}
          onClose={() => setViewingId(null)}
          onReview={(candidate) => {
            setViewingId(null);

            setReviewingCandidate(candidate);
          }}
        />
      )}

      {/* REVIEW */}

      <ReviewCandidateModal
        candidate={reviewingCandidate}
        isSaving={isReviewing}
        onClose={() => setReviewingCandidate(null)}
        onSubmit={submitReview}
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

      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  );
}
