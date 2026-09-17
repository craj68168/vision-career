import axiosInstance from "@/services/axiosInstance";

import type {
  PlacementRequestListResponse,
  PlacementRequestResponse,
} from "./types";

export const getAdminPlacementRequests =
  async (): Promise<PlacementRequestListResponse> => {
    const response = await axiosInstance.get<PlacementRequestListResponse>(
      "/admin/placement-requests",
    );

    return response.data;
  };

export const getAdminPlacementRequest = async (
  recruitId: string,
): Promise<PlacementRequestResponse> => {
  const response = await axiosInstance.get<PlacementRequestResponse>(
    `/admin/placement-requests/${recruitId}`,
  );

  return response.data;
};

export const approveAdminPlacementRequest = async (
  recruitId: string,
): Promise<PlacementRequestResponse> => {
  const response = await axiosInstance.patch<PlacementRequestResponse>(
    `/admin/placement-requests/${recruitId}/approve`,
  );

  return response.data;
};

export const rejectAdminPlacementRequest = async (
  recruitId: string,
  reason: string,
): Promise<PlacementRequestResponse> => {
  const response = await axiosInstance.patch<PlacementRequestResponse>(
    `/admin/placement-requests/${recruitId}/reject`,
    {
      reason,
    },
  );

  return response.data;
};
