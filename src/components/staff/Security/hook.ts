"use client";

import { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getCurrentStaff } from "@/components/auth/Staff/api";

import { changeStaffPassword } from "./api";

import type {
  ChangeStaffPasswordPayload,
  StaffSecurityApiError,
} from "./types";

// ======================================================
// HOOK
// ======================================================

export const useStaffSecurity = () => {
  const queryClient = useQueryClient();

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // ====================================================
  // CURRENT STAFF
  // ====================================================

  const staffQuery = useQuery({
    queryKey: ["current-staff"],

    queryFn: getCurrentStaff,

    retry: false,

    staleTime: 30 * 1000,
  });

  // ====================================================
  // CHANGE PASSWORD
  // ====================================================

  const passwordMutation = useMutation({
    mutationFn: changeStaffPassword,
  });

  // ====================================================
  // ERROR HELPER
  // ====================================================

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError<StaffSecurityApiError>(error)) {
      return error.response?.data?.message || "Failed to update password.";
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Failed to update password.";
  };

  // ====================================================
  // SAVE PASSWORD
  // ====================================================

  const savePassword = async (
    payload: ChangeStaffPasswordPayload,
  ): Promise<boolean> => {
    setErrorMessage("");

    setSuccessMessage("");

    try {
      const response = await passwordMutation.mutateAsync(payload);

      // ==================================================
      // STORE NEW TOKEN
      //
      // The previous token becomes invalid after
      // passwordChangedAt changes.
      // ==================================================

      localStorage.setItem("access_token", response.token);

      localStorage.setItem("user_role", "staff");

      const message = response.message || "Password updated successfully.";

      // ==================================================
      // SUCCESS FEEDBACK
      // ==================================================

      setSuccessMessage(message);

      toast.success(message);

      // ==================================================
      // UPDATE CURRENT STAFF CACHE
      //
      // We already receive the Staff object in the
      // password-change response, so update cache directly.
      // This avoids an unnecessary immediate refetch.
      // ==================================================

      queryClient.setQueryData(["current-staff"], {
        success: true,
        data: response.data,
      });

      return true;
    } catch (error: unknown) {
      const message = getErrorMessage(error);

      setErrorMessage(message);

      toast.error(message);

      return false;
    }
  };

  // ====================================================
  // CLEAR ERROR ONLY
  //
  // Do not clear success whenever the user types.
  // ====================================================

  const clearError = () => {
    setErrorMessage("");
  };

  // ====================================================
  // CLEAR ALL MESSAGES
  // ====================================================

  const clearMessages = () => {
    setErrorMessage("");

    setSuccessMessage("");
  };

  // ====================================================
  // RETURN
  // ====================================================

  return {
    staff: staffQuery.data?.data,

    isLoading: staffQuery.isLoading,

    isSaving: passwordMutation.isPending,

    errorMessage,

    successMessage,

    savePassword,

    clearError,

    clearMessages,
  };
};
