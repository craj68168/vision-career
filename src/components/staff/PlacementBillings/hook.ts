"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useTranslations } from "next-intl";

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
// HOOK
// ======================================================

export const useStaffPlacementBillings = () => {
  const t = useTranslations("staffPlacementBillings");

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

  const [viewingBillingId, setViewingBillingId] = useState<string | null>(null);

  const [editingBilling, setEditingBilling] = useState<PlacementBilling | null>(
    null,
  );

  const [issuingBilling, setIssuingBilling] = useState<PlacementBilling | null>(
    null,
  );

  const [payingBilling, setPayingBilling] = useState<PlacementBilling | null>(
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
  // ERROR
  // ====================================================

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError<BillingApiError>(error)) {
      if (!error.response) {
        return t("messages.network");
      }

      return error.response.data?.message || fallback;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  };

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
        billing.invoiceNumber,
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

    onSuccess: async () => {
      toast.success(t("messages.updated"));

      setEditingBilling(null);

      await invalidate();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t("messages.updateFailed")));
    },
  });

  // ====================================================
  // ISSUE
  // ====================================================

  const issueMutation = useMutation({
    mutationFn: issueStaffPlacementBilling,

    onSuccess: async () => {
      toast.success(t("messages.issued"));

      setIssuingBilling(null);

      await invalidate();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t("messages.issueFailed")));
    },
  });

  // ====================================================
  // MARK PAID
  // ====================================================

  const paidMutation = useMutation({
    mutationFn: markStaffPlacementBillingPaid,

    onSuccess: async () => {
      toast.success(t("messages.markedPaid"));

      setPayingBilling(null);

      await invalidate();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t("messages.paidFailed")));
    },
  });

  // ====================================================
  // RETURN
  // ====================================================

  return {
    billings,

    summary: listQuery.data?.summary,

    // FILTERS

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    // PERMISSIONS

    canView,
    canManage,

    // DETAILS

    viewingBillingId,

    viewingBilling: detailQuery.data?.data,

    setViewingBillingId,

    // EDIT

    editingBilling,
    setEditingBilling,

    // ISSUE

    issuingBilling,
    setIssuingBilling,

    // PAYMENT

    payingBilling,
    setPayingBilling,

    // STATE

    isLoading: staffQuery.isLoading || listQuery.isLoading,

    isFetching: listQuery.isFetching,

    isDetailsLoading: detailQuery.isLoading,

    isUpdating: updateMutation.isPending,

    isIssuing: issueMutation.isPending,

    isMarkingPaid: paidMutation.isPending,

    isSaving:
      updateMutation.isPending ||
      issueMutation.isPending ||
      paidMutation.isPending,

    error: listQuery.error
      ? getErrorMessage(listQuery.error, t("messages.loadFailed"))
      : null,

    // REFRESH

    refresh: () => listQuery.refetch(),

    // ACTIONS

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
