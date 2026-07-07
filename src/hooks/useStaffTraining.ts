import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

/* ---------------- API CONFIG ---------------- */

const API_BASE_URL = "https://vision-career.co.jp";

const TRAINING_ENDPOINTS = {
  getCategories: `${API_BASE_URL}/staff-get-training-categories.php`,
  getTopics: `${API_BASE_URL}/staff-get-training-topics.php`,
};

/* ---------------- COMMON TYPES ---------------- */

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

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
};

export type TrainingApiError = {
  success: false;
  message: string;
  error?: string;
  detected_mime_type?: string;
};

export type ApiResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type PaginatedApiResponse<T, F = Record<string, unknown>> = {
  success: true;
  message: string;
  data: T[];
  pagination: Pagination;
  filters?: F;
};

/* ---------------- ENTITY TYPES ---------------- */

export type TrainingCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  status: TrainingStatus;
  topics_count?: number;
  files_count?: number;
  created_at: string;
  updated_at: string;
};

export type TrainingTopic = {
  id: number;
  category_id: number;
  category_name: string;
  category_slug?: string;
  title: string;
  slug: string;
  description: string | null;
  sort_order: number;
  status: TrainingStatus;
  files_count?: number;
  files?: TrainingFile[];
  created_at: string;
  updated_at: string;
};

export type TrainingFile = {
  id: number;
  topic_id: number;
  topic_title?: string;
  file_title: string;
  file_name: string;
  file_path: string;
  file_type: TrainingFileType;
  mime_type: string | null;
  file_size: number | null;
  external_url: string | null;
  view_url?: string;
  download_url?: string;
  token_expires_in?: number;
  sort_order: number;
  status: TrainingStatus;
  uploaded_by: number | null;
  created_at: string;
  updated_at: string;
};

/* ---------------- REQUEST PAYLOAD TYPES ---------------- */

export type GetTrainingCategoriesParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: TrainingStatus | "";
  sort_by?:
    | "id"
    | "name"
    | "sort_order"
    | "status"
    | "created_at"
    | "updated_at";
  sort_order?: "ASC" | "DESC";
};

export type GetTrainingTopicsParams = {
  page?: number;
  limit?: number;
  category_id?: number;
  search?: string;
  status?: TrainingStatus | "";
  sort_by?:
    | "id"
    | "title"
    | "category_id"
    | "sort_order"
    | "status"
    | "created_at"
    | "updated_at";
  sort_order?: "ASC" | "DESC";
};

/* ---------------- FILTER RESPONSE TYPES ---------------- */

export type TrainingCategoriesFilters = {
  search: string;
  status: TrainingStatus | "";
  sort_by: string;
  sort_order: "ASC" | "DESC";
};

export type TrainingTopicsFilters = {
  category_id: number;
  search: string;
  status: TrainingStatus | "";
  sort_by: string;
  sort_order: "ASC" | "DESC";
};

/* ---------------- API RESPONSE TYPES ---------------- */

export type GetTrainingCategoriesResponse = PaginatedApiResponse<
  TrainingCategory,
  TrainingCategoriesFilters
>;

export type GetTrainingTopicsResponse = PaginatedApiResponse<
  TrainingTopic,
  TrainingTopicsFilters
>;

/* ---------------- TOKEN HELPER ---------------- */

function getAdminToken(): string | null {
  return localStorage.getItem("staff_token");
}

/* ---------------- FETCH HELPER ---------------- */

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  if (data?.success === false) {
    throw new Error(data?.message || "Request failed");
  }

  return data as T;
}

function buildQueryString(params: Record<string, unknown>): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
}

/* ---------------- QUERY KEYS ---------------- */

export const trainingQueryKeys = {
  all: ["training"] as const,

  categories: ["training", "categories"] as const,
  categoriesList: (params: GetTrainingCategoriesParams = {}) =>
    ["training", "categories", "list", params] as const,

  topics: ["training", "topics"] as const,
  topicsList: (params: GetTrainingTopicsParams = {}) =>
    ["training", "topics", "list", params] as const,
};

/* ---------------- API FUNCTIONS ---------------- */

async function getTrainingCategories(
  params: GetTrainingCategoriesParams = {},
): Promise<GetTrainingCategoriesResponse> {
  const queryString = buildQueryString({
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    search: params.search ?? "",
    status: params.status ?? "",
    sort_by: params.sort_by ?? "sort_order",
    sort_order: params.sort_order ?? "ASC",
  });

  return apiFetch<GetTrainingCategoriesResponse>(
    `${TRAINING_ENDPOINTS.getCategories}${queryString}`,
    {
      method: "GET",
    },
  );
}

async function getTrainingTopics(
  params: GetTrainingTopicsParams = {},
): Promise<GetTrainingTopicsResponse> {
  const queryString = buildQueryString({
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    category_id: params.category_id ?? "",
    search: params.search ?? "",
    status: params.status ?? "",
    sort_by: params.sort_by ?? "sort_order",
    sort_order: params.sort_order ?? "ASC",
  });

  return apiFetch<GetTrainingTopicsResponse>(
    `${TRAINING_ENDPOINTS.getTopics}${queryString}`,
    {
      method: "GET",
    },
  );
}

/* ---------------- HOOKS ---------------- */

export function useTrainingCategories(
  params: GetTrainingCategoriesParams = {},
) {
  return useQuery<GetTrainingCategoriesResponse, Error>({
    queryKey: trainingQueryKeys.categoriesList(params),
    queryFn: () => getTrainingCategories(params),
    placeholderData: keepPreviousData,
  });
}

export function useTrainingTopics(params: GetTrainingTopicsParams = {}) {
  return useQuery<GetTrainingTopicsResponse, Error>({
    queryKey: trainingQueryKeys.topicsList(params),
    queryFn: () => getTrainingTopics(params),
    placeholderData: keepPreviousData,
  });
}
