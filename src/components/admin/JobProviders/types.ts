export type ProviderStatus = "active" | "inactive" | "suspended";

// ======================================================
// STAFF REVIEW
// ======================================================

export type ProviderReviewStatus =
  | "NOT_REVIEWED"
  | "REVIEWED"
  | "NEEDS_ATTENTION";

export type AdminProviderStaffReview = {
  status: ProviderReviewStatus;

  note?: string | null;

  reviewedByStaffId?: string | null;

  reviewedAt?: string | null;
};

// ======================================================
// PROVIDER
// ======================================================

export type AdminProvider = {
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

  staffReview: AdminProviderStaffReview;

  createdAt: string;

  updatedAt: string;
};

// ======================================================
// SUMMARY
// ======================================================

export type AdminProviderSummary = {
  total: number;

  active: number;

  inactive: number;

  suspended: number;

  withVacancies: number;

  withoutVacancies: number;

  totalVacancies: number;

  totalApplications: number;

  notReviewed: number;

  reviewed: number;

  needsAttention: number;
};

// ======================================================
// RESPONSES
// ======================================================

export type ProviderListResponse = {
  success: boolean;

  count: number;

  summary: AdminProviderSummary;

  data: AdminProvider[];

  message?: string;
};

export type ProviderDetailsResponse = {
  success: boolean;

  data: AdminProvider;

  message?: string;
};

export type ProviderMutationResponse = {
  success: boolean;

  message: string;

  data?: AdminProvider;
};

// ======================================================
// FORM
// ======================================================

export type ProviderForm = {
  name: string;

  companyName: string;

  email: string;

  password: string;

  phone: string;

  address: string;

  website: string;

  industry: string;

  contactPerson: string;

  contactPersonPhone: string;

  contactPersonEmail: string;

  hiringNeeds: string;

  notes: string;

  status: ProviderStatus;
};

export type CreateProviderPayload = ProviderForm;

export type UpdateProviderPayload = Partial<ProviderForm>;

export type ProviderApiError = {
  success?: boolean;

  message?: string;
};
