// ======================================================
// EDUCATION
// ======================================================

export type ProviderEducation = {
  enrollment_date?: string | null;

  graduation_date?: string | null;

  school_type?: string | null;

  school?: string | null;

  major?: string | null;
};

// ======================================================
// EMPLOYMENT
// ======================================================

export type ProviderEmploymentHistory = {
  start_date?: string | null;

  end_date?: string | null;

  employment_type?: string | null;

  company_name?: string | null;
};

// ======================================================
// STATUS
// ======================================================

export type PlacementCandidateStatus =
  | "MATCHED"
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "PLACED"
  | "REJECTED";

export type ProviderPlacementCandidateDecisionStatus =
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "PLACED"
  | "REJECTED";

// ======================================================
// SNAPSHOT
// ======================================================

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

// ======================================================
// CANDIDATE
// ======================================================

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

// ======================================================
// RESPONSES
// ======================================================

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

// ======================================================
// UPDATE
// ======================================================

export type UpdateProviderPlacementCandidateStatusPayload = {
  status: ProviderPlacementCandidateDecisionStatus;

  rejectionReason?: string;
};

// ======================================================
// ERROR
// ======================================================

export type PlacementCandidateApiError = {
  status?: string;

  success?: boolean;

  message?: string;

  error?: string;
};
