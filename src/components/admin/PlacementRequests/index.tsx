"use client";

import { Eye, RefreshCw, Search, Users } from "lucide-react";

import { useAdminPlacementRequests } from "./hook";

import type { PlacementRequestStatus } from "./types";

import CandidatesModal from "./CandidatesModal";
import DetailsModal from "./DetailsModal";
import StatusModal from "./StatusModal";

// ======================================================
// STATUS
// ======================================================

const statusClass = (status: PlacementRequestStatus) => {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-700";

    case "rejected":
      return "bg-red-50 text-red-700";

    case "pending_review":
      return "bg-amber-50 text-amber-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
};

const statusLabel = (status: PlacementRequestStatus) => {
  switch (status) {
    case "pending_review":
      return "Pending Review";

    case "approved":
      return "Approved";

    case "rejected":
      return "Rejected";

    default:
      return "Draft";
  }
};

// ======================================================
// PAGE
// ======================================================

export default function PlacementRequests() {
  const {
    requests,
    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    viewingRequest,
    viewingId,
    setViewingId,

    reviewingRequest,
    setReviewingRequest,

    candidateRequest,
    openCandidates,
    closeCandidates,

    eligibleSeekers,
    matchedCandidates,

    candidatesLoading,
    candidatesFetching,

    matchingSeekerId,

    handleMatchCandidate,
    refreshCandidates,

    isLoading,
    isFetching,
    isReviewing,

    approve,
    reject,
    refresh,
  } = useAdminPlacementRequests();

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-10">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            Placement Requests
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review placement requests submitted by Job Providers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refresh()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="grid gap-4 md:grid-cols-4">
        <Summary label="Total Requests" value={summary?.total ?? 0} />

        <Summary label="Pending Review" value={summary?.pendingReview ?? 0} />

        <Summary label="Approved" value={summary?.approved ?? 0} />

        <Summary label="Rejected" value={summary?.rejected ?? 0} />
      </div>

      {/* ================================================= */}
      {/* FILTER */}
      {/* ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_200px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search request, company, job title..."
              className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-indigo-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "ALL" | PlacementRequestStatus,
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="ALL">All statuses</option>

            <option value="pending_review">Pending Review</option>

            <option value="approved">Approved</option>

            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Request</th>

                <th className="px-5 py-4">Company</th>

                <th className="px-5 py-4">Position</th>

                <th className="px-5 py-4 text-center">People</th>

                <th className="px-5 py-4">Location</th>

                <th className="px-5 py-4">Status</th>

                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-sm text-slate-500"
                  >
                    Loading placement requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
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
                    <td className="px-5 py-4 text-sm font-medium">
                      {request.recruitId}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-950">
                        {request.companyName}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {request.providerName}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {request.jobTitle || "-"}
                    </td>

                    <td className="px-5 py-4 text-center text-sm">
                      {request.numberOfPositions}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {request.workLocation || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          request.status,
                        )}`}
                      >
                        {statusLabel(request.status)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setViewingId(request.recruitId)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>

                        {request.status === "pending_review" && (
                          <button
                            type="button"
                            onClick={() => setReviewingRequest(request)}
                            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
                          >
                            Review
                          </button>
                        )}

                        {request.status === "approved" && (
                          <button
                            type="button"
                            onClick={() => openCandidates(request)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white"
                          >
                            <Users className="h-4 w-4" />
                            Manage Candidates
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

      {/* ================================================= */}
      {/* DETAILS */}
      {/* ================================================= */}

      {viewingId && viewingRequest && (
        <DetailsModal
          request={viewingRequest}
          onClose={() => setViewingId(null)}
        />
      )}

      {/* ================================================= */}
      {/* REVIEW */}
      {/* ================================================= */}

      {reviewingRequest && (
        <StatusModal
          request={reviewingRequest}
          isSaving={isReviewing}
          onClose={() => setReviewingRequest(null)}
          onApprove={() => approve(reviewingRequest.recruitId)}
          onReject={(reason) => reject(reviewingRequest.recruitId, reason)}
        />
      )}

      {/* ================================================= */}
      {/* CANDIDATE MATCHING */}
      {/* ================================================= */}

      <CandidatesModal
        open={Boolean(candidateRequest)}
        request={candidateRequest}
        eligibleSeekers={eligibleSeekers}
        matchedCandidates={matchedCandidates}
        loading={candidatesLoading}
        fetching={candidatesFetching}
        matchingSeekerId={matchingSeekerId}
        onClose={closeCandidates}
        onMatch={handleMatchCandidate}
        onRefresh={refreshCandidates}
      />
    </div>
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
