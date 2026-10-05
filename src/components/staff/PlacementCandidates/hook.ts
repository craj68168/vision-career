"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useTranslations } from "next-intl";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getStaffPlacementCandidate,
  getStaffPlacementCandidates,
  reviewStaffPlacementCandidate,
} from "./api";

import type {
  CandidateApiError,
  CandidateStaffReviewStatus,
  PlacementCandidateStatus,
  ReviewCandidatePayload,
  StaffPlacementCandidate,
} from "./types";

// ======================================================
// HOOK
// ======================================================

export function useStaffPlacementCandidates() {
  const t = useTranslations("staffPlacementCandidates");

  const queryClient = useQueryClient();

  // ====================================================
  // FILTERS
  // ====================================================

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | PlacementCandidateStatus
  >("ALL");

  const [reviewFilter, setReviewFilter] = useState<
    "ALL" | CandidateStaffReviewStatus
  >("ALL");

  // ====================================================
  // MODALS
  // ====================================================

  const [viewingId, setViewingId] = useState<string | null>(null);

  const [reviewingCandidate, setReviewingCandidate] =
    useState<StaffPlacementCandidate | null>(null);

  // ====================================================
  // ERROR
  // ====================================================

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError<CandidateApiError>(error)) {
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

        case 500:
        case 502:
        case 503:
        case 504:
          return t("messages.server");

        default:
          return error.response.data?.message || fallback;
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  };

  // ====================================================
  // LIST
  // ====================================================

  const listQuery = useQuery({
    queryKey: ["staff-placement-candidates"],

    queryFn: getStaffPlacementCandidates,

    staleTime: 30_000,

    retry: 1,

    refetchOnWindowFocus: false,
  });

  // ====================================================
  // DETAILS
  // ====================================================

  const detailQuery = useQuery({
    queryKey: ["staff-placement-candidate", viewingId],

    queryFn: () => getStaffPlacementCandidate(viewingId!),

    enabled: Boolean(viewingId),

    retry: 1,
  });

  // ====================================================
  // FILTER
  // ====================================================

  const candidates = useMemo(() => {
    const data = listQuery.data?.data ?? [];

    const keyword = search.trim().toLowerCase();

    return data.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) {
        return false;
      }

      if (reviewFilter !== "ALL" && item.staffReview.status !== reviewFilter) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return [
        item.placementCandidateId,
        item.recruitId,
        item.seekerId,

        item.candidate.name,
        item.candidate.nationality,
        item.candidate.current_location,
        item.candidate.visa_type,
        item.candidate.japanese_level,
        item.candidate.desired_job,
        item.candidate.desired_location,

        ...(item.candidate.skills || []),

        item.request?.jobTitle,
        item.request?.jobCategory,
        item.request?.workLocation,

        item.provider?.name,
        item.provider?.companyName,

        item.status,

        item.staffReview.status,

        item.staffReview.note,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [listQuery.data, search, statusFilter, reviewFilter]);

  // ====================================================
  // REVIEW
  // ====================================================

  const reviewMutation = useMutation({
    mutationFn: ({
      placementCandidateId,
      payload,
    }: {
      placementCandidateId: string;

      payload: ReviewCandidatePayload;
    }) => reviewStaffPlacementCandidate(placementCandidateId, payload),

    onSuccess: async (response) => {
      if (response.data.staffReview.status === "NEEDS_ATTENTION") {
        toast.success(t("messages.attentionSaved"));
      } else {
        toast.success(t("messages.reviewSaved"));
      }

      setReviewingCandidate(null);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["staff-placement-candidates"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["staff-placement-candidate"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["staff-dashboard"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["admin-placement-matched-candidates"],
        }),
      ]);
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t("messages.reviewFailed")));
    },
  });

  // ====================================================
  // RETURN
  // ====================================================

  return {
    // DATA

    candidates,

    summary: listQuery.data?.summary,

    // FILTERS

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    reviewFilter,
    setReviewFilter,

    // VIEW

    viewingId,

    viewingCandidate: detailQuery.data?.data,

    setViewingId,

    // REVIEW

    reviewingCandidate,

    setReviewingCandidate,

    isReviewing: reviewMutation.isPending,

    submitReview: (
      placementCandidateId: string,
      payload: ReviewCandidatePayload,
    ) => {
      reviewMutation.mutate({
        placementCandidateId,
        payload,
      });
    },

    // STATE

    isLoading: listQuery.isLoading,

    isFetching: listQuery.isFetching,

    isDetailsLoading: detailQuery.isLoading,

    error: listQuery.error
      ? getErrorMessage(listQuery.error, t("messages.loadFailed"))
      : null,

    // REFRESH

    refresh: () => listQuery.refetch(),
  };
}
