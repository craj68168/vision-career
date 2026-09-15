import axiosInstance from "@/services/axiosInstance";

import type { ProviderProfileFormData, ProviderProfileResponse } from "./types";

export const getProviderProfile =
  async (): Promise<ProviderProfileResponse> => {
    const response =
      await axiosInstance.get<ProviderProfileResponse>("/providers/profile");

    return response.data;
  };

export const updateProviderProfile = async (
  data: ProviderProfileFormData,
): Promise<ProviderProfileResponse> => {
  const response = await axiosInstance.patch<ProviderProfileResponse>(
    "/providers/profile",
    data,
  );

  return response.data;
};
