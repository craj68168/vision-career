import axiosInstance from "@/services/axiosInstance";

import type { CurrentStaffResponse, StaffDashboardResponse } from "./types";

export const getStaffDashboard = async () => {
  const response =
    await axiosInstance.get<StaffDashboardResponse>("/staff/dashboard");

  return response.data;
};

export const getCurrentStaff = async () => {
  const response =
    await axiosInstance.get<CurrentStaffResponse>("/staff/auth/me");

  return response.data;
};
