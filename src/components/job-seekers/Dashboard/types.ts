export type MissingField = {
  field: string;
  label: string;
};

export type DashboardProfileResponse = {
  status: "success" | "error";
  message?: string;

  is_complete: boolean;
  completion_percentage: number;
  missing_fields: MissingField[];
};

export type Vacancy = {
  vacancy_id: string;

  title: string;
  title_kana?: string;

  employment_type: string;
  number_of_people?: number;

  job_description: string;
  responsibilities?: string;

  required_skills?: string;
  preferred_skills?: string;

  required_education?: string;
  required_experience?: string;

  japanese_level?: string;

  work_location?: string;
  work_location_detail?: string;

  remote_work?: string;

  salary_min?: number;
  salary_max?: number;
  salary_note?: string;

  work_hours?: string;
  break_time?: string;
  overtime?: string;

  holidays?: string;

  benefits?: string[];
  insurance?: string[];

  trial_period?: string;

  application_deadline?: string;
  start_date?: string;

  selection_process?: string;

  created_at?: string;
};

export type ApplicationStatus =
  | "PENDING_ADMIN_APPROVAL"
  | "ADMIN_APPROVED"
  | "ADMIN_REJECTED"
  | "SENT_TO_PROVIDER"
  | "PROVIDER_REVIEWING"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "SELECTED"
  | "REJECTED"
  | "HIRED";

export type Application = {
  application_id: string;
  vacancy_id: string;

  status: ApplicationStatus;

  cover_letter?: string | null;

  applied_at: string;

  vacancy?: Vacancy;
};

export type DashboardTab = "available" | "applied";

export type ApiErrorResponse = {
  success?: boolean;
  status?: string;
  message?: string;
};
