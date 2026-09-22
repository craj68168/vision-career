"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getStaffProviderById,
  getStaffProviders,
  reviewStaffProvider,
} from "./api";

import type {
  ProviderApiError,
  ProviderReviewStatus,
  ProviderStatus,
  ReviewProviderPayload,
  StaffProvider,
} from "./types";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ProviderApiError>(error)) {
    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export function useStaffProviders() {
  const queryClient = useQueryClient();

  // ====================================================
  // FILTERS
  // ====================================================

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<"ALL" | ProviderStatus>(
    "ALL",
  );

  const [reviewFilter, setReviewFilter] = useState<
    "ALL" | ProviderReviewStatus
  >("ALL");

  // ====================================================
  // MODALS
  // ====================================================

  const [viewingProviderId, setViewingProviderId] = useState<string | null>(
    null,
  );

  const [reviewingProvider, setReviewingProvider] =
    useState<StaffProvider | null>(null);

  // ====================================================
  // QUERIES
  // ====================================================

  const providersQuery = useQuery({
    queryKey: ["staff-providers"],

    queryFn: getStaffProviders,

    staleTime: 30_000,

    refetchOnWindowFocus: false,

    retry: 1,
  });

  const detailsQuery = useQuery({
    queryKey: ["staff-provider-details", viewingProviderId],

    queryFn: () => getStaffProviderById(viewingProviderId!),

    enabled: Boolean(viewingProviderId),

    retry: 1,
  });

  // ====================================================
  // FILTER
  // ====================================================

  const providers = useMemo(() => {
    const items = providersQuery.data?.data || [];

    const keyword = search.trim().toLowerCase();

    return items.filter((provider) => {
      if (statusFilter !== "ALL" && provider.status !== statusFilter) {
        return false;
      }

      if (
        reviewFilter !== "ALL" &&
        provider.staffReview.status !== reviewFilter
      ) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return [
        provider.registerId,
        provider.name,
        provider.companyName,
        provider.email,
        provider.phone,
        provider.industry,
        provider.address,
        provider.contactPerson,
        provider.staffReview.status,
        provider.staffReview.note,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [providersQuery.data, search, statusFilter, reviewFilter]);

  // ====================================================
  // REVIEW
  // ====================================================

  const reviewMutation = useMutation({
    mutationFn: ({
      registerId,
      payload,
    }: {
      registerId: string;

      payload: ReviewProviderPayload;
    }) => reviewStaffProvider(registerId, payload),

    onSuccess: async (response) => {
      toast.success(response.message || "Client review saved.");

      setReviewingProvider(null);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["staff-providers"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["staff-provider-details"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["staff-dashboard"],
        }),
      ]);
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to save client review."));
    },
  });

  return {
    providers,

    summary: providersQuery.data?.summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    reviewFilter,
    setReviewFilter,

    viewingProvider: detailsQuery.data?.data,

    viewingProviderId,

    reviewingProvider,

    isLoading: providersQuery.isLoading,

    isFetching: providersQuery.isFetching,

    isDetailsLoading: detailsQuery.isLoading,

    isReviewing: reviewMutation.isPending,

    openView: (registerId: string) => setViewingProviderId(registerId),

    closeView: () => setViewingProviderId(null),

    openReview: (provider: StaffProvider) => setReviewingProvider(provider),

    closeReview: () => setReviewingProvider(null),

    submitReview: (registerId: string, payload: ReviewProviderPayload) =>
      reviewMutation.mutate({
        registerId,
        payload,
      }),

    refetch: () => providersQuery.refetch(),
  };
}
