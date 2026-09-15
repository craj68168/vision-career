"use client";

import Link from "next/link";

import {
  AlertCircle,
  ArrowRight,
  FileText,
  Loader2,
  Search,
} from "lucide-react";

import { EmptyState, StatCard, TabButton } from "../helperComponents";

import { useJobSeekerDashboard } from "./hook";

export default function JobSeekerDashboard() {
  const {
    lang,

    loading,
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
  } = useJobSeekerDashboard();

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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-slate-900">
            {lang === "ja"
              ? "エラーが発生しました"
              : "Unable to load dashboard"}
          </h2>

          <p className="mt-3 text-sm text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            {/* Left content */}
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

            {/* Right actions */}
            <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
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

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* ========================================= */}
        {/* PROFILE INCOMPLETE */}
        {/* ========================================= */}

        {!isProfileComplete && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />

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

        {/* ========================================= */}
        {/* STAT CARDS */}
        {/* ========================================= */}

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

        {/* ========================================= */}
        {/* TABS + SEARCH */}
        {/* ========================================= */}

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

        {/* ========================================= */}
        {/* CONTENT */}
        {/* ========================================= */}

        {activeTab === "available" ? (
          filteredVacancies.length === 0 ? (
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
            <div>
              {/* VacancyCard will be connected after
                  GET /api/seekers/vacancies is ready */}
            </div>
          )
        ) : filteredApplications.length === 0 ? (
          <EmptyState
            title={
              lang === "ja" ? "応募はまだありません" : "No applications yet"
            }
            description={
              lang === "ja"
                ? "求人に応募すると、ここに表示されます。"
                : "Once you apply for jobs, they will appear here."
            }
          />
        ) : (
          <div>
            {/* ApplicationCard will be connected after
                GET /api/seekers/applications is ready */}
          </div>
        )}
      </main>
    </div>
  );
}
