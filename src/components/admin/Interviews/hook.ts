"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAdminInterviewById,
  getAdminInterviews,
  updateAdminInterview,
} from "./api";

import type {
  AdminInterview,
  AdminInterviewMethodFilter,
  AdminInterviewStatusFilter,
  ApiErrorResponse,
  UpdateAdminInterviewPayload,
} from "./types";

// ======================================================
// QUERY KEYS
// ======================================================

const ADMIN_INTERVIEWS_QUERY_KEY = ["admin-interviews"];

const ADMIN_INTERVIEW_DETAILS_QUERY_KEY = ["admin-interview-details"];

// ======================================================
// HOOK
// ======================================================

export const useAdminInterviews = () => {
  const queryClient = useQueryClient();

  // ==================================================
  // FILTER STATE
  // ==================================================

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<AdminInterviewStatusFilter>("ALL");

  const [methodFilter, setMethodFilter] =
    useState<AdminInterviewMethodFilter>("ALL");

  // ==================================================
  // MODAL STATE
  // ==================================================

  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(
    null,
  );

  const [editingInterview, setEditingInterview] =
    useState<AdminInterview | null>(null);

  // ==================================================
  // LIST
  // ==================================================

  const interviewsQuery = useQuery({
    queryKey: ADMIN_INTERVIEWS_QUERY_KEY,

    queryFn: getAdminInterviews,

    staleTime: 1000 * 30,

    refetchOnWindowFocus: false,

    retry: 1,
  });

  // ==================================================
  // DETAILS
  // ==================================================

  const detailsQuery = useQuery({
    queryKey: [...ADMIN_INTERVIEW_DETAILS_QUERY_KEY, selectedInterviewId],

    queryFn: () => getAdminInterviewById(selectedInterviewId!),

    enabled: Boolean(selectedInterviewId),

    retry: 1,
  });

  // ==================================================
  // FILTER
  // ==================================================

  const filteredInterviews = useMemo(() => {
    const interviews = interviewsQuery.data?.data || [];

    const keyword = search.trim().toLowerCase();

    return interviews.filter((interview) => {
      if (statusFilter !== "ALL" && interview.status !== statusFilter) {
        return false;
      }

      if (
        methodFilter !== "ALL" &&
        interview.interviewMethod !== methodFilter
      ) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const searchable = [
        interview.interviewId,

        interview.applicationId,

        interview.seekerId,

        interview.providerId,

        interview.vacancyId,

        interview.status,

        interview.interviewMethod,

        interview.interviewDate,

        interview.interviewTime,

        interview.timezone,

        interview.candidate?.name,

        interview.candidate?.email,

        interview.candidate?.phone,

        interview.candidate?.nationality,

        interview.vacancy?.title,

        interview.vacancy?.companyName,

        interview.vacancy?.workLocation,

        interview.provider?.name,

        interview.provider?.companyName,

        interview.provider?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(keyword);
    });
  }, [interviewsQuery.data, methodFilter, search, statusFilter]);

  // ==================================================
  // INVALIDATE
  // ==================================================

  const refreshQueries = async (interviewId?: string) => {
    const requests = [
      queryClient.invalidateQueries({
        queryKey: ADMIN_INTERVIEWS_QUERY_KEY,
      }),

      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      }),
    ];

    if (interviewId) {
      requests.push(
        queryClient.invalidateQueries({
          queryKey: [...ADMIN_INTERVIEW_DETAILS_QUERY_KEY, interviewId],
        }),
      );
    }

    await Promise.all(requests);
  };

  // ==================================================
  // UPDATE
  // ==================================================

  const updateMutation = useMutation({
    mutationFn: ({
      interviewId,
      payload,
    }: {
      interviewId: string;

      payload: UpdateAdminInterviewPayload;
    }) => updateAdminInterview(interviewId, payload),

    onSuccess: async (response) => {
      toast.success(response.message || "Interview updated successfully.");

      const interviewId = response.data.interviewId;

      setEditingInterview(null);

      await refreshQueries(interviewId);
    },

    onError: (error: unknown) => {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update interview.",
        );

        return;
      }

      toast.error("Failed to update interview.");
    },
  });

  // ==================================================
  // RETURN
  // ==================================================

  return {
    interviews: filteredInterviews,

    summary: interviewsQuery.data?.summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    methodFilter,
    setMethodFilter,

    selectedInterviewId,

    selectedInterview: detailsQuery.data?.data,

    editingInterview,

    isLoading: interviewsQuery.isLoading,

    isFetching: interviewsQuery.isFetching,

    isDetailsLoading: detailsQuery.isLoading,

    isUpdating: updateMutation.isPending,

    listError: interviewsQuery.error,

    detailsError: detailsQuery.error,

    openDetails: (interviewId: string) => {
      setSelectedInterviewId(interviewId);
    },

    closeDetails: () => {
      setSelectedInterviewId(null);
    },

    openEdit: (interview: AdminInterview) => {
      setEditingInterview(interview);
    },

    closeEdit: () => {
      if (updateMutation.isPending) {
        return;
      }

      setEditingInterview(null);
    },

    submitUpdate: (
      interviewId: string,
      payload: UpdateAdminInterviewPayload,
    ) => {
      updateMutation.mutate({
        interviewId,
        payload,
      });
    },

    refetch: () => interviewsQuery.refetch(),
  };
};
