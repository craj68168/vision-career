"use client";

import {
  ClipboardCheck,
  Eye,
  Pencil,
  RefreshCw,
  Search,
} from "lucide-react";

import type { ComponentType } from "react";

import { useQuery } from "@tanstack/react-query";

import { getCurrentStaff } from "@/components/auth/Staff/api";

import {
  getProviderStatusClass,
  getReviewClass,
  getReviewLabel,
} from "./helper";

import { useStaffProviders } from "./hook";

import ClientDetails from "./ClientDetails";
import ReviewClientModal from "./ReviewClientModal";

import type {
  ProviderReviewStatus,
  ProviderStatus,
  StaffProvider,
} from "./types";

// ======================================================
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const fieldClass =
  "h-11 w-full rounded-xl bg-white px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 outline-none transition-shadow placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500";

const badgeClass =
  "rounded-full border px-3 py-1 text-xs font-semibold capitalize";

const compactBadgeClass =
  "whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold";

export default function StaffClients() {
  const {
    providers,
    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    reviewFilter,
    setReviewFilter,

    viewingProvider,

    reviewingProvider,

    isLoading,
    isFetching,
    isReviewing,

    openView,
    closeView,

    openReview,
    closeReview,

    submitReview,

    refetch,
  } = useStaffProviders();

  // ====================================================
  // CURRENT STAFF
  // ====================================================

  const staffQuery = useQuery({
    queryKey: ["current-staff"],

    queryFn: getCurrentStaff,
  });

  const canManage =
    staffQuery.data?.data.permissions.includes("providers:manage") ?? false;

  // ====================================================
  // SUMMARY CARDS DOUBLE AS QUICK FILTERS
  // ====================================================

  const applyFilters = (
    status: "ALL" | ProviderStatus,
    review: "ALL" | ProviderReviewStatus,
  ) => {
    setStatusFilter(status);

    setReviewFilter(review);
  };

  const isFilter = (
    status: "ALL" | ProviderStatus,
    review: "ALL" | ProviderReviewStatus,
  ) => statusFilter === status && reviewFilter === review;

  // ====================================================
  // SHARED ROW PIECES (used by mobile cards)
  // ====================================================

  const reviewLabel = (provider: StaffProvider) =>
    provider.staffReview.status === "NOT_REVIEWED" ? "Review" : "Edit Review";

  const renderBadges = (provider: StaffProvider) => (
    <>
      <span
        className={`${badgeClass} ${getProviderStatusClass(provider.status)}`}
      >
        {provider.status}
      </span>

      <span
        className={`${badgeClass} ${getReviewClass(
          provider.staffReview.status,
        )}`}
      >
        {getReviewLabel(provider.staffReview.status)}
      </span>
    </>
  );

  const renderActions = (provider: StaffProvider) => (
    <>
      {/* VIEW */}

      <button
        type="button"
        onClick={() => openView(provider.registerId)}
        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-white px-3 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:flex-none"
      >
        <Eye className="h-4 w-4" />

        View
      </button>

      {/* REVIEW */}

      {canManage && (
        <button
          type="button"
          onClick={() => openReview(provider)}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:flex-none"
        >
          {reviewLabel(provider)}
        </button>
      )}
    </>
  );

  return (
    <>
      <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 py-4 sm:space-y-6 sm:p-5 lg:px-8 lg:py-6">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
              Clients
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review registered client companies and Provider information.
            </p>
          </div>

          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refetch()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* SUMMARY (click a card to filter the list) */}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Summary
            label="Total"
            value={summary?.total ?? 0}
            accent="indigo"
            active={isFilter("ALL", "ALL")}
            onClick={() => applyFilters("ALL", "ALL")}
          />

          <Summary
            label="Active"
            value={summary?.active ?? 0}
            accent="emerald"
            active={isFilter("active", "ALL")}
            onClick={() => applyFilters("active", "ALL")}
          />

          <Summary
            label="Inactive"
            value={summary?.inactive ?? 0}
            accent="slate"
            active={isFilter("inactive", "ALL")}
            onClick={() => applyFilters("inactive", "ALL")}
          />

          <Summary
            label="Not Reviewed"
            value={summary?.notReviewed ?? 0}
            accent="amber"
            active={isFilter("ALL", "NOT_REVIEWED")}
            onClick={() => applyFilters("ALL", "NOT_REVIEWED")}
          />

          <Summary
            label="Reviewed"
            value={summary?.reviewed ?? 0}
            accent="sky"
            active={isFilter("ALL", "REVIEWED")}
            onClick={() => applyFilters("ALL", "REVIEWED")}
          />

          <Summary
            label="Needs Attention"
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
              placeholder="Search client, company, email or industry..."
              className={`${fieldClass} pl-10`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "ALL" | ProviderStatus)
            }
            className={fieldClass}
          >
            <option value="ALL">All Account Statuses</option>

            <option value="active">Active</option>

            <option value="inactive">Inactive</option>

            <option value="suspended">Suspended</option>
          </select>

          <select
            value={reviewFilter}
            onChange={(event) =>
              setReviewFilter(
                event.target.value as "ALL" | ProviderReviewStatus,
              )
            }
            className={fieldClass}
          >
            <option value="ALL">All Staff Reviews</option>

            <option value="NOT_REVIEWED">Not Reviewed</option>

            <option value="REVIEWED">Reviewed</option>

            <option value="NEEDS_ATTENTION">Needs Attention</option>
          </select>
        </div>

        {/* ================================================= */}
        {/* TABLE (wide screens) */}
        {/* ================================================= */}

        <div className="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 xl:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px]">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">ID</th>

                  <th className="px-4 py-3">Provider</th>

                  <th className="px-4 py-3">Company</th>

                  <th className="px-4 py-3">Account</th>

                  <th className="px-4 py-3">Staff Review</th>

                  <th className="px-4 py-3 text-center">Vacancies</th>

                  <th className="px-4 py-3 text-center">Applications</th>

                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {isLoading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-slate-500"
                    >
                      Loading client companies...
                    </td>
                  </tr>
                )}

                {!isLoading && providers.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-slate-500"
                    >
                      No clients found.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  providers.map((provider) => (
                    <tr
                      key={provider.registerId}
                      className="border-t border-slate-100 transition-colors hover:bg-slate-50/70"
                    >
                      <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">
                        {provider.registerId}
                      </td>

                      <td className="max-w-[240px] px-4 py-2.5">
                        <p
                          className="truncate font-semibold text-slate-950"
                          title={provider.name}
                        >
                          {provider.name}
                        </p>

                        <p
                          className="mt-0.5 truncate text-[11px] text-slate-500"
                          title={provider.email}
                        >
                          {provider.email}
                        </p>
                      </td>

                      <td className="max-w-[220px] px-4 py-2.5">
                        <p
                          className="truncate text-slate-800"
                          title={provider.companyName}
                        >
                          {provider.companyName}
                        </p>

                        {provider.industry && (
                          <p
                            className="mt-0.5 truncate text-[11px] text-slate-500"
                            title={provider.industry}
                          >
                            {provider.industry}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-2.5">
                        <span
                          className={`${compactBadgeClass} capitalize ${getProviderStatusClass(
                            provider.status,
                          )}`}
                        >
                          {provider.status}
                        </span>
                      </td>

                      <td className="px-4 py-2.5">
                        <span
                          className={`${compactBadgeClass} ${getReviewClass(
                            provider.staffReview.status,
                          )}`}
                        >
                          {getReviewLabel(provider.staffReview.status)}
                        </span>

                        {provider.staffReview.status === "NEEDS_ATTENTION" &&
                          provider.staffReview.note && (
                            <p
                              className="mt-1 max-w-[190px] truncate text-[11px] text-rose-600"
                              title={provider.staffReview.note}
                            >
                              {provider.staffReview.note}
                            </p>
                          )}
                      </td>

                      <td className="px-4 py-2.5 text-center font-semibold tabular-nums text-slate-900">
                        {provider.vacancyCount}
                      </td>

                      <td className="px-4 py-2.5 text-center font-semibold tabular-nums text-slate-900">
                        {provider.applicationCount}
                      </td>

                      <td className="px-4 py-2.5">
                        <div className="flex justify-end gap-1.5">
                          {/* VIEW */}

                          <ActionIconButton
                            label="View"
                            icon={Eye}
                            tone="neutral"
                            onClick={() => openView(provider.registerId)}
                          />

                          {/* REVIEW */}

                          {canManage && (
                            <ActionIconButton
                              label={reviewLabel(provider)}
                              icon={
                                provider.staffReview.status === "NOT_REVIEWED"
                                  ? ClipboardCheck
                                  : Pencil
                              }
                              tone="indigo"
                              onClick={() => openReview(provider)}
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
              Loading client companies...
            </div>
          )}

          {!isLoading && providers.length === 0 && (
            <div className="rounded-2xl bg-white py-14 text-center text-sm text-slate-500 ring-1 ring-inset ring-slate-200">
              No clients found.
            </div>
          )}

          {!isLoading &&
            providers.map((provider) => (
              <article
                key={provider.registerId}
                className="rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5"
              >
                <div className="min-w-0">
                  <h2 className="break-words font-semibold text-slate-950">
                    {provider.companyName}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {provider.registerId}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {renderBadges(provider)}
                </div>

                {provider.staffReview.status === "NEEDS_ATTENTION" &&
                  provider.staffReview.note && (
                    <p className="mt-3 break-words text-xs text-rose-600">
                      {provider.staffReview.note}
                    </p>
                  )}

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Provider
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {provider.name}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Email
                    </dt>

                    <dd className="mt-0.5 break-all text-slate-900">
                      {provider.email}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Industry
                    </dt>

                    <dd className="mt-0.5 break-words text-slate-900">
                      {provider.industry || "-"}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Vacancies
                    </dt>

                    <dd className="mt-0.5 font-semibold tabular-nums text-slate-900">
                      {provider.vacancyCount}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Applications
                    </dt>

                    <dd className="mt-0.5 font-semibold tabular-nums text-slate-900">
                      {provider.applicationCount}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  {renderActions(provider)}
                </div>
              </article>
            ))}
        </div>

        {!canManage && (
          <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700 ring-1 ring-inset ring-blue-200">
            Your Staff account has view-only Client access. An Admin must grant
            providers:manage before you can perform operational reviews.
          </div>
        )}
      </main>

      {/* DETAILS */}

      <ClientDetails
        provider={viewingProvider}
        canManage={canManage}
        onClose={closeView}
        onReview={(provider) => {
          closeView();

          openReview(provider);
        }}
      />

      {/* REVIEW */}

      <ReviewClientModal
        provider={reviewingProvider}
        isSaving={isReviewing}
        onClose={closeReview}
        onSubmit={submitReview}
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