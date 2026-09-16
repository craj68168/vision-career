"use client";

import { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";

import { loginAdmin } from "./api";

import type { AdminApiErrorResponse, AdminLoginPayload } from "./types";

// ======================================================
// ADMIN LOGIN HOOK
// ======================================================

export const useAdminLogin = () => {
  const router = useRouter();

  const { lang } = useLanguage();

  const [loginData, setLoginData] = useState<AdminLoginPayload>({
    username: "",

    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ======================================================
  // UPDATE FIELD
  // ======================================================

  const updateField = (
    name: keyof AdminLoginPayload,

    value: string,
  ) => {
    setLoginData((previous) => ({
      ...previous,

      [name]: value,
    }));
  };

  // ======================================================
  // LOGIN
  // ======================================================

  const handleLogin = async () => {
    if (!loginData.username.trim() || !loginData.password) {
      toast.error(
        lang === "ja"
          ? "ユーザー名とパスワードを入力してください"
          : "Please enter your username and password.",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const response = await loginAdmin({
        username: loginData.username.trim(),

        password: loginData.password,
      });

      // ================================================
      // STANDARD AUTH STORAGE
      // ================================================

      localStorage.setItem("access_token", response.token);

      localStorage.setItem("user_role", "admin");

      // ================================================
      // REMOVE LEGACY PHP TOKEN
      // ================================================

      localStorage.removeItem("admin_token");

      toast.success(
        response.message ||
          (lang === "ja" ? "ログインしました" : "Login successful."),
      );

      router.replace(lang === "ja" ? "/admin" : "/en/admin");
    } catch (error: unknown) {
      console.error("Admin login error:", error);

      if (axios.isAxiosError<AdminApiErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message ||
            (lang === "ja" ? "ログインに失敗しました" : "Login failed."),
        );

        return;
      }

      toast.error(lang === "ja" ? "ログインに失敗しました" : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    loginData,

    isSubmitting,

    updateField,

    handleLogin,
  };
};
