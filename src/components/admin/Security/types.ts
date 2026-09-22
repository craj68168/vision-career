import type { AdminUser } from "@/components/auth/Admin/types";

// ======================================================
// UPDATE CREDENTIALS
// ======================================================

export type UpdateAdminCredentialsPayload = {
  username: string;

  currentPassword: string;

  newPassword: string;
};

// ======================================================
// RESPONSE
// ======================================================

export type UpdateAdminCredentialsResponse = {
  success: boolean;

  message: string;

  token: string;

  user: AdminUser;
};

// ======================================================
// VALIDATION
// ======================================================

export type AdminSecurityValidationErrors = {
  username?: string;

  currentPassword?: string;

  newPassword?: string;

  confirmNewPassword?: string;
};

// ======================================================
// API ERROR
// ======================================================

export type AdminSecurityApiError = {
  success?: boolean;

  message?: string;
};
