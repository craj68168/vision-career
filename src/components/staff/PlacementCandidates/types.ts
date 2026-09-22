// ======================================================
// PIPELINE STATUS
// ======================================================

export type PlacementCandidateStatus =
  | "MATCHED"
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "PLACED"
  | "REJECTED";

// ======================================================
// STAFF REVIEW
// ======================================================

export type CandidateStaffReviewStatus =
  | "NOT_REVIEWED"
  | "REVIEWED"
  | "NEEDS_ATTENTION";

export type CandidateStaffReview = {
  status: CandidateStaffReviewStatus;

  note?: string | null;

  reviewedByStaffId?: string | null;

  reviewedAt?: string | null;
};

// ======================================================
// EDUCATION
// ======================================================

export type CandidateEducation = {
  enrollment_date?: string | null;

  graduation_date?: string | null;

  school_type?: string | null;

  school?: string | null;

  major?: string | null;
};

// ======================================================
// EMPLOYMENT
// ======================================================

export type CandidateEmployment = {
  start_date?: string | null;

  end_date?: string | null;

  employment_type?: string | null;

  company_name?: string | null;
};

// ======================================================
// SNAPSHOT
// ======================================================

export type StaffCandidateSnapshot = {
  name: string;

  nationality?: string | null;

  current_location?: string | null;

  visa_type?: string | null;

  visa_expiry_date?: string | null;

  japanese_level?: string | null;

  skills: string[];

  desired_job?: string | null;

  desired_location?: string | null;

  education: CandidateEducation[];

  employment_history: CandidateEmployment[];
};

// ======================================================
// PLACEMENT REQUEST CONTEXT
// ======================================================

export type CandidatePlacementRequest = {
  recruitId: string;

  jobTitle: string;

  jobCategory: string;

  employmentType: string;

  numberOfPositions: number;

  workLocation: string;

  japaneseLevelRequired?: string | null;

  visaTypeRequired?: string | null;

  status: string;
};

// ======================================================
// PROVIDER CONTEXT
// ======================================================

export type CandidateProvider = {
  registerId: string;

  name: string;

  companyName: string;
};

// ======================================================
// CANDIDATE
// ======================================================

export type StaffPlacementCandidate = {
  placementCandidateId: string;

  recruitId: string;

  providerId: string;

  seekerId: string;

  matchedByAdminId: string;

  status: PlacementCandidateStatus;

  candidate: StaffCandidateSnapshot;

  request?: CandidatePlacementRequest | null;

  provider?: CandidateProvider | null;

  staffReview: CandidateStaffReview;

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
// SUMMARY
// ======================================================

export type StaffPlacementCandidateSummary = {
  total: number;

  notReviewed: number;

  reviewed: number;

  needsAttention: number;

  matched: number;

  underReview: number;

  interview: number;

  selected: number;

  placed: number;

  rejected: number;
};

// ======================================================
// RESPONSES
// ======================================================

export type StaffPlacementCandidateListResponse = {
  success: boolean;

  count: number;

  summary: StaffPlacementCandidateSummary;

  data: StaffPlacementCandidate[];

  message?: string;
};

export type StaffPlacementCandidateResponse = {
  success: boolean;

  data: StaffPlacementCandidate;

  message?: string;
};

// ======================================================
// REVIEW
// ======================================================

export type ReviewCandidatePayload = {
  reviewStatus: "REVIEWED" | "NEEDS_ATTENTION";

  note: string;
};

// ======================================================
// API ERROR
// ======================================================

export type CandidateApiError = {
  success?: boolean;

  message?: string;
};
