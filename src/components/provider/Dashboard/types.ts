// ======================================================
// PROVIDER DASHBOARD TYPES
// ======================================================

// ======================================================
// VACANCY
// ======================================================

export type VacancyStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "published"
  | "closed";

export type Vacancy = {
  _id?: string;

  vacancyId: string;

  registerId?: string;

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
  workLocationDetail?: string | null;

  remoteWork?: string | null;

  salaryMin?: number | null;
  salaryMax?: number | null;

  salaryNote?: string | null;

  workHours?: string | null;
  breakTime?: string | null;

  overtime?: string | null;

  holidays?: string | null;

  benefits: string[];

  insurance: string[];

  trialPeriod?: string | null;

  applicationDeadline?: string | null;

  startDate?: string | null;

  selectionProcess?: string | null;

  contactPerson: string;

  contactPersonKana?: string | null;

  contactEmail: string;

  status: VacancyStatus;

  isPublished: boolean;

  reviewedAt?: string | null;

  rejectionReason?: string | null;

  createdAt?: string;

  updatedAt?: string;
};

// ======================================================
// CREATE / UPDATE VACANCY PAYLOAD
// ======================================================

export type CreateVacancyPayload = {
  companyName: string;

  companyNameKana: string;

  title: string;

  titleKana: string;

  employmentType: string;

  numberOfPeople: number;

  jobDescription: string;

  responsibilities: string;

  requiredSkills: string;

  preferredSkills: string;

  requiredEducation: string;

  requiredExperience: string;

  japaneseLevel: string;

  workLocation: string;

  workLocationDetail: string;

  remoteWork: string;

  salaryMin: number | null;

  salaryMax: number | null;

  salaryNote: string;

  workHours: string;

  breakTime: string;

  overtime: string;

  holidays: string;

  benefits: string[];

  insurance: string[];

  trialPeriod: string;

  applicationDeadline: string;

  startDate: string;

  selectionProcess: string;

  contactPerson: string;

  contactPersonKana: string;

  contactEmail: string;
};

// ======================================================
// VACANCY RESPONSES
// ======================================================

export type VacancyListResponse = {
  status: "success" | "error";

  count: number;

  data: Vacancy[];

  message?: string;
};

export type VacancyResponse = {
  status: "success" | "error";

  message?: string;

  data: Vacancy;

  vacancyId?: string;
};

// ======================================================
// PROVIDER APPLICATION STATUS
// ======================================================
//
// Provider only receives applications after Admin approval.
//
// PENDING_ADMIN_APPROVAL
// ADMIN_REJECTED
//
// are intentionally NOT part of the provider-visible statuses.
//
// ======================================================

export type ProviderApplicationStatus =
  | "SENT_TO_PROVIDER"
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "HIRED"
  | "REJECTED";

// ======================================================
// APPLICANT EDUCATION
// ======================================================

export type ProviderEducation = {
  enrollment_date?: string | null;

  graduation_date?: string | null;

  school_type?: string | null;

  school?: string | null;

  major?: string | null;
};

// ======================================================
// APPLICANT EMPLOYMENT HISTORY
// ======================================================

export type ProviderEmploymentHistory = {
  start_date?: string | null;

  end_date?: string | null;

  employment_type?: string | null;

  company_name?: string | null;
};

// ======================================================
// SAFE APPLICANT PROFILE
// ======================================================
//
// IMPORTANT:
//
// Provider does NOT receive:
//
// - seeker_id
// - email
// - phone
// - address
// - private documents
// - generated resume file path
//
// ======================================================

export type ProviderApplicant = {
  name?: string | null;

  nationality?: string | null;

  visa_type?: string | null;

  visa_expiry_date?: string | null;

  japanese_level?: string | null;

  skills: string[];

  desired_job?: string | null;

  desired_location?: string | null;

  education: ProviderEducation[];

  employment_history: ProviderEmploymentHistory[];
};

// ======================================================
// APPLICATION VACANCY SUMMARY
// ======================================================

export type ProviderApplicationVacancy = {
  vacancyId: string;

  title: string;

  titleKana?: string | null;

  companyName: string;

  employmentType: string;

  numberOfPeople: number;

  workLocation: string;

  remoteWork?: string | null;

  salaryMin?: number | null;

  salaryMax?: number | null;

  japaneseLevel?: string | null;

  status: string;
};

// ======================================================
// PROVIDER APPLICATION
// ======================================================

export type ProviderApplication = {
  application_id: string;

  vacancy_id: string;

  status: ProviderApplicationStatus;

  applied_at: string;

  created_at?: string;

  updated_at?: string;

  resume_available: boolean;

  applicant: ProviderApplicant;

  vacancy?: ProviderApplicationVacancy | null;
};

// ======================================================
// APPLICATION RESPONSES
// ======================================================

export type ProviderApplicationListResponse = {
  status: "success" | "error";

  count: number;

  data: ProviderApplication[];

  message?: string;
};

export type ProviderApplicationResponse = {
  status: "success" | "error";

  data: ProviderApplication;

  message?: string;
};

// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

export type ProviderApplicationDecisionStatus =
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "HIRED"
  | "REJECTED";

export type UpdateProviderApplicationStatusPayload = {
  status: ProviderApplicationDecisionStatus;
};

// ======================================================
// PLACEMENT REQUEST
// ======================================================

export type PlacementRequest = {
  _id?: string;

  recruitId?: string;

  registerId?: string;

  company_name?: string | null;

  job_title?: string | null;

  job_category?: string | null;

  employment_type?: string | null;

  number_of_positions?: number | null;

  work_location?: string | null;

  job_description?: string | null;

  requirements?: string | null;

  japanese_level_required?: string | null;

  visa_type_required?: string | null;

  salary_type?: string | null;

  salary_amount?: number | null;

  salary_min?: number | null;

  salary_max?: number | null;

  working_hours?: string | null;

  days_off?: string | null;

  start_date?: string | null;

  notes?: string | null;

  status?: string | null;

  createdAt?: string;

  updatedAt?: string;

  created_at?: string;

  updated_at?: string;

  [key: string]: unknown;
};

// ======================================================
// CREATE PLACEMENT REQUEST
// ======================================================

export type CreatePlacementRequestPayload = {
  job_title: string;

  job_category?: string;

  employment_type?: string;

  number_of_positions?: number;

  work_location?: string;

  job_description?: string;

  requirements?: string;

  japanese_level_required?: string;

  visa_type_required?: string;

  salary_type?: string;

  salary_amount?: number | null;

  salary_min?: number | null;

  salary_max?: number | null;

  working_hours?: string;

  days_off?: string;

  start_date?: string;

  notes?: string;

  [key: string]: string | number | boolean | null | undefined;
};

// ======================================================
// PLACEMENT REQUEST RESPONSES
// ======================================================

export type PlacementRequestListResponse = {
  status: "success" | "error";

  count: number;

  data: PlacementRequest[];

  message?: string;
};

export type PlacementRequestResponse = {
  status: "success" | "error";

  data: PlacementRequest;

  message?: string;
};

// ======================================================
// DASHBOARD TAB
// ======================================================

export type ProviderDashboardTab =
  | "vacancies"
  | "applications"
  | "placement-requests";

// ======================================================
// API ERROR
// ======================================================

export type ApiErrorResponse = {
  status?: string;

  success?: boolean;

  message?: string;

  error?: string;
};
