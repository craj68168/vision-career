// ======================================================
// VACANCY STATUS
// ======================================================

export type VacancyStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "published"
  | "closed";

// ======================================================
// ACTOR TYPE
// ======================================================

export type VacancyActorType = "admin" | "staff";

// ======================================================
// STAFF SCREENING STATUS
// ======================================================

export type VacancyStaffScreeningStatus =
  | "NOT_SCREENED"
  | "SCREENED"
  | "NEEDS_ATTENTION";

// ======================================================
// STAFF SCREENING
// ======================================================

export type AdminVacancyStaffScreening = {
  status: VacancyStaffScreeningStatus;

  note?: string | null;

  screenedByStaffId?: string | null;

  screenedByStaffName?: string | null;

  screenedAt?: string | null;
};

// ======================================================
// REVIEW AUDIT
// ======================================================

export type AdminVacancyReview = {
  reviewedAt?: string | null;

  reviewedByType?: VacancyActorType | null;

  reviewedById?: string | null;

  reviewedByName?: string | null;

  rejectionReason?: string | null;
};

// ======================================================
// PUBLICATION AUDIT
// ======================================================

export type AdminVacancyPublication = {
  publishedAt?: string | null;

  publishedByAdminId?: string | null;

  publishedByAdminName?: string | null;
};

// ======================================================
// CLOSING AUDIT
// ======================================================

export type AdminVacancyClosing = {
  closedAt?: string | null;

  closedByAdminId?: string | null;

  closedByAdminName?: string | null;
};

// ======================================================
// WORKFLOW HISTORY
// ======================================================

export type AdminVacancyWorkflowAction =
  | "SCREENED"
  | "NEEDS_ATTENTION"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
  | "CLOSED"
  | string;

export type AdminVacancyWorkflowHistoryItem = {
  id?: string | null;

  action?: AdminVacancyWorkflowAction | null;

  fromStatus?: string | null;

  toStatus?: string | null;

  actorType?: VacancyActorType | string | null;

  actorId?: string | null;

  actorName?: string | null;

  reason?: string | null;

  note?: string | null;

  createdAt?: string | null;
};

// ======================================================
// PROVIDER
// ======================================================

export type AdminVacancyProvider = {
  registerId: string;

  name?: string | null;

  companyName?: string | null;

  email?: string | null;
};

// ======================================================
// VACANCY
// ======================================================

export type AdminVacancy = {
  vacancyId: string;

  registerId: string;

  companyName: string;

  companyNameKana?: string | null;

  title: string;

  titleKana?: string | null;

  employmentType: string;

  numberOfPeople: number;

  japaneseLevel?: string | null;

  workLocation: string;

  remoteWork?: string | null;

  salaryMin?: number | null;

  salaryMax?: number | null;

  applicationDeadline?: string | null;

  status: VacancyStatus;

  isPublished: boolean;

  // ====================================================
  // LEGACY / FLAT REVIEW FIELDS
  // ====================================================

  reviewedAt?: string | null;

  reviewedByType?: VacancyActorType | null;

  reviewedById?: string | null;

  reviewedByName?: string | null;

  rejectionReason?: string | null;

  // ====================================================
  // LEGACY / FLAT PUBLICATION FIELDS
  // ====================================================

  publishedAt?: string | null;

  publishedByAdminId?: string | null;

  publishedByAdminName?: string | null;

  // ====================================================
  // LEGACY / FLAT CLOSING FIELDS
  // ====================================================

  closedAt?: string | null;

  closedByAdminId?: string | null;

  closedByAdminName?: string | null;

  // ====================================================
  // NORMALIZED AUDIT OBJECTS
  // ====================================================

  review?: AdminVacancyReview | null;

  publication?: AdminVacancyPublication | null;

  closing?: AdminVacancyClosing | null;

  workflowHistory?: AdminVacancyWorkflowHistoryItem[];

  createdAt: string;

  updatedAt: string;

  staffScreening: AdminVacancyStaffScreening;

  provider: AdminVacancyProvider;
};

// ======================================================
// DETAILS
// ======================================================

export type AdminVacancyDetails = AdminVacancy & {
  jobDescription: string;

  responsibilities?: string | null;

  requiredSkills?: string | null;

  preferredSkills?: string | null;

  requiredEducation?: string | null;

  requiredExperience?: string | null;

  workLocationDetail?: string | null;

  salaryNote?: string | null;

  workHours?: string | null;

  breakTime?: string | null;

  overtime?: string | null;

  holidays?: string | null;

  benefits: string[];

  insurance: string[];

  trialPeriod?: string | null;

  startDate?: string | null;

  selectionProcess?: string | null;

  contactPerson: string;

  contactPersonKana?: string | null;

  contactEmail: string;
};

// ======================================================
// SUMMARY
// ======================================================

export type AdminVacancySummary = {
  total: number;

  draft: number;

  pendingReview: number;

  approved: number;

  rejected: number;

  published: number;

  closed: number;
};

// ======================================================
// LIST RESPONSE
// ======================================================

export type AdminVacanciesResponse = {
  success: boolean;

  count: number;

  summary: AdminVacancySummary;

  data: AdminVacancy[];

  message?: string;
};

// ======================================================
// DETAILS RESPONSE
// ======================================================

export type AdminVacancyDetailsResponse = {
  success: boolean;

  data: AdminVacancyDetails;

  message?: string;
};

// ======================================================
// ACTION RESPONSE
// ======================================================

export type AdminVacancyActionResponse = {
  success: boolean;

  message: string;

  data?: {
    vacancyId: string;

    status: VacancyStatus;

    isPublished: boolean;

    reviewedAt?: string | null;

    reviewedByType?: VacancyActorType | null;

    reviewedById?: string | null;

    reviewedByName?: string | null;

    rejectionReason?: string | null;

    publishedAt?: string | null;

    publishedByAdminId?: string | null;

    publishedByAdminName?: string | null;

    closedAt?: string | null;

    closedByAdminId?: string | null;

    closedByAdminName?: string | null;
  };
};

// ======================================================
// REJECT PAYLOAD
// ======================================================

export type RejectVacancyPayload = {
  reason: string;
};

// ======================================================
// API ERROR
// ======================================================

export type AdminVacancyApiError = {
  success?: boolean;

  message?: string;
};
