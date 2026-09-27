// ======================================================
// INTERVIEW METHOD
// ======================================================

export type PlacementInterviewMethod =
  | "ZOOM"
  | "GOOGLE_MEET"
  | "PHONE"
  | "FACE_TO_FACE"
  | "OTHER";

// ======================================================
// INTERVIEW STATUS
// ======================================================

export type PlacementInterviewStatus =
  | "AWAITING_LINK"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

// ======================================================
// CANDIDATE SNAPSHOT
// ======================================================

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

// ======================================================
// REQUEST SNAPSHOT
// ======================================================

export type PlacementInterviewRequestSummary = {
  recruitId?: string | null;

  title?: string | null;

  companyName?: string | null;

  employmentType?: string | null;

  workLocation?: string | null;

  japaneseLevel?: string | null;
};

// ======================================================
// INTERVIEW
// ======================================================

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

// ======================================================
// FORM
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
// RESPONSES
// ======================================================

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

// ======================================================
// ERROR
// ======================================================

export type PlacementInterviewApiError = {
  status?: string;

  success?: boolean;

  message?: string;

  error?: string;
};
