export type EducationRecord = {
  _id?: string;
  enrollment_date: string | null;
  graduation_date: string | null;
  school_type: string | null;
  school: string;
  major: string | null;
};

export type EmploymentRecord = {
  _id?: string;
  start_date: string | null;
  end_date: string | null;
  employment_type: string | null;
  company_name: string;
};

export type OtherDocument = {
  _id?: string;
  name: string;
  document_type: string;
  file_url: string;
};

export type MissingField = {
  field: string;
  label: string;
};

export type JobSeekerProfile = {
  seeker_id: string;

  name: string;

  email: string;

  profile_photo: string | null;

  phone: string | null;

  address: string | null;

  date_of_birth: string | null;

  gender: string | null;

  nationality: string | null;

  visa_type: string | null;

  visa_expiry_date: string | null;

  japanese_level: string | null;

  desired_job: string | null;

  desired_location: string | null;

  available_from: string | null;

  resume_file: string | null;

  generated_resume_file: string | null;

  other_documents: OtherDocument[];

  notes: string | null;

  approval_status: "pending" | "approved" | "rejected";

  account_status: "inactive" | "active" | "suspended";

  placement_status: string | null;

  created_at: string;

  updated_at: string;
};

export type ProfileFormData = {
  phone: string;
  address: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  visa_type: string;
  visa_expiry_date: string;
  japanese_level: string;
  desired_job: string;
  desired_location: string;
  available_from: string;
  notes: string;
};

export type ProfileResponse = {
  status: "success" | "error";
  message?: string;

  is_complete: boolean;
  completion_percentage: number;
  missing_fields: MissingField[];

  profile: JobSeekerProfile;

  education: EducationRecord[];
  employment_history: EmploymentRecord[];
};

export type ProfileValidationErrors = Partial<
  Record<keyof ProfileFormData, string>
>;

export type ApiErrorResponse = {
  status?: "success" | "error";
  message?: string;
};
