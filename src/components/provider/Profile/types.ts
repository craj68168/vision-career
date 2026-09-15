export type MissingField = {
  field: string;
  label: string;
};

export type ProviderProfile = {
  _id?: string;

  registerId?: string;

  name: string;
  companyName: string | null;
  email: string;

  phone: string | null;
  address: string | null;
  website: string | null;
  industry: string | null;

  contact_person: string | null;
  contact_person_phone: string | null;
  contact_person_email: string | null;

  hiring_needs: string | null;
  notes: string | null;

  status?: string;

  createdAt?: string;
  updatedAt?: string;
};

export type ProviderProfileFormData = {
  companyName: string;
  phone: string;
  address: string;
  website: string;
  industry: string;

  contact_person: string;
  contact_person_phone: string;
  contact_person_email: string;

  hiring_needs: string;
  notes: string;
};

export type ProviderProfileResponse = {
  status: "success" | "error";

  message?: string;

  is_complete: boolean;

  completion_percentage: number;

  missing_fields: MissingField[];

  profile: ProviderProfile;
};

export type ProviderProfileErrors = Partial<
  Record<keyof ProviderProfileFormData, string>
>;

export type ApiErrorResponse = {
  status?: string;
  message?: string;
};
