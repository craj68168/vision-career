import axiosInstance from "@/services/axiosInstance";

import type {
  EducationRecord,
  EmploymentRecord,
  ProfileFormData,
  ProfileResponse,
} from "./types";

export const getJobSeekerProfile = async (): Promise<ProfileResponse> => {
  const response = await axiosInstance.get<ProfileResponse>("/seekers/profile");

  return response.data;
};

type UpdateProfileParams = {
  formData: ProfileFormData;
  education: EducationRecord[];
  employmentHistory: EmploymentRecord[];
};

export const updateJobSeekerProfile = async ({
  formData,
  education,
  employmentHistory,
}: UpdateProfileParams): Promise<ProfileResponse> => {
  const payload = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    payload.append(key, value);
  });

  payload.append("education", JSON.stringify(education));

  payload.append("employment_history", JSON.stringify(employmentHistory));

  const response = await axiosInstance.patch<ProfileResponse>(
    "/seekers/profile",
    payload,
  );

  return response.data;
};

export const uploadJobSeekerResume = async (
  file: File,
): Promise<ProfileResponse> => {
  const payload = new FormData();

  payload.append("resume", file);

  const response = await axiosInstance.patch<ProfileResponse>(
    "/seekers/profile",
    payload,
  );

  return response.data;
};

export const uploadJobSeekerProfilePhoto = async (
  file: File,
): Promise<ProfileResponse> => {
  const payload = new FormData();

  payload.append("profile_photo", file);

  const response = await axiosInstance.patch<ProfileResponse>(
    "/seekers/profile",
    payload,
  );

  return response.data;
};

type UploadDocumentParams = {
  file: File;
  name: string;
  documentType: string;
};

export const uploadJobSeekerDocument = async ({
  file,
  name,
  documentType,
}: UploadDocumentParams): Promise<ProfileResponse> => {
  const payload = new FormData();

  payload.append("other_documents", file);

  payload.append(
    "other_documents_meta",
    JSON.stringify([
      {
        name,
        document_type: documentType || "other",
      },
    ]),
  );

  const response = await axiosInstance.patch<ProfileResponse>(
    "/seekers/profile",
    payload,
  );

  return response.data;
};

export const removeJobSeekerDocument = async (
  documentId: string,
): Promise<ProfileResponse> => {
  const payload = new FormData();

  payload.append("remove_document_ids", JSON.stringify([documentId]));

  const response = await axiosInstance.patch<ProfileResponse>(
    "/seekers/profile",
    payload,
  );

  return response.data;
};
