"use client";

import { Eye, RefreshCw, Search } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import axiosInstance from "@/services/axiosInstance";

import ApplicationDetails from "./ApplicationDetails";
import ScreenApplicationModal from "./ScreenApplicationModal";

import { useStaffApplications } from "./hook";

import {
  getApplicationStatusClass,
  getApplicationStatusLabel,
  getScreeningClass,
  getScreeningLabel,
} from "./helper";

import type { StaffApplicationStatus, StaffScreeningStatus } from "./types";

import type { CurrentStaffResponse } from "@/components/auth/Staff/types";

// ======================================================
// APPLICATION PAGE
// ======================================================

export default function StaffApplications() {
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

    isLoading,
    isFetching,
    isScreening,

    submitScreening,

    refresh,
  } = useStaffApplications();

  // ====================================================
  // CURRENT STAFF
  // ====================================================

  const staffQuery = useQuery({
    queryKey: ["current-staff"],

    queryFn: async () => {
      const response =
        await axiosInstance.get<CurrentStaffResponse>("/staff/auth/me");

      return response.data;
    },
  });

  const canReview =
    staffQuery.data?.data.permissions.includes("applications:review") ?? false;

  return (
    <>
      <main className="mx-auto max-w-7xl space-y-6 px-6 py-10">
        {/* HEADER */}

        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Applications</h1>

            <p className="mt-1 text-sm text-slate-500">
              Screen Job Seeker applications before final Admin review.
            </p>
          </div>

          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refresh()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* SUMMARY */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Summary label="Total" value={summary?.total ?? 0} />

          <Summary
            label="Pending Admin"
            value={summary?.pendingAdminApproval ?? 0}
          />

          <Summary label="Not Screened" value={summary?.notScreened ?? 0} />

          <Summary label="Screened" value={summary?.screened ?? 0} />

          <Summary
            label="Needs Attention"
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
              placeholder="Search applicant, application, vacancy or company..."
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
            <option value="ALL">All Application Statuses</option>

            <option value="PENDING_ADMIN_APPROVAL">
              Pending Admin Approval
            </option>

            <option value="SENT_TO_PROVIDER">Sent to Provider</option>

            <option value="UNDER_REVIEW">Under Review</option>

            <option value="INTERVIEW">Interview</option>

            <option value="SELECTED">Selected</option>

            <option value="HIRED">Hired</option>

            <option value="ADMIN_REJECTED">Admin Rejected</option>

            <option value="REJECTED">Provider Rejected</option>
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
                  <th className="px-5 py-4">Application</th>

                  <th className="px-5 py-4">Applicant</th>

                  <th className="px-5 py-4">Vacancy</th>

                  <th className="px-5 py-4">Company</th>

                  <th className="px-5 py-4">Application Status</th>

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
                      Loading applications...
                    </td>
                  </tr>
                )}

                {!isLoading && applications.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-20 text-center text-slate-500"
                    >
                      No applications found.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  applications.map((application) => (
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
                            "Japanese level not set"}
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
                          {getApplicationStatusLabel(application.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getScreeningClass(
                            application.screening.status,
                          )}`}
                        >
                          {getScreeningLabel(application.screening.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedApplication(application)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>

                          {canReview &&
                            application.status === "PENDING_ADMIN_APPROVAL" && (
                              <button
                                type="button"
                                onClick={() =>
                                  setScreeningApplication(application)
                                }
                                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                              >
                                Screen
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
            Your Staff account has view-only access to applications. An Admin
            must grant applications:review before you can perform screening.
          </div>
        )}
      </main>

      <ApplicationDetails
        application={selectedApplication}
        canReview={canReview}
        onClose={() => setSelectedApplication(null)}
        onScreen={(application) => {
          setSelectedApplication(null);

          setScreeningApplication(application);
        }}
      />

      <ScreenApplicationModal
        application={screeningApplication}
        loading={isScreening}
        onClose={() => setScreeningApplication(null)}
        onSubmit={submitScreening}
      />
    </>
  );
}

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
