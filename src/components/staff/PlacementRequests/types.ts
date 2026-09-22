// ======================================================
// REQUEST STATUS
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

export type StaffPlacementRequest = {
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

  staffScreening: PlacementRequestStaffScreening;

  createdAt?: string;

  updatedAt?: string;
};

// ======================================================
// SUMMARY
// ======================================================

export type StaffPlacementRequestSummary = {
  total: number;

  pendingReview: number;

  notScreened: number;

  screened: number;

  needsAttention: number;

  approved: number;

  rejected: number;
};

// ======================================================
// RESPONSES
// ======================================================

export type StaffPlacementRequestListResponse = {
  success: boolean;

  count: number;

  summary: StaffPlacementRequestSummary;

  data: StaffPlacementRequest[];

  message?: string;
};

export type StaffPlacementRequestResponse = {
  success: boolean;

  data: StaffPlacementRequest;

  message?: string;
};

// ======================================================
// SCREEN PAYLOAD
// ======================================================

export type ScreenPlacementRequestPayload = {
  screeningStatus: "SCREENED" | "NEEDS_ATTENTION";

  note: string;
};

// ======================================================
// API ERROR
// ======================================================

export type ApiError = {
  success?: boolean;

  message?: string;
};
