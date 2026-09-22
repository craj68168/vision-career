"use client";

import { Edit3, Eye, Plus, RefreshCw, Search, Trash2 } from "lucide-react";

import { useAdminProviders } from "./hook";

import type { ProviderReviewStatus, ProviderStatus } from "./types";

import CreateModal from "./CreateModal";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import ViewModal from "./ViewModal";

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
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
  }
};

// ======================================================
// ACCOUNT STATUS
// ======================================================

const statusClass = (status: ProviderStatus) => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700";

    case "suspended":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
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
      <div className="flex min-h-[500px] items-center justify-center">
        <RefreshCw className="h-9 w-9 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Client Companies</h1>

          <p className="mt-1 text-sm text-slate-500">
            View Staff operational reviews and manage registered Job Providers.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            New Company
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
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

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search provider, email, company or industry..."
              className="h-12 w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none"
            />
          </div>

          {/* ACCOUNT STATUS */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "ALL" | ProviderStatus)
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4"
          >
            <option value="ALL">All Account Statuses</option>

            <option value="active">Active</option>

            <option value="inactive">Inactive</option>

            <option value="suspended">Suspended</option>
          </select>

          {/* STAFF REVIEW */}

          <select
            value={reviewFilter}
            onChange={(event) =>
              setReviewFilter(
                event.target.value as "ALL" | ProviderReviewStatus,
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4"
          >
            <option value="ALL">All Staff Reviews</option>

            <option value="NOT_REVIEWED">Not Reviewed</option>

            <option value="REVIEWED">Reviewed</option>

            <option value="NEEDS_ATTENTION">Needs Attention</option>
          </select>
        </div>
      </div>

      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px]">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">ID</th>

                <th className="px-5 py-4">Provider</th>

                <th className="px-5 py-4">Company</th>

                <th className="px-5 py-4">Email</th>

                <th className="px-5 py-4">Account</th>

                <th className="px-5 py-4">Staff Review</th>

                <th className="px-5 py-4 text-center">Vacancies</th>

                <th className="px-5 py-4 text-center">Applications</th>

                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {providers.map((provider) => (
                <tr
                  key={provider.registerId}
                  className="border-t border-slate-100 transition hover:bg-slate-50"
                >
                  {/* ID */}

                  <td className="px-5 py-4 text-sm text-slate-500">
                    {provider.registerId}
                  </td>

                  {/* PROVIDER */}

                  <td className="px-5 py-4">
                    <p className="font-semibold">{provider.name}</p>

                    {provider.phone && (
                      <p className="mt-1 text-xs text-slate-500">
                        {provider.phone}
                      </p>
                    )}
                  </td>

                  {/* COMPANY */}

                  <td className="px-5 py-4">
                    <p>{provider.companyName}</p>

                    {provider.industry && (
                      <p className="mt-1 text-xs text-slate-500">
                        {provider.industry}
                      </p>
                    )}
                  </td>

                  {/* EMAIL */}

                  <td className="px-5 py-4 text-sm">{provider.email}</td>

                  {/* ACCOUNT */}

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(
                        provider.status,
                      )}`}
                    >
                      {provider.status}
                    </span>
                  </td>

                  {/* STAFF REVIEW */}

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${reviewClass(
                        provider.staffReview.status,
                      )}`}
                    >
                      {reviewLabel(provider.staffReview.status)}
                    </span>

                    {provider.staffReview.status === "NEEDS_ATTENTION" &&
                      provider.staffReview.note && (
                        <p className="mt-1 max-w-[190px] truncate text-xs text-red-500">
                          {provider.staffReview.note}
                        </p>
                      )}
                  </td>

                  {/* VACANCIES */}

                  <td className="px-5 py-4 text-center font-semibold">
                    {provider.vacancyCount}
                  </td>

                  {/* APPLICATIONS */}

                  <td className="px-5 py-4 text-center font-semibold">
                    {provider.applicationCount}
                  </td>

                  {/* ACTIONS */}

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openView(provider.registerId)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => openEdit(provider)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => openDelete(provider)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {providers.length === 0 && (
          <div className="py-16 text-center text-slate-500">
            No Providers found.
          </div>
        )}
      </div>

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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
