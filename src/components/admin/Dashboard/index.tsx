"use client";

import { useEffect } from "react";
import type { ComponentType, ReactNode } from "react";

import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  RefreshCw,
  Send,
  Users,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import { useAdminDashboard } from "./hook";

import type {
  AdminDashboardProps,
  AdminDashboardRecentVacancy,
} from "./types";

// ======================================================
// TYPES AND SHARED STYLES
// ======================================================

type Lang = "ja" | "en";

type MetricTone = "emerald" | "blue" | "violet" | "amber";

type DashboardIcon = ComponentType<{
  className?: string;
}>;

interface SummaryStat {
  key: string;
  title: string;
  value: number;
  subtitle: ReactNode;
  icon: DashboardIcon;
  tone: MetricTone;
  tab: string;
}

const OVERDUE_DAYS = 3;

const focusRing = `
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-emerald-500
  focus-visible:ring-offset-2
  focus-visible:ring-offset-zinc-50
`;

const metricToneClasses: Record<MetricTone, string> = {
  emerald: "bg-emerald-50 text-emerald-700",
  blue: "bg-sky-50 text-sky-700",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
};

// ======================================================
// HELPERS
// ======================================================

const formatDate = (value: string, lang: Lang) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    lang === "ja" ? "ja-JP" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  ).format(date);
};

const formatNumber = (value: number, lang: Lang) => {
  return new Intl.NumberFormat(
    lang === "ja" ? "ja-JP" : "en-US",
  ).format(value);
};

const getDaysWaiting = (value: string): number | null => {
  const time = new Date(value).getTime();

  if (Number.isNaN(time)) {
    return null;
  }

  return Math.max(
    0,
    Math.floor((Date.now() - time) / 86_400_000),
  );
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

const shortId = (id: string) => {
  return id.length > 8 ? `#${id.slice(-6)}` : id;
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return Array.from(parts[0]).slice(0, 2).join("").toUpperCase();
  }

  return (
    Array.from(parts[0])[0] +
    Array.from(parts[parts.length - 1])[0]
  ).toUpperCase();
};

const VACANCY_STATUS_LABELS: Record<
  string,
  { en: string; ja: string }
> = {
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

const getVacancyStatusLabel = (
  status: AdminDashboardRecentVacancy["status"],
  lang: Lang,
) => {
  return VACANCY_STATUS_LABELS[status]?.[lang] ?? status;
};

const getVacancyStatusClass = (
  status: AdminDashboardRecentVacancy["status"],
) => {
  if (status === "published") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "pending_review") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "rejected") {
    return "bg-red-50 text-red-700";
  }

  return "bg-zinc-100 text-zinc-600";
};

// ======================================================
// CLICKABLE SURFACE
// ======================================================

function DashboardSurface({
  onClick,
  className,
  children,
}: {
  onClick?: () => void;
  className: string;
  children: ReactNode;
}) {
  if (!onClick) {
    return <div className={className}>{children}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        ${className}

        cursor-pointer transition
        motion-reduce:transition-none

        ${focusRing}
      `}
    >
      {children}
    </button>
  );
}

// ======================================================
// OVERVIEW METRIC CARD
// ======================================================

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "emerald",
  lang,
  onClick,
}: {
  title: string;
  value: number;
  subtitle: ReactNode;
  icon: DashboardIcon;
  tone?: MetricTone;
  lang: Lang;
  onClick?: () => void;
}) {
  return (
    <DashboardSurface
      onClick={onClick}
      className={`
        block h-full w-full min-w-0
        rounded-lg border border-zinc-200
        bg-white p-3
        text-left shadow-sm

        sm:p-4

        ${
          onClick
            ? `
                hover:border-emerald-500/50
                hover:shadow-md
              `
            : ""
        }
      `}
    >
      <div
        className="
          flex items-start justify-between
          gap-2
        "
      >
        <p
          className="
            min-w-0 break-words
            text-xs font-medium leading-snug
            text-zinc-500

            sm:text-sm
          "
        >
          {title}
        </p>

        <span
          className={`
            grid h-7 w-7 shrink-0 place-items-center
            rounded-md

            sm:h-8 sm:w-8

            ${metricToneClasses[tone]}
          `}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <p
        className="
          mt-2 break-words
          text-xl font-semibold leading-tight
          tracking-tight text-zinc-950

          sm:text-2xl
        "
      >
        {formatNumber(value, lang)}
      </p>

      <div
        className="
          mt-1
          text-xs leading-snug text-zinc-500
        "
      >
        {subtitle}
      </div>
    </DashboardSurface>
  );
}

// ======================================================
// ATTENTION CARD
// ======================================================

function AttentionCard({
  title,
  description,
  value,
  icon: Icon,
  lang,
  onClick,
}: {
  title: string;
  description: string;
  value: number;
  icon: DashboardIcon;
  lang: Lang;
  onClick?: () => void;
}) {
  const needsAttention = value > 0;

  return (
    <DashboardSurface
      onClick={onClick}
      className={`
        flex w-full min-w-0 items-center
        gap-3 rounded-lg border
        p-3 text-left shadow-sm

        sm:p-4

        ${
          needsAttention
            ? "border-amber-200 bg-amber-50/80"
            : "border-zinc-200 bg-white"
        }

        ${
          onClick
            ? `
                hover:border-emerald-500/50
                hover:shadow-md
              `
            : ""
        }
      `}
    >
      <span
        className={`
          grid h-9 w-9 shrink-0 place-items-center
          rounded-md bg-white

          sm:h-10 sm:w-10

          ${needsAttention ? "text-amber-600" : "text-emerald-600"}
        `}
      >
        <Icon
          className="
            h-4 w-4

            sm:h-5 sm:w-5
          "
        />
      </span>

      <div className="min-w-0 flex-1">
        <p
          className="
            break-words
            text-sm font-semibold leading-snug
            text-zinc-900
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            text-xs leading-snug text-zinc-500
          "
        >
          {description}
        </p>
      </div>

      <span
        className="
          shrink-0
          text-xl font-semibold tracking-tight
          text-zinc-950

          sm:text-2xl
        "
      >
        {formatNumber(value, lang)}
      </span>

      {onClick && (
        <ArrowUpRight
          className={`
            hidden h-5 w-5 shrink-0

            sm:block

            ${needsAttention ? "text-amber-600" : "text-emerald-600"}
          `}
        />
      )}
    </DashboardSurface>
  );
}

// ======================================================
// LIST ROW
// ======================================================

function ListRow({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <DashboardSurface
      onClick={onClick}
      className={`
        block w-full min-w-0
        px-3 py-3 text-left

        sm:px-4

        ${onClick ? "hover:bg-zinc-100/70" : ""}
      `}
    >
      {children}
    </DashboardSurface>
  );
}

// ======================================================
// LOADING
// ======================================================

function DashboardSkeleton({ lang }: { lang: Lang }) {
  const block = `
    animate-pulse rounded-lg
    bg-zinc-200

    motion-reduce:animate-none
  `;

  return (
    <div
      role="status"
      aria-label={
        lang === "ja" ? "読み込み中" : "Loading dashboard"
      }
      className="
        min-w-0 space-y-4

        sm:space-y-6
      "
    >
      <div
        className={`
          h-12 w-full max-w-xs

          ${block}
        `}
      />

      <div
        className="
          grid gap-2.5

          sm:gap-3

          md:grid-cols-2
        "
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className={`
              h-[68px]

              sm:h-[74px]

              ${block}
            `}
          />
        ))}
      </div>

      <div
        className="
          grid grid-cols-2 gap-2.5

          sm:gap-3

          lg:grid-cols-3

          2xl:grid-cols-6
        "
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={`
              h-24

              ${block}
            `}
          />
        ))}
      </div>

      <div
        className="
          grid gap-6

          xl:grid-cols-2
        "
      >
        <div className={`h-72 ${block}`} />
        <div className={`h-72 ${block}`} />
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

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useAdminDashboard();

  useEffect(() => {
    if (error) {
      console.error("Dashboard load error:", error);
    }
  }, [error]);

  const goTo = (tabId: string) => {
    return setActiveDashboardTab
      ? () => setActiveDashboardTab(tabId)
      : undefined;
  };

  if (isLoading) {
    return <DashboardSkeleton lang={lang} />;
  }

  // ======================================================
  // INITIAL LOAD ERROR
  // ======================================================

  if (!data?.data) {
    return (
      <div
        className="
          flex min-h-[320px] items-center justify-center
          px-3

          sm:min-h-[500px] sm:px-4
        "
      >
        <div
          role="alert"
          className="
            w-full max-w-md
            rounded-lg border border-red-200
            bg-red-50 p-5
            text-center

            sm:p-6
          "
        >
          <AlertCircle
            className="
              mx-auto h-10 w-10
              text-red-500
            "
          />

          <h2
            className="
              mt-4
              text-base font-semibold leading-relaxed
              text-red-900

              sm:text-lg
            "
          >
            {lang === "ja"
              ? "ダッシュボードを読み込めませんでした"
              : "Failed to load dashboard"}
          </h2>

          <p
            className="
              mt-2
              text-sm leading-relaxed text-red-700
            "
          >
            {lang === "ja"
              ? "通信状況を確認して、もう一度お試しください。"
              : "Check your connection and try again."}
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className={`
              mt-5 inline-flex min-h-11 items-center
              justify-center gap-2
              rounded-lg bg-red-600 px-4 py-2
              cursor-pointer
              text-sm font-medium text-white
              transition

              hover:bg-red-700

              disabled:cursor-not-allowed disabled:opacity-50

              ${focusRing}
            `}
          >
            <RefreshCw
              className={`
                h-4 w-4

                ${isFetching ? "animate-spin" : ""}
              `}
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

  const pendingApplications = [
    ...recent.pendingApplications,
  ].sort(
    (a, b) =>
      new Date(a.appliedAt).getTime() -
      new Date(b.appliedAt).getTime(),
  );

  const pendingVacancyReviews =
    summary.vacancies.pendingReview;

  const pendingAdminApplications =
    summary.applications.pendingAdminApproval;

  const totalRegistered =
    lang === "ja" ? "登録合計" : "Total registered";

  const stats: SummaryStat[] = [
    {
      key: "seekers",
      title: lang === "ja" ? "求職者" : "Job seekers",
      value: summary.jobSeekers.total,
      subtitle: totalRegistered,
      icon: Users,
      tone: "emerald",
      tab: "seekers",
    },
    {
      key: "providers",
      title: lang === "ja" ? "クライアント" : "Clients",
      value: summary.providers.total,
      subtitle: totalRegistered,
      icon: Building2,
      tone: "blue",
      tab: "providers",
    },
    {
      key: "vacancies",
      title: lang === "ja" ? "求人" : "Vacancies",
      value: summary.vacancies.total,
      subtitle: (
        <>
          <span className="font-semibold text-emerald-700">
            {formatNumber(summary.vacancies.published, lang)}
          </span>{" "}
          {lang === "ja" ? "公開中" : "published"}
        </>
      ),
      icon: Briefcase,
      tone: "violet",
      tab: "vacancies",
    },
    {
      key: "applications",
      title: lang === "ja" ? "応募" : "Applications",
      value: summary.applications.total,
      subtitle: lang === "ja" ? "応募合計" : "Total applications",
      icon: FileText,
      tone: "blue",
      tab: "applications",
    },
    {
      key: "provider-process",
      title: lang === "ja" ? "企業選考中" : "Provider process",
      value: inProviderProcess,
      subtitle:
        lang === "ja"
          ? "送信済み・審査中・面接・選考通過"
          : "Sent · Review · Interview · Selected",
      icon: Send,
      tone: "emerald",
      tab: "applications",
    },
    {
      key: "placement-requests",
      title: lang === "ja" ? "採用依頼" : "Placement requests",
      value: summary.placementRequests.total,
      subtitle: lang === "ja" ? "依頼合計" : "Total requests",
      icon: ClipboardList,
      tone: "amber",
      tab: "placement-requests",
    },
  ];

  return (
    <div
      className="
        min-w-0 space-y-4

        sm:space-y-6
      "
    >
      {/* Dashboard heading */}
      <div
        className="
          flex flex-col gap-3

          sm:flex-row sm:items-center sm:justify-between
        "
      >
        <div className="min-w-0">
          <h2
            className="
              text-xl font-semibold tracking-tight
              text-zinc-950

              sm:text-2xl
            "
          >
            {lang === "ja" ? "ダッシュボード" : "Dashboard"}
          </h2>

          <p
            className="
              mt-1
              text-sm leading-relaxed text-zinc-500
            "
          >
            {lang === "ja"
              ? "採用状況をひと目で確認できます。"
              : "A clear view of your recruitment, all in one place."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className={`
            inline-flex min-h-11 shrink-0 items-center
            justify-center gap-2
            rounded-lg border border-zinc-200
            bg-white px-4
            cursor-pointer
            text-sm font-medium text-zinc-700
            shadow-sm transition

            sm:self-center

            hover:bg-zinc-100

            disabled:cursor-not-allowed disabled:opacity-50

            ${focusRing}
          `}
        >
          <RefreshCw
            className={`
              h-4 w-4

              ${isFetching ? "animate-spin" : ""}
            `}
          />

          {isFetching
            ? lang === "ja"
              ? "更新中..."
              : "Refreshing..."
            : lang === "ja"
              ? "更新"
              : "Refresh"}
        </button>
      </div>

      {/* Refresh error with existing data */}
      {error && (
        <div
          role="alert"
          className="
            flex flex-wrap items-center
            gap-3 rounded-lg
            border border-amber-200
            bg-amber-50 px-4 py-3
            text-sm text-amber-800
          "
        >
          <AlertCircle className="h-4 w-4 shrink-0" />

          <p
            className="
              min-w-0 flex-1
              leading-relaxed
            "
          >
            {lang === "ja"
              ? "最新データを取得できませんでした。表示中の数値は古い可能性があります。"
              : "Couldn't refresh. The numbers shown may be out of date."}
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className={`
              min-h-11 shrink-0
              rounded-md px-2
              cursor-pointer font-medium underline

              disabled:cursor-not-allowed disabled:opacity-50

              ${focusRing}
            `}
          >
            {lang === "ja" ? "再試行" : "Retry"}
          </button>
        </div>
      )}

      {/* Needs attention */}
      <section
        aria-labelledby="needs-attention-heading"
        className="space-y-2"
      >
        <div
          className="
            flex flex-wrap items-center justify-between
            gap-2
          "
        >
          <h3
            id="needs-attention-heading"
            className="
              text-sm font-semibold text-zinc-950
            "
          >
            {lang === "ja" ? "要対応" : "Needs attention"}
          </h3>

          <p className="text-xs text-zinc-500">
            {lang === "ja" ? "優先する対応" : "Your next priorities"}
          </p>
        </div>

        <div
          className="
            grid gap-2.5

            sm:gap-3

            md:grid-cols-2
          "
        >
          <AttentionCard
            title={
              lang === "ja"
                ? "求人審査待ち"
                : "Pending vacancy reviews"
            }
            description={
              lang === "ja"
                ? "承認を待っている求人"
                : "Vacancies awaiting your approval"
            }
            value={pendingVacancyReviews}
            icon={Clock3}
            lang={lang}
            onClick={goTo("vacancies")}
          />

          <AttentionCard
            title={
              lang === "ja"
                ? "応募承認待ち"
                : "Pending applications"
            }
            description={
              lang === "ja"
                ? "確認を待っている応募"
                : "Ready for your review"
            }
            value={pendingAdminApplications}
            icon={FileText}
            lang={lang}
            onClick={goTo("applications")}
          />
        </div>
      </section>

      {/* Recruitment overview */}
      <section
        aria-labelledby="overview-heading"
        className="space-y-2"
      >
        <div
          className="
            flex flex-wrap items-center justify-between
            gap-2
          "
        >
          <h3
            id="overview-heading"
            className="
              text-sm font-semibold text-zinc-950
            "
          >
            {lang === "ja" ? "採用の概要" : "Recruitment overview"}
          </h3>

          <p className="text-xs text-zinc-500">
            {lang === "ja" ? "現在の集計" : "Current totals"}
          </p>
        </div>

        <div
          className="
            grid grid-cols-2 gap-2.5

            sm:gap-3

            lg:grid-cols-3

            2xl:grid-cols-6
          "
        >
          {stats.map((stat) => (
            <StatCard
              key={stat.key}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={stat.icon}
              tone={stat.tone}
              lang={lang}
              onClick={goTo(stat.tab)}
            />
          ))}
        </div>
      </section>

      {/* Pending applications and recent vacancies */}
      <div
        className="
          grid gap-6

          xl:grid-cols-2 xl:gap-8
        "
      >
        {/* Pending applications */}
        <section
          aria-labelledby="pending-applications-heading"
          className="min-w-0"
        >
          <div
            className="
              mb-2 flex flex-wrap items-start
              justify-between gap-3
            "
          >
            <div className="min-w-0">
              <div
                className="
                  flex flex-wrap items-center
                  gap-2
                "
              >
                <h3
                  id="pending-applications-heading"
                  className="
                    text-sm font-semibold text-zinc-950

                    sm:text-base
                  "
                >
                  {lang === "ja"
                    ? "承認待ち応募"
                    : "Pending applications"}
                </h3>

                <span
                  className="
                    rounded-md bg-zinc-100
                    px-2 py-0.5
                    text-xs font-medium text-zinc-500
                  "
                >
                  {formatNumber(pendingAdminApplications, lang)}
                </span>
              </div>

              <p
                className="
                  mt-0.5
                  text-xs leading-relaxed text-zinc-500
                "
              >
                {lang === "ja"
                  ? "待ち時間が長い順"
                  : "Longest waiting first"}
              </p>
            </div>

            {setActiveDashboardTab && (
              <button
                type="button"
                onClick={() =>
                  setActiveDashboardTab("applications")
                }
                className={`
                  inline-flex min-h-11 shrink-0 items-center
                  gap-1.5 rounded-md px-2
                  cursor-pointer
                  text-xs font-semibold text-emerald-700
                  transition

                  sm:text-sm

                  hover:text-emerald-800

                  ${focusRing}
                `}
              >
                {lang === "ja" ? "すべて表示" : "View all"}

                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          <div
            className="
              divide-y divide-zinc-200
              border-y border-zinc-200
            "
          >
            {pendingApplications.length === 0 ? (
              <div
                className="
                  px-4 py-8 text-center
                "
              >
                <CheckCircle2
                  className="
                    mx-auto h-8 w-8
                    text-emerald-500
                  "
                />

                <p
                  className="
                    mt-2
                    text-sm leading-relaxed text-zinc-500
                  "
                >
                  {lang === "ja"
                    ? "承認待ちの応募はありません。"
                    : "No applications are waiting for approval."}
                </p>
              </div>
            ) : (
              pendingApplications.map((application, index) => {
                const days = getDaysWaiting(application.appliedAt);

                const isOverdue =
                  days !== null && days >= OVERDUE_DAYS;

                const avatarTone: MetricTone =
                  index % 4 === 0
                    ? "emerald"
                    : index % 4 === 1
                      ? "violet"
                      : index % 4 === 2
                        ? "blue"
                        : "amber";

                return (
                  <ListRow
                    key={application.applicationId}
                    onClick={goTo("applications")}
                  >
                    <div
                      className="
                        flex items-start
                        gap-3
                      "
                    >
                      <span
                        aria-hidden="true"
                        className={`
                          grid h-8 w-8 shrink-0 place-items-center
                          rounded-full
                          text-xs font-semibold

                          sm:h-9 sm:w-9

                          ${metricToneClasses[avatarTone]}
                        `}
                      >
                        {getInitials(application.candidateName)}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div
                          className="
                            flex flex-col gap-1.5

                            sm:flex-row sm:items-start
                            sm:justify-between sm:gap-3
                          "
                        >
                          <div className="min-w-0 flex-1">
                            <h4
                              className="
                                break-words
                                text-sm font-semibold leading-snug
                                text-zinc-950
                              "
                            >
                              {application.candidateName}
                            </h4>

                            <p
                              className="
                                mt-0.5 break-words
                                text-xs font-medium leading-snug
                                text-zinc-600

                                sm:text-sm
                              "
                            >
                              {application.vacancyTitle}
                            </p>

                            <p
                              className="
                                mt-0.5 break-words
                                text-xs leading-snug text-zinc-500
                              "
                            >
                              {application.companyName}
                            </p>
                          </div>

                          <div
                            className="
                              flex shrink-0 flex-wrap items-center
                              gap-x-2 gap-y-1

                              sm:flex-col sm:items-end
                            "
                          >
                            {days !== null && (
                              <span
                                className={`
                                  inline-flex items-center
                                  gap-1 rounded-md px-2 py-0.5
                                  text-xs font-medium

                                  ${
                                    isOverdue
                                      ? "bg-red-50 text-red-700"
                                      : "bg-amber-50 text-amber-700"
                                  }
                                `}
                              >
                                <Clock3 className="h-3 w-3 shrink-0" />

                                {getWaitingLabel(days, lang)}
                              </span>
                            )}

                            <span className="text-xs text-zinc-500">
                              {formatDate(application.appliedAt, lang)}
                            </span>
                          </div>
                        </div>

                        <p
                          title={application.applicationId}
                          className="
                            mt-1 truncate
                            text-[11px] text-zinc-400
                          "
                        >
                          {shortId(application.applicationId)}
                        </p>
                      </div>
                    </div>
                  </ListRow>
                );
              })
            )}
          </div>
        </section>

        {/* Recent vacancies */}
        <section
          aria-labelledby="recent-vacancies-heading"
          className="min-w-0"
        >
          <div
            className="
              mb-2 flex flex-wrap items-start
              justify-between gap-3
            "
          >
            <div className="min-w-0">
              <div
                className="
                  flex flex-wrap items-center
                  gap-2
                "
              >
                <h3
                  id="recent-vacancies-heading"
                  className="
                    text-sm font-semibold text-zinc-950

                    sm:text-base
                  "
                >
                  {lang === "ja"
                    ? "最近の求人"
                    : "Recent vacancies"}
                </h3>

                <span
                  className="
                    rounded-md bg-zinc-100
                    px-2 py-0.5
                    text-xs font-medium text-zinc-500
                  "
                >
                  {formatNumber(summary.vacancies.total, lang)}
                </span>
              </div>

              <p
                className="
                  mt-0.5
                  text-xs leading-relaxed text-zinc-500
                "
              >
                {lang === "ja"
                  ? "最新の求人投稿"
                  : "The latest opportunities in your workspace"}
              </p>
            </div>

            {setActiveDashboardTab && (
              <button
                type="button"
                onClick={() =>
                  setActiveDashboardTab("vacancies")
                }
                className={`
                  inline-flex min-h-11 shrink-0 items-center
                  gap-1.5 rounded-md px-2
                  cursor-pointer
                  text-xs font-semibold text-emerald-700
                  transition

                  sm:text-sm

                  hover:text-emerald-800

                  ${focusRing}
                `}
              >
                {lang === "ja" ? "すべて表示" : "View all"}

                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          <div
            className="
              divide-y divide-zinc-200
              border-y border-zinc-200
            "
          >
            {recent.vacancies.length === 0 ? (
              <div
                className="
                  px-4 py-8
                  text-center text-sm text-zinc-500
                "
              >
                <Briefcase
                  className="
                    mx-auto mb-2 h-8 w-8
                    text-zinc-400
                  "
                />

                {lang === "ja"
                  ? "求人はありません。"
                  : "No vacancies found."}
              </div>
            ) : (
              recent.vacancies.map((vacancy) => (
                <ListRow
                  key={vacancy.vacancyId}
                  onClick={goTo("vacancies")}
                >
                  <div
                    className="
                      flex items-start
                      gap-3
                    "
                  >
                    <span
                      aria-hidden="true"
                      className="
                        grid h-8 w-8 shrink-0 place-items-center
                        rounded-md border border-zinc-200
                        bg-white
                        text-xs font-semibold text-zinc-600

                        sm:h-9 sm:w-9
                      "
                    >
                      {getInitials(vacancy.companyName)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div
                        className="
                          flex flex-col gap-1.5

                          sm:flex-row sm:items-start
                          sm:justify-between sm:gap-3
                        "
                      >
                        <div className="min-w-0 flex-1">
                          <h4
                            className="
                              break-words
                              text-sm font-semibold leading-snug
                              text-zinc-950
                            "
                          >
                            {vacancy.title}
                          </h4>

                          <p
                            className="
                              mt-0.5 break-words
                              text-xs font-medium leading-snug
                              text-zinc-600

                              sm:text-sm
                            "
                          >
                            {vacancy.companyName}
                          </p>

                          <p
                            className="
                              mt-0.5 break-words
                              text-xs leading-snug text-zinc-500
                            "
                          >
                            {vacancy.workLocation}
                          </p>
                        </div>

                        <div
                          className="
                            flex shrink-0 flex-wrap items-center
                            gap-x-2 gap-y-1

                            sm:flex-col sm:items-end
                          "
                        >
                          <span
                            className={`
                              inline-flex items-center
                              gap-1 rounded-md px-2 py-0.5
                              text-xs font-medium

                              ${getVacancyStatusClass(vacancy.status)}
                            `}
                          >
                            {vacancy.status === "published" && (
                              <Check className="h-3 w-3 shrink-0" />
                            )}

                            {getVacancyStatusLabel(vacancy.status, lang)}
                          </span>

                          <span className="text-xs text-zinc-500">
                            {formatDate(vacancy.createdAt, lang)}
                          </span>
                        </div>
                      </div>

                      <p
                        title={vacancy.vacancyId}
                        className="
                          mt-1 truncate
                          text-[11px] text-zinc-400
                        "
                      >
                        {shortId(vacancy.vacancyId)}
                      </p>
                    </div>
                  </div>
                </ListRow>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}