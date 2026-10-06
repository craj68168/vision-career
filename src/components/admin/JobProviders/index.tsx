"use client";

import type { ComponentType } from "react";
import { useTranslations, useFormatter } from "next-intl";
import {
  AlertTriangle,
  Ban,
  Building2,
  CheckCircle2,
  CircleDashed,
  Edit3,
  Eye,
  PauseCircle,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { useAdminProviders } from "./hook";

import type { ProviderReviewStatus, ProviderStatus } from "./types";

import CreateModal from "./CreateModal";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import ViewModal from "./ViewModal";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

const selectClass =
  "h-9 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white";

const alertClass =
  "rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";

// Raw IDs are noisy, so show a short reference instead (full ID on hover).
const shortId = (id: string) => (id.length > 8 ? `#${id.slice(-6)}` : id);

// ======================================================
// STAFF REVIEW
// ======================================================

const reviewLabel = (status: ProviderReviewStatus) => {
  switch (status) {
    case "REVIEWED":
      return "reviewed" as const;
    case "NEEDS_ATTENTION":
      return "needsAttention" as const;
    default:
      return "notReviewed" as const;
  }
};

const reviewClass = (status: ProviderReviewStatus) => {
  switch (status) {
    case "REVIEWED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";
    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";
    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";
  }
};

// ======================================================
// ACCOUNT STATUS
// ======================================================

const statusClass = (status: ProviderStatus) => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300";
    case "suspended":
      return "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300";
    default:
      return "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300";
  }
};

// ======================================================
// MAIN
// ======================================================

export default function AdminJobProviders() {
  const t = useTranslations("adminProviders");
  const format = useFormatter();

  const {
    providers,
    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    reviewFilter,
    setReviewFilter,

    creating,
    setCreating,

    viewingProvider,

    editingProvider,

    deletingProvider,

    isLoading,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    isError,
    isDetailsError,

    openView,
    closeView,

    openEdit,
    closeEdit,

    openDelete,
    closeDelete,

    createProvider,
    updateProvider,
    deleteProvider,

    refetch,
  } = useAdminProviders();

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center sm:min-h-[500px]">
        <RefreshCw
          role="status"
          aria-label={t("loading")}
          className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400"
        />
      </div>
    );
  }

  const hasActiveFilters =
    statusFilter !== "ALL" || reviewFilter !== "ALL" || Boolean(search);

  const clearFilters = () => {
    setStatusFilter("ALL");
    setReviewFilter("ALL");
    setSearch("");
  };

  return (
    <div className="min-w-0 space-y-4">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white sm:text-2xl">
            {t("title")}
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refetch()}
            className={`inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            {t("refresh")}
          </button>

          <button
            type="button"
            onClick={() => setCreating(true)}
            className={`inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white transition hover:bg-emerald-700 sm:flex-none ${focusRing}`}
          >
            <Plus className="h-4 w-4" />
            {t("newCompany")}
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUMMARY (clickable: cards apply the matching filter) */}
      {/* ================================================= */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 2xl:grid-cols-7">
        <Summary
          label={t("total")}
          value={summary?.total || 0}
          icon={Building2}
          isActive={statusFilter === "ALL" && reviewFilter === "ALL"}
          onClick={() => {
            setStatusFilter("ALL");
            setReviewFilter("ALL");
          }}
        />

        <Summary
          label={t("active")}
          value={summary?.active || 0}
          icon={CheckCircle2}
          isActive={statusFilter === "active"}
          onClick={() => setStatusFilter("active")}
        />

        <Summary
          label={t("inactive")}
          value={summary?.inactive || 0}
          icon={PauseCircle}
          isActive={statusFilter === "inactive"}
          onClick={() => setStatusFilter("inactive")}
        />

        <Summary
          label={t("suspended")}
          value={summary?.suspended || 0}
          icon={Ban}
          isActive={statusFilter === "suspended"}
          onClick={() => setStatusFilter("suspended")}
        />

        <Summary
          label={t("notReviewed")}
          value={summary?.notReviewed || 0}
          icon={CircleDashed}
          isActive={reviewFilter === "NOT_REVIEWED"}
          onClick={() => setReviewFilter("NOT_REVIEWED")}
        />

        <Summary
          label={t("reviewed")}
          value={summary?.reviewed || 0}
          icon={ShieldCheck}
          isActive={reviewFilter === "REVIEWED"}
          onClick={() => setReviewFilter("REVIEWED")}
        />

        <Summary
          label={t("needsAttention")}
          value={summary?.needsAttention || 0}
          icon={AlertTriangle}
          isActive={reviewFilter === "NEEDS_ATTENTION"}
          onClick={() => setReviewFilter("NEEDS_ATTENTION")}
        />
      </div>

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label={t("searchLabel")}
              placeholder={t("searchPlaceholder")}
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          {/* ACCOUNT STATUS */}

          <select
            value={statusFilter}
            aria-label={t("accountStatus")}
            onChange={(event) =>
              setStatusFilter(event.target.value as "ALL" | ProviderStatus)
            }
            className={selectClass}
          >
            <option value="ALL">{t("allStatuses")}</option>
            <option value="active">{t("active")}</option>
            <option value="inactive">{t("inactive")}</option>
            <option value="suspended">{t("suspended")}</option>
          </select>

          {/* STAFF REVIEW */}

          <select
            value={reviewFilter}
            aria-label={t("staffReview")}
            onChange={(event) =>
              setReviewFilter(
                event.target.value as "ALL" | ProviderReviewStatus,
              )
            }
            className={selectClass}
          >
            <option value="ALL">{t("allReviews")}</option>
            <option value="NOT_REVIEWED">{t("notReviewed")}</option>
            <option value="REVIEWED">{t("reviewed")}</option>
            <option value="NEEDS_ATTENTION">{t("needsAttention")}</option>
          </select>
        </div>
      </div>

      {/* DETAILS LOAD ERROR */}

      {isDetailsError && (
        <div
          role="alert"
          className={`flex items-center justify-between gap-3 ${alertClass}`}
        >
          <span className="min-w-0">{t("detailsFailed")}</span>

          <button
            type="button"
            onClick={closeView}
            className={`shrink-0 cursor-pointer rounded-md font-medium underline ${focusRing}`}
          >
            {t("close")}
          </button>
        </div>
      )}

      {/* ================================================= */}
      {/* LIST */}
      {/* ================================================= */}

      {isError ? (
        <div
          role="alert"
          className={`flex items-center justify-between gap-3 ${alertClass}`}
        >
          <span className="min-w-0">{t("loadFailed")}</span>

          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refetch()}
            className={`shrink-0 cursor-pointer rounded-md font-medium underline disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
          >
            {t("retry")}
          </button>
        </div>
      ) : providers.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-12 text-center dark:border-white/10 dark:bg-zinc-900 sm:py-16">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t("empty")}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className={`mt-4 inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
            >
              {t("clearFilters")}
            </button>
          )}
        </div>
      ) : (
        <>
          {/* CARDS (below xl) */}

          <div className="grid gap-3 md:grid-cols-2 xl:hidden">
            {providers.map((provider) => (
              <article
                key={provider.registerId}
                className="flex min-w-0 flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words text-base font-semibold text-zinc-950 dark:text-white">
                      {provider.companyName}
                    </h3>

                    <p className="mt-0.5 break-words text-sm text-zinc-600 dark:text-zinc-300">
                      {provider.name}
                      {provider.phone ? ` · ${provider.phone}` : ""}
                    </p>

                    <p
                      title={provider.registerId}
                      className="mt-0.5 truncate text-xs text-zinc-400 dark:text-zinc-500"
                    >
                      {shortId(provider.registerId)}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(
                      provider.status,
                    )}`}
                  >
                    {t(provider.status)}
                  </span>
                </div>

                <dl className="mt-3 grid grid-cols-3 gap-x-4 gap-y-2.5 rounded-md bg-zinc-50 p-3 dark:bg-white/5">
                  <CardField label={t("industry")} value={provider.industry} />

                  <CardField
                    label={t("vacancies")}
                    value={format.number(provider.vacancyCount)}
                  />

                  <CardField
                    label={t("applications")}
                    value={format.number(provider.applicationCount)}
                  />

                  <div className="col-span-3">
                    <CardField label={t("email")} value={provider.email} />
                  </div>
                </dl>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t("staffReview")}
                  </span>

                  <span
                    className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium ${reviewClass(
                      provider.staffReview.status,
                    )}`}
                  >
                    {t(reviewLabel(provider.staffReview.status))}
                  </span>
                </div>

                {provider.staffReview.status === "NEEDS_ATTENTION" &&
                  provider.staffReview.note && (
                    <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 dark:border-red-400/20 dark:bg-red-400/10">
                      <p className="line-clamp-2 break-words text-sm text-red-600 dark:text-red-300/90">
                        {provider.staffReview.note}
                      </p>
                    </div>
                  )}

                <div className="mt-auto flex flex-wrap justify-end gap-2 pt-3">
                  <ProviderActions
                    onView={() => openView(provider.registerId)}
                    onEdit={() => openEdit(provider)}
                    onDelete={() => openDelete(provider)}
                  />
                </div>
              </article>
            ))}
          </div>

          {/* TABLE (xl and up) */}

          <div className="hidden overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900 xl:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-zinc-50 text-xs text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">{t("company")}</th>
                    <th className="px-4 py-2.5 font-medium">{t("provider")}</th>
                    <th className="px-4 py-2.5 font-medium">{t("email")}</th>
                    <th className="px-4 py-2.5 font-medium">{t("account")}</th>
                    <th className="px-4 py-2.5 font-medium">
                      {t("staffReview")}
                    </th>
                    <th className="px-4 py-2.5 text-center font-medium">
                      {t("vacancies")}
                    </th>
                    <th className="px-4 py-2.5 text-center font-medium">
                      {t("applications")}
                    </th>
                    <th className="px-4 py-2.5 text-right font-medium">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                  {providers.map((provider) => (
                    <tr
                      key={provider.registerId}
                      className="transition hover:bg-zinc-50 dark:hover:bg-white/5"
                    >
                      {/* COMPANY */}

                      <td className="px-4 py-2.5">
                        <p className="font-medium text-zinc-950 dark:text-white">
                          {provider.companyName}
                        </p>

                        <p
                          title={provider.registerId}
                          className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400"
                        >
                          {provider.industry
                            ? `${provider.industry} · ${shortId(provider.registerId)}`
                            : shortId(provider.registerId)}
                        </p>
                      </td>

                      {/* PROVIDER */}

                      <td className="px-4 py-2.5">
                        <p className="text-sm text-zinc-900 dark:text-zinc-100">
                          {provider.name}
                        </p>

                        {provider.phone && (
                          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                            {provider.phone}
                          </p>
                        )}
                      </td>

                      {/* EMAIL */}

                      <td className="break-all px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                        {provider.email}
                      </td>

                      {/* ACCOUNT */}

                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(
                            provider.status,
                          )}`}
                        >
                          {t(provider.status)}
                        </span>
                      </td>

                      {/* STAFF REVIEW */}

                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${reviewClass(
                            provider.staffReview.status,
                          )}`}
                        >
                          {t(reviewLabel(provider.staffReview.status))}
                        </span>

                        {provider.staffReview.status === "NEEDS_ATTENTION" &&
                          provider.staffReview.note && (
                            <p
                              title={provider.staffReview.note}
                              className="mt-1 max-w-[190px] truncate text-xs text-red-500 dark:text-red-300"
                            >
                              {provider.staffReview.note}
                            </p>
                          )}
                      </td>

                      {/* VACANCIES */}

                      <td className="px-4 py-2.5 text-center text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {format.number(provider.vacancyCount)}
                      </td>

                      {/* APPLICATIONS */}

                      <td className="px-4 py-2.5 text-center text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {format.number(provider.applicationCount)}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-4 py-2.5">
                        <div className="flex justify-end gap-1.5">
                          <ProviderActions
                            compact
                            onView={() => openView(provider.registerId)}
                            onEdit={() => openEdit(provider)}
                            onDelete={() => openDelete(provider)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ================================================= */}
      {/* MODALS */}
      {/* ================================================= */}

      {creating && (
        <CreateModal
          isSubmitting={isCreating}
          onClose={() => setCreating(false)}
          onSubmit={createProvider}
        />
      )}

      {viewingProvider && (
        <ViewModal provider={viewingProvider} onClose={closeView} />
      )}

      {editingProvider && (
        <EditModal
          key={editingProvider.registerId}
          provider={editingProvider}
          isSubmitting={isUpdating}
          onClose={closeEdit}
          onSubmit={updateProvider}
        />
      )}

      {deletingProvider && (
        <DeleteModal
          provider={deletingProvider}
          isDeleting={isDeleting}
          onClose={closeDelete}
          onDelete={deleteProvider}
        />
      )}
    </div>
  );
}

// ======================================================
// ACTIONS
// ======================================================

function ProviderActions({
  compact = false,
  onView,
  onEdit,
  onDelete,
}: {
  compact?: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("adminProviders");

  const base = compact
    ? "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition"
    : "inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition sm:flex-none";

  const neutral =
    "border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10";

  const danger =
    "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10";

  return (
    <>
      <button
        type="button"
        onClick={onView}
        aria-label={t("view")}
        title={t("view")}
        className={`${base} ${neutral} ${focusRing}`}
      >
        <Eye className="h-4 w-4" />
        {!compact && t("view")}
      </button>

      <button
        type="button"
        onClick={onEdit}
        aria-label={t("edit")}
        title={t("edit")}
        className={`${base} ${neutral} ${focusRing}`}
      >
        <Edit3 className="h-4 w-4" />
        {!compact && t("edit")}
      </button>

      <button
        type="button"
        onClick={onDelete}
        aria-label={t("delete")}
        title={t("delete")}
        className={`${base} ${danger} ${focusRing}`}
      >
        <Trash2 className="h-4 w-4" />
        {!compact && t("delete")}
      </button>
    </>
  );
}

// ======================================================
// CARD FIELD
// ======================================================

function CardField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>

      <dd className="mt-0.5 break-words text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {value || "-"}
      </dd>
    </div>
  );
}

// ======================================================
// SUMMARY
// ======================================================

function Summary({
  label,
  value,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string;
  value: number;
  icon: ComponentType<{
    className?: string;
  }>;
  isActive: boolean;
  onClick: () => void;
}) {
  const format = useFormatter();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`min-w-0 cursor-pointer rounded-lg border bg-white p-3 text-left shadow-sm transition hover:border-emerald-500/50 hover:shadow-md dark:bg-zinc-900 ${focusRing} ${
        isActive
          ? "border-emerald-500 ring-2 ring-emerald-500/20"
          : "border-zinc-200 dark:border-white/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </p>

          <p className="mt-0.5 text-xl font-semibold leading-tight text-zinc-950 dark:text-white">
            {format.number(value)}
          </p>
        </div>
      </div>
    </button>
  );
}