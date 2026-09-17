import axiosInstance from "@/services/axiosInstance";

import type {
  CurrentStaffResponse,
  StaffLoginPayload,
  StaffLoginResponse,
} from "./types";

// ======================================================
// LOGIN
// ======================================================

export const loginStaff = async (payload: StaffLoginPayload) => {
  const response = await axiosInstance.post<StaffLoginResponse>(
    "/staff/auth/login",
    payload,
  );

  return response.data;
};

// ======================================================
// CURRENT STAFF
// ======================================================

export const getCurrentStaff = async () => {
  const response =
    await axiosInstance.get<CurrentStaffResponse>("/staff/auth/me");

  return response.data;
};
