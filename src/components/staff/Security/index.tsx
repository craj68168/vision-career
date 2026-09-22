"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useStaffSecurity } from "./hook";

import type { StaffSecurityValidationErrors } from "./types";

// ======================================================
// COMPONENT
// ======================================================

export default function StaffSecurity() {
  const router = useRouter();

  const pathname = usePathname();

  const {
    staff,

    isLoading,

    isSaving,

    errorMessage,

    successMessage,

    savePassword,

    clearError,

    clearMessages,
  } = useStaffSecurity();

  // ====================================================
  // LANGUAGE PREFIX
  // ====================================================

  const prefix = pathname.startsWith("/en/") ? "/en" : "";

  // ====================================================
  // FORM STATE
  // ====================================================

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // ====================================================
  // PASSWORD VISIBILITY
  // ====================================================

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ====================================================
  // VALIDATION
  // ====================================================

  const [validationErrors, setValidationErrors] =
    useState<StaffSecurityValidationErrors>({});

  // ====================================================
  // VALIDATE
  // ====================================================

  const validate = () => {
    const errors: StaffSecurityValidationErrors = {};

    if (!currentPassword.trim()) {
      errors.currentPassword = "Current password is required.";
    }

    if (!newPassword) {
      errors.newPassword = "New password is required.";
    } else if (newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters.";
    }

    if (!confirmNewPassword) {
      errors.confirmNewPassword = "Please confirm your new password.";
    } else if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = "Passwords do not match.";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // ====================================================
  // SAVE
  // ====================================================

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    if (!validate()) {
      return;
    }

    clearMessages();

    const success = await savePassword({
      currentPassword,

      newPassword,
    });

    if (!success) {
      return;
    }

    // ==================================================
    // CLEAR PASSWORD FIELDS
    //
    // Success message remains visible.
    // ==================================================

    setCurrentPassword("");

    setNewPassword("");

    setConfirmNewPassword("");

    setShowCurrentPassword(false);

    setShowNewPassword(false);

    setShowConfirmPassword(false);

    setValidationErrors({});
  };

  // ====================================================
  // CANCEL
  //
  // Cancel now returns to Staff Dashboard.
  // ====================================================

  const handleCancel = () => {
    clearMessages();

    router.push(`${prefix}/staff`);
  };

  // ====================================================
  // CLEAR FIELD ERROR
  // ====================================================

  const clearFieldError = (field: keyof StaffSecurityValidationErrors) => {
    setValidationErrors((previous) => ({
      ...previous,

      [field]: undefined,
    }));

    clearError();
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-indigo-600" />
      </div>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 md:px-8">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-slate-950">Security</h1>

        <p className="mt-1 text-sm text-slate-500">
          View your Staff account and securely change your password.
        </p>
      </div>

      {/* ==================================================
          ACCOUNT INFORMATION
      ================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50">
            <UserRound className="h-5 w-5 text-indigo-600" />
          </div>

          <div>
            <h2 className="text-lg font-bold">Account Information</h2>

            <p className="text-sm text-slate-500">
              Your account details are managed by Admin.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AccountField
            icon={<UserRound className="h-4 w-4" />}
            label="Staff ID"
            value={staff?.staffId}
          />

          <AccountField
            icon={<UserRound className="h-4 w-4" />}
            label="Name"
            value={staff?.name}
          />

          <AccountField
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value={staff?.email}
          />

          <AccountField
            icon={<Phone className="h-4 w-4" />}
            label="Phone"
            value={staff?.phone}
          />

          <AccountField
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Role"
            value={staff?.role}
          />

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Status
            </p>

            <div className="mt-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  staff?.status === "active"
                    ? "bg-emerald-50 text-emerald-700"
                    : staff?.status === "suspended"
                      ? "bg-red-50 text-red-700"
                      : "bg-slate-200 text-slate-700"
                }`}
              >
                {staff?.status || "-"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          PASSWORD FORM
      ================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100">
            <KeyRound className="h-5 w-5 text-slate-700" />
          </div>

          <div>
            <h2 className="text-lg font-bold">Change Password</h2>

            <p className="text-sm text-slate-500">
              Your current password is required before setting a new password.
            </p>
          </div>
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {errorMessage && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">Password update failed</p>

              <p className="mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* ==================================================
            SUCCESS
        ================================================== */}

        {successMessage && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">Password updated</p>

              <p className="mt-1">{successMessage}</p>
            </div>
          </div>
        )}

        <div className="mt-6 max-w-2xl space-y-5">
          {/* ==================================================
              CURRENT PASSWORD
          ================================================== */}

          <PasswordField
            label="Current Password"
            value={currentPassword}
            visible={showCurrentPassword}
            error={validationErrors.currentPassword}
            disabled={isSaving}
            placeholder="Enter current password"
            autoComplete="current-password"
            onChange={(value) => {
              setCurrentPassword(value);

              clearFieldError("currentPassword");
            }}
            onToggle={() => setShowCurrentPassword((previous) => !previous)}
          />

          {/* ==================================================
              DIVIDER
          ================================================== */}

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs font-semibold uppercase text-slate-400">
                New Password
              </span>
            </div>
          </div>

          {/* ==================================================
              NEW PASSWORD
          ================================================== */}

          <PasswordField
            label="New Password"
            value={newPassword}
            visible={showNewPassword}
            error={validationErrors.newPassword}
            disabled={isSaving}
            placeholder="Enter new password"
            autoComplete="new-password"
            onChange={(value) => {
              setNewPassword(value);

              clearFieldError("newPassword");
            }}
            onToggle={() => setShowNewPassword((previous) => !previous)}
          />

          <p className="-mt-3 text-xs text-slate-500">
            Password must contain at least 8 characters.
          </p>

          {/* ==================================================
              CONFIRM PASSWORD
          ================================================== */}

          <PasswordField
            label="Confirm New Password"
            value={confirmNewPassword}
            visible={showConfirmPassword}
            error={validationErrors.confirmNewPassword}
            disabled={isSaving}
            placeholder="Re-enter new password"
            autoComplete="new-password"
            onChange={(value) => {
              setConfirmNewPassword(value);

              clearFieldError("confirmNewPassword");
            }}
            onToggle={() => setShowConfirmPassword((previous) => !previous)}
          />
        </div>

        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="mt-8 flex max-w-2xl justify-end gap-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={handleCancel}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => void handleSave()}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </section>

      {/* ==================================================
          SECURITY NOTICE
      ================================================== */}

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

          <div>
            <p className="font-semibold text-amber-900">Account Security</p>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              Changing your password invalidates previously issued Staff
              sessions. This browser automatically receives the new
              authentication token.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ======================================================
// ACCOUNT FIELD
// ======================================================

function AccountField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;

  label: string;

  value?: string | null;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex gap-3">
        <div className="mt-0.5 text-slate-400">{icon}</div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-slate-900">
            {value || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// PASSWORD FIELD
// ======================================================

function PasswordField({
  label,
  value,
  visible,
  placeholder,
  error,
  disabled,
  autoComplete,
  onChange,
  onToggle,
}: {
  label: string;

  value: string;

  visible: boolean;

  placeholder: string;

  error?: string;

  disabled: boolean;

  autoComplete: "current-password" | "new-password";

  onChange: (value: string) => void;

  onToggle: () => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        <span className="ml-1 text-red-500">*</span>
      </label>

      <div className="relative">
        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type={visible ? "text" : "password"}
          value={value}
          disabled={disabled}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`h-12 w-full rounded-xl border bg-slate-50 pl-11 pr-12 text-sm outline-none transition focus:bg-white disabled:opacity-50 ${
            error
              ? "border-red-300 focus:border-red-400"
              : "border-slate-200 focus:border-indigo-400"
          }`}
        />

        <button
          type="button"
          disabled={disabled}
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 disabled:opacity-50"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
