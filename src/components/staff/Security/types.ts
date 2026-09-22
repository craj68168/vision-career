import type { StaffUser } from "@/components/auth/Staff/types";

// ======================================================
// CHANGE PASSWORD
// ======================================================

export type ChangeStaffPasswordPayload = {
  currentPassword: string;

  newPassword: string;
};

// ======================================================
// RESPONSE
// ======================================================

export type ChangeStaffPasswordResponse = {
  success: boolean;

  message: string;

  token: string;

  data: StaffUser;
};

// ======================================================
// VALIDATION
// ======================================================

export type StaffSecurityValidationErrors = {
  currentPassword?: string;

  newPassword?: string;

  confirmNewPassword?: string;
};

// ======================================================
// API ERROR
// ======================================================

export type StaffSecurityApiError = {
  success?: boolean;

  status?: string;

  message?: string;
};
