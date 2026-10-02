"use client";

import { Edit3, Eye, Plus, RefreshCw, Search, Trash2 } from "lucide-react";

import { useAdminProviders } from "./hook";

import type { ProviderReviewStatus, ProviderStatus } from "./types";

import CreateModal from "./CreateModal";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import ViewModal from "./ViewModal";

type Provider = ReturnType<typeof useAdminProviders>["providers"][number];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

const selectClass =
  "h-10 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white";

// ======================================================
// STAFF REVIEW
// ======================================================

const reviewLabel = (status: ProviderReviewStatus) => {
  switch (status) {
    case "REVIEWED":
      return "Reviewed";

    case "NEEDS_ATTENTION":
      return "Needs Attention";

    default:
      return "Not Reviewed";
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
          aria-label="Loading"
          className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400"
        />
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white sm:text-2xl">
            Client Companies
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            View Staff operational reviews and manage registered Job Providers.
          </p>
        </div>

        <div className="flex shrink-0 gap-2 sm:gap-3">
          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refetch()}
            className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setCreating(true)}
            className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 sm:flex-none ${focusRing}`}
          >
            <Plus className="h-4 w-4" />
            New Company
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 2xl:grid-cols-7">
        <Summary label="Total" value={summary?.total || 0} />

        <Summary label="Active" value={summary?.active || 0} />

        <Summary label="Inactive" value={summary?.inactive || 0} />

        <Summary label="Suspended" value={summary?.suspended || 0} />

        <Summary label="Not Reviewed" value={summary?.notReviewed || 0} />

        <Summary label="Reviewed" value={summary?.reviewed || 0} />

        <Summary label="Needs Attention" value={summary?.needsAttention || 0} />
      </div>

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search providers"
              placeholder="Search provider, email, company or industry..."
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          {/* ACCOUNT STATUS */}

          <select
            value={statusFilter}
            aria-label="Account status"
            onChange={(event) =>
              setStatusFilter(event.target.value as "ALL" | ProviderStatus)
            }
            className={selectClass}
          >
            <option value="ALL">All Account Statuses</option>

            <option value="active">Active</option>

            <option value="inactive">Inactive</option>

            <option value="suspended">Suspended</option>
          </select>

          {/* STAFF REVIEW */}

          <select
            value={reviewFilter}
            aria-label="Staff review"
            onChange={(event) =>
              setReviewFilter(
                event.target.value as "ALL" | ProviderReviewStatus,
              )
            }
            className={selectClass}
          >
            <option value="ALL">All Staff Reviews</option>

            <option value="NOT_REVIEWED">Not Reviewed</option>

            <option value="REVIEWED">Reviewed</option>

            <option value="NEEDS_ATTENTION">Needs Attention</option>
          </select>
        </div>
      </div>

      {/* ================================================= */}
      {/* LIST */}
      {/* ================================================= */}

      {providers.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-16 text-center text-zinc-500 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 sm:py-20">
          No Providers found.
        </div>
      ) : (
        <>
          {/* CARDS (below xl) */}

          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:hidden">
            {providers.map((provider) => (
              <article
                key={provider.registerId}
                className="flex min-w-0 flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {provider.registerId}
                    </p>

                    <h3 className="mt-1 break-words text-lg font-semibold text-zinc-950 dark:text-white">
                      {provider.name}
                    </h3>

                    {provider.phone && (
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {provider.phone}
                      </p>
                    )}
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${statusClass(
                      provider.status,
                    )}`}
                  >
                    {provider.status}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <CardField label="Company" value={provider.companyName} />

                  <CardField label="Industry" value={provider.industry} />

                  <div className="sm:col-span-2">
                    <CardField label="Email" value={provider.email} />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-white/5">
                  <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Staff Review
                  </span>

                  <span
                    className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${reviewClass(
                      provider.staffReview.status,
                    )}`}
                  >
                    {reviewLabel(provider.staffReview.status)}
                  </span>
                </div>

                {provider.staffReview.status === "NEEDS_ATTENTION" &&
                  provider.staffReview.note && (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-400/20 dark:bg-red-400/10">
                      <p className="line-clamp-2 break-words text-sm text-red-600 dark:text-red-300/90">
                        {provider.staffReview.note}
                      </p>
                    </div>
                  )}

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <CardField
                    label="Vacancies"
                    value={String(provider.vacancyCount)}
                  />

                  <CardField
                    label="Applications"
                    value={String(provider.applicationCount)}
                  />
                </div>

                <div className="mt-auto pt-5">
                  <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-white/10">
                    <ProviderActions
                      onView={() => openView(provider.registerId)}
                      onEdit={() => openEdit(provider)}
                      onDelete={() => openDelete(provider)}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* TABLE (xl and up) */}

          <div className="hidden overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900 xl:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>

                    <th className="px-4 py-3 font-medium">Provider</th>

                    <th className="px-4 py-3 font-medium">Company</th>

                    <th className="px-4 py-3 font-medium">Email</th>

                    <th className="px-4 py-3 font-medium">Account</th>

                    <th className="px-4 py-3 font-medium">Staff Review</th>

                    <th className="px-4 py-3 text-center font-medium">
                      Vacancies
                    </th>

                    <th className="px-4 py-3 text-center font-medium">
                      Applications
                    </th>

                    <th className="px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                  {providers.map((provider) => (
                    <tr
                      key={provider.registerId}
                      className="transition hover:bg-zinc-50 dark:hover:bg-white/5"
                    >
                      {/* ID */}

                      <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                        {provider.registerId}
                      </td>

                      {/* PROVIDER */}

                      <td className="px-4 py-3">
                        <p className="font-medium text-zinc-950 dark:text-white">
                          {provider.name}
                        </p>

                        {provider.phone && (
                          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            {provider.phone}
                          </p>
                        )}
                      </td>

                      {/* COMPANY */}

                      <td className="px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100">
                        <p>{provider.companyName}</p>

                        {provider.industry && (
                          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            {provider.industry}
                          </p>
                        )}
                      </td>

                      {/* EMAIL */}

                      <td className="break-all px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                        {provider.email}
                      </td>

                      {/* ACCOUNT */}

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${statusClass(
                            provider.status,
                          )}`}
                        >
                          {provider.status}
                        </span>
                      </td>

                      {/* STAFF REVIEW */}

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${reviewClass(
                            provider.staffReview.status,
                          )}`}
                        >
                          {reviewLabel(provider.staffReview.status)}
                        </span>

                        {provider.staffReview.status === "NEEDS_ATTENTION" &&
                          provider.staffReview.note && (
                            <p className="mt-1 max-w-[190px] truncate text-xs text-red-500 dark:text-red-300">
                              {provider.staffReview.note}
                            </p>
                          )}
                      </td>

                      {/* VACANCIES */}

                      <td className="px-4 py-3 text-center text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {provider.vacancyCount}
                      </td>

                      {/* APPLICATIONS */}

                      <td className="px-4 py-3 text-center text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {provider.applicationCount}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-4 py-3">
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
  const base = compact
    ? "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition"
    : "inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition sm:flex-none";

  const neutral =
    "border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10";

  const danger =
    "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10";

  return (
    <>
      <button
        type="button"
        onClick={onView}
        aria-label="View"
        title="View"
        className={`${base} ${neutral} ${focusRing}`}
      >
        <Eye className="h-4 w-4" />
        {!compact && "View"}
      </button>

      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit"
        title="Edit"
        className={`${base} ${neutral} ${focusRing}`}
      >
        <Edit3 className="h-4 w-4" />
        {!compact && "Edit"}
      </button>

      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete"
        title="Delete"
        className={`${base} ${danger} ${focusRing}`}
      >
        <Trash2 className="h-4 w-4" />
        {!compact && "Delete"}
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
    <div className="min-w-0 rounded-lg bg-zinc-50 p-3 dark:bg-white/5">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {value || "-"}
      </p>
    </div>
  );
}

// ======================================================
// SUMMARY
// ======================================================

function Summary({
  label,
  value,
}: {
  label: string;

  value: number;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-5">
      <p className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}