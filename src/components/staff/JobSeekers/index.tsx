"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Eye,
  Gavel,
  Pencil,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";

import type { ComponentType } from "react";

import { useTranslations } from "next-intl";

import { useQuery } from "@tanstack/react-query";

import { getCurrentStaff } from "@/components/auth/Staff/api";

import ApprovalDecisionModal from "./ApprovalDecisionModal";

import { getAccountClass, getApprovalClass, getScreeningClass } from "./helper";

import { useStaffJobSeekers } from "./hook";

import JobSeekerDetails from "./JobSeekerDetails";

import ScreenSeekerModal from "./ScreenSeekerModal";

import type {
  AccountStatus,
  ApprovalStatus,
  PlacementStatus,
  SeekerScreeningStatus,
  StaffSeeker,
} from "./types";

// ======================================================
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const fieldClass =
  "h-11 w-full rounded-xl bg-white px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 outline-none transition-shadow placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500";

const badgeClass = "rounded-full border px-3 py-1 text-xs font-semibold";

const compactBadgeClass =
  "whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold";

const pagerControl =
  "h-9 rounded-lg bg-white text-sm text-slate-700 ring-1 ring-inset ring-slate-200 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500";

export default function StaffJobSeekers() {
  const t = useTranslations("staffJobSeekers");

  const {
    seekers,
    summary,
    pagination,

    search,
    approvalStatus,
    accountStatus,
    placementStatus,
    screeningStatus,

    page,
    limit,

    viewingSeeker,
    setViewingSeeker,

    screeningSeeker,
    setScreeningSeeker,

    approvalSeeker,
    setApprovalSeeker,

    isLoading,
    isFetching,
    isScreening,
    isApproving,
    isDownloading,

    setSearch,
    setApprovalStatus,
    setAccountStatus,
    setPlacementStatus,
    setScreeningStatus,

    setPage,
    changeLimit,

    openView,
    downloadResume,
    submitScreening,
    submitApproval,

    refresh,
  } = useStaffJobSeekers();

  // ====================================================
  // CURRENT STAFF
  // ====================================================

  const staffQuery = useQuery({
    queryKey: ["current-staff"],

    queryFn: getCurrentStaff,
  });

  const canManage =
    staffQuery.data?.data.permissions.includes("seekers:manage") ?? false;

  const canApprove =
    staffQuery.data?.data.permissions.includes("seekers:approval") ?? false;

  const approvalLabel = (status: ApprovalStatus) => {
    if (status === "approved") {
      return t("statuses.approval.approved");
    }

    if (status === "rejected") {
      return t("statuses.approval.rejected");
    }

    return t("statuses.approval.pending");
  };

  const accountLabel = (status: AccountStatus) => {
    if (status === "active") {
      return t("statuses.account.active");
    }

    if (status === "suspended") {
      return t("statuses.account.suspended");
    }

    return t("statuses.account.inactive");
  };

  const placementLabel = (status: PlacementStatus) => {
    if (status === "matching") {
      return t("statuses.placement.matching");
    }

    if (status === "interview") {
      return t("statuses.placement.interview");
    }

    if (status === "selected") {
      return t("statuses.placement.selected");
    }

    if (status === "placed") {
      return t("statuses.placement.placed");
    }

    return t("statuses.placement.unplaced");
  };

  const screeningLabel = (status: SeekerScreeningStatus) => {
    if (status === "SCREENED") {
      return t("statuses.screening.screened");
    }

    if (status === "NEEDS_ATTENTION") {
      return t("statuses.screening.needsAttention");
    }

    return t("statuses.screening.notScreened");
  };

  // ====================================================
  // SUMMARY CARDS DOUBLE AS QUICK FILTERS
  // ====================================================

  const applyFilters = (
    approval: "" | ApprovalStatus,
    screening: "" | SeekerScreeningStatus,
  ) => {
    setApprovalStatus(approval);

    setScreeningStatus(screening);
  };

  const isFilter = (
    approval: "" | ApprovalStatus,
    screening: "" | SeekerScreeningStatus,
  ) => approvalStatus === approval && screeningStatus === screening;

  // ====================================================
  // SHARED ROW PIECES (used by mobile cards)
  // ====================================================

  const renderBadges = (seeker: StaffSeeker) => (
    <>
      <span
        className={`${badgeClass} ${getApprovalClass(seeker.approval_status)}`}
      >
        {approvalLabel(seeker.approval_status)}
      </span>

      <span
        className={`${badgeClass} ${getAccountClass(seeker.account_status)}`}
      >
        {accountLabel(seeker.account_status)}
      </span>

      <span
        className={`${badgeClass} ${getScreeningClass(
          seeker.staffScreening.status,
        )}`}
      >
        {screeningLabel(seeker.staffScreening.status)}
      </span>
    </>
  );

  const renderActions = (seeker: StaffSeeker) => {
    const pending = seeker.approval_status === "pending";

    return (
      <>
        {/* VIEW */}

        <button
          type="button"
          onClick={() => void openView(seeker)}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-white px-3 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:flex-none"
        >
          <Eye className="h-4 w-4" />

          {t("view")}
        </button>

        {/* SCREEN */}

        {canManage && pending && (
          <button
            type="button"
            onClick={() => setScreeningSeeker(seeker)}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:flex-none"
          >
            {seeker.staffScreening.status === "NOT_SCREENED"
              ? t("table.screen")
              : t("table.editScreening")}
          </button>
        )}

        {/* APPROVE / REJECT */}

        {canApprove && pending && (
          <button
            type="button"
            onClick={() => setApprovalSeeker(seeker)}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:flex-none"
          >
            {t("table.approveReject")}
          </button>
        )}
      </>
    );
  };

  return (
    <>
      <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 py-4 sm:space-y-6 sm:p-5 lg:px-8 lg:py-6">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
              {t("page.title")}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {t("page.description")}
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

            {t("refresh")}
          </button>
        </div>

        {/* SUMMARY (click a card to filter the list) */}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          <Summary
            label={t("summary.total")}
            value={summary?.total ?? 0}
            icon={UserRound}
            accent="indigo"
            active={isFilter("", "")}
            onClick={() => applyFilters("", "")}
          />

          <Summary
            label={t("summary.pendingApproval")}
            value={summary?.pendingApproval ?? 0}
            icon={Clock}
            accent="amber"
            active={isFilter("pending", "")}
            onClick={() => applyFilters("pending", "")}
          />

          <Summary
            label={t("summary.notScreened")}
            value={summary?.notScreened ?? 0}
            icon={ClipboardCheck}
            accent="slate"
            active={isFilter("", "NOT_SCREENED")}
            onClick={() => applyFilters("", "NOT_SCREENED")}
          />

          <Summary
            label={t("summary.screened")}
            value={summary?.screened ?? 0}
            icon={CheckCircle2}
            accent="emerald"
            active={isFilter("", "SCREENED")}
            onClick={() => applyFilters("", "SCREENED")}
          />

          <Summary
            label={t("summary.needsAttention")}
            value={summary?.needsAttention ?? 0}
            icon={AlertTriangle}
            accent="rose"
            active={isFilter("", "NEEDS_ATTENTION")}
            onClick={() => applyFilters("", "NEEDS_ATTENTION")}
          />
        </div>

        {/* FILTERS */}

        <div className="grid gap-3 rounded-2xl bg-white p-3 ring-1 ring-inset ring-slate-200 sm:grid-cols-2 sm:p-4 xl:grid-cols-[1fr_170px_170px_170px_180px]">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("filters.search")}
              className={`${fieldClass} pl-10`}
            />
          </div>

          <select
            value={approvalStatus}
            onChange={(event) =>
              setApprovalStatus(event.target.value as "" | ApprovalStatus)
            }
            className={fieldClass}
          >
            <option value="">{t("filters.allApprovals")}</option>

            <option value="pending">{t("statuses.approval.pending")}</option>

            <option value="approved">{t("statuses.approval.approved")}</option>

            <option value="rejected">{t("statuses.approval.rejected")}</option>
          </select>

          <select
            value={accountStatus}
            onChange={(event) =>
              setAccountStatus(event.target.value as "" | AccountStatus)
            }
            className={fieldClass}
          >
            <option value="">{t("filters.allAccounts")}</option>

            <option value="active">{t("statuses.account.active")}</option>

            <option value="inactive">{t("statuses.account.inactive")}</option>

            <option value="suspended">{t("statuses.account.suspended")}</option>
          </select>

          <select
            value={placementStatus}
            onChange={(event) =>
              setPlacementStatus(event.target.value as "" | PlacementStatus)
            }
            className={fieldClass}
          >
            <option value="">{t("filters.allPlacement")}</option>

            <option value="unplaced">{t("statuses.placement.unplaced")}</option>

            <option value="matching">{t("statuses.placement.matching")}</option>

            <option value="interview">
              {t("statuses.placement.interview")}
            </option>

            <option value="selected">{t("statuses.placement.selected")}</option>

            <option value="placed">{t("statuses.placement.placed")}</option>
          </select>

          <select
            value={screeningStatus}
            onChange={(event) =>
              setScreeningStatus(
                event.target.value as "" | SeekerScreeningStatus,
              )
            }
            className={fieldClass}
          >
            <option value="">{t("filters.allScreening")}</option>

            <option value="NOT_SCREENED">
              {t("statuses.screening.notScreened")}
            </option>

            <option value="SCREENED">{t("statuses.screening.screened")}</option>

            <option value="NEEDS_ATTENTION">
              {t("statuses.screening.needsAttention")}
            </option>
          </select>
        </div>

        {/* ================================================= */}
        {/* TABLE (wide screens) */}
        {/* ================================================= */}

        <div className="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 xl:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px]">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">{t("table.id")}</th>

                  <th className="px-4 py-3">{t("table.jobSeeker")}</th>

                  <th className="px-4 py-3">{t("table.approval")}</th>

                  <th className="px-4 py-3">{t("table.account")}</th>

                  <th className="px-4 py-3">{t("table.placement")}</th>

                  <th className="px-4 py-3">{t("table.screening")}</th>

                  <th className="px-4 py-3 text-center">
                    {t("table.applications")}
                  </th>

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
                      {t("table.loading")}
                    </td>
                  </tr>
                )}

                {!isLoading && seekers.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-slate-500"
                    >
                      {t("table.empty")}
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  seekers.map((seeker) => {
                    const pending = seeker.approval_status === "pending";

                    return (
                      <tr
                        key={seeker.seeker_id}
                        className="border-t border-slate-100 transition-colors hover:bg-slate-50/70"
                      >
                        <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">
                          {seeker.seeker_id}
                        </td>

                        <td className="max-w-[260px] px-4 py-2.5">
                          <p
                            className="truncate font-semibold text-slate-950"
                            title={seeker.name}
                          >
                            {seeker.name}
                          </p>

                          <p
                            className="mt-0.5 truncate text-[11px] text-slate-500"
                            title={seeker.email}
                          >
                            {seeker.email}
                          </p>
                        </td>

                        <td className="px-4 py-2.5">
                          <span
                            className={`${compactBadgeClass} ${getApprovalClass(
                              seeker.approval_status,
                            )}`}
                          >
                            {approvalLabel(seeker.approval_status)}
                          </span>
                        </td>

                        <td className="px-4 py-2.5">
                          <span
                            className={`${compactBadgeClass} ${getAccountClass(
                              seeker.account_status,
                            )}`}
                          >
                            {accountLabel(seeker.account_status)}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-2.5 font-medium text-slate-800">
                          {placementLabel(seeker.placement_status)}
                        </td>

                        <td className="px-4 py-2.5">
                          <span
                            className={`${compactBadgeClass} ${getScreeningClass(
                              seeker.staffScreening.status,
                            )}`}
                          >
                            {screeningLabel(seeker.staffScreening.status)}
                          </span>
                        </td>

                        <td className="px-4 py-2.5 text-center font-semibold tabular-nums text-slate-900">
                          {seeker.applications_count}
                        </td>

                        <td className="px-4 py-2.5">
                          <div className="flex justify-end gap-1.5">
                            {/* VIEW */}

                            <ActionIconButton
                              label={t("view")}
                              icon={Eye}
                              tone="neutral"
                              onClick={() => void openView(seeker)}
                            />

                            {/* SCREEN */}

                            {canManage && pending && (
                              <ActionIconButton
                                label={
                                  seeker.staffScreening.status ===
                                  "NOT_SCREENED"
                                    ? t("table.screen")
                                    : t("table.editScreening")
                                }
                                icon={
                                  seeker.staffScreening.status ===
                                  "NOT_SCREENED"
                                    ? ClipboardCheck
                                    : Pencil
                                }
                                tone="indigo"
                                onClick={() => setScreeningSeeker(seeker)}
                              />
                            )}

                            {/* APPROVE / REJECT */}

                            {canApprove && pending && (
                              <ActionIconButton
                                label={t("table.approveReject")}
                                icon={Gavel}
                                tone="emerald"
                                onClick={() => setApprovalSeeker(seeker)}
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
              {t("table.loading")}
            </div>
          )}

          {!isLoading && seekers.length === 0 && (
            <div className="rounded-2xl bg-white py-14 text-center text-sm text-slate-500 ring-1 ring-inset ring-slate-200">
              {t("table.empty")}
            </div>
          )}

          {!isLoading &&
            seekers.map((seeker) => (
              <article
                key={seeker.seeker_id}
                className="rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5"
              >
                <div className="min-w-0">
                  <h2 className="break-words font-semibold text-slate-950">
                    {seeker.name}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {seeker.seeker_id}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {renderBadges(seeker)}
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("details.email")}
                    </dt>

                    <dd className="mt-0.5 break-all text-slate-900">
                      {seeker.email}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.placement")}
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {placementLabel(seeker.placement_status)}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.applications")}
                    </dt>

                    <dd className="mt-0.5 font-semibold tabular-nums text-slate-900">
                      {seeker.applications_count}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  {renderActions(seeker)}
                </div>
              </article>
            ))}
        </div>

        {/* PAGINATION */}

        <div className="flex flex-col gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-inset ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {t("pagination.records", {
              count: pagination?.total ?? 0,
            })}
          </p>

          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(event) => changeLimit(Number(event.target.value))}
              className={`${pagerControl} px-3`}
            >
              <option value={10}>
                {t("pagination.perPage", { count: 10 })}
              </option>

              <option value={20}>
                {t("pagination.perPage", { count: 20 })}
              </option>

              <option value={50}>
                {t("pagination.perPage", { count: 50 })}
              </option>
            </select>

            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className={`${pagerControl} inline-flex w-9 items-center justify-center hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="min-w-16 text-center text-sm tabular-nums text-slate-700">
              {page} / {pagination?.pages ?? 1}
            </span>

            <button
              type="button"
              disabled={page >= (pagination?.pages ?? 1)}
              onClick={() => setPage(page + 1)}
              className={`${pagerControl} inline-flex w-9 items-center justify-center hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PERMISSION NOTICE */}

        {!canManage && !canApprove && (
          <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700 ring-1 ring-inset ring-blue-200">
            {t("permissions.viewOnly")}
          </div>
        )}

        {canManage && !canApprove && (
          <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700 ring-1 ring-inset ring-blue-200">
            {t("permissions.screenOnly")}
          </div>
        )}

        {!canManage && canApprove && (
          <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700 ring-1 ring-inset ring-blue-200">
            {t("permissions.approvalOnly")}
          </div>
        )}
      </main>

      {/* DETAILS */}

      <JobSeekerDetails
        seeker={viewingSeeker}
        canManage={canManage}
        canApprove={canApprove}
        isDownloading={isDownloading}
        onClose={() => setViewingSeeker(null)}
        onScreen={(seeker) => {
          setViewingSeeker(null);

          setScreeningSeeker(seeker);
        }}
        onApprove={(seeker) => {
          setViewingSeeker(null);

          setApprovalSeeker(seeker);
        }}
        onDownloadResume={(seeker) => void downloadResume(seeker)}
      />

      {/* SCREEN */}

      <ScreenSeekerModal
        seeker={screeningSeeker}
        isSaving={isScreening}
        onClose={() => setScreeningSeeker(null)}
        onSubmit={submitScreening}
      />

      {/* APPROVAL */}

      <ApprovalDecisionModal
        seeker={approvalSeeker}
        isSaving={isApproving}
        onClose={() => setApprovalSeeker(null)}
        onSubmit={submitApproval}
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
    chip: "text-indigo-600 ring-indigo-200",
    value: "text-slate-950",
  },
  amber: {
    card: "bg-[linear-gradient(180deg,#fffbeb,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-amber-200 hover:ring-amber-400",
    activeRing: "ring-2 ring-inset ring-amber-500",
    chip: "text-amber-700 ring-amber-200",
    value: "text-amber-700",
  },
  slate: {
    card: "bg-[linear-gradient(180deg,#f1f5f9,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-slate-200 hover:ring-slate-400",
    activeRing: "ring-2 ring-inset ring-slate-500",
    chip: "text-slate-600 ring-slate-200",
    value: "text-slate-950",
  },
  emerald: {
    card: "bg-[linear-gradient(180deg,#ecfdf5,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-emerald-200 hover:ring-emerald-400",
    activeRing: "ring-2 ring-inset ring-emerald-500",
    chip: "text-emerald-600 ring-emerald-200",
    value: "text-slate-950",
  },
  rose: {
    card: "bg-[linear-gradient(180deg,#fff1f2,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-rose-200 hover:ring-rose-400",
    activeRing: "ring-2 ring-inset ring-rose-500",
    chip: "text-rose-600 ring-rose-200",
    value: "text-rose-700",
  },
} as const;

function Summary({
  label,
  value,
  icon: Icon,
  accent,
  active,
  onClick,
}: {
  label: string;

  value: number;

  icon: ComponentType<{ className?: string }>;

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
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>

        <span
          aria-hidden="true"
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white ring-1 ring-inset ${colors.chip}`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>

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