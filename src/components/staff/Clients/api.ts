import axiosInstance from "@/services/axiosInstance";

import type {
  ReviewProviderPayload,
  StaffProviderListResponse,
  StaffProviderResponse,
} from "./types";

// ======================================================
// LIST
// ======================================================

export const getStaffProviders =
  async (): Promise<StaffProviderListResponse> => {
    const response =
      await axiosInstance.get<StaffProviderListResponse>("/staff/providers");

    return response.data;
  };

// ======================================================
// DETAILS
// ======================================================

export const getStaffProviderById = async (
  registerId: string,
): Promise<StaffProviderResponse> => {
  const response = await axiosInstance.get<StaffProviderResponse>(
    `/staff/providers/${registerId}`,
  );

  return response.data;
};

// ======================================================
// REVIEW
// ======================================================

export const reviewStaffProvider = async (
  registerId: string,
  payload: ReviewProviderPayload,
): Promise<StaffProviderResponse> => {
  const response = await axiosInstance.patch<StaffProviderResponse>(
    `/staff/providers/${registerId}/review`,
    payload,
  );

  return response.data;
};
