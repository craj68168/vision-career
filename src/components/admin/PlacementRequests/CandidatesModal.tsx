"use client";

import { useMemo, useState } from "react";

import {
  BriefcaseBusiness,
  Check,
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
        item.status,
        item.candidate.name,
        item.candidate.nationality,
        item.candidate.visa_type,
        item.candidate.japanese_level,
        item.candidate.desired_job,
        ...item.candidate.skills,
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

  // Every candidate ever sent to this request.
  //
  // This includes rejected candidates because they are
  // still part of the historical recruitment record.

  const sentCount = matchedCandidates.length;

  // Only candidates still active in this placement flow.
  //
  // REJECTED candidates DO NOT fill a position.

  const activeCount = matchedCandidates.filter(
    (candidate) => candidate.status !== "REJECTED",
  ).length;

  const placedCount = matchedCandidates.filter(
    (candidate) => candidate.status === "PLACED",
  ).length;

  const rejectedCount = matchedCandidates.filter(
    (candidate) => candidate.status === "REJECTED",
  ).length;

  // ====================================================
  // IMPORTANT
  //
  // Rejected candidates do not reduce the remaining
  // number of required candidates.
  //
  // Example:
  //
  // positions = 46
  // sent = 1
  // rejected = 1
  // active = 0
  //
  // remaining = 46
  // ====================================================

  const remaining = Math.max(positions - activeCount, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:p-4">
      {/* ================================================= */}
      {/* BACKDROP */}
      {/* ================================================= */}

      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0"
      />

      {/* ================================================= */}
      {/* MODAL */}
      {/* ================================================= */}

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

        <div className="grid gap-3 border-b border-slate-200 bg-slate-50/70 p-6 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryCard label="Positions Required" value={positions} />

          <SummaryCard label="Candidates Sent" value={sentCount} />

          <SummaryCard label="Active Candidates" value={activeCount} />

          <SummaryCard label="Placed" value={placedCount} />

          <SummaryCard label="Remaining" value={remaining} />
        </div>

        {/* ================================================= */}
        {/* SMALL REJECTION SUMMARY */}
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
      {candidates.map((item) => (
        <article
          key={item.placementCandidateId}
          className="rounded-2xl border border-slate-200 p-5"
        >
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
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Info label="Nationality" value={item.candidate.nationality} />

                <Info label="Japanese" value={item.candidate.japanese_level} />

                <Info label="Visa" value={item.candidate.visa_type} />

                <Info label="Desired Job" value={item.candidate.desired_job} />
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
                  <strong>Rejection:</strong> {item.rejectionReason}
                </div>
              )}
            </div>

            <CandidateStatusBadge status={item.status} />
          </div>
        </article>
      ))}
    </div>
  );
}

// ======================================================
// STATUS BADGE
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

      <p className="mt-1 text-sm font-medium capitalize text-slate-900">
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
