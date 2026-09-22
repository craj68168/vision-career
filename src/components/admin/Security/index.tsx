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

import { useLanguage } from "@/context/LanguageContext";

import { useAdminSecurity } from "./hook";

import type { AdminSecurityValidationErrors } from "./types";

// ======================================================
// COMPONENT
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
  //
  // This avoids copying server/query state into local
  // state through useEffect.
  // ====================================================

  const [usernameInput, setUsernameInput] = useState<string | null>(null);

  const username = usernameInput ?? admin?.username ?? "";

  // ====================================================
  // PASSWORD STATE
  // ====================================================

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // ====================================================
  // PASSWORD VISIBILITY
  // ====================================================

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // ====================================================
  // VALIDATION
  // ====================================================

  const [validationErrors, setValidationErrors] =
    useState<AdminSecurityValidationErrors>({});

  // ====================================================
  // VALIDATE
  // ====================================================

  const validateForm = () => {
    const errors: AdminSecurityValidationErrors = {};

    const normalizedUsername = username.trim();

    // ==================================================
    // USERNAME
    // ==================================================

    if (!normalizedUsername) {
      errors.username =
        lang === "ja" ? "ユーザー名は必須です" : "Username is required.";
    } else if (normalizedUsername.length < 3) {
      errors.username =
        lang === "ja"
          ? "ユーザー名は3文字以上である必要があります"
          : "Username must be at least 3 characters.";
    }

    // ==================================================
    // CURRENT PASSWORD
    // ==================================================

    if (!currentPassword) {
      errors.currentPassword =
        lang === "ja"
          ? "現在のパスワードは必須です"
          : "Current password is required.";
    }

    // ==================================================
    // NEW PASSWORD
    // ==================================================

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

    // ==================================================
    // CONFIRM PASSWORD
    // ==================================================

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

    // ==================================================
    // RETURN USERNAME TO API VALUE
    //
    // After the hook updates/refetches Admin data,
    // username automatically reflects admin.username.
    // ==================================================

    setUsernameInput(null);

    // ==================================================
    // CLEAR PASSWORD FIELDS
    // ==================================================

    setCurrentPassword("");

    setNewPassword("");

    setConfirmNewPassword("");

    setShowCurrentPassword(false);

    setShowNewPassword(false);

    setShowConfirmNewPassword(false);

    setValidationErrors({});
  };

  // ====================================================
  // RESET / CANCEL
  // ====================================================

  const handleReset = () => {
    // Fall back to admin.username again.
    setUsernameInput(null);

    setCurrentPassword("");

    setNewPassword("");

    setConfirmNewPassword("");

    setShowCurrentPassword(false);

    setShowNewPassword(false);

    setShowConfirmNewPassword(false);

    setValidationErrors({});

    clearMessages();
  };

  // ====================================================
  // CLEAR FIELD ERROR
  // ====================================================

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
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-indigo-600" />

          <p className="mt-4 text-sm text-slate-500">
            {lang === "ja" ? "読み込み中..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-8">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30">
            <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {lang === "ja" ? "認証情報の更新" : "Update Credentials"}
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {lang === "ja"
                ? "管理者のユーザー名とパスワードを変更します"
                : "Change your Admin username and password."}
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          FORM
      ================================================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {/* ==================================================
            ERROR
        ================================================== */}

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* ==================================================
            SUCCESS
        ================================================== */}

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

              <span>{successMessage}</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* ==================================================
              USERNAME
          ================================================== */}

          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {lang === "ja" ? "新しいユーザー名" : "New Username"}
            </label>

            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                id="username"
                type="text"
                value={username}
                disabled={isSaving}
                autoComplete="username"
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
                className={`w-full rounded-2xl border bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:bg-white disabled:opacity-50 dark:bg-slate-900 dark:text-white ${
                  validationErrors.username
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 focus:border-indigo-400 dark:border-slate-700"
                }`}
              />
            </div>

            {validationErrors.username && (
              <p className="mt-2 text-xs text-red-600">
                {validationErrors.username}
              </p>
            )}

            <p className="mt-2 text-xs text-slate-500">
              {lang === "ja"
                ? "3文字以上で入力してください"
                : "Must be at least 3 characters."}
            </p>
          </div>

          {/* ==================================================
              CURRENT PASSWORD
          ================================================== */}

          <div>
            <label
              htmlFor="currentPassword"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {lang === "ja" ? "現在のパスワード" : "Current Password"}

              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <Key className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                disabled={isSaving}
                autoComplete="current-password"
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
                className={`w-full rounded-2xl border bg-slate-50 py-3 pl-12 pr-12 text-sm text-slate-900 outline-none transition focus:bg-white disabled:opacity-50 dark:bg-slate-900 dark:text-white ${
                  validationErrors.currentPassword
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 focus:border-indigo-400 dark:border-slate-700"
                }`}
              />

              <button
                type="button"
                disabled={isSaving}
                onClick={() => setShowCurrentPassword((previous) => !previous)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {validationErrors.currentPassword && (
              <p className="mt-2 text-xs text-red-600">
                {validationErrors.currentPassword}
              </p>
            )}

            <p className="mt-2 text-xs text-slate-500">
              {lang === "ja"
                ? "本人確認のため現在のパスワードを入力してください"
                : "Enter your current password for verification."}
            </p>
          </div>

          {/* ==================================================
              DIVIDER
          ================================================== */}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs font-medium text-slate-500 dark:bg-slate-800">
                {lang === "ja" ? "新しいパスワード" : "NEW PASSWORD"}
              </span>
            </div>
          </div>

          {/* ==================================================
              NEW PASSWORD
          ================================================== */}

          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {lang === "ja" ? "新しいパスワード" : "New Password"}

              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                disabled={isSaving}
                autoComplete="new-password"
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
                className={`w-full rounded-2xl border bg-slate-50 py-3 pl-12 pr-12 text-sm text-slate-900 outline-none transition focus:bg-white disabled:opacity-50 dark:bg-slate-900 dark:text-white ${
                  validationErrors.newPassword
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 focus:border-indigo-400 dark:border-slate-700"
                }`}
              />

              <button
                type="button"
                disabled={isSaving}
                onClick={() => setShowNewPassword((previous) => !previous)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {validationErrors.newPassword && (
              <p className="mt-2 text-xs text-red-600">
                {validationErrors.newPassword}
              </p>
            )}

            <p className="mt-2 text-xs text-slate-500">
              {lang === "ja"
                ? "8文字以上で入力してください"
                : "Must be at least 8 characters."}
            </p>
          </div>

          {/* ==================================================
              CONFIRM PASSWORD
          ================================================== */}

          <div>
            <label
              htmlFor="confirmNewPassword"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {lang === "ja"
                ? "新しいパスワード（確認）"
                : "Confirm New Password"}

              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                id="confirmNewPassword"
                type={showConfirmNewPassword ? "text" : "password"}
                value={confirmNewPassword}
                disabled={isSaving}
                autoComplete="new-password"
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
                className={`w-full rounded-2xl border bg-slate-50 py-3 pl-12 pr-12 text-sm text-slate-900 outline-none transition focus:bg-white disabled:opacity-50 dark:bg-slate-900 dark:text-white ${
                  validationErrors.confirmNewPassword
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 focus:border-indigo-400 dark:border-slate-700"
                }`}
              />

              <button
                type="button"
                disabled={isSaving}
                onClick={() =>
                  setShowConfirmNewPassword((previous) => !previous)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50"
              >
                {showConfirmNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {validationErrors.confirmNewPassword && (
              <p className="mt-2 text-xs text-red-600">
                {validationErrors.confirmNewPassword}
              </p>
            )}
          </div>
        </div>

        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={handleReset}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {lang === "ja" ? "キャンセル" : "Cancel"}
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => void handleSave()}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-600"
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
      </div>

      {/* ==================================================
          SECURITY NOTICE
      ================================================== */}

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              {lang === "ja" ? "セキュリティ注意事項" : "Security Notice"}
            </p>

            <ul className="mt-1 space-y-1 text-xs text-amber-700 dark:text-amber-400">
              <li>
                {lang === "ja"
                  ? "• 変更には現在のパスワードによる本人確認が必要です"
                  : "• Your current password is required for verification."}
              </li>

              <li>
                {lang === "ja"
                  ? "• 新しいパスワードは8文字以上で設定してください"
                  : "• Your new password must contain at least 8 characters."}
              </li>

              <li>
                {lang === "ja"
                  ? "• パスワード変更後、以前の管理者トークンは無効になります"
                  : "• Previous Admin sessions become invalid after changing the password."}
              </li>

              <li>
                {lang === "ja"
                  ? "• 現在のブラウザには新しい認証トークンが自動的に設定されます"
                  : "• This browser automatically receives a new authentication token."}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
