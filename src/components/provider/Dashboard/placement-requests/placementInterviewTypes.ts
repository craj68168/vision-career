// ======================================================
// PLACEMENT INTERVIEW METHOD
// ======================================================

export type PlacementInterviewMethod =
  | "ZOOM"
  | "GOOGLE_MEET"
  | "PHONE"
  | "FACE_TO_FACE"
  | "OTHER";

// ======================================================
// PLACEMENT INTERVIEW STATUS
// ======================================================

export type PlacementInterviewStatus =
  | "AWAITING_LINK"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

// ======================================================
// PLACEMENT INTERVIEW
// ======================================================

export type PlacementInterview = {
  interviewId: string;

  sourceType?: "APPLICATION" | "PLACEMENT";

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

  createdAt?: string;

  updatedAt?: string;
};

// ======================================================
// FORM PAYLOAD
// ======================================================

export type PlacementInterviewFormPayload = {
  interviewDate: string;

  interviewTime: string;

  timezone: string;

  interviewMethod: PlacementInterviewMethod;

  meetingLink?: string;

  notes?: string;
};

// ======================================================
// LIST RESPONSE
// ======================================================

export type PlacementInterviewListResponse = {
  status?: "success" | "error";

  success?: boolean;

  count?: number;

  data: PlacementInterview[];

  message?: string;
};

// ======================================================
// SINGLE RESPONSE
// ======================================================

export type PlacementInterviewResponse = {
  status?: "success" | "error";

  success?: boolean;

  data: PlacementInterview;

  message?: string;
};

// ======================================================
// API ERROR
// ======================================================

export type PlacementInterviewApiError = {
  status?: string;

  success?: boolean;

  message?: string;

  error?: string;
};
