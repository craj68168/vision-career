import axiosInstance from "@/services/axiosInstance";

import type {
  CreateVacancyPayload,
  VacancyListResponse,
  VacancyResponse,
} from "./types";

// ======================================================
// GET ALL
// ======================================================

export const getProviderVacancies = async () => {
  const response = await axiosInstance.get<VacancyListResponse>(
    "/providers/vacancies",
  );

  return response.data;
};

// ======================================================
// GET ONE
// ======================================================

export const getProviderVacancyById = async (vacancyId: string) => {
  const response = await axiosInstance.get<VacancyResponse>(
    `/providers/vacancies/${vacancyId}`,
  );

  return response.data;
};

// ======================================================
// CREATE
// ======================================================

export const createProviderVacancy = async (payload: CreateVacancyPayload) => {
  const response = await axiosInstance.post<VacancyResponse>(
    "/providers/vacancies",
    payload,
  );

  return response.data;
};

// ======================================================
// UPDATE
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
// DELETE
// ======================================================

export const deleteProviderVacancy = async (vacancyId: string) => {
  const response = await axiosInstance.delete<VacancyResponse>(
    `/providers/vacancies/${vacancyId}`,
  );

  return response.data;
};

// ======================================================
// CLOSE
// ======================================================

export const closeProviderVacancy = async (vacancyId: string) => {
  const response = await axiosInstance.put<VacancyResponse>(
    `/providers/vacancies/close/${vacancyId}`,
  );

  return response.data;
};
