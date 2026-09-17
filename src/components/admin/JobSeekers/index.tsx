"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  FileText,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  UserCheck,
  UserRound,
  UserX,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import { useAdminJobSeekers } from "./hook";

import ViewModal from "./ViewModal";
import CreateModal from "./CreateModal";
import EditModal from "./EditModal";
import ApprovalModal from "./ApprovalModal";
import DeleteModal from "./DeleteModal";

import type { AccountStatus, ApprovalStatus, PlacementStatus } from "./types";

const accountBadge = (status: AccountStatus) => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";

    case "suspended":
      return "bg-red-50 text-red-700 border-red-100";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const approvalBadge = (status: ApprovalStatus) => {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";

    case "rejected":
      return "bg-red-50 text-red-700 border-red-100";

    default:
      return "bg-amber-50 text-amber-700 border-amber-100";
  }
};

const placementLabel = (status: PlacementStatus) => {
  switch (status) {
    case "matching":
      return "Matching";

    case "interview":
      return "Interview";

    case "selected":
      return "Selected";

    case "placed":
      return "Placed";

    default:
      return "Unplaced";
  }
};

export default function JobSeekers() {
  const { lang } = useLanguage();

  const {
    seekers,
    summary,

    search,
    approvalStatus,
    accountStatus,
    placementStatus,

    page,
    limit,
    totalPages,
    totalRecords,

    isLoading,
    error,

    createOpen,
    viewingSeeker,
    editingSeeker,
    approvalSeeker,
    deletingSeeker,

    isSaving,
    isDeleting,
    isDownloading,
    actionError,

    setSearch,
    setApprovalStatus,
    setAccountStatus,
    setPlacementStatus,

    setPage,
    changeLimit,

    setCreateOpen,
    setViewingSeeker,
    setEditingSeeker,
    setApprovalSeeker,
    setDeletingSeeker,

    setActionError,

    openView,
    openEdit,

    handleCreate,
    handleEdit,
    handleApproval,
    handleDelete,
    handleDownloadResume,
    handleRefresh,
  } = useAdminJobSeekers();

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            {lang === "ja" ? "求職者" : "Job Seekers"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {lang === "ja"
              ? "登録された求職者、承認、アカウント状況、応募状況を管理します。"
              : "Manage registered job seekers, approvals, account status and recruitment progress."}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => void handleRefresh()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />

            {lang === "ja" ? "更新" : "Refresh"}
          </button>

          <button
            type="button"
            onClick={() => {
              setActionError(null);
              setCreateOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />

            {lang === "ja" ? "求職者を追加" : "New Job Seeker"}
          </button>
        </div>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          label={lang === "ja" ? "求職者合計" : "Total Job Seekers"}
          value={summary.total}
          icon={UserRound}
        />

        <SummaryCard
          label={lang === "ja" ? "有効" : "Active"}
          value={summary.active}
          icon={UserCheck}
        />

        <SummaryCard
          label={lang === "ja" ? "無効" : "Inactive"}
          value={summary.inactive}
          icon={UserX}
        />

        <SummaryCard
          label={lang === "ja" ? "停止中" : "Suspended"}
          value={summary.suspended}
          icon={ShieldAlert}
        />

        <SummaryCard
          label={lang === "ja" ? "承認待ち" : "Pending Approval"}
          value={summary.approval.pending}
          icon={CheckCircle2}
        />
      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1fr_180px_180px_180px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                lang === "ja"
                  ? "名前、メール、求職者IDで検索..."
                  : "Search name, email, seeker ID..."
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-slate-400"
            />
          </div>

          <select
            value={approvalStatus}
            onChange={(event) =>
              setApprovalStatus(event.target.value as "" | ApprovalStatus)
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
          >
            <option value="">All approvals</option>

            <option value="pending">Pending approval</option>

            <option value="approved">Approved</option>

            <option value="rejected">Rejected</option>
          </select>

          <select
            value={accountStatus}
            onChange={(event) =>
              setAccountStatus(event.target.value as "" | AccountStatus)
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
          >
            <option value="">All account statuses</option>

            <option value="active">Active</option>

            <option value="inactive">Inactive</option>

            <option value="suspended">Suspended</option>
          </select>

          <select
            value={placementStatus}
            onChange={(event) =>
              setPlacementStatus(event.target.value as "" | PlacementStatus)
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
          >
            <option value="">All placement statuses</option>

            <option value="unplaced">Unplaced</option>

            <option value="matching">Matching</option>

            <option value="interview">Interview</option>

            <option value="selected">Selected</option>

            <option value="placed">Placed</option>
          </select>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">ID</th>

                <th className="px-5 py-4">Name</th>

                <th className="px-5 py-4">Email</th>

                <th className="px-5 py-4">Approval</th>

                <th className="px-5 py-4">Account</th>

                <th className="px-5 py-4">Placement</th>

                <th className="px-5 py-4 text-center">Applications</th>

                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-16 text-center text-sm text-slate-500"
                  >
                    Loading job seekers...
                  </td>
                </tr>
              ) : seekers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-16 text-center text-sm text-slate-500"
                  >
                    No job seekers found.
                  </td>
                </tr>
              ) : (
                seekers.map((seeker) => (
                  <tr
                    key={seeker.seeker_id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4 text-sm font-medium text-slate-500">
                      {seeker.seeker_id}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">
                        {seeker.name}
                      </div>

                      {seeker.nationality && (
                        <div className="mt-1 text-xs text-slate-500">
                          {seeker.nationality}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {seeker.email}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${approvalBadge(
                          seeker.approval_status,
                        )}`}
                      >
                        {seeker.approval_status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${accountBadge(
                          seeker.account_status,
                        )}`}
                      >
                        {seeker.account_status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {placementLabel(seeker.placement_status)}
                    </td>

                    <td className="px-5 py-4 text-center font-semibold text-slate-900">
                      {seeker.applications_count}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {seeker.approval_status === "pending" && (
                          <button
                            type="button"
                            onClick={() => {
                              setActionError(null);

                              setApprovalSeeker(seeker);
                            }}
                            className="rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                          >
                            Review
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => void openView(seeker)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium transition hover:bg-slate-50"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => void openEdit(seeker)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium transition hover:bg-slate-50"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActionError(null);

                            setDeletingSeeker(seeker);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ===============================================
            PAGINATION
        =============================================== */}

        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">{totalRecords} record(s)</p>

          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(event) => changeLimit(Number(event.target.value))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
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

            <span className="min-w-16 text-center text-sm font-medium">
              {page} / {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          MODALS
      ================================================= */}

      {createOpen && (
        <CreateModal
          lang={lang}
          isSaving={isSaving}
          error={actionError}
          onClose={() => {
            setActionError(null);
            setCreateOpen(false);
          }}
          onSubmit={handleCreate}
        />
      )}

      {viewingSeeker && (
        <ViewModal
          lang={lang}
          seeker={viewingSeeker}
          isDownloading={isDownloading}
          onClose={() => setViewingSeeker(null)}
          onDownloadResume={() => void handleDownloadResume(viewingSeeker)}
          onReview={() => {
            setViewingSeeker(null);

            setActionError(null);

            setApprovalSeeker(viewingSeeker);
          }}
        />
      )}

      {editingSeeker && (
        <EditModal
          lang={lang}
          seeker={editingSeeker}
          isSaving={isSaving}
          error={actionError}
          onClose={() => {
            setActionError(null);
            setEditingSeeker(null);
          }}
          onSubmit={handleEdit}
        />
      )}

      {approvalSeeker && (
        <ApprovalModal
          lang={lang}
          seeker={approvalSeeker}
          isSaving={isSaving}
          error={actionError}
          onClose={() => {
            setActionError(null);
            setApprovalSeeker(null);
          }}
          onSubmit={handleApproval}
        />
      )}

      {deletingSeeker && (
        <DeleteModal
          lang={lang}
          seeker={deletingSeeker}
          isDeleting={isDeleting}
          error={actionError}
          onClose={() => {
            setActionError(null);
            setDeletingSeeker(null);
          }}
          onDelete={() => void handleDelete()}
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof UserRound;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>

        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
