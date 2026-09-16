import axiosInstance from "@/services/axiosInstance";

import type {
  ApplicationListResponse,
  ApplyVacancyPayload,
  ApplyVacancyResponse,
  DashboardProfileResponse,
  VacancyItemResponse,
  VacancyListResponse,
} from "./types";

// ======================================================
// PROFILE STATUS
// ======================================================

export const getDashboardProfileStatus =
  async (): Promise<DashboardProfileResponse> => {
    const response =
      await axiosInstance.get<DashboardProfileResponse>("/seekers/profile");

    return response.data;
  };

// ======================================================
// AVAILABLE VACANCIES
// ======================================================

export const getAvailableVacancies = async (): Promise<VacancyListResponse> => {
  const response =
    await axiosInstance.get<VacancyListResponse>("/seekers/vacancies");

  return response.data;
};

// ======================================================
// ONE VACANCY
// ======================================================

export const getAvailableVacancyById = async (
  vacancyId: string,
): Promise<VacancyItemResponse> => {
  const response = await axiosInstance.get<VacancyItemResponse>(
    `/seekers/vacancies/${vacancyId}`,
  );

  return response.data;
};

// ======================================================
// MY APPLICATIONS
// ======================================================

export const getMyApplications = async (): Promise<ApplicationListResponse> => {
  const response = await axiosInstance.get<ApplicationListResponse>(
    "/seekers/applications",
  );

  return response.data;
};

// ======================================================
// APPLY
// ======================================================

export const applyToVacancy = async (
  payload: ApplyVacancyPayload,
): Promise<ApplyVacancyResponse> => {
  const response = await axiosInstance.post<ApplyVacancyResponse>(
    "/seekers/applications",

    payload,
  );

  return response.data;
};
