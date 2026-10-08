import axiosInstance from "@/services/axiosInstance";

import type {
  ProviderApplicationListResponse,
  ProviderApplicationResponse,
  ProviderInterviewListResponse,
  ProviderInterviewResponse,
  ScheduleProviderInterviewPayload,
  UpdateProviderApplicationStatusPayload,
  UpdateProviderInterviewPayload,
} from "./types";

// ======================================================
// APPLICATIONS
// ======================================================

export const getProviderApplications = async () => {
  const response = await axiosInstance.get<ProviderApplicationListResponse>(
    "/providers/applications",
  );

  return response.data;
};

// ======================================================
// GET ONE APPLICATION
// ======================================================

export const getProviderApplicationById = async (applicationId: string) => {
  const response = await axiosInstance.get<ProviderApplicationResponse>(
    `/providers/applications/${applicationId}`,
  );

  return response.data;
};

// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

export const updateProviderApplicationStatus = async (
  applicationId: string,

  payload: UpdateProviderApplicationStatusPayload,
) => {
  const response = await axiosInstance.patch<ProviderApplicationResponse>(
    `/providers/applications/${applicationId}/status`,

    payload,
  );

  return response.data;
};

// ======================================================
// GET FROZEN APPLICATION RESUME
// ======================================================

export const getProviderApplicationResume = async (applicationId: string) => {
  const response = await axiosInstance.get<Blob>(
    `/providers/applications/${applicationId}/resume`,

    {
      responseType: "blob",
    },
  );

  return response.data;
};

// ======================================================
// GET PROTECTED CANDIDATE PHOTO
//
// IMPORTANT:
//
// Provider never receives:
//
// storage://profile-images/...
// Supabase key
// seeker ID
//
// Browser receives only an authenticated Blob.
// ======================================================

export const getProviderApplicationPhoto = async (applicationId: string) => {
  const response = await axiosInstance.get<Blob>(
    `/providers/applications/${applicationId}/photo`,

    {
      responseType: "blob",
    },
  );

  return response.data;
};

// ======================================================
// INTERVIEWS
// ======================================================

export const getProviderInterviews = async (status?: string) => {
  const response = await axiosInstance.get<ProviderInterviewListResponse>(
    "/providers/interviews",

    {
      params: status
        ? {
            status,
          }
        : undefined,
    },
  );

  return response.data;
};

// ======================================================
// GET INTERVIEW
// ======================================================

export const getProviderInterviewById = async (interviewId: string) => {
  const response = await axiosInstance.get<ProviderInterviewResponse>(
    `/providers/interviews/${interviewId}`,
  );

  return response.data;
};

// ======================================================
// SCHEDULE INTERVIEW
// ======================================================

export const scheduleProviderInterview = async (
  payload: ScheduleProviderInterviewPayload,
) => {
  const response = await axiosInstance.post<ProviderInterviewResponse>(
    "/providers/interviews",

    payload,
  );

  return response.data;
};

// ======================================================
// UPDATE INTERVIEW
// ======================================================

export const updateProviderInterview = async (
  interviewId: string,

  payload: UpdateProviderInterviewPayload,
) => {
  const response = await axiosInstance.patch<ProviderInterviewResponse>(
    `/providers/interviews/${interviewId}`,

    payload,
  );

  return response.data;
};
