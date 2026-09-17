"use client";

import { KeyRound, Pencil, X } from "lucide-react";

import type { Staff } from "./types";

type Props = {
  staff: Staff | null;

  onClose: () => void;

  onEdit: (staff: Staff) => void;

  onResetPassword: (staff: Staff) => void;
};

export default function StaffDetailsModal({
  staff,
  onClose,
  onEdit,
  onResetPassword,
}: Props) {
  if (!staff) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              Staff Account
            </p>

            <h2 className="mt-1 text-2xl font-bold">{staff.name}</h2>

            <p className="mt-1 text-sm text-slate-500">{staff.staffId}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}

        <div className="space-y-6 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="Email" value={staff.email} />

            <Info label="Phone" value={staff.phone || "-"} />

            <Info label="Status" value={staff.status} />

            <Info label="Role" value={staff.role} />

            <Info label="Created By" value={staff.createdByAdminId} />

            <Info
              label="Last Login"
              value={
                staff.lastLoginAt
                  ? new Date(staff.lastLoginAt).toLocaleString()
                  : "Never"
              }
            />
          </div>

          <div>
            <h3 className="font-semibold">Permissions</h3>

            {staff.permissions.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No permissions assigned.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {staff.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            onClick={() => onResetPassword(staff)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5"
          >
            <KeyRound className="h-4 w-4" />
            Reset Password
          </button>

          <button
            type="button"
            onClick={() => onEdit(staff)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 font-semibold text-white"
          >
            <Pencil className="h-4 w-4" />
            Edit Staff
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// INFO
// ======================================================

function Info({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 break-words font-semibold text-slate-950">{value}</p>
    </div>
  );
}
