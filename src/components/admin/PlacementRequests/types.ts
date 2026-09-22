// ======================================================
// PLACEMENT REQUEST
// ======================================================

export type PlacementRequestStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected";

// ======================================================
// STAFF SCREENING
// ======================================================

export type PlacementRequestScreeningStatus =
  | "NOT_SCREENED"
  | "SCREENED"
  | "NEEDS_ATTENTION";

export type PlacementRequestStaffScreening = {
  status: PlacementRequestScreeningStatus;

  note?: string | null;

  screenedByStaffId?: string | null;

  screenedAt?: string | null;
};

// ======================================================
// REQUEST
// ======================================================

export type PlacementRequest = {
  recruitId: string;

  companyId: string;

  companyName: string;

  providerName: string;

  providerEmail?: string | null;

  jobTitle: string;

  jobCategory: string;

  employmentType: string;

  numberOfPositions: number;

  workLocation: string;

  jobDescription: string;

  requirements: string;

  japaneseLevelRequired: string;

  visaTypeRequired: string;

  salaryType: string;

  salaryAmount: number;

  workingHours: string;

  daysOff: string;

  startDate: string;

  status: PlacementRequestStatus;

  rejectionReason?: string | null;

  submittedAt?: string | null;

  reviewedAt?: string | null;

  // ==================================================
  // STAFF SCREENING
  // ==================================================

  staffScreening: PlacementRequestStaffScreening;

  createdAt?: string;

  updatedAt?: string;
};

// ======================================================
// PLACEMENT REQUEST SUMMARY
// ======================================================

export type PlacementRequestSummary = {
  total: number;

  pendingReview: number;

  approved: number;

  rejected: number;

  notScreened: number;

  screened: number;

  needsAttention: number;
};

// ======================================================
// PLACEMENT REQUEST RESPONSES
// ======================================================

export type PlacementRequestListResponse = {
  success: boolean;

  count: number;

  summary: PlacementRequestSummary;

  data: PlacementRequest[];

  message?: string;
};

export type PlacementRequestResponse = {
  success: boolean;

  data: PlacementRequest;

  message?: string;
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
// ELIGIBLE SEEKER
// ======================================================

export type EligibleSeeker = {
  seekerId: string;

  name: string;

  nationality?: string | null;

  currentLocation?: string | null;

  visaType?: string | null;

  visaExpiryDate?: string | null;

  japaneseLevel?: string | null;

  skills: string[];

  desiredJob?: string | null;

  desiredLocation?: string | null;

  education: CandidateEducation[];

  employmentHistory: CandidateEmployment[];

  placementStatus:
    | "unplaced"
    | "matching"
    | "interview"
    | "selected"
    | "placed";
};

// ======================================================
// ELIGIBLE SEEKER RESPONSE
// ======================================================

export type EligibleSeekerResponse = {
  success: boolean;

  recruit: {
    recruitId: string;

    jobTitle: string;

    numberOfPositions: number;

    workLocation: string;

    japaneseLevelRequired?: string | null;

    visaTypeRequired?: string | null;
  };

  count: number;

  data: EligibleSeeker[];

  message?: string;
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
// CANDIDATE SNAPSHOT
// ======================================================

export type PlacementCandidateSnapshot = {
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
// MATCHED CANDIDATE
// ======================================================

export type PlacementCandidate = {
  placementCandidateId: string;

  recruitId: string;

  providerId: string;

  seekerId: string;

  status: PlacementCandidateStatus;

  candidate: PlacementCandidateSnapshot;

  matchedByAdminId: string;

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
// MATCHED CANDIDATE LIST RESPONSE
// ======================================================

export type PlacementCandidateListResponse = {
  success: boolean;

  count: number;

  data: PlacementCandidate[];

  message?: string;
};

// ======================================================
// MATCH CANDIDATE RESPONSE
// ======================================================

export type PlacementCandidateResponse = {
  success: boolean;

  message?: string;

  data: PlacementCandidate;
};

// ======================================================
// API ERROR
// ======================================================

export type ApiError = {
  success?: boolean;

  status?: string;

  message?: string;

  error?: string;
};
