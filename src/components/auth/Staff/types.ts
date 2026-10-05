export type StaffPermission =
  // Legacy automatic permissions.
  | "dashboard:view"
  | "training:view"

  // Vacancies.
  | "vacancies:view"
  | "vacancies:review"

  // Applications.
  | "applications:view"
  | "applications:review"

  // Interviews.
  | "interviews:view"
  | "interviews:manage"

  // Providers.
  | "providers:view"
  | "providers:manage"

  // Job Seekers.
  | "seekers:view"
  | "seekers:manage"
  | "seekers:approval"

  // Placement.
  | "placement_requests:view"
  | "placement_requests:review"
  | "placement_requests:manage_candidates"

  // Billing.
  | "billing:view"
  | "billing:manage"

  // Training management.
  | "training:manage";

export type StaffUser = {
  staffId: string;

  name: string;

  email: string;

  phone?: string | null;

  role: "staff";

  status: "active" | "inactive" | "suspended";

  permissions: StaffPermission[];

  lastLoginAt?: string | null;

  passwordChangedAt?: string | null;

  createdAt?: string;

  updatedAt?: string;
};

export type StaffLoginPayload = {
  email: string;

  password: string;
};

export type StaffLoginResponse = {
  success: boolean;

  message: string;

  token: string;

  user: StaffUser;
};

export type CurrentStaffResponse = {
  success: boolean;

  data: StaffUser;

  message?: string;
};

export type ApiErrorResponse = {
  success?: boolean;

  status?: string;

  message?: string;
};
