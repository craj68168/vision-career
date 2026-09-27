import axiosInstance from "@/services/axiosInstance";

import type {
  CreatePlacementRequestPayload,
  PlacementRequestListResponse,
  PlacementRequestResponse,
  ProviderPlacementCandidateListResponse,
  ProviderPlacementCandidateResponse,
  UpdateProviderPlacementCandidateStatusPayload,
} from "./types";

// ======================================================
// PLACEMENT REQUESTS
// ======================================================

export const getProviderPlacementRequests = async () => {
  const response = await axiosInstance.get<PlacementRequestListResponse>(
    "/providers/recruits",
  );

  return response.data;
};

export const getProviderPlacementRequestById = async (recruitId: string) => {
  const response = await axiosInstance.get<PlacementRequestResponse>(
    `/providers/recruits/${recruitId}`,
  );

  return response.data;
};

export const createProviderPlacementRequest = async (
  payload: CreatePlacementRequestPayload,
) => {
  const response = await axiosInstance.post<PlacementRequestResponse>(
    "/providers/recruits",
    payload,
  );

  return response.data;
};

export const updateProviderPlacementRequest = async (
  recruitId: string,
  payload: CreatePlacementRequestPayload,
) => {
  const response = await axiosInstance.put<PlacementRequestResponse>(
    `/providers/recruits/${recruitId}`,
    payload,
  );

  return response.data;
};

export const submitProviderPlacementRequest = async (recruitId: string) => {
  const response = await axiosInstance.patch<PlacementRequestResponse>(
    `/providers/recruits/${recruitId}/submit`,
  );

  return response.data;
};

export const deleteProviderPlacementRequest = async (recruitId: string) => {
  const response = await axiosInstance.delete<PlacementRequestResponse>(
    `/providers/recruits/${recruitId}`,
  );

  return response.data;
};

// ======================================================
// CANDIDATES
// ======================================================

export const getProviderPlacementCandidates = async (recruitId?: string) => {
  const response =
    await axiosInstance.get<ProviderPlacementCandidateListResponse>(
      "/providers/placement-candidates",
      {
        params: recruitId
          ? {
              recruitId,
            }
          : undefined,
      },
    );

  return response.data;
};

export const updateProviderPlacementCandidateStatus = async (
  placementCandidateId: string,
  payload: UpdateProviderPlacementCandidateStatusPayload,
) => {
  const response =
    await axiosInstance.patch<ProviderPlacementCandidateResponse>(
      `/providers/placement-candidates/${placementCandidateId}/status`,
      payload,
    );

  return response.data;
};
