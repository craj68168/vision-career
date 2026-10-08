"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";
import axios from "axios";

import { useLanguage } from "@/context/LanguageContext";

import { loginJobSeeker, registerJobSeeker } from "./api";

import {
  hasValidationErrors,
  validateLogin,
  validateRegister,
} from "./validation";

import type {
  AuthMode,
  JobSeekerLoginData,
  JobSeekerRegisterData,
  ValidationErrors,
} from "./types";

// ======================================================
// SAFE RETURN URL
//
// Only allow local application paths.
//
// Allowed:
// /en/jobs/V-000036
// /jobs/V-000036
// /en/job-seekers
//
// Not allowed:
// https://other-site.com
// //other-site.com
//
// This prevents open redirect problems.
// ======================================================

const getSafeReturnTo = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);

  const returnTo = params.get("returnTo");

  if (!returnTo) {
    return null;
  }

  if (!returnTo.startsWith("/")) {
    return null;
  }

  if (returnTo.startsWith("//")) {
    return null;
  }

  return returnTo;
};

// ======================================================
// JOB SEEKER AUTH
// ======================================================

export const useJobSeekerAuth = () => {
  const router = useRouter();

  const t = useTranslations("jobSeeker.auth");

  const { lang } = useLanguage();

  // ====================================================
  // MODE
  // ====================================================

  const [mode, setMode] = useState<AuthMode>("login");

  // ====================================================
  // REGISTER DATA
  // ====================================================

  const [registerData, setRegisterData] = useState<JobSeekerRegisterData>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // ====================================================
  // LOGIN DATA
  // ====================================================

  const [loginData, setLoginData] = useState<JobSeekerLoginData>({
    email: "",
    password: "",
  });

  // ====================================================
  // VALIDATION
  // ====================================================

  const [errors, setErrors] = useState<ValidationErrors>({});

  // ====================================================
  // LOADING
  // ====================================================

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ====================================================
  // VALIDATION MESSAGES
  // ====================================================

  const validationMessages = {
    nameRequired: t("nameRequired"),

    emailRequired: t("emailRequired"),

    emailInvalid: t("emailInvalid"),

    phoneRequired:
      lang === "ja" ? "電話番号を入力してください" : "Phone number is required",

    phoneInvalid:
      lang === "ja"
        ? "有効な電話番号を入力してください"
        : "Please enter a valid phone number",

    passwordRequired: t("passwordRequired"),

    passwordMinLength: t("passwordMinLength"),
  };

  // ====================================================
  // REGISTER INPUT CHANGE
  // ====================================================

  const handleRegisterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setRegisterData((previous) => ({
      ...previous,

      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,

      [name]: undefined,
    }));
  };

  // ====================================================
  // LOGIN INPUT CHANGE
  // ====================================================

  const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setLoginData((previous) => ({
      ...previous,

      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,

      [name]: undefined,
    }));
  };

  // ====================================================
  // REGISTER
  // ====================================================

  const handleRegister = async () => {
    const validationErrors = validateRegister(registerData, validationMessages);

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);

      return;
    }

    try {
      setIsSubmitting(true);

      setErrors({});

      const data = await registerJobSeeker({
        name: registerData.name.trim(),

        email: registerData.email.trim().toLowerCase(),

        phone: registerData.phone.trim(),

        password: registerData.password,
      });

      console.log("Job seeker registration response:", data);

      toast.success(data.message || t("registrationSuccess"));

      setRegisterData({
        name: "",
        email: "",
        phone: "",
        password: "",
      });

      // ------------------------------------------------
      // Registration does NOT redirect to the job yet.
      //
      // The new account still requires Admin approval.
      // After approval the seeker can login and the
      // returnTo URL will be respected.
      // ------------------------------------------------

      setMode("login");
    } catch (error: unknown) {
      console.error("Job seeker registration error:", error);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || t("registrationFailed"));

        return;
      }

      toast.error(t("registrationFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ====================================================
  // LOGIN
  // ====================================================

  const handleLogin = async () => {
    const validationErrors = validateLogin(loginData, validationMessages);

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);

      return;
    }

    try {
      setIsSubmitting(true);

      setErrors({});

      const data = await loginJobSeeker({
        email: loginData.email.trim().toLowerCase(),

        password: loginData.password,
      });

      console.log("Job seeker login response:", data);

      // ==============================================
      // PENDING APPROVAL
      // ==============================================

      if (data.status === "pending_approval") {
        toast.error(data.message || t("pendingApproval"));

        return;
      }

      // ==============================================
      // INITIAL PASSWORD SETUP REQUIRED
      // ==============================================

      if (data.status === "password_setup_required") {
        toast.error(
          data.message ||
            (lang === "ja"
              ? "メールに記載されたリンクからパスワードを設定してください。"
              : "Please set your password using the link sent to your email."),
        );

        return;
      }

      // ==============================================
      // TOKEN REQUIRED
      // ==============================================

      if (!data.token) {
        toast.error(data.message || t("loginFailed"));

        return;
      }

      // ==============================================
      // SAVE AUTH
      // ==============================================

      localStorage.setItem("access_token", data.token);

      localStorage.setItem("user_role", data.user?.role || "seeker");

      toast.success(data.message || t("loginSuccess"));

      // ==============================================
      // RETURN TO ORIGINAL PAGE
      //
      // Example:
      //
      // User was viewing:
      // /en/jobs/V-000036
      //
      // Apply →
      // /en/job-seekers-auth
      //   ?returnTo=/en/jobs/V-000036
      //
      // Login success →
      // /en/jobs/V-000036
      //
      // ==============================================

      const returnTo = getSafeReturnTo();

      if (returnTo) {
        router.replace(returnTo);

        return;
      }

      // ==============================================
      // NORMAL LOGIN
      // ==============================================

      router.replace(lang === "ja" ? "/job-seekers" : "/en/job-seekers");
    } catch (error: unknown) {
      console.error("Job seeker login error:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.data?.status;

        // ============================================
        // PENDING APPROVAL
        // ============================================

        if (status === "pending_approval") {
          toast.error(error.response?.data?.message || t("pendingApproval"));

          return;
        }

        // ============================================
        // PASSWORD SETUP REQUIRED
        // ============================================

        if (status === "password_setup_required") {
          toast.error(
            error.response?.data?.message ||
              (lang === "ja"
                ? "メールに記載されたリンクからパスワードを設定してください。"
                : "Please set your password using the link sent to your email."),
          );

          return;
        }

        toast.error(error.response?.data?.message || t("loginFailed"));

        return;
      }

      toast.error(t("loginFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ====================================================
  // RETURN
  // ====================================================

  return {
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
  };
};
