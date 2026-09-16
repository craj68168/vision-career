"use client";

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

import type { VacancyStatus } from "./types";

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;

  value: number;

  icon: typeof Briefcase;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
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
    {
      value: "ALL",
      label: lang === "ja" ? "すべて" : "All",
    },

    {
      value: "pending_review",
      label: lang === "ja" ? "審査待ち" : "Pending Review",
    },

    {
      value: "approved",
      label: lang === "ja" ? "承認済み" : "Approved",
    },

    {
      value: "published",
      label: lang === "ja" ? "公開中" : "Published",
    },

    {
      value: "rejected",
      label: lang === "ja" ? "却下" : "Rejected",
    },

    {
      value: "draft",
      label: lang === "ja" ? "下書き" : "Draft",
    },

    {
      value: "closed",
      label: lang === "ja" ? "終了" : "Closed",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            {lang === "ja" ? "求人管理" : "Vacancies"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {lang === "ja"
              ? "企業から提出された求人を審査・承認・公開します。"
              : "Review, approve, publish and manage Provider vacancies."}
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label={lang === "ja" ? "総求人" : "Total Vacancies"}
          value={summary?.total || 0}
          icon={Briefcase}
        />

        <SummaryCard
          label={lang === "ja" ? "審査待ち" : "Pending Review"}
          value={summary?.pendingReview || 0}
          icon={Clock3}
        />

        <SummaryCard
          label={lang === "ja" ? "承認済み" : "Approved"}
          value={summary?.approved || 0}
          icon={CheckCircle2}
        />

        <SummaryCard
          label={lang === "ja" ? "公開中" : "Published"}
          value={summary?.published || 0}
          icon={Send}
        />
      </div>

      {/* FILTER */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  statusFilter === filter.value
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="relative w-full xl:max-w-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                lang === "ja"
                  ? "求人、企業、勤務地を検索..."
                  : "Search vacancy, company, location..."
              }
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-400"
            />
          </div>
        </div>
      </div>

      {/* CARDS */}

      {vacancies.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center">
          <p className="text-slate-500">
            {lang === "ja" ? "求人がありません。" : "No vacancies found."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {vacancies.map((vacancy) => (
            <article
              key={vacancy.vacancyId}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-indigo-500">
                    {vacancy.vacancyId}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-950">
                    {vacancy.title}
                  </h2>

                  {vacancy.titleKana && (
                    <p className="mt-1 text-sm text-slate-400">
                      {vacancy.titleKana}
                    </p>
                  )}
                </div>

                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getVacancyStatusClass(
                    vacancy.status,
                  )}`}
                >
                  {getVacancyStatusLabel(vacancy.status, lang)}
                </span>
              </div>

              <p className="mt-4 font-medium text-slate-700">
                {vacancy.companyName}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
              </div>

              <p className="mt-4 text-xs text-slate-400">
                {lang === "ja" ? "作成日: " : "Created: "}

                {formatVacancyDate(vacancy.createdAt, lang)}
              </p>

              {vacancy.rejectionReason && (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3">
                  <p className="text-xs font-semibold text-red-700">
                    {lang === "ja" ? "却下理由" : "Rejection Reason"}
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {vacancy.rejectionReason}
                  </p>
                </div>
              )}

              <div className="mt-auto flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => openDetails(vacancy.vacancyId)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Eye className="h-4 w-4" />

                  {lang === "ja" ? "詳細" : "View"}
                </button>

                {vacancy.status === "pending_review" && (
                  <>
                    <button
                      type="button"
                      onClick={() => openReject(vacancy)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4" />

                      {lang === "ja" ? "却下" : "Reject"}
                    </button>

                    <button
                      type="button"
                      disabled={isApproving}
                      onClick={() => approveVacancy(vacancy.vacancyId)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
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
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
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
                    className="cursor-pointer rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
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

function CardField({
  label,
  value,
}: {
  label: string;

  value: string | null | undefined;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}
