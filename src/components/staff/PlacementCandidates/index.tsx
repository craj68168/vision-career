"use client";

import {
  ClipboardCheck,
  Eye,
  Pencil,
  RefreshCw,
  Search,
} from "lucide-react";

import type { ComponentType } from "react";

import { useTranslations } from "next-intl";

import { getCandidateStatusClass, getReviewClass } from "./helper";

import { useStaffPlacementCandidates } from "./hook";

import CandidateDetails from "./CandidateDetails";

import ReviewCandidateModal from "./ReviewCandidateModal";

import type {
  CandidateStaffReviewStatus,
  PlacementCandidateStatus,
} from "./types";

// ======================================================
// TYPES
// ======================================================

type CandidateRow = ReturnType<
  typeof useStaffPlacementCandidates
>["candidates"][number];

type PipelineFilter = "ALL" | PlacementCandidateStatus;

type ReviewFilter = "ALL" | CandidateStaffReviewStatus;

// ======================================================
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const fieldClass =
  "h-11 w-full rounded-xl bg-white px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 outline-none transition-shadow placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500";

const badgeClass = "rounded-full px-3 py-1 text-xs font-semibold";

const compactBadgeClass =
  "whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold";

// ======================================================
// COMPONENT
// ======================================================

export default function StaffPlacementCandidates() {
  const t = useTranslations("staffPlacementCandidates");

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

  // ====================================================
  // SUMMARY CARDS DOUBLE AS QUICK FILTERS
  // ====================================================

  const applyFilters = (status: PipelineFilter, review: ReviewFilter) => {
    setStatusFilter(status);

    setReviewFilter(review);
  };

  const isFilter = (status: PipelineFilter, review: ReviewFilter) =>
    statusFilter === status && reviewFilter === review;

  // ====================================================
  // SHARED ROW PIECES (used by mobile cards)
  // ====================================================

  const reviewLabel = (item: CandidateRow) =>
    item.staffReview.status === "NOT_REVIEWED"
      ? t("actions.review")
      : t("actions.editReview");

  const renderBadges = (item: CandidateRow) => (
    <>
      <span
        className={`${badgeClass} ${getCandidateStatusClass(item.status)}`}
      >
        {t(`candidateStatuses.${item.status}`)}
      </span>

      <span
        className={`${badgeClass} ${getReviewClass(item.staffReview.status)}`}
      >
        {t(`reviewStatuses.${item.staffReview.status}`)}
      </span>
    </>
  );

  const renderActions = (item: CandidateRow) => (
    <>
      {/* VIEW */}

      <button
        type="button"
        onClick={() => setViewingId(item.placementCandidateId)}
        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-white px-3 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:flex-none"
      >
        <Eye className="h-4 w-4" />

        {t("actions.view")}
      </button>

      {/* REVIEW */}

      <button
        type="button"
        onClick={() => setReviewingCandidate(item)}
        className={`inline-flex h-10 flex-1 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:flex-none ${
          item.staffReview.status === "NEEDS_ATTENTION"
            ? "bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500"
            : "bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500"
        }`}
      >
        {reviewLabel(item)}
      </button>
    </>
  );

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <>
      <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 py-4 sm:space-y-6 sm:p-5 lg:px-8 lg:py-6">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
              {t("title")}
            </h1>

            <p className="mt-1 text-sm text-slate-500">{t("description")}</p>
          </div>

          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refresh()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />

            {t("refresh")}
          </button>
        </div>

        {/* SUMMARY (click a card to filter the list) */}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Summary
            label={t("summary.totalCandidates")}
            value={summary?.total ?? 0}
            accent="indigo"
            active={isFilter("ALL", "ALL")}
            onClick={() => applyFilters("ALL", "ALL")}
          />

          <Summary
            label={t("summary.notReviewed")}
            value={summary?.notReviewed ?? 0}
            accent="amber"
            active={isFilter("ALL", "NOT_REVIEWED")}
            onClick={() => applyFilters("ALL", "NOT_REVIEWED")}
          />

          <Summary
            label={t("summary.reviewed")}
            value={summary?.reviewed ?? 0}
            accent="sky"
            active={isFilter("ALL", "REVIEWED")}
            onClick={() => applyFilters("ALL", "REVIEWED")}
          />

          <Summary
            label={t("summary.needsAttention")}
            value={summary?.needsAttention ?? 0}
            accent="rose"
            active={isFilter("ALL", "NEEDS_ATTENTION")}
            onClick={() => applyFilters("ALL", "NEEDS_ATTENTION")}
          />

          <Summary
            label={t("summary.interview")}
            value={summary?.interview ?? 0}
            accent="violet"
            active={isFilter("INTERVIEW", "ALL")}
            onClick={() => applyFilters("INTERVIEW", "ALL")}
          />

          <Summary
            label={t("summary.placed")}
            value={summary?.placed ?? 0}
            accent="emerald"
            active={isFilter("PLACED", "ALL")}
            onClick={() => applyFilters("PLACED", "ALL")}
          />
        </div>

        {/* FILTERS */}

        <div className="grid gap-3 rounded-2xl bg-white p-3 ring-1 ring-inset ring-slate-200 sm:grid-cols-2 sm:p-4 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className={`${fieldClass} pl-10`}
            />
          </div>

          {/* PIPELINE FILTER */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as PipelineFilter)
            }
            className={fieldClass}
          >
            <option value="ALL">{t("filters.allPipelineStatuses")}</option>

            <option value="MATCHED">{t("candidateStatuses.MATCHED")}</option>

            <option value="UNDER_REVIEW">
              {t("candidateStatuses.UNDER_REVIEW")}
            </option>

            <option value="INTERVIEW">
              {t("candidateStatuses.INTERVIEW")}
            </option>

            <option value="SELECTED">{t("candidateStatuses.SELECTED")}</option>

            <option value="PLACED">{t("candidateStatuses.PLACED")}</option>

            <option value="REJECTED">{t("candidateStatuses.REJECTED")}</option>
          </select>

          {/* STAFF REVIEW FILTER */}

          <select
            value={reviewFilter}
            onChange={(event) =>
              setReviewFilter(event.target.value as ReviewFilter)
            }
            className={fieldClass}
          >
            <option value="ALL">{t("filters.allStaffReviews")}</option>

            <option value="NOT_REVIEWED">
              {t("reviewStatuses.NOT_REVIEWED")}
            </option>

            <option value="REVIEWED">{t("reviewStatuses.REVIEWED")}</option>

            <option value="NEEDS_ATTENTION">
              {t("reviewStatuses.NEEDS_ATTENTION")}
            </option>
          </select>
        </div>

        {/* ERROR */}

        {error && (
          <div
            role="alert"
            className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-inset ring-rose-200"
          >
            {error}
          </div>
        )}

        {/* ================================================= */}
        {/* TABLE (wide screens) */}
        {/* ================================================= */}

        <div className="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 xl:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">{t("table.candidate")}</th>

                  <th className="px-4 py-3">{t("table.company")}</th>

                  <th className="px-4 py-3">{t("table.placementRequest")}</th>

                  <th className="px-4 py-3">{t("table.pipeline")}</th>

                  <th className="px-4 py-3">{t("table.staffReview")}</th>

                  <th className="px-4 py-3">{t("table.japanese")}</th>

                  <th className="px-4 py-3">{t("table.visa")}</th>

                  <th className="px-4 py-3 text-right">{t("table.actions")}</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {isLoading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-slate-500"
                    >
                      {t("loading")}
                    </td>
                  </tr>
                )}

                {!isLoading && candidates.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-slate-500"
                    >
                      {t("empty")}
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  candidates.map((item) => (
                    <tr
                      key={item.placementCandidateId}
                      className="border-t border-slate-100 transition-colors hover:bg-slate-50/70"
                    >
                      {/* CANDIDATE */}

                      <td className="max-w-[240px] px-4 py-2.5">
                        <p
                          className="truncate font-semibold text-slate-950"
                          title={item.candidate.name}
                        >
                          {item.candidate.name}
                        </p>

                        <p
                          className="mt-0.5 truncate text-[11px] text-slate-500"
                          title={item.seekerId}
                        >
                          {item.seekerId}
                        </p>

                        <p
                          className="mt-0.5 truncate text-[11px] text-slate-400"
                          title={item.placementCandidateId}
                        >
                          {item.placementCandidateId}
                        </p>
                      </td>

                      {/* COMPANY */}

                      <td className="max-w-[220px] px-4 py-2.5">
                        <p
                          className="truncate text-slate-800"
                          title={item.provider?.companyName || "-"}
                        >
                          {item.provider?.companyName || "-"}
                        </p>

                        <p
                          className="mt-0.5 truncate text-[11px] text-slate-500"
                          title={item.provider?.name || "-"}
                        >
                          {item.provider?.name || "-"}
                        </p>
                      </td>

                      {/* REQUEST */}

                      <td className="max-w-[220px] px-4 py-2.5">
                        <p
                          className="truncate text-slate-800"
                          title={item.request?.jobTitle || "-"}
                        >
                          {item.request?.jobTitle || "-"}
                        </p>

                        <p
                          className="mt-0.5 truncate text-[11px] text-slate-500"
                          title={item.recruitId}
                        >
                          {item.recruitId}
                        </p>
                      </td>

                      {/* PIPELINE */}

                      <td className="px-4 py-2.5">
                        <span
                          className={`${compactBadgeClass} ${getCandidateStatusClass(
                            item.status,
                          )}`}
                        >
                          {t(`candidateStatuses.${item.status}`)}
                        </span>
                      </td>

                      {/* STAFF REVIEW */}

                      <td className="px-4 py-2.5">
                        <span
                          className={`${compactBadgeClass} ${getReviewClass(
                            item.staffReview.status,
                          )}`}
                        >
                          {t(`reviewStatuses.${item.staffReview.status}`)}
                        </span>

                        {item.staffReview.status === "NEEDS_ATTENTION" &&
                          item.staffReview.note && (
                            <p
                              className="mt-1 max-w-[180px] truncate text-[11px] text-rose-600"
                              title={item.staffReview.note}
                            >
                              {item.staffReview.note}
                            </p>
                          )}
                      </td>

                      {/* JAPANESE */}

                      <td className="whitespace-nowrap px-4 py-2.5 text-slate-700">
                        {item.candidate.japanese_level || "-"}
                      </td>

                      {/* VISA */}

                      <td className="whitespace-nowrap px-4 py-2.5 text-slate-700">
                        {item.candidate.visa_type || "-"}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-4 py-2.5">
                        <div className="flex justify-end gap-1.5">
                          {/* VIEW */}

                          <ActionIconButton
                            label={t("actions.view")}
                            icon={Eye}
                            tone="neutral"
                            onClick={() =>
                              setViewingId(item.placementCandidateId)
                            }
                          />

                          {/* REVIEW */}

                          <ActionIconButton
                            label={reviewLabel(item)}
                            icon={
                              item.staffReview.status === "NOT_REVIEWED"
                                ? ClipboardCheck
                                : Pencil
                            }
                            tone={
                              item.staffReview.status === "NEEDS_ATTENTION"
                                ? "rose"
                                : "indigo"
                            }
                            onClick={() => setReviewingCandidate(item)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================================= */}
        {/* CARDS (phones, tablets, small laptops) */}
        {/* ================================================= */}

        <div className="space-y-3 xl:hidden">
          {isLoading && (
            <div className="rounded-2xl bg-white py-14 text-center text-sm text-slate-500 ring-1 ring-inset ring-slate-200">
              {t("loading")}
            </div>
          )}

          {!isLoading && candidates.length === 0 && (
            <div className="rounded-2xl bg-white py-14 text-center text-sm text-slate-500 ring-1 ring-inset ring-slate-200">
              {t("empty")}
            </div>
          )}

          {!isLoading &&
            candidates.map((item) => (
              <article
                key={item.placementCandidateId}
                className="rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5"
              >
                <div className="min-w-0">
                  <h2 className="break-words font-semibold text-slate-950">
                    {item.candidate.name}
                  </h2>

                  <p className="mt-1 break-all text-xs text-slate-400">
                    {item.seekerId}
                    {" · "}
                    {item.placementCandidateId}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {renderBadges(item)}
                </div>

                {item.staffReview.status === "NEEDS_ATTENTION" &&
                  item.staffReview.note && (
                    <p className="mt-3 break-words text-xs text-rose-600">
                      {item.staffReview.note}
                    </p>
                  )}

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.company")}
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {item.provider?.companyName || "-"}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.placementRequest")}
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {item.request?.jobTitle || "-"}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {item.recruitId}
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {item.provider?.name || "-"}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.japanese")}
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {item.candidate.japanese_level || "-"}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.visa")}
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {item.candidate.visa_type || "-"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  {renderActions(item)}
                </div>
              </article>
            ))}
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
//
// Full class names are written out so Tailwind can
// detect them.
// ======================================================

const summaryAccents = {
  indigo: {
    card: "bg-[linear-gradient(180deg,#eef2ff,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-indigo-200 hover:ring-indigo-400",
    activeRing: "ring-2 ring-inset ring-indigo-500",
    value: "text-slate-950",
  },
  amber: {
    card: "bg-[linear-gradient(180deg,#fffbeb,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-amber-200 hover:ring-amber-400",
    activeRing: "ring-2 ring-inset ring-amber-500",
    value: "text-amber-700",
  },
  emerald: {
    card: "bg-[linear-gradient(180deg,#ecfdf5,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-emerald-200 hover:ring-emerald-400",
    activeRing: "ring-2 ring-inset ring-emerald-500",
    value: "text-slate-950",
  },
  rose: {
    card: "bg-[linear-gradient(180deg,#fff1f2,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-rose-200 hover:ring-rose-400",
    activeRing: "ring-2 ring-inset ring-rose-500",
    value: "text-rose-700",
  },
  sky: {
    card: "bg-[linear-gradient(180deg,#f0f9ff,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-sky-200 hover:ring-sky-400",
    activeRing: "ring-2 ring-inset ring-sky-500",
    value: "text-slate-950",
  },
  violet: {
    card: "bg-[linear-gradient(180deg,#f5f3ff,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-violet-200 hover:ring-violet-400",
    activeRing: "ring-2 ring-inset ring-violet-500",
    value: "text-slate-950",
  },
} as const;

function Summary({
  label,
  value,
  accent,
  active,
  onClick,
}: {
  label: string;

  value: number;

  accent: keyof typeof summaryAccents;

  active: boolean;

  onClick: () => void;
}) {
  const colors = summaryAccents[accent];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-w-0 rounded-xl p-4 text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:p-5 ${
        colors.card
      } ${active ? colors.activeRing : colors.ring}`}
    >
      <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>

      <p
        className={`mt-2 text-[26px] font-bold leading-none tabular-nums sm:text-3xl ${colors.value}`}
      >
        {value}
      </p>
    </button>
  );
}

// ======================================================
// ACTION ICON BUTTON
//
// Icon only; the label appears in a tooltip on hover or
// keyboard focus (and is the accessible name).
// The tooltip is right-aligned so the table's scroll
// container never clips it.
// ======================================================

const actionTones = {
  neutral:
    "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50",
  indigo: "bg-indigo-600 text-white hover:bg-indigo-700",
  rose: "bg-rose-600 text-white hover:bg-rose-700",
} as const;

function ActionIconButton({
  label,
  icon: Icon,
  tone,
  onClick,
}: {
  label: string;

  icon: ComponentType<{ className?: string }>;

  tone: keyof typeof actionTones;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`group relative inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${actionTones[tone]}`}
    >
      <Icon className="h-4 w-4" />

      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full right-0 z-10 mb-2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {label}
      </span>
    </button>
  );
}