// ======================================================
// PROVIDER DASHBOARD TYPES
// ======================================================

export type ProviderDashboardTab =
  | "vacancies"
  | "applications"
  | "placement-requests"
  | "billing";

// ======================================================
// DASHBOARD SUMMARY
// ======================================================

export type ProviderDashboardSummary = {
  totalVacancies: number;

  publishedCount: number;

  pendingVacancyCount: number;

  totalApplications: number;

  totalPlacementRequests: number;
};

// ======================================================
// API ERROR
// ======================================================

export type ProviderDashboardApiError = {
  status?: string;

  success?: boolean;

  message?: string;

  error?: string;
};
