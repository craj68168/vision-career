import axiosInstance from "@/services/axiosInstance";

import type {
  RejectStaffVacancyPayload,
  ScreenVacancyPayload,
  StaffVacancyListResponse,
  StaffVacancyResponse,
} from "./types";

// ======================================================
// GET ALL
// ======================================================

export const getStaffVacancies = async () => {
  const response =
    await axiosInstance.get<StaffVacancyListResponse>("/staff/vacancies");

  return response.data;
};

// ======================================================
// GET ONE
// ======================================================

export const getStaffVacancyById = async (vacancyId: string) => {
  const response = await axiosInstance.get<StaffVacancyResponse>(
    `/staff/vacancies/${vacancyId}`,
  );

  return response.data;
};

// ======================================================
// SCREEN
// ======================================================

export const screenStaffVacancy = async (
  vacancyId: string,
  payload: ScreenVacancyPayload,
) => {
  const response = await axiosInstance.patch<StaffVacancyResponse>(
    `/staff/vacancies/${vacancyId}/screen`,
    payload,
  );

  return response.data;
};

// ======================================================
// APPROVE
// ======================================================

export const approveStaffVacancy = async (vacancyId: string) => {
  const response = await axiosInstance.patch<StaffVacancyResponse>(
    `/staff/vacancies/${vacancyId}/approve`,
  );

  return response.data;
};

// ======================================================
// REJECT
// ======================================================

export const rejectStaffVacancy = async (
  vacancyId: string,
  payload: RejectStaffVacancyPayload,
) => {
  const response = await axiosInstance.patch<StaffVacancyResponse>(
    `/staff/vacancies/${vacancyId}/reject`,
    payload,
  );

  return response.data;
};
