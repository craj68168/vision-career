import axiosInstance from "@/services/axiosInstance";

import type {
  CreateProviderPayload,
  ProviderDetailsResponse,
  ProviderListResponse,
  ProviderMutationResponse,
  ProviderStatus,
  UpdateProviderPayload,
} from "./types";

// ======================================================
// GET ALL
// ======================================================

export const getAdminProviders = async (): Promise<ProviderListResponse> => {
  const response =
    await axiosInstance.get<ProviderListResponse>("/admin/providers");

  return response.data;
};

// ======================================================
// GET ONE
// ======================================================

export const getAdminProviderById = async (
  registerId: string,
): Promise<ProviderDetailsResponse> => {
  const response = await axiosInstance.get<ProviderDetailsResponse>(
    `/admin/providers/${registerId}`,
  );

  return response.data;
};

// ======================================================
// CREATE
// ======================================================

export const createAdminProvider = async (
  payload: CreateProviderPayload,
): Promise<ProviderMutationResponse> => {
  const response = await axiosInstance.post<ProviderMutationResponse>(
    "/admin/providers",
    payload,
  );

  return response.data;
};

// ======================================================
// UPDATE
// ======================================================

export const updateAdminProvider = async (
  registerId: string,
  payload: UpdateProviderPayload,
): Promise<ProviderMutationResponse> => {
  const response = await axiosInstance.patch<ProviderMutationResponse>(
    `/admin/providers/${registerId}`,
    payload,
  );

  return response.data;
};

// ======================================================
// STATUS
// ======================================================

export const updateAdminProviderStatus = async (
  registerId: string,
  status: ProviderStatus,
): Promise<ProviderMutationResponse> => {
  const response = await axiosInstance.patch<ProviderMutationResponse>(
    `/admin/providers/${registerId}/status`,
    {
      status,
    },
  );

  return response.data;
};

// ======================================================
// DELETE
// ======================================================

export const deleteAdminProvider = async (
  registerId: string,
): Promise<ProviderMutationResponse> => {
  const response = await axiosInstance.delete<ProviderMutationResponse>(
    `/admin/providers/${registerId}`,
  );

  return response.data;
};
