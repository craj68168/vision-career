"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getStaffPlacementRequest,
  getStaffPlacementRequests,
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
// ERROR
// ======================================================

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiError>(error)) {
    return error.response?.data?.message || "Something went wrong.";
  }

  return "Something went wrong.";
};

// ======================================================
// HOOK
// ======================================================

export function useStaffPlacementRequests() {
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
  // SCREEN MUTATION
  // ====================================================

  const screeningMutation = useMutation({
    mutationFn: ({
      recruitId,
      payload,
    }: {
      recruitId: string;

      payload: ScreenPlacementRequestPayload;
    }) => screenStaffPlacementRequest(recruitId, payload),

    onSuccess: async (response) => {
      toast.success(response.message || "Placement request screening saved.");

      setScreeningRequest(null);

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
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    requests,

    summary: listQuery.data?.summary,

    // FILTERS

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    screeningFilter,
    setScreeningFilter,

    // DETAILS

    viewingRequest: detailQuery.data?.data,

    viewingId,

    setViewingId,

    isDetailsLoading: detailQuery.isLoading,

    // SCREENING

    screeningRequest,

    setScreeningRequest,

    isScreening: screeningMutation.isPending,

    submitScreening: (
      recruitId: string,
      payload: ScreenPlacementRequestPayload,
    ) =>
      screeningMutation.mutate({
        recruitId,
        payload,
      }),

    // STATE

    isLoading: listQuery.isLoading,

    isFetching: listQuery.isFetching,

    // REFRESH

    refresh: () => listQuery.refetch(),
  };
}
