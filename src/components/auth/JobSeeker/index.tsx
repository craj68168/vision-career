"use client";

import React from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useTranslations } from "next-intl";

import { usePathname, useRouter } from "next/navigation";

import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";

import { useJobSeekerAuth } from "./hook";

// ======================================================
// LANGUAGE PATH HELPERS
// ======================================================

const isEnglishPath = (pathname: string) =>
  pathname === "/en" || pathname.startsWith("/en/");

const withoutEnglishPrefix = (pathname: string) =>
  pathname === "/en" ? "/" : pathname.replace(/^\/en\//, "/");

// ======================================================
// JOB SEEKER AUTH
// ======================================================

export default function JobSeekerAuth() {
  const router = useRouter();

  const pathname = usePathname();

  const t = useTranslations("jobSeeker.auth");

  const reduceMotion = useReducedMotion();

  const {
    lang,

    mode,

    setMode,

    registerData,

    loginData,

    errors,

    isSubmitting,

    handleRegisterChange,

    handleLoginChange,

    handleRegister,

    handleLogin,
  } = useJobSeekerAuth();

  // ====================================================
  // LANGUAGE CHANGE
  // ====================================================

  const handleLangChange = (targetLang: "en" | "ja") => {
    if (lang === targetLang) {
      return;
    }

    if (targetLang === "en") {
      router.push(isEnglishPath(pathname) ? pathname : `/en${pathname}`);

      return;
    }

    router.push(withoutEnglishPrefix(pathname));
  };

  // ====================================================
  // ROUTES
  // ====================================================

  const employerHref = lang === "ja" ? "/auth" : "/en/auth";

  const forgotHref =
    lang === "ja"
      ? "/job-seekers-auth/forgot-password"
      : "/en/job-seekers-auth/forgot-password";

  // ====================================================
  // MOTION
  // ====================================================

  const panelMotion = reduceMotion
    ? {}
    : {
        initial: {
          opacity: 0,
          y: 12,
        },

        animate: {
          opacity: 1,
          y: 0,
        },

        exit: {
          opacity: 0,
          y: -12,
        },

        transition: {
          duration: 0.2,
        },
      };

  return (
    <main
      lang={lang}
      translate="no"
      className="relative flex min-h-dvh items-center justify-center bg-[#EEF3F2] px-4 py-16 sm:px-6 lg:py-10"
    >
      {/* ================================================= */}
      {/* LANGUAGE SWITCH */}
      {/* ================================================= */}

      <div
        role="group"
        aria-label="Language"
        className="fixed right-4 top-4 z-50 flex rounded-full border border-slate-200 bg-white/90 p-1 text-xs font-semibold shadow-sm backdrop-blur sm:right-6 sm:top-6"
      >
        {(["ja", "en"] as const).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => handleLangChange(code)}
            aria-pressed={lang === code}
            className={`cursor-pointer rounded-full px-3.5 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
              lang === code
                ? "bg-[#0B2A2F] text-white"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {code === "ja" ? "JP" : "EN"}
          </button>
        ))}
      </div>

      {/* ================================================= */}
      {/* MAIN CARD */}
      {/* ================================================= */}

      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-20px_rgba(11,42,47,0.35)] lg:grid-cols-[1.05fr_1fr]">
        {/* =============================================== */}
        {/* BRAND PANEL */}
        {/* =============================================== */}

        <section className="relative flex flex-col justify-between gap-10 overflow-hidden bg-[#0B2A2F] p-7 text-white sm:p-10 lg:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl"
          />

          <div className="relative">
            <p className="text-sm font-medium text-teal-200">
              {t("portalTitle")}
            </p>

            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]">
              {t("mainTitle")}{" "}
              <span className="text-[#99F6E4]">{t("mainTitleHighlight")}</span>
            </h1>

            <p className="mt-5 hidden max-w-md leading-7 text-slate-300 lg:block">
              {t("description")}
            </p>

            <p className="mt-5 hidden max-w-md leading-7 text-slate-300 lg:block">
              {t("employerText")}{" "}
              <a
                href={employerHref}
                className="font-medium text-[#99F6E4] underline underline-offset-4 hover:text-white"
              >
                {t("employerLink")}
              </a>
            </p>
          </div>

          <div className="relative hidden grid-cols-2 gap-4 sm:grid">
            {[
              {
                title: t("searchTitle"),

                desc: t("searchDescription"),
              },

              {
                title: t("applyTitle"),

                desc: t("applyDescription"),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-lg font-semibold">{item.title}</p>

                <p className="mt-1.5 text-sm leading-6 text-slate-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =============================================== */}
        {/* FORM PANEL */}
        {/* =============================================== */}

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            {/* =========================================== */}
            {/* LOGIN / REGISTER TABS */}
            {/* =========================================== */}

            <div
              role="tablist"
              aria-label={t("portalTitle")}
              className="mb-8 grid grid-cols-2 rounded-2xl bg-slate-100 p-1"
            >
              {(["login", "register"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={mode === tab}
                  onClick={() => setMode(tab)}
                  className={`relative cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
                    mode === tab
                      ? "text-teal-800"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {mode === tab && (
                    <motion.span
                      layoutId="authTab"
                      transition={
                        reduceMotion
                          ? {
                              duration: 0,
                            }
                          : {
                              duration: 0.25,
                            }
                      }
                      className="absolute inset-0 rounded-xl bg-white shadow-sm"
                    />
                  )}

                  <span className="relative z-10">
                    {tab === "login" ? t("loginTab") : t("registerTab")}
                  </span>
                </button>
              ))}
            </div>

            {/* =========================================== */}
            {/* AUTH FORMS */}
            {/* =========================================== */}

            <AnimatePresence mode="wait" initial={false}>
              {mode === "login" ? (
                // ========================================
                // LOGIN
                // ========================================

                <motion.div key="login" {...panelMotion}>
                  <form
                    noValidate
                    onSubmit={(event) => {
                      event.preventDefault();

                      void handleLogin();
                    }}
                  >
                    <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                      {t("signInTitle")}
                    </h2>

                    <p className="mt-2 text-slate-600">
                      {t("signInDescription")}
                    </p>

                    <div className="mt-8 space-y-5">
                      <InputField
                        id="login-email"
                        label={t("email")}
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={loginData.email}
                        placeholder={t("emailPlaceholder")}
                        icon={Mail}
                        error={errors.email}
                        onChange={handleLoginChange}
                      />

                      <InputField
                        id="login-password"
                        label={t("password")}
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        value={loginData.password}
                        placeholder={t("passwordPlaceholder")}
                        icon={Lock}
                        error={errors.password}
                        showPasswordLabel={t("showPassword")}
                        hidePasswordLabel={t("hidePassword")}
                        onChange={handleLoginChange}
                      />

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => router.push(forgotHref)}
                          className="cursor-pointer rounded text-sm font-medium text-teal-700 transition hover:text-teal-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                        >
                          {t("forgotPassword")}
                        </button>
                      </div>

                      <SubmitButton
                        isSubmitting={isSubmitting}
                        loadingLabel={t("loading")}
                        label={t("loginButton")}
                      />
                    </div>

                    <p className="mt-6 text-center text-sm text-slate-600">
                      {t("noAccount")}{" "}
                      <button
                        type="button"
                        onClick={() => setMode("register")}
                        className="cursor-pointer rounded font-semibold text-teal-700 hover:text-teal-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                      >
                        {t("createOne")}
                      </button>
                    </p>
                  </form>
                </motion.div>
              ) : (
                // ========================================
                // REGISTER
                // ========================================

                <motion.div key="register" {...panelMotion}>
                  <form
                    noValidate
                    onSubmit={(event) => {
                      event.preventDefault();

                      void handleRegister();
                    }}
                  >
                    <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                      {t("createAccountTitle")}
                    </h2>

                    <p className="mt-2 text-slate-600">
                      {t("createAccountDescription")}
                    </p>

                    <div className="mt-8 space-y-5">
                      {/* ================================= */}
                      {/* NAME */}
                      {/* ================================= */}

                      <InputField
                        id="register-name"
                        label={t("fullName")}
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={registerData.name}
                        placeholder={t("namePlaceholder")}
                        icon={User}
                        error={errors.name}
                        onChange={handleRegisterChange}
                      />

                      {/* ================================= */}
                      {/* EMAIL */}
                      {/* ================================= */}

                      <InputField
                        id="register-email"
                        label={t("email")}
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={registerData.email}
                        placeholder={t("emailPlaceholder")}
                        icon={Mail}
                        error={errors.email}
                        onChange={handleRegisterChange}
                      />

                      {/* ================================= */}
                      {/* PHONE - REQUIRED */}
                      {/* ================================= */}

                      <InputField
                        id="register-phone"
                        label={lang === "ja" ? "電話番号" : "Phone Number"}
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={registerData.phone}
                        placeholder={
                          lang === "ja"
                            ? "例: +81 90 1234 5678"
                            : "e.g. +81 90 1234 5678"
                        }
                        icon={Phone}
                        error={errors.phone}
                        onChange={handleRegisterChange}
                      />

                      {/* ================================= */}
                      {/* PASSWORD */}
                      {/* ================================= */}

                      <InputField
                        id="register-password"
                        label={t("password")}
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        value={registerData.password}
                        placeholder={t("passwordPlaceholder")}
                        icon={Lock}
                        error={errors.password}
                        showPasswordLabel={t("showPassword")}
                        hidePasswordLabel={t("hidePassword")}
                        onChange={handleRegisterChange}
                      />

                      <SubmitButton
                        isSubmitting={isSubmitting}
                        loadingLabel={t("loading")}
                        label={t("registerButton")}
                      />
                    </div>

                    <p className="mt-6 text-center text-sm text-slate-600">
                      {t("hasAccount")}{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="cursor-pointer rounded font-semibold text-teal-700 hover:text-teal-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                      >
                        {t("signInLink")}
                      </button>
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* =========================================== */}
            {/* MOBILE EMPLOYER LINK */}
            {/* =========================================== */}

            <p className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-600 lg:hidden">
              {t("employerText")}{" "}
              <a
                href={employerHref}
                className="font-semibold text-teal-700 underline underline-offset-4 hover:text-teal-900"
              >
                {t("employerLink")}
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

// ======================================================
// INPUT FIELD
// ======================================================

type InputFieldProps = {
  id: string;

  label: string;

  name: string;

  type: string;

  value: string;

  placeholder: string;

  autoComplete?: string;

  icon: React.ComponentType<{
    className?: string;
  }>;

  error?: string;

  showPasswordLabel?: string;

  hidePasswordLabel?: string;

  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function InputField({
  id,

  label,

  name,

  type,

  value,

  placeholder,

  autoComplete,

  icon: Icon,

  error,

  showPasswordLabel = "Show password",

  hidePasswordLabel = "Hide password",

  onChange,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const isPassword = type === "password";

  const inputType = isPassword && showPassword ? "text" : type;

  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-800"
      >
        {label}
      </label>

      <div
        className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition focus-within:ring-4 ${
          error
            ? "border-red-400 focus-within:ring-red-100"
            : "border-slate-300 focus-within:border-teal-600 focus-within:ring-teal-100"
        }`}
      >
        <Icon
          className={`h-5 w-5 shrink-0 ${
            error ? "text-red-500" : "text-slate-400"
          }`}
        />

        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
            className="shrink-0 cursor-pointer rounded text-slate-400 transition hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

// ======================================================
// SUBMIT BUTTON
// ======================================================

function SubmitButton({
  label,

  loadingLabel,

  isSubmitting,
}: {
  label: string;

  loadingLabel: string;

  isSubmitting: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSubmitting && (
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
        />
      )}

      {isSubmitting ? loadingLabel : label}
    </button>
  );
}
