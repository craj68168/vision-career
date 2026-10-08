export type ApprovalStatus = "pending" | "approved" | "rejected";

export type AccountStatus = "inactive" | "active" | "suspended";

export type PlacementStatus =
  | "unplaced"
  | "matching"
  | "interview"
  | "selected"
  | "placed";

export type AccountSource = "self_registration" | "admin";

export type ProfileStatus = "COMPLETE" | "INCOMPLETE";

export type PlacementEligibilityStatus = "ELIGIBLE" | "NOT_ELIGIBLE";

export type SeekerApprovalActorType = "admin" | "staff";

// ======================================================
// STAFF SCREENING
// ======================================================

export type SeekerScreeningStatus =
  | "NOT_SCREENED"
  | "SCREENED"
  | "NEEDS_ATTENTION";

export type AdminSeekerStaffScreening = {
  status: SeekerScreeningStatus;

  note?: string | null;

  screenedByStaffId?: string | null;

  screenedByStaffName?: string | null;

  screenedAt?: string | null;
};

// ======================================================
// APPROVAL REVIEW
// ======================================================

export type AdminSeekerApprovalReview = {
  reviewedAt?: string | null;

  reviewedByType?: SeekerApprovalActorType | null;

  reviewedById?: string | null;

  reviewedByName?: string | null;
};

// ======================================================
// APPROVAL HISTORY
// ======================================================

export type AdminSeekerApprovalHistoryItem = {
  id?: string | null;

  decision: ApprovalStatus;

  actorType?: SeekerApprovalActorType | string | null;

  actorId?: string | null;

  actorName?: string | null;

  reason?: string | null;

  reviewedAt?: string | null;
};

// ======================================================
// EDUCATION
// ======================================================

export type Education = {
  _id?: string;

  enrollment_date?: string | null;

  graduation_date?: string | null;

  school_type?: string | null;

  school: string;

  major?: string | null;
};

export type CreateEducationInput = {
  enrollment_date?: string | null;

  graduation_date?: string | null;

  school_type?: string | null;

  school: string;

  major?: string | null;
};

// ======================================================
// EMPLOYMENT
// ======================================================

export type EmploymentHistory = {
  _id?: string;

  start_date?: string | null;

  end_date?: string | null;

  employment_type?: string | null;

  company_name: string;
};

export type CreateEmploymentHistoryInput = {
  start_date?: string | null;

  end_date?: string | null;

  employment_type?: string | null;

  company_name: string;
};

// ======================================================
// DOCUMENT
// ======================================================

export type SeekerDocument = {
  _id?: string;

  name: string;

  file_url: string;

  document_type: string;
};

// ======================================================
// PLACEMENT ELIGIBILITY
// ======================================================

export type PlacementEligibility = {
  status: PlacementEligibilityStatus;

  reasons: string[];
};

// ======================================================
// SEEKER
// ======================================================

export type AdminSeeker = {
  _id: string;

  seeker_id: string;

  name: string;

  email: string;

  account_source?: AccountSource;

  password_setup_required?: boolean;

  approval_status: ApprovalStatus;

  account_status: AccountStatus;

  approval_reviewed_at?: string | null;

  approval_reviewed_by_type?: SeekerApprovalActorType | null;

  approval_reviewed_by_id?: string | null;

  approval_reviewed_by_name?: string | null;

  rejection_reason?: string | null;

  approvalReview?: AdminSeekerApprovalReview | null;

  approvalHistory?: AdminSeekerApprovalHistoryItem[];

  profile_photo?: string | null;

  phone?: string | null;

  address?: string | null;

  current_location?: string | null;

  date_of_birth?: string | null;

  gender?: string | null;

  nationality?: string | null;

  visa_type?: string | null;

  visa_expiry_date?: string | null;

  japanese_level?: string | null;

  skills: string[];

  desired_job?: string | null;

  desired_location?: string | null;

  available_from?: string | null;

  resume_file?: string | null;

  generated_resume_file?: string | null;

  other_documents: SeekerDocument[];

  education: Education[];

  employment_history: EmploymentHistory[];

  placement_status: PlacementStatus;

  notes?: string | null;

  applications_count: number;

  staffScreening: AdminSeekerStaffScreening;

  profile_status?: ProfileStatus;

  completion_percentage?: number;

  missing_fields?: string[];

  placement_eligible?: boolean;

  placement_eligibility?: PlacementEligibility;

  created_at: string;

  updated_at: string;
};

// ======================================================
// SUMMARY
// ======================================================

export type SeekerSummary = {
  total: number;

  active: number;

  inactive: number;

  suspended: number;

  approval: {
    pending: number;

    approved: number;

    rejected: number;
  };
};

// ======================================================
// PAGINATION
// ======================================================

export type Pagination = {
  page: number;

  limit: number;

  total: number;

  pages: number;
};

// ======================================================
// RESPONSES
// ======================================================

export type SeekerListResponse = {
  success: boolean;

  summary: SeekerSummary;

  pagination: Pagination;

  data: AdminSeeker[];

  message?: string;
};

export type SeekerResponse = {
  success: boolean;

  data: AdminSeeker;

  message?: string;

  email_sent?: boolean | null;

  warning?: string | null;
};

export type ApiMessageResponse = {
  success: boolean;

  message: string;
};

// ======================================================
// FILTERS
// ======================================================

export type SeekerFilters = {
  search: string;

  approvalStatus: "" | ApprovalStatus;

  accountStatus: "" | AccountStatus;

  placementStatus: "" | PlacementStatus;

  page: number;

  limit: number;
};

// ======================================================
// CREATE
// ======================================================

export type CreateSeekerPayload = {
  name: string;

  email: string;

  phone: string;

  address?: string | null;

  current_location?: string | null;

  date_of_birth?: string | null;

  gender?: string | null;

  nationality?: string | null;

  visa_type?: string | null;

  visa_expiry_date?: string | null;

  japanese_level?: string | null;

  skills: string[];

  desired_job?: string | null;

  desired_location?: string | null;

  available_from?: string | null;

  education: CreateEducationInput[];

  employment_history: CreateEmploymentHistoryInput[];

  notes?: string | null;

  placement_status?: PlacementStatus;
};

// ======================================================
// EDIT
// ======================================================

export type EditSeekerPayload = {
  name?: string;

  email?: string;

  phone?: string | null;

  address?: string | null;

  current_location?: string | null;

  date_of_birth?: string | null;

  gender?: string | null;

  nationality?: string | null;

  visa_type?: string | null;

  visa_expiry_date?: string | null;

  japanese_level?: string | null;

  skills?: string[];

  desired_job?: string | null;

  desired_location?: string | null;

  available_from?: string | null;

  education?: CreateEducationInput[];

  employment_history?: CreateEmploymentHistoryInput[];

  notes?: string | null;
};

// ======================================================
// APPROVAL
// ======================================================

export type ApprovalPayload = {
  decision: "approved" | "rejected";

  reason?: string;
};

// ======================================================
// ACCOUNT
// ======================================================

export type AccountStatusPayload = {
  status: AccountStatus;
};

// ======================================================
// PLACEMENT
// ======================================================

export type PlacementStatusPayload = {
  status: PlacementStatus;
};

// ======================================================
// API ERROR
// ======================================================

export type ApiErrorResponse = {
  success?: boolean;

  message?: string;
};
