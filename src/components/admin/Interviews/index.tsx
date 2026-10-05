"use client";

import type { ComponentType } from "react";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  Link2,
  MapPin,
  Pencil,
  Phone,
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
  "h-9 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white";

// Raw IDs are noisy, so show a short reference instead (full ID on hover).
const shortId = (id?: string | null) =>
  !id ? "-" : id.length > 8 ? `#${id.slice(-6)}` : id;

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
    { value: "ALL", label: lang === "ja" ? "すべて" : "All Statuses" },
    {
      value: "AWAITING_LINK",
      label: lang === "ja" ? "リンク待ち" : "Awaiting Link",
    },
    { value: "CONFIRMED", label: lang === "ja" ? "確定" : "Confirmed" },
    { value: "COMPLETED", label: lang === "ja" ? "完了" : "Completed" },
    {
      value: "CANCELLED",
      label: lang === "ja" ? "キャンセル" : "Cancelled",
    },
  ];

  const methodOptions: Array<{
    value: AdminInterviewMethodFilter;
    label: string;
  }> = [
    { value: "ALL", label: lang === "ja" ? "すべての方法" : "All Methods" },
    { value: "ZOOM", label: "Zoom" },
    { value: "GOOGLE_MEET", label: "Google Meet" },
    { value: "PHONE", label: lang === "ja" ? "電話" : "Phone" },
    {
      value: "FACE_TO_FACE",
      label: lang === "ja" ? "対面" : "Face-to-Face",
    },
    { value: "OTHER", label: lang === "ja" ? "その他" : "Other" },
  ];

  const hasActiveFilters =
    statusFilter !== "ALL" || methodFilter !== "ALL" || Boolean(search);

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="min-w-0 space-y-4">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
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
          className={`inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />

          {lang === "ja" ? "更新" : "Refresh"}
        </button>
      </div>

      {/* SUMMARY (clickable: each card applies a status filter) */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <SummaryCard
          label={lang === "ja" ? "総面接数" : "Total"}
          value={summary?.total || 0}
          icon={CalendarDays}
          tone="violet"
          isActive={statusFilter === "ALL"}
          onClick={() => setStatusFilter("ALL")}
        />

        <SummaryCard
          label={lang === "ja" ? "リンク待ち" : "Awaiting Link"}
          value={summary?.awaitingLink || 0}
          icon={Link2}
          tone="amber"
          isActive={statusFilter === "AWAITING_LINK"}
          onClick={() => setStatusFilter("AWAITING_LINK")}
        />

        <SummaryCard
          label={lang === "ja" ? "確定" : "Confirmed"}
          value={summary?.confirmed || 0}
          icon={CheckCircle2}
          tone="emerald"
          isActive={statusFilter === "CONFIRMED"}
          onClick={() => setStatusFilter("CONFIRMED")}
        />

        <SummaryCard
          label={lang === "ja" ? "完了" : "Completed"}
          value={summary?.completed || 0}
          icon={Video}
          tone="blue"
          isActive={statusFilter === "COMPLETED"}
          onClick={() => setStatusFilter("COMPLETED")}
        />

        <SummaryCard
          label={lang === "ja" ? "キャンセル" : "Cancelled"}
          value={summary?.cancelled || 0}
          icon={XCircle}
          tone="red"
          isActive={statusFilter === "CANCELLED"}
          onClick={() => setStatusFilter("CANCELLED")}
        />
      </div>

      {/* FILTERS */}

      <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

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
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
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
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-12 text-center dark:border-white/10 dark:bg-zinc-900 sm:py-16">
          <CalendarDays className="mx-auto h-9 w-9 text-zinc-300 dark:text-zinc-600" />

          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            {lang === "ja" ? "面接がありません。" : "No interviews found."}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter("ALL");
                setMethodFilter("ALL");
                setSearch("");
              }}
              className={`mt-4 inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
            >
              {lang === "ja" ? "フィルターをクリア" : "Clear filters"}
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {interviews.map((interview) => {
            const canEdit =
              interview.applicationStatus === "INTERVIEW" &&
              interview.status !== "COMPLETED" &&
              interview.status !== "CANCELLED";

            const MethodIcon = getMethodIcon(interview.interviewMethod);

            const companyName =
              interview.vacancy?.companyName ||
              interview.provider?.companyName;

            return (
              <article
                key={interview.interviewId}
                className="flex min-w-0 flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
              >
                {/* Candidate + status */}

                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700"
                  >
                    {getInitials(interview.candidate?.name)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold leading-snug text-zinc-950">
                      {interview.candidate?.name || "-"}
                    </h3>

                    <p className="mt-0.5 truncate text-sm text-zinc-600">
                      {interview.vacancy?.title || "-"}
                    </p>

                    {companyName && (
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
                        <Building2 className="h-3.5 w-3.5 shrink-0" />

                        <span className="truncate">{companyName}</span>
                      </p>
                    )}
                  </div>

                  <InterviewStatusBadge status={interview.status} lang={lang} />
                </div>

                {/* Schedule */}

                <dl className="mt-3 flex flex-wrap gap-2 text-sm font-medium">
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-sky-50 px-2.5 py-1 text-sky-800">
                    <dt className="sr-only">
                      {lang === "ja" ? "面接日" : "Date"}
                    </dt>

                    <CalendarDays
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-sky-500"
                    />

                    <dd>{formatDate(interview.interviewDate, lang)}</dd>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-md bg-violet-50 px-2.5 py-1 text-violet-800">
                    <dt className="sr-only">
                      {lang === "ja" ? "時間" : "Time"}
                    </dt>

                    <Clock
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-violet-500"
                    />

                    <dd>
                      {interview.timezone
                        ? `${interview.interviewTime} (${interview.timezone})`
                        : interview.interviewTime || "-"}
                    </dd>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-800">
                    <dt className="sr-only">
                      {lang === "ja" ? "方法" : "Method"}
                    </dt>

                    <MethodIcon
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-emerald-500"
                    />

                    <dd>{getMethodLabel(interview.interviewMethod, lang)}</dd>
                  </div>
                </dl>

                {interview.status === "AWAITING_LINK" && (
                  <div
                    role="status"
                    className="mt-3 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700"
                  >
                    <Link2 className="h-3.5 w-3.5 shrink-0" />

                    {lang === "ja"
                      ? "オンライン面接リンクの追加が必要です。"
                      : "This online interview is waiting for a meeting link."}
                  </div>
                )}

                {/* Footer: references + actions */}

                <div className="mt-auto pt-3">
                  <div className="flex flex-col gap-2 border-t border-zinc-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="min-w-0 truncate text-xs text-zinc-400">
                      <span title={interview.interviewId}>
                        {lang === "ja" ? "面接" : "Interview"}{" "}
                        {shortId(interview.interviewId)}
                      </span>

                      <span aria-hidden="true"> · </span>

                      <span title={interview.applicationId}>
                        {lang === "ja" ? "応募" : "Application"}{" "}
                        {shortId(interview.applicationId)}
                      </span>
                    </p>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => openDetails(interview.interviewId)}
                        className={`inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 sm:flex-none ${focusRing}`}
                      >
                        <Eye className="h-4 w-4" />

                        {lang === "ja" ? "詳細" : "View Details"}
                      </button>

                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => openEdit(interview)}
                          className={`inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white transition hover:bg-emerald-700 sm:flex-none ${focusRing}`}
                        >
                          <Pencil className="h-4 w-4" />

                          {lang === "ja" ? "編集" : "Edit"}
                        </button>
                      )}
                    </div>
                  </div>
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

type Tone = "violet" | "amber" | "emerald" | "blue" | "red";

// Colors match the status badges so cards and badges read as one set.
const toneClasses: Record<Tone, { card: string; border: string; icon: string }> = {
  violet: {
    card: "bg-violet-50/70",
    border: "border-violet-100",
    icon: "bg-violet-100 text-violet-700",
  },
  amber: {
    card: "bg-amber-50/70",
    border: "border-amber-100",
    icon: "bg-amber-100 text-amber-700",
  },
  emerald: {
    card: "bg-emerald-50/70",
    border: "border-emerald-100",
    icon: "bg-emerald-100 text-emerald-700",
  },
  blue: {
    card: "bg-blue-50/70",
    border: "border-blue-100",
    icon: "bg-blue-100 text-blue-700",
  },
  red: {
    card: "bg-red-50/70",
    border: "border-red-100",
    icon: "bg-red-100 text-red-700",
  },
};

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
  isActive,
  onClick,
}: {
  label: string;
  value: number;
  icon: ComponentType<{
    className?: string;
  }>;
  tone: Tone;
  isActive: boolean;
  onClick: () => void;
}) {
  const classes = toneClasses[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`min-w-0 cursor-pointer rounded-lg border p-3 text-left shadow-sm transition hover:shadow-md ${classes.card} ${focusRing} ${
        isActive
          ? "border-emerald-500 ring-2 ring-emerald-500/20"
          : `${classes.border} hover:border-emerald-500/50`
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${classes.icon}`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-zinc-600">
            {label}
          </p>

          <p className="mt-0.5 text-xl font-semibold leading-tight text-zinc-950">
            {value}
          </p>
        </div>
      </div>
    </button>
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
      className={`h-fit shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}
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

function getMethodIcon(
  method: AdminInterviewMethod,
): ComponentType<{ className?: string }> {
  switch (method) {
    case "ZOOM":
    case "GOOGLE_MEET":
      return Video;

    case "PHONE":
      return Phone;

    case "FACE_TO_FACE":
      return MapPin;

    default:
      return Link2;
  }
}

// ======================================================
// CANDIDATE
// ======================================================

function getInitials(name?: string | null) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return Array.from(parts[0]).slice(0, 2).join("").toUpperCase();
  }

  return (
    Array.from(parts[0])[0] + Array.from(parts[parts.length - 1])[0]
  ).toUpperCase();
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