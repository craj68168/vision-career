"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useProviderDashboard } from "./hook";
import Vacancies from "./vacancies";
import Applications from "./applications";
import PlacementRequests from "./placement-requests";
import Billing from "./billing";

// Shared tokens: keep in sync with vacancies.tsx (or move to ui-tokens.ts)
const PANEL = "rounded-[14px] bg-white/70 ring-1 ring-black/5";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-800/50 focus-visible:ring-offset-1";

const BTN = `inline-flex h-9 items-center justify-center gap-1.5 rounded-[12px] px-3.5 text-sm font-medium transition-colors ${FOCUS}`;

export default function ProviderDashboard() {
  const t = useTranslations("provider.dashboard");

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f5f8] text-[#1b1c21]">
        <div role="status" className="flex flex-col items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80 ring-1 ring-black/5">
            <RefreshCw
              className="h-5 w-5 animate-spin text-teal-800"
              aria-hidden="true"
            />
          </div>
          <p className="text-sm font-medium text-slate-500">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f8] text-[#1b1c21] antialiased">
      {/* Masthead (sticky on large screens only) */}
      <header className="border-b border-black/[0.06] bg-white/80 backdrop-blur-md lg:sticky lg:top-0 lg:z-20">
        <div className="mx-auto max-w-[1440px] px-4 py-5 md:px-8">
          {" "}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {t("title")}
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                {t("description")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={
                  lang === "ja"
                    ? "/provider-dashboard/profile"
                    : "/en/provider-dashboard/profile"
                }
                className={`${BTN} bg-white/80 text-slate-700 ring-1 ring-black/10 hover:bg-white hover:text-slate-900`}
              >
                <Building2
                  className="h-4 w-4 shrink-0 text-slate-500"
                  aria-hidden="true"
                />
                {t("companyProfile")}
              </Link>

              <button
                type="button"
                disabled={refreshing}
                onClick={() => void handleRefresh()}
                className={`${BTN} bg-white/80 text-slate-700 ring-1 ring-black/10 hover:bg-white disabled:opacity-60`}
              >
                <RefreshCw
                  className={`h-4 w-4 shrink-0 text-slate-500 ${refreshing ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                {refreshing ? t("refreshing") : t("refresh")}
              </button>

              <button
                type="button"
                onClick={requestPostVacancy}
                className={`${BTN} bg-teal-800 text-white ring-1 ring-teal-800 hover:bg-teal-700`}
              >
                <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t("postVacancy")}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-8 md:px-8">
        {" "}
        {error && (
          <div
            role="alert"
            className="rounded-[14px] bg-red-50/90 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200"
          >
            {error}
          </div>
        )}
        {/* Metrics */}
        <section
          aria-label={t("title")}
          className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          <StatCard
            lang={lang}
            label={t("stats.totalVacancies")}
            value={summary.totalVacancies}
            icon={<Briefcase className="h-4 w-4 text-slate-600" />}
            iconBg="bg-slate-100 ring-slate-200/80"
          />
          <StatCard
            lang={lang}
            label={t("stats.published")}
            value={summary.publishedCount}
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            iconBg="bg-emerald-50 ring-emerald-200/70"
            rail="bg-emerald-600"
          />
          <StatCard
            lang={lang}
            label={t("stats.pendingReview")}
            value={summary.pendingVacancyCount}
            icon={<Clock className="h-4 w-4 text-amber-600" />}
            iconBg="bg-amber-50 ring-amber-200/70"
            rail="bg-amber-600"
          />
          <StatCard
            lang={lang}
            label={t("stats.applications")}
            value={summary.totalApplications}
            icon={<Users className="h-4 w-4 text-teal-700" />}
            iconBg="bg-teal-50 ring-teal-200/70"
          />
          <StatCard
            lang={lang}
            label={t("stats.placementRequests")}
            value={summary.totalPlacementRequests}
            icon={<ClipboardList className="h-4 w-4 text-teal-700" />}
            iconBg="bg-teal-50 ring-teal-200/70"
          />
        </section>
        {/* Segmented tabs */}
        <div
          role="tablist"
          aria-label={t("title")}
          className={`${PANEL} flex flex-wrap items-center gap-1 p-1.5`}
        >
          <TabButton
            active={activeTab === "vacancies"}
            onClick={() => changeActiveTab("vacancies")}
            label={t("tabs.vacancies", { count: summary.totalVacancies })}
          />
          <TabButton
            active={activeTab === "applications"}
            onClick={() => changeActiveTab("applications")}
            label={t("tabs.applications", { count: summary.totalApplications })}
          />
          <TabButton
            active={activeTab === "placement-requests"}
            onClick={() => changeActiveTab("placement-requests")}
            label={t("tabs.placementRequests", {
              count: summary.totalPlacementRequests,
            })}
          />
          <TabButton
            active={activeTab === "billing"}
            onClick={() => changeActiveTab("billing")}
            label={t("tabs.billing")}
            icon={
              <CreditCard className="h-4 w-4 shrink-0" aria-hidden="true" />
            }
          />
        </div>
        {/* Panels */}
        <div role="tabpanel">
          {activeTab === "vacancies" && (
            <Vacancies
              lang={lang}
              refreshVersion={refreshVersion}
              createSignal={vacancyCreateSignal}
              onDataChanged={handleFeatureChanged}
              showToolbarActions={false}
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
        </div>
      </main>
    </div>
  );
}

function StatCard({
  lang,
  label,
  value,
  icon,
  iconBg,
  rail,
}: {
  lang: string;
  label: string;
  value: number;
  icon: ReactNode;
  iconBg: string;
  /** Status rail, only for cards that map to a vacancy status. */
  rail?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden p-4 md:p-5 ${rail ? "pl-5 md:pl-6" : ""} ${PANEL}`}
    >
      {rail && (
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 left-0 w-1.5 ${rail}`}
        />
      )}

      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-slate-500">{label}</p>
        <div
          aria-hidden="true"
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ring-1 ${iconBg}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 font-mono text-2xl font-semibold tabular-nums tracking-tight md:text-3xl">
        {new Intl.NumberFormat(lang === "ja" ? "ja-JP" : "en-US").format(
          value ?? 0,
        )}
      </p>
    </div>
  );
}

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
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-2 rounded-[12px] px-3.5 text-sm font-medium transition-colors ${FOCUS} ${
        active
          ? "bg-teal-800/10 text-teal-900 ring-1 ring-teal-800/20"
          : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
