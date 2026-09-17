"use client";

import { useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import axios from "axios";

import { loginStaff } from "./api";

import type { ApiErrorResponse, StaffLoginPayload } from "./types";

export const useStaffLoginHook = () => {
  const router = useRouter();

  const pathname = usePathname();

  const isEnglish = pathname.startsWith("/en/");

  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: loginStaff,

    onSuccess: (response) => {
      setError("");

      localStorage.setItem("access_token", response.token);

      localStorage.setItem("user_role", "staff");

      router.replace(isEnglish ? "/en/staff" : "/staff");
    },

    onError: (requestError: unknown) => {
      if (axios.isAxiosError<ApiErrorResponse>(requestError)) {
        setError(requestError.response?.data?.message || "Login failed.");

        return;
      }

      setError("Login failed.");
    },
  });

  const login = (payload: StaffLoginPayload) => {
    setError("");

    mutation.mutate(payload);
  };

  return {
    login,

    error,

    isPending: mutation.isPending,
  };
};
