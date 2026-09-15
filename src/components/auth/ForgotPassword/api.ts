import axiosInstance from "@/services/axiosInstance";

import type {
  ForgotPasswordResponse,
  ResetPasswordResponse,
  VerifyResetCodeResponse,
} from "./types";

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
