// ======================================================
// STAFF TYPES
// ======================================================

export type StaffStatus = "active" | "inactive" | "suspended";

// ======================================================
// STAFF PERMISSION
//
// dashboard:view and training:view are retained in the
// TypeScript union for backward compatibility because
// older Staff records may still contain them.
//
// They are no longer assignable from Admin.
// ======================================================

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
  | "placement_requests:approval"
  | "billing:view"
  | "billing:manage"
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
