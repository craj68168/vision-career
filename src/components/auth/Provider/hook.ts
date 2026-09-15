"use client";

import { useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";

import { loginProvider, registerProvider } from "./api";

import { validateProviderLogin, validateProviderRegister } from "./validation";

import type {
  ApiErrorResponse,
  AuthMode,
  ProviderAuthErrors,
  ProviderLoginData,
  ProviderRegisterData,
} from "./types";

const initialRegisterData: ProviderRegisterData = {
  name: "",
  companyName: "",
  email: "",
  password: "",
};

const initialLoginData: ProviderLoginData = {
  email: "",
  password: "",
};

export const useProviderAuth = () => {
  const router = useRouter();

  const { lang } = useLanguage();

  // ======================================================
  // MODE
  // ======================================================

  const [mode, setMode] = useState<AuthMode>("login");

  // ======================================================
  // FORM DATA
  // ======================================================

  const [registerData, setRegisterData] =
    useState<ProviderRegisterData>(initialRegisterData);

  const [loginData, setLoginData] =
    useState<ProviderLoginData>(initialLoginData);

  // ======================================================
  // STATE
  // ======================================================

  const [errors, setErrors] = useState<ProviderAuthErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ======================================================
  // ERROR MESSAGE
  // ======================================================

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      return (
        error.response?.data?.message ||
        (lang === "ja"
          ? "処理中にエラーが発生しました"
          : "Something went wrong")
      );
    }

    if (error instanceof Error) {
      return error.message;
    }

    return lang === "ja"
      ? "処理中にエラーが発生しました"
      : "Something went wrong";
  };

  // ======================================================
  // REGISTER FIELD CHANGE
  // ======================================================

  const handleRegisterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setRegisterData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove validation error while typing
    if (errors[name as keyof ProviderAuthErrors]) {
      setErrors((previous) => ({
        ...previous,
        [name]: undefined,
      }));
    }
  };

  // ======================================================
  // LOGIN FIELD CHANGE
  // ======================================================

  const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setLoginData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name as keyof ProviderAuthErrors]) {
      setErrors((previous) => ({
        ...previous,
        [name]: undefined,
      }));
    }
  };

  // ======================================================
  // SWITCH MODE
  // ======================================================

  const handleSetMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrors({});
  };

  // ======================================================
  // REGISTER
  // ======================================================

  const handleRegister = async () => {
    const validationErrors = validateProviderRegister(registerData, lang);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: ProviderRegisterData = {
        name: registerData.name.trim(),

        companyName: registerData.companyName.trim(),

        email: registerData.email.trim().toLowerCase(),

        password: registerData.password,
      };

      const response = await registerProvider(payload);

      toast.success(
        response.message ||
          (lang === "ja"
            ? "企業登録が完了しました"
            : "Provider registration successful"),
      );

      // Reset registration form
      setRegisterData(initialRegisterData);

      setErrors({});

      // Go back to login tab
      setMode("login");

      // Optionally prefill login email
      setLoginData({
        email: payload.email,
        password: "",
      });
    } catch (error: unknown) {
      console.error("Provider registration error:", error);

      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ======================================================
  // LOGIN
  // ======================================================

  const handleLogin = async () => {
    const validationErrors = validateProviderLogin(loginData, lang);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: ProviderLoginData = {
        email: loginData.email.trim().toLowerCase(),

        password: loginData.password,
      };

      const response = await loginProvider(payload);

      if (!response.token) {
        throw new Error(response.message || "Login failed");
      }

      // --------------------------------------------------
      // New unified auth storage
      // --------------------------------------------------

      localStorage.setItem("access_token", response.token);

      localStorage.setItem("user_role", "provider");

      // Optional provider information.
      // Useful later for UI/dashboard.
      localStorage.setItem("provider_register_id", response.user.registerId);

      toast.success(
        response.message ||
          (lang === "ja" ? "ログインしました" : "Login successful"),
      );

      // Clear password from state
      setLoginData((previous) => ({
        ...previous,
        password: "",
      }));

      setErrors({});

      // --------------------------------------------------
      // PROVIDER DASHBOARD
      // --------------------------------------------------
      //
      // Change this if your existing provider dashboard
      // has a different URL.
      // --------------------------------------------------

      router.push(
        lang === "ja" ? "/provider-dashboard" : "/en/provider-dashboard",
      );
    } catch (error: unknown) {
      console.error("Provider login error:", error);

      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    lang,

    mode,
    setMode: handleSetMode,

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
