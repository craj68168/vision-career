import axiosInstance from "@/services/axiosInstance";

import type {
  RejectStaffPlacementRequestPayload,
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

// ======================================================
// APPROVE
//
// pending_review -> approved
//
// Requires:
// placement_requests:approval
// ======================================================

export const approveStaffPlacementRequest = async (
  recruitId: string,
): Promise<StaffPlacementRequestResponse> => {
  const response = await axiosInstance.patch<StaffPlacementRequestResponse>(
    `/staff/placement-requests/${recruitId}/approve`,
  );

  return response.data;
};

// ======================================================
// REJECT
//
// pending_review -> rejected
//
// Requires:
// placement_requests:approval
// ======================================================

export const rejectStaffPlacementRequest = async (
  recruitId: string,
  payload: RejectStaffPlacementRequestPayload,
): Promise<StaffPlacementRequestResponse> => {
  const response = await axiosInstance.patch<StaffPlacementRequestResponse>(
    `/staff/placement-requests/${recruitId}/reject`,
    payload,
  );

  return response.data;
};
