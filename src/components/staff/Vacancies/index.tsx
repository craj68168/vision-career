"use client";

import { Eye, RefreshCw, Search } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { useTranslations } from "next-intl";

import { getCurrentStaff } from "@/components/auth/Staff/api";

import VacancyDetails from "./VacancyDetails";

import ScreenVacancyModal from "./ScreenVacancyModal";

import VacancyDecisionModal from "./VacancyDecisionModal";

import { useStaffVacancies } from "./hook";

import { getScreeningClass, getVacancyStatusClass } from "./helper";

import type { StaffVacancyScreeningStatus, StaffVacancyStatus } from "./types";

// ======================================================
// STAFF VACANCIES
// ======================================================

export default function StaffVacancies() {
  const t = useTranslations("staffVacancies");

  const {
    vacancies,

    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    screeningFilter,
    setScreeningFilter,

    selectedVacancy,
    setSelectedVacancy,

    screeningVacancy,
    setScreeningVacancy,

    decisionVacancy,
    setDecisionVacancy,

    isLoading,
    isFetching,

    isScreening,

    isApproving,

    isRejecting,

    submitScreening,

    approveVacancy,

    rejectVacancy,

    refresh,
  } = useStaffVacancies();

  // ====================================================
  // CURRENT STAFF
  // ====================================================

  const staffQuery = useQuery({
    queryKey: ["current-staff"],

    queryFn: getCurrentStaff,
  });

  const permissions = staffQuery.data?.data.permissions ?? [];

  const canReview = permissions.includes("vacancies:review");

  const canApprove = permissions.includes("vacancies:approval");

  // ====================================================
  // UI
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
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />

            {t("refresh")}
          </button>
        </div>

        {/* SUMMARY */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Summary label={t("summary.total")} value={summary?.total ?? 0} />

          <Summary
            label={t("summary.pendingReview")}
            value={summary?.pendingReview ?? 0}
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

          <Summary
            label={t("summary.published")}
            value={summary?.published ?? 0}
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
              className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "ALL" | StaffVacancyStatus)
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4"
          >
            <option value="ALL">{t("filters.allStatuses")}</option>

            <option value="draft">{t("statuses.draft")}</option>

            <option value="pending_review">
              {t("statuses.pending_review")}
            </option>

            <option value="approved">{t("statuses.approved")}</option>

            <option value="rejected">{t("statuses.rejected")}</option>

            <option value="published">{t("statuses.published")}</option>

            <option value="closed">{t("statuses.closed")}</option>
          </select>

          <select
            value={screeningFilter}
            onChange={(event) =>
              setScreeningFilter(
                event.target.value as "ALL" | StaffVacancyScreeningStatus,
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
                  <th className="px-5 py-4">{t("table.vacancy")}</th>

                  <th className="px-5 py-4">{t("table.company")}</th>

                  <th className="px-5 py-4">{t("table.employment")}</th>

                  <th className="px-5 py-4">{t("table.location")}</th>

                  <th className="px-5 py-4">{t("table.status")}</th>

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

                {!isLoading && vacancies.length === 0 && (
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
                  vacancies.map((vacancy) => (
                    <tr
                      key={vacancy.vacancyId}
                      className="border-t border-slate-100"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">{vacancy.title}</p>

                        <p className="mt-1 text-xs text-slate-400">
                          {vacancy.vacancyId}
                        </p>
                      </td>

                      <td className="px-5 py-4">{vacancy.companyName}</td>

                      <td className="px-5 py-4">{vacancy.employmentType}</td>

                      <td className="px-5 py-4">{vacancy.workLocation}</td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getVacancyStatusClass(
                            vacancy.status,
                          )}`}
                        >
                          {t(`statuses.${vacancy.status}`)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getScreeningClass(
                            vacancy.staffScreening.status,
                          )}`}
                        >
                          {t(
                            `screeningStatuses.${vacancy.staffScreening.status}`,
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() => setSelectedVacancy(vacancy)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          >
                            <Eye className="h-4 w-4" />

                            {t("actions.view")}
                          </button>

                          {/* SCREEN */}

                          {canReview && vacancy.status === "pending_review" && (
                            <button
                              type="button"
                              onClick={() => setScreeningVacancy(vacancy)}
                              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                            >
                              {vacancy.staffScreening.status === "NOT_SCREENED"
                                ? t("actions.screen")
                                : t("actions.editScreening")}
                            </button>
                          )}

                          {/* APPROVE / REJECT */}

                          {canApprove &&
                            vacancy.status === "pending_review" && (
                              <button
                                type="button"
                                onClick={() => setDecisionVacancy(vacancy)}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                              >
                                {t("actions.decide")}
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {!canReview && !canApprove && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            {t("viewOnlyNotice")}
          </div>
        )}
      </main>

      {/* DETAILS */}

      <VacancyDetails
        vacancy={selectedVacancy}
        canReview={canReview}
        canApprove={canApprove}
        onClose={() => setSelectedVacancy(null)}
        onScreen={(vacancy) => {
          setSelectedVacancy(null);

          setScreeningVacancy(vacancy);
        }}
        onDecision={(vacancy) => {
          setSelectedVacancy(null);

          setDecisionVacancy(vacancy);
        }}
      />

      {/* SCREEN */}

      <ScreenVacancyModal
        vacancy={screeningVacancy}
        loading={isScreening}
        onClose={() => setScreeningVacancy(null)}
        onSubmit={submitScreening}
      />

      {/* APPROVE / REJECT */}

      <VacancyDecisionModal
        vacancy={decisionVacancy}
        isApproving={isApproving}
        isRejecting={isRejecting}
        onClose={() => setDecisionVacancy(null)}
        onApprove={approveVacancy}
        onReject={rejectVacancy}
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
