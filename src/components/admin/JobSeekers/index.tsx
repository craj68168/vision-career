"use client";

import type { ComponentType } from "react";
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
  "h-9 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white";

// ======================================================
// COMPONENT
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

  // ==================================================
  // FILTERS
  // ==================================================

  const approvalOptions: Array<{ value: "" | ApprovalStatus; label: string }> =
    [
      {
        value: "",
        label: lang === "ja" ? "すべての承認状態" : "All approvals",
      },
      {
        value: "pending",
        label: lang === "ja" ? "承認待ち" : "Pending approval",
      },
      { value: "approved", label: lang === "ja" ? "承認済み" : "Approved" },
      { value: "rejected", label: lang === "ja" ? "却下" : "Rejected" },
    ];

  const accountOptions: Array<{ value: "" | AccountStatus; label: string }> = [
    {
      value: "",
      label:
        lang === "ja" ? "すべてのアカウント状態" : "All account statuses",
    },
    { value: "active", label: lang === "ja" ? "有効" : "Active" },
    { value: "inactive", label: lang === "ja" ? "無効" : "Inactive" },
    { value: "suspended", label: lang === "ja" ? "停止中" : "Suspended" },
  ];

  const placementOptions: Array<{
    value: "" | PlacementStatus;
    label: string;
  }> = [
    {
      value: "",
      label: lang === "ja" ? "すべての配置状態" : "All placement statuses",
    },
    { value: "unplaced", label: lang === "ja" ? "未配置" : "Unplaced" },
    {
      value: "matching",
      label: lang === "ja" ? "マッチング中" : "Matching",
    },
    { value: "interview", label: lang === "ja" ? "面接" : "Interview" },
    { value: "selected", label: lang === "ja" ? "選考済み" : "Selected" },
    { value: "placed", label: lang === "ja" ? "配置済み" : "Placed" },
  ];

  const hasActiveFilters =
    Boolean(search) ||
    approvalStatus !== "" ||
    accountStatus !== "" ||
    placementStatus !== "";

  // Summary cards are mutually exclusive: each one replaces the other
  // filters, so a card click never combines into an empty result.
  const showAll = () => {
    setApprovalStatus("");
    setAccountStatus("");
    setPlacementStatus("");
  };

  const filterByAccount = (status: AccountStatus) => {
    setApprovalStatus("");
    setPlacementStatus("");
    setAccountStatus(status);
  };

  const filterByApproval = (status: ApprovalStatus) => {
    setAccountStatus("");
    setPlacementStatus("");
    setApprovalStatus(status);
  };

  // ==================================================
  // ACTIONS
  // ==================================================

  const handleReview = (seeker: Seeker) => {
    setActionError(null);
    setApprovalSeeker(seeker);
  };

  const handleRequestDelete = (seeker: Seeker) => {
    setActionError(null);
    setDeletingSeeker(seeker);
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="min-w-0 space-y-4">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white sm:text-2xl">
            {lang === "ja" ? "求職者" : "Job Seekers"}
          </h2>

          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            {lang === "ja"
              ? "登録された求職者、スタッフ確認、承認、アカウント状況、応募状況を管理します。"
              : "Manage registered Job Seekers, Staff screening, approvals, account status and recruitment progress."}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => void handleRefresh()}
            className={`inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 md:flex-none ${focusRing}`}
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
            className={`inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white transition hover:bg-emerald-700 md:flex-none ${focusRing}`}
          >
            <Plus className="h-4 w-4" />

            {lang === "ja" ? "求職者を追加" : "New Job Seeker"}
          </button>
        </div>
      </div>

      {/* SUMMARY (clickable: each card applies its own filter) */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <SummaryCard
          label={lang === "ja" ? "求職者合計" : "Total Job Seekers"}
          value={summary.total}
          icon={UserRound}
          isActive={
            approvalStatus === "" &&
            accountStatus === "" &&
            placementStatus === ""
          }
          onClick={showAll}
        />

        <SummaryCard
          label={lang === "ja" ? "有効" : "Active"}
          value={summary.active}
          icon={UserCheck}
          isActive={accountStatus === "active"}
          onClick={() => filterByAccount("active")}
        />

        <SummaryCard
          label={lang === "ja" ? "無効" : "Inactive"}
          value={summary.inactive}
          icon={UserX}
          isActive={accountStatus === "inactive"}
          onClick={() => filterByAccount("inactive")}
        />

        <SummaryCard
          label={lang === "ja" ? "停止中" : "Suspended"}
          value={summary.suspended}
          icon={ShieldAlert}
          isActive={accountStatus === "suspended"}
          onClick={() => filterByAccount("suspended")}
        />

        <SummaryCard
          label={lang === "ja" ? "承認待ち" : "Pending Approval"}
          value={summary.approval.pending}
          icon={CheckCircle2}
          isActive={approvalStatus === "pending"}
          onClick={() => filterByApproval("pending")}
        />
      </div>

      {/* FILTERS */}

      <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="grid gap-2.5 sm:grid-cols-3 xl:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
          <div className="relative sm:col-span-3 xl:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

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
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <select
            value={approvalStatus}
            aria-label={lang === "ja" ? "承認状態" : "Approval status"}
            onChange={(event) =>
              setApprovalStatus(event.target.value as "" | ApprovalStatus)
            }
            className={selectClass}
          >
            {approvalOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={accountStatus}
            aria-label={lang === "ja" ? "アカウント状態" : "Account status"}
            onChange={(event) =>
              setAccountStatus(event.target.value as "" | AccountStatus)
            }
            className={selectClass}
          >
            {accountOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={placementStatus}
            aria-label={lang === "ja" ? "配置状態" : "Placement status"}
            onChange={(event) =>
              setPlacementStatus(event.target.value as "" | PlacementStatus)
            }
            className={selectClass}
          >
            {placementOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {/* LIST */}

      {isLoading ? (
        <div
          role="status"
          className="rounded-lg border border-zinc-200 bg-white px-4 py-12 text-center text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 sm:py-16"
        >
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />

          <p className="mt-3">
            {lang === "ja" ? "求職者を読み込み中..." : "Loading job seekers..."}
          </p>
        </div>
      ) : seekers.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-10 text-center dark:border-white/10 dark:bg-zinc-900 sm:py-14">
          <UserRound className="mx-auto h-9 w-9 text-zinc-300 dark:text-zinc-600" />

          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            {lang === "ja"
              ? "求職者が見つかりません。"
              : "No job seekers found."}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                showAll();
                setSearch("");
              }}
              className={`mt-4 inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
            >
              {lang === "ja" ? "フィルターをクリア" : "Clear filters"}
            </button>
          )}
        </div>
      ) : (
        <>
          {/* CARDS (below xl) */}

          <div className="grid gap-3 md:grid-cols-2 xl:hidden">
            {seekers.map((seeker) => (
              <article
                key={seeker.seeker_id}
                className="flex min-w-0 flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words text-base font-semibold text-zinc-950 dark:text-white">
                      {seeker.name}
                    </h3>

                    {seeker.nationality && (
                      <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-300">
                        {seeker.nationality}
                      </p>
                    )}

                    <p className="mt-0.5 truncate text-xs text-zinc-400 dark:text-zinc-500">
                      {seeker.seeker_id}
                    </p>
                  </div>

                  <ApprovalBadge status={seeker.approval_status} lang={lang} />
                </div>

                <dl className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2 rounded-md bg-zinc-50 p-2.5 dark:bg-white/5">
                  <div className="col-span-2">
                    <CardField
                      label={lang === "ja" ? "メール" : "Email"}
                      value={seeker.email}
                    />
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                      {lang === "ja" ? "アカウント" : "Account"}
                    </dt>

                    <dd className="mt-0.5">
                      <AccountBadge
                        status={seeker.account_status}
                        lang={lang}
                      />
                    </dd>
                  </div>

                  <CardField
                    label={lang === "ja" ? "配置" : "Placement"}
                    value={getPlacementLabel(seeker.placement_status, lang)}
                  />

                  <CardField
                    label={lang === "ja" ? "応募数" : "Applications"}
                    value={String(seeker.applications_count)}
                  />
                </dl>

                <div className="mt-2.5 flex items-center justify-between gap-3">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {lang === "ja" ? "スタッフ確認" : "Screening"}
                  </span>

                  <ScreeningBadge
                    status={seeker.staffScreening.status}
                    lang={lang}
                  />
                </div>

                {seeker.staffScreening.status === "NEEDS_ATTENTION" &&
                  seeker.staffScreening.note && (
                    <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 dark:border-red-400/20 dark:bg-red-400/10">
                      <p className="line-clamp-2 break-words text-sm text-red-600 dark:text-red-300/90">
                        {seeker.staffScreening.note}
                      </p>
                    </div>
                  )}

                <div className="mt-auto flex flex-wrap justify-end gap-2 pt-2.5">
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
              </article>
            ))}
          </div>

          {/* TABLE (xl and up) */}

          <div className="hidden overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900 xl:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="bg-zinc-50 text-xs text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-2 font-medium">ID</th>

                    <th className="px-4 py-2 font-medium">
                      {lang === "ja" ? "氏名" : "Name"}
                    </th>

                    <th className="px-4 py-2 font-medium">
                      {lang === "ja" ? "メール" : "Email"}
                    </th>

                    <th className="px-4 py-2 font-medium">
                      {lang === "ja" ? "承認" : "Approval"}
                    </th>

                    <th className="px-4 py-2 font-medium">
                      {lang === "ja" ? "アカウント" : "Account"}
                    </th>

                    <th className="px-4 py-2 font-medium">
                      {lang === "ja" ? "配置" : "Placement"}
                    </th>

                    <th className="px-4 py-2 font-medium">
                      {lang === "ja" ? "スタッフ確認" : "Screening"}
                    </th>

                    <th className="px-4 py-2 text-center font-medium">
                      {lang === "ja" ? "応募数" : "Applications"}
                    </th>

                    <th className="px-4 py-2 text-right font-medium">
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
                      <td className="whitespace-nowrap px-4 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {seeker.seeker_id}
                      </td>

                      <td className="px-4 py-2">
                        <p className="font-medium text-zinc-950 dark:text-white">
                          {seeker.name}
                        </p>

                        {seeker.nationality && (
                          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                            {seeker.nationality}
                          </p>
                        )}
                      </td>

                      <td className="break-all px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">
                        {seeker.email}
                      </td>

                      <td className="px-4 py-2">
                        <ApprovalBadge
                          status={seeker.approval_status}
                          lang={lang}
                        />
                      </td>

                      <td className="px-4 py-2">
                        <AccountBadge
                          status={seeker.account_status}
                          lang={lang}
                        />
                      </td>

                      <td className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {getPlacementLabel(seeker.placement_status, lang)}
                      </td>

                      <td className="px-4 py-2">
                        <ScreeningBadge
                          status={seeker.staffScreening.status}
                          lang={lang}
                        />

                        {seeker.staffScreening.status === "NEEDS_ATTENTION" &&
                          seeker.staffScreening.note && (
                            <p
                              title={seeker.staffScreening.note}
                              className="mt-1 max-w-[190px] truncate text-xs text-red-500 dark:text-red-300"
                            >
                              {seeker.staffScreening.note}
                            </p>
                          )}
                      </td>

                      <td className="px-4 py-2 text-center text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {seeker.applications_count}
                      </td>

                      <td className="px-4 py-2">
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

      {/* PAGINATION */}

      <div className="flex flex-col gap-2.5 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between">
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

      {/* CREATE */}

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

      {/* VIEW */}

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

      {/* EDIT */}

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

      {/* APPROVAL */}

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

      {/* DELETE */}

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
  isActive,
  onClick,
}: {
  label: string;
  value: number;
  icon: ComponentType<{
    className?: string;
  }>;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`min-w-0 cursor-pointer rounded-lg border bg-white p-3 text-left shadow-sm transition hover:border-emerald-500/50 hover:shadow-md dark:bg-zinc-900 ${focusRing} ${
        isActive
          ? "border-emerald-500 ring-2 ring-emerald-500/20"
          : "border-zinc-200 dark:border-white/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </p>

          <p className="mt-0.5 text-xl font-semibold leading-tight text-zinc-950 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </button>
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
    <div className="min-w-0">
      <dt className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>

      <dd className="mt-0.5 break-words text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {value || "-"}
      </dd>
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
  const reviewLabel = lang === "ja" ? "審査" : "Review";
  const viewLabel = lang === "ja" ? "詳細" : "View";
  const editLabel = lang === "ja" ? "編集" : "Edit";
  const deleteLabel = lang === "ja" ? "削除" : "Delete";

  const base = compact
    ? "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition"
    : "inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition sm:flex-none";

  const reviewBase = compact
    ? "inline-flex h-8 cursor-pointer items-center justify-center rounded-lg border px-3 text-xs font-medium transition"
    : base;

  const neutral =
    "border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10";

  const danger =
    "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10";

  const review = needsAttention
    ? danger
    : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-400/30 dark:text-emerald-300 dark:hover:bg-emerald-400/10";

  return (
    <>
      {showReview && (
        <button
          type="button"
          onClick={onReview}
          className={`${reviewBase} ${review} ${focusRing}`}
        >
          {reviewLabel}
        </button>
      )}

      <button
        type="button"
        onClick={onView}
        aria-label={viewLabel}
        title={viewLabel}
        className={`${base} ${neutral} ${focusRing}`}
      >
        <Eye className="h-4 w-4" />

        {!compact && viewLabel}
      </button>

      <button
        type="button"
        onClick={onEdit}
        aria-label={editLabel}
        title={editLabel}
        className={`${base} ${neutral} ${focusRing}`}
      >
        <Edit3 className="h-4 w-4" />

        {!compact && editLabel}
      </button>

      <button
        type="button"
        onClick={onDelete}
        aria-label={deleteLabel}
        title={deleteLabel}
        className={`${base} ${danger} ${focusRing}`}
      >
        <Trash2 className="h-4 w-4" />

        {!compact && deleteLabel}
      </button>
    </>
  );
}

// ======================================================
// APPROVAL
// ======================================================

function ApprovalBadge({
  status,
  lang,
}: {
  status: ApprovalStatus;
  lang: string;
}) {
  let className =
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300";

  let label = lang === "ja" ? "承認待ち" : "Pending";

  switch (status) {
    case "approved":
      className =
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";

      label = lang === "ja" ? "承認済み" : "Approved";

      break;

    case "rejected":
      className =
        "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";

      label = lang === "ja" ? "却下" : "Rejected";

      break;
  }

  return (
    <span
      className={`inline-flex h-fit shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

// ======================================================
// ACCOUNT
// ======================================================

function AccountBadge({
  status,
  lang,
}: {
  status: AccountStatus;
  lang: string;
}) {
  let className =
    "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  let label = lang === "ja" ? "無効" : "Inactive";

  switch (status) {
    case "active":
      className =
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";

      label = lang === "ja" ? "有効" : "Active";

      break;

    case "suspended":
      className =
        "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";

      label = lang === "ja" ? "停止中" : "Suspended";

      break;
  }

  return (
    <span
      className={`inline-flex h-fit shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

// ======================================================
// STAFF SCREENING
// ======================================================

function ScreeningBadge({
  status,
  lang,
}: {
  status: SeekerScreeningStatus;
  lang: string;
}) {
  let className =
    "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  let label = lang === "ja" ? "未確認" : "Not Screened";

  switch (status) {
    case "SCREENED":
      className =
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";

      label = lang === "ja" ? "確認済み" : "Screened";

      break;

    case "NEEDS_ATTENTION":
      className =
        "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";

      label = lang === "ja" ? "要確認" : "Needs Attention";

      break;
  }

  return (
    <span
      className={`inline-flex h-fit shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

// ======================================================
// PLACEMENT
// ======================================================

function getPlacementLabel(status: PlacementStatus, lang: string) {
  switch (status) {
    case "matching":
      return lang === "ja" ? "マッチング中" : "Matching";

    case "interview":
      return lang === "ja" ? "面接" : "Interview";

    case "selected":
      return lang === "ja" ? "選考済み" : "Selected";

    case "placed":
      return lang === "ja" ? "配置済み" : "Placed";

    default:
      return lang === "ja" ? "未配置" : "Unplaced";
  }
}
