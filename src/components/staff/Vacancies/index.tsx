"use client";

import { Eye, RefreshCw, Search } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { getCurrentStaff } from "@/components/auth/Staff/api";

import VacancyDetails from "./VacancyDetails";
import ScreenVacancyModal from "./ScreenVacancyModal";

import { useStaffVacancies } from "./hook";

import {
  getScreeningClass,
  getScreeningLabel,
  getVacancyStatusClass,
  getVacancyStatusLabel,
} from "./helper";

import type { StaffVacancyScreeningStatus, StaffVacancyStatus } from "./types";

// ======================================================
// STAFF VACANCIES
// ======================================================

export default function StaffVacancies() {
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

    isLoading,
    isFetching,
    isScreening,

    submitScreening,

    refresh,
  } = useStaffVacancies();

  // ====================================================
  // CURRENT STAFF
  // ====================================================

  const staffQuery = useQuery({
    queryKey: ["current-staff"],

    queryFn: getCurrentStaff,
  });

  const canReview =
    staffQuery.data?.data.permissions.includes("vacancies:review") ?? false;

  return (
    <>
      <main className="mx-auto max-w-7xl space-y-6 px-6 py-10">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vacancies</h1>

            <p className="mt-1 text-sm text-slate-500">
              Screen Provider vacancies before final Admin review.
            </p>
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
            Refresh
          </button>
        </div>

        {/* SUMMARY */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Summary label="Total" value={summary?.total ?? 0} />

          <Summary label="Pending Review" value={summary?.pendingReview ?? 0} />

          <Summary label="Not Screened" value={summary?.notScreened ?? 0} />

          <Summary label="Screened" value={summary?.screened ?? 0} />

          <Summary
            label="Needs Attention"
            value={summary?.needsAttention ?? 0}
          />

          <Summary label="Published" value={summary?.published ?? 0} />
        </div>

        {/* FILTERS */}

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-[1fr_230px_230px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search vacancy, company or location..."
              className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "ALL" | StaffVacancyStatus)
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4"
          >
            <option value="ALL">All Vacancy Statuses</option>

            <option value="draft">Draft</option>

            <option value="pending_review">Pending Review</option>

            <option value="approved">Approved</option>

            <option value="rejected">Rejected</option>

            <option value="published">Published</option>

            <option value="closed">Closed</option>
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
            <option value="ALL">All Screening</option>

            <option value="NOT_SCREENED">Not Screened</option>

            <option value="SCREENED">Screened</option>

            <option value="NEEDS_ATTENTION">Needs Attention</option>
          </select>
        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Vacancy</th>

                  <th className="px-5 py-4">Company</th>

                  <th className="px-5 py-4">Employment</th>

                  <th className="px-5 py-4">Location</th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4">Screening</th>

                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-20 text-center text-slate-500"
                    >
                      Loading vacancies...
                    </td>
                  </tr>
                )}

                {!isLoading && vacancies.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-20 text-center text-slate-500"
                    >
                      No vacancies found.
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
                          {getVacancyStatusLabel(vacancy.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getScreeningClass(
                            vacancy.staffScreening.status,
                          )}`}
                        >
                          {getScreeningLabel(vacancy.staffScreening.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedVacancy(vacancy)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>

                          {canReview && vacancy.status === "pending_review" && (
                            <button
                              type="button"
                              onClick={() => setScreeningVacancy(vacancy)}
                              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                            >
                              {vacancy.staffScreening.status === "NOT_SCREENED"
                                ? "Screen"
                                : "Edit Screening"}
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

        {!canReview && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            Your Staff account has view-only access to vacancies. An Admin must
            grant vacancies:review before you can perform screening.
          </div>
        )}
      </main>

      {/* DETAILS */}

      <VacancyDetails
        vacancy={selectedVacancy}
        canReview={canReview}
        onClose={() => setSelectedVacancy(null)}
        onScreen={(vacancy) => {
          setSelectedVacancy(null);

          setScreeningVacancy(vacancy);
        }}
      />

      {/* SCREEN */}

      <ScreenVacancyModal
        vacancy={screeningVacancy}
        loading={isScreening}
        onClose={() => setScreeningVacancy(null)}
        onSubmit={submitScreening}
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
