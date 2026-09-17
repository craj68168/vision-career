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
  updatePlacementBilling,
} from "./api";

import type {
  ApiErrorResponse,
  PlacementBilling,
  PlacementBillingStatus,
  UpdatePlacementBillingPayload,
} from "./types";

export const usePlacementBillings = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | PlacementBillingStatus
  >("ALL");

  const [viewingBilling, setViewingBilling] = useState<PlacementBilling | null>(
    null,
  );

  const [editingBilling, setEditingBilling] = useState<PlacementBilling | null>(
    null,
  );

  const query = useQuery({
    queryKey: ["admin-placement-billings"],

    queryFn: getPlacementBillings,
  });

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      return error.response?.data?.message || "Something went wrong.";
    }

    return "Something went wrong.";
  };

  const refresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["admin-placement-billings"],
    });
  };

  const updateMutation = useMutation({
    mutationFn: ({
      billingId,
      payload,
    }: {
      billingId: string;
      payload: UpdatePlacementBillingPayload;
    }) => updatePlacementBilling(billingId, payload),

    onSuccess: async (response) => {
      toast.success(response.message || "Billing updated.");

      setEditingBilling(null);

      await refresh();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  const issueMutation = useMutation({
    mutationFn: issuePlacementBilling,

    onSuccess: async (response) => {
      toast.success(response.message || "Billing issued.");

      await refresh();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  const paidMutation = useMutation({
    mutationFn: markPlacementBillingPaid,

    onSuccess: async (response) => {
      toast.success(response.message || "Billing marked paid.");

      await refresh();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

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

      await refresh();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  const billings = query.data?.data ?? [];

  const filteredBillings = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return billings.filter((billing) => {
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
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [billings, search, statusFilter]);

  return {
    billings: filteredBillings,

    summary: query.data?.summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    viewingBilling,
    setViewingBilling,

    editingBilling,
    setEditingBilling,

    isLoading: query.isLoading,

    isFetching: query.isFetching,

    isSaving:
      updateMutation.isPending ||
      issueMutation.isPending ||
      paidMutation.isPending ||
      cancelMutation.isPending,

    refresh: query.refetch,

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

    cancelBilling: (billingId: string, reason: string) =>
      cancelMutation.mutate({
        billingId,
        reason,
      }),
  };
};
