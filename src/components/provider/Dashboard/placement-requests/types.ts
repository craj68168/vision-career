// ======================================================
// SHARED SNAPSHOT TYPES
// ======================================================

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

// ======================================================
// PLACEMENT REQUEST
// ======================================================

export type PlacementRequestStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected";

export type PlacementRequest = {
  _id?: string;

  recruitId: string;

  company_id: string;

  job_title: string;

  job_category: string;

  employment_type: string;

  number_of_positions: number;

  work_location: string;

  job_description: string;

  requirements: string;

  japanese_level_required: string;

  visa_type_required: string;

  salary_type: string;

  salary_amount: number;

  working_hours: string;

  days_off: string;

  start_date: string;

  status: PlacementRequestStatus;

  submitted_at?: string | null;

  reviewed_at?: string | null;

  rejection_reason?: string | null;

  createdAt?: string;

  updatedAt?: string;
};

export type CreatePlacementRequestPayload = {
  job_title: string;

  job_category: string;

  employment_type: string;

  number_of_positions: number;

  work_location: string;

  job_description: string;

  requirements: string;

  japanese_level_required: string;

  visa_type_required: string;

  salary_type: string;

  salary_amount: number;

  working_hours: string;

  days_off: string;

  start_date: string;
};

export type PlacementRequestListResponse = {
  success: boolean;

  count: number;

  data: PlacementRequest[];

  message?: string;
};

export type PlacementRequestResponse = {
  success: boolean;

  message?: string;

  data: PlacementRequest;
};

// ======================================================
// CANDIDATE
// ======================================================

export type PlacementCandidateStatus =
  | "MATCHED"
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "PLACED"
  | "REJECTED";

export type ProviderPlacementCandidateSnapshot = {
  name: string;

  nationality?: string | null;

  current_location?: string | null;

  visa_type?: string | null;

  visa_expiry_date?: string | null;

  japanese_level?: string | null;

  skills: string[];

  desired_job?: string | null;

  desired_location?: string | null;

  education: ProviderEducation[];

  employment_history: ProviderEmploymentHistory[];
};

export type ProviderPlacementCandidate = {
  placementCandidateId: string;

  recruitId: string;

  status: PlacementCandidateStatus;

  candidate: ProviderPlacementCandidateSnapshot;

  matchedAt?: string | null;

  providerReviewedAt?: string | null;

  interviewAt?: string | null;

  selectedAt?: string | null;

  placedAt?: string | null;

  rejectedAt?: string | null;

  rejectionReason?: string | null;

  createdAt?: string;

  updatedAt?: string;
};

export type ProviderPlacementCandidateListResponse = {
  success: boolean;

  count: number;

  data: ProviderPlacementCandidate[];

  message?: string;
};

export type ProviderPlacementCandidateResponse = {
  success: boolean;

  data: ProviderPlacementCandidate;

  message?: string;
};

export type ProviderPlacementCandidateDecisionStatus =
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "PLACED"
  | "REJECTED";

export type UpdateProviderPlacementCandidateStatusPayload = {
  status: ProviderPlacementCandidateDecisionStatus;

  rejectionReason?: string;
};

// ======================================================
// ERROR
// ======================================================

export type PlacementRequestApiError = {
  status?: string;

  success?: boolean;

  message?: string;

  error?: string;
};
