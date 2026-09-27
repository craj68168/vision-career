import axiosInstance from "@/services/axiosInstance";

import type {
  ProviderPlacementCandidateListResponse,
  ProviderPlacementCandidateResponse,
  UpdateProviderPlacementCandidateStatusPayload,
} from "./placementCandidatesTypes";

// ======================================================
// GET CANDIDATES
// ======================================================

export const getProviderPlacementCandidates = async (
  recruitId?: string,
): Promise<ProviderPlacementCandidateListResponse> => {
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

// ======================================================
// UPDATE CANDIDATE
// ======================================================

export const updateProviderPlacementCandidateStatus = async (
  placementCandidateId: string,
  payload: UpdateProviderPlacementCandidateStatusPayload,
): Promise<ProviderPlacementCandidateResponse> => {
  const response =
    await axiosInstance.patch<ProviderPlacementCandidateResponse>(
      `/providers/placement-candidates/${placementCandidateId}/status`,
      payload,
    );

  return response.data;
};
