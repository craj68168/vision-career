"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  cancelPlacementBilling,
  getPlacementBillings,
  issuePlacementBilling,
  markPlacementBillingPaid,
  refundPlacementBilling,
  updatePlacementBilling,
} from "./api";

import type {
  ApiErrorResponse,
  PlacementBilling,
  PlacementBillingStatus,
  RefundPlacementBillingPayload,
  UpdatePlacementBillingPayload,
} from "./types";

// ======================================================
// QUERY KEYS
// ======================================================

const PLACEMENT_BILLINGS_QUERY_KEY = ["admin-placement-billings"] as const;

// ======================================================
// HOOK
// ======================================================

export const usePlacementBillings = () => {
  const queryClient = useQueryClient();

  // ====================================================
  // FILTERS
  // ====================================================

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | PlacementBillingStatus
  >("ALL");

  // ====================================================
  // MODALS
  // ====================================================

  const [viewingBilling, setViewingBilling] = useState<PlacementBilling | null>(
    null,
  );

  const [editingBilling, setEditingBilling] = useState<PlacementBilling | null>(
    null,
  );

  const [refundingBilling, setRefundingBilling] =
    useState<PlacementBilling | null>(null);

  // ====================================================
  // GET BILLINGS
  // ====================================================

  const billingQuery = useQuery({
    queryKey: PLACEMENT_BILLINGS_QUERY_KEY,

    queryFn: getPlacementBillings,
  });

  // ====================================================
  // ERROR MESSAGE
  // ====================================================

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      return error.response?.data?.message || "Something went wrong.";
    }

    return "Something went wrong.";
  };

  // ====================================================
  // INVALIDATE
  // ====================================================

  const invalidateBillingQueries = async () => {
    await queryClient.invalidateQueries({
      queryKey: PLACEMENT_BILLINGS_QUERY_KEY,
    });

    await queryClient.invalidateQueries({
      queryKey: ["admin-dashboard"],
    });
  };

  // ====================================================
  // UPDATE CURRENT VIEW IF OPEN
  // ====================================================

  const syncViewingBilling = (updatedBilling: PlacementBilling) => {
    setViewingBilling((current) => {
      if (!current) {
        return current;
      }

      if (current.billingId !== updatedBilling.billingId) {
        return current;
      }

      return updatedBilling;
    });
  };

  // ====================================================
  // UPDATE DRAFT BILLING
  // ====================================================

  const updateMutation = useMutation({
    mutationFn: ({
      billingId,
      payload,
    }: {
      billingId: string;

      payload: UpdatePlacementBillingPayload;
    }) => updatePlacementBilling(billingId, payload),

    onSuccess: async (response) => {
      toast.success(response.message || "Billing updated successfully.");

      syncViewingBilling(response.data);

      setEditingBilling(null);

      await invalidateBillingQueries();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  // ====================================================
  // ISSUE BILLING
  // ====================================================

  const issueMutation = useMutation({
    mutationFn: issuePlacementBilling,

    onSuccess: async (response) => {
      toast.success(response.message || "Billing issued successfully.");

      syncViewingBilling(response.data);

      await invalidateBillingQueries();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  // ====================================================
  // MARK PAID
  // ====================================================

  const paidMutation = useMutation({
    mutationFn: markPlacementBillingPaid,

    onSuccess: async (response) => {
      toast.success(response.message || "Billing marked as paid.");

      syncViewingBilling(response.data);

      await invalidateBillingQueries();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  // ====================================================
  // CANCEL BILLING
  // ====================================================

  const cancelMutation = useMutation({
    mutationFn: ({
      billingId,
      reason,
    }: {
      billingId: string;

      reason: string;
    }) => cancelPlacementBilling(billingId, reason),

    onSuccess: async (response) => {
      toast.success(response.message || "Billing cancelled.");

      syncViewingBilling(response.data);

      await invalidateBillingQueries();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  // ====================================================
  // REFUND
  // ====================================================

  const refundMutation = useMutation({
    mutationFn: ({
      billingId,
      payload,
    }: {
      billingId: string;

      payload: RefundPlacementBillingPayload;
    }) => refundPlacementBilling(billingId, payload),

    onSuccess: async (response) => {
      toast.success(response.message || "Refund processed successfully.");

      syncViewingBilling(response.data);

      setRefundingBilling(null);

      await invalidateBillingQueries();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  // ====================================================
  // DATA
  // ====================================================

  const billings = billingQuery.data?.data ?? [];

  const summary = billingQuery.data?.summary;

  // ====================================================
  // FILTER
  // ====================================================

  const filteredBillings = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return billings.filter((billing) => {
      // =============================================
      // STATUS FILTER
      // =============================================

      if (statusFilter !== "ALL" && billing.status !== statusFilter) {
        return false;
      }

      // =============================================
      // SEARCH
      // =============================================

      if (!keyword) {
        return true;
      }

      const searchableText = [
        billing.billingId,
        billing.companyName,
        billing.candidateName,
        billing.jobTitle,
        billing.recruitId,
        billing.placementCandidateId,
        billing.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [billings, search, statusFilter]);

  // ====================================================
  // LOADING STATES
  // ====================================================

  const isSaving =
    updateMutation.isPending ||
    issueMutation.isPending ||
    paidMutation.isPending ||
    cancelMutation.isPending ||
    refundMutation.isPending;

  // ====================================================
  // REFRESH
  // ====================================================

  const refresh = async () => {
    await billingQuery.refetch();
  };

  // ====================================================
  // ACTIONS
  // ====================================================

  const updateBilling = (
    billingId: string,
    payload: UpdatePlacementBillingPayload,
  ) => {
    updateMutation.mutate({
      billingId,
      payload,
    });
  };

  const issueBilling = (billingId: string) => {
    issueMutation.mutate(billingId);
  };

  const markPaid = (billingId: string) => {
    paidMutation.mutate(billingId);
  };

  const cancelBilling = (billingId: string, reason: string) => {
    cancelMutation.mutate({
      billingId,
      reason,
    });
  };

  const refundBilling = (
    billingId: string,
    payload: RefundPlacementBillingPayload,
  ) => {
    refundMutation.mutate({
      billingId,
      payload,
    });
  };

  // ====================================================
  // RETURN
  // ====================================================

  return {
    // DATA
    billings: filteredBillings,

    summary,

    // FILTERS
    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    // VIEW MODAL
    viewingBilling,
    setViewingBilling,

    // EDIT MODAL
    editingBilling,
    setEditingBilling,

    // REFUND MODAL
    refundingBilling,
    setRefundingBilling,

    // STATES
    isLoading: billingQuery.isLoading,

    isFetching: billingQuery.isFetching,

    isSaving,

    isRefunding: refundMutation.isPending,

    // ACTIONS
    refresh,

    updateBilling,

    issueBilling,

    markPaid,

    cancelBilling,

    refundBilling,
  };
};
