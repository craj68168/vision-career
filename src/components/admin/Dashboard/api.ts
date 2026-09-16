import axiosInstance from "@/services/axiosInstance";

import type { AdminDashboardResponse } from "./types";

// ======================================================
// GET ADMIN DASHBOARD
//
// GET /api/admin/dashboard
// ======================================================

export const getAdminDashboard = async (): Promise<AdminDashboardResponse> => {
  const response =
    await axiosInstance.get<AdminDashboardResponse>("/admin/dashboard");

  return response.data;
};
