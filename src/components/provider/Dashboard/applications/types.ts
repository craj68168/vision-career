// ======================================================
// APPLICATION
// ======================================================

export type ProviderApplicationStatus =
  | "SENT_TO_PROVIDER"
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "HIRED"
  | "REJECTED";

export type ProviderEducation = {
  enrollment_date?: string | null;

  graduation_date?: string | null;

  school_type?: string | null;

  school?: string | null;

  major?: string | null;
};

export type ProviderEmploymentHistory = {
  start_date?: string | null;

  end_date?: string | null;

  employment_type?: string | null;

  company_name?: string | null;
};

export type ProviderApplicant = {
  name?: string | null;

  nationality?: string | null;

  visa_type?: string | null;

  visa_expiry_date?: string | null;

  japanese_level?: string | null;

  skills: string[];

  desired_job?: string | null;

  desired_location?: string | null;

  education: ProviderEducation[];

  employment_history: ProviderEmploymentHistory[];
};

export type ProviderApplicationVacancy = {
  vacancyId: string;

  title: string;

  titleKana?: string | null;

  companyName: string;

  employmentType: string;

  numberOfPeople: number;

  workLocation: string;

  remoteWork?: string | null;

  salaryMin?: number | null;

  salaryMax?: number | null;

  japaneseLevel?: string | null;

  status: string;
};

export type ProviderApplication = {
  application_id: string;

  vacancy_id: string;

  status: ProviderApplicationStatus;

  applied_at: string;

  created_at?: string;

  updated_at?: string;

  resume_available: boolean;

  applicant: ProviderApplicant;

  vacancy?: ProviderApplicationVacancy | null;
};

// ======================================================
// RESPONSES
// ======================================================

export type ProviderApplicationListResponse = {
  status: "success" | "error";

  count: number;

  data: ProviderApplication[];

  message?: string;
};

export type ProviderApplicationResponse = {
  status: "success" | "error";

  data: ProviderApplication;

  message?: string;
};

// ======================================================
// STATUS
// ======================================================

export type ProviderApplicationDecisionStatus =
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "HIRED"
  | "REJECTED";

export type UpdateProviderApplicationStatusPayload = {
  status: ProviderApplicationDecisionStatus;
};

// ======================================================
// INTERVIEW
// ======================================================

export type ProviderInterviewSourceType = "APPLICATION" | "PLACEMENT";

export type ProviderInterviewMethod =
  | "ZOOM"
  | "GOOGLE_MEET"
  | "PHONE"
  | "FACE_TO_FACE"
  | "OTHER";

export type ProviderInterviewStatus =
  | "AWAITING_LINK"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export type ProviderInterviewCandidate = {
  name?: string | null;

  nationality?: string | null;

  visaType?: string | null;

  visaExpiryDate?: string | null;

  japaneseLevel?: string | null;

  skills: string[];

  desiredJob?: string | null;

  desiredLocation?: string | null;
};

export type ProviderInterviewVacancy = {
  vacancyId?: string | null;

  title?: string | null;

  companyName?: string | null;

  employmentType?: string | null;

  workLocation?: string | null;

  japaneseLevel?: string | null;
};

export type ProviderInterviewPlacementRequest = {
  recruitId?: string | null;

  title?: string | null;

  companyName?: string | null;

  employmentType?: string | null;

  workLocation?: string | null;

  japaneseLevel?: string | null;
};

export type ProviderInterview = {
  interviewId: string;

  sourceType?: ProviderInterviewSourceType;

  applicationId?: string | null;

  vacancyId?: string | null;

  placementCandidateId?: string | null;

  recruitId?: string | null;

  applicationStatus?: ProviderApplicationStatus | null;

  placementCandidateStatus?: string | null;

  interviewDate: string;

  interviewTime: string;

  timezone: string;

  interviewMethod: ProviderInterviewMethod;

  meetingLink?: string | null;

  notes?: string | null;

  status: ProviderInterviewStatus;

  confirmedAt?: string | null;

  completedAt?: string | null;

  cancelledAt?: string | null;

  cancellationReason?: string | null;

  createdAt?: string;

  updatedAt?: string;

  candidate?: ProviderInterviewCandidate | null;

  vacancy?: ProviderInterviewVacancy | null;

  placementRequest?: ProviderInterviewPlacementRequest | null;
};

export type ProviderInterviewListResponse = {
  status: "success" | "error";

  count: number;

  data: ProviderInterview[];

  message?: string;
};

export type ProviderInterviewResponse = {
  status: "success" | "error";

  data: ProviderInterview;

  message?: string;
};

export type ScheduleProviderInterviewPayload = {
  applicationId: string;

  interviewDate: string;

  interviewTime: string;

  timezone: string;

  interviewMethod: ProviderInterviewMethod;

  meetingLink?: string;

  notes?: string;
};

export type UpdateProviderInterviewPayload = {
  interviewDate?: string;

  interviewTime?: string;

  timezone?: string;

  interviewMethod?: ProviderInterviewMethod;

  meetingLink?: string;

  notes?: string;
};

export type ApplicationApiError = {
  status?: string;

  message?: string;

  error?: string;
};
