// hooks/useCompanyPlacementRequests.ts
import { useQuery } from "@tanstack/react-query";

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

export type CompanyPlacementRequestFilters = {
  status?: PlacementRequestStatus | "";
  keyword?: string;
  page?: number;
  limit?: number;
};

export type CompanyPlacementRequest = {
  id: number;
  company_id: number;

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

export type CompanyPlacementRequestsResponse = {
  status: "success" | "error";
  message: string;
  company: {
    id: number;
    name: string;
    company_name: string;
    email: string;
    phone: string | null;
    status: string;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  filters: {
    status: string | null;
    keyword: string | null;
  };
  placement_requests: CompanyPlacementRequest[];
};

async function fetchCompanyPlacementRequests(
  token: string,
  filters: CompanyPlacementRequestFilters = {},
): Promise<CompanyPlacementRequestsResponse> {
  const params = new URLSearchParams();

  if (filters.status) {
    params.append("status", filters.status);
  }

  if (filters.keyword) {
    params.append("keyword", filters.keyword);
  }

  params.append("page", String(filters.page || 1));
  params.append("limit", String(filters.limit || 20));

  const response = await fetch(
    `${API_BASE_URL}/get-company-placement-requests.php?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok || data.status === "error") {
    throw new Error(data?.message || "Failed to fetch placement requests");
  }

  return data;
}

export function useCompanyPlacementRequests(
  token: string | null,
  filters: CompanyPlacementRequestFilters = {},
) {
  return useQuery({
    queryKey: ["company-placement-requests", filters],
    queryFn: () => fetchCompanyPlacementRequests(token as string, filters),
    enabled: !!token,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30,
  });
}
