import axiosInstance from "@/services/axiosInstance";

import type {
  ProviderPlacementBillingListResponse,
  ProviderPlacementBillingResponse,
} from "./types";

export const getProviderPlacementBillings = async (
  status?: string,
): Promise<ProviderPlacementBillingListResponse> => {
  const response =
    await axiosInstance.get<ProviderPlacementBillingListResponse>(
      "/providers/placement-billings",
      {
        params: status
          ? {
              status,
            }
          : undefined,
      },
    );

  return response.data;
};

export const getProviderPlacementBillingById = async (
  billingId: string,
): Promise<ProviderPlacementBillingResponse> => {
  const response = await axiosInstance.get<ProviderPlacementBillingResponse>(
    `/providers/placement-billings/${billingId}`,
  );

  return response.data;
};
