"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Building } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [registerData, setRegisterData] = useState({
    name: "",
    company_name: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/register.php", registerData);
      const data = await res.data;

      if (data.status === "error") {
        toast.error(data.message);
        return;
      } else {
        toast.success(data.message);
      }
      const response = await axiosInstance.post("/login.php", {
        email: registerData.email,
        password: registerData.password,
      });
      const loginData = await response.data;
      localStorage.setItem("token", loginData.token);
      router.push(lang === "ja" ? "/" : "/en");
    } catch (error: any) {
      console.log("Error while registering: ", error);
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleLogin = async () => {
    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/login.php", loginData);
      const data = await res.data;
      toast.success(data.message);
      localStorage.setItem("token", data.token);
      router.push(lang === "ja" ? "/" : "/en");
    } catch (error: any) {
      console.log("Error while logging in: ", error);
      toast.error(error.response.data.message || "Error while logging in");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    mainTitle: lang === "ja" ? "次の求人を見つける" : "Find your next",
    mainTitleHighlight: lang === "ja" ? "理想の候補者" : "dream candidate",
    description:
      lang === "ja"
        ? "求人情報の投稿、管理、追跡をすべて一箇所で。あなたのチームに加わる才能あるプロフェッショナルとつながりましょう。"
        : "Post, manage, and track job vacancies all in one place. Connect with talented professionals ready to join your team.",
    jobSeekerText:
      lang === "ja" ? "仕事を探していますか？" : "Are you looking for a job?",
    jobSeekerLink:
      lang === "ja" ? "登録して今すぐ応募" : "Apply Now by registering",
    postCard: {
      title: lang === "ja" ? "投稿" : "Post",
      description:
        lang === "ja"
          ? "数分で求人を作成・公開"
          : "Create and publish job openings in minutes.",
    },
    manageCard: {
      title: lang === "ja" ? "管理" : "Manage",
      description:
        lang === "ja"
          ? "応募を追跡し、すべての求人を管理"
          : "Track applications and manage all your vacancies.",
    },
    loginTab: lang === "ja" ? "ログイン" : "Login",
    registerTab: lang === "ja" ? "登録" : "Register",
    loginForm: {
      title: lang === "ja" ? "サインイン" : "Sign in",
      subtitle:
        lang === "ja"
          ? "メールアドレスとパスワードでアカウントにアクセスします。"
          : "Access your account with your email and password.",
      fields: [
        {
          label: lang === "ja" ? "メールアドレス" : "Email",
          name: "email",
          type: "email",
          placeholder: "you@example.com",
          icon: Mail,
        },
        {
          label: lang === "ja" ? "パスワード" : "Password",
          name: "password",
          type: "password",
          placeholder: "••••••••",
          icon: Lock,
        },
      ],
      submitLabel: lang === "ja" ? "ログイン" : "Login",
      footerText:
        lang === "ja"
          ? "アカウントをお持ちでないですか？"
          : "Don't have an account?",
      footerButton: lang === "ja" ? "作成する" : "Create one",
    },
    registerForm: {
      title: lang === "ja" ? "アカウント作成" : "Create account",
      subtitle:
        lang === "ja"
          ? "数秒で新しいアカウントを作成します。"
          : "Start with a new account in just a few seconds.",
      fields: [
        {
          label: lang === "ja" ? "氏名" : "Full name",
          name: "name",
          type: "text",
          placeholder: lang === "ja" ? "山田 太郎" : "Jane Doe",
          icon: User,
        },
        {
          label: lang === "ja" ? "会社名" : "Company name",
          name: "company_name",
          type: "text",
          placeholder: lang === "ja" ? "株式会社 XYZ" : "XYZ Inc.",
          icon: Building,
        },
        {
          label: lang === "ja" ? "メールアドレス" : "Email",
          name: "email",
          type: "email",
          placeholder: "you@example.com",
          icon: Mail,
        },
        {
          label: lang === "ja" ? "パスワード" : "Password",
          name: "password",
          type: "password",
          placeholder: "••••••••",
          icon: Lock,
        },
      ],
      submitLabel: lang === "ja" ? "登録" : "Register",
      footerText:
        lang === "ja"
          ? "すでにアカウントをお持ちですか？"
          : "Already have an account?",
      footerButton: lang === "ja" ? "サインイン" : "Sign in",
    },
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-6 transition-[height] duration-500">
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => handleLangChange(lang === "ja" ? "en" : "ja")}
          className="group relative flex h-12 w-12 items-center text-white justify-center rounded-full bg-neutral-800/90 backdrop-blur-md hover:bg-neutral-700/90 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer border border-white/20"
          aria-label="Toggle language"
        >
          {/* Current language display */}
          <span className="text-lg font-semibold">
            {lang === "ja" ? "🇯🇵" : "🇺🇸"}
          </span>

          {/* Tooltip on hover - shows full language name */}
          <span className="absolute right-full mr-2 px-2 py-1 text-xs font-medium text-white bg-neutral-800/90 backdrop-blur-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {lang === "ja" ? "Switch to English" : "Switch to Japanese"}
          </span>
        </button>
      </div>
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-[height] duration-500">
        <section className="flex flex-col justify-between p-10 bg-white/5 border-r border-white/10 transition-[height] duration-500">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
              Vacancy Portal
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
              {content.jobSeekerText}{" "}
              <a
                href={
                  lang === "ja" ? "/job-seekers-auth" : "/en/job-seekers-auth"
                }
                className="underline"
              >
                {content.jobSeekerLink}
              </a>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-semibold text-white">
                {content.postCard.title}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {content.postCard.description}
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-semibold text-white">
                {content.manageCard.title}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {content.manageCard.description}
              </p>
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-10 bg-slate-950/70 transition-[height] duration-500">
          <div className="mx-auto w-full max-w-md">
            <div className="inline-flex rounded-2xl bg-white/5 p-1 border border-white/10 mb-8">
              <button
                onClick={() => setMode("login")}
                className={`relative px-5 py-2.5 cursor-pointer rounded-xl text-sm font-medium transition ${
                  mode === "login"
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {mode === "login" && (
                  <motion.span
                    layoutId="authTab"
                    className="absolute inset-0 rounded-xl bg-sky-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{content.loginTab}</span>
              </button>

              <button
                onClick={() => setMode("register")}
                className={`relative px-5 py-2.5 cursor-pointer rounded-xl text-sm font-medium transition ${
                  mode === "register"
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {mode === "register" && (
                  <motion.span
                    layoutId="authTab"
                    className="absolute inset-0 rounded-xl bg-sky-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
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
                  transition={{ duration: 0.28 }}
                >
                  <AuthForm
                    title={content.loginForm.title}
                    subtitle={content.loginForm.subtitle}
                    fields={content.loginForm.fields}
                    submitLabel={content.loginForm.submitLabel}
                    footer={
                      <p className="text-sm text-slate-400">
                        {content.loginForm.footerText}{" "}
                        <button
                          type="button"
                          onClick={() => setMode("register")}
                          className="text-sky-400 cursor-pointer hover:text-sky-300"
                        >
                          {content.loginForm.footerButton}
                        </button>
                      </p>
                    }
                    loginData={loginData}
                    setLoginData={setLoginData}
                    handleLogin={handleLogin}
                    isSubmitting={isSubmitting}
                    lang={lang}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.28 }}
                >
                  <AuthForm
                    title={content.registerForm.title}
                    subtitle={content.registerForm.subtitle}
                    fields={content.registerForm.fields}
                    submitLabel={content.registerForm.submitLabel}
                    footer={
                      <p className="text-sm text-slate-400">
                        {content.registerForm.footerText}{" "}
                        <button
                          type="button"
                          onClick={() => setMode("login")}
                          className="text-sky-400 cursor-pointer hover:text-sky-300"
                        >
                          {content.registerForm.footerButton}
                        </button>
                      </p>
                    }
                    registerData={registerData}
                    setRegisterData={setRegisterData}
                    handleRegister={handleRegister}
                    isSubmitting={isSubmitting}
                    lang={lang}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </main>
  );
}

type Field = {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
};

function AuthForm({
  title,
  subtitle,
  fields,
  submitLabel,
  footer,
  registerData,
  setRegisterData,
  handleRegister,
  handleLogin,
  loginData,
  setLoginData,
  isSubmitting,
  lang,
}: {
  title: string;
  subtitle: string;
  fields: Field[];
  submitLabel: string;
  footer: React.ReactNode;
  registerData?: any;
  setRegisterData?: any;
  handleRegister?: () => void;
  handleLogin?: () => void;
  loginData?: any;
  setLoginData?: React.Dispatch<React.SetStateAction<any>>;
  isSubmitting?: boolean;
  lang: string;
}) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (title === "Sign in" || title === "サインイン") {
      setLoginData &&
        setLoginData({ ...loginData, [event.target.name]: event.target.value });
    } else {
      setRegisterData({
        ...registerData,
        [event.target.name]: event.target.value,
      });
    }
  };
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 shadow-xl">
      <h2 className="text-3xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-slate-400">{subtitle}</p>

      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          title === "Sign in" || title === "サインイン"
            ? handleLogin?.()
            : handleRegister?.();
        }}
        className="mt-8 space-y-4"
      >
        {fields.map((field) => {
          const Icon = field.icon;

          return (
            <label key={field.label} className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">
                {field.label}
              </span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-sky-400 transition">
                <Icon className="h-5 w-5 text-slate-400" />
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none"
                />
              </div>
            </label>
          );
        })}

        <button
          type="submit"
          className="w-full rounded-2xl bg-sky-500 cursor-pointer px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:translate-y-[-1px]"
        >
          {isSubmitting
            ? lang === "ja"
              ? "読み込み中..."
              : "Loading..."
            : submitLabel}
        </button>
      </form>

      <div className="mt-6">{footer}</div>
    </div>
  );
}
