"use client";

import {
  Building2,
  Edit3,
  Eye,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from "lucide-react";

import { useAdminProviders } from "./hook";

import type { ProviderStatus } from "./types";

import CreateModal from "./CreateModal";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import ViewModal from "./ViewModal";

export default function AdminJobProviders() {
  const {
    providers,
    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Client Companies</h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage registered Job Providers.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => void refetch()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border bg-white px-4 py-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          <button
            onClick={() => setCreating(true)}
            className="cursor-pointer rounded-xl bg-slate-950 px-4 py-2 font-semibold text-white"
          >
            + New Company
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Summary label="Total Companies" value={summary?.total || 0} />

        <Summary label="Active" value={summary?.active || 0} />

        <Summary label="Inactive" value={summary?.inactive || 0} />

        <Summary label="Suspended" value={summary?.suspended || 0} />
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search provider name, email or company..."
              className="w-full rounded-xl border py-3 pl-11 pr-4 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "ALL" | ProviderStatus)
            }
            className="rounded-xl border px-4"
          >
            <option value="ALL">All Statuses</option>

            <option value="active">Active</option>

            <option value="inactive">Inactive</option>

            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">ID</th>

                <th className="px-5 py-4">Provider</th>

                <th className="px-5 py-4">Company</th>

                <th className="px-5 py-4">Email</th>

                <th className="px-5 py-4">Status</th>

                <th className="px-5 py-4 text-center">Vacancies</th>

                <th className="px-5 py-4 text-center">Applications</th>

                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {providers.map((provider) => (
                <tr key={provider.registerId} className="border-t">
                  <td className="px-5 py-4 text-sm text-slate-500">
                    {provider.registerId}
                  </td>

                  <td className="px-5 py-4 font-semibold">{provider.name}</td>

                  <td className="px-5 py-4">{provider.companyName}</td>

                  <td className="px-5 py-4 text-sm">{provider.email}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        provider.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : provider.status === "suspended"
                            ? "bg-red-50 text-red-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {provider.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    {provider.vacancyCount}
                  </td>

                  <td className="px-5 py-4 text-center">
                    {provider.applicationCount}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openView(provider.registerId)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-2 text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>

                      <button
                        onClick={() => openEdit(provider)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-2 text-sm"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>

                      <button
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

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
