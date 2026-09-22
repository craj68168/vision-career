import axiosInstance from "@/services/axiosInstance";

import type {
  ScreenSeekerPayload,
  StaffSeeker,
  StaffSeekerFilters,
  StaffSeekerListResponse,
  StaffSeekerResponse,
} from "./types";

// ======================================================
// LIST
// ======================================================

export const getStaffSeekers = async (
  filters: StaffSeekerFilters,
): Promise<StaffSeekerListResponse> => {
  const response = await axiosInstance.get<StaffSeekerListResponse>(
    "/staff/seekers",
    {
      params: {
        search: filters.search || undefined,

        approvalStatus: filters.approvalStatus || undefined,

        accountStatus: filters.accountStatus || undefined,

        placementStatus: filters.placementStatus || undefined,

        screeningStatus: filters.screeningStatus || undefined,

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

export const getStaffSeekerById = async (
  seekerId: string,
): Promise<StaffSeekerResponse> => {
  const response = await axiosInstance.get<StaffSeekerResponse>(
    `/staff/seekers/${seekerId}`,
  );

  return response.data;
};

// ======================================================
// SCREEN
// ======================================================

export const screenStaffSeeker = async (
  seekerId: string,
  payload: ScreenSeekerPayload,
): Promise<StaffSeekerResponse> => {
  const response = await axiosInstance.patch<StaffSeekerResponse>(
    `/staff/seekers/${seekerId}/screen`,
    payload,
  );

  return response.data;
};

// ======================================================
// RESUME
// ======================================================

export const downloadStaffSeekerResume = async (
  seeker: StaffSeeker,
): Promise<void> => {
  const response = await axiosInstance.get<Blob>(
    `/staff/seekers/${seeker.seeker_id}/resume`,
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
