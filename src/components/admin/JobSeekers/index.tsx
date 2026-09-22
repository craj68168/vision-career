"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
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

import type {
  AccountStatus,
  ApprovalStatus,
  PlacementStatus,
  SeekerScreeningStatus,
} from "./types";

// ======================================================
// ACCOUNT BADGE
// ======================================================

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

// ======================================================
// APPROVAL BADGE
// ======================================================

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

// ======================================================
// PLACEMENT LABEL
// ======================================================

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

// ======================================================
// STAFF SCREENING BADGE
// ======================================================

const screeningBadge = (status: SeekerScreeningStatus) => {
  switch (status) {
    case "SCREENED":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";

    case "NEEDS_ATTENTION":
      return "bg-red-50 text-red-700 border-red-100";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

// ======================================================
// STAFF SCREENING LABEL
// ======================================================

const screeningLabel = (status: SeekerScreeningStatus, lang: string) => {
  if (lang === "ja") {
    switch (status) {
      case "SCREENED":
        return "確認済み";

      case "NEEDS_ATTENTION":
        return "要確認";

      default:
        return "未確認";
    }
  }

  switch (status) {
    case "SCREENED":
      return "Screened";

    case "NEEDS_ATTENTION":
      return "Needs Attention";

    default:
      return "Not Screened";
  }
};

// ======================================================
// MAIN COMPONENT
// ======================================================

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
              ? "登録された求職者、スタッフ確認、承認、アカウント状況、応募状況を管理します。"
              : "Manage registered Job Seekers, Staff screening, approvals, account status and recruitment progress."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
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
          {/* SEARCH */}

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

          {/* APPROVAL */}

          <select
            value={approvalStatus}
            onChange={(event) =>
              setApprovalStatus(event.target.value as "" | ApprovalStatus)
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
          >
            <option value="">
              {lang === "ja" ? "すべての承認状態" : "All approvals"}
            </option>

            <option value="pending">
              {lang === "ja" ? "承認待ち" : "Pending approval"}
            </option>

            <option value="approved">
              {lang === "ja" ? "承認済み" : "Approved"}
            </option>

            <option value="rejected">
              {lang === "ja" ? "却下" : "Rejected"}
            </option>
          </select>

          {/* ACCOUNT */}

          <select
            value={accountStatus}
            onChange={(event) =>
              setAccountStatus(event.target.value as "" | AccountStatus)
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
          >
            <option value="">
              {lang === "ja"
                ? "すべてのアカウント状態"
                : "All account statuses"}
            </option>

            <option value="active">{lang === "ja" ? "有効" : "Active"}</option>

            <option value="inactive">
              {lang === "ja" ? "無効" : "Inactive"}
            </option>

            <option value="suspended">
              {lang === "ja" ? "停止中" : "Suspended"}
            </option>
          </select>

          {/* PLACEMENT */}

          <select
            value={placementStatus}
            onChange={(event) =>
              setPlacementStatus(event.target.value as "" | PlacementStatus)
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
          >
            <option value="">
              {lang === "ja" ? "すべての配置状態" : "All placement statuses"}
            </option>

            <option value="unplaced">
              {lang === "ja" ? "未配置" : "Unplaced"}
            </option>

            <option value="matching">
              {lang === "ja" ? "マッチング中" : "Matching"}
            </option>

            <option value="interview">
              {lang === "ja" ? "面接" : "Interview"}
            </option>

            <option value="selected">
              {lang === "ja" ? "選考済み" : "Selected"}
            </option>

            <option value="placed">
              {lang === "ja" ? "配置済み" : "Placed"}
            </option>
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
          <table className="w-full min-w-[1280px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">ID</th>

                <th className="px-5 py-4">{lang === "ja" ? "氏名" : "Name"}</th>

                <th className="px-5 py-4">Email</th>

                <th className="px-5 py-4">
                  {lang === "ja" ? "承認" : "Approval"}
                </th>

                <th className="px-5 py-4">
                  {lang === "ja" ? "アカウント" : "Account"}
                </th>

                <th className="px-5 py-4">
                  {lang === "ja" ? "配置" : "Placement"}
                </th>

                <th className="px-5 py-4">
                  {lang === "ja" ? "スタッフ確認" : "Screening"}
                </th>

                <th className="px-5 py-4 text-center">
                  {lang === "ja" ? "応募数" : "Applications"}
                </th>

                <th className="px-5 py-4 text-right">
                  {lang === "ja" ? "操作" : "Actions"}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* LOADING */}

              {isLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-16 text-center text-sm text-slate-500"
                  >
                    {lang === "ja"
                      ? "求職者を読み込み中..."
                      : "Loading job seekers..."}
                  </td>
                </tr>
              ) : seekers.length === 0 ? (
                /* EMPTY */

                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-16 text-center text-sm text-slate-500"
                  >
                    {lang === "ja"
                      ? "求職者が見つかりません。"
                      : "No job seekers found."}
                  </td>
                </tr>
              ) : (
                seekers.map((seeker) => (
                  <tr
                    key={seeker.seeker_id}
                    className="transition hover:bg-slate-50/70"
                  >
                    {/* ID */}

                    <td className="px-5 py-4 text-sm font-medium text-slate-500">
                      {seeker.seeker_id}
                    </td>

                    {/* NAME */}

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

                    {/* EMAIL */}

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {seeker.email}
                    </td>

                    {/* APPROVAL */}

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${approvalBadge(
                          seeker.approval_status,
                        )}`}
                      >
                        {seeker.approval_status}
                      </span>
                    </td>

                    {/* ACCOUNT */}

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${accountBadge(
                          seeker.account_status,
                        )}`}
                      >
                        {seeker.account_status}
                      </span>
                    </td>

                    {/* PLACEMENT */}

                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {placementLabel(seeker.placement_status)}
                    </td>

                    {/* STAFF SCREENING */}

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${screeningBadge(
                          seeker.staffScreening.status,
                        )}`}
                      >
                        {screeningLabel(seeker.staffScreening.status, lang)}
                      </span>

                      {seeker.staffScreening.status === "NEEDS_ATTENTION" &&
                        seeker.staffScreening.note && (
                          <p className="mt-1 max-w-[190px] truncate text-xs text-red-500">
                            {seeker.staffScreening.note}
                          </p>
                        )}
                    </td>

                    {/* APPLICATIONS */}

                    <td className="px-5 py-4 text-center font-semibold text-slate-900">
                      {seeker.applications_count}
                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {/* REVIEW */}

                        {seeker.approval_status === "pending" && (
                          <button
                            type="button"
                            onClick={() => {
                              setActionError(null);
                              setApprovalSeeker(seeker);
                            }}
                            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                              seeker.staffScreening.status === "NEEDS_ATTENTION"
                                ? "border-red-200 text-red-700 hover:bg-red-50"
                                : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                            }`}
                          >
                            {lang === "ja" ? "審査" : "Review"}
                          </button>
                        )}

                        {/* VIEW */}

                        <button
                          type="button"
                          onClick={() => void openView(seeker)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium transition hover:bg-slate-50"
                        >
                          <Eye className="h-3.5 w-3.5" />

                          {lang === "ja" ? "詳細" : "View"}
                        </button>

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() => void openEdit(seeker)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium transition hover:bg-slate-50"
                        >
                          <Edit3 className="h-3.5 w-3.5" />

                          {lang === "ja" ? "編集" : "Edit"}
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() => {
                            setActionError(null);
                            setDeletingSeeker(seeker);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />

                          {lang === "ja" ? "削除" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {totalRecords} {lang === "ja" ? "件" : "record(s)"}
          </p>

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
              className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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
              className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          CREATE MODAL
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

      {/* =================================================
          VIEW MODAL
      ================================================= */}

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

      {/* =================================================
          EDIT MODAL
      ================================================= */}

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

      {/* =================================================
          APPROVAL MODAL
      ================================================= */}

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

      {/* =================================================
          DELETE MODAL
      ================================================= */}

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

// ======================================================
// SUMMARY CARD
// ======================================================

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
