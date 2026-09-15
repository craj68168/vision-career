// ======================================================
// DASHBOARD
// ======================================================

export type ProviderDashboardTab =
  | "vacancies"
  | "applications"
  | "placement-requests";

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

  contactPerson?: string | null;
  contactPersonKana?: string | null;
  contactEmail?: string | null;

  status: VacancyStatus;

  isPublished?: boolean;

  reviewedAt?: string | null;

  rejectionReason?: string | null;

  createdAt?: string;
  updatedAt?: string;
};

// ======================================================
// CREATE VACANCY
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
// PROVIDER APPLICATION
//
// Provider application API is not built yet.
// We keep this type because the Dashboard UI already
// has the Applications tab.
// ======================================================

export type ProviderApplication = {
  _id?: string;

  application_id: string;

  vacancy_id: string;

  status: string;

  cover_letter?: string | null;

  applied_at?: string;

  vacancy?: Vacancy;

  profile_snapshot?: {
    nationality?: string | null;

    visa_type?: string | null;

    visa_expiry_date?: string | null;

    japanese_level?: string | null;

    skills?: string[];

    desired_job?: string | null;

    desired_location?: string | null;

    generated_resume_file?: string | null;
  };
};

// ======================================================
// PLACEMENT / RECRUIT REQUEST
// ======================================================

export type PlacementRequest = {
  _id?: string;

  recruitId?: string;

  company_id?: string;

  job_title?: string;

  job_category?: string;

  employment_type?: string;

  number_of_positions?: number;

  work_location?: string;

  job_description?: string;

  requirements?: string;

  japanese_level_required?: string;

  visa_type_required?: string;

  salary_type?: string;

  salary_amount?: number;

  working_hours?: string;

  days_off?: string;

  start_date?: string;

  status: string;

  rejection_reason?: string | null;

  admin_note?: string | null;

  createdAt?: string;

  updatedAt?: string;
};

// ======================================================
// CREATE PLACEMENT REQUEST
// ======================================================

export type CreatePlacementRequestPayload = {
  job_title: string;

  job_category?: string;

  employment_type?: string;

  number_of_positions: number;

  work_location?: string;

  job_description?: string;

  requirements?: string;

  japanese_level_required?: string;

  visa_type_required?: string;

  salary_type?: string;

  salary_amount?: number;

  working_hours?: string;

  days_off?: string;

  start_date?: string;
};

// ======================================================
// API RESPONSES
// ======================================================

export type ListResponse<T> = {
  status?: "success" | "error";

  success?: boolean;

  message?: string;

  count?: number;

  data: T[];
};

export type ItemResponse<T> = {
  status?: "success" | "error";

  success?: boolean;

  message?: string;

  data: T;
};

export type ApiErrorResponse = {
  status?: string;

  success?: boolean;

  message?: string;
};

export type DeleteVacancyResponse = {
  status: "success" | "error";
  message: string;
  vacancyId?: string;
};
