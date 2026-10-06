"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useTranslations } from "next-intl";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveStaffPlacementRequest,
  getStaffPlacementRequest,
  getStaffPlacementRequests,
  rejectStaffPlacementRequest,
  screenStaffPlacementRequest,
} from "./api";

import type {
  ApiError,
  PlacementRequestScreeningStatus,
  PlacementRequestStatus,
  ScreenPlacementRequestPayload,
  StaffPlacementRequest,
} from "./types";

// ======================================================
// HOOK
// ======================================================

export function useStaffPlacementRequests() {
  const t = useTranslations("staffPlacementRequests");

  const queryClient = useQueryClient();

  // ====================================================
  // FILTERS
  // ====================================================

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | PlacementRequestStatus
  >("ALL");

  const [screeningFilter, setScreeningFilter] = useState<
    "ALL" | PlacementRequestScreeningStatus
  >("ALL");

  // ====================================================
  // MODALS
  // ====================================================

  const [viewingId, setViewingId] = useState<string | null>(null);

  const [screeningRequest, setScreeningRequest] =
    useState<StaffPlacementRequest | null>(null);

  const [decisionRequest, setDecisionRequest] =
    useState<StaffPlacementRequest | null>(null);

  // ====================================================
  // ERROR
  // ====================================================

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (!axios.isAxiosError<ApiError>(error)) {
      return fallback;
    }

    if (!error.response) {
      return t("messages.network");
    }

    switch (error.response.status) {
      case 400:
      case 422:
        return t("messages.invalid");

      case 401:
        return t("messages.unauthorized");

      case 403:
        return t("messages.forbidden");

      case 404:
        return t("messages.notFound");

      case 409:
        return t("messages.conflict");

      case 429:
        return t("messages.rateLimit");

      default:
        return error.response.status >= 500 ? t("messages.server") : fallback;
    }
  };

  // ====================================================
  // LIST
  // ====================================================

  const listQuery = useQuery({
    queryKey: ["staff-placement-requests"],

    queryFn: getStaffPlacementRequests,

    staleTime: 30_000,

    retry: 1,

    refetchOnWindowFocus: false,
  });

  // ====================================================
  // DETAILS
  // ====================================================

  const detailQuery = useQuery({
    queryKey: ["staff-placement-request", viewingId],

    queryFn: () => getStaffPlacementRequest(viewingId!),

    enabled: Boolean(viewingId),

    retry: 1,
  });

  // ====================================================
  // INVALIDATE
  // ====================================================

  const invalidatePlacementRequestQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["staff-placement-requests"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["staff-placement-request"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["staff-dashboard"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["admin-placement-requests"],
      }),
    ]);
  };

  // ====================================================
  // FILTER
  // ====================================================

  const requests = useMemo(() => {
    const data = listQuery.data?.data ?? [];

    const keyword = search.trim().toLowerCase();

    return data.filter((request) => {
      if (statusFilter !== "ALL" && request.status !== statusFilter) {
        return false;
      }

      if (
        screeningFilter !== "ALL" &&
        request.staffScreening.status !== screeningFilter
      ) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return [
        request.recruitId,
        request.companyName,
        request.providerName,
        request.providerEmail,
        request.jobTitle,
        request.jobCategory,
        request.employmentType,
        request.workLocation,
        request.status,
        request.staffScreening.status,
        request.staffScreening.note,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [listQuery.data, search, statusFilter, screeningFilter]);

  // ====================================================
  // SCREEN
  // ====================================================

  const screeningMutation = useMutation({
    mutationFn: ({
      recruitId,
      payload,
    }: {
      recruitId: string;

      payload: ScreenPlacementRequestPayload;
    }) => screenStaffPlacementRequest(recruitId, payload),

    onSuccess: async () => {
      toast.success(t("messages.screeningSaved"));

      setScreeningRequest(null);

      await invalidatePlacementRequestQueries();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t("messages.screeningFailed")));
    },
  });

  // ====================================================
  // APPROVE
  // ====================================================

  const approveMutation = useMutation({
    mutationFn: approveStaffPlacementRequest,

    onSuccess: async () => {
      toast.success(t("messages.approved"));

      setDecisionRequest(null);

      setViewingId(null);

      await invalidatePlacementRequestQueries();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t("messages.approvalFailed")));
    },
  });

  // ====================================================
  // REJECT
  // ====================================================

  const rejectMutation = useMutation({
    mutationFn: ({
      recruitId,
      reason,
    }: {
      recruitId: string;

      reason: string;
    }) =>
      rejectStaffPlacementRequest(recruitId, {
        reason,
      }),

    onSuccess: async () => {
      toast.success(t("messages.rejected"));

      setDecisionRequest(null);

      setViewingId(null);

      await invalidatePlacementRequestQueries();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t("messages.approvalFailed")));
    },
  });

  // ====================================================
  // RETURN
  // ====================================================

  return {
    requests,

    summary: listQuery.data?.summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    screeningFilter,
    setScreeningFilter,

    viewingRequest: detailQuery.data?.data,

    viewingId,
    setViewingId,

    isDetailsLoading: detailQuery.isLoading,

    screeningRequest,
    setScreeningRequest,

    decisionRequest,
    setDecisionRequest,

    isScreening: screeningMutation.isPending,

    isApproving: approveMutation.isPending,

    isRejecting: rejectMutation.isPending,

    submitScreening: (
      recruitId: string,
      payload: ScreenPlacementRequestPayload,
    ) =>
      screeningMutation.mutate({
        recruitId,
        payload,
      }),

    approveRequest: (recruitId: string) => {
      approveMutation.mutate(recruitId);
    },

    rejectRequest: (recruitId: string, reason: string) => {
      rejectMutation.mutate({
        recruitId,
        reason,
      });
    },

    isLoading: listQuery.isLoading,

    isFetching: listQuery.isFetching,

    refresh: () => listQuery.refetch(),
  };
}
