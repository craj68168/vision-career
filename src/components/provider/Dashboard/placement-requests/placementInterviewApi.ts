import axiosInstance from "@/services/axiosInstance";

// ======================================================
// INTERVIEW TYPES
// ======================================================

export type PlacementInterviewMethod =
  | "ZOOM"
  | "GOOGLE_MEET"
  | "PHONE"
  | "FACE_TO_FACE"
  | "OTHER";

export type PlacementInterviewStatus =
  | "AWAITING_LINK"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export type PlacementInterviewCandidate = {
  name?: string | null;

  nationality?: string | null;

  visaType?: string | null;

  visaExpiryDate?: string | null;

  japaneseLevel?: string | null;

  skills?: string[];

  desiredJob?: string | null;

  desiredLocation?: string | null;
};

export type PlacementInterviewRequestSummary = {
  recruitId?: string | null;

  title?: string | null;

  companyName?: string | null;

  employmentType?: string | null;

  workLocation?: string | null;

  japaneseLevel?: string | null;
};

export type PlacementInterview = {
  interviewId: string;

  sourceType: "APPLICATION" | "PLACEMENT";

  applicationId?: string | null;

  vacancyId?: string | null;

  placementCandidateId?: string | null;

  recruitId?: string | null;

  applicationStatus?: string | null;

  placementCandidateStatus?: string | null;

  interviewDate: string;

  interviewTime: string;

  timezone: string;

  interviewMethod: PlacementInterviewMethod;

  meetingLink?: string | null;

  notes?: string | null;

  status: PlacementInterviewStatus;

  confirmedAt?: string | null;

  completedAt?: string | null;

  cancelledAt?: string | null;

  cancellationReason?: string | null;

  createdAt?: string | null;

  updatedAt?: string | null;

  candidate?: PlacementInterviewCandidate | null;

  placementRequest?: PlacementInterviewRequestSummary | null;
};

export type PlacementInterviewListResponse = {
  status: "success" | "error";

  count: number;

  data: PlacementInterview[];

  message?: string;
};

export type PlacementInterviewResponse = {
  status: "success" | "error";

  data: PlacementInterview;

  message?: string;
};

export type PlacementInterviewFormPayload = {
  interviewDate: string;

  interviewTime: string;

  timezone: string;

  interviewMethod: PlacementInterviewMethod;

  meetingLink?: string;

  notes?: string;
};

// ======================================================
// GET PROVIDER PLACEMENT INTERVIEWS
// ======================================================

export const getProviderPlacementInterviews =
  async (): Promise<PlacementInterviewListResponse> => {
    const response = await axiosInstance.get<PlacementInterviewListResponse>(
      "/providers/interviews",
    );

    const allInterviews = Array.isArray(response.data.data)
      ? response.data.data
      : [];

    return {
      ...response.data,

      count: allInterviews.filter(
        (interview) => interview.sourceType === "PLACEMENT",
      ).length,

      data: allInterviews.filter(
        (interview) => interview.sourceType === "PLACEMENT",
      ),
    };
  };

// ======================================================
// SCHEDULE PLACEMENT INTERVIEW
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
// UPDATE PLACEMENT INTERVIEW
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
