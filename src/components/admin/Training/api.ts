import axiosInstance from "@/services/axiosInstance";

import type {
  CreateTrainingCategoryPayload,
  CreateTrainingTopicPayload,
  DeleteTrainingCategoryPayload,
  DeleteTrainingFilePayload,
  DeleteTrainingTopicPayload,
  GetTrainingCategoriesParams,
  GetTrainingCategoriesResponse,
  GetTrainingTopicsParams,
  GetTrainingTopicsResponse,
  TrainingCategory,
  TrainingCategoryResponse,
  TrainingDeleteResponse,
  TrainingFile,
  TrainingFileResponse,
  TrainingFileType,
  TrainingPagination,
  TrainingStatus,
  TrainingTopic,
  TrainingTopicResponse,
  UpdateTrainingCategoryPayload,
  UpdateTrainingTopicPayload,
  UploadTrainingFilePayload,
} from "./types";

// ======================================================
// RAW BACKEND TYPES
// ======================================================

type RawPagination = {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPrevPage: boolean;
};

type RawTrainingCategory = {
  categoryId: string;

  name: string;

  slug: string;

  description?: string | null;

  sortOrder: number;

  status: TrainingStatus;

  topicsCount?: number;

  filesCount?: number;

  createdAt: string;

  updatedAt: string;
};

type RawTrainingFile = {
  fileId: string;

  topicId: string;

  fileTitle: string;

  fileName: string;

  fileType: TrainingFileType;

  mimeType?: string | null;

  fileSize?: number | null;

  externalUrl?: string | null;

  sortOrder: number;

  status: TrainingStatus;

  uploadedByAdminId?: string | null;

  viewEndpoint?: string;

  createdAt: string;

  updatedAt: string;
};

type RawTrainingTopic = {
  topicId: string;

  categoryId: string;

  categoryName?: string | null;

  categorySlug?: string | null;

  title: string;

  slug: string;

  description?: string | null;

  sortOrder: number;

  status: TrainingStatus;

  filesCount?: number;

  files?: RawTrainingFile[];

  createdAt: string;

  updatedAt: string;
};

type RawCategoryListResponse = {
  success: boolean;

  message?: string;

  count: number;

  data: RawTrainingCategory[];

  pagination: RawPagination;
};

type RawTopicListResponse = {
  success: boolean;

  message?: string;

  count: number;

  data: RawTrainingTopic[];

  pagination: RawPagination;
};

type RawCategoryResponse = {
  success: boolean;

  message?: string;

  data: RawTrainingCategory;
};

type RawTopicResponse = {
  success: boolean;

  message?: string;

  data: RawTrainingTopic;
};

type RawFileResponse = {
  success: boolean;

  message?: string;

  data: RawTrainingFile;
};

// ======================================================
// NORMALIZERS
// ======================================================

const normalizePagination = (
  pagination: RawPagination,
): TrainingPagination => ({
  page: pagination.page,

  limit: pagination.limit,

  total: pagination.total,

  total_pages: pagination.totalPages,

  has_next_page: pagination.hasNextPage,

  has_prev_page: pagination.hasPrevPage,
});

const normalizeCategory = (
  category: RawTrainingCategory,
): TrainingCategory => ({
  id: category.categoryId,

  name: category.name,

  slug: category.slug,

  description: category.description ?? null,

  sort_order: category.sortOrder,

  status: category.status,

  topics_count: category.topicsCount ?? 0,

  files_count: category.filesCount ?? 0,

  created_at: category.createdAt,

  updated_at: category.updatedAt,
});

const normalizeFile = (file: RawTrainingFile): TrainingFile => ({
  id: file.fileId,

  topic_id: file.topicId,

  file_title: file.fileTitle,

  file_name: file.fileName,

  file_path: "",

  file_type: file.fileType,

  mime_type: file.mimeType ?? null,

  file_size: file.fileSize ?? null,

  external_url: file.externalUrl ?? null,

  view_url: file.viewEndpoint,

  sort_order: file.sortOrder,

  status: file.status,

  uploaded_by: file.uploadedByAdminId ?? null,

  created_at: file.createdAt,

  updated_at: file.updatedAt,
});

const normalizeTopic = (topic: RawTrainingTopic): TrainingTopic => ({
  id: topic.topicId,

  category_id: topic.categoryId,

  category_name: topic.categoryName ?? "",

  category_slug: topic.categorySlug ?? undefined,

  title: topic.title,

  slug: topic.slug,

  description: topic.description ?? null,

  sort_order: topic.sortOrder,

  status: topic.status,

  files_count: topic.filesCount ?? 0,

  files: topic.files?.map(normalizeFile),

  created_at: topic.createdAt,

  updated_at: topic.updatedAt,
});

// ======================================================
// GET CATEGORIES
// ======================================================

export const getTrainingCategories = async (
  params: GetTrainingCategoriesParams = {},
): Promise<GetTrainingCategoriesResponse> => {
  const response = await axiosInstance.get<RawCategoryListResponse>(
    "/admin/training/categories",
    {
      params: {
        page: params.page ?? 1,

        limit: params.limit ?? 10,

        search: params.search || undefined,

        status: params.status || undefined,

        sort_by: params.sort_by ?? "sort_order",

        sort_order: params.sort_order ?? "ASC",
      },
    },
  );

  return {
    success: response.data.success,

    message: response.data.message,

    count: response.data.count,

    data: response.data.data.map(normalizeCategory),

    pagination: normalizePagination(response.data.pagination),
  };
};

// ======================================================
// GET TOPICS
// ======================================================

export const getTrainingTopics = async (
  params: GetTrainingTopicsParams,
): Promise<GetTrainingTopicsResponse> => {
  if (!params.category_id) {
    throw new Error("Training category ID is required.");
  }

  const response = await axiosInstance.get<RawTopicListResponse>(
    `/admin/training/categories/${params.category_id}/topics`,
    {
      params: {
        page: params.page ?? 1,

        limit: params.limit ?? 100,

        search: params.search || undefined,

        status: params.status || undefined,

        sort_by: params.sort_by ?? "sort_order",

        sort_order: params.sort_order ?? "ASC",
      },
    },
  );

  return {
    success: response.data.success,

    message: response.data.message,

    count: response.data.count,

    data: response.data.data.map(normalizeTopic),

    pagination: normalizePagination(response.data.pagination),
  };
};

// ======================================================
// GET TOPIC DETAILS
// ======================================================

export const getTrainingTopicById = async (
  topicId: string,
): Promise<TrainingTopicResponse> => {
  const response = await axiosInstance.get<RawTopicResponse>(
    `/admin/training/topics/${topicId}`,
  );

  return {
    success: response.data.success,

    message: response.data.message,

    data: normalizeTopic(response.data.data),
  };
};

// ======================================================
// CREATE CATEGORY
// ======================================================

export const createTrainingCategory = async (
  payload: CreateTrainingCategoryPayload,
): Promise<TrainingCategoryResponse> => {
  const response = await axiosInstance.post<RawCategoryResponse>(
    "/admin/training/categories",
    {
      name: payload.name,

      description: payload.description ?? null,

      sortOrder: payload.sort_order ?? 0,

      status: payload.status ?? "active",
    },
  );

  return {
    success: response.data.success,

    message: response.data.message,

    data: normalizeCategory(response.data.data),
  };
};

// ======================================================
// UPDATE CATEGORY
// ======================================================

export const updateTrainingCategory = async (
  payload: UpdateTrainingCategoryPayload,
): Promise<TrainingCategoryResponse> => {
  const response = await axiosInstance.patch<RawCategoryResponse>(
    `/admin/training/categories/${payload.id}`,
    {
      name: payload.name,

      description: payload.description,

      sortOrder: payload.sort_order,

      status: payload.status,
    },
  );

  return {
    success: response.data.success,

    message: response.data.message,

    data: normalizeCategory(response.data.data),
  };
};

// ======================================================
// DELETE CATEGORY
// ======================================================

export const deleteTrainingCategory = async (
  payload: DeleteTrainingCategoryPayload,
): Promise<TrainingDeleteResponse> => {
  const response = await axiosInstance.delete<TrainingDeleteResponse>(
    `/admin/training/categories/${payload.id}`,
  );

  return response.data;
};

// ======================================================
// CREATE TOPIC
// ======================================================

export const createTrainingTopic = async (
  payload: CreateTrainingTopicPayload,
): Promise<TrainingTopicResponse> => {
  const response = await axiosInstance.post<RawTopicResponse>(
    `/admin/training/categories/${payload.category_id}/topics`,
    {
      title: payload.title,

      description: payload.description ?? null,

      sortOrder: payload.sort_order ?? 0,

      status: payload.status ?? "active",
    },
  );

  return {
    success: response.data.success,

    message: response.data.message,

    data: normalizeTopic(response.data.data),
  };
};

// ======================================================
// UPDATE TOPIC
// ======================================================

export const updateTrainingTopic = async (
  payload: UpdateTrainingTopicPayload,
): Promise<TrainingTopicResponse> => {
  const response = await axiosInstance.patch<RawTopicResponse>(
    `/admin/training/topics/${payload.id}`,
    {
      title: payload.title,

      description: payload.description,

      sortOrder: payload.sort_order,

      status: payload.status,
    },
  );

  return {
    success: response.data.success,

    message: response.data.message,

    data: normalizeTopic(response.data.data),
  };
};

// ======================================================
// DELETE TOPIC
// ======================================================

export const deleteTrainingTopic = async (
  payload: DeleteTrainingTopicPayload,
): Promise<TrainingDeleteResponse> => {
  const response = await axiosInstance.delete<TrainingDeleteResponse>(
    `/admin/training/topics/${payload.id}`,
  );

  return response.data;
};

// ======================================================
// UPLOAD FILE
// ======================================================

export const uploadTrainingFile = async (
  payload: UploadTrainingFilePayload,
): Promise<TrainingFileResponse> => {
  const formData = new FormData();

  formData.append("fileTitle", payload.file_title);

  formData.append("sortOrder", String(payload.sort_order ?? 0));

  formData.append("status", payload.status ?? "active");

  formData.append("file", payload.file);

  const response = await axiosInstance.post<RawFileResponse>(
    `/admin/training/topics/${payload.topic_id}/files`,
    formData,
  );

  return {
    success: response.data.success,

    message: response.data.message,

    data: normalizeFile(response.data.data),
  };
};

// ======================================================
// DELETE FILE
// ======================================================

export const deleteTrainingFile = async (
  payload: DeleteTrainingFilePayload,
): Promise<TrainingDeleteResponse> => {
  const response = await axiosInstance.delete<TrainingDeleteResponse>(
    `/admin/training/files/${payload.id}`,
  );

  return response.data;
};

// ======================================================
// OPEN PRIVATE FILE
// ======================================================

export const openTrainingFile = async (fileId: string): Promise<void> => {
  const popup = window.open("about:blank", "_blank");

  try {
    const response = await axiosInstance.get<Blob>(
      `/admin/training/files/${fileId}/view`,
      {
        responseType: "blob",
      },
    );

    const objectUrl = URL.createObjectURL(response.data);

    if (popup) {
      popup.location.href = objectUrl;
    } else {
      window.open(objectUrl, "_blank", "noopener,noreferrer");
    }

    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 60000);
  } catch (error) {
    popup?.close();

    throw error;
  }
};
