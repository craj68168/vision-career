"use client";
import { useTranslations } from "next-intl";

import type { ComponentType } from "react";
import {
  CheckCircle2,
  Clock3,
  Eye,
  RefreshCw,
  Search,
  ShieldAlert,
  Users,
  XCircle,
} from "lucide-react";
import { useAdminPlacementRequests } from "./hook";
import type {
  PlacementRequestScreeningStatus,
  PlacementRequestStatus,
} from "./types";
import CandidatesModal from "./CandidatesModal";
import DetailsModal from "./DetailsModal";
import StatusModal from "./StatusModal";
// ======================================================
// REQUEST STATUS
// ======================================================
const statusClass = (status: PlacementRequestStatus) => {
  switch (status) {
    case "approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";
    case "rejected":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";
    case "pending_review":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300";
    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";
  }
};
// ======================================================
// STAFF SCREENING
// ======================================================
const screeningClass = (status: PlacementRequestScreeningStatus) => {
  switch (status) {
    case "SCREENED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";
    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";
    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";
  }
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

const selectClass =
  "h-9 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white";
// ======================================================
// PAGE
// ======================================================
export default function PlacementRequests() {
  const t = useTranslations("adminPlacementRequests");

  const statusLabel = (status: PlacementRequestStatus) => {
    switch (status) {
      case "pending_review": return t("pendingReview");
      case "approved": return t("approved");
      case "rejected": return t("rejected");
      default: return t("draft");
    }
  };

  const screeningLabel = (status: PlacementRequestScreeningStatus) => {
    switch (status) {
      case "SCREENED": return t("screened");
      case "NEEDS_ATTENTION": return t("needsAttention");
      default: return t("notScreened");
    }
  };

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

  const setStatusSummary = (status: "ALL" | PlacementRequestStatus) => {
    setStatusFilter(status);
    setScreeningFilter("ALL");
  };

  const setScreeningSummary = (
    status: "ALL" | PlacementRequestScreeningStatus,
  ) => {
    setScreeningFilter(status);
    setStatusFilter("ALL");
  };

  return (
    <div className="min-w-0 space-y-4">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white sm:text-2xl">
            {t("title")}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {t("description")}
          </p>
        </div>
        <button
          type="button"
          disabled={isFetching}
          onClick={() => void refresh()}
          className={`inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />{t("refresh")}</button>
      </div>
      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Summary
          label={t("totalRequests")}
          value={summary?.total ?? 0}
          icon={Users}
          isActive={statusFilter === "ALL" && screeningFilter === "ALL"}
          onClick={() => setStatusSummary("ALL")}
        />
        <Summary
          label={t("pendingReview")}
          value={summary?.pendingReview ?? 0}
          icon={Clock3}
          isActive={statusFilter === "pending_review"}
          onClick={() => setStatusSummary("pending_review")}
        />
        <Summary
          label={t("approved")}
          value={summary?.approved ?? 0}
          icon={CheckCircle2}
          isActive={statusFilter === "approved"}
          onClick={() => setStatusSummary("approved")}
        />
        <Summary
          label={t("rejected")}
          value={summary?.rejected ?? 0}
          icon={XCircle}
          isActive={statusFilter === "rejected"}
          onClick={() => setStatusSummary("rejected")}
        />
      </div>
      {/* STAFF SCREENING SUMMARY */}
      <div className="grid gap-3 sm:grid-cols-3">
        <ScreeningSummary
          label={t("notScreened")}
          value={summary?.notScreened ?? 0}
          className="border-zinc-200 bg-white text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
          isActive={screeningFilter === "NOT_SCREENED"}
          onClick={() => setScreeningSummary("NOT_SCREENED")}
        />
        <ScreeningSummary
          label={t("staffScreened")}
          value={summary?.screened ?? 0}
          className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"
          isActive={screeningFilter === "SCREENED"}
          onClick={() => setScreeningSummary("SCREENED")}
        />
        <ScreeningSummary
          label={t("needsAttention")}
          value={summary?.needsAttention ?? 0}
          className="border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300"
          isActive={screeningFilter === "NEEDS_ATTENTION"}
          onClick={() => setScreeningSummary("NEEDS_ATTENTION")}
        />
      </div>
      {/* ================================================= */}
      {/* FILTER */}
      {/* ================================================= */}
      <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="grid gap-2.5 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusSummary(event.target.value as "ALL" | PlacementRequestStatus)
            }
            className={selectClass}
          >
            <option value="ALL">{t("allStatuses")}</option>
            <option value="pending_review">{t("pendingReview")}</option>
            <option value="approved">{t("approved")}</option>
            <option value="rejected">{t("rejected")}</option>
          </select>
        </div>
      </div>
      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] text-left">
            <thead className="bg-zinc-50 text-xs text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-2 font-medium">{t("request")}</th>
                <th className="px-4 py-2 font-medium">{t("company")}</th>
                <th className="px-4 py-2 font-medium">{t("position")}</th>
                <th className="px-4 py-2 text-center font-medium">{t("people")}</th>
                <th className="px-4 py-2 font-medium">{t("location")}</th>
                <th className="px-4 py-2 font-medium">{t("status")}</th>
                <th className="px-4 py-2 font-medium">{t("staffScreening")}</th>
                <th className="px-4 py-2 text-right font-medium">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-14 text-center text-sm text-zinc-500 dark:text-zinc-400"
                  >{t("loading")}</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-14 text-center text-sm text-zinc-500 dark:text-zinc-400"
                  >{t("empty")}</td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr
                    key={request.recruitId}
                    className="transition hover:bg-zinc-50 dark:hover:bg-white/5"
                  >
                    {/* REQUEST */}
                    <td className="whitespace-nowrap px-4 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      {request.recruitId}
                    </td>
                    {/* COMPANY */}
                    <td className="px-4 py-2">
                      <p className="font-medium text-zinc-950 dark:text-white">
                        {request.companyName}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        {request.providerName}
                      </p>
                    </td>
                    {/* POSITION */}
                    <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">
                      {request.jobTitle || "-"}
                    </td>
                    {/* PEOPLE */}
                    <td className="px-4 py-2 text-center text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {request.numberOfPositions}
                    </td>
                    {/* LOCATION */}
                    <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">
                      {request.workLocation || "-"}
                    </td>
                    {/* REQUEST STATUS */}
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClass(
                          request.status,
                        )}`}
                      >
                        {statusLabel(request.status)}
                      </span>
                    </td>
                    {/* STAFF SCREENING */}
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${screeningClass(
                          request.staffScreening.status,
                        )}`}
                      >
                        {screeningLabel(request.staffScreening.status)}
                      </span>
                      {request.staffScreening.status === "NEEDS_ATTENTION" &&
                        request.staffScreening.note && (
                          <p className="mt-1 max-w-[190px] truncate text-xs text-red-500 dark:text-red-300">
                            {request.staffScreening.note}
                          </p>
                        )}
                    </td>
                    {/* ACTIONS */}
                    <td className="px-4 py-2">
                      <div className="flex justify-end gap-1.5">
                        {/* VIEW */}
                        <button
                          type="button"
                          onClick={() => setViewingId(request.recruitId)}
                          className={`inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
                        >
                          <Eye className="h-4 w-4" />
            {t("view")}
          </button>
                        {/* ADMIN REVIEW */}
                        {request.status === "pending_review" && (
                          <button
                            type="button"
                            onClick={() => setReviewingRequest(request)}
                            className={`h-8 cursor-pointer rounded-lg px-3 text-xs font-medium text-white transition ${focusRing} ${
                              request.staffScreening.status ===
                              "NEEDS_ATTENTION"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-emerald-600 hover:bg-emerald-700"
                            }`}
                          >{t("review")}</button>
                        )}
                        {/* CANDIDATES */}
                        {request.status === "approved" && (
                          <button
                            type="button"
                            onClick={() => openCandidates(request)}
                            className={`inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-medium text-white transition hover:bg-emerald-700 ${focusRing}`}
                          >
                            <Users className="h-4 w-4" />
            {t("manageCandidates")}
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
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`min-w-0 cursor-pointer rounded-lg border bg-white p-3 text-left shadow-sm transition hover:border-emerald-500/50 hover:shadow-md dark:bg-zinc-900 ${focusRing} ${
        isActive
          ? "border-emerald-500 ring-2 ring-emerald-500/20"
          : "border-zinc-200 dark:border-white/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </p>
          <p className="mt-0.5 text-xl font-semibold leading-tight text-zinc-950 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </button>
  );
}
// ======================================================
// SCREENING SUMMARY
// ======================================================
function ScreeningSummary({
  label,
  value,
  className,
  isActive,
  onClick,
}: {
  label: string;
  value: number;
  className: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`cursor-pointer rounded-lg border p-3 text-left shadow-sm transition hover:border-emerald-500/50 hover:shadow-md ${focusRing} ${className} ${
        isActive ? "ring-2 ring-emerald-500/20" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-current/10">
          <ShieldAlert className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium">{label}</p>
          <p className="mt-0.5 text-xl font-semibold leading-tight">{value}</p>
        </div>
      </div>
    </button>
  );
}
