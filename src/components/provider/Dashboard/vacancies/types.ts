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
// PAYLOAD
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
// RESPONSES
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
// API ERROR
// ======================================================

export type VacancyApiError = {
  status?: string;

  message?: string;

  error?: string;
};
