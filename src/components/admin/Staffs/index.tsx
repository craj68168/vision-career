"use client";

import { Eye, KeyRound, Pencil, Plus, RefreshCw, Search } from "lucide-react";

import StaffDetailsModal from "./StaffDetailsModal";
import StaffFormModal from "./StaffFormModal";
import ResetPasswordModal from "./ResetPasswordModal";

import { useStaffHook } from "./hook";

import type { StaffStatus } from "./types";

// ======================================================
// STAFF PAGE
// ======================================================

export default function StaffPage() {
  const {
    staff,
    summary,
    permissionOptions,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    viewingStaff,
    setViewingStaff,

    editingStaff,
    setEditingStaff,

    createModalOpen,
    setCreateModalOpen,

    resetPasswordStaff,
    setResetPasswordStaff,

    isLoading,
    isFetching,
    isSaving,

    refresh,

    submitCreateStaff,
    submitUpdateStaff,
    submitResetPassword,
  } = useStaffHook();

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-10">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">Staff</h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage internal Staff accounts, permissions and account status.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={isFetching}
              onClick={() => void refresh()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              New Staff
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* SUMMARY */}
        {/* ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total Staff" value={summary?.total ?? 0} />

          <SummaryCard label="Active" value={summary?.active ?? 0} />

          <SummaryCard label="Inactive" value={summary?.inactive ?? 0} />

          <SummaryCard label="Suspended" value={summary?.suspended ?? 0} />
        </div>

        {/* ================================================= */}
        {/* FILTERS */}
        {/* ================================================= */}

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search staff name, email or ID..."
              className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "ALL" | StaffStatus)
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 outline-none"
          >
            <option value="ALL">All Statuses</option>

            <option value="active">Active</option>

            <option value="inactive">Inactive</option>

            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* ================================================= */}
        {/* TABLE */}
        {/* ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Staff ID</th>

                  <th className="px-5 py-4">Name</th>

                  <th className="px-5 py-4">Email</th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4">Permissions</th>

                  <th className="px-5 py-4">Last Login</th>

                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-20 text-center text-slate-500"
                    >
                      Loading Staff...
                    </td>
                  </tr>
                )}

                {!isLoading && staff.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-20 text-center text-slate-500"
                    >
                      No Staff accounts found.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  staff.map((item) => (
                    <tr
                      key={item.staffId}
                      className="border-t border-slate-100"
                    >
                      <td className="px-5 py-4 font-medium">{item.staffId}</td>

                      <td className="px-5 py-4">
                        <p className="font-semibold">{item.name}</p>

                        <p className="mt-1 text-xs text-slate-400">Staff</p>
                      </td>

                      <td className="px-5 py-4">{item.email}</td>

                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                          {item.permissions.length} permission(s)
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {item.lastLoginAt
                          ? new Date(item.lastLoginAt).toLocaleString()
                          : "Never"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingStaff(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingStaff(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-sm text-white"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => setResetPasswordStaff(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          >
                            <KeyRound className="h-4 w-4" />
                            Password
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* CREATE */}
      {/* ================================================= */}

      <StaffFormModal
        open={createModalOpen}
        mode="create"
        permissions={permissionOptions}
        loading={isSaving}
        onClose={() => setCreateModalOpen(false)}
        onCreate={submitCreateStaff}
      />

      {/* ================================================= */}
      {/* EDIT */}
      {/* ================================================= */}

      <StaffFormModal
        open={Boolean(editingStaff)}
        mode="edit"
        staff={editingStaff}
        permissions={permissionOptions}
        loading={isSaving}
        onClose={() => setEditingStaff(null)}
        onUpdate={submitUpdateStaff}
      />

      {/* ================================================= */}
      {/* DETAILS */}
      {/* ================================================= */}

      <StaffDetailsModal
        staff={viewingStaff}
        onClose={() => setViewingStaff(null)}
        onEdit={(selectedStaff) => {
          setViewingStaff(null);

          setEditingStaff(selectedStaff);
        }}
        onResetPassword={(selectedStaff) => {
          setViewingStaff(null);

          setResetPasswordStaff(selectedStaff);
        }}
      />

      {/* ================================================= */}
      {/* RESET PASSWORD */}
      {/* ================================================= */}

      <ResetPasswordModal
        staff={resetPasswordStaff}
        loading={isSaving}
        onClose={() => setResetPasswordStaff(null)}
        onSubmit={submitResetPassword}
      />
    </>
  );
}

// ======================================================
// SUMMARY CARD
// ======================================================

function SummaryCard({
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

// ======================================================
// STATUS
// ======================================================

function StatusBadge({ status }: { status: StaffStatus }) {
  const styles: Record<StaffStatus, string> = {
    active: "bg-emerald-50 text-emerald-700",

    inactive: "bg-slate-100 text-slate-600",

    suspended: "bg-red-50 text-red-600",
  };

  const labels: Record<StaffStatus, string> = {
    active: "Active",

    inactive: "Inactive",

    suspended: "Suspended",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
