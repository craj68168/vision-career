import type { StaffUser } from "@/components/auth/Staff/types";

export type StaffDashboardSummary = {
  jobSeekers: {
    total: number;
  };

  providers: {
    total: number;
  };

  vacancies: {
    total: number;
    published: number;
    pendingReview: number;
  };

  applications: {
    total: number;
    pendingAdminApproval: number;
    providerProcess: number;
  };

  placementRequests: {
    total: number;
  };
};

export type StaffDashboardResponse = {
  success: boolean;

  data: {
    summary: StaffDashboardSummary;
  };

  message?: string;
};

export type CurrentStaffResponse = {
  success: boolean;

  data: StaffUser;
};
