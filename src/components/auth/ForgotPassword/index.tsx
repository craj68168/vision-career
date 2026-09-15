"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useForgotPassword } from "./hook";
import type { ForgotPasswordAuthType } from "./types";

type ForgotPasswordProps = {
  authType: ForgotPasswordAuthType;
};

export default function ForgotPassword({ authType }: ForgotPasswordProps) {
  const {
    lang,

    step,

    email,
    setEmail,

    code,
    handleCodeChange,

    password,
    setPassword,

    confirmPassword,
    setConfirmPassword,

    errors,
    loading,

    handleRequestCode,
    handleVerifyCode,
    handleResendCode,
    handleResetPassword,

    goBackToEmail,
    goToLogin,
  } = useForgotPassword(authType);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const portalName =
    authType === "seeker"
      ? lang === "ja"
        ? "求職者"
        : "Job Seeker"
      : lang === "ja"
        ? "求人企業"
        : "Job Provider";

  const handleBack = () => {
    if (step === "email") {
      goToLogin();
      return;
    }

    goBackToEmail();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Back button */}
        {step !== "success" && (
          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="mb-5 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />

            {step === "email"
              ? lang === "ja"
                ? "ログインに戻る"
                : "Back to login"
              : lang === "ja"
                ? "戻る"
                : "Back"}
          </button>
        )}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl backdrop-blur-xl">
          <div className="p-6 sm:p-8">
            {/* Portal */}
            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-sky-400">
                {portalName}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {/* ====================================== */}
              {/* STEP 1 - EMAIL */}
              {/* ====================================== */}

              {step === "email" && (
                <motion.div
                  key="email"
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -18,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <div className="mb-7">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10">
                      <KeyRound className="h-6 w-6 text-sky-400" />
                    </div>

                    <h1 className="text-3xl font-semibold text-white">
                      {lang === "ja"
                        ? "パスワードを忘れた方"
                        : "Forgot password?"}
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {lang === "ja"
                        ? "登録したメールアドレスを入力してください。パスワード再設定用の確認コードを送信します。"
                        : "Enter your registered email address and we'll send you a verification code to reset your password."}
                    </p>
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      void handleRequestCode();
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="forgot-email"
                        className="mb-2 block text-sm font-medium text-slate-300"
                      >
                        {lang === "ja" ? "メールアドレス" : "Email Address"}
                      </label>

                      <div
                        className={`flex items-center gap-3 rounded-2xl border bg-white/5 px-4 py-3 transition focus-within:border-sky-400 ${
                          errors.email ? "border-red-400/70" : "border-white/10"
                        }`}
                      >
                        <Mail className="h-5 w-5 shrink-0 text-slate-400" />

                        <input
                          id="forgot-email"
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          autoComplete="email"
                          placeholder="you@example.com"
                          disabled={loading}
                          className="w-full bg-transparent text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
                        />
                      </div>

                      {errors.email && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />}

                      {loading
                        ? lang === "ja"
                          ? "送信中..."
                          : "Sending..."
                        : lang === "ja"
                          ? "確認コードを送信"
                          : "Send Verification Code"}
                    </button>
                  </form>

                  <p className="mt-6 text-center text-sm text-slate-400">
                    {lang === "ja"
                      ? "パスワードを思い出しましたか？"
                      : "Remember your password?"}{" "}
                    <button
                      type="button"
                      onClick={goToLogin}
                      className="cursor-pointer font-medium text-sky-400 transition hover:text-sky-300"
                    >
                      {lang === "ja" ? "ログイン" : "Sign in"}
                    </button>
                  </p>
                </motion.div>
              )}

              {/* ====================================== */}
              {/* STEP 2 - VERIFY CODE */}
              {/* ====================================== */}

              {step === "code" && (
                <motion.div
                  key="code"
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -18,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <div className="mb-7">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10">
                      <ShieldCheck className="h-6 w-6 text-sky-400" />
                    </div>

                    <h1 className="text-3xl font-semibold text-white">
                      {lang === "ja" ? "確認コードを入力" : "Verify your code"}
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {lang === "ja"
                        ? `${email} に送信された6桁の確認コードを入力してください。`
                        : `Enter the 6-digit verification code sent to ${email}.`}
                    </p>

                    <button
                      type="button"
                      onClick={goBackToEmail}
                      disabled={loading}
                      className="mt-2 cursor-pointer text-sm font-medium text-sky-400 transition hover:text-sky-300 disabled:opacity-50"
                    >
                      {lang === "ja"
                        ? "メールアドレスを変更"
                        : "Change email address"}
                    </button>
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      void handleVerifyCode();
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="reset-code"
                        className="mb-2 block text-sm font-medium text-slate-300"
                      >
                        {lang === "ja" ? "確認コード" : "Verification Code"}
                      </label>

                      <input
                        id="reset-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        value={code}
                        maxLength={6}
                        disabled={loading}
                        onChange={(event) =>
                          handleCodeChange(event.target.value)
                        }
                        placeholder="000000"
                        className={`w-full rounded-2xl border bg-white/5 px-4 py-4 text-center text-2xl font-semibold tracking-[0.4em] text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400 ${
                          errors.code ? "border-red-400/70" : "border-white/10"
                        }`}
                      />

                      {errors.code && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.code}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || code.length !== 6}
                      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />}

                      {loading
                        ? lang === "ja"
                          ? "確認中..."
                          : "Verifying..."
                        : lang === "ja"
                          ? "コードを確認"
                          : "Verify Code"}
                    </button>

                    <div className="text-center">
                      <p className="text-sm text-slate-400">
                        {lang === "ja"
                          ? "コードを受け取っていませんか？"
                          : "Didn't receive the code?"}
                      </p>

                      <button
                        type="button"
                        onClick={() => void handleResendCode()}
                        disabled={loading}
                        className="mt-2 cursor-pointer text-sm font-medium text-sky-400 transition hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {lang === "ja" ? "コードを再送信" : "Resend Code"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ====================================== */}
              {/* STEP 3 - NEW PASSWORD */}
              {/* ====================================== */}

              {step === "reset" && (
                <motion.div
                  key="reset"
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -18,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <div className="mb-7">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10">
                      <Lock className="h-6 w-6 text-sky-400" />
                    </div>

                    <h1 className="text-3xl font-semibold text-white">
                      {lang === "ja"
                        ? "新しいパスワードを設定"
                        : "Create new password"}
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {lang === "ja"
                        ? "アカウント用の新しいパスワードを入力してください。"
                        : "Enter a new password for your account."}
                    </p>
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      void handleResetPassword();
                    }}
                    className="space-y-5"
                  >
                    <PasswordField
                      id="new-password"
                      label={
                        lang === "ja" ? "新しいパスワード" : "New Password"
                      }
                      value={password}
                      showPassword={showPassword}
                      onChange={setPassword}
                      onToggle={() => setShowPassword((previous) => !previous)}
                      error={errors.password}
                      disabled={loading}
                    />

                    <PasswordField
                      id="confirm-password"
                      label={
                        lang === "ja" ? "パスワード確認" : "Confirm Password"
                      }
                      value={confirmPassword}
                      showPassword={showConfirmPassword}
                      onChange={setConfirmPassword}
                      onToggle={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                      error={errors.confirmPassword}
                      disabled={loading}
                    />

                    <p className="text-xs leading-5 text-slate-500">
                      {lang === "ja"
                        ? "パスワードは8文字以上で設定してください。"
                        : "Your password must contain at least 8 characters."}
                    </p>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />}

                      {loading
                        ? lang === "ja"
                          ? "変更中..."
                          : "Resetting..."
                        : lang === "ja"
                          ? "パスワードを変更"
                          : "Reset Password"}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ====================================== */}
              {/* STEP 4 - SUCCESS */}
              {/* ====================================== */}

              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{
                    opacity: 0,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="py-4 text-center"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  </div>

                  <h1 className="mt-6 text-3xl font-semibold text-white">
                    {lang === "ja" ? "パスワード変更完了" : "Password updated"}
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {lang === "ja"
                      ? "パスワードが正常に変更されました。新しいパスワードでログインしてください。"
                      : "Your password has been reset successfully. You can now sign in using your new password."}
                  </p>

                  <button
                    type="button"
                    onClick={goToLogin}
                    className="mt-7 inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
                  >
                    {lang === "ja" ? "ログインへ" : "Back to Login"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  showPassword: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
  error?: string;
  disabled?: boolean;
};

function PasswordField({
  id,
  label,
  value,
  showPassword,
  onChange,
  onToggle,
  error,
  disabled = false,
}: PasswordFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-300"
      >
        {label}
      </label>

      <div
        className={`flex items-center gap-3 rounded-2xl border bg-white/5 px-4 py-3 transition focus-within:border-sky-400 ${
          error ? "border-red-400/70" : "border-white/10"
        }`}
      >
        <Lock className="h-5 w-5 shrink-0 text-slate-400" />

        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          autoComplete="new-password"
          placeholder="••••••••"
          className="w-full bg-transparent text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="cursor-pointer text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
