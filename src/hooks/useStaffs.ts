import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

export type StaffStatus = "active" | "inactive" | "suspended";

const API_BASE_URL = "https://vision-career.co.jp";

export interface Staff {
  id: number;
  username: string;
  status: StaffStatus;
  created_at: string;
  updated_at: string;
}

export interface StaffPagination {
  current_page: number;
  limit: number;
  total_records: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

export interface StaffFilters {
  search: string;
  status: string;
  sort_by: string;
  sort_order: "ASC" | "DESC";
}

export interface StaffListResponse {
  status: "success" | "error";
  message: string;
  data: Staff[];
  pagination: StaffPagination;
  filters: StaffFilters;
}

export interface StaffListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: StaffStatus | "";
  sort_by?: "id" | "username" | "status" | "created_at" | "updated_at";
  sort_order?: "ASC" | "DESC";
}

export interface CreateStaffPayload {
  username: string;
  password: string;
  status?: StaffStatus;
}

export interface UpdateStaffPayload {
  id: number;
  username?: string;
  password?: string;
  status?: StaffStatus;
}

export interface DeleteStaffPayload {
  id: number;
}

export interface ToggleStaffStatusPayload {
  id: number;
}

export interface ToggleStaffStatusResponse {
  status: "success" | "error";
  message: string;
  data: {
    id: number;
    username: string;
    previous_status: StaffStatus;
    new_status: StaffStatus;
  };
}

interface ApiResponse {
  status: "success" | "error";
  message: string;
  staff_id?: number;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("admin_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  const result = await response.json();

  if (!response.ok || result.status === "error") {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
}

/**
 * Query keys
 */
export const staffKeys = {
  all: ["staffs"] as const,
  lists: () => [...staffKeys.all, "list"] as const,
  list: (params: StaffListParams) => [...staffKeys.lists(), params] as const,
};

/**
 * Fetch all staffs with pagination, search, filters and sorting
 */
export function useStaffs(params: StaffListParams = {}) {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    sort_by = "created_at",
    sort_order = "DESC",
  } = params;

  return useQuery({
    queryKey: staffKeys.list({
      page,
      limit,
      search,
      status,
      sort_by,
      sort_order,
    }),
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      queryParams.set("page", String(page));
      queryParams.set("limit", String(limit));

      if (search) queryParams.set("search", search);
      if (status) queryParams.set("status", status);

      queryParams.set("sort_by", sort_by);
      queryParams.set("sort_order", sort_order);

      return apiRequest<StaffListResponse>(
        `admin-get-staff.php?${queryParams.toString()}`,
        {
          method: "GET",
        },
      );
    },
    placeholderData: keepPreviousData,
  });
}

/**
 * Create staff
 */
export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateStaffPayload) => {
      return apiRequest<ApiResponse>("admin-create-staff.php", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staffKeys.all,
      });
    },
  });
}

/**
 * Update staff
 */
export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateStaffPayload) => {
      return apiRequest<ApiResponse>("admin-update-staff.php", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staffKeys.all,
      });
    },
  });
}

/**
 * Delete staff
 */
export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DeleteStaffPayload) => {
      return apiRequest<ApiResponse>("admin-delete-staff.php", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staffKeys.all,
      });
    },
  });
}

export function useToggleStaffStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ToggleStaffStatusPayload) => {
      return apiRequest<ToggleStaffStatusResponse>(
        "admin-toggle-staff-status.php",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staffKeys.all,
      });
    },
  });
}
