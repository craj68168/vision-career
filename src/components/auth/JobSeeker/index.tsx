"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { useJobSeekerAuth } from "./hook";
export default function JobSeekerAuth() {
  const router = useRouter();
  const pathname = usePathname();

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

  const handleLangChange = (targetLang: "en" | "ja") => {
    if (lang === targetLang) return;

    if (targetLang === "en") {
      router.push(`/en${pathname}`);
    } else {
      const newPath = pathname.replace(/^\/en/, "") || "/";
      router.push(newPath);
    }
  };

  const content = {
    portalTitle: lang === "ja" ? "求職者ポータル" : "Job Seeker Portal",

    mainTitle: lang === "ja" ? "次の仕事を見つける" : "Find your next",

    mainTitleHighlight: lang === "ja" ? "理想の仕事" : "dream job",

    description:
      lang === "ja"
        ? "求人情報の検索、応募、追跡をすべて一箇所で。あなたの可能性を発見しようとするトップ雇用主とつながりましょう。"
        : "Search, apply, and track job opportunities all in one place. Connect with top employers ready to discover your potential.",

    employerText:
      lang === "ja"
        ? "候補者を探していますか？"
        : "Are you looking for a candidate?",

    employerLink: lang === "ja" ? "こちらから登録" : "Sign up here",

    loginTab: lang === "ja" ? "ログイン" : "Login",

    registerTab: lang === "ja" ? "登録" : "Register",
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="fixed bottom-5 right-5 z-50">
        <button
          type="button"
          onClick={() => handleLangChange(lang === "ja" ? "en" : "ja")}
          className="group relative flex h-12 w-12 items-center text-white justify-center rounded-full bg-neutral-800/90 backdrop-blur-md hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-white/20"
        >
          <span className="text-lg font-semibold">
            {lang === "ja" ? "🇯🇵" : "🇺🇸"}
          </span>
        </button>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <section className="flex flex-col justify-between p-10 bg-white/5 border-r border-white/10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
              {content.portalTitle}
            </p>

            <h1 className="mt-4 text-4xl font-semibold text-white leading-tight">
              {content.mainTitle}

              <span className="block text-sky-400">
                {content.mainTitleHighlight}
              </span>
            </h1>

            <p className="mt-5 text-slate-300 max-w-md leading-7">
              {content.description}
            </p>

            <p className="my-5 text-slate-300 max-w-md leading-7">
              {content.employerText}{" "}
              <a
                href={lang === "ja" ? "/auth" : "/en/auth"}
                className="underline"
              >
                {content.employerLink}
              </a>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-semibold text-white">
                {lang === "ja" ? "検索" : "Search"}
              </p>

              <p className="mt-2 text-sm text-slate-300">
                {lang === "ja"
                  ? "数千もの求人を数分で探索"
                  : "Explore thousands of job openings in minutes."}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-semibold text-white">
                {lang === "ja" ? "応募" : "Apply"}
              </p>

              <p className="mt-2 text-sm text-slate-300">
                {lang === "ja"
                  ? "簡単に応募書類を提出し、進捗を追跡"
                  : "Submit applications and track your progress effortlessly."}
              </p>
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-10 bg-slate-950/70">
          <div className="mx-auto w-full max-w-md">
            <div className="inline-flex rounded-2xl bg-white/5 p-1 border border-white/10 mb-8">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`relative px-5 py-2.5 rounded-xl cursor-pointer text-sm font-medium ${
                  mode === "login" ? "text-white" : "text-slate-400"
                }`}
              >
                {mode === "login" && (
                  <motion.span
                    layoutId="authTab"
                    className="absolute inset-0 rounded-xl bg-sky-500"
                  />
                )}

                <span className="relative z-10">{content.loginTab}</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("register")}
                className={`relative px-5 py-2.5 rounded-xl cursor-pointer text-sm font-medium ${
                  mode === "register" ? "text-white" : "text-slate-400"
                }`}
              >
                {mode === "register" && (
                  <motion.span
                    layoutId="authTab"
                    className="absolute inset-0 rounded-xl bg-sky-500"
                  />
                )}

                <span className="relative z-10">{content.registerTab}</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                >
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleLogin();
                    }}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 shadow-xl"
                  >
                    <h2 className="text-3xl font-semibold text-white">
                      {lang === "ja" ? "サインイン" : "Sign in"}
                    </h2>

                    <p className="mt-2 text-slate-400">
                      {lang === "ja"
                        ? "メールアドレスとパスワードでアカウントにアクセスします。"
                        : "Access your account with your email and password."}
                    </p>

                    <div className="mt-8 space-y-4">
                      <InputField
                        label={lang === "ja" ? "メールアドレス" : "Email"}
                        name="email"
                        type="email"
                        value={loginData.email}
                        placeholder="you@example.com"
                        icon={Mail}
                        error={errors.email}
                        onChange={handleLoginChange}
                      />

                      <InputField
                        label={lang === "ja" ? "パスワード" : "Password"}
                        name="password"
                        type="password"
                        value={loginData.password}
                        placeholder="••••••••"
                        icon={Lock}
                        error={errors.password}
                        onChange={handleLoginChange}
                      />

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              lang === "ja"
                                ? "/job-seekers-auth/forgot-password"
                                : "/en/job-seekers-auth/forgot-password",
                            )
                          }
                          className="cursor-pointer text-sm font-medium text-sky-400 transition hover:text-sky-300 hover:underline"
                        >
                          {lang === "ja"
                            ? "パスワードを忘れた方"
                            : "Forgot password?"}
                        </button>
                      </div>

                      <SubmitButton
                        isSubmitting={isSubmitting}
                        lang={lang}
                        label={lang === "ja" ? "ログイン" : "Login"}
                      />
                    </div>

                    <p className="mt-6 text-sm text-slate-400">
                      {lang === "ja"
                        ? "アカウントをお持ちでないですか？"
                        : "Don't have an account?"}{" "}
                      <button
                        type="button"
                        onClick={() => setMode("register")}
                        className="text-sky-400"
                      >
                        {lang === "ja" ? "作成する" : "Create one"}
                      </button>
                    </p>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                >
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleRegister();
                    }}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 shadow-xl"
                  >
                    <h2 className="text-3xl font-semibold text-white">
                      {lang === "ja" ? "アカウント作成" : "Create account"}
                    </h2>

                    <p className="mt-2 text-slate-400">
                      {lang === "ja"
                        ? "数秒で新しいアカウントを作成します。"
                        : "Start with a new account in just a few seconds."}
                    </p>

                    <div className="mt-8 space-y-4">
                      <InputField
                        label={lang === "ja" ? "氏名" : "Full name"}
                        name="name"
                        type="text"
                        value={registerData.name}
                        placeholder={lang === "ja" ? "山田 太郎" : "Jane Doe"}
                        icon={User}
                        error={errors.name}
                        onChange={handleRegisterChange}
                      />

                      <InputField
                        label={lang === "ja" ? "メールアドレス" : "Email"}
                        name="email"
                        type="email"
                        value={registerData.email}
                        placeholder="you@example.com"
                        icon={Mail}
                        error={errors.email}
                        onChange={handleRegisterChange}
                      />

                      <InputField
                        label={lang === "ja" ? "パスワード" : "Password"}
                        name="password"
                        type="password"
                        value={registerData.password}
                        placeholder="••••••••"
                        icon={Lock}
                        error={errors.password}
                        onChange={handleRegisterChange}
                      />

                      <SubmitButton
                        isSubmitting={isSubmitting}
                        lang={lang}
                        label={lang === "ja" ? "登録" : "Register"}
                      />
                    </div>

                    <p className="mt-6 text-sm text-slate-400">
                      {lang === "ja"
                        ? "すでにアカウントをお持ちですか？"
                        : "Already have an account?"}{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="text-sky-400"
                      >
                        {lang === "ja" ? "サインイン" : "Sign in"}
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
}: InputFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>

      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-sky-400">
        <Icon className="h-5 w-5 text-slate-400" />

        <input
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none"
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </label>
  );
}

function SubmitButton({
  label,
  lang,
  isSubmitting,
}: {
  label: string;
  lang: string;
  isSubmitting: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full rounded-2xl bg-sky-500 px-4 py-3 cursor-pointer text-sm font-semibold text-white shadow-lg shadow-sky-500/20 disabled:opacity-50"
    >
      {isSubmitting ? (lang === "ja" ? "読み込み中..." : "Loading...") : label}
    </button>
  );
}
