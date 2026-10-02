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

type Seeker = ReturnType<typeof useAdminJobSeekers>["seekers"][number];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

const selectClass =
  "h-10 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white";

// ======================================================
// ACCOUNT BADGE
// ======================================================

const accountBadge = (status: AccountStatus) => {
  switch (status) {
    case "active":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";

    case "suspended":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";

    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";
  }
};

// ======================================================
// APPROVAL BADGE
// ======================================================

const approvalBadge = (status: ApprovalStatus) => {
  switch (status) {
    case "approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";

    case "rejected":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300";
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
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";

    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";

    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";
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

  const handleReview = (seeker: Seeker) => {
    setActionError(null);
    setApprovalSeeker(seeker);
  };

  const handleRequestDelete = (seeker: Seeker) => {
    setActionError(null);
    setDeletingSeeker(seeker);
  };

  return (
    <div className="min-w-0 space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white sm:text-2xl">
            {lang === "ja" ? "求職者" : "Job Seekers"}
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {lang === "ja"
              ? "登録された求職者、スタッフ確認、承認、アカウント状況、応募状況を管理します。"
              : "Manage registered Job Seekers, Staff screening, approvals, account status and recruitment progress."}
          </p>
        </div>

        <div className="flex shrink-0 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => void handleRefresh()}
            className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 md:flex-none ${focusRing}`}
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
            className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 md:flex-none ${focusRing}`}
          >
            <Plus className="h-4 w-4" />

            {lang === "ja" ? "求職者を追加" : "New Job Seeker"}
          </button>
        </div>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
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

      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
          {/* SEARCH */}

          <div className="relative sm:col-span-3 xl:col-span-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label={lang === "ja" ? "求職者を検索" : "Search job seekers"}
              placeholder={
                lang === "ja"
                  ? "名前、メール、求職者IDで検索..."
                  : "Search name, email, seeker ID..."
              }
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          {/* APPROVAL */}

          <select
            value={approvalStatus}
            aria-label={lang === "ja" ? "承認状態" : "Approval status"}
            onChange={(event) =>
              setApprovalStatus(event.target.value as "" | ApprovalStatus)
            }
            className={selectClass}
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
            aria-label={lang === "ja" ? "アカウント状態" : "Account status"}
            onChange={(event) =>
              setAccountStatus(event.target.value as "" | AccountStatus)
            }
            className={selectClass}
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
            aria-label={lang === "ja" ? "配置状態" : "Placement status"}
            onChange={(event) =>
              setPlacementStatus(event.target.value as "" | PlacementStatus)
            }
            className={selectClass}
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
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {/* =================================================
          LIST
      ================================================= */}

      {isLoading ? (
        <div
          role="status"
          className="rounded-lg border border-zinc-200 bg-white px-4 py-16 text-center text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400"
        >
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />

          <p className="mt-3">
            {lang === "ja" ? "求職者を読み込み中..." : "Loading job seekers..."}
          </p>
        </div>
      ) : seekers.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-16 text-center text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 sm:py-20">
          {lang === "ja" ? "求職者が見つかりません。" : "No job seekers found."}
        </div>
      ) : (
        <>
          {/* CARDS (below xl) */}

          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:hidden">
            {seekers.map((seeker) => (
              <article
                key={seeker.seeker_id}
                className="flex min-w-0 flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {seeker.seeker_id}
                    </p>

                    <h3 className="mt-1 break-words text-lg font-semibold text-zinc-950 dark:text-white">
                      {seeker.name}
                    </h3>

                    {seeker.nationality && (
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {seeker.nationality}
                      </p>
                    )}
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${approvalBadge(
                      seeker.approval_status,
                    )}`}
                  >
                    {seeker.approval_status}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <CardField label="Email" value={seeker.email} />
                  </div>

                  <div className="min-w-0 rounded-lg bg-zinc-50 p-3 dark:bg-white/5">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {lang === "ja" ? "アカウント" : "Account"}
                    </p>

                    <span
                      className={`mt-1 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${accountBadge(
                        seeker.account_status,
                      )}`}
                    >
                      {seeker.account_status}
                    </span>
                  </div>

                  <CardField
                    label={lang === "ja" ? "配置" : "Placement"}
                    value={placementLabel(seeker.placement_status)}
                  />

                  <CardField
                    label={lang === "ja" ? "応募数" : "Applications"}
                    value={String(seeker.applications_count)}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-white/5">
                  <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {lang === "ja" ? "スタッフ確認" : "Screening"}
                  </span>

                  <span
                    className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${screeningBadge(
                      seeker.staffScreening.status,
                    )}`}
                  >
                    {screeningLabel(seeker.staffScreening.status, lang)}
                  </span>
                </div>

                {seeker.staffScreening.status === "NEEDS_ATTENTION" &&
                  seeker.staffScreening.note && (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-400/20 dark:bg-red-400/10">
                      <p className="line-clamp-2 break-words text-sm text-red-600 dark:text-red-300/90">
                        {seeker.staffScreening.note}
                      </p>
                    </div>
                  )}

                <div className="mt-auto pt-5">
                  <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-white/10">
                    <SeekerActions
                      lang={lang}
                      showReview={seeker.approval_status === "pending"}
                      needsAttention={
                        seeker.staffScreening.status === "NEEDS_ATTENTION"
                      }
                      onReview={() => handleReview(seeker)}
                      onView={() => void openView(seeker)}
                      onEdit={() => void openEdit(seeker)}
                      onDelete={() => handleRequestDelete(seeker)}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* TABLE (xl and up) */}

          <div className="hidden overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900 xl:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>

                    <th className="px-4 py-3 font-medium">
                      {lang === "ja" ? "氏名" : "Name"}
                    </th>

                    <th className="px-4 py-3 font-medium">Email</th>

                    <th className="px-4 py-3 font-medium">
                      {lang === "ja" ? "承認" : "Approval"}
                    </th>

                    <th className="px-4 py-3 font-medium">
                      {lang === "ja" ? "アカウント" : "Account"}
                    </th>

                    <th className="px-4 py-3 font-medium">
                      {lang === "ja" ? "配置" : "Placement"}
                    </th>

                    <th className="px-4 py-3 font-medium">
                      {lang === "ja" ? "スタッフ確認" : "Screening"}
                    </th>

                    <th className="px-4 py-3 text-center font-medium">
                      {lang === "ja" ? "応募数" : "Applications"}
                    </th>

                    <th className="px-4 py-3 text-right font-medium">
                      {lang === "ja" ? "操作" : "Actions"}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                  {seekers.map((seeker) => (
                    <tr
                      key={seeker.seeker_id}
                      className="transition hover:bg-zinc-50 dark:hover:bg-white/5"
                    >
                      {/* ID */}

                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {seeker.seeker_id}
                      </td>

                      {/* NAME */}

                      <td className="px-4 py-3">
                        <div className="font-medium text-zinc-950 dark:text-white">
                          {seeker.name}
                        </div>

                        {seeker.nationality && (
                          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            {seeker.nationality}
                          </div>
                        )}
                      </td>

                      {/* EMAIL */}

                      <td className="break-all px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                        {seeker.email}
                      </td>

                      {/* APPROVAL */}

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${approvalBadge(
                            seeker.approval_status,
                          )}`}
                        >
                          {seeker.approval_status}
                        </span>
                      </td>

                      {/* ACCOUNT */}

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${accountBadge(
                            seeker.account_status,
                          )}`}
                        >
                          {seeker.account_status}
                        </span>
                      </td>

                      {/* PLACEMENT */}

                      <td className="px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {placementLabel(seeker.placement_status)}
                      </td>

                      {/* STAFF SCREENING */}

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${screeningBadge(
                            seeker.staffScreening.status,
                          )}`}
                        >
                          {screeningLabel(seeker.staffScreening.status, lang)}
                        </span>

                        {seeker.staffScreening.status === "NEEDS_ATTENTION" &&
                          seeker.staffScreening.note && (
                            <p className="mt-1 max-w-[190px] truncate text-xs text-red-500 dark:text-red-300">
                              {seeker.staffScreening.note}
                            </p>
                          )}
                      </td>

                      {/* APPLICATIONS */}

                      <td className="px-4 py-3 text-center text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {seeker.applications_count}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <SeekerActions
                            compact
                            lang={lang}
                            showReview={seeker.approval_status === "pending"}
                            needsAttention={
                              seeker.staffScreening.status ===
                              "NEEDS_ATTENTION"
                            }
                            onReview={() => handleReview(seeker)}
                            onView={() => void openView(seeker)}
                            onEdit={() => void openEdit(seeker)}
                            onDelete={() => handleRequestDelete(seeker)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* =================================================
          PAGINATION
      ================================================= */}

      <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {totalRecords} {lang === "ja" ? "件" : "record(s)"}
        </p>

        <div className="flex items-center gap-2">
          <select
            value={limit}
            aria-label={lang === "ja" ? "表示件数" : "Rows per page"}
            onChange={(event) => changeLimit(Number(event.target.value))}
            className="h-9 cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
          >
            <option value={10}>10 / page</option>

            <option value={20}>20 / page</option>

            <option value={50}>50 / page</option>
          </select>

          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            aria-label={lang === "ja" ? "前のページ" : "Previous page"}
            className={`grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-zinc-200 text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="min-w-16 text-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            aria-label={lang === "ja" ? "次のページ" : "Next page"}
            className={`grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-zinc-200 text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
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
// ACTIONS
// ======================================================

function SeekerActions({
  compact = false,
  lang,
  showReview,
  needsAttention,
  onReview,
  onView,
  onEdit,
  onDelete,
}: {
  compact?: boolean;
  lang: string;
  showReview: boolean;
  needsAttention: boolean;
  onReview: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const base = compact
    ? "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition"
    : "inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition sm:flex-none";

  const neutral =
    "border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10";

  const danger =
    "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10";

  const reviewClass = needsAttention
    ? danger
    : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-400/30 dark:text-emerald-300 dark:hover:bg-emerald-400/10";

  const labels =
    lang === "ja"
      ? { review: "審査", view: "詳細", edit: "編集", delete: "削除" }
      : { review: "Review", view: "View", edit: "Edit", delete: "Delete" };

  return (
    <>
      {showReview && (
        <button
          type="button"
          onClick={onReview}
          className={`${
            compact
              ? "inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border px-3 text-xs font-medium transition"
              : base
          } ${reviewClass} ${focusRing}`}
        >
          {labels.review}
        </button>
      )}

      <button
        type="button"
        onClick={onView}
        aria-label={labels.view}
        title={labels.view}
        className={`${base} ${neutral} ${focusRing}`}
      >
        <Eye className="h-4 w-4" />
        {!compact && labels.view}
      </button>

      <button
        type="button"
        onClick={onEdit}
        aria-label={labels.edit}
        title={labels.edit}
        className={`${base} ${neutral} ${focusRing}`}
      >
        <Edit3 className="h-4 w-4" />
        {!compact && labels.edit}
      </button>

      <button
        type="button"
        onClick={onDelete}
        aria-label={labels.delete}
        title={labels.delete}
        className={`${base} ${danger} ${focusRing}`}
      >
        <Trash2 className="h-4 w-4" />
        {!compact && labels.delete}
      </button>
    </>
  );
}

// ======================================================
// CARD FIELD
// ======================================================

function CardField({
  label,
  value,
}: {
  label: string;

  value?: string | null;
}) {
  return (
    <div className="min-w-0 rounded-lg bg-zinc-50 p-3 dark:bg-white/5">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {value || "-"}
      </p>
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
    <div className="min-w-0 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
            {value}
          </p>
        </div>

        <div className="shrink-0 rounded-lg bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}