"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useLanguage } from "@/context/LanguageContext";

import {
  requestPasswordReset,
  submitInitialPassword,
  submitNewPassword,
  verifyPasswordResetCode,
} from "./api";

import {
  validateNewPassword,
  validateResetCode,
  validateResetEmail,
} from "./validation";

import type {
  ApiErrorResponse,
  ForgotPasswordAuthType,
  ForgotPasswordErrors,
  ForgotPasswordStep,
} from "./types";

// ======================================================
// FORGOT PASSWORD / INITIAL PASSWORD SETUP
// ======================================================

export const useForgotPassword = (authType: ForgotPasswordAuthType) => {
  const router = useRouter();

  const { lang } = useLanguage();

  const [step, setStep] = useState<ForgotPasswordStep>("email");

  const [email, setEmail] = useState("");

  const [code, setCode] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetToken, setResetToken] = useState("");

  const [setupToken, setSetupToken] = useState("");

  const [isInitialSetup, setIsInitialSetup] = useState(false);

  const [errors, setErrors] = useState<ForgotPasswordErrors>({});

  const [loading, setLoading] = useState(false);

  // ====================================================
  // CONFIG
  // ====================================================

  const authBaseUrl =
    authType === "seeker" ? "/seekers/auth" : "/auth/providers";

  const loginPath =
    authType === "seeker"
      ? lang === "ja"
        ? "/job-seekers-auth"
        : "/en/job-seekers-auth"
      : lang === "ja"
        ? "/auth"
        : "/en/auth";

  // ====================================================
  // READ INITIAL PASSWORD SETUP TOKEN
  //
  // Example:
  //
  // /job-seekers-auth/forgot-password
  // ?setup_token=xxxxxxxx
  //
  // State updates are placed inside setTimeout so they
  // are not executed synchronously inside the effect.
  // ====================================================

  useEffect(() => {
    if (authType !== "seeker" || typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);

    const token = params.get("setup_token");

    if (!token) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSetupToken(token);

      setIsInitialSetup(true);

      setStep("reset");

      setErrors({});
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [authType]);

  // ====================================================
  // GET API ERROR MESSAGE
  // ====================================================

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      return (
        error.response?.data?.message ||
        (lang === "ja" ? "処理に失敗しました" : "Something went wrong")
      );
    }

    return lang === "ja" ? "処理に失敗しました" : "Something went wrong";
  };

  // ====================================================
  // SEND RESET CODE
  // ====================================================

  const handleRequestCode = async () => {
    const validationErrors = validateResetEmail(email, lang);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const response = await requestPasswordReset(authBaseUrl, email.trim());

      toast.success(response.message);

      setCode("");

      setResetToken("");

      setSetupToken("");

      setIsInitialSetup(false);

      setErrors({});

      setStep("code");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // VERIFY RESET CODE
  // ====================================================

  const handleVerifyCode = async () => {
    const validationErrors = validateResetCode(code, lang);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const response = await verifyPasswordResetCode(
        authBaseUrl,
        email.trim(),
        code,
      );

      if (!response.reset_token) {
        toast.error(
          lang === "ja"
            ? "リセットセッションを開始できません"
            : "Unable to start reset session",
        );

        return;
      }

      setResetToken(response.reset_token);

      setSetupToken("");

      setIsInitialSetup(false);

      setStep("reset");

      setErrors({});
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // RESEND CODE
  // ====================================================

  const handleResendCode = async () => {
    try {
      setLoading(true);

      const response = await requestPasswordReset(authBaseUrl, email.trim());

      setCode("");

      setErrors({});

      toast.success(response.message);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // RESET / INITIAL SET PASSWORD
  // ====================================================

  const handleResetPassword = async () => {
    const validationErrors = validateNewPassword(
      password,
      confirmPassword,
      lang,
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // ==================================================
    // ADMIN-CREATED SEEKER
    // ==================================================

    if (isInitialSetup) {
      if (!setupToken) {
        toast.error(
          lang === "ja"
            ? "パスワード設定リンクが無効です"
            : "Password setup link is invalid",
        );

        return;
      }

      try {
        setLoading(true);

        const response = await submitInitialPassword(
          setupToken,
          password,
          confirmPassword,
        );

        toast.success(response.message);

        setPassword("");

        setConfirmPassword("");

        setSetupToken("");

        /*
         * IMPORTANT:
         *
         * Do not set:
         *
         * setIsInitialSetup(false)
         *
         * here.
         *
         * We keep it true so the success page can
         * correctly display:
         *
         * "Password created"
         *
         * instead of:
         *
         * "Password updated"
         */

        // Remove the sensitive setup token
        // from the browser URL after success.
        if (typeof window !== "undefined") {
          window.history.replaceState({}, "", window.location.pathname);
        }

        setStep("success");
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }

      return;
    }

    // ==================================================
    // NORMAL FORGOT PASSWORD
    // ==================================================

    if (!resetToken) {
      toast.error(
        lang === "ja"
          ? "リセットセッションが無効です"
          : "Reset session is invalid",
      );

      setStep("email");

      return;
    }

    try {
      setLoading(true);

      const response = await submitNewPassword(
        authBaseUrl,
        resetToken,
        password,
        confirmPassword,
      );

      toast.success(response.message);

      setResetToken("");

      setPassword("");

      setConfirmPassword("");

      setStep("success");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // CODE CHANGE
  // ====================================================

  const handleCodeChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 6);

    setCode(numericValue);

    if (errors.code) {
      setErrors((previous) => ({
        ...previous,

        code: undefined,
      }));
    }
  };

  // ====================================================
  // GO TO LOGIN
  // ====================================================

  const goToLogin = () => {
    router.push(loginPath);
  };

  // ====================================================
  // GO BACK
  // ====================================================

  const goBackToEmail = () => {
    // Initial setup does not have
    // email/code steps.
    if (isInitialSetup) {
      goToLogin();

      return;
    }

    setStep("email");

    setCode("");

    setResetToken("");

    setErrors({});
  };

  // ====================================================
  // RETURN
  // ====================================================

  return {
    lang,

    authType,

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

    isInitialSetup,

    handleRequestCode,

    handleVerifyCode,

    handleResendCode,

    handleResetPassword,

    goBackToEmail,

    goToLogin,
  };
};
