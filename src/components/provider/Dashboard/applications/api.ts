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

export const getProviderApplicationById = async (applicationId: string) => {
  const response = await axiosInstance.get<ProviderApplicationResponse>(
    `/providers/applications/${applicationId}`,
  );

  return response.data;
};

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

export const getProviderInterviewById = async (interviewId: string) => {
  const response = await axiosInstance.get<ProviderInterviewResponse>(
    `/providers/interviews/${interviewId}`,
  );

  return response.data;
};

export const scheduleProviderInterview = async (
  payload: ScheduleProviderInterviewPayload,
) => {
  const response = await axiosInstance.post<ProviderInterviewResponse>(
    "/providers/interviews",
    payload,
  );

  return response.data;
};

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
