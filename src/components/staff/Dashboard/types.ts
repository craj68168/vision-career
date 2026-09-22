import type { StaffUser } from "@/components/auth/Staff/types";

// ======================================================
// STAFF DASHBOARD SUMMARY
// ======================================================

export type StaffDashboardSummary = {
  // ====================================================
  // JOB SEEKERS
  // ====================================================

  jobSeekers: {
    total: number;
  };

  // ====================================================
  // PROVIDERS
  // ====================================================

  providers: {
    total: number;
  };

  // ====================================================
  // VACANCIES
  // ====================================================

  vacancies: {
    total: number;

    published: number;

    pendingReview: number;
  };

  // ====================================================
  // APPLICATIONS
  // ====================================================

  applications: {
    total: number;

    pendingAdminApproval: number;

    providerProcess: number;
  };

  // ====================================================
  // PLACEMENT REQUESTS
  // ====================================================

  placementRequests: {
    total: number;
  };

  // ====================================================
  // PLACEMENT CANDIDATES
  // ====================================================

  placementCandidates: {
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
};

// ======================================================
// DASHBOARD RESPONSE
// ======================================================

export type StaffDashboardResponse = {
  success: boolean;

  data: {
    summary: StaffDashboardSummary;
  };

  message?: string;
};

// ======================================================
// CURRENT STAFF
// ======================================================

export type CurrentStaffResponse = {
  success: boolean;

  data: StaffUser;
};
