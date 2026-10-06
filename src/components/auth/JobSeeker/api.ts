import axiosInstance from "@/services/axiosInstance";

import type {
  JobSeekerAuthResponse,
  JobSeekerLoginData,
  JobSeekerRegisterData,
} from "./types";

// ======================================================
// REGISTER JOB SEEKER
// ======================================================

export const registerJobSeeker = async (
  payload: JobSeekerRegisterData,
): Promise<JobSeekerAuthResponse> => {
  const response = await axiosInstance.post<JobSeekerAuthResponse>(
    "/seekers/auth/register",
    payload,
  );

  return response.data;
};

// ======================================================
// LOGIN JOB SEEKER
// ======================================================

export const loginJobSeeker = async (
  payload: JobSeekerLoginData,
): Promise<JobSeekerAuthResponse> => {
  const response = await axiosInstance.post<JobSeekerAuthResponse>(
    "/seekers/auth/login",
    payload,
  );

  return response.data;
};
