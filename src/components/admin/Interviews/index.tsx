"use client";

import {
  CalendarDays,
  CheckCircle2,
  Eye,
  Link2,
  Pencil,
  RefreshCw,
  Search,
  Video,
  XCircle,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import { useAdminInterviews } from "./hook";

import InterviewDetailsModal from "./InterviewDetailsModal";

import EditInterviewModal from "./EditInterviewModal";

import type {
  AdminInterviewMethod,
  AdminInterviewMethodFilter,
  AdminInterviewStatus,
  AdminInterviewStatusFilter,
} from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

const selectClass =
  "h-10 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white";

// ======================================================
// COMPONENT
// ======================================================

export default function AdminInterviewsPage() {
  const { lang } = useLanguage();

  const {
    interviews,

    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    methodFilter,
    setMethodFilter,

    selectedInterview,

    editingInterview,

    isLoading,
    isFetching,
    isDetailsLoading,
    isUpdating,

    openDetails,
    closeDetails,

    openEdit,
    closeEdit,

    submitUpdate,

    refetch,
  } = useAdminInterviews();

  // ==================================================
  // LOADING
  // ==================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center sm:min-h-[500px]">
        <RefreshCw
          role="status"
          aria-label={lang === "ja" ? "読み込み中" : "Loading"}
          className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400"
        />
      </div>
    );
  }

  // ==================================================
  // FILTERS
  // ==================================================

  const statusOptions: Array<{
    value: AdminInterviewStatusFilter;

    label: string;
  }> = [
    {
      value: "ALL",

      label: lang === "ja" ? "すべて" : "All Statuses",
    },

    {
      value: "AWAITING_LINK",

      label: lang === "ja" ? "リンク待ち" : "Awaiting Link",
    },

    {
      value: "CONFIRMED",

      label: lang === "ja" ? "確定" : "Confirmed",
    },

    {
      value: "COMPLETED",

      label: lang === "ja" ? "完了" : "Completed",
    },

    {
      value: "CANCELLED",

      label: lang === "ja" ? "キャンセル" : "Cancelled",
    },
  ];

  const methodOptions: Array<{
    value: AdminInterviewMethodFilter;

    label: string;
  }> = [
    {
      value: "ALL",

      label: lang === "ja" ? "すべての方法" : "All Methods",
    },

    {
      value: "ZOOM",

      label: "Zoom",
    },

    {
      value: "GOOGLE_MEET",

      label: "Google Meet",
    },

    {
      value: "PHONE",

      label: lang === "ja" ? "電話" : "Phone",
    },

    {
      value: "FACE_TO_FACE",

      label: lang === "ja" ? "対面" : "Face-to-Face",
    },

    {
      value: "OTHER",

      label: lang === "ja" ? "その他" : "Other",
    },
  ];

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="min-w-0 space-y-6">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white sm:text-2xl">
            {lang === "ja" ? "面接管理" : "Interviews"}
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {lang === "ja"
              ? "企業と候補者の面接スケジュールを確認・調整します。"
              : "View and coordinate interview schedules between Providers and candidates."}
          </p>
        </div>

        <button
          type="button"
          disabled={isFetching}
          onClick={() => void refetch()}
          className={`inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />

          {lang === "ja" ? "更新" : "Refresh"}
        </button>
      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <SummaryCard
          label={lang === "ja" ? "総面接数" : "Total"}
          value={summary?.total || 0}
          icon={CalendarDays}
        />

        <SummaryCard
          label={lang === "ja" ? "リンク待ち" : "Awaiting Link"}
          value={summary?.awaitingLink || 0}
          icon={Link2}
        />

        <SummaryCard
          label={lang === "ja" ? "確定" : "Confirmed"}
          value={summary?.confirmed || 0}
          icon={CheckCircle2}
        />

        <SummaryCard
          label={lang === "ja" ? "完了" : "Completed"}
          value={summary?.completed || 0}
          icon={Video}
        />

        <SummaryCard
          label={lang === "ja" ? "キャンセル" : "Cancelled"}
          value={summary?.cancelled || 0}
          icon={XCircle}
        />
      </div>

      {/* FILTERS */}

      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label={lang === "ja" ? "面接を検索" : "Search interviews"}
              placeholder={
                lang === "ja"
                  ? "候補者、企業、求人、面接IDを検索..."
                  : "Search candidate, company, vacancy, interview ID..."
              }
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <select
            value={statusFilter}
            aria-label={lang === "ja" ? "ステータス" : "Status"}
            onChange={(event) =>
              setStatusFilter(event.target.value as AdminInterviewStatusFilter)
            }
            className={selectClass}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={methodFilter}
            aria-label={lang === "ja" ? "面接方法" : "Method"}
            onChange={(event) =>
              setMethodFilter(event.target.value as AdminInterviewMethodFilter)
            }
            className={selectClass}
          >
            {methodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LIST */}

      {interviews.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-16 text-center dark:border-white/10 dark:bg-zinc-900 sm:py-20">
          <CalendarDays className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-600" />

          <p className="mt-4 text-zinc-500 dark:text-zinc-400">
            {lang === "ja" ? "面接がありません。" : "No interviews found."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-5 xl:grid-cols-2">
          {interviews.map((interview) => {
            const canEdit =
              interview.applicationStatus === "INTERVIEW" &&
              interview.status !== "COMPLETED" &&
              interview.status !== "CANCELLED";

            return (
              <article
                key={interview.interviewId}
                className="min-w-0 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {interview.interviewId}
                    </p>

                    <h3 className="mt-1 truncate text-lg font-semibold text-zinc-950 dark:text-white sm:text-xl">
                      {interview.candidate?.name || "-"}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {interview.vacancy?.title || "-"}
                    </p>
                  </div>

                  <InterviewStatusBadge status={interview.status} lang={lang} />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <CardField
                    label={lang === "ja" ? "企業" : "Company"}
                    value={
                      interview.vacancy?.companyName ||
                      interview.provider?.companyName
                    }
                  />

                  <CardField
                    label={lang === "ja" ? "面接日" : "Date"}
                    value={formatDate(interview.interviewDate, lang)}
                  />

                  <CardField
                    label={lang === "ja" ? "時間" : "Time"}
                    value={interview.interviewTime}
                  />

                  <CardField
                    label={lang === "ja" ? "方法" : "Method"}
                    value={getMethodLabel(interview.interviewMethod, lang)}
                  />

                  <CardField
                    label={lang === "ja" ? "タイムゾーン" : "Timezone"}
                    value={interview.timezone}
                  />

                  <CardField
                    label={lang === "ja" ? "応募ID" : "Application ID"}
                    value={interview.applicationId}
                  />
                </div>

                {interview.status === "AWAITING_LINK" && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
                    {lang === "ja"
                      ? "オンライン面接リンクの追加が必要です。"
                      : "This online interview is waiting for a meeting link."}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => openDetails(interview.interviewId)}
                    className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}
                  >
                    <Eye className="h-4 w-4" />

                    {lang === "ja" ? "詳細" : "View Details"}
                  </button>

                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => openEdit(interview)}
                      className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 sm:flex-none ${focusRing}`}
                    >
                      <Pencil className="h-4 w-4" />

                      {lang === "ja" ? "編集" : "Edit"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* DETAILS */}

      {selectedInterview && !isDetailsLoading && (
        <InterviewDetailsModal
          interview={selectedInterview}
          onClose={closeDetails}
          onEdit={openEdit}
        />
      )}

      {/* EDIT */}
      {editingInterview && (
        <EditInterviewModal
          key={editingInterview.interviewId}
          interview={editingInterview}
          isSaving={isUpdating}
          onClose={closeEdit}
          onSubmit={submitUpdate}
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

  icon: React.ComponentType<{
    className?: string;
  }>;
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
// STATUS
// ======================================================

function InterviewStatusBadge({
  status,
  lang,
}: {
  status: AdminInterviewStatus;
  lang: string;
}) {
  let className =
    "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  let label: string = status;

  switch (status) {
    case "AWAITING_LINK":
      className =
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300";

      label = lang === "ja" ? "リンク待ち" : "Awaiting Link";

      break;

    case "CONFIRMED":
      className =
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";

      label = lang === "ja" ? "確定" : "Confirmed";

      break;

    case "COMPLETED":
      className =
        "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300";

      label = lang === "ja" ? "完了" : "Completed";

      break;

    case "CANCELLED":
      className =
        "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";

      label = lang === "ja" ? "キャンセル" : "Cancelled";

      break;
  }

  return (
    <span
      className={`h-fit shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
// ======================================================
// METHOD
// ======================================================

function getMethodLabel(method: AdminInterviewMethod, lang: string) {
  switch (method) {
    case "ZOOM":
      return "Zoom";

    case "GOOGLE_MEET":
      return "Google Meet";

    case "PHONE":
      return lang === "ja" ? "電話" : "Phone";

    case "FACE_TO_FACE":
      return lang === "ja" ? "対面" : "Face-to-Face";

    default:
      return lang === "ja" ? "その他" : "Other";
  }
}

// ======================================================
// DATE
// ======================================================

function formatDate(value?: string | null, lang = "en") {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",

    month: lang === "ja" ? "numeric" : "short",

    day: "numeric",
  }).format(date);
}