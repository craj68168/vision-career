"use client";

import {
  ClipboardCheck,
  Eye,
  Gavel,
  Pencil,
  RefreshCw,
  Search,
} from "lucide-react";

import type { ComponentType } from "react";

import { useQuery } from "@tanstack/react-query";

import { useTranslations } from "next-intl";

import { getCurrentStaff } from "@/components/auth/Staff/api";

import PlacementRequestDecisionModal from "./PlacementRequestDecisionModal";

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

// ======================================================
// TYPES
// ======================================================

type RequestRow = ReturnType<
  typeof useStaffPlacementRequests
>["requests"][number];

type StatusFilter = "ALL" | PlacementRequestStatus;

type ScreeningFilter = "ALL" | PlacementRequestScreeningStatus;

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
    decisionRequest,
    setDecisionRequest,

    isApproving,
    isRejecting,

    approveRequest,
    rejectRequest,
    refresh,
  } = useStaffPlacementRequests();

  const t = useTranslations("staffPlacementRequests");

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

  const canApprove =
    staffQuery.data?.data.permissions.includes("placement_requests:approval") ??
    false;

  // ====================================================
  // SUMMARY CARDS DOUBLE AS QUICK FILTERS
  // ====================================================

  const applyFilters = (status: StatusFilter, screening: ScreeningFilter) => {
    setStatusFilter(status);

    setScreeningFilter(screening);
  };

  const isFilter = (status: StatusFilter, screening: ScreeningFilter) =>
    statusFilter === status && screeningFilter === screening;

  // ====================================================
  // SHARED ROW PIECES (used by mobile cards)
  // ====================================================

  const screenLabel = (request: RequestRow) =>
    request.staffScreening.status === "NOT_SCREENED"
      ? "Screen"
      : "Edit Screening";

  const renderBadges = (request: RequestRow) => (
    <>
      <span
        className={`${badgeClass} ${getRequestStatusClass(request.status)}`}
      >
        {getRequestStatusLabel(request.status)}
      </span>

      <span
        className={`${badgeClass} ${getScreeningClass(
          request.staffScreening.status,
        )}`}
      >
        {getScreeningLabel(request.staffScreening.status)}
      </span>
    </>
  );

  const renderActions = (request: RequestRow) => {
    const pending = request.status === "pending_review";

    return (
      <>
        {/* VIEW */}

        <button
          type="button"
          onClick={() => setViewingId(request.recruitId)}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-white px-3 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:flex-none"
        >
          <Eye className="h-4 w-4" />

          View
        </button>

        {/* SCREEN */}

        {canReview && pending && (
          <button
            type="button"
            onClick={() => setScreeningRequest(request)}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:flex-none"
          >
            {screenLabel(request)}
          </button>
        )}

        {/* APPROVE / REJECT */}

        {canApprove && pending && (
          <button
            type="button"
            onClick={() => setDecisionRequest(request)}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:flex-none"
          >
            {t("reviewDecision")}
          </button>
        )}
      </>
    );
  };

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
              Placement Requests
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review Provider placement requests, screening results and final
              decisions.
            </p>
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
            Refresh
          </button>
        </div>

        {/* SUMMARY (click a card to filter the list) */}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
          <Summary
            label="Total"
            value={summary?.total ?? 0}
            accent="indigo"
            active={isFilter("ALL", "ALL")}
            onClick={() => applyFilters("ALL", "ALL")}
          />

          <Summary
            label="Pending"
            value={summary?.pendingReview ?? 0}
            accent="amber"
            active={isFilter("pending_review", "ALL")}
            onClick={() => applyFilters("pending_review", "ALL")}
          />

          <Summary
            label="Not Screened"
            value={summary?.notScreened ?? 0}
            accent="slate"
            active={isFilter("ALL", "NOT_SCREENED")}
            onClick={() => applyFilters("ALL", "NOT_SCREENED")}
          />

          <Summary
            label="Screened"
            value={summary?.screened ?? 0}
            accent="sky"
            active={isFilter("ALL", "SCREENED")}
            onClick={() => applyFilters("ALL", "SCREENED")}
          />

          <Summary
            label="Needs Attention"
            value={summary?.needsAttention ?? 0}
            accent="rose"
            active={isFilter("ALL", "NEEDS_ATTENTION")}
            onClick={() => applyFilters("ALL", "NEEDS_ATTENTION")}
          />

          <Summary
            label="Approved"
            value={summary?.approved ?? 0}
            accent="emerald"
            active={isFilter("approved", "ALL")}
            onClick={() => applyFilters("approved", "ALL")}
          />

          <Summary
            label="Rejected"
            value={summary?.rejected ?? 0}
            accent="violet"
            active={isFilter("rejected", "ALL")}
            onClick={() => applyFilters("rejected", "ALL")}
          />
        </div>

        {/* FILTERS */}

        <div className="grid gap-3 rounded-2xl bg-white p-3 ring-1 ring-inset ring-slate-200 sm:grid-cols-2 sm:p-4 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search request, company, job title..."
              className={`${fieldClass} pl-10`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className={fieldClass}
          >
            <option value="ALL">All Request Statuses</option>

            <option value="pending_review">Pending Review</option>

            <option value="approved">Approved</option>

            <option value="rejected">Rejected</option>
          </select>

          <select
            value={screeningFilter}
            onChange={(event) =>
              setScreeningFilter(event.target.value as ScreeningFilter)
            }
            className={fieldClass}
          >
            <option value="ALL">All Screening</option>

            <option value="NOT_SCREENED">Not Screened</option>

            <option value="SCREENED">Screened</option>

            <option value="NEEDS_ATTENTION">Needs Attention</option>
          </select>
        </div>

        {/* ================================================= */}
        {/* TABLE (wide screens) */}
        {/* ================================================= */}

        <div className="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 xl:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Request</th>

                  <th className="px-4 py-3">Company</th>

                  <th className="px-4 py-3">Position</th>

                  <th className="px-4 py-3 text-center">People</th>

                  <th className="px-4 py-3">Location</th>

                  <th className="px-4 py-3">Status</th>

                  <th className="px-4 py-3">Screening</th>

                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {isLoading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-slate-500"
                    >
                      Loading placement requests...
                    </td>
                  </tr>
                )}

                {!isLoading && requests.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-slate-500"
                    >
                      No placement requests found.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  requests.map((request) => {
                    const pending = request.status === "pending_review";

                    return (
                      <tr
                        key={request.recruitId}
                        className="border-t border-slate-100 transition-colors hover:bg-slate-50/70"
                      >
                        {/* REQUEST */}

                        <td className="whitespace-nowrap px-4 py-2.5 font-medium text-slate-900">
                          {request.recruitId}
                        </td>

                        {/* COMPANY */}

                        <td className="max-w-[240px] px-4 py-2.5">
                          <p
                            className="truncate font-semibold text-slate-950"
                            title={request.companyName}
                          >
                            {request.companyName}
                          </p>

                          <p
                            className="mt-0.5 truncate text-[11px] text-slate-500"
                            title={request.providerName}
                          >
                            {request.providerName}
                          </p>
                        </td>

                        {/* POSITION */}

                        <td
                          className="max-w-[220px] truncate px-4 py-2.5 text-slate-800"
                          title={request.jobTitle || "-"}
                        >
                          {request.jobTitle || "-"}
                        </td>

                        {/* PEOPLE */}

                        <td className="px-4 py-2.5 text-center font-semibold tabular-nums text-slate-900">
                          {request.numberOfPositions}
                        </td>

                        {/* LOCATION */}

                        <td
                          className="max-w-[200px] truncate px-4 py-2.5 text-slate-700"
                          title={request.workLocation || "-"}
                        >
                          {request.workLocation || "-"}
                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-2.5">
                          <span
                            className={`${compactBadgeClass} ${getRequestStatusClass(
                              request.status,
                            )}`}
                          >
                            {getRequestStatusLabel(request.status)}
                          </span>
                        </td>

                        {/* SCREENING */}

                        <td className="px-4 py-2.5">
                          <span
                            className={`${compactBadgeClass} ${getScreeningClass(
                              request.staffScreening.status,
                            )}`}
                          >
                            {getScreeningLabel(request.staffScreening.status)}
                          </span>

                          {request.staffScreening.status ===
                            "NEEDS_ATTENTION" &&
                            request.staffScreening.note && (
                              <p
                                className="mt-1 max-w-[190px] truncate text-[11px] text-rose-600"
                                title={request.staffScreening.note}
                              >
                                {request.staffScreening.note}
                              </p>
                            )}
                        </td>

                        {/* ACTIONS */}

                        <td className="px-4 py-2.5">
                          <div className="flex justify-end gap-1.5">
                            {/* VIEW */}

                            <ActionIconButton
                              label="View"
                              icon={Eye}
                              tone="neutral"
                              onClick={() => setViewingId(request.recruitId)}
                            />

                            {/* SCREEN */}

                            {canReview && pending && (
                              <ActionIconButton
                                label={screenLabel(request)}
                                icon={
                                  request.staffScreening.status ===
                                  "NOT_SCREENED"
                                    ? ClipboardCheck
                                    : Pencil
                                }
                                tone="indigo"
                                onClick={() => setScreeningRequest(request)}
                              />
                            )}

                            {/* APPROVE / REJECT */}

                            {canApprove && pending && (
                              <ActionIconButton
                                label={t("reviewDecision")}
                                icon={Gavel}
                                tone="emerald"
                                onClick={() => setDecisionRequest(request)}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
              Loading placement requests...
            </div>
          )}

          {!isLoading && requests.length === 0 && (
            <div className="rounded-2xl bg-white py-14 text-center text-sm text-slate-500 ring-1 ring-inset ring-slate-200">
              No placement requests found.
            </div>
          )}

          {!isLoading &&
            requests.map((request) => (
              <article
                key={request.recruitId}
                className="rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5"
              >
                <div className="min-w-0">
                  <h2 className="break-words font-semibold text-slate-950">
                    {request.companyName}
                  </h2>

                  <p className="mt-1 break-all text-xs text-slate-400">
                    {request.recruitId}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {renderBadges(request)}
                </div>

                {request.staffScreening.status === "NEEDS_ATTENTION" &&
                  request.staffScreening.note && (
                    <p className="mt-3 break-words text-xs text-rose-600">
                      {request.staffScreening.note}
                    </p>
                  )}

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Provider
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {request.providerName}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Position
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {request.jobTitle || "-"}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Location
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {request.workLocation || "-"}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      People
                    </dt>

                    <dd className="mt-0.5 font-semibold tabular-nums text-slate-900">
                      {request.numberOfPositions}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  {renderActions(request)}
                </div>
              </article>
            ))}
        </div>

        {/* PERMISSION NOTICE */}

        {!canReview && (
          <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700 ring-1 ring-inset ring-blue-200">
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
          canApprove={canApprove}
          onClose={() => setViewingId(null)}
          onScreen={(request) => {
            setViewingId(null);

            setScreeningRequest(request);
          }}
          onDecision={(request) => {
            setViewingId(null);

            setDecisionRequest(request);
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

      {/* APPROVE / REJECT */}

      <PlacementRequestDecisionModal
        request={decisionRequest}
        isApproving={isApproving}
        isRejecting={isRejecting}
        onClose={() => setDecisionRequest(null)}
        onApprove={approveRequest}
        onReject={rejectRequest}
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
  slate: {
    card: "bg-[linear-gradient(180deg,#f1f5f9,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-slate-200 hover:ring-slate-400",
    activeRing: "ring-2 ring-inset ring-slate-500",
    value: "text-slate-950",
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
  emerald: "bg-emerald-600 text-white hover:bg-emerald-700",
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