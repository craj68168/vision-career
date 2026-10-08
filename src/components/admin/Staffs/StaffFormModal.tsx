"use client";

import { useState } from "react";

import { Check, X } from "lucide-react";

import { useTranslations } from "next-intl";

import type {
  CreateStaffPayload,
  Staff,
  StaffPermission,
  StaffStatus,
  UpdateStaffPayload,
} from "./types";

// ======================================================
// PROPS
// ======================================================

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

// ======================================================
// PERMISSION DEPENDENCIES
//
// Selecting an action permission automatically adds
// the related View permission.
// ======================================================

const PERMISSION_DEPENDENCIES: Partial<
  Record<StaffPermission, StaffPermission[]>
> = {
  // Vacancies
  "vacancies:review": ["vacancies:view"],

  "vacancies:approval": ["vacancies:view"],

  // Applications
  "applications:review": ["applications:view"],

  "applications:approval": ["applications:view"],

  // Interviews
  "interviews:manage": ["interviews:view"],

  // Providers / Clients
  "providers:manage": ["providers:view"],

  // Job Seekers
  "seekers:manage": ["seekers:view"],

  "seekers:approval": ["seekers:view"],

  // Placement Requests
  "placement_requests:review": ["placement_requests:view"],

  "placement_requests:approval": ["placement_requests:view"],

  "placement_requests:manage_candidates": ["placement_requests:view"],

  // Billing
  "billing:manage": ["billing:view"],
};

// ======================================================
// ADD PERMISSION + DEPENDENCIES
//
// Supports future multi-level dependencies.
// ======================================================

const addPermissionWithDependencies = (
  current: StaffPermission[],
  permission: StaffPermission,
) => {
  const next = new Set<StaffPermission>(current);

  const queue: StaffPermission[] = [permission];

  while (queue.length > 0) {
    const currentPermission = queue.shift();

    if (!currentPermission) {
      continue;
    }

    if (!next.has(currentPermission)) {
      next.add(currentPermission);
    }

    const dependencies = PERMISSION_DEPENDENCIES[currentPermission] || [];

    dependencies.forEach((dependency) => {
      if (!next.has(dependency)) {
        next.add(dependency);

        queue.push(dependency);
      }
    });
  }

  return Array.from(next);
};

// ======================================================
// REMOVE PERMISSION + DEPENDENT ACTIONS
//
// Example:
//
// Current:
//
// vacancies:view
// vacancies:review
// vacancies:approval
//
// Admin removes:
//
// vacancies:view
//
// Result:
//
// all three are removed.
//
// This prevents impossible permission combinations.
// ======================================================

const removePermissionAndDependents = (
  current: StaffPermission[],
  permission: StaffPermission,
) => {
  const toRemove = new Set<StaffPermission>([permission]);

  let changed = true;

  while (changed) {
    changed = false;

    current.forEach((candidate) => {
      if (toRemove.has(candidate)) {
        return;
      }

      const dependencies = PERMISSION_DEPENDENCIES[candidate] || [];

      const dependsOnRemovedPermission = dependencies.some((dependency) =>
        toRemove.has(dependency),
      );

      if (dependsOnRemovedPermission) {
        toRemove.add(candidate);

        changed = true;
      }
    });
  }

  return current.filter((item) => !toRemove.has(item));
};

// ======================================================
// NORMALIZE PERMISSION LIST
//
// Used when editing older Staff records.
//
// Example legacy record:
//
// vacancies:review
//
// UI becomes:
//
// vacancies:view
// vacancies:review
// ======================================================

const normalizePermissions = (permissions: StaffPermission[]) => {
  let normalized: StaffPermission[] = [];

  permissions.forEach((permission) => {
    normalized = addPermissionWithDependencies(normalized, permission);
  });

  return normalized;
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
  const t = useTranslations("adminStaff");

  const [name, setName] = useState(staff?.name ?? "");

  const [email, setEmail] = useState(staff?.email ?? "");

  const [phone, setPhone] = useState(staff?.phone ?? "");

  const [password, setPassword] = useState("");

  const [status, setStatus] = useState<StaffStatus>(staff?.status ?? "active");

  const [selectedPermissions, setSelectedPermissions] = useState<
    StaffPermission[]
  >(() => normalizePermissions(staff?.permissions ?? []));

  const [error, setError] = useState<
    "" | "nameRequired" | "emailRequired" | "passwordMinLength"
  >("");

  // ====================================================
  // TOGGLE PERMISSION
  // ====================================================

  const togglePermission = (permission: StaffPermission) => {
    setSelectedPermissions((current) => {
      // ----------------------------------------------
      // REMOVE
      //
      // Removing a dependency also removes actions
      // that rely on it.
      // ----------------------------------------------

      if (current.includes(permission)) {
        return removePermissionAndDependents(current, permission);
      }

      // ----------------------------------------------
      // ADD
      //
      // Automatically add required View permission.
      // ----------------------------------------------

      return addPermissionWithDependencies(current, permission);
    });
  };

  // ====================================================
  // SELECT ALL
  // ====================================================

  const selectAll = () => {
    setSelectedPermissions(normalizePermissions(permissions));
  };

  // ====================================================
  // CLEAR ALL
  // ====================================================

  const clearAll = () => {
    setSelectedPermissions([]);
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = () => {
    setError("");

    if (!name.trim()) {
      setError("nameRequired");

      return;
    }

    if (!email.trim()) {
      setError("emailRequired");

      return;
    }

    if (mode === "create" && password.length < 8) {
      setError("passwordMinLength");

      return;
    }

    // Defensive normalization before sending to API.
    const normalizedPermissions = normalizePermissions(selectedPermissions);

    if (mode === "create") {
      onCreate?.({
        name: name.trim(),

        email: email.trim().toLowerCase(),

        phone: phone.trim(),

        password,

        status,

        permissions: normalizedPermissions,
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

      permissions: normalizedPermissions,
    });
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4">
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              {t("staffManagement")}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {mode === "create" ? t("createStaff") : t("editStaff")}
            </h2>

            {staff && (
              <p className="mt-1 text-sm text-slate-500">{staff.staffId}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}

        <div className="space-y-6 p-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {t(error)}
            </div>
          )}

          {/* BASIC INFORMATION */}

          <section>
            <h3 className="font-semibold text-slate-950">
              {t("accountInformation")}
            </h3>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label={t("name")} value={name} onChange={setName} />

              <Field
                label={t("email")}
                type="email"
                value={email}
                onChange={setEmail}
              />

              <Field label={t("phone")} value={phone} onChange={setPhone} />

              {mode === "create" && (
                <Field
                  label={t("initialPassword")}
                  type="password"
                  value={password}
                  onChange={setPassword}
                />
              )}

              <label className="block">
                <span className="text-sm font-semibold text-slate-800">
                  {t("status")}
                </span>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as StaffStatus)
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-indigo-500"
                >
                  <option value="active">{t("active")}</option>

                  <option value="inactive">{t("inactive")}</option>

                  <option value="suspended">{t("suspended")}</option>
                </select>
              </label>
            </div>
          </section>

          {/* PERMISSIONS */}

          <section>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-950">
                  {t("permissionsTitle")}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {t("permissionsDescription")}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  {t("selectAll")}
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  {t("clear")}
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
                      {t(`permissions.${permission}`)}
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
            aria-label={t("close")}
            className="rounded-xl border border-slate-200 px-5 py-2.5"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            {loading
              ? t("saving")
              : mode === "create"
                ? t("createStaff")
                : t("saveChanges")}
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
