"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import {
  Briefcase,
  Building2,
  ClipboardList,
  CreditCard,
  FileText,
  Inbox,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";

import { useProviderDashboard } from "./hook";

import Vacancies from "./vacancies";

import Applications from "./applications";

import PlacementRequests from "./placement-requests";

import Billing from "./billing";

// ======================================================
// PROVIDER DASHBOARD
// ======================================================

export default function ProviderDashboard() {
  const {
    lang,

    loading,

    refreshing,

    error,

    activeTab,

    changeActiveTab,

    summary,

    refreshVersion,

    vacancyCreateSignal,

    requestPostVacancy,

    handleRefresh,

    handleFeatureChanged,
  } = useProviderDashboard();

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-slate-400" />

          <p className="mt-4 text-sm text-slate-600">
            {lang === "ja"
              ? "ダッシュボードを読み込み中..."
              : "Loading provider dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =============================================== */}
      {/* HEADER */}
      {/* =============================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {lang === "ja" ? "企業ダッシュボード" : "Provider Dashboard"}
              </h1>

              <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
                {lang === "ja"
                  ? "会社情報、求人、応募状況、採用依頼、採用請求を管理します。"
                  : "Manage your company profile, vacancies, applications, placement requests, and placement billing."}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <Link
                href={
                  lang === "ja"
                    ? "/provider-dashboard/profile"
                    : "/en/provider-dashboard/profile"
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Building2 className="h-4 w-4" />

                {lang === "ja" ? "会社プロフィール" : "Company Profile"}
              </Link>

              <button
                type="button"
                disabled={refreshing}
                onClick={() => void handleRefresh()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />

                {refreshing
                  ? lang === "ja"
                    ? "更新中..."
                    : "Refreshing..."
                  : lang === "ja"
                    ? "更新"
                    : "Refresh"}
              </button>

              <button
                type="button"
                onClick={requestPostVacancy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />

                {lang === "ja" ? "求人を掲載" : "Post Vacancy"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =============================================== */}
      {/* MAIN */}
      {/* =============================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ============================================= */}
        {/* SUMMARY */}
        {/* ============================================= */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label={lang === "ja" ? "求人総数" : "Total Vacancies"}
            value={summary.totalVacancies}
            icon={<Briefcase className="h-5 w-5" />}
          />

          <StatCard
            label={lang === "ja" ? "公開中" : "Published"}
            value={summary.publishedCount}
            icon={<FileText className="h-5 w-5" />}
          />

          <StatCard
            label={lang === "ja" ? "審査中" : "Pending Review"}
            value={summary.pendingVacancyCount}
            icon={<Inbox className="h-5 w-5" />}
          />

          <StatCard
            label={lang === "ja" ? "応募者" : "Applications"}
            value={summary.totalApplications}
            icon={<Users className="h-5 w-5" />}
          />

          <StatCard
            label={lang === "ja" ? "採用依頼" : "Placement Requests"}
            value={summary.totalPlacementRequests}
            icon={<ClipboardList className="h-5 w-5" />}
          />
        </section>

        {/* ============================================= */}
        {/* TABS */}
        {/* ============================================= */}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-wrap gap-1 rounded-2xl bg-slate-100 p-1">
            <TabButton
              active={activeTab === "vacancies"}
              onClick={() => changeActiveTab("vacancies")}
              label={
                lang === "ja"
                  ? `求人 (${summary.totalVacancies})`
                  : `Vacancies (${summary.totalVacancies})`
              }
            />

            <TabButton
              active={activeTab === "applications"}
              onClick={() => changeActiveTab("applications")}
              label={
                lang === "ja"
                  ? `応募者 (${summary.totalApplications})`
                  : `Applications (${summary.totalApplications})`
              }
            />

            <TabButton
              active={activeTab === "placement-requests"}
              onClick={() => changeActiveTab("placement-requests")}
              label={
                lang === "ja"
                  ? `採用依頼 (${summary.totalPlacementRequests})`
                  : `Placement Requests (${summary.totalPlacementRequests})`
              }
            />

            <TabButton
              active={activeTab === "billing"}
              onClick={() => changeActiveTab("billing")}
              label={lang === "ja" ? "採用請求" : "Billing"}
              icon={<CreditCard className="h-4 w-4" />}
            />
          </div>
        </section>

        {/* ============================================= */}
        {/* FEATURE CONTENT */}
        {/* ============================================= */}

        {activeTab === "vacancies" && (
          <Vacancies
            lang={lang}
            refreshVersion={refreshVersion}
            createSignal={vacancyCreateSignal}
            onDataChanged={handleFeatureChanged}
          />
        )}

        {activeTab === "applications" && (
          <Applications lang={lang} refreshVersion={refreshVersion} />
        )}

        {activeTab === "placement-requests" && (
          <PlacementRequests
            lang={lang}
            refreshVersion={refreshVersion}
            onDataChanged={handleFeatureChanged}
          />
        )}

        {activeTab === "billing" && (
          <Billing lang={lang} refreshVersion={refreshVersion} />
        )}
      </main>
    </div>
  );
}

// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;

  value: number;

  icon: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>

        <div className="text-slate-400">{icon}</div>
      </div>

      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

// ======================================================
// TAB
// ======================================================

function TabButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;

  onClick: () => void;

  label: string;

  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition ${
        active
          ? "bg-white font-semibold text-slate-900 shadow-sm"
          : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {icon}

      {label}
    </button>
  );
}
