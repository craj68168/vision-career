import axiosInstance from "@/services/axiosInstance";

import type {
  ChangeStaffPasswordPayload,
  ChangeStaffPasswordResponse,
} from "./types";

// ======================================================
// CHANGE STAFF PASSWORD
//
// PATCH /api/staff/auth/password
// ======================================================

export const changeStaffPassword = async (
  payload: ChangeStaffPasswordPayload,
): Promise<ChangeStaffPasswordResponse> => {
  const response = await axiosInstance.patch<ChangeStaffPasswordResponse>(
    "/staff/auth/password",

    payload,
  );

  return response.data;
};
