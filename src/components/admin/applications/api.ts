import axiosInstance from "@/services/axiosInstance";

import type {
  AdminApplicationActionResponse,
  AdminApplicationDetailsResponse,
  AdminApplicationsResponse,
  RejectApplicationPayload,
} from "./types";

// ======================================================
// GET APPLICATIONS
// ======================================================

export const getAdminApplications = async () => {
  const response = await axiosInstance.get<AdminApplicationsResponse>(
    "/admin/applications",
  );

  return response.data;
};

// ======================================================
// GET DETAILS
// ======================================================

export const getAdminApplicationById = async (applicationId: string) => {
  const response = await axiosInstance.get<AdminApplicationDetailsResponse>(
    `/admin/applications/${applicationId}`,
  );

  return response.data;
};

// ======================================================
// APPROVE
// ======================================================

export const approveAdminApplication = async (applicationId: string) => {
  const response = await axiosInstance.patch<AdminApplicationActionResponse>(
    `/admin/applications/${applicationId}/approve`,
  );

  return response.data;
};

// ======================================================
// REJECT
// ======================================================

export const rejectAdminApplication = async (
  applicationId: string,
  payload: RejectApplicationPayload,
) => {
  const response = await axiosInstance.patch<AdminApplicationActionResponse>(
    `/admin/applications/${applicationId}/reject`,
    payload,
  );

  return response.data;
};

// ======================================================
// RESUME
// ======================================================

export const getAdminApplicationResume = async (applicationId: string) => {
  const response = await axiosInstance.get(
    `/admin/applications/${applicationId}/resume`,
    {
      responseType: "blob",
    },
  );

  return response.data as Blob;
};
