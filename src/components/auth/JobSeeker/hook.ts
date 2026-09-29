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

export const useJobSeekerAuth = () => {
  const router = useRouter();
  const t = useTranslations("jobSeeker.auth");
  const { lang } = useLanguage();
  const [mode, setMode] = useState<AuthMode>("login");
  const [registerData, setRegisterData] = useState<JobSeekerRegisterData>({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState<JobSeekerLoginData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validationMessages = {
    nameRequired: t("nameRequired"),
    emailRequired: t("emailRequired"),
    emailInvalid: t("emailInvalid"),
    passwordRequired: t("passwordRequired"),
    passwordMinLength: t("passwordMinLength"),
  };

  const handleRegisterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleRegister = async () => {
    const validationErrors = validateRegister(registerData, validationMessages);
    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const data = await registerJobSeeker(registerData);
      console.log("Job seeker registration response:", data);
      toast.success(data.message || t("registrationSuccess"));
      setRegisterData({
        name: "",
        email: "",
        password: "",
      });

      setMode("login");
    } catch (error: unknown) {
      console.error("Job seeker registration error:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || t("registrationFailed"),
        );

        return;
      }

      toast.error(t("registrationFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    const validationErrors = validateLogin(loginData, validationMessages);

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    try {
      setIsSubmitting(true);
      setErrors({});

      const data = await loginJobSeeker(loginData);

      console.log("Job seeker login response:", data);

      if (data.status === "pending_approval") {
        toast.error(
          data.message || t("pendingApproval"),
        );
        return;
      }

      if (!data.token) {
        toast.error(data.message || t("loginFailed"));
        return;
      }

      localStorage.setItem("access_token", data.token);
      localStorage.setItem("user_role", data.user?.role || "seeker");
      toast.success(data.message || t("loginSuccess"));
      router.push(lang === "ja" ? "/job-seekers" : "/en/job-seekers");
    } catch (error: unknown) {
      console.error("Job seeker login error:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || t("loginFailed"),
        );

        return;
      }
      toast.error(t("loginFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

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
