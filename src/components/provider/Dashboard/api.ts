import axiosInstance from "@/services/axiosInstance";

import type {
  CreatePlacementRequestPayload,
  CreateVacancyPayload,
  PlacementRequestListResponse,
  PlacementRequestResponse,
  ProviderApplicationListResponse,
  ProviderApplicationResponse,
  UpdateProviderApplicationStatusPayload,
  VacancyListResponse,
  VacancyResponse,
} from "./types";

// ======================================================
// VACANCIES
// ======================================================

// ======================================================
// GET PROVIDER VACANCIES
//
// GET /api/providers/vacancies
// ======================================================

export const getProviderVacancies = async () => {
  const response = await axiosInstance.get<VacancyListResponse>(
    "/providers/vacancies",
  );

  return response.data;
};

// ======================================================
// GET ONE PROVIDER VACANCY
//
// GET /api/providers/vacancies/:vacancyId
// ======================================================

export const getProviderVacancyById = async (vacancyId: string) => {
  const response = await axiosInstance.get<VacancyResponse>(
    `/providers/vacancies/${vacancyId}`,
  );

  return response.data;
};

// ======================================================
// CREATE VACANCY
//
// POST /api/providers/vacancies
// ======================================================

export const createProviderVacancy = async (payload: CreateVacancyPayload) => {
  const response = await axiosInstance.post<VacancyResponse>(
    "/providers/vacancies",
    payload,
  );

  return response.data;
};

// ======================================================
// UPDATE VACANCY
//
// PUT /api/providers/vacancies/:vacancyId
// ======================================================

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

// ======================================================
// DELETE VACANCY
//
// DELETE /api/providers/vacancies/:vacancyId
// ======================================================

export const deleteProviderVacancy = async (vacancyId: string) => {
  const response = await axiosInstance.delete<VacancyResponse>(
    `/providers/vacancies/${vacancyId}`,
  );

  return response.data;
};

// ======================================================
// CLOSE PUBLISHED VACANCY
//
// PUT /api/providers/vacancies/close/:vacancyId
// ======================================================

export const closeProviderVacancy = async (vacancyId: string) => {
  const response = await axiosInstance.put<VacancyResponse>(
    `/providers/vacancies/close/${vacancyId}`,
  );

  return response.data;
};

// ======================================================
// PROVIDER APPLICATIONS
// ======================================================

// ======================================================
// GET PROVIDER APPLICATIONS
//
// GET /api/providers/applications
//
// Backend automatically:
//
// - identifies provider from JWT
// - only returns applications belonging to provider
// - hides pending Admin applications
// - hides seeker private information
//
// ======================================================

export const getProviderApplications = async () => {
  const response = await axiosInstance.get<ProviderApplicationListResponse>(
    "/providers/applications",
  );

  return response.data;
};

// ======================================================
// GET ONE PROVIDER APPLICATION
//
// GET /api/providers/applications/:applicationId
// ======================================================

export const getProviderApplicationById = async (applicationId: string) => {
  const response = await axiosInstance.get<ProviderApplicationResponse>(
    `/providers/applications/${applicationId}`,
  );

  return response.data;
};

// ======================================================
// UPDATE APPLICATION STATUS
//
// PATCH /api/providers/applications/:applicationId/status
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
// GET APPLICATION RESUME
//
// GET /api/providers/applications/:applicationId/resume
//
// Returns PDF Blob.
//
// We will use this in the Applicant Details modal next.
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
// PLACEMENT REQUESTS
// ======================================================

// ======================================================
// GET PROVIDER PLACEMENT REQUESTS
//
// GET /api/providers/recruits
// ======================================================

export const getProviderPlacementRequests = async () => {
  const response = await axiosInstance.get<PlacementRequestListResponse>(
    "/providers/recruits",
  );

  return response.data;
};

// ======================================================
// CREATE PROVIDER PLACEMENT REQUEST
//
// POST /api/providers/recruits
// ======================================================

export const createProviderPlacementRequest = async (
  payload: CreatePlacementRequestPayload,
) => {
  const response = await axiosInstance.post<PlacementRequestResponse>(
    "/providers/recruits",
    payload,
  );

  return response.data;
};
