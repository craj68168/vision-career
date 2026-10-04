"use client";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
const formatDateTime = (value: string | null | undefined, locale: string) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString(locale, { timeZone: "Asia/Tokyo" });
};
// ======================================================
// STAFF REVIEW CLASS
// ======================================================
const staffReviewClass = (status: PlacementCandidateStaffReviewStatus) => {
  switch (status) {
    case "REVIEWED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";
    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";
    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";
  }
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";
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
  const t = useTranslations("placementCandidatesModal");

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/50 p-0 backdrop-blur-sm sm:p-4">
      {/* BACKDROP */}
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className="absolute inset-0"
      />
      {/* MODAL */}
      <div className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-white shadow-xl dark:bg-zinc-900 sm:h-auto sm:max-h-[94vh] sm:max-w-6xl sm:rounded-lg sm:border sm:border-zinc-200 sm:dark:border-white/10">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}
        <header className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Users className="h-4 w-4" />
              {t("candidateMatching")}
            </div>
            <h2 className="mt-1 break-words text-lg font-semibold text-zinc-950 dark:text-white sm:text-xl">
              {request.jobTitle}
            </h2>
            <div className="mt-1 flex flex-wrap gap-3 text-sm text-zinc-500 dark:text-zinc-400">
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
            aria-label={t("close")}
            className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10 ${focusRing}`}
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        {/* ================================================= */}
        {/* HEADCOUNT SUMMARY */}
        {/* ================================================= */}
        <div className="grid gap-3 border-b border-zinc-200 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-white/5 sm:grid-cols-2 sm:p-5 lg:grid-cols-6">
          <SummaryCard label={t("positionsRequired")} value={positions} />
          <SummaryCard label={t("candidatesSent")} value={sentCount} />
          <SummaryCard label={t("activeCandidates")} value={activeCount} />
          <SummaryCard label={t("placed")} value={placedCount} />
          <SummaryCard label={t("needsAttention")} value={needsAttentionCount} />
          <SummaryCard label={t("remaining")} value={remaining} />
        </div>
        {/* ================================================= */}
        {/* REJECTION SUMMARY */}
        {/* ================================================= */}
        {rejectedCount > 0 && (
          <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300 sm:px-5">
            {t("rejectedSummary", { count: rejectedCount })}
        </div>
        )}
        {/* ================================================= */}
        {/* STAFF ATTENTION SUMMARY */}
        {/* ================================================= */}
        {needsAttentionCount > 0 && (
          <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300 sm:px-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                {t("attentionSummary", { count: needsAttentionCount })}
            </span>
            </div>
          </div>
        )}
        {/* ================================================= */}
        {/* CONTROLS */}
        {/* ================================================= */}
        <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 dark:border-white/10 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex rounded-lg bg-zinc-100 p-1 dark:bg-white/5">
            <button
              type="button"
              onClick={() => setActiveTab("eligible")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${focusRing} ${
                activeTab === "eligible"
                  ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {t("eligibleSeekers", { count: eligibleSeekers.length })}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("matched")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${focusRing} ${
                activeTab === "matched"
                  ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {t("candidateHistory", { count: matchedCandidates.length })}
            </button>
          </div>
          <div className="flex gap-3">
            <div className="relative min-w-0 flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("searchCandidates")}
                className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
            <button
              type="button"
              disabled={fetching}
              onClick={() => void onRefresh()}
              className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
            >
              <RefreshCw
                className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`}
              />{t("refresh")} </button>
          </div>
        </div>
        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                      {t("loadingCandidates")}
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
  const t = useTranslations("placementCandidatesModal");
  const seekerPlacementLabel = (value?: string | null) => {
    if (!value) return "-";
    return t("seekerPlacementStatus", { status: value });
  };

  if (candidates.length === 0) {
    return (
      <EmptyState
        title={t("noEligibleTitle")}
        description={t("noEligibleDescription")}
      />
    );
  }
  return (
    <div className="grid gap-3">
      {candidates.map((seeker) => (
        <article
          key={seeker.seekerId}
          className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-950 dark:text-white">
                    {seeker.name}
                  </h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">{seeker.seekerId}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Info label={t("nationality")} value={seeker.nationality} />
                <Info label={t("japanese")} value={seeker.japaneseLevel} />
                <Info label={t("visa")} value={seeker.visaType} />
                <Info label={t("currentLocation")} value={seeker.currentLocation} />
                <Info label={t("desiredJob")} value={seeker.desiredJob} />
                <Info label={t("desiredLocation")} value={seeker.desiredLocation} />
                <Info label={t("placementStatus")} value={seekerPlacementLabel(seeker.placementStatus)} />
              </div>
              {seeker.skills.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {t("skills")}
                    </p>
                  <div className="flex flex-wrap gap-2">
                    {seeker.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-white/10 dark:text-zinc-300"
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
              className={`inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
            >
              {matchingSeekerId === seeker.seekerId ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {t("matchCandidate")}
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
  const t = useTranslations("placementCandidatesModal");
  const locale = useLocale();

  if (candidates.length === 0) {
    return (
      <EmptyState
        title={t("noMatchedTitle")}
        description={t("noMatchedDescription")}
      />
    );
  }
  return (
    <div className="grid gap-3">
      {candidates.map((item) => {
        const review = item.staffReview;
        return (
          <article
            key={item.placementCandidateId}
            className={`rounded-lg border p-4 shadow-sm ${
              review?.status === "NEEDS_ATTENTION"
                ? "border-red-200 bg-red-50/30 dark:border-red-400/20 dark:bg-red-400/10"
                : "border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900"
            }`}
          >
            <div className="flex flex-col gap-5">
              {/* TOP */}
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-950 dark:text-white">
                        {item.candidate.name}
                      </h3>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        {item.placementCandidateId}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                        {t("seekerId", { id: item.seekerId })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Info
                      label={t("nationality")}
                      value={item.candidate.nationality}
                    />
                    <Info
                      label={t("japanese")}
                      value={item.candidate.japanese_level}
                    />
                    <Info label={t("visa")} value={item.candidate.visa_type} />
                    <Info
                      label={t("desiredJob")}
                      value={item.candidate.desired_job}
                    />
                  </div>
                  {item.candidate.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.candidate.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-white/10 dark:text-zinc-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.rejectionReason && (
                    <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-400/10 dark:text-red-300">
                      <strong>
                      {t("providerRejection")}
                    </strong>{" "}
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
              <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {t("staffReview")}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                      {t("staffReviewDescription")}
                    </p>
                  </div>
                  <StaffReviewBadge status={review?.status || "NOT_REVIEWED"} />
                </div>
                {review?.status === "NOT_REVIEWED" && (
                  <div className="mt-4 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-400/20 dark:bg-amber-400/10">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {t("notReviewedMessage")}
                    </p>
                  </div>
                )}
                {review?.status === "REVIEWED" && (
                  <div className="mt-4 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-400/20 dark:bg-emerald-400/10">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      {t("reviewedMessage")}
                    </p>
                  </div>
                )}
                {review?.status === "NEEDS_ATTENTION" && (
                  <div className="mt-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-400/20 dark:bg-red-400/10">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {t("needsAttentionMessage")}
                    </p>
                  </div>
                )}
                {review && review.status !== "NOT_REVIEWED" && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Info
                      label={t("reviewedBy")}
                      value={review.reviewedByStaffId}
                    />
                    <Info
                      label={t("reviewedAt")}
                      value={formatDateTime(review.reviewedAt, locale)}
                    />
                  </div>
                )}
                {review?.note && (
                  <div
                    className={`mt-3 rounded-lg border p-3 ${
                      review.status === "NEEDS_ATTENTION"
                        ? "border-red-200 bg-red-50 dark:border-red-400/20 dark:bg-red-400/10"
                        : "border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900"
                    }`}
                  >
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {t("staffNote")}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                      {review.note}
                    </p>
                  </div>
                )}
              </div>
              {/* ================================================= */}
              {/* PIPELINE TIMELINE */}
              {/* ================================================= */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Info label={t("matched")} value={formatDateTime(item.matchedAt, locale)} />
                <Info
                  label={t("providerReviewed")}
                  value={formatDateTime(item.providerReviewedAt, locale)}
                />
                <Info
                  label={t("interview")}
                  value={formatDateTime(item.interviewAt, locale)}
                />
                <Info
                  label={t("selected")}
                  value={formatDateTime(item.selectedAt, locale)}
                />
                <Info label={t("placed")} value={formatDateTime(item.placedAt, locale)} />
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
  const t = useTranslations("placementCandidatesModal");

  let classes = "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-300";
  switch (status) {
    case "MATCHED":
      classes = "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300";
      break;
    case "UNDER_REVIEW":
      classes = "bg-amber-50 text-amber-700";
      break;
    case "INTERVIEW":
      classes = "bg-blue-50 text-blue-700";
      break;
    case "SELECTED":
      classes = "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300";
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
      {t("candidateStatus", { status })}
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
  const t = useTranslations("placementCandidatesModal");

  return (
    <span
      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${staffReviewClass(
        status,
      )}`}
    >
      {t("staffReviewStatus", { status })}
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
    <div className="rounded-lg bg-zinc-50 p-3 dark:bg-white/5">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-zinc-900 dark:text-zinc-100">
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
    <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-0.5 text-xl font-semibold text-zinc-950 dark:text-white">{value}</p>
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
    <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-white/10">
      <div className="max-w-md text-center">
        <BriefcaseBusiness className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" />
        <h3 className="mt-3 font-semibold text-zinc-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
    </div>
  );
}
