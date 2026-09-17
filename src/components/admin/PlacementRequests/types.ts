export type PlacementRequestStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected";

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

  createdAt: string;
  updatedAt: string;
};

export type PlacementRequestSummary = {
  total: number;
  draft: number;
  pendingReview: number;
  approved: number;
  rejected: number;
};

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

export type ApiError = {
  success?: boolean;
  message?: string;
};
