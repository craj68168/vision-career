import axiosInstance from "@/services/axiosInstance";

import type {
  ScreenPlacementRequestPayload,
  StaffPlacementRequestListResponse,
  StaffPlacementRequestResponse,
} from "./types";

// ======================================================
// LIST
// ======================================================

export const getStaffPlacementRequests =
  async (): Promise<StaffPlacementRequestListResponse> => {
    const response = await axiosInstance.get<StaffPlacementRequestListResponse>(
      "/staff/placement-requests",
    );

    return response.data;
  };

// ======================================================
// DETAILS
// ======================================================

export const getStaffPlacementRequest = async (
  recruitId: string,
): Promise<StaffPlacementRequestResponse> => {
  const response = await axiosInstance.get<StaffPlacementRequestResponse>(
    `/staff/placement-requests/${recruitId}`,
  );

  return response.data;
};

// ======================================================
// SCREEN
// ======================================================

export const screenStaffPlacementRequest = async (
  recruitId: string,
  payload: ScreenPlacementRequestPayload,
): Promise<StaffPlacementRequestResponse> => {
  const response = await axiosInstance.patch<StaffPlacementRequestResponse>(
    `/staff/placement-requests/${recruitId}/screen`,
    payload,
  );

  return response.data;
};
