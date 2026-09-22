import axiosInstance from "@/services/axiosInstance";

import type {
  ReviewCandidatePayload,
  StaffPlacementCandidateListResponse,
  StaffPlacementCandidateResponse,
} from "./types";

// ======================================================
// LIST
// ======================================================

export const getStaffPlacementCandidates =
  async (): Promise<StaffPlacementCandidateListResponse> => {
    const response =
      await axiosInstance.get<StaffPlacementCandidateListResponse>(
        "/staff/placement-candidates",
      );

    return response.data;
  };

// ======================================================
// DETAILS
// ======================================================

export const getStaffPlacementCandidate = async (
  placementCandidateId: string,
): Promise<StaffPlacementCandidateResponse> => {
  const response = await axiosInstance.get<StaffPlacementCandidateResponse>(
    `/staff/placement-candidates/${placementCandidateId}`,
  );

  return response.data;
};

// ======================================================
// REVIEW
// ======================================================

export const reviewStaffPlacementCandidate = async (
  placementCandidateId: string,

  payload: ReviewCandidatePayload,
): Promise<StaffPlacementCandidateResponse> => {
  const response = await axiosInstance.patch<StaffPlacementCandidateResponse>(
    `/staff/placement-candidates/${placementCandidateId}/review`,

    payload,
  );

  return response.data;
};
