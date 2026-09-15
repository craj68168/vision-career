"use client";

import { useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useLanguage } from "@/context/LanguageContext";

import {
  requestPasswordReset,
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

export const useForgotPassword = (authType: ForgotPasswordAuthType) => {
  const router = useRouter();
  const { lang } = useLanguage();

  const [step, setStep] = useState<ForgotPasswordStep>("email");

  const [email, setEmail] = useState("");

  const [code, setCode] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetToken, setResetToken] = useState("");

  const [errors, setErrors] = useState<ForgotPasswordErrors>({});

  const [loading, setLoading] = useState(false);

  // =====================================
  // CONFIG
  // =====================================

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

  // =====================================
  // ERROR
  // =====================================

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      return (
        error.response?.data?.message ||
        (lang === "ja" ? "処理に失敗しました" : "Something went wrong")
      );
    }

    return lang === "ja" ? "処理に失敗しました" : "Something went wrong";
  };

  // =====================================
  // SEND CODE
  // =====================================

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
      setErrors({});
      setStep("code");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // VERIFY CODE
  // =====================================

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

      setStep("reset");

      setErrors({});
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // RESEND
  // =====================================

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

  // =====================================
  // RESET PASSWORD
  // =====================================

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

  const goToLogin = () => {
    router.push(loginPath);
  };

  const goBackToEmail = () => {
    setStep("email");
    setCode("");
    setResetToken("");
    setErrors({});
  };

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

    handleRequestCode,
    handleVerifyCode,
    handleResendCode,
    handleResetPassword,

    goBackToEmail,
    goToLogin,
  };
};
