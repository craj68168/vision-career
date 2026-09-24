"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
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
      <div className="flex min-h-[500px] items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-indigo-600" />
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
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            {lang === "ja" ? "面接管理" : "Interviews"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {lang === "ja"
              ? "企業と候補者の面接スケジュールを確認・調整します。"
              : "View and coordinate interview schedules between Providers and candidates."}
          </p>
        </div>

        <button
          type="button"
          disabled={isFetching}
          onClick={() => void refetch()}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />

          {lang === "ja" ? "更新" : "Refresh"}
        </button>
      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                lang === "ja"
                  ? "候補者、企業、求人、面接IDを検索..."
                  : "Search candidate, company, vacancy, interview ID..."
              }
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as AdminInterviewStatusFilter)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={methodFilter}
            onChange={(event) =>
              setMethodFilter(event.target.value as AdminInterviewMethodFilter)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
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
        <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />

          <p className="mt-4 text-slate-500">
            {lang === "ja" ? "面接がありません。" : "No interviews found."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {interviews.map((interview) => {
            const canEdit =
              interview.applicationStatus === "INTERVIEW" &&
              interview.status !== "COMPLETED" &&
              interview.status !== "CANCELLED";

            return (
              <article
                key={interview.interviewId}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-indigo-500">
                      {interview.interviewId}
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-950">
                      {interview.candidate?.name || "-"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
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
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                    {lang === "ja"
                      ? "オンライン面接リンクの追加が必要です。"
                      : "This online interview is waiting for a meeting link."}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => openDetails(interview.interviewId)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="h-4 w-4" />

                    {lang === "ja" ? "詳細" : "View Details"}
                  </button>

                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => openEdit(interview)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>

        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
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
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-900">{value || "-"}</p>
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
  let className = "border-slate-200 bg-slate-50 text-slate-700";

  let label: string = status;

  switch (status) {
    case "AWAITING_LINK":
      className = "border-amber-200 bg-amber-50 text-amber-700";

      label = lang === "ja" ? "リンク待ち" : "Awaiting Link";

      break;

    case "CONFIRMED":
      className = "border-emerald-200 bg-emerald-50 text-emerald-700";

      label = lang === "ja" ? "確定" : "Confirmed";

      break;

    case "COMPLETED":
      className = "border-blue-200 bg-blue-50 text-blue-700";

      label = lang === "ja" ? "完了" : "Completed";

      break;

    case "CANCELLED":
      className = "border-red-200 bg-red-50 text-red-700";

      label = lang === "ja" ? "キャンセル" : "Cancelled";

      break;
  }

  return (
    <span
      className={`h-fit rounded-full border px-3 py-1 text-xs font-semibold ${className}`}
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
