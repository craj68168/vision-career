"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  User,
  Lock,
  Key,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminUpdateCredentialsPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [adminId, setAdminId] = useState<number | null>(null);
  const [currentUsername, setCurrentUsername] = useState("");
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  }>({});

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.replace("/admin-login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      const id = payload?.data?.id;
      const tokenUsername = payload?.data?.username;

      if (!id) {
        router.replace("/admin-login");
        return;
      }

      setAdminId(id);
      setCurrentUsername(tokenUsername || "");
      setUsername(tokenUsername || "");
    } catch (err) {
      console.error("Failed to decode token:", err);
      router.replace("/admin-login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const validateForm = (): boolean => {
    const errors: {
      username?: string;
      currentPassword?: string;
      newPassword?: string;
      confirmNewPassword?: string;
    } = {};

    if (!username.trim()) {
      errors.username =
        lang === "ja" ? "ユーザー名は必須です" : "Username is required";
    } else if (username.trim().length < 3) {
      errors.username =
        lang === "ja"
          ? "ユーザー名は3文字以上である必要があります"
          : "Username must be at least 3 characters";
    }

    if (!currentPassword) {
      errors.currentPassword =
        lang === "ja"
          ? "現在のパスワードは必須です"
          : "Current password is required";
    }

    if (!newPassword) {
      errors.newPassword =
        lang === "ja"
          ? "新しいパスワードは必須です"
          : "New password is required";
    } else if (newPassword.length < 6) {
      errors.newPassword =
        lang === "ja"
          ? "新しいパスワードは6文字以上である必要があります"
          : "New password must be at least 6 characters";
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      errors.confirmNewPassword =
        lang === "ja" ? "パスワードが一致しません" : "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin-login");
      return;
    }

    if (!adminId) {
      setError(
        lang === "ja" ? "管理者IDが見つかりません" : "Admin ID not found",
      );
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        "https://vision-career.co.jp/admin-update-credentials.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: adminId,
            username: username.trim(),
            current_password: currentPassword,
            new_password: newPassword,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data?.message ||
            (lang === "ja"
              ? "認証情報の更新に失敗しました"
              : "Failed to update credentials"),
        );
      }

      setSuccess(
        data?.message ||
          (lang === "ja"
            ? "認証情報が正常に更新されました"
            : "Credentials updated successfully"),
      );

      // Update current username
      setCurrentUsername(username.trim());

      // Clear password fields after success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setValidationErrors({});
    } catch (err: any) {
      console.error("Failed to update credentials:", err);
      setError(
        err?.message ||
          (lang === "ja"
            ? "更新中にエラーが発生しました"
            : "Error occurred while updating"),
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-slate-400 dark:text-slate-500" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {lang === "ja" ? "読み込み中..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
        {/* Page Header */}
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
                  ? "ユーザー名とパスワードを変更できます"
                  : "Change your username and password"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {lang === "ja" ? "新しいユーザー名" : "New Username"}
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (validationErrors.username) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        username: undefined,
                      }));
                    }
                  }}
                  disabled={isSaving}
                  placeholder={
                    lang === "ja"
                      ? "新しいユーザー名を入力"
                      : "Enter new username"
                  }
                  className={`w-full rounded-2xl border bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white disabled:opacity-50 ${
                    validationErrors.username
                      ? "border-red-300 focus:border-red-400 dark:border-red-700 dark:focus:border-red-600"
                      : "border-slate-200 focus:border-slate-400 dark:border-slate-700 dark:focus:border-slate-600"
                  } dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-800`}
                />
              </div>
              {validationErrors.username && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  {validationErrors.username}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {lang === "ja"
                  ? "3文字以上で入力してください"
                  : "Must be at least 3 characters"}
              </p>
            </div>

            {/* Current Password Field */}
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {lang === "ja" ? "現在のパスワード" : "Current Password"}
                <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="relative">
                <Key className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (validationErrors.currentPassword) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        currentPassword: undefined,
                      }));
                    }
                  }}
                  disabled={isSaving}
                  placeholder={
                    lang === "ja"
                      ? "現在のパスワードを入力"
                      : "Enter current password"
                  }
                  className={`w-full rounded-2xl border bg-slate-50 py-3 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white disabled:opacity-50 ${
                    validationErrors.currentPassword
                      ? "border-red-300 focus:border-red-400 dark:border-red-700 dark:focus:border-red-600"
                      : "border-slate-200 focus:border-slate-400 dark:border-slate-700 dark:focus:border-slate-600"
                  } dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-800`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isSaving}
                  className="absolute right-4 top-1/2 cursor-pointer -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {validationErrors.currentPassword && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  {validationErrors.currentPassword}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {lang === "ja"
                  ? "本人確認のため、現在のパスワードを入力してください"
                  : "Enter your current password for verification"}
              </p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {lang === "ja" ? "新しいパスワード" : "NEW PASSWORD"}
                </span>
              </div>
            </div>

            {/* New Password Field */}
            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {lang === "ja" ? "新しいパスワード" : "New Password"}
                <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (validationErrors.newPassword) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        newPassword: undefined,
                      }));
                    }
                  }}
                  disabled={isSaving}
                  placeholder={
                    lang === "ja"
                      ? "新しいパスワードを入力"
                      : "Enter new password"
                  }
                  className={`w-full rounded-2xl border bg-slate-50 py-3 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white disabled:opacity-50 ${
                    validationErrors.newPassword
                      ? "border-red-300 focus:border-red-400 dark:border-red-700 dark:focus:border-red-600"
                      : "border-slate-200 focus:border-slate-400 dark:border-slate-700 dark:focus:border-slate-600"
                  } dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-800`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isSaving}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 disabled:opacity-50 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {validationErrors.newPassword && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  {validationErrors.newPassword}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {lang === "ja"
                  ? "6文字以上で入力してください"
                  : "Must be at least 6 characters"}
              </p>
            </div>

            {/* Confirm New Password Field */}
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
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="confirmNewPassword"
                  type={showConfirmNewPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                    if (validationErrors.confirmNewPassword) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        confirmNewPassword: undefined,
                      }));
                    }
                  }}
                  disabled={isSaving}
                  placeholder={
                    lang === "ja"
                      ? "新しいパスワードを再入力"
                      : "Re-enter new password"
                  }
                  className={`w-full rounded-2xl border bg-slate-50 py-3 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white disabled:opacity-50 ${
                    validationErrors.confirmNewPassword
                      ? "border-red-300 focus:border-red-400 dark:border-red-700 dark:focus:border-red-600"
                      : "border-slate-200 focus:border-slate-400 dark:border-slate-700 dark:focus:border-slate-600"
                  } dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-800`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmNewPassword(!showConfirmNewPassword)
                  }
                  disabled={isSaving}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 disabled:opacity-50 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  {showConfirmNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {validationErrors.confirmNewPassword && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  {validationErrors.confirmNewPassword}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              onClick={() => router.back()}
              disabled={isSaving}
              className="rounded-xl border border-slate-200 bg-white cursor-pointer px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {lang === "ja" ? "キャンセル" : "Cancel"}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl cursor-pointer bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-700"
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

        {/* Security Notice */}
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                {lang === "ja" ? "セキュリティ注意事項" : "Security Notice"}
              </p>
              <ul className="mt-1 space-y-1 text-xs text-amber-700 dark:text-amber-400">
                <li>
                  {lang === "ja"
                    ? "• ユーザー名とパスワードの両方を変更するには、現在のパスワードが必要です"
                    : "• Current password is required to change both username and password"}
                </li>
                <li>
                  {lang === "ja"
                    ? "• 新しいパスワードは6文字以上で、安全なものを使用してください"
                    : "• New password must be at least 6 characters and should be secure"}
                </li>
                <li>
                  {lang === "ja"
                    ? "• パスワードを変更すると、次回ログイン時に新しいパスワードが必要になります"
                    : "• After changing password, you'll need the new password for your next login"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
