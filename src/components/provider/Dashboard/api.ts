import axiosInstance from "@/services/axiosInstance";

import type {
  CreatePlacementRequestPayload,
  CreateVacancyPayload,
  PlacementRequestListResponse,
  PlacementRequestResponse,
  ProviderApplicationListResponse,
  ProviderApplicationResponse,
  ProviderInterviewListResponse,
  ProviderInterviewResponse,
  ProviderPlacementCandidateListResponse,
  ProviderPlacementCandidateResponse,
  ScheduleProviderInterviewPayload,
  UpdateProviderApplicationStatusPayload,
  UpdateProviderInterviewPayload,
  UpdateProviderPlacementCandidateStatusPayload,
  VacancyListResponse,
  VacancyResponse,
} from "./types";

// ======================================================
// VACANCIES
// ======================================================

export const getProviderVacancies = async () => {
  const response = await axiosInstance.get<VacancyListResponse>(
    "/providers/vacancies",
  );

  return response.data;
};

export const getProviderVacancyById = async (vacancyId: string) => {
  const response = await axiosInstance.get<VacancyResponse>(
    `/providers/vacancies/${vacancyId}`,
  );

  return response.data;
};

export const createProviderVacancy = async (payload: CreateVacancyPayload) => {
  const response = await axiosInstance.post<VacancyResponse>(
    "/providers/vacancies",
    payload,
  );

  return response.data;
};

export const updateProviderVacancy = async (
  vacancyId: string,
  payload: CreateVacancyPayload,
) => {
  const response = await axiosInstance.put<VacancyResponse>(
    `/providers/vacancies/${vacancyId}`,
    payload,
  );

  return response.data;
};

export const deleteProviderVacancy = async (vacancyId: string) => {
  const response = await axiosInstance.delete<VacancyResponse>(
    `/providers/vacancies/${vacancyId}`,
  );

  return response.data;
};

export const closeProviderVacancy = async (vacancyId: string) => {
  const response = await axiosInstance.put<VacancyResponse>(
    `/providers/vacancies/close/${vacancyId}`,
  );

  return response.data;
};

// ======================================================
// PROVIDER APPLICATIONS
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
// PROVIDER INTERVIEWS
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

// ======================================================
// PLACEMENT REQUESTS
// ======================================================

export const getProviderPlacementRequests = async () => {
  const response = await axiosInstance.get<PlacementRequestListResponse>(
    "/providers/recruits",
  );

  return response.data;
};

export const getProviderPlacementRequestById = async (recruitId: string) => {
  const response = await axiosInstance.get<PlacementRequestResponse>(
    `/providers/recruits/${recruitId}`,
  );

  return response.data;
};

export const createProviderPlacementRequest = async (
  payload: CreatePlacementRequestPayload,
) => {
  const response = await axiosInstance.post<PlacementRequestResponse>(
    "/providers/recruits",
    payload,
  );

  return response.data;
};

export const updateProviderPlacementRequest = async (
  recruitId: string,
  payload: CreatePlacementRequestPayload,
) => {
  const response = await axiosInstance.put<PlacementRequestResponse>(
    `/providers/recruits/${recruitId}`,
    payload,
  );

  return response.data;
};

export const submitProviderPlacementRequest = async (recruitId: string) => {
  const response = await axiosInstance.patch<PlacementRequestResponse>(
    `/providers/recruits/${recruitId}/submit`,
  );

  return response.data;
};

export const deleteProviderPlacementRequest = async (recruitId: string) => {
  const response = await axiosInstance.delete<PlacementRequestResponse>(
    `/providers/recruits/${recruitId}`,
  );

  return response.data;
};

// ======================================================
// PLACEMENT CANDIDATES
// ======================================================

export const getProviderPlacementCandidates = async (recruitId?: string) => {
  const response =
    await axiosInstance.get<ProviderPlacementCandidateListResponse>(
      "/providers/placement-candidates",
      {
        params: recruitId
          ? {
              recruitId,
            }
          : undefined,
      },
    );

  return response.data;
};

export const updateProviderPlacementCandidateStatus = async (
  placementCandidateId: string,
  payload: UpdateProviderPlacementCandidateStatusPayload,
) => {
  const response =
    await axiosInstance.patch<ProviderPlacementCandidateResponse>(
      `/providers/placement-candidates/${placementCandidateId}/status`,
      payload,
    );

  return response.data;
};
