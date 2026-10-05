"use client";
import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AlertTriangle,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  UserCheck,
  UserRound,
  Users,
  X,
  XCircle,
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

type Tone =
  | "sky"
  | "violet"
  | "amber"
  | "emerald"
  | "indigo"
  | "teal"
  | "red"
  | "zinc";
// ======================================================
// TONE COLORS (light color per item so they are easy to tell apart)
// ======================================================
const toneClasses: Record<
  Tone,
  { border: string; header: string; chip: string; title: string; field: string }
> = {
  sky: {
    border: "border-sky-200",
    header: "bg-sky-50",
    chip: "bg-sky-100 text-sky-700",
    title: "text-sky-900",
    field: "bg-sky-50/60",
  },
  violet: {
    border: "border-violet-200",
    header: "bg-violet-50",
    chip: "bg-violet-100 text-violet-700",
    title: "text-violet-900",
    field: "bg-violet-50/60",
  },
  amber: {
    border: "border-amber-200",
    header: "bg-amber-50",
    chip: "bg-amber-100 text-amber-700",
    title: "text-amber-900",
    field: "bg-amber-50/60",
  },
  emerald: {
    border: "border-emerald-200",
    header: "bg-emerald-50",
    chip: "bg-emerald-100 text-emerald-700",
    title: "text-emerald-900",
    field: "bg-emerald-50/60",
  },
  indigo: {
    border: "border-indigo-200",
    header: "bg-indigo-50",
    chip: "bg-indigo-100 text-indigo-700",
    title: "text-indigo-900",
    field: "bg-indigo-50/60",
  },
  teal: {
    border: "border-teal-200",
    header: "bg-teal-50",
    chip: "bg-teal-100 text-teal-700",
    title: "text-teal-900",
    field: "bg-teal-50/60",
  },
  red: {
    border: "border-red-200",
    header: "bg-red-50",
    chip: "bg-red-100 text-red-700",
    title: "text-red-900",
    field: "bg-red-50/60",
  },
  zinc: {
    border: "border-zinc-200",
    header: "bg-zinc-50",
    chip: "bg-zinc-100 text-zinc-600",
    title: "text-zinc-900",
    field: "bg-zinc-50",
  },
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
      return "border-emerald-200 bg-white text-emerald-700";
    case "NEEDS_ATTENTION":
      return "border-red-200 bg-white text-red-700";
    default:
      return "border-zinc-200 bg-white text-zinc-600";
  }
};

const staffReviewTone = (
  status: PlacementCandidateStaffReviewStatus | undefined,
): Tone => {
  switch (status) {
    case "REVIEWED":
      return "emerald";
    case "NEEDS_ATTENTION":
      return "red";
    default:
      return "zinc";
  }
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
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
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="placement-candidates-title"
        className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-white shadow-xl sm:h-auto sm:max-h-[94dvh] sm:max-w-6xl sm:rounded-lg sm:border sm:border-zinc-200"
      >
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}
        <header className="flex items-start justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-4 sm:px-5">
          <div className="flex min-w-0 items-start gap-3">
            <span
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white"
            >
              <Users className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-emerald-700">
                {t("candidateMatching")}
              </p>
              <h2
                id="placement-candidates-title"
                className="mt-0.5 break-words text-lg font-semibold leading-snug text-zinc-950 sm:text-xl"
              >
                {request.jobTitle}
              </h2>
              <div className="mt-1.5 flex flex-wrap gap-1.5 text-xs text-zinc-600">
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-medium">
                  {request.recruitId}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-0.5 text-sky-800">
                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                  {request.companyName}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-teal-800">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {request.workLocation}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 ${focusRing}`}
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        {/* ================================================= */}
        {/* HEADCOUNT SUMMARY */}
        {/* ================================================= */}
        <div className="grid grid-cols-2 gap-2.5 border-b border-zinc-200 bg-zinc-50/70 p-3 sm:grid-cols-3 sm:gap-3 sm:p-4 lg:grid-cols-6">
          <SummaryCard
            label={t("positionsRequired")}
            value={positions}
            icon={BriefcaseBusiness}
            tone="violet"
          />
          <SummaryCard
            label={t("candidatesSent")}
            value={sentCount}
            icon={Send}
            tone="sky"
          />
          <SummaryCard
            label={t("activeCandidates")}
            value={activeCount}
            icon={UserCheck}
            tone="indigo"
          />
          <SummaryCard
            label={t("placed")}
            value={placedCount}
            icon={CheckCircle2}
            tone="emerald"
          />
          <SummaryCard
            label={t("needsAttention")}
            value={needsAttentionCount}
            icon={AlertTriangle}
            tone={needsAttentionCount > 0 ? "red" : "zinc"}
          />
          <SummaryCard
            label={t("remaining")}
            value={remaining}
            icon={Clock3}
            tone={remaining > 0 ? "amber" : "emerald"}
          />
        </div>
        {/* ================================================= */}
        {/* REJECTION SUMMARY */}
        {/* ================================================= */}
        {rejectedCount > 0 && (
          <div className="flex items-center gap-2 border-b border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 sm:px-5">
            <XCircle className="h-4 w-4 shrink-0" />
            <span>{t("rejectedSummary", { count: rejectedCount })}</span>
          </div>
        )}
        {/* ================================================= */}
        {/* STAFF ATTENTION SUMMARY */}
        {/* ================================================= */}
        {needsAttentionCount > 0 && (
          <div className="flex items-center gap-2 border-b border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 sm:px-5">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{t("attentionSummary", { count: needsAttentionCount })}</span>
          </div>
        )}
        {/* ================================================= */}
        {/* CONTROLS */}
        {/* ================================================= */}
        <div className="flex flex-col gap-3 border-b border-zinc-200 bg-white p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex rounded-lg bg-zinc-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("eligible")}
              className={`flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition lg:flex-none ${focusRing} ${
                activeTab === "eligible"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {t("eligibleSeekers", { count: eligibleSeekers.length })}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("matched")}
              className={`flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition lg:flex-none ${focusRing} ${
                activeTab === "matched"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {t("candidateHistory", { count: matchedCandidates.length })}
            </button>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <div className="relative min-w-0 flex-1 lg:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("searchCandidates")}
                className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <button
              type="button"
              disabled={fetching}
              onClick={() => void onRefresh()}
              className={`inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
            >
              <RefreshCw
                className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`}
              />
              {t("refresh")}
            </button>
          </div>
        </div>
        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}
        <div className="flex-1 overflow-y-auto bg-zinc-50/60 p-3 sm:p-5">
          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
                <p className="mt-3 text-sm text-zinc-500">
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
          className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                  <UserRound className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-zinc-950">
                    {seeker.name}
                  </h3>
                  <p className="truncate text-xs text-zinc-400">{seeker.seekerId}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <Info tone="sky" label={t("nationality")} value={seeker.nationality} />
                <Info tone="violet" label={t("japanese")} value={seeker.japaneseLevel} />
                <Info tone="amber" label={t("visa")} value={seeker.visaType} />
                <Info tone="emerald" label={t("currentLocation")} value={seeker.currentLocation} />
                <Info tone="indigo" label={t("desiredJob")} value={seeker.desiredJob} />
                <Info tone="teal" label={t("desiredLocation")} value={seeker.desiredLocation} />
                <Info tone="zinc" label={t("placementStatus")} value={seekerPlacementLabel(seeker.placementStatus)} />
              </div>
              {seeker.skills.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-zinc-500">
                    {t("skills")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {seeker.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
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
        const reviewTone = staffReviewTone(review?.status);
        const rc = toneClasses[reviewTone];
        return (
          <article
            key={item.placementCandidateId}
            className={`rounded-lg border p-4 shadow-sm ${
              review?.status === "NEEDS_ATTENTION"
                ? "border-red-200 bg-red-50/30"
                : "border-zinc-200 bg-white"
            }`}
          >
            <div className="flex flex-col gap-4">
              {/* TOP */}
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-zinc-950">
                        {item.candidate.name}
                      </h3>
                      <p className="truncate text-xs text-zinc-400">
                        {item.placementCandidateId}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-zinc-400">
                        {t("seekerId", { id: item.seekerId })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <Info
                      tone="sky"
                      label={t("nationality")}
                      value={item.candidate.nationality}
                    />
                    <Info
                      tone="violet"
                      label={t("japanese")}
                      value={item.candidate.japanese_level}
                    />
                    <Info
                      tone="amber"
                      label={t("visa")}
                      value={item.candidate.visa_type}
                    />
                    <Info
                      tone="indigo"
                      label={t("desiredJob")}
                      value={item.candidate.desired_job}
                    />
                  </div>
                  {item.candidate.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.candidate.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.rejectionReason && (
                    <div className="mt-3 flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p className="min-w-0 break-words">
                        <strong>{t("providerRejection")}</strong>{" "}
                        {item.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <CandidateStatusBadge status={item.status} />
                </div>
              </div>
              {/* ================================================= */}
              {/* STAFF REVIEW */}
              {/* ================================================= */}
              <div
                className={`overflow-hidden rounded-lg border bg-white ${rc.border}`}
              >
                <div
                  className={`flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5 ${rc.border} ${rc.header}`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-md ${rc.chip}`}
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold ${rc.title}`}>
                        {t("staffReview")}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {t("staffReviewDescription")}
                      </p>
                    </div>
                  </div>
                  <StaffReviewBadge status={review?.status || "NOT_REVIEWED"} />
                </div>
                <div className="space-y-3 p-4 empty:hidden">
                  {review?.status === "NOT_REVIEWED" && (
                    <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <p className="text-sm text-amber-700">
                        {t("notReviewedMessage")}
                      </p>
                    </div>
                  )}
                  {review?.status === "REVIEWED" && (
                    <div className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <p className="text-sm text-emerald-700">
                        {t("reviewedMessage")}
                      </p>
                    </div>
                  )}
                  {review?.status === "NEEDS_ATTENTION" && (
                    <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                      <p className="text-sm text-red-700">
                        {t("needsAttentionMessage")}
                      </p>
                    </div>
                  )}
                  {review && review.status !== "NOT_REVIEWED" && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Info
                        tone={reviewTone}
                        label={t("reviewedBy")}
                        value={review.reviewedByStaffId}
                      />
                      <Info
                        tone={reviewTone}
                        label={t("reviewedAt")}
                        value={formatDateTime(review.reviewedAt, locale)}
                      />
                    </div>
                  )}
                  {review?.note && (
                    <div
                      className={`rounded-lg border p-3 ${
                        review.status === "NEEDS_ATTENTION"
                          ? "border-red-200 bg-red-50"
                          : "border-zinc-200 bg-zinc-50"
                      }`}
                    >
                      <p className="text-xs font-medium text-zinc-500">
                        {t("staffNote")}
                      </p>
                      <p className="mt-1.5 whitespace-pre-wrap text-sm text-zinc-700">
                        {review.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* ================================================= */}
              {/* PIPELINE TIMELINE (one color per stage) */}
              {/* ================================================= */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                <Info tone="sky" label={t("matched")} value={formatDateTime(item.matchedAt, locale)} />
                <Info
                  tone="violet"
                  label={t("providerReviewed")}
                  value={formatDateTime(item.providerReviewedAt, locale)}
                />
                <Info
                  tone="amber"
                  label={t("interview")}
                  value={formatDateTime(item.interviewAt, locale)}
                />
                <Info
                  tone="indigo"
                  label={t("selected")}
                  value={formatDateTime(item.selectedAt, locale)}
                />
                <Info tone="emerald" label={t("placed")} value={formatDateTime(item.placedAt, locale)} />
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

  let classes = "border-zinc-200 bg-zinc-50 text-zinc-700";
  switch (status) {
    case "MATCHED":
      classes = "border-sky-200 bg-sky-50 text-sky-700";
      break;
    case "UNDER_REVIEW":
      classes = "border-amber-200 bg-amber-50 text-amber-700";
      break;
    case "INTERVIEW":
      classes = "border-violet-200 bg-violet-50 text-violet-700";
      break;
    case "SELECTED":
      classes = "border-indigo-200 bg-indigo-50 text-indigo-700";
      break;
    case "PLACED":
      classes = "border-emerald-200 bg-emerald-50 text-emerald-700";
      break;
    case "REJECTED":
      classes = "border-red-200 bg-red-50 text-red-700";
      break;
  }
  return (
    <span
      className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${classes}`}
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
      className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${staffReviewClass(
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
  tone = "zinc",
}: {
  label: string;
  value: string | number | null | undefined;
  tone?: Tone;
}) {
  return (
    <div className={`min-w-0 rounded-md px-3 py-2 ${toneClasses[tone].field}`}>
      <p className="text-[11px] font-medium text-zinc-500">{label}</p>
      <p className="mt-0.5 break-words text-sm font-medium text-zinc-900">
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
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  tone: Tone;
}) {
  const classes = toneClasses[tone];

  return (
    <div
      className={`flex min-w-0 items-center gap-3 rounded-lg border p-3 ${classes.border} ${classes.header}`}
    >
      <span
        aria-hidden="true"
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${classes.chip}`}
      >
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-zinc-600">{label}</p>
        <p className="mt-0.5 text-xl font-semibold leading-tight text-zinc-950">
          {value}
        </p>
      </div>
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
    <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white">
      <div className="max-w-md px-4 text-center">
        <BriefcaseBusiness className="mx-auto h-8 w-8 text-zinc-300" />
        <h3 className="mt-3 font-semibold text-zinc-900">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>
      </div>
    </div>
  );
}