import axiosInstance from "@/services/axiosInstance";

import type {
  ProviderLoginData,
  ProviderLoginResponse,
  ProviderRegisterData,
  ProviderRegisterResponse,
} from "./types";

export const registerProvider = async (
  data: ProviderRegisterData,
): Promise<ProviderRegisterResponse> => {
  const response = await axiosInstance.post<ProviderRegisterResponse>(
    "/auth/providers/register",
    data,
  );

  return response.data;
};

export const loginProvider = async (
  data: ProviderLoginData,
): Promise<ProviderLoginResponse> => {
  const response = await axiosInstance.post<ProviderLoginResponse>(
    "/auth/providers/login",
    data,
  );

  return response.data;
};
