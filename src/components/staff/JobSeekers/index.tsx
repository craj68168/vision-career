"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { getCurrentStaff } from "@/components/auth/Staff/api";

import {
  getAccountClass,
  getApprovalClass,
  getPlacementLabel,
  getScreeningClass,
  getScreeningLabel,
} from "./helper";

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

    isLoading,
    isFetching,
    isScreening,
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

    refresh,
  } = useStaffJobSeekers();

  // ====================================================
  // CURRENT STAFF / PERMISSION
  // ====================================================

  const staffQuery = useQuery({
    queryKey: ["current-staff"],

    queryFn: getCurrentStaff,
  });

  const canManage =
    staffQuery.data?.data.permissions.includes("seekers:manage") ?? false;

  return (
    <>
      <main className="mx-auto w-full max-w-7xl space-y-6 px-6 py-10">
        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Job Seekers</h1>

            <p className="mt-1 text-sm text-slate-500">
              Review Job Seeker profiles before final Admin registration
              approval.
            </p>
          </div>

          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refresh()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* SUMMARY */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Summary label="Total" value={summary?.total ?? 0} />

          <Summary
            label="Pending Admin"
            value={summary?.pendingApproval ?? 0}
          />

          <Summary label="Not Screened" value={summary?.notScreened ?? 0} />

          <Summary label="Screened" value={summary?.screened ?? 0} />

          <Summary
            label="Needs Attention"
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
                placeholder="Search seeker, email, ID..."
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
              <option value="">All approvals</option>

              <option value="pending">Pending</option>

              <option value="approved">Approved</option>

              <option value="rejected">Rejected</option>
            </select>

            <select
              value={accountStatus}
              onChange={(event) =>
                setAccountStatus(event.target.value as "" | AccountStatus)
              }
              className="h-12 rounded-xl border border-slate-200 px-3"
            >
              <option value="">All accounts</option>

              <option value="active">Active</option>

              <option value="inactive">Inactive</option>

              <option value="suspended">Suspended</option>
            </select>

            <select
              value={placementStatus}
              onChange={(event) =>
                setPlacementStatus(event.target.value as "" | PlacementStatus)
              }
              className="h-12 rounded-xl border border-slate-200 px-3"
            >
              <option value="">All placement</option>

              <option value="unplaced">Unplaced</option>

              <option value="matching">Matching</option>

              <option value="interview">Interview</option>

              <option value="selected">Selected</option>

              <option value="placed">Placed</option>
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
              <option value="">All screening</option>

              <option value="NOT_SCREENED">Not Screened</option>

              <option value="SCREENED">Screened</option>

              <option value="NEEDS_ATTENTION">Needs Attention</option>
            </select>
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase text-slate-500">
                  <th className="px-5 py-4">ID</th>

                  <th className="px-5 py-4">Job Seeker</th>

                  <th className="px-5 py-4">Approval</th>

                  <th className="px-5 py-4">Account</th>

                  <th className="px-5 py-4">Placement</th>

                  <th className="px-5 py-4">Screening</th>

                  <th className="px-5 py-4 text-center">Applications</th>

                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-slate-500"
                    >
                      Loading Job Seekers...
                    </td>
                  </tr>
                ) : seekers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-slate-500"
                    >
                      No Job Seekers found.
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
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getApprovalClass(
                            seeker.approval_status,
                          )}`}
                        >
                          {seeker.approval_status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getAccountClass(
                            seeker.account_status,
                          )}`}
                        >
                          {seeker.account_status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium">
                        {getPlacementLabel(seeker.placement_status)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getScreeningClass(
                            seeker.staffScreening.status,
                          )}`}
                        >
                          {getScreeningLabel(seeker.staffScreening.status)}
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
                            View
                          </button>

                          {canManage &&
                            seeker.approval_status === "pending" && (
                              <button
                                type="button"
                                onClick={() => setScreeningSeeker(seeker)}
                                className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white"
                              >
                                {seeker.staffScreening.status === "NOT_SCREENED"
                                  ? "Screen"
                                  : "Edit Screening"}
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
              {pagination?.total ?? 0} record(s)
            </p>

            <div className="flex items-center gap-2">
              <select
                value={limit}
                onChange={(event) => changeLimit(Number(event.target.value))}
                className="rounded-lg border border-slate-200 px-3 py-2"
              >
                <option value={10}>10 / page</option>

                <option value={20}>20 / page</option>

                <option value={50}>50 / page</option>
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

        {!canManage && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            Your Staff account has view-only Job Seeker access. An Admin must
            grant seekers:manage before you can perform screening.
          </div>
        )}
      </main>

      <JobSeekerDetails
        seeker={viewingSeeker}
        canManage={canManage}
        isDownloading={isDownloading}
        onClose={() => setViewingSeeker(null)}
        onScreen={(seeker) => {
          setViewingSeeker(null);

          setScreeningSeeker(seeker);
        }}
        onDownloadResume={(seeker) => void downloadResume(seeker)}
      />

      <ScreenSeekerModal
        seeker={screeningSeeker}
        isSaving={isScreening}
        onClose={() => setScreeningSeeker(null)}
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
