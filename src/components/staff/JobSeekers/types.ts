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

export type StaffSeekerScreening = {
  status: SeekerScreeningStatus;

  note?: string | null;

  screenedByStaffId?: string | null;

  screenedAt?: string | null;
};

export type Education = {
  _id?: string;

  enrollment_date?: string | null;

  graduation_date?: string | null;

  school_type?: string | null;

  school: string;

  major?: string | null;
};

export type EmploymentHistory = {
  _id?: string;

  start_date?: string | null;

  end_date?: string | null;

  employment_type?: string | null;

  company_name: string;
};

export type SeekerDocument = {
  _id?: string;

  name: string;

  file_url: string;

  document_type: string;
};

export type StaffSeeker = {
  _id: string;

  seeker_id: string;

  name: string;

  email: string;

  approval_status: ApprovalStatus;

  account_status: AccountStatus;

  approval_reviewed_at?: string | null;

  rejection_reason?: string | null;

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

export type StaffSeekerSummary = {
  total: number;

  pendingApproval: number;

  notScreened: number;

  screened: number;

  needsAttention: number;
};

export type Pagination = {
  page: number;

  limit: number;

  total: number;

  pages: number;
};

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

export type StaffSeekerFilters = {
  search: string;

  approvalStatus: "" | ApprovalStatus;

  accountStatus: "" | AccountStatus;

  placementStatus: "" | PlacementStatus;

  screeningStatus: "" | SeekerScreeningStatus;

  page: number;

  limit: number;
};

export type ScreenSeekerPayload = {
  screeningStatus: "SCREENED" | "NEEDS_ATTENTION";

  note: string;
};

export type ApiErrorResponse = {
  success?: boolean;

  message?: string;
};
