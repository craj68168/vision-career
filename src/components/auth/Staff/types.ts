export type StaffPermission =
  | "dashboard:view"
  | "vacancies:view"
  | "vacancies:review"
  | "applications:view"
  | "applications:review"
  | "providers:view"
  | "providers:manage"
  | "seekers:view"
  | "seekers:manage"
  | "placement_requests:view"
  | "placement_requests:review"
  | "placement_requests:manage_candidates"
  | "billing:view"
  | "billing:manage"
  | "training:view"
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
