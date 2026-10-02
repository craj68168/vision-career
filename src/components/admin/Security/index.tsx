"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Lock,
  Save,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import type { ComponentType } from "react";

import { useLanguage } from "@/context/LanguageContext";

import { useAdminSecurity } from "./hook";
import type { AdminSecurityValidationErrors } from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

const inputBase =
  "h-10 w-full rounded-lg border bg-white pl-10 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-white";

const inputNormal =
  "border-zinc-200 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-white/10";

const inputInvalid =
  "border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/40";

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function AdminUpdateCredentialsPage() {
  const { lang } = useLanguage();

  const {
    admin,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
    saveCredentials,
    clearMessages,
  } = useAdminSecurity();

  // ====================================================
  // USERNAME
  //
  // null = use current username from Admin API
  // string = locally edited username
  // ====================================================

  const [usernameInput, setUsernameInput] = useState<string | null>(null);
  const username = usernameInput ?? admin?.username ?? "";

  // ====================================================
  // PASSWORD STATE
  // ====================================================

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [validationErrors, setValidationErrors] =
    useState<AdminSecurityValidationErrors>({});

  // ====================================================
  // VALIDATE
  // ====================================================

  const validateForm = () => {
    const errors: AdminSecurityValidationErrors = {};
    const normalizedUsername = username.trim();

    if (!normalizedUsername) {
      errors.username =
        lang === "ja" ? "ユーザー名は必須です" : "Username is required.";
    } else if (normalizedUsername.length < 3) {
      errors.username =
        lang === "ja"
          ? "ユーザー名は3文字以上である必要があります"
          : "Username must be at least 3 characters.";
    }

    if (!currentPassword) {
      errors.currentPassword =
        lang === "ja"
          ? "現在のパスワードは必須です"
          : "Current password is required.";
    }

    if (!newPassword) {
      errors.newPassword =
        lang === "ja"
          ? "新しいパスワードは必須です"
          : "New password is required.";
    } else if (newPassword.length < 8) {
      errors.newPassword =
        lang === "ja"
          ? "新しいパスワードは8文字以上である必要があります"
          : "New password must be at least 8 characters.";
    }

    if (!confirmNewPassword) {
      errors.confirmNewPassword =
        lang === "ja"
          ? "新しいパスワードを再入力してください"
          : "Please confirm your new password.";
    } else if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword =
        lang === "ja" ? "パスワードが一致しません" : "Passwords do not match.";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // ====================================================
  // RESET LOCAL FORM
  // ====================================================

  const resetFields = () => {
    setUsernameInput(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
    setValidationErrors({});
  };

  // ====================================================
  // SAVE
  // ====================================================

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    clearMessages();

    const success = await saveCredentials({
      username: username.trim(),
      currentPassword,
      newPassword,
    });

    if (!success) {
      return;
    }

    resetFields();
  };

  const handleReset = () => {
    resetFields();
    clearMessages();
  };

  const clearValidationError = (field: keyof AdminSecurityValidationErrors) => {
    if (!validationErrors[field]) {
      return;
    }

    setValidationErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center sm:min-h-[500px]">
        <div role="status" className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400" />

          <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {lang === "ja" ? "読み込み中..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  const notices =
    lang === "ja"
      ? [
          "変更には現在のパスワードによる本人確認が必要です",
          "新しいパスワードは8文字以上で設定してください",
          "パスワード変更後、以前の管理者トークンは無効になります",
          "現在のブラウザには新しい認証トークンが自動的に設定されます",
        ]
      : [
          "Your current password is required for verification.",
          "Your new password must contain at least 8 characters.",
          "Previous Admin sessions become invalid after changing the password.",
          "This browser automatically receives a new authentication token.",
        ];

  return (
    <div className="min-w-0 space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white sm:text-2xl">
            {lang === "ja" ? "認証情報の更新" : "Update Credentials"}
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {lang === "ja"
              ? "管理者のユーザー名とパスワードを変更します。"
              : "Change your Admin username and password."}
          </p>
        </div>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-3">
        {/* ===============================================
            FORM
        ================================================ */}

        <section className="min-w-0 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-5 xl:col-span-2">
          {/* ERROR */}

          {errorMessage && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

              <span className="min-w-0 break-words">{errorMessage}</span>
            </div>
          )}

          {/* SUCCESS */}

          {successMessage && (
            <div
              role="status"
              className="mb-5 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

              <span className="min-w-0 break-words">{successMessage}</span>
            </div>
          )}

          <div className="space-y-5">
            {/* USERNAME */}

            <Field
              id="username"
              label={lang === "ja" ? "新しいユーザー名" : "New Username"}
              icon={User}
              error={validationErrors.username}
              hint={
                lang === "ja"
                  ? "3文字以上で入力してください"
                  : "Must be at least 3 characters."
              }
            >
              <input
                id="username"
                type="text"
                value={username}
                disabled={isSaving}
                autoComplete="username"
                aria-invalid={Boolean(validationErrors.username)}
                onChange={(event) => {
                  setUsernameInput(event.target.value);
                  clearMessages();
                  clearValidationError("username");
                }}
                placeholder={
                  lang === "ja"
                    ? "新しいユーザー名を入力"
                    : "Enter new username"
                }
                className={`${inputBase} pr-4 ${
                  validationErrors.username ? inputInvalid : inputNormal
                }`}
              />
            </Field>

            {/* CURRENT PASSWORD */}

            <Field
              id="currentPassword"
              label={lang === "ja" ? "現在のパスワード" : "Current Password"}
              required
              icon={Key}
              error={validationErrors.currentPassword}
              hint={
                lang === "ja"
                  ? "本人確認のため現在のパスワードを入力してください"
                  : "Enter your current password for verification."
              }
            >
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                disabled={isSaving}
                autoComplete="current-password"
                aria-invalid={Boolean(validationErrors.currentPassword)}
                onChange={(event) => {
                  setCurrentPassword(event.target.value);
                  clearMessages();
                  clearValidationError("currentPassword");
                }}
                placeholder={
                  lang === "ja"
                    ? "現在のパスワードを入力"
                    : "Enter current password"
                }
                className={`${inputBase} pr-12 ${
                  validationErrors.currentPassword ? inputInvalid : inputNormal
                }`}
              />

              <VisibilityToggle
                lang={lang}
                visible={showCurrentPassword}
                disabled={isSaving}
                onToggle={() => setShowCurrentPassword((previous) => !previous)}
              />
            </Field>

            {/* DIVIDER */}

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-white/10" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500">
                  {lang === "ja" ? "新しいパスワード" : "New Password"}
                </span>
              </div>
            </div>

            {/* NEW PASSWORD */}

            <Field
              id="newPassword"
              label={lang === "ja" ? "新しいパスワード" : "New Password"}
              required
              icon={Lock}
              error={validationErrors.newPassword}
              hint={
                lang === "ja"
                  ? "8文字以上で入力してください"
                  : "Must be at least 8 characters."
              }
            >
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                disabled={isSaving}
                autoComplete="new-password"
                aria-invalid={Boolean(validationErrors.newPassword)}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  clearMessages();
                  clearValidationError("newPassword");
                }}
                placeholder={
                  lang === "ja"
                    ? "新しいパスワードを入力"
                    : "Enter new password"
                }
                className={`${inputBase} pr-12 ${
                  validationErrors.newPassword ? inputInvalid : inputNormal
                }`}
              />

              <VisibilityToggle
                lang={lang}
                visible={showNewPassword}
                disabled={isSaving}
                onToggle={() => setShowNewPassword((previous) => !previous)}
              />
            </Field>

            {/* CONFIRM PASSWORD */}

            <Field
              id="confirmNewPassword"
              label={
                lang === "ja"
                  ? "新しいパスワード（確認）"
                  : "Confirm New Password"
              }
              required
              icon={Lock}
              error={validationErrors.confirmNewPassword}
            >
              <input
                id="confirmNewPassword"
                type={showConfirmNewPassword ? "text" : "password"}
                value={confirmNewPassword}
                disabled={isSaving}
                autoComplete="new-password"
                aria-invalid={Boolean(validationErrors.confirmNewPassword)}
                onChange={(event) => {
                  setConfirmNewPassword(event.target.value);
                  clearMessages();
                  clearValidationError("confirmNewPassword");
                }}
                placeholder={
                  lang === "ja"
                    ? "新しいパスワードを再入力"
                    : "Re-enter new password"
                }
                className={`${inputBase} pr-12 ${
                  validationErrors.confirmNewPassword
                    ? inputInvalid
                    : inputNormal
                }`}
              />

              <VisibilityToggle
                lang={lang}
                visible={showConfirmNewPassword}
                disabled={isSaving}
                onToggle={() =>
                  setShowConfirmNewPassword((previous) => !previous)
                }
              />
            </Field>
          </div>

          {/* ACTIONS */}

          <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-white/10">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleReset}
              className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}
            >
              {lang === "ja" ? "キャンセル" : "Cancel"}
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={() => void handleSave()}
              className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${focusRing}`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  {lang === "ja" ? "保存中..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />

                  {lang === "ja" ? "更新を保存" : "Save Changes"}
                </>
              )}
            </button>
          </div>
        </section>

        {/* ===============================================
            SECURITY NOTICE
        ================================================ */}

        <aside className="min-w-0 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-400/20 dark:bg-amber-400/10 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="shrink-0 rounded-lg bg-amber-100 p-3 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300">
              <Shield className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300">
                {lang === "ja" ? "セキュリティ注意事項" : "Security Notice"}
              </h3>

              <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs text-amber-700 marker:text-amber-400 dark:text-amber-300/90">
                {notices.map((notice) => (
                  <li key={notice} className="break-words">
                    {notice}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ======================================================
// FIELD
// ======================================================

function Field({
  id,
  label,
  required = false,
  icon: Icon,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  icon: ComponentType<{ className?: string }>;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500 dark:text-red-400">*</span>
        )}
      </label>

      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

        {children}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-1.5 text-xs text-red-600 dark:text-red-300"
        >
          {error}
        </p>
      )}

      {hint && (
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          {hint}
        </p>
      )}
    </div>
  );
}

// ======================================================
// VISIBILITY TOGGLE
// ======================================================

function VisibilityToggle({
  lang,
  visible,
  disabled,
  onToggle,
}: {
  lang: string;
  visible: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const label =
    lang === "ja"
      ? visible
        ? "パスワードを隠す"
        : "パスワードを表示"
      : visible
        ? "Hide password"
        : "Show password";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      aria-label={label}
      title={label}
      aria-pressed={visible}
      className={`absolute right-1.5 top-1/2 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10 dark:hover:text-zinc-200 ${focusRing}`}
    >
      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}