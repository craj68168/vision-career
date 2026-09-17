"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveAdminPlacementRequest,
  getAdminPlacementRequest,
  getAdminPlacementRequests,
  rejectAdminPlacementRequest,
} from "./api";

import type {
  ApiError,
  PlacementRequest,
  PlacementRequestStatus,
} from "./types";

export function useAdminPlacementRequests() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | PlacementRequestStatus
  >("ALL");

  const [viewingId, setViewingId] = useState<string | null>(null);

  const [reviewingRequest, setReviewingRequest] =
    useState<PlacementRequest | null>(null);

  const listQuery = useQuery({
    queryKey: ["admin-placement-requests"],

    queryFn: getAdminPlacementRequests,
  });

  const detailQuery = useQuery({
    queryKey: ["admin-placement-request", viewingId],

    queryFn: () => getAdminPlacementRequest(viewingId!),

    enabled: Boolean(viewingId),
  });

  const filteredRequests = useMemo(() => {
    const data = listQuery.data?.data || [];

    const normalized = search.trim().toLowerCase();

    return data.filter((request) => {
      if (statusFilter !== "ALL" && request.status !== statusFilter) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      return [
        request.recruitId,
        request.companyName,
        request.providerName,
        request.jobTitle,
        request.workLocation,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [listQuery.data, search, statusFilter]);

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError<ApiError>(error)) {
      return error.response?.data?.message || "Something went wrong.";
    }

    return "Something went wrong.";
  };

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["admin-placement-requests"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["provider-placement-requests"],
      }),
    ]);
  };

  const approveMutation = useMutation({
    mutationFn: approveAdminPlacementRequest,

    onSuccess: async (response) => {
      toast.success(response.message || "Placement request approved.");

      setReviewingRequest(null);

      await refresh();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({
      recruitId,
      reason,
    }: {
      recruitId: string;
      reason: string;
    }) => rejectAdminPlacementRequest(recruitId, reason),

    onSuccess: async (response) => {
      toast.success(response.message || "Placement request rejected.");

      setReviewingRequest(null);

      await refresh();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    requests: filteredRequests,

    summary: listQuery.data?.summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    viewingRequest: detailQuery.data?.data,

    viewingId,
    setViewingId,

    reviewingRequest,
    setReviewingRequest,

    isLoading: listQuery.isLoading,

    isFetching: listQuery.isFetching,

    isReviewing: approveMutation.isPending || rejectMutation.isPending,

    approve: (recruitId: string) => approveMutation.mutate(recruitId),

    reject: (recruitId: string, reason: string) =>
      rejectMutation.mutate({
        recruitId,
        reason,
      }),

    refresh: listQuery.refetch,
  };
}
