// ======================================================
// TRAINING
// ======================================================

export type StaffTrainingFileType =
  | "pdf"
  | "video"
  | "image"
  | "doc"
  | "excel"
  | "ppt"
  | "other";

// ======================================================
// PAGINATION
// ======================================================

export type StaffTrainingPagination = {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPrevPage: boolean;
};

// ======================================================
// CATEGORY
// ======================================================

export type StaffTrainingCategory = {
  categoryId: string;

  name: string;

  slug: string;

  description?: string | null;

  sortOrder: number;

  topicsCount: number;

  filesCount: number;

  createdAt: string;

  updatedAt: string;
};

// ======================================================
// FILE
// ======================================================

export type StaffTrainingFile = {
  fileId: string;

  topicId: string;

  fileTitle: string;

  fileName: string;

  fileType: StaffTrainingFileType;

  mimeType?: string | null;

  fileSize?: number | null;

  externalUrl?: string | null;

  sortOrder: number;

  viewEndpoint: string;

  createdAt: string;

  updatedAt: string;
};

// ======================================================
// TOPIC
// ======================================================

export type StaffTrainingTopic = {
  topicId: string;

  categoryId: string;

  categoryName?: string | null;

  categorySlug?: string | null;

  title: string;

  slug: string;

  description?: string | null;

  sortOrder: number;

  filesCount: number;

  files?: StaffTrainingFile[];

  createdAt: string;

  updatedAt: string;
};

// ======================================================
// CATEGORY RESPONSE
// ======================================================

export type StaffTrainingCategoryListResponse = {
  success: boolean;

  count: number;

  data: StaffTrainingCategory[];

  pagination: StaffTrainingPagination;

  message?: string;
};

// ======================================================
// TOPIC LIST RESPONSE
// ======================================================

export type StaffTrainingTopicListResponse = {
  success: boolean;

  count: number;

  category: {
    categoryId: string;

    name: string;

    slug: string;
  };

  data: StaffTrainingTopic[];

  message?: string;
};

// ======================================================
// TOPIC DETAILS RESPONSE
// ======================================================

export type StaffTrainingTopicResponse = {
  success: boolean;

  data: StaffTrainingTopic;

  message?: string;
};

// ======================================================
// FILTERS
// ======================================================

export type StaffTrainingCategoryFilters = {
  page: number;

  limit: number;

  search: string;
};

// ======================================================
// API ERROR
// ======================================================

export type StaffTrainingApiError = {
  success?: boolean;

  message?: string;
};
