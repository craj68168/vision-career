export type ApprovalStatus = "pending" | "approved" | "rejected";

export type AccountStatus = "inactive" | "active" | "suspended";

export type PlacementStatus =
  | "unplaced"
  | "matching"
  | "interview"
  | "selected"
  | "placed";

export type SeekerScreeningStatus =
  | "NOT_SCREENED"
  | "SCREENED"
  | "NEEDS_ATTENTION";

// ======================================================
// APPROVAL
// ======================================================

export type StaffSeekerApprovalDecision = "approved" | "rejected";

export type ApprovalActorType = "admin" | "staff";

export type StaffSeekerApprovalPayload = {
  decision: StaffSeekerApprovalDecision;

  reason?: string;
};

export type StaffSeekerApprovalReview = {
  reviewedAt?: string | null;

  reviewedByType?: ApprovalActorType | null;

  reviewedById?: string | null;

  reviewedByName?: string | null;
};

export type StaffSeekerApprovalHistoryItem = {
  id?: string | null;

  decision: StaffSeekerApprovalDecision;

  actorType?: ApprovalActorType | null;

  actorId?: string | null;

  actorName?: string | null;

  reason?: string | null;

  reviewedAt?: string | null;
};

// ======================================================
// SCREENING
// ======================================================

export type StaffSeekerScreening = {
  status: SeekerScreeningStatus;

  note?: string | null;

  screenedByStaffId?: string | null;

  screenedAt?: string | null;
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
// SEEKER
// ======================================================

export type StaffSeeker = {
  _id: string;

  seeker_id: string;

  name: string;

  email: string;

  approval_status: ApprovalStatus;

  account_status: AccountStatus;

  approval_reviewed_at?: string | null;

  rejection_reason?: string | null;

  approvalReview: StaffSeekerApprovalReview;

  approvalHistory: StaffSeekerApprovalHistoryItem[];

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

  applications_count: number;

  staffScreening: StaffSeekerScreening;

  created_at: string;

  updated_at: string;
};

// ======================================================
// SUMMARY
// ======================================================

export type StaffSeekerSummary = {
  total: number;

  pendingApproval: number;

  notScreened: number;

  screened: number;

  needsAttention: number;
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

export type StaffSeekerListResponse = {
  success: boolean;

  summary: StaffSeekerSummary;

  pagination: Pagination;

  data: StaffSeeker[];

  message?: string;
};

export type StaffSeekerResponse = {
  success: boolean;

  data: StaffSeeker;

  message?: string;
};

// ======================================================
// FILTERS
// ======================================================

export type StaffSeekerFilters = {
  search: string;

  approvalStatus: "" | ApprovalStatus;

  accountStatus: "" | AccountStatus;

  placementStatus: "" | PlacementStatus;

  screeningStatus: "" | SeekerScreeningStatus;

  page: number;

  limit: number;
};

// ======================================================
// SCREENING PAYLOAD
// ======================================================

export type ScreenSeekerPayload = {
  screeningStatus: "SCREENED" | "NEEDS_ATTENTION";

  note: string;
};

// ======================================================
// API ERROR
// ======================================================

export type ApiErrorResponse = {
  success?: boolean;

  message?: string;
};
