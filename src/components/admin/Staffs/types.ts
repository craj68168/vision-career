// ======================================================
// STAFF TYPES
// ======================================================

export type StaffStatus = "active" | "inactive" | "suspended";

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

// ======================================================
// STAFF
// ======================================================

export type Staff = {
  id?: string;

  staffId: string;

  name: string;

  email: string;

  phone?: string | null;

  role: "staff";

  status: StaffStatus;

  permissions: StaffPermission[];

  createdByAdminId: string;

  lastLoginAt?: string | null;

  passwordChangedAt?: string | null;

  createdAt?: string;

  updatedAt?: string;
};

// ======================================================
// SUMMARY
// ======================================================

export type StaffSummary = {
  total: number;

  active: number;

  inactive: number;

  suspended: number;
};

// ======================================================
// LIST RESPONSE
// ======================================================

export type StaffListResponse = {
  success: boolean;

  count: number;

  summary: StaffSummary;

  data: Staff[];

  message?: string;
};

// ======================================================
// SINGLE RESPONSE
// ======================================================

export type StaffResponse = {
  success: boolean;

  message?: string;

  data: Staff;
};

// ======================================================
// PERMISSION RESPONSE
// ======================================================

export type StaffPermissionResponse = {
  success: boolean;

  data: StaffPermission[];
};

// ======================================================
// CREATE PAYLOAD
// ======================================================

export type CreateStaffPayload = {
  name: string;

  email: string;

  phone: string;

  password: string;

  status: StaffStatus;

  permissions: StaffPermission[];
};

// ======================================================
// UPDATE PAYLOAD
// ======================================================

export type UpdateStaffPayload = {
  name: string;

  email: string;

  phone: string;

  status: StaffStatus;

  permissions: StaffPermission[];
};

// ======================================================
// RESET PASSWORD
// ======================================================

export type ResetStaffPasswordPayload = {
  password: string;
};

// ======================================================
// API ERROR
// ======================================================

export type ApiErrorResponse = {
  success?: boolean;

  message?: string;
};
