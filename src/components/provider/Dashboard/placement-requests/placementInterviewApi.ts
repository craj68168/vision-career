import axiosInstance from "@/services/axiosInstance";

import type {
  PlacementInterview,
  PlacementInterviewFormPayload,
  PlacementInterviewListResponse,
  PlacementInterviewResponse,
} from "./placementInterviewTypes";

// ======================================================
// GET ALL PROVIDER INTERVIEWS
//
// GET
// /api/providers/interviews
// ======================================================

export const getProviderPlacementInterviews = async () => {
  const response = await axiosInstance.get<PlacementInterviewListResponse>(
    "/providers/interviews",
  );

  return response.data;
};

// ======================================================
// FIND PLACEMENT INTERVIEW BY CANDIDATE ID
//
// IMPORTANT:
//
// Backend already gives Provider interviews through:
//
// GET /providers/interviews
//
// Therefore we do not need to invent another backend
// endpoint just to find the candidate's interview.
//
// This helper loads Provider interviews and safely finds
// the placement interview belonging to the candidate.
// ======================================================

export const getProviderPlacementInterviewByCandidateId = async (
  placementCandidateId: string,
): Promise<PlacementInterview | null> => {
  const response = await getProviderPlacementInterviews();

  if (!Array.isArray(response.data)) {
    return null;
  }

  return (
    response.data.find(
      (interview) => interview.placementCandidateId === placementCandidateId,
    ) ?? null
  );
};

// ======================================================
// SCHEDULE PLACEMENT INTERVIEW
//
// POST
// /api/providers/interviews
// ======================================================

export const schedulePlacementInterview = async (
  placementCandidateId: string,
  payload: PlacementInterviewFormPayload,
) => {
  const response = await axiosInstance.post<PlacementInterviewResponse>(
    "/providers/interviews",
    {
      placementCandidateId,

      interviewDate: payload.interviewDate,

      interviewTime: payload.interviewTime,

      timezone: payload.timezone,

      interviewMethod: payload.interviewMethod,

      meetingLink: payload.meetingLink || "",

      notes: payload.notes || "",
    },
  );

  return response.data;
};

// ======================================================
// UPDATE PLACEMENT INTERVIEW
//
// PATCH
// /api/providers/interviews/:interviewId
// ======================================================

export const updatePlacementInterview = async (
  interviewId: string,
  payload: PlacementInterviewFormPayload,
) => {
  const response = await axiosInstance.patch<PlacementInterviewResponse>(
    `/providers/interviews/${interviewId}`,
    {
      interviewDate: payload.interviewDate,

      interviewTime: payload.interviewTime,

      timezone: payload.timezone,

      interviewMethod: payload.interviewMethod,

      meetingLink: payload.meetingLink || "",

      notes: payload.notes || "",
    },
  );

  return response.data;
};

// ======================================================
// COMPATIBILITY TYPE EXPORTS
//
// This also prevents older files from breaking if they
// still import interview types from placementInterviewApi.
// ======================================================

export type {
  PlacementInterview,
  PlacementInterviewApiError,
  PlacementInterviewFormPayload,
  PlacementInterviewListResponse,
  PlacementInterviewMethod,
  PlacementInterviewResponse,
  PlacementInterviewStatus,
} from "./placementInterviewTypes";
