"use client";

import { useEffect } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  AlertCircle,
  Briefcase,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
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

type Lang = "ja" | "en";

// Applications older than this many days are highlighted as overdue.
const OVERDUE_DAYS = 3;

// ======================================================
// HELPERS
// ======================================================

const formatDate = (value: string, lang: Lang) => {
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

// Whole days since the given date, or null if the date is invalid.
const getDaysWaiting = (value: string): number | null => {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) {
    return null;
  }
  return Math.max(0, Math.floor((Date.now() - time) / 86_400_000));
};

const getWaitingLabel = (days: number, lang: Lang) => {
  if (days === 0) {
    return lang === "ja" ? "本日応募" : "Applied today";
  }
  if (lang === "ja") {
    return `${days}日待ち`;
  }
  return `Waiting ${days} ${days === 1 ? "day" : "days"}`;
};

// Raw IDs are noisy, so show a short reference instead.
const shortId = (id: string) => (id.length > 8 ? `#${id.slice(-6)}` : id);

const VACANCY_STATUS_LABELS: Record<string, { en: string; ja: string }> = {
  draft: { en: "Draft", ja: "下書き" },
  pending_review: { en: "Pending Review", ja: "審査待ち" },
  approved: { en: "Approved", ja: "承認済み" },
  rejected: { en: "Rejected", ja: "却下" },
  published: { en: "Published", ja: "公開中" },
  closed: { en: "Closed", ja: "終了" },
};

// Falls back to the raw status so an unknown value never crashes the page.
const getVacancyStatusLabel = (
  status: AdminDashboardRecentVacancy["status"],
  lang: Lang,
) => VACANCY_STATUS_LABELS[status]?.[lang] ?? status;

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
// STAT CARD (button when onClick is provided, div otherwise)
// ======================================================

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  onClick,
  highlight = false,
}: {
  title: string;
  value: number;
  subtitle?: string;
  icon: ComponentType<{ className?: string }>;
  onClick?: () => void;
  highlight?: boolean;
}) {
  const content = (
    <div className="flex items-center gap-3">
      <div
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${
          highlight
            ? "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300"
            : "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {title}
        </p>

        <div className="mt-0.5 flex min-w-0 items-baseline gap-2">
          <p className="text-xl font-semibold leading-tight text-zinc-950 dark:text-white">
            {value}
          </p>

          {subtitle && (
            <p
              title={subtitle}
              className="min-w-0 truncate text-[11px] text-zinc-500 dark:text-zinc-400"
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const base = `min-w-0 rounded-lg border bg-white p-3 shadow-sm dark:bg-zinc-900 ${
    highlight
      ? "border-amber-300 dark:border-amber-400/30"
      : "border-zinc-200 dark:border-white/10"
  }`;

  if (!onClick) {
    return <div className={base}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} w-full cursor-pointer text-left transition hover:border-emerald-500/50 hover:shadow-md ${focusRing}`}
    >
      {content}
    </button>
  );
}

// ======================================================
// LIST ROW (button when onClick is provided, div otherwise)
// ======================================================

function ListRow({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: ReactNode;
}) {
  const base = "block w-full px-4 py-4 text-left sm:px-5";

  if (!onClick) {
    return <div className={base}>{children}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} cursor-pointer transition hover:bg-zinc-50 dark:hover:bg-white/5 ${focusRing}`}
    >
      {children}
    </button>
  );
}

// ======================================================
// LOADING SKELETON
// ======================================================

function DashboardSkeleton({ lang }: { lang: Lang }) {
  const block = "animate-pulse rounded-lg bg-zinc-200 dark:bg-white/10";

  return (
    <div
      role="status"
      aria-label={lang === "ja" ? "読み込み中" : "Loading dashboard"}
      className="min-w-0 space-y-6"
    >
      <div className={`h-10 w-56 ${block}`} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`h-[62px] ${block}`} />
        <div className={`h-[62px] ${block}`} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={`h-[62px] ${block}`} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className={`h-64 ${block}`} />
        <div className={`h-64 ${block}`} />
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

  // Log the technical details; the UI shows a localized message instead.
  useEffect(() => {
    if (error) {
      console.error("Dashboard load error:", error);
    }
  }, [error]);

  const goTo = (tabId: string) =>
    setActiveDashboardTab ? () => setActiveDashboardTab(tabId) : undefined;

  // ====================================================
  // LOADING
  // ====================================================

  if (isLoading) {
    return <DashboardSkeleton lang={lang} />;
  }

  // ====================================================
  // ERROR (only when there is no data to fall back on)
  // ====================================================

  if (!data?.data) {
    return (
      <div className="flex min-h-[320px] items-center justify-center px-4 sm:min-h-[500px]">
        <div
          role="alert"
          className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/20 dark:bg-red-500/10"
        >
          <AlertCircle className="mx-auto h-10 w-10 text-red-500 dark:text-red-400" />

          <h2 className="mt-4 text-lg font-semibold text-red-900 dark:text-red-200">
            {lang === "ja"
              ? "ダッシュボードを読み込めませんでした"
              : "Failed to load dashboard"}
          </h2>

          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            {lang === "ja"
              ? "通信状況を確認して、もう一度お試しください。"
              : "Check your connection and try again."}
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className={`mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />

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

  // Oldest first: this is a queue, so the longest-waiting item is on top.
  const pendingApplications = [...recent.pendingApplications].sort(
    (a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime(),
  );

  const pendingVacancyReviews = summary.vacancies.pendingReview;
  const pendingAdminApplications = summary.applications.pendingAdminApproval;

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

      {/* Shown when a refresh failed but older data is still available. */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />

          <p className="min-w-0 flex-1">
            {lang === "ja"
              ? "最新データを取得できませんでした。表示中の数値は古い可能性があります。"
              : "Couldn't refresh. The numbers shown may be out of date."}
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className={`shrink-0 cursor-pointer rounded-md font-medium underline disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
          >
            {lang === "ja" ? "再試行" : "Retry"}
          </button>
        </div>
      )}

      {/* =================================================
          NEEDS ATTENTION
      ================================================== */}

      <section aria-labelledby="needs-attention-heading" className="space-y-2">
        <h3
          id="needs-attention-heading"
          className="text-sm font-semibold text-zinc-950 dark:text-white"
        >
          {lang === "ja" ? "要対応" : "Needs attention"}
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <StatCard
            title={lang === "ja" ? "求人審査待ち" : "Pending Vacancy Reviews"}
            value={pendingVacancyReviews}
            icon={Clock3}
            highlight={pendingVacancyReviews > 0}
            onClick={goTo("vacancies")}
          />

          <StatCard
            title={lang === "ja" ? "応募承認待ち" : "Pending Applications"}
            value={pendingAdminApplications}
            icon={UserRoundSearch}
            highlight={pendingAdminApplications > 0}
            onClick={goTo("applications")}
          />
        </div>
      </section>

      {/* =================================================
          OVERVIEW
      ================================================== */}

      <section aria-labelledby="overview-heading" className="space-y-2">
        <h3
          id="overview-heading"
          className="text-sm font-semibold text-zinc-950 dark:text-white"
        >
          {lang === "ja" ? "概要" : "Overview"}
        </h3>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title={lang === "ja" ? "求職者" : "Job Seekers"}
            value={summary.jobSeekers.total}
            icon={Users}
            onClick={goTo("seekers")}
          />

          <StatCard
            title={lang === "ja" ? "クライアント" : "Clients"}
            value={summary.providers.total}
            icon={Building2}
            onClick={goTo("providers")}
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
            onClick={goTo("vacancies")}
          />

          <StatCard
            title={lang === "ja" ? "応募" : "Applications"}
            value={summary.applications.total}
            icon={FileText}
            onClick={goTo("applications")}
          />

          <StatCard
            title={lang === "ja" ? "企業選考中" : "Provider Process"}
            value={inProviderProcess}
            subtitle={
              lang === "ja"
                ? "送信済み・審査中・面接・選考通過"
                : "Sent, review, interview, selected"
            }
            icon={Send}
            onClick={goTo("applications")}
          />

          <StatCard
            title={lang === "ja" ? "採用依頼" : "Placement Requests"}
            value={summary.placementRequests.total}
            icon={ClipboardList}
            onClick={goTo("placement-requests")}
          />
        </div>
      </section>

      {/* =================================================
          RECENT / PENDING
      ================================================== */}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* ===============================================
            PENDING APPLICATIONS (oldest first)
        ================================================ */}

        <section className="min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
            <div className="min-w-0">
              <h3 className="font-semibold text-zinc-950 dark:text-white">
                {lang === "ja" ? "承認待ち応募" : "Pending Applications"}
              </h3>

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {lang === "ja"
                  ? "待ち時間が長い順"
                  : "Longest waiting first."}
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
            {pendingApplications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />

                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                  {lang === "ja"
                    ? "承認待ちの応募はありません。"
                    : "No applications are waiting for approval."}
                </p>
              </div>
            ) : (
              pendingApplications.map((application) => {
                const days = getDaysWaiting(application.appliedAt);
                const isOverdue = days !== null && days >= OVERDUE_DAYS;

                return (
                  <ListRow
                    key={application.applicationId}
                    onClick={goTo("applications")}
                  >
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="min-w-0">
                        <p
                          className="truncate text-xs font-medium text-emerald-600 dark:text-emerald-400"
                          title={application.applicationId}
                        >
                          {shortId(application.applicationId)}
                        </p>

                        <h4 className="mt-1 truncate font-semibold text-zinc-950 dark:text-white">
                          {application.candidateName}
                        </h4>

                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                          {application.vacancyTitle}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {application.companyName}
                        </p>
                      </div>

                      {days !== null && (
                        <span
                          className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                            isOverdue
                              ? "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
                          }`}
                        >
                          {getWaitingLabel(days, lang)}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
                      {formatDate(application.appliedAt, lang)}
                    </p>
                  </ListRow>
                );
              })
            )}
          </div>
        </section>

        {/* ===============================================
            RECENT VACANCIES
        ================================================ */}

        <section className="min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
            <div className="min-w-0">
              <h3 className="font-semibold text-zinc-950 dark:text-white">
                {lang === "ja" ? "最近の求人" : "Recent Vacancies"}
              </h3>

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
                <ListRow key={vacancy.vacancyId} onClick={goTo("vacancies")}>
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <p
                        className="truncate text-xs font-medium text-emerald-600 dark:text-emerald-400"
                        title={vacancy.vacancyId}
                      >
                        {shortId(vacancy.vacancyId)}
                      </p>

                      <h4 className="mt-1 font-semibold text-zinc-950 dark:text-white">
                        {vacancy.title}
                      </h4>

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
                </ListRow>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}