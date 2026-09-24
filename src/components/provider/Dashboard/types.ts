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
// CREATE / UPDATE VACANCY
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
// PROVIDER APPLICATION
// ======================================================

export type ProviderApplicationStatus =
  | "SENT_TO_PROVIDER"
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "HIRED"
  | "REJECTED";

export type ProviderEducation = {
  enrollment_date?: string | null;

  graduation_date?: string | null;

  school_type?: string | null;

  school?: string | null;

  major?: string | null;
};

export type ProviderEmploymentHistory = {
  start_date?: string | null;

  end_date?: string | null;

  employment_type?: string | null;

  company_name?: string | null;
};

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
// PROVIDER INTERVIEW
// ======================================================

export type ProviderInterviewMethod =
  | "ZOOM"
  | "GOOGLE_MEET"
  | "PHONE"
  | "FACE_TO_FACE"
  | "OTHER";

export type ProviderInterviewStatus =
  | "AWAITING_LINK"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export type ProviderInterviewCandidate = {
  name?: string | null;

  nationality?: string | null;

  visaType?: string | null;

  visaExpiryDate?: string | null;

  japaneseLevel?: string | null;

  skills: string[];

  desiredJob?: string | null;

  desiredLocation?: string | null;
};

export type ProviderInterviewVacancy = {
  vacancyId: string;

  title?: string | null;

  companyName?: string | null;

  employmentType?: string | null;

  workLocation?: string | null;

  japaneseLevel?: string | null;
};

export type ProviderInterview = {
  interviewId: string;

  applicationId: string;

  vacancyId: string;

  applicationStatus?: ProviderApplicationStatus | null;

  interviewDate: string;

  interviewTime: string;

  timezone: string;

  interviewMethod: ProviderInterviewMethod;

  meetingLink?: string | null;

  notes?: string | null;

  status: ProviderInterviewStatus;

  confirmedAt?: string | null;

  createdAt?: string;

  updatedAt?: string;

  candidate?: ProviderInterviewCandidate | null;

  vacancy?: ProviderInterviewVacancy | null;
};

export type ProviderInterviewListResponse = {
  status: "success" | "error";

  count: number;

  data: ProviderInterview[];

  message?: string;
};

export type ProviderInterviewResponse = {
  status: "success" | "error";

  data: ProviderInterview;

  message?: string;
};

export type ScheduleProviderInterviewPayload = {
  applicationId: string;

  interviewDate: string;

  interviewTime: string;

  timezone: string;

  interviewMethod: ProviderInterviewMethod;

  meetingLink?: string;

  notes?: string;
};

export type UpdateProviderInterviewPayload = {
  interviewDate?: string;

  interviewTime?: string;

  timezone?: string;

  interviewMethod?: ProviderInterviewMethod;

  meetingLink?: string;

  notes?: string;
};

// ======================================================
// PLACEMENT REQUEST
// ======================================================

export type PlacementRequestStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected";

export type PlacementRequest = {
  _id?: string;

  recruitId: string;

  company_id: string;

  job_title: string;

  job_category: string;

  employment_type: string;

  number_of_positions: number;

  work_location: string;

  job_description: string;

  requirements: string;

  japanese_level_required: string;

  visa_type_required: string;

  salary_type: string;

  salary_amount: number;

  working_hours: string;

  days_off: string;

  start_date: string;

  status: PlacementRequestStatus;

  submitted_at?: string | null;

  reviewed_at?: string | null;

  rejection_reason?: string | null;

  createdAt?: string;

  updatedAt?: string;
};

export type CreatePlacementRequestPayload = {
  job_title: string;

  job_category: string;

  employment_type: string;

  number_of_positions: number;

  work_location: string;

  job_description: string;

  requirements: string;

  japanese_level_required: string;

  visa_type_required: string;

  salary_type: string;

  salary_amount: number;

  working_hours: string;

  days_off: string;

  start_date: string;
};

export type PlacementRequestListResponse = {
  success: boolean;

  count: number;

  data: PlacementRequest[];

  message?: string;
};

export type PlacementRequestResponse = {
  success: boolean;

  message?: string;

  data: PlacementRequest;
};

// ======================================================
// PROVIDER PLACEMENT CANDIDATES
// ======================================================

export type PlacementCandidateStatus =
  | "MATCHED"
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "PLACED"
  | "REJECTED";

// ======================================================
// SAFE CANDIDATE SNAPSHOT
//
// IMPORTANT:
//
// Provider never receives:
//
// seekerId
// email
// phone
// address
// private documents
// ======================================================

export type ProviderPlacementCandidateSnapshot = {
  name: string;

  nationality?: string | null;

  current_location?: string | null;

  visa_type?: string | null;

  visa_expiry_date?: string | null;

  japanese_level?: string | null;

  skills: string[];

  desired_job?: string | null;

  desired_location?: string | null;

  education: ProviderEducation[];

  employment_history: ProviderEmploymentHistory[];
};

export type ProviderPlacementCandidate = {
  placementCandidateId: string;

  recruitId: string;

  status: PlacementCandidateStatus;

  candidate: ProviderPlacementCandidateSnapshot;

  matchedAt?: string | null;

  providerReviewedAt?: string | null;

  interviewAt?: string | null;

  selectedAt?: string | null;

  placedAt?: string | null;

  rejectedAt?: string | null;

  rejectionReason?: string | null;

  createdAt?: string;

  updatedAt?: string;
};

export type ProviderPlacementCandidateListResponse = {
  success: boolean;

  count: number;

  data: ProviderPlacementCandidate[];

  message?: string;
};

export type ProviderPlacementCandidateResponse = {
  success: boolean;

  data: ProviderPlacementCandidate;

  message?: string;
};

export type ProviderPlacementCandidateDecisionStatus =
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "PLACED"
  | "REJECTED";

export type UpdateProviderPlacementCandidateStatusPayload = {
  status: ProviderPlacementCandidateDecisionStatus;

  rejectionReason?: string;
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
