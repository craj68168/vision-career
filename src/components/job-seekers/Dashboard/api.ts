import axiosInstance from "@/services/axiosInstance";

import type {
  ApplicationListResponse,
  ApplyVacancyPayload,
  ApplyVacancyResponse,
  DashboardProfileResponse,
  MarkAllNotificationsReadResponse,
  SeekerInterviewListResponse,
  SeekerInterviewResponse,
  SeekerNotificationListResponse,
  SeekerNotificationResponse,
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

// ======================================================
// MY INTERVIEWS
// ======================================================

export const getMyInterviews =
  async (): Promise<SeekerInterviewListResponse> => {
    const response = await axiosInstance.get<SeekerInterviewListResponse>(
      "/seekers/interviews",
    );

    return response.data;
  };

// ======================================================
// ONE INTERVIEW
// ======================================================

export const getMyInterviewById = async (
  interviewId: string,
): Promise<SeekerInterviewResponse> => {
  const response = await axiosInstance.get<SeekerInterviewResponse>(
    `/seekers/interviews/${interviewId}`,
  );

  return response.data;
};

// ======================================================
// MY NOTIFICATIONS
// ======================================================

export const getMyNotifications = async (
  page = 1,
  limit = 20,
  unreadOnly = false,
): Promise<SeekerNotificationListResponse> => {
  const response = await axiosInstance.get<SeekerNotificationListResponse>(
    "/seekers/notifications",
    {
      params: {
        page,
        limit,
        unreadOnly,
      },
    },
  );

  return response.data;
};

// ======================================================
// MARK ONE NOTIFICATION READ
// ======================================================

export const markNotificationRead = async (
  notificationId: string,
): Promise<SeekerNotificationResponse> => {
  const response = await axiosInstance.patch<SeekerNotificationResponse>(
    `/seekers/notifications/${notificationId}/read`,
  );

  return response.data;
};

// ======================================================
// MARK ALL NOTIFICATIONS READ
// ======================================================

export const markAllNotificationsRead =
  async (): Promise<MarkAllNotificationsReadResponse> => {
    const response =
      await axiosInstance.patch<MarkAllNotificationsReadResponse>(
        "/seekers/notifications/read-all",
      );

    return response.data;
  };
