import { useQuery, keepPreviousData } from "@tanstack/react-query";

export type ProviderItem = {
  id: number;
  name?: string;
  email?: string;
  company_name?: string;
  phone?: string;
  address?: string;
  website?: string;
  contactPerson?: string;
  contactPersonPhone?: string;
  contactPersonAddress?: string;
  contactPersonEmail?: string;
  hiringNeeds?: string;
  notes?: string;
  industry?: string;
  status?: string | null;
  statistics: {
    total_vacancies?: number;
    total_applications?: number;
    total_applications_received?: number;
  };
  created_at?: string;
};

export type ProvidersSummary = {
  total_providers: number;
  providers_with_vacancies: number;
  providers_without_vacancies: number;
  total_vacancies_all_providers: number;
  total_applications_all_providers: number;
};

type ProvidersResponse = {
  ok: boolean;
  summary: ProvidersSummary;
  filters_applied?: {
    search?: string | null;
    sort_by?: string | null;
    sort_order?: string | null;
  };
  data: ProviderItem[];
  pagination: {
    page: 1;
    limit: 10;
    total_records: 25;
    total_pages: 3;
    has_next: true;
    has_prev: false;
  };
  message?: string;
};

export const useProviders = (page = 1, limit = 10, search = "") => {
  return useQuery<ProvidersResponse>({
    queryKey: ["providers", page, limit, search],

    queryFn: async () => {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("Admin token not found");
      }

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search.trim()) {
        params.append("search", search.trim());
      }

      const res = await fetch(
        `https://vision-career.co.jp/get_admin_providers.php?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch providers");
      }

      return data;
    },

    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
