export type MissingField = {
  field: string;
  label: string;
};

// ======================================================
// PROFILE
// ======================================================

export type DashboardProfileResponse = {
  status: "success" | "error";

  message?: string;

  is_complete: boolean;

  completion_percentage: number;

  missing_fields: MissingField[];
};

// ======================================================
// VACANCY
// ======================================================

export type Vacancy = {
  vacancyId: string;

  companyName: string;

  companyNameKana?: string | null;

  title: string;

  titleKana?: string | null;

  employmentType: string;

  numberOfPeople: number;

  jobDescription: string;

  responsibilities?: string | null;

  requiredSkills?: string | null;

  preferredSkills?: string | null;

  requiredEducation?: string | null;

  requiredExperience?: string | null;

  japaneseLevel?: string | null;

  workLocation: string;

  remoteWork?: string | null;

  salaryMin?: number | null;

  salaryMax?: number | null;

  salaryNote?: string | null;

  workHours?: string | null;

  breakTime?: string | null;

  overtime?: string | null;

  holidays?: string | null;

  benefits?: string[];

  insurance?: string[];

  trialPeriod?: string | null;

  applicationDeadline?: string | null;

  startDate?: string | null;

  selectionProcess?: string | null;

  status?: string;

  createdAt?: string;
};

// ======================================================
// VACANCY RESPONSES
// ======================================================

export type VacancyListResponse = {
  success: boolean;

  count: number;

  data: Vacancy[];

  message?: string;
};

export type VacancyItemResponse = {
  success: boolean;

  data: Vacancy;

  message?: string;
};

// ======================================================
// APPLICATION STATUS
//
// Must match backend applicationSchema.js
// ======================================================

export type ApplicationStatus =
  | "PENDING_ADMIN_APPROVAL"
  | "ADMIN_REJECTED"
  | "SENT_TO_PROVIDER"
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "HIRED"
  | "REJECTED";

// ======================================================
// STATUS TRACKING
// ======================================================

export type ApplicationTrackingStep = {
  key: string;

  label: string;

  state: "pending" | "current" | "completed" | "rejected";
};

export type ApplicationStatusTracking = {
  current_status: string;

  current_label: string;

  outcome: "in_progress" | "completed" | "rejected";

  steps: ApplicationTrackingStep[];
};

// ======================================================
// APPLICATION
// ======================================================

export type Application = {
  application_id: string;

  vacancy_id: string;

  cover_letter?: string | null;

  status: ApplicationStatus;

  status_tracking?: ApplicationStatusTracking;

  admin_rejection_reason?: string | null;

  admin_reviewed_at?: string | null;

  applied_at: string;

  created_at?: string;

  updated_at?: string;

  vacancy?: Vacancy | null;
};

// ======================================================
// APPLICATION LIST RESPONSE
// ======================================================

export type ApplicationListResponse = {
  success: boolean;

  count: number;

  data: Application[];

  message?: string;
};

// ======================================================
// APPLY PAYLOAD
// ======================================================

export type ApplyVacancyPayload = {
  vacancyId: string;

  coverLetter?: string | null;
};

// ======================================================
// APPLY RESPONSE
// ======================================================

export type ApplyVacancyResult = {
  applicationId: string;

  vacancyId: string;

  status: ApplicationStatus;

  appliedAt: string;
};

export type ApplyVacancyResponse = {
  success: boolean;

  message: string;

  data: ApplyVacancyResult;
};

// ======================================================
// DASHBOARD
// ======================================================

export type DashboardTab = "available" | "applied";

// ======================================================
// API ERROR
// ======================================================

export type ApiErrorResponse = {
  success?: boolean;

  status?: string;

  message?: string;
};
