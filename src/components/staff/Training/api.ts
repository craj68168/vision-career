import axiosInstance from "@/services/axiosInstance";

import type {
  StaffTrainingCategoryFilters,
  StaffTrainingCategoryListResponse,
  StaffTrainingTopicListResponse,
  StaffTrainingTopicResponse,
} from "./types";

// ======================================================
// GET CATEGORIES
// ======================================================

export const getStaffTrainingCategories = async (
  filters: StaffTrainingCategoryFilters,
): Promise<StaffTrainingCategoryListResponse> => {
  const response = await axiosInstance.get<StaffTrainingCategoryListResponse>(
    "/staff/training/categories",
    {
      params: {
        page: filters.page,

        limit: filters.limit,

        search: filters.search || undefined,
      },
    },
  );

  return response.data;
};

// ======================================================
// GET TOPICS
// ======================================================

export const getStaffTrainingTopics = async (
  categoryId: string,
): Promise<StaffTrainingTopicListResponse> => {
  const response = await axiosInstance.get<StaffTrainingTopicListResponse>(
    `/staff/training/categories/${categoryId}/topics`,
  );

  return response.data;
};

// ======================================================
// GET TOPIC DETAILS
// ======================================================

export const getStaffTrainingTopicById = async (
  topicId: string,
): Promise<StaffTrainingTopicResponse> => {
  const response = await axiosInstance.get<StaffTrainingTopicResponse>(
    `/staff/training/topics/${topicId}`,
  );

  return response.data;
};

// ======================================================
// OPEN PRIVATE TRAINING FILE
// ======================================================

export const openStaffTrainingFile = async (fileId: string): Promise<void> => {
  const popup = window.open(
    "about:blank",

    "_blank",
  );

  try {
    const response = await axiosInstance.get<Blob>(
      `/staff/training/files/${fileId}/view`,
      {
        responseType: "blob",
      },
    );

    const objectUrl = URL.createObjectURL(response.data);

    if (popup) {
      popup.location.href = objectUrl;
    } else {
      window.open(
        objectUrl,

        "_blank",

        "noopener,noreferrer",
      );
    }

    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 60000);
  } catch (error) {
    popup?.close();

    throw error;
  }
};
