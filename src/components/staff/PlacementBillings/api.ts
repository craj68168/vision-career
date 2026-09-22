import axiosInstance from "@/services/axiosInstance";

import type {
  BillingStaffUserResponse,
  PlacementBillingListResponse,
  PlacementBillingResponse,
  UpdatePlacementBillingPayload,
} from "./types";

// ======================================================
// CURRENT STAFF
// ======================================================

export const getBillingCurrentStaff =
  async (): Promise<BillingStaffUserResponse> => {
    const response =
      await axiosInstance.get<BillingStaffUserResponse>("/staff/auth/me");

    return response.data;
  };

// ======================================================
// LIST
// ======================================================

export const getStaffPlacementBillings =
  async (): Promise<PlacementBillingListResponse> => {
    const response = await axiosInstance.get<PlacementBillingListResponse>(
      "/staff/placement-billings",
    );

    return response.data;
  };

// ======================================================
// DETAILS
// ======================================================

export const getStaffPlacementBilling = async (
  billingId: string,
): Promise<PlacementBillingResponse> => {
  const response = await axiosInstance.get<PlacementBillingResponse>(
    `/staff/placement-billings/${billingId}`,
  );

  return response.data;
};

// ======================================================
// UPDATE
// ======================================================

export const updateStaffPlacementBilling = async (
  billingId: string,

  payload: UpdatePlacementBillingPayload,
): Promise<PlacementBillingResponse> => {
  const response = await axiosInstance.patch<PlacementBillingResponse>(
    `/staff/placement-billings/${billingId}`,

    payload,
  );

  return response.data;
};

// ======================================================
// ISSUE
// ======================================================

export const issueStaffPlacementBilling = async (
  billingId: string,
): Promise<PlacementBillingResponse> => {
  const response = await axiosInstance.patch<PlacementBillingResponse>(
    `/staff/placement-billings/${billingId}/issue`,
  );

  return response.data;
};

// ======================================================
// PAID
// ======================================================

export const markStaffPlacementBillingPaid = async (
  billingId: string,
): Promise<PlacementBillingResponse> => {
  const response = await axiosInstance.patch<PlacementBillingResponse>(
    `/staff/placement-billings/${billingId}/paid`,
  );

  return response.data;
};
