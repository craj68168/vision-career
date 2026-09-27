import axiosInstance from "@/services/axiosInstance";

import type {
  CreatePlacementRequestPayload,
  PlacementRequestListResponse,
  PlacementRequestResponse,
} from "./types";

// ======================================================
// GET PLACEMENT REQUESTS
// ======================================================

export const getProviderPlacementRequests = async () => {
  const response = await axiosInstance.get<PlacementRequestListResponse>(
    "/providers/recruits",
  );

  return response.data;
};

// ======================================================
// GET PLACEMENT REQUEST
// ======================================================

export const getProviderPlacementRequestById = async (recruitId: string) => {
  const response = await axiosInstance.get<PlacementRequestResponse>(
    `/providers/recruits/${recruitId}`,
  );

  return response.data;
};

// ======================================================
// CREATE
// ======================================================

export const createProviderPlacementRequest = async (
  payload: CreatePlacementRequestPayload,
) => {
  const response = await axiosInstance.post<PlacementRequestResponse>(
    "/providers/recruits",
    payload,
  );

  return response.data;
};

// ======================================================
// UPDATE
// ======================================================

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

// ======================================================
// SUBMIT
// ======================================================

export const submitProviderPlacementRequest = async (recruitId: string) => {
  const response = await axiosInstance.patch<PlacementRequestResponse>(
    `/providers/recruits/${recruitId}/submit`,
  );

  return response.data;
};

// ======================================================
// DELETE
// ======================================================

export const deleteProviderPlacementRequest = async (recruitId: string) => {
  const response = await axiosInstance.delete<PlacementRequestResponse>(
    `/providers/recruits/${recruitId}`,
  );

  return response.data;
};

// ======================================================
// COMPATIBILITY EXPORTS
// ======================================================

export {
  getProviderPlacementCandidates,
  updateProviderPlacementCandidateStatus,
} from "./placementCandidatesApi";
