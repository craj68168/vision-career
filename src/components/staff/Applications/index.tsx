"use client";

import { Eye, RefreshCw, Search } from "lucide-react";

import { useTranslations } from "next-intl";

import { useQuery } from "@tanstack/react-query";

import { getCurrentStaff } from "@/components/auth/Staff/api";

import ApplicationDetails from "./ApplicationDetails";

import ApplicationDecisionModal from "./RejectApplicationModal";

import ScreenApplicationModal from "./ScreenApplicationModal";

import { useStaffApplications } from "./hook";

import { getApplicationStatusClass, getScreeningClass } from "./helper";

import type { StaffApplicationStatus, StaffScreeningStatus } from "./types";

// ======================================================
// APPLICATION PAGE
// ======================================================

export default function StaffApplications() {
  const t = useTranslations("staffApplications");

  const {
    applications,

    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    screeningFilter,
    setScreeningFilter,

    selectedApplication,
    setSelectedApplication,

    screeningApplication,
    setScreeningApplication,

    decisionApplication,
    setDecisionApplication,

    isLoading,
    isFetching,

    isScreening,

    isApproving,
    isRejecting,

    submitScreening,

    approveApplication,
    rejectApplication,

    refresh,
  } = useStaffApplications();

  // ====================================================
  // CURRENT STAFF
  // ====================================================

  const staffQuery = useQuery({
    queryKey: ["current-staff"],

    queryFn: getCurrentStaff,
  });

  // ====================================================
  // PERMISSIONS
  // ====================================================

  const canReview =
    staffQuery.data?.data.permissions.includes("applications:review") ?? false;

  const canApprove =
    staffQuery.data?.data.permissions.includes("applications:approval") ??
    false;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <>
      <main className="mx-auto max-w-7xl space-y-6 px-6 py-10">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>

            <p className="mt-1 text-sm text-slate-500">{t("description")}</p>
          </div>

          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refresh()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />

            {t("refresh")}
          </button>
        </div>

        {/* SUMMARY */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Summary label={t("summary.total")} value={summary?.total ?? 0} />

          <Summary
            label={t("summary.pendingApproval")}
            value={summary?.pendingAdminApproval ?? 0}
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

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-[1fr_230px_230px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "ALL" | StaffApplicationStatus,
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4"
          >
            <option value="ALL">{t("filters.allStatuses")}</option>

            <option value="PENDING_ADMIN_APPROVAL">
              {t("statuses.PENDING_ADMIN_APPROVAL")}
            </option>

            <option value="SENT_TO_PROVIDER">
              {t("statuses.SENT_TO_PROVIDER")}
            </option>

            <option value="UNDER_REVIEW">{t("statuses.UNDER_REVIEW")}</option>

            <option value="INTERVIEW">{t("statuses.INTERVIEW")}</option>

            <option value="SELECTED">{t("statuses.SELECTED")}</option>

            <option value="HIRED">{t("statuses.HIRED")}</option>

            <option value="ADMIN_REJECTED">
              {t("statuses.ADMIN_REJECTED")}
            </option>

            <option value="REJECTED">{t("statuses.REJECTED")}</option>
          </select>

          <select
            value={screeningFilter}
            onChange={(event) =>
              setScreeningFilter(
                event.target.value as "ALL" | StaffScreeningStatus,
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4"
          >
            <option value="ALL">{t("filters.allScreening")}</option>

            <option value="NOT_SCREENED">
              {t("screeningStatuses.NOT_SCREENED")}
            </option>

            <option value="SCREENED">{t("screeningStatuses.SCREENED")}</option>

            <option value="NEEDS_ATTENTION">
              {t("screeningStatuses.NEEDS_ATTENTION")}
            </option>
          </select>
        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">{t("table.application")}</th>

                  <th className="px-5 py-4">{t("table.applicant")}</th>

                  <th className="px-5 py-4">{t("table.vacancy")}</th>

                  <th className="px-5 py-4">{t("table.company")}</th>

                  <th className="px-5 py-4">{t("table.applicationStatus")}</th>

                  <th className="px-5 py-4">{t("table.screening")}</th>

                  <th className="px-5 py-4 text-right">{t("table.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-20 text-center text-slate-500"
                    >
                      {t("loading")}
                    </td>
                  </tr>
                )}

                {!isLoading && applications.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-20 text-center text-slate-500"
                    >
                      {t("empty")}
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  applications.map((application) => {
                    const pending =
                      application.status === "PENDING_ADMIN_APPROVAL";

                    return (
                      <tr
                        key={application.applicationId}
                        className="border-t border-slate-100"
                      >
                        <td className="px-5 py-4 text-sm font-medium">
                          {application.applicationId}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold">
                            {application.applicant.name || "-"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {application.applicant.japaneseLevel ||
                              t("japaneseLevelNotSet")}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {application.vacancy?.title || "-"}
                        </td>

                        <td className="px-5 py-4">
                          {application.vacancy?.companyName || "-"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getApplicationStatusClass(
                              application.status,
                            )}`}
                          >
                            {t(`statuses.${application.status}`)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getScreeningClass(
                              application.screening.status,
                            )}`}
                          >
                            {t(
                              `screeningStatuses.${application.screening.status}`,
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedApplication(application)
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            >
                              <Eye className="h-4 w-4" />

                              {t("actions.view")}
                            </button>

                            {canReview && pending && (
                              <button
                                type="button"
                                onClick={() =>
                                  setScreeningApplication(application)
                                }
                                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                              >
                                {application.screening.status === "NOT_SCREENED"
                                  ? t("actions.screen")
                                  : t("actions.editScreening")}
                              </button>
                            )}

                            {canApprove && pending && (
                              <button
                                type="button"
                                onClick={() =>
                                  setDecisionApplication(application)
                                }
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                              >
                                {t("actions.decide")}
                              </button>
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

        {/* PERMISSION NOTICE */}

        {(!canReview || !canApprove) && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            {!canReview && !canApprove
              ? t("permissions.viewOnly")
              : canReview
                ? t("permissions.screenOnly")
                : t("permissions.approvalOnly")}
          </div>
        )}
      </main>

      {/* DETAILS */}

      <ApplicationDetails
        application={selectedApplication}
        canReview={canReview}
        canApprove={canApprove}
        onClose={() => setSelectedApplication(null)}
        onScreen={(application) => {
          setSelectedApplication(null);

          setScreeningApplication(application);
        }}
        onDecision={(application) => {
          setSelectedApplication(null);

          setDecisionApplication(application);
        }}
      />

      {/* SCREEN */}

      <ScreenApplicationModal
        application={screeningApplication}
        loading={isScreening}
        onClose={() => setScreeningApplication(null)}
        onSubmit={submitScreening}
      />

      {/* APPROVE / REJECT */}

      <ApplicationDecisionModal
        application={decisionApplication}
        isApproving={isApproving}
        isRejecting={isRejecting}
        onClose={() => setDecisionApplication(null)}
        onApprove={approveApplication}
        onReject={rejectApplication}
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
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
