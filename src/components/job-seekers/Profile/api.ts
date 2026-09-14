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

  // IMPORTANT:
  // Backend expects "resume", not "resume_file"
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
