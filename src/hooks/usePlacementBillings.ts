// hooks/usePlacementBillings.ts

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";

// ============ TYPES ============

export type BillingStatus =
  | "draft"
  | "issued"
  | "sent"
  | "paid"
  | "overdue"
  | "cancelled"
  | "refunded";
export type PaymentStatus =
  | "not_invoiced"
  | "invoiced"
  | "partial"
  | "paid"
  | "overdue"
  | "cancelled"
  | "refunded";
export type SortableColumns =
  | "created_at"
  | "updated_at"
  | "invoice_number"
  | "billing_status"
  | "issue_date"
  | "due_date"
  | "paid_date"
  | "total_amount"
  | "company_name"
  | "candidate_name"
  | "job_title"
  | "placement_date"
  | "joining_date";
export type SortOrder = "asc" | "desc";

export interface PlacementBilling {
  billing_id: number;
  placement_id: number | null;
  placement_request_candidate_id: number | null;
  placement_request_id: number | null;
  company_id: number | null;
  job_seeker_id: number | null;

  invoice_number: string | null;
  billing_status: BillingStatus | null;
  subtotal_amount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  currency: string | null;
  issue_date: string | null;
  due_date: string | null;
  paid_date: string | null;
  billing_admin_note: string | null;
  billing_company_note: string | null;
  created_by_admin_id: number | null;
  billing_created_at: string | null;
  billing_updated_at: string | null;

  placement_date: string | null;
  joining_date: string | null;
  placed_by_staff_id: number | null;
  recruiter_id: number | null;
  fee_amount: number | null;
  placement_invoice_date: string | null;
  placement_payment_due_date: string | null;
  deposit_amount: number;
  paid_amount: number;
  payment_status: PaymentStatus | null;
  placement_notes: string | null;
  placement_created_at: string | null;
  placement_updated_at: string | null;

  candidate_status: string | null;
  recommended_by_staff_id: number | null;
  company_feedback: string | null;
  candidate_admin_note: string | null;
  interview_date: string | null;
  result_date: string | null;

  job_title: string | null;
  job_category: string | null;
  employment_type: string | null;
  number_of_positions: number | null;
  work_location: string | null;
  japanese_level_required: string | null;
  visa_type_required: string | null;
  salary_type: string | null;
  salary_amount: number | null;
  start_date: string | null;
  request_status: string | null;

  company_name: string | null;
  company_contact_name: string | null;
  company_email: string | null;
  company_phone: string | null;
  contact_person: string | null;
  contact_person_phone: string | null;
  contact_person_email: string | null;

  candidate_name: string | null;
  candidate_email: string | null;
  candidate_phone: string | null;
  candidate_address: string | null;
  date_of_birth: string | null;
  gender: string | null;
  nationality: string | null;
  visa_type: string | null;
  visa_expiry_date: string | null;
  japanese_level: string | null;
  desired_job: string | null;
  desired_location: string | null;
  available_from: string | null;
  resume_file: string | null;
  job_seeker_status: string | null;
  job_seeker_placement_status: string | null;
  company_note: string | null;
}

export interface AdminInfo {
  id: number | null;
  name: string | null;
  email: string | null;
  role: string | null;
}

export interface BillingFilters {
  billing_status?: BillingStatus | string | null;
  payment_status?: PaymentStatus | string | null;
  placement_id?: number | null;
  placement_request_candidate_id?: number | null;
  placement_request_id?: number | null;
  company_id?: number | null;
  job_seeker_id?: number | null;
  keyword?: string | null;
  date_from?: string | null; // YYYY-MM-DD
  date_to?: string | null; // YYYY-MM-DD
  sort_by?: SortableColumns | string | null;
  sort_order?: SortOrder | null;
}

export type PlacementBillingsResponse = {
  status: "success" | "error";
  message: string;
  admin: AdminInfo;
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  filters: BillingFilters;
  placement_billings: PlacementBilling[];
};

// ============ HOOK ============

/**
 * Hook to fetch placement billings with filtering, sorting, and pagination
 *
 * @example
 * // Basic usage
 * const { data, isLoading, error } = usePlacementBillings(1, 20);
 *
 * @example
 * // With filters
 * const { data, isLoading, error } = usePlacementBillings(
 *   1,
 *   20,
 *   {
 *     billing_status: 'paid',
 *     keyword: '株式会社',
 *     sort_by: 'total_amount',
 *     sort_order: 'desc'
 *   }
 * );
 */
export const usePlacementBillings = (
  page: number = 1,
  limit: number = 20,
  filters: BillingFilters = {},
) => {
  return useQuery<PlacementBillingsResponse>({
    queryKey: [
      "placement-billings",
      page,
      limit,
      filters.billing_status,
      filters.payment_status,
      filters.placement_id,
      filters.placement_request_candidate_id,
      filters.placement_request_id,
      filters.company_id,
      filters.job_seeker_id,
      filters.keyword,
      filters.date_from,
      filters.date_to,
      filters.sort_by,
      filters.sort_order,
    ],

    queryFn: async () => {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("Admin token not found");
      }

      // Build URL with query parameters
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      // Add filters only if they have a value
      if (filters.billing_status) {
        params.append("billing_status", filters.billing_status);
      }
      if (filters.payment_status) {
        params.append("payment_status", filters.payment_status);
      }
      if (filters.placement_id) {
        params.append("placement_id", String(filters.placement_id));
      }
      if (filters.placement_request_candidate_id) {
        params.append(
          "placement_request_candidate_id",
          String(filters.placement_request_candidate_id),
        );
      }
      if (filters.placement_request_id) {
        params.append(
          "placement_request_id",
          String(filters.placement_request_id),
        );
      }
      if (filters.company_id) {
        params.append("company_id", String(filters.company_id));
      }
      if (filters.job_seeker_id) {
        params.append("job_seeker_id", String(filters.job_seeker_id));
      }
      if (filters.keyword) {
        params.append("keyword", filters.keyword);
      }
      if (filters.date_from) {
        params.append("date_from", filters.date_from);
      }
      if (filters.date_to) {
        params.append("date_to", filters.date_to);
      }
      if (filters.sort_by) {
        params.append("sort_by", filters.sort_by);
      }
      if (filters.sort_order) {
        params.append("sort_order", filters.sort_order);
      }

      const res = await fetch(
        `https://vision-career.co.jp/admin-get-placement-billings.php?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch placement billings");
      }

      if (data?.status === "error") {
        throw new Error(data.message || "Failed to fetch placement billings");
      }

      return data as PlacementBillingsResponse;
    },

    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: true,
  });
};

// ============ HELPER HOOKS ============

/**
 * Hook to fetch a single placement billing by ID
 *
 * @example
 * const { data: billing, isLoading } = usePlacementBilling(123);
 */
export const usePlacementBilling = (
  billingId: number,
  enabled: boolean = true,
) => {
  return useQuery<PlacementBilling>({
    queryKey: ["placement-billing", billingId],

    queryFn: async () => {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("Admin token not found");
      }

      const params = new URLSearchParams({
        placement_id: String(billingId),
        limit: "1",
      });

      const res = await fetch(
        `https://vision-career.co.jp/admin-get-placement-billings.php?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch placement billing");
      }

      if (data?.status === "error") {
        throw new Error(data.message || "Failed to fetch placement billing");
      }

      const billing = data?.placement_billings?.[0];
      if (!billing) {
        throw new Error(`Billing with ID ${billingId} not found`);
      }

      return billing as PlacementBilling;
    },

    enabled: !!billingId && enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const usePlacementBillingsWithPagination = (
  initialPage: number = 1,
  limit: number = 20,
  filters: BillingFilters = {},
) => {
  const [page, setPage] = useState(initialPage);

  const result = usePlacementBillings(page, limit, filters);

  const totalPages = result.data?.pagination?.total_pages || 0;
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const goToNextPage = () => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      setPage(page - 1);
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const resetPage = () => {
    setPage(1);
  };

  return {
    ...result,
    billings: result.data?.placement_billings || [],
    admin: result.data?.admin,
    appliedFilters: result.data?.filters || filters,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: result.data?.pagination?.total || 0,
      limit,
      hasNextPage,
      hasPreviousPage,
    },
    pageControls: {
      goToNextPage,
      goToPreviousPage,
      goToPage,
      resetPage,
      setPage,
    },
  };
};
