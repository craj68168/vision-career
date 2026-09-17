import axiosInstance from "@/services/axiosInstance";

import type {
  EligibleSeekerResponse,
  PlacementCandidateListResponse,
  PlacementCandidateResponse,
  PlacementRequestListResponse,
  PlacementRequestResponse,
} from "./types";

// ======================================================
// PLACEMENT REQUESTS
// ======================================================

// ======================================================
// GET ALL
//
// GET /api/admin/placement-requests
// ======================================================

export const getAdminPlacementRequests =
  async (): Promise<PlacementRequestListResponse> => {
    const response = await axiosInstance.get<PlacementRequestListResponse>(
      "/admin/placement-requests",
    );

    return response.data;
  };

// ======================================================
// GET ONE
//
// GET /api/admin/placement-requests/:recruitId
// ======================================================

export const getAdminPlacementRequest = async (
  recruitId: string,
): Promise<PlacementRequestResponse> => {
  const response = await axiosInstance.get<PlacementRequestResponse>(
    `/admin/placement-requests/${recruitId}`,
  );

  return response.data;
};

// ======================================================
// APPROVE
//
// PATCH /api/admin/placement-requests/:recruitId/approve
// ======================================================

export const approveAdminPlacementRequest = async (
  recruitId: string,
): Promise<PlacementRequestResponse> => {
  const response = await axiosInstance.patch<PlacementRequestResponse>(
    `/admin/placement-requests/${recruitId}/approve`,
  );

  return response.data;
};

// ======================================================
// REJECT
//
// PATCH /api/admin/placement-requests/:recruitId/reject
// ======================================================

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

// ======================================================
// CANDIDATE MATCHING
// ======================================================

// ======================================================
// GET ELIGIBLE SEEKERS
//
// GET
// /api/admin/placement-candidates/:recruitId/eligible
// ======================================================

export const getEligiblePlacementSeekers = async (
  recruitId: string,
): Promise<EligibleSeekerResponse> => {
  const response = await axiosInstance.get<EligibleSeekerResponse>(
    `/admin/placement-candidates/${recruitId}/eligible`,
  );

  return response.data;
};

// ======================================================
// GET MATCHED CANDIDATES
//
// GET
// /api/admin/placement-candidates/:recruitId
// ======================================================

export const getMatchedPlacementCandidates = async (
  recruitId: string,
): Promise<PlacementCandidateListResponse> => {
  const response = await axiosInstance.get<PlacementCandidateListResponse>(
    `/admin/placement-candidates/${recruitId}`,
  );

  return response.data;
};

// ======================================================
// MATCH CANDIDATE
//
// POST
// /api/admin/placement-candidates/:recruitId/:seekerId
// ======================================================

export const matchPlacementCandidate = async (
  recruitId: string,
  seekerId: string,
): Promise<PlacementCandidateResponse> => {
  const response = await axiosInstance.post<PlacementCandidateResponse>(
    `/admin/placement-candidates/${recruitId}/${seekerId}`,
  );

  return response.data;
};
