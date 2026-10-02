"use client";

import {
  Eye,
  KeyRound,
  Pencil,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import StaffDetailsModal from "./StaffDetailsModal";
import StaffFormModal from "./StaffFormModal";
import ResetPasswordModal from "./ResetPasswordModal";

import { useStaffHook } from "./hook";

import type { StaffStatus } from "./types";

type StaffItem = ReturnType<typeof useStaffHook>["staff"][number];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

const formatLastLogin = (value?: string | null) =>
  value ? new Date(value).toLocaleString() : "Never";

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
      <div className="min-w-0 space-y-6">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-zinc-950 dark:text-white sm:text-2xl">
              Staff
            </h2>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Manage internal Staff accounts, permissions and account status.
            </p>
          </div>

          <div className="flex shrink-0 gap-2 sm:gap-3">
            <button
              type="button"
              disabled={isFetching}
              onClick={() => void refresh()}
              className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 sm:flex-none ${focusRing}`}
            >
              <Plus className="h-4 w-4" />
              New Staff
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* SUMMARY */}
        {/* ================================================= */}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <SummaryCard label="Total Staff" value={summary?.total ?? 0} />

          <SummaryCard label="Active" value={summary?.active ?? 0} />

          <SummaryCard label="Inactive" value={summary?.inactive ?? 0} />

          <SummaryCard label="Suspended" value={summary?.suspended ?? 0} />
        </div>

        {/* ================================================= */}
        {/* FILTERS */}
        {/* ================================================= */}

        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search staff"
                placeholder="Search staff name, email or ID..."
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>

            <select
              value={statusFilter}
              aria-label="Status"
              onChange={(event) =>
                setStatusFilter(event.target.value as "ALL" | StaffStatus)
              }
              className="h-10 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
            >
              <option value="ALL">All Statuses</option>

              <option value="active">Active</option>

              <option value="inactive">Inactive</option>

              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* ================================================= */}
        {/* LIST */}
        {/* ================================================= */}

        {isLoading ? (
          <div
            role="status"
            className="rounded-lg border border-zinc-200 bg-white px-4 py-16 text-center text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 sm:py-20"
          >
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />

            <p className="mt-3">Loading Staff...</p>
          </div>
        ) : staff.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white px-4 py-16 text-center text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 sm:py-20">
            No Staff accounts found.
          </div>
        ) : (
          <>
            {/* CARDS (below xl) */}

            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:hidden">
              {staff.map((item) => (
                <article
                  key={item.staffId}
                  className="flex min-w-0 flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        {item.staffId}
                      </p>

                      <h3 className="mt-1 break-words text-lg font-semibold text-zinc-950 dark:text-white">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                        Staff
                      </p>
                    </div>

                    <StatusBadge status={item.status} />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <CardField label="Email" value={item.email} />
                    </div>

                    <CardField
                      label="Permissions"
                      value={`${item.permissions.length} permission(s)`}
                    />

                    <CardField
                      label="Last Login"
                      value={formatLastLogin(item.lastLoginAt)}
                    />
                  </div>

                  <div className="mt-auto pt-5">
                    <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-white/10">
                      <StaffActions
                        onView={() => setViewingStaff(item)}
                        onEdit={() => setEditingStaff(item)}
                        onPassword={() => setResetPasswordStaff(item)}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* TABLE (xl and up) */}

            <div className="hidden overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900 xl:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Staff ID</th>

                      <th className="px-4 py-3 font-medium">Name</th>

                      <th className="px-4 py-3 font-medium">Email</th>

                      <th className="px-4 py-3 font-medium">Status</th>

                      <th className="px-4 py-3 font-medium">Permissions</th>

                      <th className="px-4 py-3 font-medium">Last Login</th>

                      <th className="px-4 py-3 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                    {staff.map((item) => (
                      <tr
                        key={item.staffId}
                        className="transition hover:bg-zinc-50 dark:hover:bg-white/5"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                          {item.staffId}
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-medium text-zinc-950 dark:text-white">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                            Staff
                          </p>
                        </td>

                        <td className="break-all px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                          {item.email}
                        </td>

                        <td className="px-4 py-3">
                          <StatusBadge status={item.status} />
                        </td>

                        <td className="px-4 py-3">
                          <span className="inline-flex whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                            {item.permissions.length} permission(s)
                          </span>
                        </td>

                        <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                          {formatLastLogin(item.lastLoginAt)}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <StaffActions
                              compact
                              onView={() => setViewingStaff(item)}
                              onEdit={() => setEditingStaff(item)}
                              onPassword={() => setResetPasswordStaff(item)}
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
// ACTIONS
// ======================================================

function StaffActions({
  compact = false,
  onView,
  onEdit,
  onPassword,
}: {
  compact?: boolean;
  onView: () => void;
  onEdit: () => void;
  onPassword: () => void;
}) {
  const base = compact
    ? "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition"
    : "inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition sm:flex-none";

  const neutral =
    "border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10";

  const primary =
    "border-emerald-600 bg-emerald-600 text-white hover:border-emerald-700 hover:bg-emerald-700";

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
        className={`${base} ${primary} ${focusRing}`}
      >
        <Pencil className="h-4 w-4" />
        {!compact && "Edit"}
      </button>

      <button
        type="button"
        onClick={onPassword}
        aria-label="Reset password"
        title="Reset password"
        className={`${base} ${neutral} ${focusRing}`}
      >
        <KeyRound className="h-4 w-4" />
        {!compact && "Password"}
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

// ======================================================
// STATUS
// ======================================================

function StatusBadge({ status }: { status: StaffStatus }) {
  const styles: Record<StaffStatus, string> = {
    active:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",

    inactive: "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300",

    suspended: "bg-red-50 text-red-600 dark:bg-red-400/10 dark:text-red-300",
  };

  const labels: Record<StaffStatus, string> = {
    active: "Active",

    inactive: "Inactive",

    suspended: "Suspended",
  };

  return (
    <span
      className={`inline-flex shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}