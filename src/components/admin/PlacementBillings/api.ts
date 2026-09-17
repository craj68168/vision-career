import axiosInstance from "@/services/axiosInstance";

import type {
  PlacementBillingListResponse,
  PlacementBillingResponse,
  RefundPlacementBillingPayload,
  UpdatePlacementBillingPayload,
} from "./types";

export const getPlacementBillings = async () => {
  const response = await axiosInstance.get<PlacementBillingListResponse>(
    "/admin/placement-billings",
  );

  return response.data;
};

export const updatePlacementBilling = async (
  billingId: string,
  payload: UpdatePlacementBillingPayload,
) => {
  const response = await axiosInstance.patch<PlacementBillingResponse>(
    `/admin/placement-billings/${billingId}`,
    payload,
  );

  return response.data;
};

export const issuePlacementBilling = async (billingId: string) => {
  const response = await axiosInstance.patch<PlacementBillingResponse>(
    `/admin/placement-billings/${billingId}/issue`,
  );

  return response.data;
};

export const markPlacementBillingPaid = async (billingId: string) => {
  const response = await axiosInstance.patch<PlacementBillingResponse>(
    `/admin/placement-billings/${billingId}/paid`,
  );

  return response.data;
};

export const cancelPlacementBilling = async (
  billingId: string,
  reason: string,
) => {
  const response = await axiosInstance.patch<PlacementBillingResponse>(
    `/admin/placement-billings/${billingId}/cancel`,
    {
      reason,
    },
  );

  return response.data;
};

export const refundPlacementBilling = async (
  billingId: string,
  payload: RefundPlacementBillingPayload,
) => {
  const response = await axiosInstance.patch<PlacementBillingResponse>(
    `/admin/placement-billings/${billingId}/refund`,
    payload,
  );

  return response.data;
};
