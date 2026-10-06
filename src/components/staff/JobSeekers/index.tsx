"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";

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
} from "./types";

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

  return (
    <>
      <main className="mx-auto w-full max-w-7xl space-y-6 px-6 py-10">
        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("page.title")}</h1>

            <p className="mt-1 text-sm text-slate-500">
              {t("page.description")}
            </p>
          </div>

          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refresh()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />

            {t("refresh")}
          </button>
        </div>

        {/* SUMMARY */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Summary label={t("summary.total")} value={summary?.total ?? 0} />

          <Summary
            label={t("summary.pendingApproval")}
            value={summary?.pendingApproval ?? 0}
          />

          <Summary
            label={t("summary.notScreened")}
            value={summary?.notScreened ?? 0}
          />

          <Summary
            label={t("summary.screened")}
            value={summary?.screened ?? 0}
          />

          <Summary
            label={t("summary.needsAttention")}
            value={summary?.needsAttention ?? 0}
          />
        </div>

        {/* FILTERS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="grid gap-3 xl:grid-cols-[1fr_170px_170px_170px_180px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("filters.search")}
                className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 outline-none"
              />
            </div>

            <select
              value={approvalStatus}
              onChange={(event) =>
                setApprovalStatus(event.target.value as "" | ApprovalStatus)
              }
              className="h-12 rounded-xl border border-slate-200 px-3"
            >
              <option value="">{t("filters.allApprovals")}</option>

              <option value="pending">{t("statuses.approval.pending")}</option>

              <option value="approved">
                {t("statuses.approval.approved")}
              </option>

              <option value="rejected">
                {t("statuses.approval.rejected")}
              </option>
            </select>

            <select
              value={accountStatus}
              onChange={(event) =>
                setAccountStatus(event.target.value as "" | AccountStatus)
              }
              className="h-12 rounded-xl border border-slate-200 px-3"
            >
              <option value="">{t("filters.allAccounts")}</option>

              <option value="active">{t("statuses.account.active")}</option>

              <option value="inactive">{t("statuses.account.inactive")}</option>

              <option value="suspended">
                {t("statuses.account.suspended")}
              </option>
            </select>

            <select
              value={placementStatus}
              onChange={(event) =>
                setPlacementStatus(event.target.value as "" | PlacementStatus)
              }
              className="h-12 rounded-xl border border-slate-200 px-3"
            >
              <option value="">{t("filters.allPlacement")}</option>

              <option value="unplaced">
                {t("statuses.placement.unplaced")}
              </option>

              <option value="matching">
                {t("statuses.placement.matching")}
              </option>

              <option value="interview">
                {t("statuses.placement.interview")}
              </option>

              <option value="selected">
                {t("statuses.placement.selected")}
              </option>

              <option value="placed">{t("statuses.placement.placed")}</option>
            </select>

            <select
              value={screeningStatus}
              onChange={(event) =>
                setScreeningStatus(
                  event.target.value as "" | SeekerScreeningStatus,
                )
              }
              className="h-12 rounded-xl border border-slate-200 px-3"
            >
              <option value="">{t("filters.allScreening")}</option>

              <option value="NOT_SCREENED">
                {t("statuses.screening.notScreened")}
              </option>

              <option value="SCREENED">
                {t("statuses.screening.screened")}
              </option>

              <option value="NEEDS_ATTENTION">
                {t("statuses.screening.needsAttention")}
              </option>
            </select>
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase text-slate-500">
                  <th className="px-5 py-4">{t("table.id")}</th>

                  <th className="px-5 py-4">{t("table.jobSeeker")}</th>

                  <th className="px-5 py-4">{t("table.approval")}</th>

                  <th className="px-5 py-4">{t("table.account")}</th>

                  <th className="px-5 py-4">{t("table.placement")}</th>

                  <th className="px-5 py-4">{t("table.screening")}</th>

                  <th className="px-5 py-4 text-center">
                    {t("table.applications")}
                  </th>

                  <th className="px-5 py-4 text-right">{t("table.actions")}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-slate-500"
                    >
                      {t("table.loading")}
                    </td>
                  </tr>
                ) : seekers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-slate-500"
                    >
                      {t("table.empty")}
                    </td>
                  </tr>
                ) : (
                  seekers.map((seeker) => (
                    <tr key={seeker.seeker_id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {seeker.seeker_id}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold">{seeker.name}</p>

                        <p className="mt-1 text-xs text-slate-500">
                          {seeker.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getApprovalClass(
                            seeker.approval_status,
                          )}`}
                        >
                          {approvalLabel(seeker.approval_status)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getAccountClass(
                            seeker.account_status,
                          )}`}
                        >
                          {accountLabel(seeker.account_status)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium">
                        {placementLabel(seeker.placement_status)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getScreeningClass(
                            seeker.staffScreening.status,
                          )}`}
                        >
                          {screeningLabel(seeker.staffScreening.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center font-semibold">
                        {seeker.applications_count}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => void openView(seeker)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium"
                          >
                            <Eye className="h-3.5 w-3.5" />

                            {t("view")}
                          </button>

                          {canManage &&
                            seeker.approval_status === "pending" && (
                              <button
                                type="button"
                                onClick={() => setScreeningSeeker(seeker)}
                                className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white"
                              >
                                {seeker.staffScreening.status === "NOT_SCREENED"
                                  ? t("table.screen")
                                  : t("table.editScreening")}
                              </button>
                            )}

                          {canApprove &&
                            seeker.approval_status === "pending" && (
                              <button
                                type="button"
                                onClick={() => setApprovalSeeker(seeker)}
                                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                              >
                                {t("table.approveReject")}
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

          {/* PAGINATION */}

          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {t("pagination.records", {
                count: pagination?.total ?? 0,
              })}
            </p>

            <div className="flex items-center gap-2">
              <select
                value={limit}
                onChange={(event) => changeLimit(Number(event.target.value))}
                className="rounded-lg border border-slate-200 px-3 py-2"
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
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="min-w-16 text-center text-sm">
                {page} / {pagination?.pages ?? 1}
              </span>

              <button
                type="button"
                disabled={page >= (pagination?.pages ?? 1)}
                onClick={() => setPage(page + 1)}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {!canManage && !canApprove && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            {t("permissions.viewOnly")}
          </div>
        )}

        {canManage && !canApprove && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            {t("permissions.screenOnly")}
          </div>
        )}

        {!canManage && canApprove && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
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
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>

        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <UserRound className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
