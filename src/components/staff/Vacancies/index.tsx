"use client";

import {
  ClipboardCheck,
  Eye,
  Gavel,
  Pencil,
  RefreshCw,
  Search,
} from "lucide-react";

import type { ComponentType } from "react";

import { useQuery } from "@tanstack/react-query";

import { useTranslations } from "next-intl";

import { getCurrentStaff } from "@/components/auth/Staff/api";

import VacancyDetails from "./VacancyDetails";

import ScreenVacancyModal from "./ScreenVacancyModal";

import VacancyDecisionModal from "./VacancyDecisionModal";

import { useStaffVacancies } from "./hook";

import { getScreeningClass, getVacancyStatusClass } from "./helper";

import type {
  StaffVacancy,
  StaffVacancyScreeningStatus,
  StaffVacancyStatus,
} from "./types";

// ======================================================
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const fieldClass =
  "h-11 w-full rounded-xl bg-white px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 outline-none transition-shadow placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500";

const badgeClass = "rounded-full border px-3 py-1 text-xs font-semibold";

// ======================================================
// STAFF VACANCIES
// ======================================================

export default function StaffVacancies() {
  const t = useTranslations("staffVacancies");

  const {
    vacancies,

    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    screeningFilter,
    setScreeningFilter,

    selectedVacancy,
    setSelectedVacancy,

    screeningVacancy,
    setScreeningVacancy,

    decisionVacancy,
    setDecisionVacancy,

    isLoading,
    isFetching,

    isScreening,

    isApproving,

    isRejecting,

    submitScreening,

    approveVacancy,

    rejectVacancy,

    refresh,
  } = useStaffVacancies();

  // ====================================================
  // CURRENT STAFF
  // ====================================================

  const staffQuery = useQuery({
    queryKey: ["current-staff"],

    queryFn: getCurrentStaff,
  });

  const permissions = staffQuery.data?.data.permissions ?? [];

  const canReview = permissions.includes("vacancies:review");

  const canApprove = permissions.includes("vacancies:approval");

  // ====================================================
  // SUMMARY CARDS DOUBLE AS QUICK FILTERS
  // ====================================================

  const applyFilters = (
    status: "ALL" | StaffVacancyStatus,
    screening: "ALL" | StaffVacancyScreeningStatus,
  ) => {
    setStatusFilter(status);

    setScreeningFilter(screening);
  };

  const isFilter = (
    status: "ALL" | StaffVacancyStatus,
    screening: "ALL" | StaffVacancyScreeningStatus,
  ) => statusFilter === status && screeningFilter === screening;

  // ====================================================
  // SHARED ROW PIECES (used by table and mobile cards)
  // ====================================================

  const renderBadges = (vacancy: StaffVacancy) => (
    <>
      <span
        className={`${badgeClass} ${getVacancyStatusClass(vacancy.status)}`}
      >
        {t(`statuses.${vacancy.status}`)}
      </span>

      <span
        className={`${badgeClass} ${getScreeningClass(
          vacancy.staffScreening.status,
        )}`}
      >
        {t(`screeningStatuses.${vacancy.staffScreening.status}`)}
      </span>
    </>
  );

  const renderActions = (vacancy: StaffVacancy) => (
    <>
      {/* VIEW */}

      <button
        type="button"
        onClick={() => setSelectedVacancy(vacancy)}
        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-white px-3 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:flex-none xl:h-9"
      >
        <Eye className="h-4 w-4" />

        {t("actions.view")}
      </button>

      {/* SCREEN */}

      {canReview && vacancy.status === "pending_review" && (
        <button
          type="button"
          onClick={() => setScreeningVacancy(vacancy)}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:flex-none xl:h-9"
        >
          {vacancy.staffScreening.status === "NOT_SCREENED"
            ? t("actions.screen")
            : t("actions.editScreening")}
        </button>
      )}

      {/* APPROVE / REJECT */}

      {canApprove && vacancy.status === "pending_review" && (
        <button
          type="button"
          onClick={() => setDecisionVacancy(vacancy)}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:flex-none xl:h-9"
        >
          {t("actions.decide")}
        </button>
      )}
    </>
  );

  // ====================================================
  // UI
  // ====================================================

  return (
    <>
      <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 py-4 sm:space-y-6 sm:p-5 lg:px-8 lg:py-6">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
              {t("title")}
            </h1>

            <p className="mt-1 text-sm text-slate-500">{t("description")}</p>
          </div>

          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refresh()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />

            {t("refresh")}
          </button>
        </div>

        {/* SUMMARY (click a card to filter the list) */}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Summary
            label={t("summary.total")}
            value={summary?.total ?? 0}
            accent="indigo"
            active={isFilter("ALL", "ALL")}
            onClick={() => applyFilters("ALL", "ALL")}
          />

          <Summary
            label={t("summary.pendingReview")}
            value={summary?.pendingReview ?? 0}
            accent="amber"
            active={isFilter("pending_review", "ALL")}
            onClick={() => applyFilters("pending_review", "ALL")}
          />

          <Summary
            label={t("summary.notScreened")}
            value={summary?.notScreened ?? 0}
            accent="slate"
            active={isFilter("ALL", "NOT_SCREENED")}
            onClick={() => applyFilters("ALL", "NOT_SCREENED")}
          />

          <Summary
            label={t("summary.screened")}
            value={summary?.screened ?? 0}
            accent="emerald"
            active={isFilter("ALL", "SCREENED")}
            onClick={() => applyFilters("ALL", "SCREENED")}
          />

          <Summary
            label={t("summary.needsAttention")}
            value={summary?.needsAttention ?? 0}
            accent="rose"
            active={isFilter("ALL", "NEEDS_ATTENTION")}
            onClick={() => applyFilters("ALL", "NEEDS_ATTENTION")}
          />

          <Summary
            label={t("summary.published")}
            value={summary?.published ?? 0}
            accent="sky"
            active={isFilter("published", "ALL")}
            onClick={() => applyFilters("published", "ALL")}
          />
        </div>

        {/* FILTERS */}

        <div className="grid gap-3 rounded-2xl bg-white p-3 ring-1 ring-inset ring-slate-200 sm:grid-cols-2 sm:p-4 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className={`${fieldClass} pl-10`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "ALL" | StaffVacancyStatus)
            }
            className={fieldClass}
          >
            <option value="ALL">{t("filters.allStatuses")}</option>

            <option value="draft">{t("statuses.draft")}</option>

            <option value="pending_review">
              {t("statuses.pending_review")}
            </option>

            <option value="approved">{t("statuses.approved")}</option>

            <option value="rejected">{t("statuses.rejected")}</option>

            <option value="published">{t("statuses.published")}</option>

            <option value="closed">{t("statuses.closed")}</option>
          </select>

          <select
            value={screeningFilter}
            onChange={(event) =>
              setScreeningFilter(
                event.target.value as "ALL" | StaffVacancyScreeningStatus,
              )
            }
            className={fieldClass}
          >
            <option value="ALL">{t("filters.allScreening")}</option>

            <option value="NOT_SCREENED">
              {t("screeningStatuses.NOT_SCREENED")}
            </option>

            <option value="SCREENED">{t("screeningStatuses.SCREENED")}</option>

            <option value="NEEDS_ATTENTION">
              {t("screeningStatuses.NEEDS_ATTENTION")}
            </option>
          </select>
        </div>

        {/* ================================================= */}
        {/* TABLE (wide screens) */}
        {/* ================================================= */}

        <div className="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 xl:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">{t("table.vacancy")}</th>

                  <th className="px-4 py-3">{t("table.company")}</th>

                  <th className="px-4 py-3">{t("table.employment")}</th>

                  <th className="px-4 py-3">{t("table.location")}</th>

                  <th className="px-4 py-3">{t("table.status")}</th>

                  <th className="px-4 py-3">{t("table.screening")}</th>

                  <th className="px-4 py-3 text-right">{t("table.actions")}</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {isLoading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-slate-500"
                    >
                      {t("loading")}
                    </td>
                  </tr>
                )}

                {!isLoading && vacancies.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-slate-500"
                    >
                      {t("empty")}
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  vacancies.map((vacancy) => (
                    <tr
                      key={vacancy.vacancyId}
                      className="border-t border-slate-100 transition-colors hover:bg-slate-50/70"
                    >
                      <td className="max-w-[280px] px-4 py-2.5">
                        <p
                          className="truncate font-semibold text-slate-950"
                          title={vacancy.title}
                        >
                          {vacancy.title}
                        </p>

                        <p className="mt-0.5 truncate text-[11px] text-slate-400">
                          {vacancy.vacancyId}
                        </p>
                      </td>

                      <td
                        className="max-w-[200px] truncate px-4 py-2.5 text-slate-800"
                        title={vacancy.companyName}
                      >
                        {vacancy.companyName}
                      </td>

                      <td className="whitespace-nowrap px-4 py-2.5 text-slate-700">
                        {vacancy.employmentType}
                      </td>

                      <td
                        className="max-w-[180px] truncate px-4 py-2.5 text-slate-700"
                        title={vacancy.workLocation}
                      >
                        {vacancy.workLocation}
                      </td>

                      <td className="px-4 py-2.5">
                        <span
                          className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getVacancyStatusClass(
                            vacancy.status,
                          )}`}
                        >
                          {t(`statuses.${vacancy.status}`)}
                        </span>
                      </td>

                      <td className="px-4 py-2.5">
                        <span
                          className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getScreeningClass(
                            vacancy.staffScreening.status,
                          )}`}
                        >
                          {t(
                            `screeningStatuses.${vacancy.staffScreening.status}`,
                          )}
                        </span>
                      </td>

                      <td className="px-4 py-2.5">
                        <div className="flex justify-end gap-1.5">
                          {/* VIEW */}

                          <ActionIconButton
                            label={t("actions.view")}
                            icon={Eye}
                            tone="neutral"
                            onClick={() => setSelectedVacancy(vacancy)}
                          />

                          {/* SCREEN */}

                          {canReview && vacancy.status === "pending_review" && (
                            <ActionIconButton
                              label={
                                vacancy.staffScreening.status === "NOT_SCREENED"
                                  ? t("actions.screen")
                                  : t("actions.editScreening")
                              }
                              icon={
                                vacancy.staffScreening.status === "NOT_SCREENED"
                                  ? ClipboardCheck
                                  : Pencil
                              }
                              tone="indigo"
                              onClick={() => setScreeningVacancy(vacancy)}
                            />
                          )}

                          {/* APPROVE / REJECT */}

                          {canApprove &&
                            vacancy.status === "pending_review" && (
                              <ActionIconButton
                                label={t("actions.decide")}
                                icon={Gavel}
                                tone="emerald"
                                onClick={() => setDecisionVacancy(vacancy)}
                              />
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================================= */}
        {/* CARDS (phones, tablets, small laptops) */}
        {/* ================================================= */}

        <div className="space-y-3 xl:hidden">
          {isLoading && (
            <div className="rounded-2xl bg-white py-14 text-center text-sm text-slate-500 ring-1 ring-inset ring-slate-200">
              {t("loading")}
            </div>
          )}

          {!isLoading && vacancies.length === 0 && (
            <div className="rounded-2xl bg-white py-14 text-center text-sm text-slate-500 ring-1 ring-inset ring-slate-200">
              {t("empty")}
            </div>
          )}

          {!isLoading &&
            vacancies.map((vacancy) => (
              <article
                key={vacancy.vacancyId}
                className="rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5"
              >
                <div className="min-w-0">
                  <h2 className="break-words font-semibold text-slate-950">
                    {vacancy.title}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {vacancy.vacancyId}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {renderBadges(vacancy)}
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.company")}
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {vacancy.companyName}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.employment")}
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {vacancy.employmentType}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.location")}
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {vacancy.workLocation}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  {renderActions(vacancy)}
                </div>
              </article>
            ))}
        </div>

        {!canReview && !canApprove && (
          <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700 ring-1 ring-inset ring-blue-200">
            {t("viewOnlyNotice")}
          </div>
        )}
      </main>

      {/* DETAILS */}

      <VacancyDetails
        vacancy={selectedVacancy}
        canReview={canReview}
        canApprove={canApprove}
        onClose={() => setSelectedVacancy(null)}
        onScreen={(vacancy) => {
          setSelectedVacancy(null);

          setScreeningVacancy(vacancy);
        }}
        onDecision={(vacancy) => {
          setSelectedVacancy(null);

          setDecisionVacancy(vacancy);
        }}
      />

      {/* SCREEN */}

      <ScreenVacancyModal
        vacancy={screeningVacancy}
        loading={isScreening}
        onClose={() => setScreeningVacancy(null)}
        onSubmit={submitScreening}
      />

      {/* APPROVE / REJECT */}

      <VacancyDecisionModal
        vacancy={decisionVacancy}
        isApproving={isApproving}
        isRejecting={isRejecting}
        onClose={() => setDecisionVacancy(null)}
        onApprove={approveVacancy}
        onReject={rejectVacancy}
      />
    </>
  );
}

// ======================================================
// SUMMARY
//
// Full class names are written out so Tailwind can
// detect them.
// ======================================================

const summaryAccents = {
  indigo: {
    card: "bg-[linear-gradient(180deg,#eef2ff,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-indigo-200 hover:ring-indigo-400",
    activeRing: "ring-2 ring-inset ring-indigo-500",
    value: "text-slate-950",
  },
  amber: {
    card: "bg-[linear-gradient(180deg,#fffbeb,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-amber-200 hover:ring-amber-400",
    activeRing: "ring-2 ring-inset ring-amber-500",
    value: "text-amber-700",
  },
  slate: {
    card: "bg-[linear-gradient(180deg,#f1f5f9,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-slate-200 hover:ring-slate-400",
    activeRing: "ring-2 ring-inset ring-slate-500",
    value: "text-slate-950",
  },
  emerald: {
    card: "bg-[linear-gradient(180deg,#ecfdf5,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-emerald-200 hover:ring-emerald-400",
    activeRing: "ring-2 ring-inset ring-emerald-500",
    value: "text-slate-950",
  },
  rose: {
    card: "bg-[linear-gradient(180deg,#fff1f2,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-rose-200 hover:ring-rose-400",
    activeRing: "ring-2 ring-inset ring-rose-500",
    value: "text-rose-700",
  },
  sky: {
    card: "bg-[linear-gradient(180deg,#f0f9ff,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-sky-200 hover:ring-sky-400",
    activeRing: "ring-2 ring-inset ring-sky-500",
    value: "text-slate-950",
  },
} as const;

function Summary({
  label,
  value,
  accent,
  active,
  onClick,
}: {
  label: string;

  value: number;

  accent: keyof typeof summaryAccents;

  active: boolean;

  onClick: () => void;
}) {
  const colors = summaryAccents[accent];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-w-0 rounded-xl p-4 text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:p-5 ${
        colors.card
      } ${active ? colors.activeRing : colors.ring}`}
    >
      <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>

      <p
        className={`mt-2 text-[26px] font-bold leading-none tabular-nums sm:text-3xl ${colors.value}`}
      >
        {value}
      </p>
    </button>
  );
}

// ======================================================
// ACTION ICON BUTTON
//
// Icon only; the label appears in a tooltip on hover or
// keyboard focus (and is the accessible name).
// The tooltip is right-aligned so the table's scroll
// container never clips it.
// ======================================================

const actionTones = {
  neutral:
    "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50",
  indigo: "bg-indigo-600 text-white hover:bg-indigo-700",
  emerald: "bg-emerald-600 text-white hover:bg-emerald-700",
} as const;

function ActionIconButton({
  label,
  icon: Icon,
  tone,
  onClick,
}: {
  label: string;

  icon: ComponentType<{ className?: string }>;

  tone: keyof typeof actionTones;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`group relative inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${actionTones[tone]}`}
    >
      <Icon className="h-4 w-4" />

      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full right-0 z-10 mb-2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {label}
      </span>
    </button>
  );
}