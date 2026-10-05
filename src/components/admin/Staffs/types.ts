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
  // Vacancies
  | "vacancies:view"
  | "vacancies:review"

  // Applications
  | "applications:view"
  | "applications:review"

  // Interviews
  | "interviews:view"
  | "interviews:manage"

  // Providers
  | "providers:view"
  | "providers:manage"

  // Job Seekers
  | "seekers:view"
  | "seekers:manage"
  | "seekers:approval"

  // Placement Requests
  | "placement_requests:view"
  | "placement_requests:review"
  | "placement_requests:manage_candidates"

  // Billing
  | "billing:view"
  | "billing:manage"

  // Training management
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
