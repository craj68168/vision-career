"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveAdminPlacementRequest,
  getAdminPlacementRequest,
  getAdminPlacementRequests,
  getEligiblePlacementSeekers,
  getMatchedPlacementCandidates,
  matchPlacementCandidate,
  rejectAdminPlacementRequest,
} from "./api";

import type {
  ApiError,
  PlacementRequest,
  PlacementRequestStatus,
} from "./types";

// ======================================================
// HOOK
// ======================================================

export function useAdminPlacementRequests() {
  const queryClient = useQueryClient();

  // ====================================================
  // SEARCH / FILTER
  // ====================================================

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | PlacementRequestStatus
  >("ALL");

  // ====================================================
  // VIEW REQUEST
  // ====================================================

  const [viewingId, setViewingId] = useState<string | null>(null);

  // ====================================================
  // REVIEW REQUEST
  // ====================================================

  const [reviewingRequest, setReviewingRequest] =
    useState<PlacementRequest | null>(null);

  // ====================================================
  // CANDIDATE MANAGEMENT
  // ====================================================

  const [candidateRequest, setCandidateRequest] =
    useState<PlacementRequest | null>(null);

  // ====================================================
  // LIST
  // ====================================================

  const listQuery = useQuery({
    queryKey: ["admin-placement-requests"],

    queryFn: getAdminPlacementRequests,
  });

  // ====================================================
  // DETAILS
  // ====================================================

  const detailQuery = useQuery({
    queryKey: ["admin-placement-request", viewingId],

    queryFn: () => getAdminPlacementRequest(viewingId!),

    enabled: Boolean(viewingId),
  });

  // ====================================================
  // ELIGIBLE SEEKERS
  // ====================================================

  const eligibleQuery = useQuery({
    queryKey: ["admin-placement-eligible-seekers", candidateRequest?.recruitId],

    queryFn: () => getEligiblePlacementSeekers(candidateRequest!.recruitId),

    enabled: Boolean(candidateRequest?.recruitId),
  });

  // ====================================================
  // MATCHED CANDIDATES
  // ====================================================

  const candidatesQuery = useQuery({
    queryKey: [
      "admin-placement-matched-candidates",
      candidateRequest?.recruitId,
    ],

    queryFn: () => getMatchedPlacementCandidates(candidateRequest!.recruitId),

    enabled: Boolean(candidateRequest?.recruitId),
  });

  // ====================================================
  // FILTER
  // ====================================================

  const filteredRequests = useMemo(() => {
    const data = listQuery.data?.data ?? [];

    const keyword = search.trim().toLowerCase();

    return data.filter((request) => {
      if (statusFilter !== "ALL" && request.status !== statusFilter) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return [
        request.recruitId,
        request.companyName,
        request.providerName,
        request.jobTitle,
        request.workLocation,
        request.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [listQuery.data, search, statusFilter]);

  // ====================================================
  // ERROR HELPER
  // ====================================================

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError<ApiError>(error)) {
      return error.response?.data?.message || "Something went wrong.";
    }

    return "Something went wrong.";
  };

  // ====================================================
  // INVALIDATE PLACEMENT REQUESTS
  // ====================================================

  const refreshRequests = async () => {
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

  // ====================================================
  // APPROVE
  // ====================================================

  const approveMutation = useMutation({
    mutationFn: approveAdminPlacementRequest,

    onSuccess: async (response) => {
      toast.success(response.message || "Placement request approved.");

      setReviewingRequest(null);

      await refreshRequests();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
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
    }) => rejectAdminPlacementRequest(recruitId, reason),

    onSuccess: async (response) => {
      toast.success(response.message || "Placement request rejected.");

      setReviewingRequest(null);

      await refreshRequests();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  // ====================================================
  // MATCH CANDIDATE
  // ====================================================

  const matchCandidateMutation = useMutation({
    mutationFn: ({
      recruitId,
      seekerId,
    }: {
      recruitId: string;
      seekerId: string;
    }) => matchPlacementCandidate(recruitId, seekerId),

    onSuccess: async (response) => {
      toast.success(response.message || "Candidate matched successfully.");

      if (!candidateRequest) {
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            "admin-placement-eligible-seekers",
            candidateRequest.recruitId,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "admin-placement-matched-candidates",
            candidateRequest.recruitId,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: ["provider-placement-candidates"],
        }),
      ]);
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  // ====================================================
  // CANDIDATE MODAL
  // ====================================================

  const openCandidates = (request: PlacementRequest) => {
    if (request.status !== "approved") {
      toast.error("Only approved placement requests can manage candidates.");

      return;
    }

    setCandidateRequest(request);
  };

  const closeCandidates = () => {
    setCandidateRequest(null);
  };

  const handleMatchCandidate = (seekerId: string) => {
    if (!candidateRequest) {
      return;
    }

    matchCandidateMutation.mutate({
      recruitId: candidateRequest.recruitId,

      seekerId,
    });
  };

  // ====================================================
  // RETURN
  // ====================================================

  return {
    // REQUESTS

    requests: filteredRequests,

    summary: listQuery.data?.summary,

    // SEARCH

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    // VIEW

    viewingRequest: detailQuery.data?.data,

    viewingId,
    setViewingId,

    // REVIEW

    reviewingRequest,
    setReviewingRequest,

    // CANDIDATES

    candidateRequest,

    openCandidates,
    closeCandidates,

    eligibleSeekers: eligibleQuery.data?.data ?? [],

    matchedCandidates: candidatesQuery.data?.data ?? [],

    candidateRecruit: eligibleQuery.data?.recruit,

    candidatesLoading: eligibleQuery.isLoading || candidatesQuery.isLoading,

    candidatesFetching: eligibleQuery.isFetching || candidatesQuery.isFetching,

    candidateError: eligibleQuery.error || candidatesQuery.error,

    matchingSeekerId: matchCandidateMutation.variables?.seekerId ?? null,

    isMatchingCandidate: matchCandidateMutation.isPending,

    handleMatchCandidate,

    refreshCandidates: async () => {
      await Promise.all([eligibleQuery.refetch(), candidatesQuery.refetch()]);
    },

    // PAGE STATE

    isLoading: listQuery.isLoading,

    isFetching: listQuery.isFetching,

    isReviewing: approveMutation.isPending || rejectMutation.isPending,

    // ACTIONS

    approve: (recruitId: string) => {
      approveMutation.mutate(recruitId);
    },

    reject: (recruitId: string, reason: string) => {
      rejectMutation.mutate({
        recruitId,
        reason,
      });
    },

    refresh: listQuery.refetch,
  };
}
