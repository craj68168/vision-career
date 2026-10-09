"use client";

import {
  CheckCircle2,
  Eye,
  Pencil,
  RefreshCw,
  Search,
  Send,
} from "lucide-react";

import type { ComponentType } from "react";

import { useLocale, useTranslations } from "next-intl";

import BillingDetails from "./BillingDetails";

import BillingEditModal from "./BillingEditModal";

import IssueBillingModal from "./IssueBillingModal";

import MarkPaidModal from "./MarkPaidModal";

import {
  formatBillingDate,
  formatMoney,
  getBillingStatusClass,
} from "./helper";

import { useStaffPlacementBillings } from "./hook";

import type { PlacementBillingStatus } from "./types";

// ======================================================
// TYPES
// ======================================================

type BillingRow = ReturnType<
  typeof useStaffPlacementBillings
>["billings"][number];

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

const PAID_STATUSES: PlacementBillingStatus[] = [
  "paid",
  "partially_refunded",
  "refunded",
];

// ======================================================
// BILLING PAGE
// ======================================================

export default function StaffPlacementBillings() {
  const t = useTranslations("staffPlacementBillings");

  const locale = useLocale();

  const {
    billings,
    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    canView,
    canManage,

    viewingBillingId,
    viewingBilling,
    setViewingBillingId,

    editingBilling,
    setEditingBilling,

    issuingBilling,
    setIssuingBilling,

    payingBilling,
    setPayingBilling,

    isLoading,
    isFetching,
    isDetailsLoading,

    isUpdating,
    isIssuing,
    isMarkingPaid,
    isSaving,

    error,

    refresh,

    updateBilling,
    issueBilling,
    markPaid,
  } = useStaffPlacementBillings();

  // ====================================================
  // PERMISSION
  // ====================================================

  if (!isLoading && !canView) {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:p-5 lg:px-8 lg:py-6">
        <div
          role="alert"
          className="rounded-2xl bg-amber-50 p-5 text-sm leading-6 text-amber-800 ring-1 ring-inset ring-amber-200 sm:p-6"
        >
          {t("permissionDenied")}
        </div>
      </div>
    );
  }

  // ====================================================
  // SUMMARY CARDS DOUBLE AS QUICK FILTERS
  // ====================================================

  const isFilter = (status: "ALL" | PlacementBillingStatus) =>
    statusFilter === status;

  const showNetPaid = (billing: BillingRow) =>
    PAID_STATUSES.includes(billing.status);

  const formatNetPaid = (billing: BillingRow) =>
    showNetPaid(billing)
      ? formatMoney(billing.netPaidAmount, billing.currency, locale)
      : "-";

  // ====================================================
  // SHARED ROW PIECES (used by mobile cards)
  // ====================================================

  const renderActions = (billing: BillingRow) => (
    <>
      {/* VIEW */}

      <button
        type="button"
        onClick={() => setViewingBillingId(billing.billingId)}
        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-white px-3 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:flex-none"
      >
        <Eye className="h-4 w-4" />

        {t("actions.view")}
      </button>

      {/* EDIT + ISSUE (draft) */}

      {canManage && billing.status === "draft" && (
        <>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => setEditingBilling(billing)}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            <Pencil className="h-4 w-4" />

            {t("actions.edit")}
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => setIssuingBilling(billing)}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            <Send className="h-4 w-4" />

            {t("actions.issue")}
          </button>
        </>
      )}

      {/* MARK PAID (issued) */}

      {canManage && billing.status === "issued" && (
        <button
          type="button"
          disabled={isSaving}
          onClick={() => setPayingBilling(billing)}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
        >
          <CheckCircle2 className="h-4 w-4" />

          {t("actions.markPaid")}
        </button>
      )}
    </>
  );

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

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
          <Summary
            label={t("summary.total")}
            value={summary?.total ?? 0}
            accent="indigo"
            active={isFilter("ALL")}
            onClick={() => setStatusFilter("ALL")}
          />

          <Summary
            label={t("summary.draft")}
            value={summary?.draft ?? 0}
            accent="slate"
            active={isFilter("draft")}
            onClick={() => setStatusFilter("draft")}
          />

          <Summary
            label={t("summary.issued")}
            value={summary?.issued ?? 0}
            accent="sky"
            active={isFilter("issued")}
            onClick={() => setStatusFilter("issued")}
          />

          <Summary
            label={t("summary.paid")}
            value={summary?.paid ?? 0}
            accent="emerald"
            active={isFilter("paid")}
            onClick={() => setStatusFilter("paid")}
          />

          <Summary
            label={t("summary.partialRefund")}
            value={summary?.partiallyRefunded ?? 0}
            accent="amber"
            active={isFilter("partially_refunded")}
            onClick={() => setStatusFilter("partially_refunded")}
          />

          <Summary
            label={t("summary.refunded")}
            value={summary?.refunded ?? 0}
            accent="violet"
            active={isFilter("refunded")}
            onClick={() => setStatusFilter("refunded")}
          />

          <Summary
            label={t("summary.cancelled")}
            value={summary?.cancelled ?? 0}
            accent="rose"
            active={isFilter("cancelled")}
            onClick={() => setStatusFilter("cancelled")}
          />
        </div>

        {/* MONEY */}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MoneySummary
            label={t("summary.totalBilled")}
            value={summary?.billedTotal ?? 0}
            accent="indigo"
            locale={locale}
          />

          <MoneySummary
            label={t("summary.netPaid")}
            value={summary?.paidTotal ?? 0}
            accent="emerald"
            locale={locale}
          />

          <MoneySummary
            label={t("summary.refundedTotal")}
            value={summary?.refundedTotal ?? 0}
            accent="violet"
            locale={locale}
          />

          <MoneySummary
            label={t("summary.outstanding")}
            value={summary?.outstandingTotal ?? 0}
            accent="amber"
            warn={(summary?.outstandingTotal ?? 0) > 0}
            locale={locale}
          />
        </div>

        {/* FILTERS */}

        <div className="grid gap-3 rounded-2xl bg-white p-3 ring-1 ring-inset ring-slate-200 sm:grid-cols-2 sm:p-4 lg:grid-cols-[1fr_220px]">
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
                event.target.value as "ALL" | PlacementBillingStatus,
              )
            }
            className={`${fieldClass} sm:col-span-2 lg:col-span-1`}
          >
            <option value="ALL">{t("allStatuses")}</option>

            <option value="draft">{t("statuses.draft")}</option>

            <option value="issued">{t("statuses.issued")}</option>

            <option value="paid">{t("statuses.paid")}</option>

            <option value="partially_refunded">
              {t("statuses.partially_refunded")}
            </option>

            <option value="refunded">{t("statuses.refunded")}</option>

            <option value="cancelled">{t("statuses.cancelled")}</option>
          </select>
        </div>

        {/* ERROR */}

        {error && (
          <div
            role="alert"
            className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-inset ring-rose-200"
          >
            {error}
          </div>
        )}

        {/* ================================================= */}
        {/* TABLE (wide screens) */}
        {/* ================================================= */}

        <div className="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 xl:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">{t("table.billing")}</th>

                  <th className="px-4 py-3">{t("table.company")}</th>

                  <th className="px-4 py-3">{t("table.candidate")}</th>

                  <th className="px-4 py-3">{t("table.position")}</th>

                  <th className="px-4 py-3">{t("table.total")}</th>

                  <th className="px-4 py-3">{t("table.netPaid")}</th>

                  <th className="px-4 py-3">{t("table.status")}</th>

                  <th className="px-4 py-3">{t("table.dueDate")}</th>

                  <th className="px-4 py-3 text-right">{t("table.actions")}</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {isLoading && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-12 text-center text-slate-500"
                    >
                      {t("loading")}
                    </td>
                  </tr>
                )}

                {!isLoading && billings.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-12 text-center text-slate-500"
                    >
                      {t("empty")}
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  billings.map((billing) => (
                    <tr
                      key={billing.billingId}
                      className="border-t border-slate-100 transition-colors hover:bg-slate-50/70"
                    >
                      <td className="max-w-[180px] px-4 py-2.5">
                        <p
                          className="truncate font-semibold text-slate-950"
                          title={billing.billingId}
                        >
                          {billing.billingId}
                        </p>

                        <p
                          className="mt-0.5 truncate text-[11px] text-slate-500"
                          title={billing.invoiceNumber || billing.recruitId}
                        >
                          {billing.invoiceNumber || billing.recruitId}
                        </p>
                      </td>

                      <td
                        className="max-w-[200px] truncate px-4 py-2.5 text-slate-800"
                        title={billing.companyName}
                      >
                        {billing.companyName}
                      </td>

                      <td
                        className="max-w-[180px] truncate px-4 py-2.5 font-medium text-slate-900"
                        title={billing.candidateName}
                      >
                        {billing.candidateName}
                      </td>

                      <td
                        className="max-w-[200px] truncate px-4 py-2.5 text-slate-700"
                        title={billing.jobTitle}
                      >
                        {billing.jobTitle}
                      </td>

                      <td className="whitespace-nowrap px-4 py-2.5 font-semibold tabular-nums text-slate-950">
                        {formatMoney(
                          billing.totalAmount,
                          billing.currency,
                          locale,
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-slate-800">
                        {formatNetPaid(billing)}
                      </td>

                      <td className="px-4 py-2.5">
                        <span
                          className={`${compactBadgeClass} ${getBillingStatusClass(
                            billing.status,
                          )}`}
                        >
                          {t(`statuses.${billing.status}`)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-2.5 text-slate-700">
                        {formatBillingDate(billing.dueDate, locale)}
                      </td>

                      <td className="px-4 py-2.5">
                        <div className="flex justify-end gap-1.5">
                          {/* VIEW */}

                          <ActionIconButton
                            label={t("actions.view")}
                            icon={Eye}
                            tone="neutral"
                            onClick={() =>
                              setViewingBillingId(billing.billingId)
                            }
                          />

                          {/* EDIT + ISSUE (draft) */}

                          {canManage && billing.status === "draft" && (
                            <>
                              <ActionIconButton
                                label={t("actions.edit")}
                                icon={Pencil}
                                tone="slate"
                                disabled={isSaving}
                                onClick={() => setEditingBilling(billing)}
                              />

                              <ActionIconButton
                                label={t("actions.issue")}
                                icon={Send}
                                tone="indigo"
                                disabled={isSaving}
                                onClick={() => setIssuingBilling(billing)}
                              />
                            </>
                          )}

                          {/* MARK PAID (issued) */}

                          {canManage && billing.status === "issued" && (
                            <ActionIconButton
                              label={t("actions.markPaid")}
                              icon={CheckCircle2}
                              tone="emerald"
                              disabled={isSaving}
                              onClick={() => setPayingBilling(billing)}
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

          {!isLoading && billings.length === 0 && (
            <div className="rounded-2xl bg-white py-14 text-center text-sm text-slate-500 ring-1 ring-inset ring-slate-200">
              {t("empty")}
            </div>
          )}

          {!isLoading &&
            billings.map((billing) => (
              <article
                key={billing.billingId}
                className="rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5"
              >
                <div className="min-w-0">
                  <h2 className="break-words font-semibold text-slate-950">
                    {billing.companyName}
                  </h2>

                  <p className="mt-1 break-all text-xs text-slate-400">
                    {billing.billingId}
                    {" · "}
                    {billing.invoiceNumber || billing.recruitId}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`${badgeClass} ${getBillingStatusClass(
                      billing.status,
                    )}`}
                  >
                    {t(`statuses.${billing.status}`)}
                  </span>
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.candidate")}
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {billing.candidateName}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.position")}
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {billing.jobTitle}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.dueDate")}
                    </dt>

                    <dd className="mt-0.5 text-slate-900">
                      {formatBillingDate(billing.dueDate, locale)}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.total")}
                    </dt>

                    <dd className="mt-0.5 break-words font-semibold tabular-nums text-slate-900">
                      {formatMoney(
                        billing.totalAmount,
                        billing.currency,
                        locale,
                      )}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {t("table.netPaid")}
                    </dt>

                    <dd className="mt-0.5 break-words font-semibold tabular-nums text-slate-900">
                      {formatNetPaid(billing)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  {renderActions(billing)}
                </div>
              </article>
            ))}
        </div>

        {/* VIEW ONLY NOTICE */}

        {!canManage && (
          <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700 ring-1 ring-inset ring-blue-200">
            {t("viewOnlyNotice")}
          </div>
        )}
      </main>

      {/* DETAILS */}

      {viewingBillingId && (
        <BillingDetails
          billing={viewingBilling}
          loading={isDetailsLoading}
          onClose={() => setViewingBillingId(null)}
        />
      )}

      {/* EDIT */}

      <BillingEditModal
        billing={editingBilling}
        loading={isUpdating}
        onClose={() => setEditingBilling(null)}
        onSubmit={updateBilling}
      />

      {/* ISSUE */}

      <IssueBillingModal
        billing={issuingBilling}
        isSaving={isIssuing}
        onClose={() => setIssuingBilling(null)}
        onConfirm={issueBilling}
      />

      {/* MARK PAID */}

      <MarkPaidModal
        billing={payingBilling}
        isSaving={isMarkingPaid}
        onClose={() => setPayingBilling(null)}
        onConfirm={markPaid}
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
  violet: {
    card: "bg-[linear-gradient(180deg,#f5f3ff,#ffffff_75%)]",
    ring: "ring-1 ring-inset ring-violet-200 hover:ring-violet-400",
    activeRing: "ring-2 ring-inset ring-violet-500",
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
// MONEY SUMMARY
//
// Not clickable (no filter behind it), so it is an
// article with a static ring.
// ======================================================

const moneyAccents = {
  indigo:
    "bg-[linear-gradient(180deg,#eef2ff,#ffffff_75%)] ring-1 ring-inset ring-indigo-200",
  emerald:
    "bg-[linear-gradient(180deg,#ecfdf5,#ffffff_75%)] ring-1 ring-inset ring-emerald-200",
  violet:
    "bg-[linear-gradient(180deg,#f5f3ff,#ffffff_75%)] ring-1 ring-inset ring-violet-200",
  amber:
    "bg-[linear-gradient(180deg,#fffbeb,#ffffff_75%)] ring-1 ring-inset ring-amber-200",
} as const;

function MoneySummary({
  label,
  value,
  accent,
  warn = false,
  locale,
}: {
  label: string;

  value: number;

  accent: keyof typeof moneyAccents;

  warn?: boolean;

  locale: string;
}) {
  return (
    <article className={`min-w-0 rounded-xl p-4 sm:p-5 ${moneyAccents[accent]}`}>
      <p className="text-[11px] font-medium uppercase leading-snug tracking-wide text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2.5 break-words text-xl font-semibold leading-none tabular-nums sm:text-2xl ${
          warn ? "text-amber-700" : "text-slate-950"
        }`}
      >
        {formatMoney(value, "JPY", locale)}
      </p>
    </article>
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
  slate: "bg-slate-900 text-white hover:bg-slate-800",
  indigo: "bg-indigo-600 text-white hover:bg-indigo-700",
  emerald: "bg-emerald-600 text-white hover:bg-emerald-700",
} as const;

function ActionIconButton({
  label,
  icon: Icon,
  tone,
  disabled = false,
  onClick,
}: {
  label: string;

  icon: ComponentType<{ className?: string }>;

  tone: keyof typeof actionTones;

  disabled?: boolean;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`group relative inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${actionTones[tone]}`}
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