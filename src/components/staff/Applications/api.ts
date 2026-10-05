import axiosInstance from "@/services/axiosInstance";

import type {
  RejectStaffApplicationPayload,
  ScreenApplicationPayload,
  StaffApplicationActionResponse,
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
// GET FROZEN APPLICATION RESUME
// ======================================================

export const getStaffApplicationResume = async (
  applicationId: string,
): Promise<Blob> => {
  const response = await axiosInstance.get<Blob>(
    `/staff/applications/${applicationId}/resume`,
    {
      responseType: "blob",
    },
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

// ======================================================
// APPROVE APPLICATION
//
// PENDING_ADMIN_APPROVAL -> SENT_TO_PROVIDER
// ======================================================

export const approveStaffApplication = async (
  applicationId: string,
): Promise<StaffApplicationActionResponse> => {
  const response = await axiosInstance.patch<StaffApplicationActionResponse>(
    `/staff/applications/${applicationId}/approve`,
  );

  return response.data;
};

// ======================================================
// REJECT APPLICATION
//
// PENDING_ADMIN_APPROVAL -> ADMIN_REJECTED
// ======================================================

export const rejectStaffApplication = async (
  applicationId: string,
  payload: RejectStaffApplicationPayload,
): Promise<StaffApplicationActionResponse> => {
  const response = await axiosInstance.patch<StaffApplicationActionResponse>(
    `/staff/applications/${applicationId}/reject`,
    payload,
  );

  return response.data;
};
