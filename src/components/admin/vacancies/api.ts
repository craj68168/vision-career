import axiosInstance from "@/services/axiosInstance";

import type {
  AdminVacanciesResponse,
  AdminVacancyActionResponse,
  AdminVacancyDetailsResponse,
  RejectVacancyPayload,
} from "./types";

// ======================================================
// GET ALL
// ======================================================

export const getAdminVacancies = async (): Promise<AdminVacanciesResponse> => {
  const response =
    await axiosInstance.get<AdminVacanciesResponse>("/admin/vacancies");

  return response.data;
};

// ======================================================
// GET DETAILS
// ======================================================

export const getAdminVacancyById = async (
  vacancyId: string,
): Promise<AdminVacancyDetailsResponse> => {
  const response = await axiosInstance.get<AdminVacancyDetailsResponse>(
    `/admin/vacancies/${vacancyId}`,
  );

  return response.data;
};

// ======================================================
// APPROVE
// ======================================================

export const approveAdminVacancy = async (
  vacancyId: string,
): Promise<AdminVacancyActionResponse> => {
  const response = await axiosInstance.patch<AdminVacancyActionResponse>(
    `/admin/vacancies/${vacancyId}/approve`,
  );

  return response.data;
};

// ======================================================
// REJECT
// ======================================================

export const rejectAdminVacancy = async (
  vacancyId: string,
  payload: RejectVacancyPayload,
): Promise<AdminVacancyActionResponse> => {
  const response = await axiosInstance.patch<AdminVacancyActionResponse>(
    `/admin/vacancies/${vacancyId}/reject`,
    payload,
  );

  return response.data;
};

// ======================================================
// PUBLISH
// ======================================================

export const publishAdminVacancy = async (
  vacancyId: string,
): Promise<AdminVacancyActionResponse> => {
  const response = await axiosInstance.patch<AdminVacancyActionResponse>(
    `/admin/vacancies/${vacancyId}/publish`,
  );

  return response.data;
};

// ======================================================
// CLOSE
// ======================================================

export const closeAdminVacancy = async (
  vacancyId: string,
): Promise<AdminVacancyActionResponse> => {
  const response = await axiosInstance.patch<AdminVacancyActionResponse>(
    `/admin/vacancies/${vacancyId}/close`,
  );

  return response.data;
};
