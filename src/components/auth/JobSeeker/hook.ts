"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    const validationErrors = validateRegister(registerData);
    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const data = await registerJobSeeker(registerData);
      console.log("Job seeker registration response:", data);
      toast.success(data.message || "Registration successful.");
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
          error.response?.data?.message ||
            (lang === "ja"
              ? "登録中にエラーが発生しました"
              : "Registration failed."),
        );

        return;
      }

      toast.error(
        lang === "ja" ? "登録中にエラーが発生しました" : "Registration failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    const validationErrors = validateLogin(loginData);

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
          data.message || "Your account is waiting for admin approval.",
        );
        return;
      }

      if (!data.token) {
        toast.error(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("access_token", data.token);
      localStorage.setItem("user_role", data.user?.role || "seeker");
      toast.success(data.message || "Login successful.");
      router.push(lang === "ja" ? "/job-seekers" : "/en/job-seekers");
    } catch (error: unknown) {
      console.error("Job seeker registration error:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            (lang === "ja"
              ? "登録中にエラーが発生しました"
              : "Registration failed."),
        );

        return;
      }
      toast.error(
        lang === "ja" ? "登録中にエラーが発生しました" : "Registration failed.",
      );
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
