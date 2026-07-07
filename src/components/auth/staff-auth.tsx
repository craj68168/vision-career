"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/staff-login.php", loginData);
      const data = await res.data;
      toast.success(data.message);
      localStorage.setItem("staff_token", data.token);
      router.replace(lang === "ja" ? "/staff-training" : "/en/staff-training");
    } catch (error: any) {
      console.log("Error while logging in: ", error);
      toast.error(error.response.data.message);
      router.replace(lang === "ja" ? "/staff-login" : "/en/staff-login");
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = {
    title: lang === "ja" ? "サインイン" : "Sign in",
    subtitle:
      lang === "ja"
        ? "ユーザー名とパスワードを使用して、アカウントにアクセスしてください。"
        : "Access your account with your username and password.",
    fields: [
      {
        label: lang === "ja" ? "ユーザー名" : "Username",
        name: "username",
        type: "username",
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
    ],
    submitLabel: lang === "ja" ? "ログイン" : "Login",
    footer:
      lang === "ja" ? (
        <p className="text-sm text-slate-400">
          アカウントをお持ちでないですか？{" "}
          <button
            type="button"
            onClick={() => setMode("register")}
            className="text-sky-400 cursor-pointer hover:text-sky-300"
          >
            作成する
          </button>
        </p>
      ) : (
        <p className="text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => setMode("register")}
            className="text-sky-400 cursor-pointer hover:text-sky-300"
          >
            Create one
          </button>
        </p>
      ),
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-6 transition-[height] duration-500">
      <section>
        <div className="mx-auto w-full max-w-md">
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.28 }}
          >
            <AuthForm
              title={content.title}
              subtitle={content.subtitle}
              fields={content.fields}
              submitLabel={content.submitLabel}
              footer={content.footer}
              loginData={loginData}
              setLoginData={setLoginData}
              handleLogin={handleLogin}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        </div>
      </section>
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
}) {
  const { lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const handleLangChange = (targetLang: "en" | "ja") => {
    if (lang === targetLang) return;

    if (targetLang === "en") {
      router.push(`/en${pathname}`);
    } else {
      const newPath = pathname.replace(/^\/en/, "") || "/";
      router.push(newPath);
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData &&
      setLoginData({ ...loginData, [event.target.name]: event.target.value });
  };
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 shadow-xl">
      <h2 className="text-3xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-slate-400">{subtitle}</p>
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
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          handleLogin?.();
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
                  className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none"
                  required
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
      {/* <div className="mt-6">{footer}</div> */}
    </div>
  );
}
