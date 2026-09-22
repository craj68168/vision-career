// ======================================================
// VACANCY STATUS
// ======================================================

export type StaffVacancyStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "published"
  | "closed";

// ======================================================
// SCREENING
// ======================================================

export type StaffVacancyScreeningStatus =
  | "NOT_SCREENED"
  | "SCREENED"
  | "NEEDS_ATTENTION";

export type StaffVacancyScreening = {
  status: StaffVacancyScreeningStatus;

  note?: string | null;

  screenedByStaffId?: string | null;

  screenedAt?: string | null;
};

// ======================================================
// VACANCY
// ======================================================

export type StaffVacancy = {
  vacancyId: string;

  providerId: string;

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

  status: StaffVacancyStatus;

  isPublished: boolean;

  reviewedAt?: string | null;

  rejectionReason?: string | null;

  staffScreening: StaffVacancyScreening;

  createdAt?: string;

  updatedAt?: string;
};

// ======================================================
// SUMMARY
// ======================================================

export type StaffVacancySummary = {
  total: number;

  pendingReview: number;

  notScreened: number;

  screened: number;

  needsAttention: number;

  published: number;
};

// ======================================================
// RESPONSES
// ======================================================

export type StaffVacancyListResponse = {
  success: boolean;

  count: number;

  summary: StaffVacancySummary;

  data: StaffVacancy[];

  message?: string;
};

export type StaffVacancyResponse = {
  success: boolean;

  message?: string;

  data: StaffVacancy;
};

// ======================================================
// SCREEN PAYLOAD
// ======================================================

export type ScreenVacancyPayload = {
  screeningStatus: "SCREENED" | "NEEDS_ATTENTION";

  note: string;
};

// ======================================================
// ERROR
// ======================================================

export type ApiErrorResponse = {
  success?: boolean;

  message?: string;
};
