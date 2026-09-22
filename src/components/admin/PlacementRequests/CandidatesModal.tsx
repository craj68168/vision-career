"use client";

import { useMemo, useState } from "react";

import {
  AlertTriangle,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  UserRound,
  Users,
  X,
} from "lucide-react";

import type {
  EligibleSeeker,
  PlacementCandidate,
  PlacementCandidateStaffReviewStatus,
  PlacementCandidateStatus,
  PlacementRequest,
} from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  open: boolean;

  request: PlacementRequest | null;

  eligibleSeekers: EligibleSeeker[];

  matchedCandidates: PlacementCandidate[];

  loading: boolean;

  fetching: boolean;

  matchingSeekerId: string | null;

  onClose: () => void;

  onMatch: (seekerId: string) => void;

  onRefresh: () => void | Promise<void>;
};

// ======================================================
// DATE
// ======================================================

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
};

// ======================================================
// STAFF REVIEW LABEL
// ======================================================

const staffReviewLabel = (status: PlacementCandidateStaffReviewStatus) => {
  switch (status) {
    case "REVIEWED":
      return "Reviewed";

    case "NEEDS_ATTENTION":
      return "Needs Attention";

    default:
      return "Not Reviewed";
  }
};

// ======================================================
// STAFF REVIEW CLASS
// ======================================================

const staffReviewClass = (status: PlacementCandidateStaffReviewStatus) => {
  switch (status) {
    case "REVIEWED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
  }
};

// ======================================================
// COMPONENT
// ======================================================

export default function CandidatesModal({
  open,
  request,
  eligibleSeekers,
  matchedCandidates,
  loading,
  fetching,
  matchingSeekerId,
  onClose,
  onMatch,
  onRefresh,
}: Props) {
  const [activeTab, setActiveTab] = useState<"eligible" | "matched">(
    "eligible",
  );

  const [search, setSearch] = useState("");

  // ====================================================
  // FILTER ELIGIBLE
  // ====================================================

  const filteredEligible = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return eligibleSeekers;
    }

    return eligibleSeekers.filter((seeker) =>
      [
        seeker.name,
        seeker.nationality,
        seeker.currentLocation,
        seeker.visaType,
        seeker.japaneseLevel,
        seeker.desiredJob,
        seeker.desiredLocation,
        ...seeker.skills,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [eligibleSeekers, search]);

  // ====================================================
  // FILTER MATCHED
  // ====================================================

  const filteredMatched = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return matchedCandidates;
    }

    return matchedCandidates.filter((item) =>
      [
        item.placementCandidateId,

        item.seekerId,

        item.status,

        item.candidate.name,

        item.candidate.nationality,

        item.candidate.visa_type,

        item.candidate.japanese_level,

        item.candidate.desired_job,

        ...item.candidate.skills,

        item.staffReview?.status,

        item.staffReview?.note,

        item.staffReview?.reviewedByStaffId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [matchedCandidates, search]);

  if (!open || !request) {
    return null;
  }

  // ====================================================
  // HEADCOUNT
  // ====================================================

  const positions = request.numberOfPositions;

  // Every candidate ever sent.
  const sentCount = matchedCandidates.length;

  // Rejected candidates do not fill positions.
  const activeCount = matchedCandidates.filter(
    (candidate) => candidate.status !== "REJECTED",
  ).length;

  const placedCount = matchedCandidates.filter(
    (candidate) => candidate.status === "PLACED",
  ).length;

  const rejectedCount = matchedCandidates.filter(
    (candidate) => candidate.status === "REJECTED",
  ).length;

  const needsAttentionCount = matchedCandidates.filter(
    (candidate) => candidate.staffReview?.status === "NEEDS_ATTENTION",
  ).length;

  const remaining = Math.max(positions - activeCount, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:p-4">
      {/* BACKDROP */}

      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0"
      />

      {/* MODAL */}

      <div className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-white sm:h-auto sm:max-h-[94vh] sm:max-w-6xl sm:rounded-3xl sm:shadow-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
              <Users className="h-4 w-4" />
              Candidate Matching
            </div>

            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              {request.jobTitle}
            </h2>

            <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
              <span>{request.recruitId}</span>

              <span>{request.companyName}</span>

              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />

                {request.workLocation}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* ================================================= */}
        {/* HEADCOUNT SUMMARY */}
        {/* ================================================= */}

        <div className="grid gap-3 border-b border-slate-200 bg-slate-50/70 p-6 sm:grid-cols-2 lg:grid-cols-6">
          <SummaryCard label="Positions Required" value={positions} />

          <SummaryCard label="Candidates Sent" value={sentCount} />

          <SummaryCard label="Active Candidates" value={activeCount} />

          <SummaryCard label="Placed" value={placedCount} />

          <SummaryCard label="Needs Attention" value={needsAttentionCount} />

          <SummaryCard label="Remaining" value={remaining} />
        </div>

        {/* ================================================= */}
        {/* REJECTION SUMMARY */}
        {/* ================================================= */}

        {rejectedCount > 0 && (
          <div className="border-b border-slate-200 bg-red-50 px-6 py-3 text-sm text-red-700">
            {rejectedCount}{" "}
            {rejectedCount === 1 ? "candidate has" : "candidates have"} been
            rejected and {rejectedCount === 1 ? "does" : "do"} not reduce the
            remaining placement requirement.
          </div>
        )}

        {/* ================================================= */}
        {/* STAFF ATTENTION SUMMARY */}
        {/* ================================================= */}

        {needsAttentionCount > 0 && (
          <div className="border-b border-red-200 bg-red-50 px-6 py-3 text-sm text-red-700">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />

              <span>
                {needsAttentionCount}{" "}
                {needsAttentionCount === 1
                  ? "candidate has"
                  : "candidates have"}{" "}
                been marked as Needs Attention by Staff.
              </span>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* CONTROLS */}
        {/* ================================================= */}

        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("eligible")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === "eligible"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Eligible Seekers ({eligibleSeekers.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("matched")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === "matched"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Candidate History ({matchedCandidates.length})
            </button>
          </div>

          <div className="flex gap-3">
            <div className="relative min-w-0 flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search candidates..."
                className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-indigo-400"
              />
            </div>

            <button
              type="button"
              disabled={fetching}
              onClick={() => void onRefresh()}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-500" />

                <p className="mt-3 text-sm text-slate-500">
                  Loading candidates...
                </p>
              </div>
            </div>
          ) : activeTab === "eligible" ? (
            <EligibleCandidates
              candidates={filteredEligible}
              matchingSeekerId={matchingSeekerId}
              onMatch={onMatch}
            />
          ) : (
            <MatchedCandidates candidates={filteredMatched} />
          )}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// ELIGIBLE CANDIDATES
// ======================================================

function EligibleCandidates({
  candidates,
  matchingSeekerId,
  onMatch,
}: {
  candidates: EligibleSeeker[];

  matchingSeekerId: string | null;

  onMatch: (seekerId: string) => void;
}) {
  if (candidates.length === 0) {
    return (
      <EmptyState
        title="No eligible seekers found"
        description="There are currently no additional eligible Job Seekers available for this placement request."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {candidates.map((seeker) => (
        <article
          key={seeker.seekerId}
          className="rounded-2xl border border-slate-200 p-5"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-950">
                    {seeker.name}
                  </h3>

                  <p className="text-xs text-slate-400">{seeker.seekerId}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Info label="Nationality" value={seeker.nationality} />

                <Info label="Japanese" value={seeker.japaneseLevel} />

                <Info label="Visa" value={seeker.visaType} />

                <Info label="Current Location" value={seeker.currentLocation} />

                <Info label="Desired Job" value={seeker.desiredJob} />

                <Info label="Desired Location" value={seeker.desiredLocation} />

                <Info label="Placement Status" value={seeker.placementStatus} />
              </div>

              {seeker.skills.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {seeker.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={Boolean(matchingSeekerId)}
              onClick={() => onMatch(seeker.seekerId)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {matchingSeekerId === seeker.seekerId ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Match Candidate
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

// ======================================================
// CANDIDATE HISTORY
// ======================================================

function MatchedCandidates({
  candidates,
}: {
  candidates: PlacementCandidate[];
}) {
  if (candidates.length === 0) {
    return (
      <EmptyState
        title="No candidates matched yet"
        description="Choose an eligible Job Seeker and match them to this placement request."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {candidates.map((item) => {
        const review = item.staffReview;

        return (
          <article
            key={item.placementCandidateId}
            className={`rounded-2xl border p-5 ${
              review?.status === "NEEDS_ATTENTION"
                ? "border-red-200 bg-red-50/30"
                : "border-slate-200"
            }`}
          >
            <div className="flex flex-col gap-5">
              {/* TOP */}

              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <UserRound className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-950">
                        {item.candidate.name}
                      </h3>

                      <p className="text-xs text-slate-400">
                        {item.placementCandidateId}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Seeker: {item.seekerId}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Info
                      label="Nationality"
                      value={item.candidate.nationality}
                    />

                    <Info
                      label="Japanese"
                      value={item.candidate.japanese_level}
                    />

                    <Info label="Visa" value={item.candidate.visa_type} />

                    <Info
                      label="Desired Job"
                      value={item.candidate.desired_job}
                    />
                  </div>

                  {item.candidate.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.candidate.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.rejectionReason && (
                    <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                      <strong>Provider Rejection:</strong>{" "}
                      {item.rejectionReason}
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <CandidateStatusBadge status={item.status} />

                  <StaffReviewBadge status={review?.status || "NOT_REVIEWED"} />
                </div>
              </div>

              {/* ================================================= */}
              {/* STAFF REVIEW */}
              {/* ================================================= */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Staff Review
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Internal operational review. Provider pipeline remains
                      separate.
                    </p>
                  </div>

                  <StaffReviewBadge status={review?.status || "NOT_REVIEWED"} />
                </div>

                {review?.status === "NOT_REVIEWED" && (
                  <div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                    <p className="text-sm text-amber-700">
                      This candidate has not been reviewed by Staff yet.
                    </p>
                  </div>
                )}

                {review?.status === "REVIEWED" && (
                  <div className="mt-4 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                    <p className="text-sm text-emerald-700">
                      Staff candidate review completed.
                    </p>
                  </div>
                )}

                {review?.status === "NEEDS_ATTENTION" && (
                  <div className="mt-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

                    <p className="text-sm text-red-700">
                      Staff marked this candidate as needing attention.
                    </p>
                  </div>
                )}

                {review && review.status !== "NOT_REVIEWED" && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Info
                      label="Reviewed By"
                      value={review.reviewedByStaffId}
                    />

                    <Info
                      label="Reviewed At"
                      value={formatDateTime(review.reviewedAt)}
                    />
                  </div>
                )}

                {review?.note && (
                  <div
                    className={`mt-3 rounded-xl border p-3 ${
                      review.status === "NEEDS_ATTENTION"
                        ? "border-red-200 bg-red-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Staff Note
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                      {review.note}
                    </p>
                  </div>
                )}
              </div>

              {/* ================================================= */}
              {/* PIPELINE TIMELINE */}
              {/* ================================================= */}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Info label="Matched" value={formatDateTime(item.matchedAt)} />

                <Info
                  label="Provider Reviewed"
                  value={formatDateTime(item.providerReviewedAt)}
                />

                <Info
                  label="Interview"
                  value={formatDateTime(item.interviewAt)}
                />

                <Info
                  label="Selected"
                  value={formatDateTime(item.selectedAt)}
                />

                <Info label="Placed" value={formatDateTime(item.placedAt)} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

// ======================================================
// PIPELINE STATUS BADGE
// ======================================================

function CandidateStatusBadge({
  status,
}: {
  status: PlacementCandidateStatus;
}) {
  let classes = "bg-slate-100 text-slate-700";

  switch (status) {
    case "MATCHED":
      classes = "bg-indigo-50 text-indigo-700";
      break;

    case "UNDER_REVIEW":
      classes = "bg-amber-50 text-amber-700";
      break;

    case "INTERVIEW":
      classes = "bg-blue-50 text-blue-700";
      break;

    case "SELECTED":
      classes = "bg-violet-50 text-violet-700";
      break;

    case "PLACED":
      classes = "bg-emerald-50 text-emerald-700";
      break;

    case "REJECTED":
      classes = "bg-red-50 text-red-700";
      break;
  }

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

// ======================================================
// STAFF REVIEW BADGE
// ======================================================

function StaffReviewBadge({
  status,
}: {
  status: PlacementCandidateStaffReviewStatus;
}) {
  return (
    <span
      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${staffReviewClass(
        status,
      )}`}
    >
      {staffReviewLabel(status)}
    </span>
  );
}

// ======================================================
// INFO
// ======================================================

function Info({
  label,
  value,
}: {
  label: string;

  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-400">{label}</p>

      <p className="mt-1 break-words text-sm font-medium text-slate-900">
        {value === null || value === undefined || value === ""
          ? "-"
          : String(value)}
      </p>
    </div>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

// ======================================================
// EMPTY STATE
// ======================================================

function EmptyState({
  title,
  description,
}: {
  title: string;

  description: string;
}) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-300">
      <div className="max-w-md text-center">
        <BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300" />

        <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}
