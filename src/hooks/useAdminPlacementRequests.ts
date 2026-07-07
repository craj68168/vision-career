import { keepPreviousData, useQuery } from "@tanstack/react-query";

const API_BASE_URL = "https://vision-career.co.jp";

export type PlacementRequestStatus =
  | "pending"
  | "reviewing"
  | "approved"
  | "rejected"
  | "recruiting"
  | "interviewing"
  | "filled"
  | "cancelled"
  | "closed";

export type AdminPlacementRequestFilters = {
  status?: PlacementRequestStatus | "";
  company_id?: number | string;
  keyword?: string;
  page?: number;
  limit?: number;
};

export type PlacementRequest = {
  id: number;
  company_id: number;

  company_name: string | null;
  company_contact_name: string | null;
  company_email: string | null;
  company_phone: string | null;
  company_address: string | null;
  company_industry: string | null;
  contact_person: string | null;
  contact_person_phone: string | null;
  contact_person_email: string | null;

  job_title: string;
  job_category: string | null;
  employment_type: string | null;
  number_of_positions: number;
  work_location: string | null;
  job_description: string | null;
  requirements: string | null;
  japanese_level_required: string | null;
  visa_type_required: string | null;
  salary_type: string | null;
  salary_amount: string | number | null;
  working_hours: string | null;
  days_off: string | null;
  start_date: string | null;
  request_status: PlacementRequestStatus;
  admin_note: string | null;
  rejection_reason: string | null;
  assigned_staff_id: number | null;
  created_at: string;
  updated_at: string | null;
};

export type AdminPlacementRequestsResponse = {
  status: "success" | "error";
  message: string;
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  filters: {
    status: string | null;
    company_id: string | number | null;
    keyword: string | null;
  };
  placement_requests: PlacementRequest[];
};

async function fetchAdminPlacementRequests(
  token: string,
  filters: AdminPlacementRequestFilters = {},
): Promise<AdminPlacementRequestsResponse> {
  const params = new URLSearchParams();

  if (filters.status) {
    params.append("status", filters.status);
  }

  if (filters.company_id) {
    params.append("company_id", String(filters.company_id));
  }

  if (filters.keyword) {
    params.append("keyword", filters.keyword);
  }

  params.append("page", String(filters.page || 1));
  params.append("limit", String(filters.limit || 20));

  const response = await fetch(
    `${API_BASE_URL}/admin-get-placement-requests.php?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch placement requests");
  }

  return data;
}

export function useAdminPlacementRequests(
  token: string | null,
  filters: AdminPlacementRequestFilters = {},
) {
  return useQuery({
    queryKey: ["admin-placement-requests", filters],
    queryFn: () => fetchAdminPlacementRequests(token as string, filters),
    enabled: !!token,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
}
