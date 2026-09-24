// ======================================================
// MISSING PROFILE FIELD
// ======================================================

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
// INTERVIEW
// ======================================================

export type SeekerInterviewMethod =
  | "ZOOM"
  | "GOOGLE_MEET"
  | "PHONE"
  | "FACE_TO_FACE"
  | "OTHER";

export type SeekerInterviewStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type SeekerInterviewVacancy = {
  vacancyId: string;

  companyName?: string | null;

  companyNameKana?: string | null;

  title?: string | null;

  titleKana?: string | null;

  employmentType?: string | null;

  workLocation?: string | null;

  remoteWork?: string | null;
};

export type SeekerInterview = {
  interviewId: string;

  applicationId: string;

  vacancyId: string;

  applicationStatus?: ApplicationStatus | null;

  interviewDate: string;

  interviewTime: string;

  timezone: string;

  interviewMethod: SeekerInterviewMethod;

  meetingLink?: string | null;

  notes?: string | null;

  status: SeekerInterviewStatus;

  confirmedAt?: string | null;

  completedAt?: string | null;

  cancelledAt?: string | null;

  cancellationReason?: string | null;

  createdAt?: string;

  updatedAt?: string;

  vacancy?: SeekerInterviewVacancy | null;
};

export type SeekerInterviewSummary = {
  confirmed: number;

  completed: number;

  cancelled: number;
};

export type SeekerInterviewListResponse = {
  success: boolean;

  count: number;

  summary: SeekerInterviewSummary;

  data: SeekerInterview[];

  message?: string;
};

export type SeekerInterviewResponse = {
  success: boolean;

  data: SeekerInterview;

  message?: string;
};

// ======================================================
// NOTIFICATION
// ======================================================

export type SeekerNotificationType =
  | "INTERVIEW_SCHEDULED"
  | "INTERVIEW_CONFIRMED"
  | "INTERVIEW_UPDATED"
  | "INTERVIEW_CANCELLED";

export type SeekerNotificationInterview = {
  interviewId?: string | null;

  applicationId?: string | null;

  vacancyId?: string | null;

  companyName?: string | null;

  jobTitle?: string | null;

  interviewDate?: string | null;

  interviewTime?: string | null;

  timezone?: string | null;

  interviewMethod?: SeekerInterviewMethod | null;

  meetingLink?: string | null;

  notes?: string | null;
};

export type SeekerNotification = {
  notificationId: string;

  type: SeekerNotificationType;

  title: string;

  message: string;

  interview?: SeekerNotificationInterview | null;

  isRead: boolean;

  readAt?: string | null;

  createdAt: string;

  updatedAt?: string;
};

export type NotificationPagination = {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;
};

export type SeekerNotificationListResponse = {
  success: boolean;

  count: number;

  unreadCount: number;

  pagination: NotificationPagination;

  data: SeekerNotification[];

  message?: string;
};

export type SeekerNotificationResponse = {
  success: boolean;

  message?: string;

  data: SeekerNotification;
};

export type MarkAllNotificationsReadResponse = {
  success: boolean;

  message?: string;

  data: {
    modifiedCount: number;

    unreadCount: number;
  };
};

// ======================================================
// DASHBOARD
// ======================================================

export type DashboardTab = "available" | "applied" | "interviews";

// ======================================================
// API ERROR
// ======================================================

export type ApiErrorResponse = {
  success?: boolean;

  status?: string;

  message?: string;
};
