export type StaffApplicationStatus =
  | "PENDING_ADMIN_APPROVAL"
  | "ADMIN_REJECTED"
  | "SENT_TO_PROVIDER"
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "HIRED"
  | "REJECTED";

export type StaffScreeningStatus =
  | "NOT_SCREENED"
  | "SCREENED"
  | "NEEDS_ATTENTION";

// ======================================================
// EDUCATION
// ======================================================

export type StaffApplicationEducation = {
  enrollment_date?: string | null;

  graduation_date?: string | null;

  school_type?: string | null;

  school?: string | null;

  major?: string | null;
};

// ======================================================
// EMPLOYMENT
// ======================================================

export type StaffEmploymentHistory = {
  start_date?: string | null;

  end_date?: string | null;

  employment_type?: string | null;

  company_name?: string | null;
};

// ======================================================
// APPLICANT
// ======================================================

export type StaffApplicationApplicant = {
  name?: string | null;

  nationality?: string | null;

  visaType?: string | null;

  visaExpiryDate?: string | null;

  japaneseLevel?: string | null;

  skills: string[];

  desiredJob?: string | null;

  desiredLocation?: string | null;

  education: StaffApplicationEducation[];

  employmentHistory: StaffEmploymentHistory[];

  resumeAvailable: boolean;
};

// ======================================================
// VACANCY
// ======================================================

export type StaffApplicationVacancy = {
  vacancyId: string;

  title: string;

  companyName: string;

  employmentType: string;

  numberOfPeople: number;

  workLocation: string;

  japaneseLevel?: string | null;

  status: string;
};

// ======================================================
// SCREENING
// ======================================================

export type StaffApplicationScreening = {
  status: StaffScreeningStatus;

  note?: string | null;

  screenedByStaffId?: string | null;

  screenedAt?: string | null;
};

// ======================================================
// APPLICATION
// ======================================================

export type StaffApplication = {
  applicationId: string;

  vacancyId: string;

  providerId: string;

  status: StaffApplicationStatus;

  coverLetter?: string | null;

  appliedAt: string;

  createdAt?: string;

  updatedAt?: string;

  screening: StaffApplicationScreening;

  applicant: StaffApplicationApplicant;

  vacancy?: StaffApplicationVacancy | null;
};

// ======================================================
// SUMMARY
// ======================================================

export type StaffApplicationSummary = {
  total: number;

  pendingAdminApproval: number;

  notScreened: number;

  screened: number;

  needsAttention: number;
};

// ======================================================
// LIST RESPONSE
// ======================================================

export type StaffApplicationListResponse = {
  success: boolean;

  count: number;

  summary: StaffApplicationSummary;

  data: StaffApplication[];

  message?: string;
};

// ======================================================
// APPLICATION RESPONSE
// ======================================================

export type StaffApplicationResponse = {
  success: boolean;

  message?: string;

  data: StaffApplication;
};

// ======================================================
// ACTION RESPONSE
// ======================================================

export type StaffApplicationActionResponse = {
  success: boolean;

  message: string;

  data?: StaffApplication;
};

// ======================================================
// SCREENING PAYLOAD
// ======================================================

export type ScreenApplicationPayload = {
  screeningStatus: "SCREENED" | "NEEDS_ATTENTION";

  note: string;
};

// ======================================================
// REJECTION
// ======================================================

export type RejectStaffApplicationPayload = {
  reason: string;
};

// ======================================================
// API ERROR
// ======================================================

export type ApiErrorResponse = {
  success?: boolean;

  message?: string;
};
