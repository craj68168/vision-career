"use client";

import { useState } from "react";

import { Check, X } from "lucide-react";

import type {
  CreateStaffPayload,
  Staff,
  StaffPermission,
  StaffStatus,
  UpdateStaffPayload,
} from "./types";

type Props = {
  open: boolean;

  mode: "create" | "edit";

  staff?: Staff | null;

  permissions: StaffPermission[];

  loading: boolean;

  onClose: () => void;

  onCreate?: (payload: CreateStaffPayload) => void;

  onUpdate?: (staffId: string, payload: UpdateStaffPayload) => void;
};

const permissionLabels: Record<StaffPermission, string> = {
  "dashboard:view": "Dashboard - View",

  "vacancies:view": "Vacancies - View",

  "vacancies:review": "Vacancies - Review",

  "applications:view": "Applications - View",

  "applications:review": "Applications - Review",

  "providers:view": "Clients - View",

  "providers:manage": "Clients - Manage",

  "seekers:view": "Job Seekers - View",

  "seekers:manage": "Job Seekers - Manage",

  "placement_requests:view": "Placement Requests - View",

  "placement_requests:review": "Placement Requests - Review",

  "placement_requests:manage_candidates":
    "Placement Requests - Manage Candidates",

  "billing:view": "Billing - View",

  "billing:manage": "Billing - Manage",

  "training:view": "Training - View",

  "training:manage": "Training - Manage",
};

// ======================================================
// ROOT
// ======================================================

export default function StaffFormModal({
  open,
  mode,
  staff,
  permissions,
  loading,
  onClose,
  onCreate,
  onUpdate,
}: Props) {
  if (!open) {
    return null;
  }

  const modalKey = mode === "edit" && staff ? staff.staffId : "create";

  return (
    <StaffForm
      key={modalKey}
      mode={mode}
      staff={staff}
      permissions={permissions}
      loading={loading}
      onClose={onClose}
      onCreate={onCreate}
      onUpdate={onUpdate}
    />
  );
}

// ======================================================
// FORM
// ======================================================

function StaffForm({
  mode,
  staff,
  permissions,
  loading,
  onClose,
  onCreate,
  onUpdate,
}: Omit<Props, "open">) {
  const [name, setName] = useState(staff?.name ?? "");

  const [email, setEmail] = useState(staff?.email ?? "");

  const [phone, setPhone] = useState(staff?.phone ?? "");

  const [password, setPassword] = useState("");

  const [status, setStatus] = useState<StaffStatus>(staff?.status ?? "active");

  const [selectedPermissions, setSelectedPermissions] = useState<
    StaffPermission[]
  >(staff?.permissions ?? []);

  const [error, setError] = useState("");

  // ====================================================
  // TOGGLE PERMISSION
  // ====================================================

  const togglePermission = (permission: StaffPermission) => {
    setSelectedPermissions((current) => {
      if (current.includes(permission)) {
        return current.filter((item) => item !== permission);
      }

      return [...current, permission];
    });
  };

  // ====================================================
  // SELECT ALL
  // ====================================================

  const selectAll = () => {
    setSelectedPermissions(permissions);
  };

  const clearAll = () => {
    setSelectedPermissions([]);
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = () => {
    setError("");

    if (!name.trim()) {
      setError("Name is required.");

      return;
    }

    if (!email.trim()) {
      setError("Email is required.");

      return;
    }

    if (mode === "create" && password.length < 8) {
      setError("Password must be at least 8 characters.");

      return;
    }

    if (mode === "create") {
      onCreate?.({
        name: name.trim(),

        email: email.trim().toLowerCase(),

        phone: phone.trim(),

        password,

        status,

        permissions: selectedPermissions,
      });

      return;
    }

    if (!staff) {
      return;
    }

    onUpdate?.(staff.staffId, {
      name: name.trim(),

      email: email.trim().toLowerCase(),

      phone: phone.trim(),

      status,

      permissions: selectedPermissions,
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              Staff Management
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {mode === "create" ? "Create Staff" : "Edit Staff"}
            </h2>

            {staff && (
              <p className="mt-1 text-sm text-slate-500">{staff.staffId}</p>
            )}
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
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* BASIC INFO */}

          <section>
            <h3 className="font-semibold text-slate-950">
              Account Information
            </h3>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Name" value={name} onChange={setName} />

              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
              />

              <Field label="Phone" value={phone} onChange={setPhone} />

              {mode === "create" && (
                <Field
                  label="Initial Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                />
              )}

              <label className="block">
                <span className="text-sm font-semibold text-slate-800">
                  Status
                </span>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as StaffStatus)
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-indigo-500"
                >
                  <option value="active">Active</option>

                  <option value="inactive">Inactive</option>

                  <option value="suspended">Suspended</option>
                </select>
              </label>
            </div>
          </section>

          {/* PERMISSIONS */}

          <section>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-950">Permissions</h3>

                <p className="mt-1 text-sm text-slate-500">
                  Select which Admin functions this Staff member can use.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  Select All
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {permissions.map((permission) => {
                const selected = selectedPermissions.includes(permission);

                return (
                  <button
                    key={permission}
                    type="button"
                    onClick={() => togglePermission(permission)}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {permissionLabels[permission]}
                    </span>

                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-md ${
                        selected
                          ? "bg-indigo-600 text-white"
                          : "border border-slate-300"
                      }`}
                    >
                      {selected && <Check className="h-4 w-4" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : mode === "create"
                ? "Create Staff"
                : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// FIELD
// ======================================================

function Field({
  label,
  value,
  type = "text",
  onChange,
}: {
  label: string;

  value: string;

  type?: string;

  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-indigo-500"
      />
    </label>
  );
}
