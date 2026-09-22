// ======================================================
// COMMON
// ======================================================

export type TrainingStatus = "active" | "inactive";

export type TrainingFileType =
  | "pdf"
  | "video"
  | "image"
  | "doc"
  | "excel"
  | "ppt"
  | "link"
  | "other";

export type TrainingCategorySortBy =
  | "id"
  | "name"
  | "sort_order"
  | "status"
  | "created_at"
  | "updated_at";

export type TrainingTopicSortBy =
  | "id"
  | "title"
  | "sort_order"
  | "status"
  | "created_at"
  | "updated_at";

export type TrainingSortOrder = "ASC" | "DESC";

// ======================================================
// PAGINATION
// ======================================================

export type TrainingPagination = {
  page: number;

  limit: number;

  total: number;

  total_pages: number;

  has_next_page: boolean;

  has_prev_page: boolean;
};

// ======================================================
// CATEGORY
// ======================================================

export type TrainingCategory = {
  id: string;

  name: string;

  slug: string;

  description: string | null;

  sort_order: number;

  status: TrainingStatus;

  topics_count: number;

  files_count: number;

  created_at: string;

  updated_at: string;
};

// ======================================================
// FILE
// ======================================================

export type TrainingFile = {
  id: string;

  topic_id: string;

  topic_title?: string;

  file_title: string;

  file_name: string;

  file_path: string;

  file_type: TrainingFileType;

  mime_type: string | null;

  file_size: number | null;

  external_url: string | null;

  view_url?: string;

  sort_order: number;

  status: TrainingStatus;

  uploaded_by: string | null;

  created_at: string;

  updated_at: string;
};

// ======================================================
// TOPIC
// ======================================================

export type TrainingTopic = {
  id: string;

  category_id: string;

  category_name: string;

  category_slug?: string;

  title: string;

  slug: string;

  description: string | null;

  sort_order: number;

  status: TrainingStatus;

  files_count: number;

  files?: TrainingFile[];

  created_at: string;

  updated_at: string;
};

// ======================================================
// FILTERS
// ======================================================

export type GetTrainingCategoriesParams = {
  page?: number;

  limit?: number;

  search?: string;

  status?: TrainingStatus | "";

  sort_by?: TrainingCategorySortBy;

  sort_order?: TrainingSortOrder;
};

export type GetTrainingTopicsParams = {
  page?: number;

  limit?: number;

  category_id?: string;

  search?: string;

  status?: TrainingStatus | "";

  sort_by?: TrainingTopicSortBy;

  sort_order?: TrainingSortOrder;
};

// ======================================================
// CATEGORY PAYLOADS
// ======================================================

export type CreateTrainingCategoryPayload = {
  name: string;

  description?: string | null;

  sort_order?: number;

  status?: TrainingStatus;
};

export type UpdateTrainingCategoryPayload = {
  id: string;

  name?: string;

  description?: string | null;

  sort_order?: number;

  status?: TrainingStatus;
};

export type DeleteTrainingCategoryPayload = {
  id: string;
};

// ======================================================
// TOPIC PAYLOADS
// ======================================================

export type CreateTrainingTopicPayload = {
  category_id: string;

  title: string;

  description?: string | null;

  sort_order?: number;

  status?: TrainingStatus;
};

export type UpdateTrainingTopicPayload = {
  id: string;

  category_id?: string;

  title?: string;

  description?: string | null;

  sort_order?: number;

  status?: TrainingStatus;
};

export type DeleteTrainingTopicPayload = {
  id: string;
};

// ======================================================
// FILE PAYLOADS
// ======================================================

export type UploadTrainingFilePayload = {
  topic_id: string;

  file_title: string;

  file: File;

  sort_order?: number;

  status?: TrainingStatus;
};

export type DeleteTrainingFilePayload = {
  id: string;
};

// ======================================================
// RESPONSES
// ======================================================

export type GetTrainingCategoriesResponse = {
  success: boolean;

  message?: string;

  count: number;

  data: TrainingCategory[];

  pagination: TrainingPagination;
};

export type GetTrainingTopicsResponse = {
  success: boolean;

  message?: string;

  count: number;

  data: TrainingTopic[];

  pagination: TrainingPagination;
};

export type TrainingCategoryResponse = {
  success: boolean;

  message?: string;

  data: TrainingCategory;
};

export type TrainingTopicResponse = {
  success: boolean;

  message?: string;

  data: TrainingTopic;
};

export type TrainingFileResponse = {
  success: boolean;

  message?: string;

  data: TrainingFile;
};

export type TrainingDeleteResponse = {
  success: boolean;

  message?: string;
};

export type TrainingApiError = {
  success?: boolean;

  message?: string;
};
