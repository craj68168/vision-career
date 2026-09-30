"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useProviderAuth } from "./hook";

export default function ProviderAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("providerAuth");

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
  } = useProviderAuth();

  // ======================================================
  // LANGUAGE
  // ======================================================

  const handleLangChange = (targetLang: "en" | "ja") => {
    if (lang === targetLang) {
      return;
    }

    if (targetLang === "en") {
      router.push(`/en${pathname}`);
      return;
    }

    const newPath = pathname.replace(/^\/en/, "") || "/";

    router.push(newPath);
  };

  // ======================================================
  // CONTENT
  // ======================================================

  const content = {
    portalTitle: t("portalTitle"),
    mainTitle: t("mainTitle"),
    mainTitleHighlight: t("mainTitleHighlight"),
    description: t("description"),
    seekerText: t("seekerText"),
    seekerLink: t("seekerLink"),
    loginTab: t("loginTab"),
    registerTab: t("registerTab"),
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      {/* ====================================== */}
      {/* LANGUAGE BUTTON */}
      {/* ====================================== */}

      <div className="fixed bottom-5 right-5 z-50">
        <button
          type="button"
          onClick={() => handleLangChange(lang === "ja" ? "en" : "ja")}
          aria-label={t("a11y.switchLanguage")}
          className="group relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-neutral-800/90 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-neutral-700/90"
        >
          <span className="text-lg font-semibold">
            {lang === "ja" ? "🇯🇵" : "🇺🇸"}
          </span>
        </button>
      </div>

      {/* ====================================== */}
      {/* MAIN CARD */}
      {/* ====================================== */}

      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
        {/* ====================================== */}
        {/* LEFT SIDE */}
        {/* ====================================== */}

        <section className="flex flex-col justify-between border-white/10 bg-white/5 p-8 sm:p-10 lg:border-r">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
              {content.portalTitle}
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
              {content.mainTitle}

              <span className="block text-sky-400">
                {content.mainTitleHighlight}
              </span>
            </h1>

            <p className="mt-5 max-w-md leading-7 text-slate-300">
              {content.description}
            </p>

            <p className="my-5 max-w-md leading-7 text-slate-300">
              {content.seekerText}{" "}
              <button
                type="button"
                onClick={() =>
                  router.push(
                    lang === "ja"
                      ? "/job-seekers-auth"
                      : "/en/job-seekers-auth",
                  )
                }
                className="cursor-pointer text-sky-400 underline transition hover:text-sky-300"
              >
                {content.seekerLink}
              </button>
            </p>
          </div>

          {/* INFO CARDS */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-semibold text-white">
                {t("features.postJobs.title")}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                {t("features.postJobs.description")}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-semibold text-white">
                {t("features.recruit.title")}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                {t("features.recruit.description")}
              </p>
            </div>
          </div>
        </section>

        {/* ====================================== */}
        {/* RIGHT SIDE */}
        {/* ====================================== */}

        <section className="bg-slate-950/70 p-6 sm:p-10">
          <div className="mx-auto w-full max-w-md">
            {/* ====================================== */}
            {/* TABS */}
            {/* ====================================== */}

            <div className="mb-8 inline-flex rounded-2xl border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`relative cursor-pointer rounded-xl px-5 py-2.5 text-sm font-medium ${
                  mode === "login" ? "text-white" : "text-slate-400"
                }`}
              >
                {mode === "login" && (
                  <motion.span
                    layoutId="providerAuthTab"
                    className="absolute inset-0 rounded-xl bg-sky-500"
                  />
                )}

                <span className="relative z-10">{content.loginTab}</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("register")}
                className={`relative cursor-pointer rounded-xl px-5 py-2.5 text-sm font-medium ${
                  mode === "register" ? "text-white" : "text-slate-400"
                }`}
              >
                {mode === "register" && (
                  <motion.span
                    layoutId="providerAuthTab"
                    className="absolute inset-0 rounded-xl bg-sky-500"
                  />
                )}

                <span className="relative z-10">{content.registerTab}</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {/* ====================================== */}
              {/* LOGIN */}
              {/* ====================================== */}

              {mode === "login" ? (
                <motion.div
                  key="provider-login"
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
                >
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();

                      void handleLogin();
                    }}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl sm:p-8"
                  >
                    <h2 className="text-3xl font-semibold text-white">
                      {t("login.title")}
                    </h2>

                    <p className="mt-2 text-slate-400">
                      {t("login.description")}
                    </p>

                    <div className="mt-8 space-y-4">
                      <InputField
                        label={t("fields.email")}
                        name="email"
                        type="email"
                        value={loginData.email}
                        placeholder="company@example.com"
                        icon={Mail}
                        error={errors.email}
                        onChange={handleLoginChange}
                        autoComplete="email"
                      />

                      <InputField
                        label={t("fields.password")}
                        name="password"
                        type="password"
                        value={loginData.password}
                        placeholder="••••••••"
                        icon={Lock}
                        error={errors.password}
                        onChange={handleLoginChange}
                        autoComplete="current-password"
                        showPasswordLabel={t("a11y.showPassword")}
                        hidePasswordLabel={t("a11y.hidePassword")}
                      />

                      {/* FORGOT PASSWORD */}

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              lang === "ja"
                                ? "/auth/forgot-password"
                                : "/en/auth/forgot-password",
                            )
                          }
                          className="cursor-pointer text-sm font-medium text-sky-400 transition hover:text-sky-300 hover:underline"
                        >
                          {t("login.forgotPassword")}
                        </button>
                      </div>

                      <SubmitButton
                        isSubmitting={isSubmitting}
                        loadingLabel={t("loading")}
                        label={t("login.submit")}
                      />
                    </div>

                    <p className="mt-6 text-sm text-slate-400">
                      {t("login.noAccount")}{" "}
                      <button
                        type="button"
                        onClick={() => setMode("register")}
                        className="cursor-pointer font-medium text-sky-400 transition hover:text-sky-300"
                      >
                        {t("login.createOne")}
                      </button>
                    </p>
                  </form>
                </motion.div>
              ) : (
                /* ====================================== */
                /* REGISTER */
                /* ====================================== */

                <motion.div
                  key="provider-register"
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
                >
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();

                      void handleRegister();
                    }}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl sm:p-8"
                  >
                    <h2 className="text-3xl font-semibold text-white">
                      {t("register.title")}
                    </h2>

                    <p className="mt-2 text-slate-400">
                      {t("register.description")}
                    </p>

                    <div className="mt-8 space-y-4">
                      {/* CONTACT PERSON */}

                      <InputField
                        label={t("fields.contactPerson")}
                        name="name"
                        type="text"
                        value={registerData.name}
                        placeholder={t("placeholders.contactPerson")}
                        icon={User}
                        error={errors.name}
                        onChange={handleRegisterChange}
                        autoComplete="name"
                      />

                      {/* COMPANY */}

                      <InputField
                        label={t("fields.companyName")}
                        name="companyName"
                        type="text"
                        value={registerData.companyName}
                        placeholder={t("placeholders.companyName")}
                        icon={Building2}
                        error={errors.companyName}
                        onChange={handleRegisterChange}
                        autoComplete="organization"
                      />

                      {/* EMAIL */}

                      <InputField
                        label={t("fields.email")}
                        name="email"
                        type="email"
                        value={registerData.email}
                        placeholder="company@example.com"
                        icon={Mail}
                        error={errors.email}
                        onChange={handleRegisterChange}
                        autoComplete="email"
                      />

                      {/* PASSWORD */}

                      <InputField
                        label={t("fields.password")}
                        name="password"
                        type="password"
                        value={registerData.password}
                        placeholder="••••••••"
                        icon={Lock}
                        error={errors.password}
                        onChange={handleRegisterChange}
                        autoComplete="new-password"
                        showPasswordLabel={t("a11y.showPassword")}
                        hidePasswordLabel={t("a11y.hidePassword")}
                      />

                      <SubmitButton
                        isSubmitting={isSubmitting}
                        loadingLabel={t("loading")}
                        label={t("register.submit")}
                      />
                    </div>

                    <p className="mt-6 text-sm text-slate-400">
                      {t("register.hasAccount")}{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="cursor-pointer font-medium text-sky-400 transition hover:text-sky-300"
                      >
                        {t("register.signIn")}
                      </button>
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
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
  label: string;
  name: string;
  type: string;
  value: string;
  placeholder: string;

  icon: React.ComponentType<{
    className?: string;
  }>;

  error?: string;

  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  autoComplete?: string;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
};

function InputField({
  label,
  name,
  type,
  value,
  placeholder,
  icon: Icon,
  error,
  onChange,
  autoComplete,
  showPasswordLabel,
  hidePasswordLabel,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const isPassword = type === "password";

  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>

      <div
        className={`flex items-center gap-3 rounded-2xl border bg-white/5 px-4 py-3 transition focus-within:border-sky-400 ${
          error ? "border-red-400/70" : "border-white/10"
        }`}
      >
        <Icon className="h-5 w-5 shrink-0 text-slate-400" />

        <input
          name={name}
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete={autoComplete}
          className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            aria-label={
              showPassword ? hidePasswordLabel : showPasswordLabel
            }
            className="shrink-0 cursor-pointer text-slate-400 transition hover:text-white"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </label>
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
      className="w-full cursor-pointer rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isSubmitting ? loadingLabel : label}
    </button>
  );
}
