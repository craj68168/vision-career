"use client";

import { useState } from "react";

import type { ComponentType, FormEvent } from "react";

import { motion } from "framer-motion";

import { Eye, EyeOff, Lock, User } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";

import { useAdminLogin } from "./hook";

import type { AdminLoginPayload } from "./types";

// ======================================================
// FIELD TYPE
// ======================================================

type Field = {
  label: string;

  name: keyof AdminLoginPayload;

  type: "text" | "password";

  placeholder: string;

  icon: ComponentType<{
    className?: string;
  }>;
};

// ======================================================
// ADMIN LOGIN PAGE
// ======================================================

export default function AuthPage() {
  const { lang } = useLanguage();

  const {
    loginData,

    isSubmitting,

    updateField,

    handleLogin,
  } = useAdminLogin();

  const fields: Field[] = [
    {
      label: lang === "ja" ? "ユーザー名" : "Username",

      name: "username",

      type: "text",

      placeholder: lang === "ja" ? "ユーザー名を入力" : "Enter your username",

      icon: User,
    },

    {
      label: lang === "ja" ? "パスワード" : "Password",

      name: "password",

      type: "password",

      placeholder: "••••••••",

      icon: Lock,
    },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <section className="w-full">
        <div className="mx-auto w-full max-w-md">
          <motion.div
            initial={{
              opacity: 0,

              y: 18,
            }}
            animate={{
              opacity: 1,

              y: 0,
            }}
            transition={{
              duration: 0.28,
            }}
          >
            <AdminLoginForm
              fields={fields}
              loginData={loginData}
              isSubmitting={isSubmitting}
              updateField={updateField}
              handleLogin={handleLogin}
            />
          </motion.div>
        </div>
      </section>
    </main>
  );
}

// ======================================================
// LOGIN FORM
// ======================================================

function AdminLoginForm({
  fields,

  loginData,

  isSubmitting,

  updateField,

  handleLogin,
}: {
  fields: Field[];

  loginData: AdminLoginPayload;

  isSubmitting: boolean;

  updateField: (
    name: keyof AdminLoginPayload,

    value: string,
  ) => void;

  handleLogin: () => Promise<void>;
}) {
  const { lang } = useLanguage();

  const router = useRouter();

  const pathname = usePathname();

  const [showPassword, setShowPassword] = useState(false);

  // ======================================================
  // LANGUAGE
  // ======================================================

  const handleLangChange = (targetLang: "en" | "ja") => {
    if (lang === targetLang) {
      return;
    }

    if (targetLang === "en") {
      if (pathname.startsWith("/en")) {
        return;
      }

      router.push(`/en${pathname}`);

      return;
    }

    const newPath = pathname.replace(/^\/en/, "") || "/";

    router.push(newPath);
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    void handleLogin();
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl sm:p-8">
      <h2 className="text-3xl font-semibold text-white">
        {lang === "ja" ? "サインイン" : "Sign in"}
      </h2>

      <p className="mt-2 text-slate-400">
        {lang === "ja"
          ? "ユーザー名とパスワードを使用して、管理アカウントにアクセスしてください。"
          : "Access the Admin Panel using your username and password."}
      </p>

      {/* ================================================
          LANGUAGE BUTTON
      ================================================= */}

      <div className="fixed bottom-5 right-5 z-50">
        <button
          type="button"
          onClick={() => handleLangChange(lang === "ja" ? "en" : "ja")}
          className="group relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-neutral-800/90 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-neutral-700/90 hover:shadow-xl"
          aria-label="Toggle language"
        >
          <span className="text-lg font-semibold">
            {lang === "ja" ? "🇯🇵" : "🇺🇸"}
          </span>

          <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-md bg-neutral-800/90 px-2 py-1 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
            {lang === "ja" ? "Switch to English" : "Switch to Japanese"}
          </span>
        </button>
      </div>

      {/* ================================================
          FORM
      ================================================= */}

      <form onSubmit={submitForm} className="mt-8 space-y-4">
        {fields.map((field) => {
          const Icon = field.icon;

          const isPassword = field.name === "password";

          return (
            <label key={field.name} className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">
                {field.label}
              </span>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition focus-within:border-sky-400">
                <Icon className="h-5 w-5 text-slate-400" />

                <input
                  name={field.name}
                  type={isPassword && showPassword ? "text" : field.type}
                  placeholder={field.placeholder}
                  value={loginData[field.name]}
                  onChange={(event) =>
                    updateField(
                      field.name,

                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  className="w-full bg-transparent text-white outline-none placeholder:text-slate-500 disabled:opacity-60"
                  required
                />

                {isPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-300 transition hover:text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-300 transition hover:text-slate-500" />
                    )}
                  </button>
                )}
              </div>
            </label>
          );
        })}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? lang === "ja"
              ? "ログイン中..."
              : "Logging in..."
            : lang === "ja"
              ? "ログイン"
              : "Login"}
        </button>
      </form>
    </div>
  );
}
