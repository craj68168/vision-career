export type ApplicationStatus =
  | "PENDING_ADMIN_APPROVAL"
  | "ADMIN_REJECTED"
  | "SENT_TO_PROVIDER"
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "SELECTED"
  | "HIRED"
  | "REJECTED";

export type AdminApplicationCandidate = {
  name: string;

  email?: string | null;

  phone?: string | null;

  address?: string | null;

  currentLocation?: string | null;

  dateOfBirth?: string | null;

  gender?: string | null;

  nationality?: string | null;

  visaType?: string | null;

  visaExpiryDate?: string | null;

  japaneseLevel?: string | null;

  skills?: string[];

  desiredJob?: string | null;

  desiredLocation?: string | null;

  education?: EducationSnapshot[];

  employmentHistory?: EmploymentSnapshot[];
};

export type EducationSnapshot = {
  enrollment_date?: string | null;

  graduation_date?: string | null;

  school_type?: string | null;

  school?: string | null;

  major?: string | null;
};

export type EmploymentSnapshot = {
  start_date?: string | null;

  end_date?: string | null;

  employment_type?: string | null;

  company_name?: string | null;
};

export type AdminApplicationVacancy = {
  vacancyId?: string;

  title: string;

  companyName: string;

  employmentType?: string | null;

  numberOfPeople?: number;

  jobDescription?: string | null;

  responsibilities?: string | null;

  requiredSkills?: string | null;

  requiredEducation?: string | null;

  requiredExperience?: string | null;

  japaneseLevel?: string | null;

  workLocation?: string | null;

  remoteWork?: string | null;

  salaryMin?: number | null;

  salaryMax?: number | null;

  salaryNote?: string | null;
};

export type AdminApplicationProvider = {
  registerId?: string;

  name?: string | null;

  companyName?: string | null;

  email?: string | null;
};

export type AdminApplicationReview = {
  reviewedAt?: string | null;

  reviewedBy?: string | null;

  rejectionReason?: string | null;
};

export type AdminApplication = {
  applicationId: string;

  seekerId: string;

  vacancyId: string;

  providerId: string;

  status: ApplicationStatus;

  appliedAt: string;

  coverLetter?: string | null;

  candidate: AdminApplicationCandidate;

  vacancy: AdminApplicationVacancy;

  provider: AdminApplicationProvider;

  adminReview: AdminApplicationReview;
};

export type AdminApplicationDetails = AdminApplication & {
  resumeAvailable: boolean;
};

export type AdminApplicationSummary = {
  total: number;

  pendingAdminApproval: number;

  sentToProvider: number;

  adminRejected: number;

  underReview: number;

  interview: number;

  selected: number;

  hired: number;

  rejected: number;
};

export type AdminApplicationsResponse = {
  success: boolean;

  count: number;

  summary: AdminApplicationSummary;

  data: AdminApplication[];

  message?: string;
};

export type AdminApplicationDetailsResponse = {
  success: boolean;

  data: AdminApplicationDetails;

  message?: string;
};

export type AdminApplicationActionResponse = {
  success: boolean;

  message: string;

  data?: {
    applicationId: string;

    status: ApplicationStatus;

    reviewedAt?: string | null;

    reviewedBy?: string | null;

    rejectionReason?: string | null;
  };
};

export type RejectApplicationPayload = {
  reason: string;
};

export type ApiErrorResponse = {
  success?: boolean;

  message?: string;
};
