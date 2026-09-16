import axiosInstance from "@/services/axiosInstance";

import type {
  AdminLoginPayload,
  AdminLoginResponse,
  AdminMeResponse,
} from "./types";

// ======================================================
// ADMIN LOGIN
//
// POST /api/admin/auth/login
// ======================================================

export const loginAdmin = async (payload: AdminLoginPayload) => {
  const response = await axiosInstance.post<AdminLoginResponse>(
    "/admin/auth/login",
    payload,
  );

  return response.data;
};

// ======================================================
// GET CURRENT ADMIN
//
// GET /api/admin/auth/me
// ======================================================

export const getCurrentAdmin = async () => {
  const response = await axiosInstance.get<AdminMeResponse>("/admin/auth/me");

  return response.data;
};
