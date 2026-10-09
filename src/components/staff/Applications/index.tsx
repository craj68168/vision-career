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

import { useTranslations } from "next-intl";

import { useQuery } from "@tanstack/react-query";

import { getCurrentStaff } from "@/components/auth/Staff/api";

import ApplicationDetails from "./ApplicationDetails";

import ApplicationDecisionModal from "./RejectApplicationModal";

import ScreenApplicationModal from "./ScreenApplicationModal";

import { useStaffApplications } from "./hook";

import { getApplicationStatusClass, getScreeningClass } from "./helper";

import type { StaffApplicationStatus, StaffScreeningStatus } from "./types";

// ======================================================
// TYPES
// ======================================================

type StaffApplicationRow = ReturnType<
  typeof useStaffApplications
>["applications"][number];

// ======================================================
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const fieldClass =
  "h-11 w-full rounded-xl bg-white px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 outline-none transition-shadow placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500";

const badgeClass = "rounded-full px-3 py-1 text-xs font-semibold";

const compactBadgeClass =
  "whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold";

// ======================================================
// APPLICATION PAGE
// ======================================================

export default function StaffApplications() {
  const t = useTranslations("staffApplications");

  const {
    applications,

    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    screeningFilter,
    setScreeningFilter,

    selectedApplication,
    setSelectedApplication,

    screeningApplication,
    setScreeningApplication,

    decisionApplication,
    setDecisionApplication,

    isLoading,
    isFetching,

    isScreening,

    isApproving,
    isRejecting,

    submitScreening,

    approveApplication,
    rejectApplication,

    refresh,
  } = useStaffApplications();

  // ====================================================
  // CURRENT STAFF
  // ====================================================

  const staffQuery = useQuery({
    queryKey: ["current-staff"],

    queryFn: getCurrentStaff,
  });

  // ====================================================
  // PERMISSIONS
  // ====================================================

  const canReview =
    staffQuery.data?.data.permissions.includes("applications:review") ?? false;

  const canApprove =
    staffQuery.data?.data.permissions.includes("applications:approval") ??
    false;

  // ====================================================
  // SUMMARY CARDS DOUBLE AS QUICK FILTERS
  // ====================================================

  const applyFilters = (
    status: "ALL" | StaffApplicationStatus,
    screening: "ALL" | StaffScreeningStatus,
  ) => {
    setStatusFilter(status);

    setScreeningFilter(screening);
  };

  const isFilter = (
    status: "ALL" | StaffApplicationStatus,
    screening: "ALL" | StaffScreeningStatus,
  ) => statusFilter === status && screeningFilter === screening;

  // ====================================================
  // SHARED ROW PIECES (used by mobile cards)
  // ====================================================

  const renderBadges = (application: StaffApplicationRow) => (
    <>
      <span
        className={`${badgeClass} ${getApplicationStatusClass(
          application.status,
        )}`}
      >
        {t(`statuses.${application.status}`)}
      </span>

      <span
        className={`${badgeClass} ${getScreeningClass(
          application.screening.status,
        )}`}
      >
        {t(`screeningStatuses.${application.screening.status}`)}
      </span>
    </>
  );

  const renderActions = (application: StaffApplicationRow) => {
    const pending = application.status === "PENDING_ADMIN_APPROVAL";

    return (
      <>
        {/* VIEW */}

        <button
          type="button"
          onClick={() => setSelectedApplication(application)}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-white px-3 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:flex-none"
        >
          <Eye className="h-4 w-4" />

          {t("actions.view")}
        </button>

        {/* SCREEN */}

        {canReview && pending && (
          <button
            type="button"
            onClick={() => setScreeningApplication(application)}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:flex-none"
          >
            {application.screening.status === "NOT_SCREENED"
              ? t("actions.screen")
              : t("actions.editScreening")}
          </button>
        )}

        {/* APPROVE / REJECT */}

        {canApprove && pending && (
          <button
            type="button"
            onClick={() => setDecisionApplication(application)}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:flex-none"
          >
            {t("actions.decide")}
          </button>
        )}
      </>
    );
  };

  // ====================================================
  // RENDER
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

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          <Summary
            label={t("summary.total")}
            value={summary?.total ?? 0}
            accent="indigo"
            active={isFilter("ALL", "ALL")}
            onClick={() => applyFilters("ALL", "ALL")}
          />

          <Summary
            label={t("summary.pendingApproval")}
            value={summary?.pendingAdminApproval ?? 0}
            accent="amber"
            active={isFilter("PENDING_ADMIN_APPROVAL", "ALL")}
            onClick={() => applyFilters("PENDING_ADMIN_APPROVAL", "ALL")}
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
              setStatusFilter(
                event.target.value as "ALL" | StaffApplicationStatus,
              )
            }
            className={fieldClass}
          >
            <option value="ALL">{t("filters.allStatuses")}</option>

            <option value="PENDING_ADMIN_APPROVAL">
              {t("statuses.PENDING_ADMIN_APPROVAL")}
            </option>

            <option value="SENT_TO_PROVIDER">
              {t("statuses.SENT_TO_PROVIDER")}
            </option>

            <option value="UNDER_REVIEW">{t("statuses.UNDER_REVIEW")}</option>

            <option value="INTERVIEW">{t("statuses.INTERVIEW")}</option>

            <option value="SELECTED">{t("statuses.SELECTED")}</option>

            <option value="HIRED">{t("statuses.HIRED")}</option>

            <option value="ADMIN_REJECTED">
              {t("statuses.ADMIN_REJECTED")}
            </option>

            <option value="REJECTED">{t("statuses.REJECTED")}</option>
          </select>

          <select
            value={screeningFilter}
            onChange={(event) =>
              setScreeningFilter(
                event.target.value as "ALL" | StaffScreeningStatus,
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
                  <th className="px-4 py-3">{t("table.application")}</th>

                  <th className="px-4 py-3">{t("table.applicant")}</th>

                  <th className="px-4 py-3">{t("table.vacancy")}</th>

                  <th className="px-4 py-3">{t("table.company")}</th>

                  <th className="px-4 py-3">{t("table.applicationStatus")}</th>

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

                {!isLoading && applications.length === 0 && (
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
                  applications.map((application) => {
                    const pending =
                      application.status === "PENDING_ADMIN_APPROVAL";

                    return (
                      <tr
                        key={application.applicationId}
                        className="border-t border-slate-100 transition-colors hover:bg-slate-50/70"
                      >
                        <td className="whitespace-nowrap px-4 py-2.5 font-medium text-slate-900">
                          {application.applicationId}
                        </td>

                        <td className="max-w-[240px] px-4 py-2.5">
                          <p
                            className="truncate font-semibold text-slate-950"
                            title={application.applicant.name || "-"}
                          >
                            {application.applicant.name || "-"}
                          </p>

                          <p className="mt-0.5 truncate text-[11px] text-slate-400">
                            {application.applicant.japaneseLevel ||
                              t("japaneseLevelNotSet")}
                          </p>
                        </td>

                        <td
                          className="max-w-[240px] truncate px-4 py-2.5 text-slate-800"
                          title={application.vacancy?.title || "-"}
                        >
                          {application.vacancy?.title || "-"}
                        </td>

                        <td
                          className="max-w-[200px] truncate px-4 py-2.5 text-slate-700"
                          title={application.vacancy?.companyName || "-"}
                        >
                          {application.vacancy?.companyName || "-"}
                        </td>

                        <td className="px-4 py-2.5">
                          <span
                            className={`${compactBadgeClass} ${getApplicationStatusClass(
                              application.status,
                            )}`}
                          >
                            {t(`statuses.${application.status}`)}
                          </span>
                        </td>

                        <td className="px-4 py-2.5">
                          <span
                            className={`${compactBadgeClass} ${getScreeningClass(
                              application.screening.status,
                            )}`}
                          >
                            {t(
                              `screeningStatuses.${application.screening.status}`,
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
                              onClick={() => setSelectedApplication(application)}
                            />

                            {/* SCREEN */}

                            {canReview && pending && (
                              <ActionIconButton
                                label={
                                  application.screening.status ===
                                  "NOT_SCREENED"
                                    ? t("actions.screen")
                                    : t("actions.editScreening")
                                }
                                icon={
                                  application.screening.status ===
                                  "NOT_SCREENED"
                                    ? ClipboardCheck
                                    : Pencil
                                }
                                tone="indigo"
                                onClick={() =>
                                  setScreeningApplication(application)
                                }
                              />
                            )}

                            {/* APPROVE / REJECT */}

                            {canApprove && pending && (
                              <ActionIconButton
                                label={t("actions.decide")}
                                icon={Gavel}
                                tone="emerald"
                                onClick={() =>
                                  setDecisionApplication(application)
                                }
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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

          {!isLoading && applications.length === 0 && (
            <div className="rounded-2xl bg-white py-14 text-center text-sm text-slate-500 ring-1 ring-inset ring-slate-200">
              {t("empty")}
            </div>
          )}

          {!isLoading &&
            applications.map((application) => (
              <article
                key={application.applicationId}
                className="rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5"
              >
                <div className="min-w-0">
                  <h2 className="break-words font-semibold text-slate-950">
                    {application.applicant.name || "-"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {application.applicationId}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {renderBadges(application)}
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.vacancy")}
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {application.vacancy?.title || "-"}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.company")}
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {application.vacancy?.companyName || "-"}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.applicant")}
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {application.applicant.japaneseLevel ||
                        t("japaneseLevelNotSet")}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  {renderActions(application)}
                </div>
              </article>
            ))}
        </div>

        {/* PERMISSION NOTICE */}

        {(!canReview || !canApprove) && (
          <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700 ring-1 ring-inset ring-blue-200">
            {!canReview && !canApprove
              ? t("permissions.viewOnly")
              : canReview
                ? t("permissions.screenOnly")
                : t("permissions.approvalOnly")}
          </div>
        )}
      </main>

      {/* DETAILS */}

      <ApplicationDetails
        application={selectedApplication}
        canReview={canReview}
        canApprove={canApprove}
        onClose={() => setSelectedApplication(null)}
        onScreen={(application) => {
          setSelectedApplication(null);

          setScreeningApplication(application);
        }}
        onDecision={(application) => {
          setSelectedApplication(null);

          setDecisionApplication(application);
        }}
      />

      {/* SCREEN */}

      <ScreenApplicationModal
        application={screeningApplication}
        loading={isScreening}
        onClose={() => setScreeningApplication(null)}
        onSubmit={submitScreening}
      />

      {/* APPROVE / REJECT */}

      <ApplicationDecisionModal
        application={decisionApplication}
        isApproving={isApproving}
        isRejecting={isRejecting}
        onClose={() => setDecisionApplication(null)}
        onApprove={approveApplication}
        onReject={rejectApplication}
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