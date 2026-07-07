import { useQuery, keepPreviousData } from "@tanstack/react-query";

export type JobSeekerItem = {
  id: number;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  location?: string;
  status?: string;
  dateOfBirth: string | null;
  gender?: string;
  nationality?: string;
  visaType?: string;
  visaExpiryDate: string | null;
  japaneseLevel?: string;
  desiredJob?: string;
  desiredLocation?: string;
  availableFrom: string | null;
  resumeFile?: string;
  notes?: string;
  placementStatus?: string;
  is_active?: boolean | number;
  created_at: string | null;
  updated_at: string | null;
  statistics?: {
    total_applications?: number;
    total_applications_submitted?: number;
    pending_applications?: number;
    shortlisted_applications?: number;
    hired_applications?: number;
    rejected_applications?: number;
  };
};

export type SeekersSummary = {
  total_job_seekers: number;
  active_job_seekers: number;
  inactive_job_seekers: number;
  total_applications_submitted: number;
  applications_by_status: {
    pending: number;
    shortlisted: number;
    hired: number;
    rejected: number;
  };
  total_locations: number;
};

type TopLocation = {
  location?: string;
  name?: string;
  total?: number;
  count?: number;
};

type SeekersResponse = {
  ok: boolean;
  summary: SeekersSummary;
  top_locations?: TopLocation[];
  filters_applied?: {
    search?: string | null;
    sort_by?: string | null;
    sort_order?: string | null;
  };
  data: JobSeekerItem[];
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

export const useSeekers = (page = 1, limit = 10, search = "") => {
  return useQuery<SeekersResponse>({
    queryKey: ["seekers", page, limit, search],

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
        `https://vision-career.co.jp/get_admin_seekers.php?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch job seekers");
      }

      return data;
    },

    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
