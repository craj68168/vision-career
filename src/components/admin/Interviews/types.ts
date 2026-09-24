// ======================================================
// APPLICATION STATUS
// ======================================================

export type InterviewApplicationStatus =
  | "PENDING_ADMIN_APPROVAL"
  | "ADMIN_REJECTED"
  | "SENT_TO_PROVIDER"
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "HIRED"
  | "REJECTED";

// ======================================================
// INTERVIEW METHOD
// ======================================================

export type AdminInterviewMethod =
  | "ZOOM"
  | "GOOGLE_MEET"
  | "PHONE"
  | "FACE_TO_FACE"
  | "OTHER";

// ======================================================
// INTERVIEW STATUS
// ======================================================

export type AdminInterviewStatus =
  | "AWAITING_LINK"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

// ======================================================
// ACTOR
// ======================================================

export type InterviewActorRole = "provider" | "admin" | "staff";

export type InterviewActor = {
  role?: InterviewActorRole | null;

  id?: string | null;
};

// ======================================================
// CANDIDATE
// ======================================================

export type AdminInterviewCandidate = {
  seekerId?: string | null;

  name?: string | null;

  email?: string | null;

  phone?: string | null;

  currentLocation?: string | null;

  nationality?: string | null;

  visaType?: string | null;

  japaneseLevel?: string | null;
};

// ======================================================
// VACANCY
// ======================================================

export type AdminInterviewVacancy = {
  vacancyId?: string | null;

  title?: string | null;

  companyName?: string | null;

  employmentType?: string | null;

  workLocation?: string | null;
};

// ======================================================
// PROVIDER
// ======================================================

export type AdminInterviewProvider = {
  registerId?: string | null;

  name?: string | null;

  companyName?: string | null;

  email?: string | null;
};

// ======================================================
// INTERVIEW
// ======================================================

export type AdminInterview = {
  interviewId: string;

  applicationId: string;

  seekerId: string;

  providerId: string;

  vacancyId: string;

  applicationStatus?: InterviewApplicationStatus | null;

  interviewDate: string;

  interviewTime: string;

  timezone: string;

  interviewMethod: AdminInterviewMethod;

  meetingLink?: string | null;

  notes?: string | null;

  status: AdminInterviewStatus;

  scheduledBy: InterviewActor;

  updatedBy: InterviewActor;

  confirmedAt?: string | null;

  notificationSentAt?: string | null;

  completedAt?: string | null;

  cancelledAt?: string | null;

  cancellationReason?: string | null;

  createdAt?: string | null;

  updatedAt?: string | null;

  candidate: AdminInterviewCandidate;

  vacancy: AdminInterviewVacancy;

  provider: AdminInterviewProvider;
};

// ======================================================
// SUMMARY
// ======================================================

export type AdminInterviewSummary = {
  total: number;

  awaitingLink: number;

  confirmed: number;

  completed: number;

  cancelled: number;
};

// ======================================================
// LIST RESPONSE
// ======================================================

export type AdminInterviewListResponse = {
  success: boolean;

  count: number;

  summary: AdminInterviewSummary;

  data: AdminInterview[];

  message?: string;
};

// ======================================================
// DETAILS RESPONSE
// ======================================================

export type AdminInterviewResponse = {
  success: boolean;

  data: AdminInterview;

  message?: string;
};

// ======================================================
// UPDATE
// ======================================================

export type UpdateAdminInterviewPayload = {
  interviewDate?: string;

  interviewTime?: string;

  timezone?: string;

  interviewMethod?: AdminInterviewMethod;

  meetingLink?: string;

  notes?: string;
};

// ======================================================
// FILTER
// ======================================================

export type AdminInterviewStatusFilter = "ALL" | AdminInterviewStatus;

export type AdminInterviewMethodFilter = "ALL" | AdminInterviewMethod;

// ======================================================
// API ERROR
// ======================================================

export type ApiErrorResponse = {
  success?: boolean;

  message?: string;
};
