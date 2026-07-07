import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

/* ---------------- API CONFIG ---------------- */

const API_BASE_URL = "https://vision-career.co.jp";

const TRAINING_ENDPOINTS = {
  createCategory: `${API_BASE_URL}/admin-create-training-category.php`,
  createTopic: `${API_BASE_URL}/admin-create-training-topic.php`,
  uploadFile: `${API_BASE_URL}/admin-upload-training-file.php`,
  getCategories: `${API_BASE_URL}/admin-get-training-categories.php`,
  getTopics: `${API_BASE_URL}/admin-get-training-topics.php`,
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
  token_expires_in?: number;
  sort_order: number;
  status: TrainingStatus;
  uploaded_by: number | null;
  created_at: string;
  updated_at: string;
};

/* ---------------- REQUEST PAYLOAD TYPES ---------------- */

export type CreateTrainingCategoryPayload = {
  name: string;
  description?: string | null;
  sort_order?: number;
  status?: TrainingStatus;
};

export type CreateTrainingTopicPayload = {
  category_id: number;
  title: string;
  description?: string | null;
  sort_order?: number;
  status?: TrainingStatus;
};

export type UploadTrainingFilePayload = {
  topic_id: number;
  file_title: string;
  file: File;
  sort_order?: number;
  status?: TrainingStatus;
};

export type UpdateTrainingTopicPayload = {
  id: number;
  category_id?: number;
  title?: string;
  description?: string | null;
  sort_order?: number;
  status?: TrainingStatus;
};

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

export type UpdateTrainingCategoryPayload = {
  id: number;
  name?: string;
  description?: string | null;
  sort_order?: number;
  status?: TrainingStatus;
};

export type DeleteTrainingCategoryPayload = {
  id: number;
};

export type DeleteTrainingTopicPayload = {
  id: number;
};

export type DeleteTrainingFilePayload = {
  id: number;
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

export type CreateTrainingCategoryResponse = ApiResponse<TrainingCategory>;

export type UpdateTrainingCategoryResponse = ApiResponse<TrainingCategory>;

export type CreateTrainingTopicResponse = ApiResponse<TrainingTopic>;

export type UpdateTrainingTopicResponse = ApiResponse<TrainingTopic>;

export type UploadTrainingFileResponse = ApiResponse<TrainingFile>;

export type DeleteTrainingCategoryResponse = ApiResponse<TrainingCategory>;

export type DeleteTrainingTopicResponse = ApiResponse<TrainingTopic>;

export type DeleteTrainingFileResponse = ApiResponse<TrainingFile>;

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
  return localStorage.getItem("admin_token");
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

async function createTrainingCategory(
  payload: CreateTrainingCategoryPayload,
): Promise<CreateTrainingCategoryResponse> {
  return apiFetch<CreateTrainingCategoryResponse>(
    TRAINING_ENDPOINTS.createCategory,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        description: payload.description ?? null,
        sort_order: payload.sort_order ?? 0,
        status: payload.status ?? "active",
      }),
    },
  );
}

async function createTrainingTopic(
  payload: CreateTrainingTopicPayload,
): Promise<CreateTrainingTopicResponse> {
  return apiFetch<CreateTrainingTopicResponse>(TRAINING_ENDPOINTS.createTopic, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      category_id: payload.category_id,
      title: payload.title,
      description: payload.description ?? null,
      sort_order: payload.sort_order ?? 0,
      status: payload.status ?? "active",
    }),
  });
}

async function uploadTrainingFile(
  payload: UploadTrainingFilePayload,
): Promise<UploadTrainingFileResponse> {
  const formData = new FormData();

  formData.append("topic_id", String(payload.topic_id));
  formData.append("file_title", payload.file_title);
  formData.append("sort_order", String(payload.sort_order ?? 0));
  formData.append("status", payload.status ?? "active");
  formData.append("file", payload.file);

  return apiFetch<UploadTrainingFileResponse>(TRAINING_ENDPOINTS.uploadFile, {
    method: "POST",
    body: formData,
  });
}

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

export function useCreateTrainingCategory() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateTrainingCategoryResponse,
    Error,
    CreateTrainingCategoryPayload
  >({
    mutationFn: createTrainingCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trainingQueryKeys.categories,
      });
    },
  });
}

export function useCreateTrainingTopic() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateTrainingTopicResponse,
    Error,
    CreateTrainingTopicPayload
  >({
    mutationFn: createTrainingTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trainingQueryKeys.topics,
      });

      queryClient.invalidateQueries({
        queryKey: trainingQueryKeys.categories,
      });
    },
  });
}

export function useUploadTrainingFile() {
  const queryClient = useQueryClient();

  return useMutation<
    UploadTrainingFileResponse,
    Error,
    UploadTrainingFilePayload
  >({
    mutationFn: uploadTrainingFile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trainingQueryKeys.topics,
      });

      queryClient.invalidateQueries({
        queryKey: trainingQueryKeys.categories,
      });
    },
  });
}

export function useUpdateTrainingCategory() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateTrainingCategoryResponse,
    Error,
    UpdateTrainingCategoryPayload
  >({
    mutationFn: async (payload: UpdateTrainingCategoryPayload) => {
      return apiFetch<UpdateTrainingCategoryResponse>(
        `${API_BASE_URL}/admin-update-training-category.php`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trainingQueryKeys.categories,
      });

      queryClient.invalidateQueries({
        queryKey: trainingQueryKeys.topics,
      });
    },
  });
}

export function useUpdateTrainingTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateTrainingTopicPayload) => {
      return apiFetch<UpdateTrainingTopicResponse>(
        `${API_BASE_URL}/admin-update-training-topic.php`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trainingQueryKeys.topics,
      });
    },
  });
}

export function useDeleteTrainingCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DeleteTrainingCategoryPayload) => {
      return apiFetch<DeleteTrainingCategoryResponse>(
        `${API_BASE_URL}/admin-delete-training-category.php`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trainingQueryKeys.categories,
      });
    },
  });
}

export function useDeleteTrainingTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DeleteTrainingTopicPayload) => {
      return apiFetch<DeleteTrainingTopicResponse>(
        `${API_BASE_URL}/admin-delete-training-topic.php`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trainingQueryKeys.topics,
      });
    },
  });
}

export function useDeleteTrainingFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DeleteTrainingFilePayload) => {
      return apiFetch<DeleteTrainingFileResponse>(
        `${API_BASE_URL}/admin-delete-training-file.php`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trainingQueryKeys.topics,
      });
    },
  });
}
