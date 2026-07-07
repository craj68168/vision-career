import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export type DashboardSummary = {
  job_seekers: {
    total: number;
    active: number;
    inactive: number;
    available: number;
    in_process: number;
    joined: number;
  };

  staffs: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  };

  companies: {
    total: number;
    active: number;
    inactive: number;
  };

  vacancies: {
    total: number;
    open: number;
    expired: number;
    total_positions: number;
  };

  applications: {
    total: number;
    pending: number;
    reviewed: number;
    shortlisted: number;
    rejected: number;
    hired: number;
  };

  placement_requests: {
    total: number;
    pending: number;
    reviewing: number;
    in_progress: number;
    closed: number;
    cancelled: number;
    total_requested_positions: number;
  };

  placement_candidates: {
    total: number;
    recommended: number;
    sent_to_company: number;
    interview: number;
    selected: number;
    rejected: number;
    joined: number;
  };

  placements: {
    total: number;
    total_fee_amount: number;
    total_deposit_amount: number;
    total_paid_amount: number;
    not_invoiced: number;
    unpaid: number;
    partial: number;
    paid: number;
  };

  billings: {
    total: number;
    draft: number;
    sent: number;
    paid: number;
    overdue_status: number;
    due: number;
    due_soon: number;
    total_subtotal_amount: number;
    total_tax_amount: number;
    total_billing_amount: number;
    paid_billing_amount: number;
    unpaid_billing_amount: number;
    due_billing_amount: number;
  };

  training: {
    total_categories: number;
    active_categories: number;
    total_topics: number;
    active_topics: number;
    total_files: number;
    active_files: number;
  };
};

export type StatusBreakdown = {
  job_seekers_by_status: Record<string, number>;
  job_seekers_by_placement_status: Record<string, number>;
  staffs_by_status: Record<string, number>;
  companies_by_status: Record<string, number>;
  placement_requests_by_status: Record<string, number>;
  placement_candidates_by_status: Record<string, number>;
  billings_by_status: Record<string, number>;
  applications_by_status: Record<string, number>;
};

export type RecentJobSeeker = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: string | null;
  placement_status: string;
  created_at: string;
};

export type RecentCompany = {
  id: number;
  name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  status: string | null;
  created_at: string;
};

export type RecentPlacementRequest = {
  id: number;
  job_title: string;
  job_category: string | null;
  employment_type: string | null;
  number_of_positions: number;
  work_location: string | null;
  request_status: string;
  created_at: string;
  company_name: string | null;
  company_contact_name: string | null;
};

export type RecentBilling = {
  id: number;
  invoice_number: string;
  billing_status: string;
  total_amount: number;
  currency: string;
  issue_date: string | null;
  due_date: string | null;
  paid_date: string | null;
  created_at: string;
  company_name: string | null;
  job_seeker_name: string | null;
};

export type RecentApplication = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
  created_at: string;
  vacancy_title: string | null;
  company_name: string | null;
};

export type DashboardRecent = {
  job_seekers: RecentJobSeeker[];
  companies: RecentCompany[];
  placement_requests: RecentPlacementRequest[];
  billings: RecentBilling[];
  applications: RecentApplication[];
};

export type MonthlyCount = {
  month: string;
  total: number;
};

export type MonthlyBilling = {
  month: string;
  total_bills: number;
  total_amount: number;
};

export type DashboardCharts = {
  monthly_job_seekers: MonthlyCount[];
  monthly_placement_requests: MonthlyCount[];
  monthly_billings: MonthlyBilling[];
  monthly_applications: MonthlyCount[];
};

export type AdminDashboardData = {
  summary: DashboardSummary;
  status_breakdown: StatusBreakdown;
  recent: DashboardRecent;
  charts: DashboardCharts;
};

export type AdminDashboardResponse = {
  success: boolean;
  message: string;
  data: AdminDashboardData;
};

export function useAdminDashboard() {
  return useQuery<AdminDashboardResponse, Error>({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      return apiRequest<AdminDashboardResponse>("admin-dashboard.php", {
        method: "GET",
      });
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}
