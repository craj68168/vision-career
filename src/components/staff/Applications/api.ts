import axiosInstance from "@/services/axiosInstance";

import type {
  ScreenApplicationPayload,
  StaffApplicationListResponse,
  StaffApplicationResponse,
} from "./types";

// ======================================================
// GET APPLICATIONS
// ======================================================

export const getStaffApplications = async () => {
  const response = await axiosInstance.get<StaffApplicationListResponse>(
    "/staff/applications",
  );

  return response.data;
};

// ======================================================
// GET ONE
// ======================================================

export const getStaffApplicationById = async (applicationId: string) => {
  const response = await axiosInstance.get<StaffApplicationResponse>(
    `/staff/applications/${applicationId}`,
  );

  return response.data;
};

// ======================================================
// SCREEN APPLICATION
// ======================================================

export const screenStaffApplication = async (
  applicationId: string,
  payload: ScreenApplicationPayload,
) => {
  const response = await axiosInstance.patch<StaffApplicationResponse>(
    `/staff/applications/${applicationId}/screen`,
    payload,
  );

  return response.data;
};
