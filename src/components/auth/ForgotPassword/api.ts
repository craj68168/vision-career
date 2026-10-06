import axiosInstance from "@/services/axiosInstance";

import type {
  ForgotPasswordResponse,
  ResetPasswordResponse,
  SetInitialPasswordResponse,
  VerifyResetCodeResponse,
} from "./types";

// ======================================================
// REQUEST PASSWORD RESET CODE
// ======================================================

export const requestPasswordReset = async (
  authBaseUrl: string,
  email: string,
): Promise<ForgotPasswordResponse> => {
  const response = await axiosInstance.post<ForgotPasswordResponse>(
    `${authBaseUrl}/forgot-password`,
    {
      email,
    },
  );

  return response.data;
};

// ======================================================
// VERIFY RESET CODE
// ======================================================

export const verifyPasswordResetCode = async (
  authBaseUrl: string,
  email: string,
  code: string,
): Promise<VerifyResetCodeResponse> => {
  const response = await axiosInstance.post<VerifyResetCodeResponse>(
    `${authBaseUrl}/verify-reset-code`,
    {
      email,
      code,
    },
  );

  return response.data;
};

// ======================================================
// RESET EXISTING PASSWORD
// ======================================================

export const submitNewPassword = async (
  authBaseUrl: string,
  resetToken: string,
  password: string,
  confirmPassword: string,
): Promise<ResetPasswordResponse> => {
  const response = await axiosInstance.post<ResetPasswordResponse>(
    `${authBaseUrl}/reset-password`,
    {
      reset_token: resetToken,
      password,
      confirm_password: confirmPassword,
    },
  );

  return response.data;
};

// ======================================================
// SET INITIAL PASSWORD
//
// Used only when Admin creates a Job Seeker.
//
// POST /api/seekers/auth/set-password
// ======================================================

export const submitInitialPassword = async (
  setupToken: string,
  password: string,
  confirmPassword: string,
): Promise<SetInitialPasswordResponse> => {
  const response = await axiosInstance.post<SetInitialPasswordResponse>(
    "/seekers/auth/set-password",
    {
      setup_token: setupToken,
      password,
      confirm_password: confirmPassword,
    },
  );

  return response.data;
};
