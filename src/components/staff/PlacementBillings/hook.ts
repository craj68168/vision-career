"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getBillingCurrentStaff,
  getStaffPlacementBilling,
  getStaffPlacementBillings,
  issueStaffPlacementBilling,
  markStaffPlacementBillingPaid,
  updateStaffPlacementBilling,
} from "./api";

import type {
  BillingApiError,
  PlacementBilling,
  PlacementBillingStatus,
  UpdatePlacementBillingPayload,
} from "./types";

// ======================================================
// ERROR
// ======================================================

const getErrorMessage = (
  error: unknown,

  fallback: string,
) => {
  if (axios.isAxiosError<BillingApiError>(error)) {
    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

// ======================================================
// HOOK
// ======================================================

export const useStaffPlacementBillings = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | PlacementBillingStatus
  >("ALL");

  const [viewingBillingId, setViewingBillingId] = useState<string | null>(null);

  const [editingBilling, setEditingBilling] = useState<PlacementBilling | null>(
    null,
  );

  // ====================================================
  // CURRENT STAFF
  // ====================================================

  const staffQuery = useQuery({
    queryKey: ["current-staff"],

    queryFn: getBillingCurrentStaff,

    staleTime: 5 * 60 * 1000,

    retry: false,
  });

  const permissions = staffQuery.data?.data.permissions ?? [];

  const canView = permissions.includes("billing:view");

  const canManage = permissions.includes("billing:manage");

  // ====================================================
  // LIST
  // ====================================================

  const listQuery = useQuery({
    queryKey: ["staff-placement-billings"],

    queryFn: getStaffPlacementBillings,

    enabled: staffQuery.isSuccess && canView,

    staleTime: 30_000,

    retry: 1,

    refetchOnWindowFocus: false,
  });

  // ====================================================
  // DETAILS
  // ====================================================

  const detailQuery = useQuery({
    queryKey: ["staff-placement-billing", viewingBillingId],

    queryFn: () => getStaffPlacementBilling(viewingBillingId!),

    enabled: Boolean(viewingBillingId) && canView,

    retry: 1,
  });

  // ====================================================
  // FILTER
  // ====================================================

  const billings = useMemo(() => {
    const data = listQuery.data?.data ?? [];

    const keyword = search.trim().toLowerCase();

    return data.filter((billing) => {
      if (statusFilter !== "ALL" && billing.status !== statusFilter) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return [
        billing.billingId,

        billing.companyName,

        billing.candidateName,

        billing.jobTitle,

        billing.recruitId,

        billing.placementCandidateId,

        billing.providerId,

        billing.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [listQuery.data, search, statusFilter]);

  // ====================================================
  // INVALIDATE
  // ====================================================

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["staff-placement-billings"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["staff-placement-billing"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["staff-dashboard"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["admin-placement-billings"],
      }),
    ]);
  };

  // ====================================================
  // UPDATE
  // ====================================================

  const updateMutation = useMutation({
    mutationFn: ({
      billingId,
      payload,
    }: {
      billingId: string;

      payload: UpdatePlacementBillingPayload;
    }) => updateStaffPlacementBilling(billingId, payload),

    onSuccess: async (response) => {
      toast.success(response.message || "Billing updated.");

      setEditingBilling(null);

      await invalidate();
    },

    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(
          error,

          "Failed to update billing.",
        ),
      );
    },
  });

  // ====================================================
  // ISSUE
  // ====================================================

  const issueMutation = useMutation({
    mutationFn: issueStaffPlacementBilling,

    onSuccess: async (response) => {
      toast.success(response.message || "Billing issued.");

      await invalidate();
    },

    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(
          error,

          "Failed to issue billing.",
        ),
      );
    },
  });

  // ====================================================
  // PAID
  // ====================================================

  const paidMutation = useMutation({
    mutationFn: markStaffPlacementBillingPaid,

    onSuccess: async (response) => {
      toast.success(response.message || "Billing marked as paid.");

      await invalidate();
    },

    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(
          error,

          "Failed to mark billing as paid.",
        ),
      );
    },
  });

  // ====================================================
  // RETURN
  // ====================================================

  return {
    billings,

    summary: listQuery.data?.summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    canView,
    canManage,

    viewingBillingId,

    viewingBilling: detailQuery.data?.data,

    setViewingBillingId,

    editingBilling,
    setEditingBilling,

    isLoading: staffQuery.isLoading || listQuery.isLoading,

    isFetching: listQuery.isFetching,

    isDetailsLoading: detailQuery.isLoading,

    isSaving:
      updateMutation.isPending ||
      issueMutation.isPending ||
      paidMutation.isPending,

    error: listQuery.error
      ? getErrorMessage(
          listQuery.error,

          "Failed to load placement billings.",
        )
      : null,

    refresh: () => listQuery.refetch(),

    updateBilling: (
      billingId: string,

      payload: UpdatePlacementBillingPayload,
    ) =>
      updateMutation.mutate({
        billingId,
        payload,
      }),

    issueBilling: (billingId: string) => issueMutation.mutate(billingId),

    markPaid: (billingId: string) => paidMutation.mutate(billingId),
  };
};
