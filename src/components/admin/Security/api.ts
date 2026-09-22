import axiosInstance from "@/services/axiosInstance";

import type {
  UpdateAdminCredentialsPayload,
  UpdateAdminCredentialsResponse,
} from "./types";

// ======================================================
// UPDATE ADMIN CREDENTIALS
//
// PATCH /api/admin/auth/credentials
// ======================================================

export const updateAdminCredentials = async (
  payload: UpdateAdminCredentialsPayload,
): Promise<UpdateAdminCredentialsResponse> => {
  const response = await axiosInstance.patch<UpdateAdminCredentialsResponse>(
    "/admin/auth/credentials",
    payload,
  );

  return response.data;
};
