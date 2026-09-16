"use client";

import Link from "next/link";

import { type ReactNode } from "react";

import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Building2,
  CalendarDays,
  FileText,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import { EmptyState, StatCard, TabButton } from "../helperComponents";

import { useJobSeekerDashboard } from "./hook";

import ApplyVacancyModal from "./ApplyVacancyModal";

import type { Application, Vacancy } from "./types";

// ======================================================
// COMPONENT
// ======================================================

export default function JobSeekerDashboard() {
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

    availableCount,
    appliedCount,
    inProgressCount,

    applyVacancy,

    openApplyVacancy,
    closeApplyVacancy,

    handleApplicationSubmitted,

    handleRefresh,
  } = useJobSeekerDashboard();

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />

          <p className="mt-3 text-sm text-slate-600">
            {lang === "ja"
              ? "ダッシュボードを読み込み中..."
              : "Loading your dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            {lang === "ja"
              ? "エラーが発生しました"
              : "Unable to load dashboard"}
          </h2>

          <p className="mt-3 text-sm text-slate-600">{error}</p>

          <button
            type="button"
            onClick={() => void handleRefresh()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
          >
            <RefreshCw className="h-4 w-4" />

            {lang === "ja" ? "再試行" : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              {/* LEFT */}

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  {lang === "ja" ? "求人ダッシュボード" : "Job Dashboard"}
                </h1>

                <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
                  {lang === "ja"
                    ? "新しい機会を探し、応募状況を管理します。"
                    : "Explore new opportunities, track every application, and manage your job search from one place."}
                </p>
              </div>

              {/* RIGHT */}

              <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
                <button
                  type="button"
                  disabled={refreshing}
                  onClick={() => void handleRefresh()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />

                  {lang === "ja" ? "更新" : "Refresh"}
                </button>

                <Link
                  href={
                    lang === "ja"
                      ? "/job-seekers/profile/view"
                      : "/en/job-seekers/profile/view"
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {lang === "ja" ? "プロフィールを見る" : "View Profile"}
                </Link>

                {!isProfileComplete && (
                  <Link
                    href={
                      lang === "ja"
                        ? "/job-seekers/profile"
                        : "/en/job-seekers/profile"
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700"
                  >
                    {lang === "ja"
                      ? "プロフィールを完成する"
                      : "Complete Profile"}

                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ================================================= */}
        {/* MAIN */}
        {/* ================================================= */}

        <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          {/* ================================================= */}
          {/* PROFILE INCOMPLETE */}
          {/* ================================================= */}

          {!isProfileComplete && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                  <div>
                    <h3 className="font-semibold text-amber-800">
                      {lang === "ja"
                        ? "プロフィール不完全"
                        : "Profile incomplete"}
                    </h3>

                    <p className="mt-1 text-sm text-amber-700">
                      {lang === "ja"
                        ? "プロフィールを完了して、求人に応募できるようにしましょう。"
                        : "Please complete your profile before applying for jobs."}
                    </p>
                  </div>
                </div>

                <Link
                  href={
                    lang === "ja"
                      ? "/job-seekers/profile"
                      : "/en/job-seekers/profile"
                  }
                  className="inline-flex items-center gap-2 self-start rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 sm:self-auto"
                >
                  {lang === "ja" ? "プロフィールを設定" : "Complete Profile"}

                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* STAT CARDS */}
          {/* ================================================= */}

          <section className="mb-8 grid gap-4 md:grid-cols-3">
            <StatCard
              label={lang === "ja" ? "利用可能な求人" : "Available Jobs"}
              value={String(availableCount)}
            />

            <StatCard
              label={lang === "ja" ? "応募済み" : "Applied Jobs"}
              value={String(appliedCount)}
            />

            <StatCard
              label={lang === "ja" ? "進行中" : "In Progress"}
              value={String(inProgressCount)}
            />
          </section>

          {/* ================================================= */}
          {/* TABS + SEARCH */}
          {/* ================================================= */}

          <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* TABS */}

              <div className="inline-flex rounded-2xl bg-slate-100 p-1">
                <TabButton
                  active={activeTab === "available"}
                  onClick={() => setActiveTab("available")}
                  icon={<Search className="h-4 w-4" />}
                  label={`${
                    lang === "ja" ? "利用可能な求人" : "Available Jobs"
                  } (${availableCount})`}
                />

                <TabButton
                  active={activeTab === "applied"}
                  onClick={() => setActiveTab("applied")}
                  icon={<FileText className="h-4 w-4" />}
                  label={`${
                    lang === "ja" ? "応募状況" : "My Applications"
                  } (${appliedCount})`}
                />
              </div>

              {/* SEARCH */}

              <div className="w-full lg:max-w-md">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={
                      activeTab === "available"
                        ? lang === "ja"
                          ? "求人を検索..."
                          : "Search available jobs..."
                        : lang === "ja"
                          ? "応募を検索..."
                          : "Search your applications..."
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ================================================= */}
          {/* AVAILABLE JOBS */}
          {/* ================================================= */}

          {activeTab === "available" && (
            <>
              {filteredVacancies.length === 0 ? (
                <EmptyState
                  title={
                    lang === "ja"
                      ? "利用可能な求人はありません"
                      : "No available jobs found"
                  }
                  description={
                    lang === "ja"
                      ? "後でもう一度ご確認ください。"
                      : "Try another search or check back later for new openings."
                  }
                />
              ) : (
                <div className="grid gap-5 lg:grid-cols-2">
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
              )}
            </>
          )}

          {/* ================================================= */}
          {/* MY APPLICATIONS */}
          {/* ================================================= */}

          {activeTab === "applied" && (
            <>
              {filteredApplications.length === 0 ? (
                <EmptyState
                  title={
                    lang === "ja"
                      ? "応募はまだありません"
                      : "No applications yet"
                  }
                  description={
                    lang === "ja"
                      ? "求人に応募すると、ここに表示されます。"
                      : "Once you apply for jobs, they will appear here."
                  }
                />
              ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                  {filteredApplications.map((application) => (
                    <ApplicationCard
                      key={application.application_id}
                      application={application}
                      lang={lang}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ================================================= */}
      {/* APPLY MODAL */}
      {/* ================================================= */}

      <ApplyVacancyModal
        open={Boolean(applyVacancy)}
        vacancy={applyVacancy}
        lang={lang}
        onClose={closeApplyVacancy}
        onSuccess={handleApplicationSubmitted}
      />
    </>
  );
}

// ======================================================
// VACANCY CARD
// ======================================================

function VacancyCard({
  vacancy,
  lang,
  canApply,
  onApply,
}: {
  vacancy: Vacancy;

  lang: string;

  canApply: boolean;

  onApply: (vacancy: Vacancy) => void;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      {/* BADGES */}

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          {vacancy.employmentType}
        </span>

        {vacancy.japaneseLevel && (
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            {vacancy.japaneseLevel}
          </span>
        )}

        {vacancy.remoteWork && (
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            {vacancy.remoteWork}
          </span>
        )}
      </div>

      {/* TITLE */}

      <h3 className="mt-5 text-2xl font-bold text-slate-950">
        {vacancy.title}
      </h3>

      {vacancy.titleKana && (
        <p className="mt-1 text-sm text-slate-400">{vacancy.titleKana}</p>
      )}

      {/* BASIC INFO */}

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />

          <span>{vacancy.companyName}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />

          <span>{vacancy.workLocation}</span>
        </div>

        {vacancy.createdAt && (
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />

            <span>
              {lang === "ja" ? "掲載日" : "Posted"}{" "}
              {formatDate(vacancy.createdAt)}
            </span>
          </div>
        )}
      </div>

      {/* INFO BOXES */}

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <JobInfo
          icon={<Briefcase className="h-4 w-4" />}
          label={lang === "ja" ? "雇用形態" : "Employment"}
          value={vacancy.employmentType}
        />

        <JobInfo
          icon={<Users className="h-4 w-4" />}
          label={lang === "ja" ? "募集人数" : "Openings"}
          value={String(vacancy.numberOfPeople)}
        />

        <JobInfo
          label={lang === "ja" ? "リモート" : "Remote Work"}
          value={vacancy.remoteWork || "-"}
        />

        <JobInfo
          label={lang === "ja" ? "給与" : "Salary"}
          value={formatSalary(vacancy.salaryMin, vacancy.salaryMax)}
        />
      </div>

      {/* DESCRIPTION */}

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">
          {lang === "ja" ? "仕事内容" : "Job Description"}
        </p>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
          {vacancy.jobDescription}
        </p>
      </div>

      {/* FOOTER */}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          {canApply
            ? lang === "ja"
              ? "この求人に応募できます。"
              : "You can apply for this vacancy."
            : lang === "ja"
              ? "応募するにはプロフィールを完了してください。"
              : "Complete your profile before applying."}
        </p>

        <button
          type="button"
          disabled={!canApply}
          onClick={() => onApply(vacancy)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {lang === "ja" ? "応募する" : "Apply Now"}

          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

// ======================================================
// APPLICATION CARD
// ======================================================

function ApplicationCard({
  application,
  lang,
}: {
  application: Application;

  lang: string;
}) {
  const vacancy = application.vacancy;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* TOP */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-400">
            {application.application_id}
          </p>

          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            {vacancy?.title || application.vacancy_id}
          </h3>
        </div>

        <ApplicationStatusBadge status={application.status} />
      </div>

      {/* VACANCY */}

      {vacancy && (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />

            <span>{vacancy.companyName}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />

            <span>{vacancy.workLocation}</span>
          </div>
        </div>
      )}

      {/* APPLIED */}

      <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
        <CalendarDays className="h-4 w-4" />

        <span>
          {lang === "ja" ? "応募日" : "Applied"}{" "}
          {formatDate(application.applied_at)}
        </span>
      </div>

      {/* DETAILS */}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <JobInfo
          label={lang === "ja" ? "雇用形態" : "Employment"}
          value={vacancy?.employmentType || "-"}
        />

        <JobInfo
          label={lang === "ja" ? "給与" : "Salary"}
          value={
            vacancy ? formatSalary(vacancy.salaryMin, vacancy.salaryMax) : "-"
          }
        />

        <JobInfo
          label={lang === "ja" ? "ステータス" : "Status"}
          value={formatApplicationStatus(application.status)}
        />

        <JobInfo
          label={lang === "ja" ? "応募ID" : "Application ID"}
          value={application.application_id}
        />
      </div>

      {/* COVER LETTER */}

      {application.cover_letter && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            {lang === "ja" ? "応募メッセージ" : "Your Application"}
          </p>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {application.cover_letter}
          </p>
        </div>
      )}

      {/* ADMIN REJECTION */}

      {application.status === "ADMIN_REJECTED" &&
        application.admin_rejection_reason && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-800">
              {lang === "ja"
                ? "管理者による却下理由"
                : "Admin rejection reason"}
            </p>

            <p className="mt-2 text-sm leading-6 text-red-700">
              {application.admin_rejection_reason}
            </p>
          </div>
        )}
    </article>
  );
}

// ======================================================
// JOB INFO
// ======================================================

function JobInfo({
  label,
  value,
  icon,
}: {
  label: string;

  value: string;

  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}

        <p className="text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="mt-2 break-words text-sm font-medium text-slate-900">
        {value}
      </p>
    </div>
  );
}

// ======================================================
// STATUS BADGE
// ======================================================

function ApplicationStatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();

  let classes = "bg-slate-100 text-slate-700";

  if (
    normalized === "PENDING_ADMIN_APPROVAL" ||
    normalized === "UNDER_REVIEW"
  ) {
    classes = "bg-amber-50 text-amber-700";
  }

  if (normalized === "SENT_TO_PROVIDER" || normalized === "INTERVIEW") {
    classes = "bg-blue-50 text-blue-700";
  }

  if (normalized === "SELECTED" || normalized === "HIRED") {
    classes = "bg-emerald-50 text-emerald-700";
  }

  if (normalized === "ADMIN_REJECTED" || normalized === "REJECTED") {
    classes = "bg-red-50 text-red-700";
  }

  return (
    <span
      className={`h-fit rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {formatApplicationStatus(status)}
    </span>
  );
}

// ======================================================
// FORMAT APPLICATION STATUS
// ======================================================

function formatApplicationStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// ======================================================
// SALARY
// ======================================================

function formatSalary(
  minimum?: number | null,

  maximum?: number | null,
) {
  if (minimum == null && maximum == null) {
    return "-";
  }

  if (minimum != null && maximum != null) {
    return `${minimum} ~ ${maximum} 万円`;
  }

  if (minimum != null) {
    return `${minimum} 万円~`;
  }

  return `~ ${maximum} 万円`;
}

// ======================================================
// DATE
// ======================================================

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",

    month: "short",

    day: "numeric",
  }).format(date);
}
