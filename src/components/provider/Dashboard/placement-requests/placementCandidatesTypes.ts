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
// EMPLOYMENT HISTORY
// ======================================================

export type ProviderEmploymentHistory = {
  start_date?: string | null;

  end_date?: string | null;

  employment_type?: string | null;

  company_name?: string | null;
};

// ======================================================
// PLACEMENT CANDIDATE STATUS
// ======================================================

export type PlacementCandidateStatus =
  | "MATCHED"
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "PLACED"
  | "REJECTED";

// ======================================================
// PROVIDER-SAFE CANDIDATE
//
// Provider MUST NOT receive:
//
// seekerId
// email
// phone
// home address
// profile photo path
// storage key
// private documents
// ======================================================

export type ProviderPlacementCandidateSnapshot = {
  name: string;

  // Boolean only.
  // Actual photo is loaded through protected endpoint.
  photo_available?: boolean;

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
// PLACEMENT CANDIDATE
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
// LIST RESPONSE
// ======================================================

export type ProviderPlacementCandidateListResponse = {
  success: boolean;

  count: number;

  data: ProviderPlacementCandidate[];

  message?: string;
};

// ======================================================
// SINGLE RESPONSE
// ======================================================

export type ProviderPlacementCandidateResponse = {
  success: boolean;

  data: ProviderPlacementCandidate;

  message?: string;
};

// ======================================================
// PROVIDER DIRECT DECISIONS
//
// INTERVIEW IS NOT HERE.
//
// UNDER_REVIEW -> INTERVIEW happens only through
// interview scheduling.
// ======================================================

export type ProviderPlacementCandidateDecisionStatus =
  | "UNDER_REVIEW"
  | "SELECTED"
  | "PLACED"
  | "REJECTED";

// ======================================================
// UPDATE STATUS
// ======================================================

export type UpdateProviderPlacementCandidateStatusPayload = {
  status: ProviderPlacementCandidateDecisionStatus;

  rejectionReason?: string;
};

// ======================================================
// API ERROR
// ======================================================

export type PlacementCandidateApiError = {
  status?: string;

  success?: boolean;

  message?: string;

  error?: string;
};
