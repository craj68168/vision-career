export type AdminDashboardJobSeekersSummary = {
  total: number;
};

export type AdminDashboardProvidersSummary = {
  total: number;
};

export type AdminDashboardVacanciesSummary = {
  total: number;

  published: number;

  pendingReview: number;
};

export type AdminDashboardApplicationsSummary = {
  total: number;

  pendingAdminApproval: number;

  sentToProvider: number;

  underReview: number;

  interview: number;

  selected: number;

  hired: number;
};

export type AdminDashboardPlacementRequestsSummary = {
  total: number;
};

export type AdminDashboardSummary = {
  jobSeekers: AdminDashboardJobSeekersSummary;

  providers: AdminDashboardProvidersSummary;

  vacancies: AdminDashboardVacanciesSummary;

  applications: AdminDashboardApplicationsSummary;

  placementRequests: AdminDashboardPlacementRequestsSummary;
};

export type AdminDashboardPendingApplication = {
  applicationId: string;

  seekerId: string;

  vacancyId: string;

  providerId: string;

  candidateName: string;

  vacancyTitle: string;

  companyName: string;

  employmentType?: string | null;

  workLocation?: string | null;

  status: "PENDING_ADMIN_APPROVAL";

  appliedAt: string;
};

export type AdminDashboardVacancyStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "published"
  | "closed";

export type AdminDashboardRecentVacancy = {
  vacancyId: string;

  companyName: string;

  title: string;

  employmentType: string;

  numberOfPeople: number;

  workLocation: string;

  status: AdminDashboardVacancyStatus;

  isPublished: boolean;

  createdAt: string;
};

export type AdminDashboardRecent = {
  pendingApplications: AdminDashboardPendingApplication[];

  vacancies: AdminDashboardRecentVacancy[];
};

export type AdminDashboardData = {
  summary: AdminDashboardSummary;

  recent: AdminDashboardRecent;
};

export type AdminDashboardResponse = {
  success: boolean;

  data: AdminDashboardData;

  message?: string;
};

export type AdminDashboardApiError = {
  success?: boolean;

  message?: string;
};

export type AdminDashboardProps = {
  setActiveDashboardTab?: React.Dispatch<React.SetStateAction<string>>;
};
