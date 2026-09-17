import axiosInstance from "@/services/axiosInstance";

import type {
  AccountStatusPayload,
  AdminSeeker,
  ApiMessageResponse,
  ApprovalPayload,
  CreateSeekerPayload,
  EditSeekerPayload,
  PlacementStatusPayload,
  SeekerFilters,
  SeekerListResponse,
  SeekerResponse,
} from "./types";

// ======================================================
// LIST
// ======================================================

export const getAdminSeekers = async (
  filters: SeekerFilters,
): Promise<SeekerListResponse> => {
  const response = await axiosInstance.get<SeekerListResponse>(
    "/admin/seekers",
    {
      params: {
        search: filters.search || undefined,

        approvalStatus: filters.approvalStatus || undefined,

        accountStatus: filters.accountStatus || undefined,

        placementStatus: filters.placementStatus || undefined,

        page: filters.page,

        limit: filters.limit,
      },
    },
  );

  return response.data;
};

// ======================================================
// DETAILS
// ======================================================

export const getAdminSeekerById = async (
  seekerId: string,
): Promise<SeekerResponse> => {
  const response = await axiosInstance.get<SeekerResponse>(
    `/admin/seekers/${seekerId}`,
  );

  return response.data;
};

// ======================================================
// CREATE
// ======================================================

export const createAdminSeeker = async (
  payload: CreateSeekerPayload,
): Promise<SeekerResponse> => {
  const response = await axiosInstance.post<SeekerResponse>(
    "/admin/seekers",
    payload,
  );

  return response.data;
};

// ======================================================
// EDIT
// ======================================================

export const updateAdminSeeker = async (
  seekerId: string,

  payload: EditSeekerPayload,
): Promise<SeekerResponse> => {
  const response = await axiosInstance.patch<SeekerResponse>(
    `/admin/seekers/${seekerId}`,
    payload,
  );

  return response.data;
};

// ======================================================
// APPROVAL
// ======================================================

export const updateAdminSeekerApproval = async (
  seekerId: string,

  payload: ApprovalPayload,
): Promise<SeekerResponse> => {
  const response = await axiosInstance.patch<SeekerResponse>(
    `/admin/seekers/${seekerId}/approval`,
    payload,
  );

  return response.data;
};

// ======================================================
// ACCOUNT STATUS
// ======================================================

export const updateAdminSeekerAccountStatus = async (
  seekerId: string,

  payload: AccountStatusPayload,
): Promise<SeekerResponse> => {
  const response = await axiosInstance.patch<SeekerResponse>(
    `/admin/seekers/${seekerId}/account-status`,
    payload,
  );

  return response.data;
};

// ======================================================
// PLACEMENT STATUS
// ======================================================

export const updateAdminSeekerPlacementStatus = async (
  seekerId: string,

  payload: PlacementStatusPayload,
): Promise<SeekerResponse> => {
  const response = await axiosInstance.patch<SeekerResponse>(
    `/admin/seekers/${seekerId}/placement-status`,
    payload,
  );

  return response.data;
};

// ======================================================
// DELETE
// ======================================================

export const deleteAdminSeeker = async (
  seekerId: string,
): Promise<ApiMessageResponse> => {
  const response = await axiosInstance.delete<ApiMessageResponse>(
    `/admin/seekers/${seekerId}`,
  );

  return response.data;
};

// ======================================================
// RESUME
// ======================================================

export const downloadAdminSeekerResume = async (
  seeker: AdminSeeker,
): Promise<void> => {
  const response = await axiosInstance.get<Blob>(
    `/admin/seekers/${seeker.seeker_id}/resume`,
    {
      responseType: "blob",
    },
  );

  const objectUrl = URL.createObjectURL(response.data);

  const link = document.createElement("a");

  link.href = objectUrl;

  link.download = `${seeker.seeker_id}-resume`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(objectUrl);
};
