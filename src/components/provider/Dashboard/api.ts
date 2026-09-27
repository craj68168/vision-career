import axiosInstance from "@/services/axiosInstance";

// ======================================================
// VACANCY TYPES
// ======================================================

import type {
  CreateVacancyPayload,
  VacancyListResponse,
  VacancyResponse,
} from "./vacancies/types";

// ======================================================
// APPLICATION TYPES
// ======================================================

import type {
  ProviderApplicationListResponse,
  ProviderApplicationResponse,
  ProviderInterviewListResponse,
  ProviderInterviewResponse,
  ScheduleProviderInterviewPayload,
  UpdateProviderApplicationStatusPayload,
  UpdateProviderInterviewPayload,
} from "./applications/types";

// ======================================================
// INTERVIEW TYPES
// ======================================================

// ======================================================
// PLACEMENT REQUEST TYPES
// ======================================================

import type {
  CreatePlacementRequestPayload,
  PlacementRequestListResponse,
  PlacementRequestResponse,
} from "./placement-requests/types";

// ======================================================
// PLACEMENT CANDIDATE TYPES
// ======================================================

import type {
  ProviderPlacementCandidateListResponse,
  ProviderPlacementCandidateResponse,
  UpdateProviderPlacementCandidateStatusPayload,
} from "./placement-requests/types";

// ======================================================
// BILLING TYPES
// ======================================================

import type {
  ProviderPlacementBillingListResponse,
  ProviderPlacementBillingResponse,
} from "./billing/types";

export const getProviderVacancies = async (): Promise<VacancyListResponse> => {
  const response = await axiosInstance.get<VacancyListResponse>(
    "/providers/vacancies",
  );

  return response.data;
};

export const getProviderVacancyById = async (
  vacancyId: string,
): Promise<VacancyResponse> => {
  const response = await axiosInstance.get<VacancyResponse>(
    `/providers/vacancies/${vacancyId}`,
  );

  return response.data;
};

export const createProviderVacancy = async (
  payload: CreateVacancyPayload,
): Promise<VacancyResponse> => {
  const response = await axiosInstance.post<VacancyResponse>(
    "/providers/vacancies",
    payload,
  );

  return response.data;
};

export const updateProviderVacancy = async (
  vacancyId: string,
  payload: CreateVacancyPayload,
): Promise<VacancyResponse> => {
  const response = await axiosInstance.put<VacancyResponse>(
    `/providers/vacancies/${vacancyId}`,
    payload,
  );

  return response.data;
};

export const deleteProviderVacancy = async (
  vacancyId: string,
): Promise<VacancyResponse> => {
  const response = await axiosInstance.delete<VacancyResponse>(
    `/providers/vacancies/${vacancyId}`,
  );

  return response.data;
};

export const closeProviderVacancy = async (
  vacancyId: string,
): Promise<VacancyResponse> => {
  const response = await axiosInstance.put<VacancyResponse>(
    `/providers/vacancies/close/${vacancyId}`,
  );

  return response.data;
};

// ======================================================
// PROVIDER APPLICATIONS
// ======================================================

export const getProviderApplications =
  async (): Promise<ProviderApplicationListResponse> => {
    const response = await axiosInstance.get<ProviderApplicationListResponse>(
      "/providers/applications",
    );

    return response.data;
  };

export const getProviderApplicationById = async (
  applicationId: string,
): Promise<ProviderApplicationResponse> => {
  const response = await axiosInstance.get<ProviderApplicationResponse>(
    `/providers/applications/${applicationId}`,
  );

  return response.data;
};

export const updateProviderApplicationStatus = async (
  applicationId: string,
  payload: UpdateProviderApplicationStatusPayload,
): Promise<ProviderApplicationResponse> => {
  const response = await axiosInstance.patch<ProviderApplicationResponse>(
    `/providers/applications/${applicationId}/status`,
    payload,
  );

  return response.data;
};

export const getProviderApplicationResume = async (
  applicationId: string,
): Promise<Blob> => {
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

export const getProviderInterviews = async (
  status?: string,
): Promise<ProviderInterviewListResponse> => {
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

export const getProviderInterviewById = async (
  interviewId: string,
): Promise<ProviderInterviewResponse> => {
  const response = await axiosInstance.get<ProviderInterviewResponse>(
    `/providers/interviews/${interviewId}`,
  );

  return response.data;
};

export const scheduleProviderInterview = async (
  payload: ScheduleProviderInterviewPayload,
): Promise<ProviderInterviewResponse> => {
  const response = await axiosInstance.post<ProviderInterviewResponse>(
    "/providers/interviews",
    payload,
  );

  return response.data;
};

export const updateProviderInterview = async (
  interviewId: string,
  payload: UpdateProviderInterviewPayload,
): Promise<ProviderInterviewResponse> => {
  const response = await axiosInstance.patch<ProviderInterviewResponse>(
    `/providers/interviews/${interviewId}`,
    payload,
  );

  return response.data;
};

// ======================================================
// PLACEMENT REQUESTS
// ======================================================

export const getProviderPlacementRequests =
  async (): Promise<PlacementRequestListResponse> => {
    const response = await axiosInstance.get<PlacementRequestListResponse>(
      "/providers/recruits",
    );

    return response.data;
  };

export const getProviderPlacementRequestById = async (
  recruitId: string,
): Promise<PlacementRequestResponse> => {
  const response = await axiosInstance.get<PlacementRequestResponse>(
    `/providers/recruits/${recruitId}`,
  );

  return response.data;
};

export const createProviderPlacementRequest = async (
  payload: CreatePlacementRequestPayload,
): Promise<PlacementRequestResponse> => {
  const response = await axiosInstance.post<PlacementRequestResponse>(
    "/providers/recruits",
    payload,
  );

  return response.data;
};

export const updateProviderPlacementRequest = async (
  recruitId: string,
  payload: CreatePlacementRequestPayload,
): Promise<PlacementRequestResponse> => {
  const response = await axiosInstance.put<PlacementRequestResponse>(
    `/providers/recruits/${recruitId}`,
    payload,
  );

  return response.data;
};

export const submitProviderPlacementRequest = async (
  recruitId: string,
): Promise<PlacementRequestResponse> => {
  const response = await axiosInstance.patch<PlacementRequestResponse>(
    `/providers/recruits/${recruitId}/submit`,
  );

  return response.data;
};

export const deleteProviderPlacementRequest = async (
  recruitId: string,
): Promise<PlacementRequestResponse> => {
  const response = await axiosInstance.delete<PlacementRequestResponse>(
    `/providers/recruits/${recruitId}`,
  );

  return response.data;
};

// ======================================================
// PLACEMENT CANDIDATES
// ======================================================

export const getProviderPlacementCandidates = async (
  recruitId?: string,
): Promise<ProviderPlacementCandidateListResponse> => {
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
): Promise<ProviderPlacementCandidateResponse> => {
  const response =
    await axiosInstance.patch<ProviderPlacementCandidateResponse>(
      `/providers/placement-candidates/${placementCandidateId}/status`,
      payload,
    );

  return response.data;
};

// ======================================================
// PROVIDER PLACEMENT BILLINGS
// ======================================================

export const getProviderPlacementBillings = async (
  status?: string,
): Promise<ProviderPlacementBillingListResponse> => {
  const response =
    await axiosInstance.get<ProviderPlacementBillingListResponse>(
      "/providers/placement-billings",
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
// PROVIDER PLACEMENT BILLING DETAILS
// ======================================================

export const getProviderPlacementBillingById = async (
  billingId: string,
): Promise<ProviderPlacementBillingResponse> => {
  const response = await axiosInstance.get<ProviderPlacementBillingResponse>(
    `/providers/placement-billings/${billingId}`,
  );

  return response.data;
};
