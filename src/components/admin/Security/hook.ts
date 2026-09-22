"use client";

import { useState } from "react";

import axios from "axios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getCurrentAdmin } from "@/components/auth/Admin/api";

import { updateAdminCredentials } from "./api";

import type {
  AdminSecurityApiError,
  UpdateAdminCredentialsPayload,
} from "./types";

// ======================================================
// HOOK
// ======================================================

export const useAdminSecurity = () => {
  const queryClient = useQueryClient();

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // ====================================================
  // CURRENT ADMIN
  // ====================================================

  const adminQuery = useQuery({
    queryKey: ["current-admin"],

    queryFn: getCurrentAdmin,

    staleTime: 30 * 1000,

    retry: false,
  });

  // ====================================================
  // UPDATE
  // ====================================================

  const updateMutation = useMutation({
    mutationFn: updateAdminCredentials,
  });

  // ====================================================
  // ERROR HELPER
  // ====================================================

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError<AdminSecurityApiError>(error)) {
      return error.response?.data?.message || "Failed to update credentials.";
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Failed to update credentials.";
  };

  // ====================================================
  // UPDATE CREDENTIALS
  // ====================================================

  const saveCredentials = async (
    payload: UpdateAdminCredentialsPayload,
  ): Promise<boolean> => {
    setErrorMessage("");

    setSuccessMessage("");

    try {
      const response = await updateMutation.mutateAsync(payload);

      // ===============================================
      // REPLACE TOKEN
      //
      // Password change invalidates the previous JWT.
      // Backend returns a new one.
      // ===============================================

      localStorage.setItem("access_token", response.token);

      localStorage.setItem("user_role", "admin");

      setSuccessMessage(
        response.message || "Admin username and password updated successfully.",
      );

      await queryClient.invalidateQueries({
        queryKey: ["current-admin"],
      });

      return true;
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));

      return false;
    }
  };

  // ====================================================
  // CLEAR MESSAGES
  // ====================================================

  const clearMessages = () => {
    setErrorMessage("");

    setSuccessMessage("");
  };

  // ====================================================
  // RETURN
  // ====================================================

  return {
    admin: adminQuery.data?.user,

    isLoading: adminQuery.isLoading,

    isSaving: updateMutation.isPending,

    errorMessage,

    successMessage,

    saveCredentials,

    clearMessages,

    refetchAdmin: adminQuery.refetch,
  };
};
