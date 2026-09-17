import axiosInstance from "@/services/axiosInstance";

import type {
  CreateStaffPayload,
  ResetStaffPasswordPayload,
  StaffListResponse,
  StaffPermissionResponse,
  StaffResponse,
  UpdateStaffPayload,
} from "./types";

// ======================================================
// GET STAFF LIST
//
// GET /api/admin/staff
// ======================================================

export const getStaffList = async () => {
  const response = await axiosInstance.get<StaffListResponse>("/admin/staff");

  return response.data;
};

// ======================================================
// GET ONE STAFF
//
// GET /api/admin/staff/:staffId
// ======================================================

export const getStaffById = async (staffId: string) => {
  const response = await axiosInstance.get<StaffResponse>(
    `/admin/staff/${staffId}`,
  );

  return response.data;
};

// ======================================================
// CREATE STAFF
//
// POST /api/admin/staff
// ======================================================

export const createStaff = async (payload: CreateStaffPayload) => {
  const response = await axiosInstance.post<StaffResponse>(
    "/admin/staff",
    payload,
  );

  return response.data;
};

// ======================================================
// UPDATE STAFF
//
// PATCH /api/admin/staff/:staffId
// ======================================================

export const updateStaff = async (
  staffId: string,
  payload: UpdateStaffPayload,
) => {
  const response = await axiosInstance.patch<StaffResponse>(
    `/admin/staff/${staffId}`,
    payload,
  );

  return response.data;
};

// ======================================================
// RESET PASSWORD
//
// PATCH /api/admin/staff/:staffId/password
// ======================================================

export const resetStaffPassword = async (
  staffId: string,
  payload: ResetStaffPasswordPayload,
) => {
  const response = await axiosInstance.patch<{
    success: boolean;
    message: string;
  }>(`/admin/staff/${staffId}/password`, payload);

  return response.data;
};

// ======================================================
// GET PERMISSION OPTIONS
//
// GET /api/admin/staff/permissions/options
// ======================================================

export const getStaffPermissionOptions = async () => {
  const response = await axiosInstance.get<StaffPermissionResponse>(
    "/admin/staff/permissions/options",
  );

  return response.data;
};
