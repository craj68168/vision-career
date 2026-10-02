"use client";

import {
  AlertCircle,
  Building2,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Clock3,
  RefreshCw,
  Send,
  UserRoundSearch,
  Users,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAdminDashboard } from "./hook";
import type { AdminDashboardProps, AdminDashboardRecentVacancy } from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

// ======================================================
// DATE
// ======================================================

const formatDate = (value: string, lang: "ja" | "en") => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// ======================================================
// VACANCY STATUS
// ======================================================

const getVacancyStatusLabel = (
  status: AdminDashboardRecentVacancy["status"],
  lang: "ja" | "en",
) => {
  const labels = {
    draft: {
      en: "Draft",
      ja: "下書き",
    },
    pending_review: {
      en: "Pending Review",
      ja: "審査待ち",
    },

    approved: {
      en: "Approved",
      ja: "承認済み",
    },

    rejected: {
      en: "Rejected",
      ja: "却下",
    },
    published: {
      en: "Published",
      ja: "公開中",
    },
    closed: {
      en: "Closed",
      ja: "終了",
    },
  };

  return labels[status][lang];
};

const getVacancyStatusClass = (
  status: AdminDashboardRecentVacancy["status"],
) => {
  if (status === "published") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300";
  }

  if (status === "pending_review") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300";
  }

  if (status === "rejected") {
    return "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300";
  }

  return "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-300";
};

// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>

        <div className="shrink-0 rounded-lg bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

// ======================================================
// DASHBOARD
// ======================================================

export default function AdminDashboard({
  setActiveDashboardTab,
}: AdminDashboardProps) {
  const { lang } = useLanguage();

  const { data, isLoading, isFetching, error, refetch } = useAdminDashboard();

  // ====================================================
  // LOADING
  // ====================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center sm:min-h-[500px]">
        <div role="status" className="text-center">
          <RefreshCw className="mx-auto h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400" />

          <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {lang === "ja"
              ? "ダッシュボードを読み込み中..."
              : "Loading dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error || !data?.data) {
    return (
      <div className="flex min-h-[320px] items-center justify-center px-4 sm:min-h-[500px]">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/20 dark:bg-red-500/10">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500 dark:text-red-400" />

          <h2 className="mt-4 text-lg font-semibold text-red-900 dark:text-red-200">
            {lang === "ja"
              ? "ダッシュボードを読み込めませんでした"
              : "Failed to load dashboard"}
          </h2>

          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            {error instanceof Error
              ? error.message
              : lang === "ja"
                ? "もう一度お試しください。"
                : "Please try again."}
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className={`mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 ${focusRing}`}
          >
            <RefreshCw className="h-4 w-4" />

            {lang === "ja" ? "再試行" : "Retry"}
          </button>
        </div>
      </div>
    );
  }

  const { summary, recent } = data.data;

  const inProviderProcess =
    summary.applications.sentToProvider +
    summary.applications.underReview +
    summary.applications.interview +
    summary.applications.selected;

  return (
    <div className="min-w-0 space-y-6">
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white sm:text-2xl">
            {lang === "ja" ? "ダッシュボード" : "Dashboard"}
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {lang === "ja"
              ? "現在の採用システムの概要"
              : "Overview of the current recruitment system."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className={`inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />

          {lang === "ja" ? "更新" : "Refresh"}
        </button>
      </div>

      {/* =================================================
          PRIMARY SUMMARY
      ================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={lang === "ja" ? "求職者" : "Job Seekers"}
          value={summary.jobSeekers.total}
          icon={Users}
        />

        <StatCard
          title={lang === "ja" ? "企業" : "Job Providers"}
          value={summary.providers.total}
          icon={Building2}
        />

        <StatCard
          title={lang === "ja" ? "求人" : "Vacancies"}
          value={summary.vacancies.total}
          subtitle={
            lang === "ja"
              ? `公開中: ${summary.vacancies.published}`
              : `Published: ${summary.vacancies.published}`
          }
          icon={Briefcase}
        />

        <StatCard
          title={lang === "ja" ? "応募" : "Applications"}
          value={summary.applications.total}
          subtitle={
            lang === "ja"
              ? `管理者承認待ち: ${summary.applications.pendingAdminApproval}`
              : `Pending Admin Approval: ${summary.applications.pendingAdminApproval}`
          }
          icon={ClipboardList}
        />
      </div>

      {/* =================================================
          WORKFLOW SUMMARY
      ================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={lang === "ja" ? "求人審査待ち" : "Pending Vacancy Reviews"}
          value={summary.vacancies.pendingReview}
          icon={Clock3}
        />

        <StatCard
          title={lang === "ja" ? "応募承認待ち" : "Pending Applications"}
          value={summary.applications.pendingAdminApproval}
          icon={UserRoundSearch}
        />

        <StatCard
          title={lang === "ja" ? "企業選考中" : "Provider Process"}
          value={inProviderProcess}
          icon={Send}
        />

        <StatCard
          title={lang === "ja" ? "人材紹介依頼" : "Placement Requests"}
          value={summary.placementRequests.total}
          icon={CheckCircle2}
        />
      </div>

      {/* =================================================
          RECENT / PENDING
      ================================================== */}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* ===============================================
            PENDING APPLICATIONS
        ================================================ */}

        <section className="min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
            <div className="min-w-0">
              <h2 className="font-semibold text-zinc-950 dark:text-white">
                {lang === "ja" ? "承認待ち応募" : "Pending Applications"}
              </h2>

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {lang === "ja"
                  ? "管理者の確認が必要な応募"
                  : "Applications waiting for Admin review."}
              </p>
            </div>

            {setActiveDashboardTab && (
              <button
                type="button"
                onClick={() => setActiveDashboardTab("applications")}
                className={`shrink-0 cursor-pointer rounded-md text-sm font-medium text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 ${focusRing}`}
              >
                {lang === "ja" ? "すべて表示" : "View All"}
              </button>
            )}
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-white/10">
            {recent.pendingApplications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />

                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                  {lang === "ja"
                    ? "承認待ちの応募はありません。"
                    : "No applications are waiting for approval."}
                </p>
              </div>
            ) : (
              recent.pendingApplications.map((application) => (
                <div
                  key={application.applicationId}
                  className="px-4 py-4 transition hover:bg-zinc-50 dark:hover:bg-white/5 sm:px-5"
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        {application.applicationId}
                      </p>

                      <h3 className="mt-1 truncate font-semibold text-zinc-950 dark:text-white">
                        {application.candidateName}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                        {application.vacancyTitle}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {application.companyName}
                      </p>
                    </div>

                    <span className="shrink-0 whitespace-nowrap rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                      {lang === "ja" ? "管理者承認待ち" : "Pending Approval"}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
                    {formatDate(application.appliedAt, lang)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ===============================================
            RECENT VACANCIES
        ================================================ */}

        <section className="min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
            <div className="min-w-0">
              <h2 className="font-semibold text-zinc-950 dark:text-white">
                {lang === "ja" ? "最近の求人" : "Recent Vacancies"}
              </h2>

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {lang === "ja"
                  ? "最新の求人投稿"
                  : "Most recently created vacancies."}
              </p>
            </div>

            {setActiveDashboardTab && (
              <button
                type="button"
                onClick={() => setActiveDashboardTab("vacancies")}
                className={`shrink-0 cursor-pointer rounded-md text-sm font-medium text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 ${focusRing}`}
              >
                {lang === "ja" ? "すべて表示" : "View All"}
              </button>
            )}
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-white/10">
            {recent.vacancies.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
                {lang === "ja" ? "求人はありません。" : "No vacancies found."}
              </div>
            ) : (
              recent.vacancies.map((vacancy) => (
                <div
                  key={vacancy.vacancyId}
                  className="px-4 py-4 transition hover:bg-zinc-50 dark:hover:bg-white/5 sm:px-5"
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        {vacancy.vacancyId}
                      </p>

                      <h3 className="mt-1 font-semibold text-zinc-950 dark:text-white">
                        {vacancy.title}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                        {vacancy.companyName}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {vacancy.workLocation}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${getVacancyStatusClass(
                        vacancy.status,
                      )}`}
                    >
                      {getVacancyStatusLabel(vacancy.status, lang)}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
                    {formatDate(vacancy.createdAt, lang)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}