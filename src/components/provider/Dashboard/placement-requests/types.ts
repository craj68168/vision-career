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
// ERROR
// ======================================================

export type PlacementRequestApiError = {
  status?: string;

  success?: boolean;

  message?: string;

  error?: string;
};

// ======================================================
// PLACEMENT CANDIDATE COMPATIBILITY EXPORTS
// ======================================================

export type {
  ProviderEducation,
  ProviderEmploymentHistory,
  PlacementCandidateStatus,
  ProviderPlacementCandidateDecisionStatus,
  ProviderPlacementCandidateSnapshot,
  ProviderPlacementCandidate,
  ProviderPlacementCandidateListResponse,
  ProviderPlacementCandidateResponse,
  UpdateProviderPlacementCandidateStatusPayload,
  PlacementCandidateApiError,
} from "./placementCandidatesTypes";

// ======================================================
// PLACEMENT INTERVIEW COMPATIBILITY EXPORTS
// ======================================================

export type {
  PlacementInterview,
  PlacementInterviewStatus,
  PlacementInterviewMethod,
  PlacementInterviewFormPayload,
  PlacementInterviewListResponse,
  PlacementInterviewResponse,
} from "./placementInterviewTypes";
