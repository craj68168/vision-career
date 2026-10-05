export type StaffPermission =
  | "dashboard:view"
  | "training:view"
  | "vacancies:view"
  | "vacancies:review"
  | "vacancies:approval"
  | "applications:view"
  | "applications:review"
  | "applications:approval"
  | "interviews:view"
  | "interviews:manage"
  | "providers:view"
  | "providers:manage"
  | "seekers:view"
  | "seekers:manage"
  | "seekers:approval"
  | "placement_requests:view"
  | "placement_requests:review"
  | "placement_requests:manage_candidates"
  | "billing:view"
  | "billing:manage"
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
