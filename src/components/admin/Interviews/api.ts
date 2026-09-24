import axiosInstance from "@/services/axiosInstance";

import type {
  AdminInterviewListResponse,
  AdminInterviewResponse,
  UpdateAdminInterviewPayload,
} from "./types";

// ======================================================
// GET ALL INTERVIEWS
// ======================================================

export const getAdminInterviews = async () => {
  const response =
    await axiosInstance.get<AdminInterviewListResponse>("/admin/interviews");

  return response.data;
};

// ======================================================
// GET ONE INTERVIEW
// ======================================================

export const getAdminInterviewById = async (interviewId: string) => {
  const response = await axiosInstance.get<AdminInterviewResponse>(
    `/admin/interviews/${interviewId}`,
  );

  return response.data;
};

// ======================================================
// UPDATE INTERVIEW
// ======================================================

export const updateAdminInterview = async (
  interviewId: string,
  payload: UpdateAdminInterviewPayload,
) => {
  const response = await axiosInstance.patch<AdminInterviewResponse>(
    `/admin/interviews/${interviewId}`,
    payload,
  );

  return response.data;
};
