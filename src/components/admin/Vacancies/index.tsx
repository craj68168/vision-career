"use client";

import type { ComponentType } from "react";
import {
  Briefcase,
  CheckCircle2,
  Clock3,
  Eye,
  RefreshCw,
  Search,
  Send,
  XCircle,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import { useAdminVacancies } from "./hook";

import {
  formatVacancyDate,
  formatVacancySalary,
  getVacancyStatusClass,
  getVacancyStatusLabel,
} from "./helper";

import VacancyDetailsModal from "./VacancyDetailsModal";

import RejectVacancyModal from "./RejectVacancyModal";

import type { VacancyStaffScreeningStatus, VacancyStatus } from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

// Raw IDs are noisy, so show a short reference instead (full ID on hover).
const shortId = (id: string) => (id.length > 8 ? `#${id.slice(-6)}` : id);

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
// SCREENING LABEL
// ======================================================

function getScreeningLabel(status: VacancyStaffScreeningStatus, lang: string) {
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
}

// ======================================================
// SCREENING CLASS
// ======================================================

function getScreeningClass(status: VacancyStaffScreeningStatus) {
  switch (status) {
    case "SCREENED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";

    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";

    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";
  }
}

// ======================================================
// ADMIN VACANCIES
// ======================================================

export default function AdminVacancies() {
  const { lang } = useLanguage();

  const {
    vacancies,
    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    selectedVacancy,
    rejectingVacancy,

    isLoading,
    isFetching,

    isApproving,
    isRejecting,
    isPublishing,
    isClosing,

    openDetails,
    closeDetails,

    openReject,
    closeReject,

    approveVacancy,
    rejectVacancy,
    publishVacancy,
    closeVacancy,

    refetch,
  } = useAdminVacancies();

  const filters: Array<{
    value: "ALL" | VacancyStatus;
    label: string;
  }> = [
    { value: "ALL", label: lang === "ja" ? "すべて" : "All" },
    {
      value: "pending_review",
      label: lang === "ja" ? "審査待ち" : "Pending Review",
    },
    { value: "approved", label: lang === "ja" ? "承認済み" : "Approved" },
    { value: "published", label: lang === "ja" ? "公開中" : "Published" },
    { value: "rejected", label: lang === "ja" ? "却下" : "Rejected" },
    { value: "draft", label: lang === "ja" ? "下書き" : "Draft" },
    { value: "closed", label: lang === "ja" ? "終了" : "Closed" },
  ];

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

  return (
    <div className="min-w-0 space-y-4">
      {/* HEADER */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white sm:text-2xl">
            {lang === "ja" ? "求人管理" : "Vacancies"}
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {lang === "ja"
              ? "企業から提出された求人を審査・承認・公開します。"
              : "Review Staff screening, approve, publish and manage Provider vacancies."}
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

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard
          label={lang === "ja" ? "総求人" : "Total Vacancies"}
          value={summary?.total || 0}
          icon={Briefcase}
          isActive={statusFilter === "ALL"}
          onClick={() => setStatusFilter("ALL")}
        />

        <SummaryCard
          label={lang === "ja" ? "審査待ち" : "Pending Review"}
          value={summary?.pendingReview || 0}
          icon={Clock3}
          isActive={statusFilter === "pending_review"}
          onClick={() => setStatusFilter("pending_review")}
        />

        <SummaryCard
          label={lang === "ja" ? "承認済み" : "Approved"}
          value={summary?.approved || 0}
          icon={CheckCircle2}
          isActive={statusFilter === "approved"}
          onClick={() => setStatusFilter("approved")}
        />

        <SummaryCard
          label={lang === "ja" ? "公開中" : "Published"}
          value={summary?.published || 0}
          icon={Send}
          isActive={statusFilter === "published"}
          onClick={() => setStatusFilter("published")}
        />
      </div>

      {/* FILTER */}

      <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label={lang === "ja" ? "ステータス" : "Status filter"}
          >
            {filters.map((filter) => {
              const isActive = statusFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  aria-pressed={isActive}
                  className={`h-8 cursor-pointer rounded-md px-3 text-xs font-medium transition ${focusRing} ${
                    isActive
                      ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full xl:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label={lang === "ja" ? "求人を検索" : "Search vacancies"}
              placeholder={
                lang === "ja"
                  ? "求人、企業、勤務地を検索..."
                  : "Search vacancy, company, location..."
              }
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* CARDS */}

      {vacancies.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-12 text-center dark:border-white/10 dark:bg-zinc-900 sm:py-16">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {lang === "ja" ? "求人がありません。" : "No vacancies found."}
          </p>

          {(statusFilter !== "ALL" || search) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter("ALL");
                setSearch("");
              }}
              className={`mt-4 inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
            >
              {lang === "ja" ? "フィルターをクリア" : "Clear filters"}
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
          {vacancies.map((vacancy) => (
            <article
              key={vacancy.vacancyId}
              className="flex min-w-0 flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900"
            >
              {/* TOP */}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="break-words text-base font-semibold text-zinc-950 dark:text-white">
                    {vacancy.title}
                  </h3>

                  {vacancy.titleKana && (
                    <p className="mt-0.5 break-words text-xs text-zinc-400 dark:text-zinc-500">
                      {vacancy.titleKana}
                    </p>
                  )}

                  <p className="mt-1 truncate text-sm text-zinc-600 dark:text-zinc-300">
                    {vacancy.companyName}
                  </p>

                  <p
                    title={vacancy.vacancyId}
                    className="mt-0.5 truncate text-xs text-zinc-400 dark:text-zinc-500"
                  >
                    {shortId(vacancy.vacancyId)}
                  </p>
                </div>

                <span
                  className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${getVacancyStatusClass(
                    vacancy.status,
                  )}`}
                >
                  {getVacancyStatusLabel(vacancy.status, lang)}
                </span>
              </div>

              {/* INFORMATION */}

              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-md bg-zinc-50 p-3 dark:bg-white/5">
                <CardField
                  label={lang === "ja" ? "雇用形態" : "Employment"}
                  value={vacancy.employmentType}
                />

                <CardField
                  label={lang === "ja" ? "募集人数" : "Openings"}
                  value={`${vacancy.numberOfPeople}`}
                />

                <CardField
                  label={lang === "ja" ? "勤務地" : "Location"}
                  value={vacancy.workLocation}
                />

                <CardField
                  label={lang === "ja" ? "給与" : "Salary"}
                  value={formatVacancySalary(
                    vacancy.salaryMin,
                    vacancy.salaryMax,
                  )}
                />
              </dl>

              {/* STAFF SCREENING + CREATED */}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {lang === "ja" ? "スタッフ確認" : "Staff Screening"}
                  </span>

                  <span
                    className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium ${getScreeningClass(
                      vacancy.staffScreening.status,
                    )}`}
                  >
                    {getScreeningLabel(vacancy.staffScreening.status, lang)}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  {lang === "ja" ? "作成日: " : "Created: "}

                  {formatVacancyDate(vacancy.createdAt, lang)}
                </p>
              </div>

              {/* ATTENTION NOTE */}

              {vacancy.staffScreening.status === "NEEDS_ATTENTION" && (
                <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 dark:border-red-400/20 dark:bg-red-400/10">
                  <p className="text-xs font-medium text-red-700 dark:text-red-300">
                    {lang === "ja"
                      ? "スタッフ確認が必要です"
                      : "Staff Needs Attention"}
                  </p>

                  {vacancy.staffScreening.note && (
                    <p className="mt-1 line-clamp-2 text-sm text-red-600 dark:text-red-300/90">
                      {vacancy.staffScreening.note}
                    </p>
                  )}
                </div>
              )}

              {/* ADMIN REJECTION */}

              {vacancy.rejectionReason && (
                <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 dark:border-red-400/20 dark:bg-red-400/10">
                  <p className="text-xs font-medium text-red-700 dark:text-red-300">
                    {lang === "ja" ? "却下理由" : "Rejection Reason"}
                  </p>

                  <p className="mt-1 break-words text-sm text-red-600 dark:text-red-300/90">
                    {vacancy.rejectionReason}
                  </p>
                </div>
              )}

              {/* ACTIONS */}

              <div className="mt-auto flex flex-wrap justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => openDetails(vacancy.vacancyId)}
                  className={`inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}
                >
                  <Eye className="h-4 w-4" />

                  {lang === "ja" ? "詳細" : "View"}
                </button>

                {vacancy.status === "pending_review" && (
                  <>
                    <button
                      type="button"
                      onClick={() => openReject(vacancy)}
                      className={`inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10 sm:flex-none ${focusRing}`}
                    >
                      <XCircle className="h-4 w-4" />

                      {lang === "ja" ? "却下" : "Reject"}
                    </button>

                    <button
                      type="button"
                      disabled={isApproving}
                      onClick={() => approveVacancy(vacancy.vacancyId)}
                      className={`inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${focusRing}`}
                    >
                      <CheckCircle2 className="h-4 w-4" />

                      {lang === "ja" ? "承認" : "Approve"}
                    </button>
                  </>
                )}

                {vacancy.status === "approved" && (
                  <button
                    type="button"
                    disabled={isPublishing}
                    onClick={() => publishVacancy(vacancy.vacancyId)}
                    className={`inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${focusRing}`}
                  >
                    <Send className="h-4 w-4" />

                    {lang === "ja" ? "公開" : "Publish"}
                  </button>
                )}

                {vacancy.status === "published" && (
                  <button
                    type="button"
                    disabled={isClosing}
                    onClick={() => closeVacancy(vacancy.vacancyId)}
                    className={`inline-flex h-9 flex-1 cursor-pointer items-center justify-center rounded-lg bg-amber-600 px-3 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${focusRing}`}
                  >
                    {lang === "ja" ? "終了" : "Close"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* DETAILS */}

      {selectedVacancy && (
        <VacancyDetailsModal
          vacancy={selectedVacancy}
          isApproving={isApproving}
          isPublishing={isPublishing}
          isClosing={isClosing}
          onClose={closeDetails}
          onApprove={approveVacancy}
          onReject={() => openReject(selectedVacancy)}
          onPublish={publishVacancy}
          onCloseVacancy={closeVacancy}
        />
      )}

      {/* REJECT */}

      {rejectingVacancy && (
        <RejectVacancyModal
          vacancy={rejectingVacancy}
          isRejecting={isRejecting}
          onClose={closeReject}
          onReject={rejectVacancy}
        />
      )}
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
  value: string | null | undefined;
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