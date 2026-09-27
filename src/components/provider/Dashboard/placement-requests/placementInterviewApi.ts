import axiosInstance from "@/services/axiosInstance";

import type {
  PlacementInterview,
  PlacementInterviewFormPayload,
  PlacementInterviewListResponse,
  PlacementInterviewResponse,
} from "./placementInterviewTypes";

// ======================================================
// GET PLACEMENT INTERVIEWS
// ======================================================

export const getProviderPlacementInterviews =
  async (): Promise<PlacementInterviewListResponse> => {
    const response = await axiosInstance.get<PlacementInterviewListResponse>(
      "/providers/interviews",
    );

    const allInterviews = Array.isArray(response.data.data)
      ? response.data.data
      : [];

    const placementInterviews = allInterviews.filter(
      (interview) => interview.sourceType === "PLACEMENT",
    );

    return {
      ...response.data,

      count: placementInterviews.length,

      data: placementInterviews,
    };
  };

// ======================================================
// FIND INTERVIEW BY CANDIDATE
// ======================================================

export const getProviderPlacementInterviewByCandidateId = async (
  placementCandidateId: string,
): Promise<PlacementInterview | null> => {
  const response = await axiosInstance.get<PlacementInterviewListResponse>(
    "/providers/interviews",
  );

  const interviews = Array.isArray(response.data.data)
    ? response.data.data
    : [];

  return (
    interviews.find(
      (interview) =>
        interview.sourceType === "PLACEMENT" &&
        interview.placementCandidateId === placementCandidateId,
    ) ?? null
  );
};

// ======================================================
// CREATE INTERVIEW
// ======================================================

export const schedulePlacementInterview = async (
  placementCandidateId: string,
  payload: PlacementInterviewFormPayload,
): Promise<PlacementInterviewResponse> => {
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
// UPDATE INTERVIEW
// ======================================================

export const updatePlacementInterview = async (
  interviewId: string,
  payload: PlacementInterviewFormPayload,
): Promise<PlacementInterviewResponse> => {
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
