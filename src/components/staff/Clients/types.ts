export type ProviderStatus = "active" | "inactive" | "suspended";

export type ProviderReviewStatus =
  | "NOT_REVIEWED"
  | "REVIEWED"
  | "NEEDS_ATTENTION";

export type StaffProviderReview = {
  status: ProviderReviewStatus;

  note?: string | null;

  reviewedByStaffId?: string | null;

  reviewedAt?: string | null;
};

export type StaffProvider = {
  registerId: string;

  name: string;

  companyName: string;

  email: string;

  role: "provider";

  status: ProviderStatus;

  phone?: string | null;

  address?: string | null;

  website?: string | null;

  industry?: string | null;

  contactPerson?: string | null;

  contactPersonPhone?: string | null;

  contactPersonEmail?: string | null;

  hiringNeeds?: string | null;

  notes?: string | null;

  vacancyCount: number;

  applicationCount: number;

  staffReview: StaffProviderReview;

  createdAt: string;

  updatedAt: string;
};

export type StaffProviderSummary = {
  total: number;

  active: number;

  inactive: number;

  suspended: number;

  notReviewed: number;

  reviewed: number;

  needsAttention: number;

  totalVacancies: number;

  totalApplications: number;
};

export type StaffProviderListResponse = {
  success: boolean;

  count: number;

  summary: StaffProviderSummary;

  data: StaffProvider[];

  message?: string;
};

export type StaffProviderResponse = {
  success: boolean;

  data: StaffProvider;

  message?: string;
};

export type ReviewProviderPayload = {
  reviewStatus: "REVIEWED" | "NEEDS_ATTENTION";

  note: string;
};

export type ProviderApiError = {
  success?: boolean;

  message?: string;
};
