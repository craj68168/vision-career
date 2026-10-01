"use client";

import Link from "next/link";
import { type KeyboardEvent, type ReactNode, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Clock3,
  FileText,
  RefreshCw,
  Search,
  Video,
  X,
} from "lucide-react";

import ApplyVacancyModal from "./ApplyVacancyModal";
import ApplicationCard from "./ApplicationCard";
import InterviewCard from "./InterviewCard";
import VacancyCard from "./VacancyCard";
import { useJobSeekerDashboard } from "./hook";
import {
  btnBase,
  btnPrimary,
  btnSecondary,
  card,
  focusRing,
  labelCaps,
  wrap,
} from "./shared";
import type { Vacancy } from "./types";

/*
  Design tokens (Tailwind only, no separate CSS file)
  - page      oklch(0.975 0.008 150)   text emerald-950   muted slate-600
  - primary   emerald-700 (hover 800)  soft emerald-50
  - weights   headings semibold, labels/body medium or normal (no bold)
  - density   compact: 40px controls, 16px card padding, 12px gaps
*/

const pageBg = "bg-[oklch(0.975_0.008_150)] text-emerald-950";
const btnWarning = `${btnBase} bg-amber-600 text-white hover:bg-amber-700`;

const cardGrid =
  "grid grid-cols-[repeat(auto-fit,minmax(min(100%,22rem),24rem))] justify-center gap-3 sm:gap-4";
const container = "mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10";

const TABS = ["available", "applied", "interviews"] as const;

// Remembers how many interviews the user has already dismissed the notice for
const DISMISSED_INTERVIEWS_KEY = "jobSeeker.dashboard.dismissedInterviewCount";

function persistDismissedInterviews(count: number) {
  try {
    window.localStorage.setItem(DISMISSED_INTERVIEWS_KEY, String(count));
  } catch {
    // Storage may be unavailable (private mode, blocked) - dismissal then lasts for this visit only
  }
}

export default function JobSeekerDashboard() {
  const t = useTranslations("jobSeeker.dashboard");

  const {
    lang,
    loading,
    refreshing,
    error,
    isProfileComplete,
    search,
    setSearch,
    activeTab,
    setActiveTab,
    filteredVacancies,
    filteredApplications,
    filteredInterviews,
    availableCount,
    appliedCount,
    inProgressCount,
    interviewCount,
    applyVacancy,
    openApplyVacancy,
    closeApplyVacancy,
    handleApplicationSubmitted,
    handleRefresh,
  } = useJobSeekerDashboard();

  const [dismissedInterviews, setDismissedInterviews] = useState(0);

  // Load the saved dismissal once on the client
  useEffect(() => {
    try {
      const saved = Number(
        window.localStorage.getItem(DISMISSED_INTERVIEWS_KEY),
      );
      if (Number.isFinite(saved) && saved > 0) {
        setDismissedInterviews(saved);
      }
    } catch {
      // ignore unavailable storage
    }
  }, []);

  // If interviews finish or get cancelled, lower the marker so the next new one shows again
  useEffect(() => {
    if (!loading && interviewCount < dismissedInterviews) {
      setDismissedInterviews(interviewCount);
      persistDismissedInterviews(interviewCount);
    }
  }, [loading, interviewCount, dismissedInterviews]);

  // The notice shows only when there are more interviews than the user dismissed
  const showInterviewNotice = interviewCount > dismissedInterviews;

  const dismissInterviewNotice = () => {
    setDismissedInterviews(interviewCount);
    persistDismissedInterviews(interviewCount);
  };

  const profileHref =
    lang === "ja" ? "/job-seekers/profile" : "/en/job-seekers/profile";
  const viewProfileHref =
    lang === "ja"
      ? "/job-seekers/profile/view"
      : "/en/job-seekers/profile/view";

  const goToTab = (tab: (typeof TABS)[number]) => {
    setActiveTab(tab as typeof activeTab);
  };

  // Arrow-key navigation between tabs (WAI-ARIA tabs pattern)
  const handleTabKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = TABS.indexOf(activeTab as (typeof TABS)[number]);
    let next = index;

    if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;

    event.preventDefault();
    goToTab(TABS[next]);
    document.getElementById(`tab-${TABS[next]}`)?.focus();
  };

  if (loading) {
    return <DashboardSkeleton label={t("loading")} />;
  }

  if (error) {
    return (
      <div
        className={`flex min-h-dvh items-center justify-center p-4 ${pageBg}`}
      >
        <div
          role="alert"
          className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-md sm:p-6"
        >
          <span className="grid h-9 w-9 place-items-center rounded-md bg-red-50 text-red-600">
            <AlertCircle className="h-5 w-5" />
          </span>
          <h2 className="mt-3 text-lg font-semibold">{t("errorTitle")}</h2>
          <p className={`mt-1.5 text-sm leading-6 text-slate-600 ${wrap}`}>
            {error}
          </p>
          <button
            type="button"
            onClick={() => void handleRefresh()}
            className={`${btnPrimary} mt-5 w-full sm:w-auto`}
          >
            <RefreshCw className="h-4 w-4" />
            {t("tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  const currentCount =
    activeTab === "available"
      ? filteredVacancies.length
      : activeTab === "applied"
        ? filteredApplications.length
        : filteredInterviews.length;

  const searchLabel =
    activeTab === "available"
      ? t("searchAvailable")
      : activeTab === "applied"
        ? t("searchApplications")
        : t("searchInterviews");

  return (
    <>
      <div className={`min-h-dvh ${pageBg}`}>
        {/*
          Header + stats share one surface: it starts white (matches the navbar)
          and fades into the page background, so it flows into the content below.
        */}
        <header className="bg-gradient-to-b from-white to-[oklch(0.975_0.008_150)]">
          <div className={`${container} pt-5 sm:pt-6`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Title */}
              <div className="flex min-w-0 items-center gap-3.5">
                <span
                  aria-hidden
                  className="hidden h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white shadow-sm sm:grid"
                >
                  <Briefcase className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <h1 className="text-balance text-xl font-semibold tracking-tight sm:text-2xl">
                    {t("title")}
                  </h1>
                  <p className="mt-0.5 max-w-2xl text-pretty text-sm leading-6 text-slate-600">
                    {t("description")}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:shrink-0 lg:justify-end">
                <button
                  type="button"
                  disabled={refreshing}
                  onClick={() => void handleRefresh()}
                  className={btnSecondary}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  {t("refresh")}
                </button>

                <Link href={viewProfileHref} className={btnSecondary}>
                  {t("viewProfile")}
                </Link>

                {!isProfileComplete && (
                  <Link
                    href={profileHref}
                    className={`${btnPrimary} col-span-2 sm:col-span-1`}
                  >
                    {t("completeProfile")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>

            {/* Stats */}
            <section
              className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4"
              aria-label={t("title")}
            >
              <StatCard
                icon={<Briefcase />}
                label={t("availableJobs")}
                value={availableCount}
                onClick={() => goToTab("available")}
              />
              <StatCard
                icon={<FileText />}
                label={t("appliedJobs")}
                value={appliedCount}
                onClick={() => goToTab("applied")}
              />
              <StatCard
                icon={<Clock3 />}
                label={t("inProgress")}
                value={inProgressCount}
                onClick={() => goToTab("applied")}
              />
              <StatCard
                icon={<Video />}
                label={t("interviews")}
                value={interviewCount}
                onClick={() => goToTab("interviews")}
                emphasis
              />
            </section>
          </div>
        </header>

        <main className={`${container} pb-6`}>
          {(!isProfileComplete || showInterviewNotice) && (
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {!isProfileComplete && (
                <Notice
                  tone="amber"
                  icon={<AlertCircle className="h-4 w-4" />}
                  title={t("profileIncompleteTitle")}
                  description={t("profileIncompleteDescription")}
                  action={
                    <Link
                      href={profileHref}
                      className={`${btnWarning} w-full sm:w-auto`}
                    >
                      {t("profileSetup")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  }
                />
              )}

              {showInterviewNotice && (
                <Notice
                  tone="emerald"
                  icon={<Video className="h-4 w-4" />}
                  title={t("upcomingInterviewTitle")}
                  description={t("confirmedInterviewCount", {
                    count: interviewCount,
                  })}
                  action={
                    <button
                      type="button"
                      onClick={() => goToTab("interviews")}
                      className={`${btnPrimary} w-full sm:w-auto`}
                    >
                      {t("viewInterviews")}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  }
                  onDismiss={dismissInterviewNotice}
                  dismissLabel={t("dismiss")}
                />
              )}
            </div>
          )}

          {/* Tabs + search (sticky below the navbar on large screens) */}
          <section className="z-20 mt-5 border-b border-slate-200 bg-[oklch(0.975_0.008_150)]/90 backdrop-blur lg:sticky lg:top-16">
            <div className="flex flex-col gap-2.5 pb-2.5 lg:flex-row lg:items-center lg:justify-between lg:pb-0">
              <div
                role="tablist"
                onKeyDown={handleTabKeys}
                className="-mx-4 flex overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
              >
                <TabButton
                  id="available"
                  active={activeTab === "available"}
                  onClick={() => goToTab("available")}
                  icon={<Search />}
                  label={t("availableJobs")}
                  count={availableCount}
                />
                <TabButton
                  id="applied"
                  active={activeTab === "applied"}
                  onClick={() => goToTab("applied")}
                  icon={<FileText />}
                  label={t("myApplications")}
                  count={appliedCount}
                />
                <TabButton
                  id="interviews"
                  active={activeTab === "interviews"}
                  onClick={() => goToTab("interviews")}
                  icon={<Video />}
                  label={t("interviews")}
                  count={interviewCount}
                />
              </div>

              <div className="relative w-full lg:max-w-xs">
                <Search
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label={searchLabel}
                  placeholder={searchLabel}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-base outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/25 sm:text-sm"
                />
              </div>
            </div>
          </section>

          {/* Announces result count to screen readers when filtering */}
          <p className="sr-only" aria-live="polite">
            {currentCount}
          </p>

          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="mt-4 sm:mt-5"
          >
            {activeTab === "available" &&
              (filteredVacancies.length === 0 ? (
                <EmptyState
                  title={t("noAvailableJobsTitle")}
                  description={t("noAvailableJobsDescription")}
                />
              ) : (
                <div className={cardGrid}>
                  {filteredVacancies.map((vacancy) => (
                    <VacancyCard
                      key={vacancy.vacancyId}
                      vacancy={vacancy}
                      lang={lang}
                      canApply={isProfileComplete}
                      onApply={openApplyVacancy}
                    />
                  ))}
                </div>
              ))}

            {activeTab === "applied" &&
              (filteredApplications.length === 0 ? (
                <EmptyState
                  title={t("noApplicationsTitle")}
                  description={t("noApplicationsDescription")}
                />
              ) : (
                <div className={cardGrid}>
                  {filteredApplications.map((application) => (
                    <ApplicationCard
                      key={application.application_id}
                      application={application}
                      lang={lang}
                    />
                  ))}
                </div>
              ))}

            {activeTab === "interviews" &&
              (filteredInterviews.length === 0 ? (
                <EmptyState
                  title={t("noInterviewsTitle")}
                  description={t("noInterviewsDescription")}
                />
              ) : (
                <div className={cardGrid}>
                  {filteredInterviews.map((interview) => (
                    <InterviewCard
                      key={interview.interviewId}
                      interview={interview}
                      lang={lang}
                    />
                  ))}
                </div>
              ))}
          </div>
        </main>
      </div>

      <ApplyVacancyModal
        open={Boolean(applyVacancy)}
        vacancy={applyVacancy}
        onClose={closeApplyVacancy}
        onSuccess={handleApplicationSubmitted}
      />
    </>
  );
}

/* ---------- Loading skeleton ---------- */

function DashboardSkeleton({ label }: { label: string }) {
  const bar = "rounded-md bg-slate-200/80 motion-safe:animate-pulse";

  return (
    <div className={`min-h-dvh ${pageBg}`} role="status" aria-busy="true">
      <span className="sr-only">{label}</span>
      <div className="bg-gradient-to-b from-white to-[oklch(0.975_0.008_150)]">
        <div className={`${container} pt-5 sm:pt-6`}>
          <div className={`${bar} h-7 w-2/3 max-w-sm`} />
          <div className={`${bar} mt-2.5 h-4 w-full max-w-lg`} />
          <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className={`${bar} h-16 rounded-lg`} />
            ))}
          </div>
        </div>
      </div>
      <div className={`${container} pb-6`}>
        <div className={`${bar} mt-5 h-10 w-full max-w-xs`} />
        <div className={`mt-5 ${cardGrid}`}>
          {[0, 1, 2].map((item) => (
            <div key={item} className={`${bar} h-56 rounded-lg`} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Shared building blocks ---------- */

function Notice({
  tone,
  icon,
  title,
  description,
  action,
  onDismiss,
  dismissLabel,
}: {
  tone: "amber" | "emerald";
  icon: ReactNode;
  title: string;
  description: string;
  action: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}) {
  const styles =
    tone === "amber"
      ? {
          box: "border-amber-200 bg-amber-50",
          icon: "bg-amber-500",
          title: "text-amber-950",
          text: "text-amber-900/80",
          close: "text-amber-900 hover:bg-amber-100",
        }
      : {
          box: "border-emerald-200 bg-emerald-50",
          icon: "bg-emerald-700",
          title: "text-emerald-950",
          text: "text-emerald-900/80",
          close: "text-emerald-900 hover:bg-emerald-100",
        };

  return (
    <section
      className={`flex flex-col gap-3 rounded-lg border p-3.5 sm:flex-row sm:items-center sm:justify-between ${styles.box}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-md text-white ${styles.icon}`}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className={`text-sm font-semibold ${styles.title}`}>{title}</h2>
          <p className={`mt-0.5 text-[13px] leading-5 ${styles.text}`}>
            {description}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex-1 sm:flex-none">{action}</div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label={dismissLabel}
            title={dismissLabel}
            className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-md transition ${styles.close} ${focusRing}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  onClick,
  emphasis = false,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  onClick: () => void;
  emphasis?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-lg border bg-white px-3.5 py-3 text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md ${focusRing} ${
        emphasis
          ? "border-slate-200 border-t-2 border-t-emerald-700"
          : "border-slate-200"
      }`}
    >
      <span
        aria-hidden
        className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-700 [&>svg]:h-4 [&>svg]:w-4"
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xl font-semibold leading-none tabular-nums">
          {value}
        </span>
        <span className="mt-1 block truncate text-xs text-slate-600">
          {label}
        </span>
      </span>
    </button>
  );
}

function TabButton({
  id,
  active,
  onClick,
  icon,
  label,
  count,
}: {
  id: string;
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={`tab-${id}`}
      aria-selected={active}
      aria-controls={`panel-${id}`}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      className={`inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-[13px] font-medium transition ${focusRing} ${
        active
          ? "border-emerald-700 text-emerald-700"
          : "border-transparent text-slate-600 hover:text-emerald-950"
      }`}
    >
      <span aria-hidden className="[&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      {label}
      <span
        className={`grid min-w-5 place-items-center rounded-full px-1.5 text-[11px] leading-5 tabular-nums ${
          active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-700">
        <Search className="h-4 w-4" />
      </span>
      <h2 className="mt-3 text-base font-semibold">{title}</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}

