"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveAdminApplication,
  getAdminApplicationById,
  getAdminApplicationResume,
  getAdminApplications,
  rejectAdminApplication,
} from "./api";

import type {
  AdminApplication,
  ApiErrorResponse,
  ApplicationStatus,
} from "./types";

export const useAdminApplications = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<"ALL" | ApplicationStatus>(
    "ALL",
  );

  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);

  const [rejectApplication, setRejectApplication] =
    useState<AdminApplication | null>(null);

  // ==================================================
  // LIST
  // ==================================================

  const applicationsQuery = useQuery({
    queryKey: ["admin-applications"],

    queryFn: getAdminApplications,

    staleTime: 1000 * 30,

    refetchOnWindowFocus: false,

    retry: 1,
  });

  // ==================================================
  // DETAILS
  // ==================================================

  const detailsQuery = useQuery({
    queryKey: ["admin-application-details", selectedApplicationId],

    queryFn: () => getAdminApplicationById(selectedApplicationId!),

    enabled: Boolean(selectedApplicationId),

    retry: 1,
  });

  // ==================================================
  // FILTER
  // ==================================================

  const filteredApplications = useMemo(() => {
    const applications = applicationsQuery.data?.data || [];

    const normalizedSearch = search.trim().toLowerCase();

    return applications.filter((application) => {
      if (statusFilter !== "ALL" && application.status !== statusFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchable = [
        application.applicationId,

        application.candidate.name,

        application.candidate.email,

        application.vacancy.title,

        application.vacancy.companyName,

        application.provider.name,

        application.provider.companyName,

        application.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedSearch);
    });
  }, [applicationsQuery.data, search, statusFilter]);

  // ==================================================
  // INVALIDATE
  // ==================================================

  const refreshRelatedQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["admin-applications"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["provider-applications"],
      }),
    ]);
  };

  // ==================================================
  // APPROVE
  // ==================================================

  const approveMutation = useMutation({
    mutationFn: approveAdminApplication,

    onSuccess: async (response) => {
      toast.success(response.message);

      setSelectedApplicationId(null);

      await refreshRelatedQueries();
    },

    onError: (error: unknown) => {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message || "Failed to approve application.",
        );

        return;
      }

      toast.error("Failed to approve application.");
    },
  });

  // ==================================================
  // REJECT
  // ==================================================

  const rejectMutation = useMutation({
    mutationFn: ({
      applicationId,
      reason,
    }: {
      applicationId: string;
      reason: string;
    }) =>
      rejectAdminApplication(applicationId, {
        reason,
      }),

    onSuccess: async (response) => {
      toast.success(response.message);

      setRejectApplication(null);

      setSelectedApplicationId(null);

      await refreshRelatedQueries();
    },

    onError: (error: unknown) => {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message || "Failed to reject application.",
        );

        return;
      }

      toast.error("Failed to reject application.");
    },
  });

  // ==================================================
  // RESUME
  // ==================================================

  const openResume = async (applicationId: string) => {
    try {
      const blob = await getAdminApplicationResume(applicationId);

      const url = URL.createObjectURL(blob);

      window.open(url, "_blank", "noopener,noreferrer");

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60_000);
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message || "Resume could not be opened.",
        );

        return;
      }

      toast.error("Resume could not be opened.");
    }
  };

  return {
    applications: filteredApplications,

    summary: applicationsQuery.data?.summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    selectedApplicationId,

    selectedApplication: detailsQuery.data?.data,

    rejectApplication,

    isLoading: applicationsQuery.isLoading,

    isFetching: applicationsQuery.isFetching,

    isDetailsLoading: detailsQuery.isLoading,

    listError: applicationsQuery.error,

    detailsError: detailsQuery.error,

    isApproving: approveMutation.isPending,

    isRejecting: rejectMutation.isPending,

    openDetails: (applicationId: string) =>
      setSelectedApplicationId(applicationId),

    closeDetails: () => setSelectedApplicationId(null),

    openReject: (application: AdminApplication) =>
      setRejectApplication(application),

    closeReject: () => setRejectApplication(null),

    approveApplication: (applicationId: string) =>
      approveMutation.mutate(applicationId),

    submitRejection: (applicationId: string, reason: string) =>
      rejectMutation.mutate({
        applicationId,
        reason,
      }),

    openResume,

    refetch: () => applicationsQuery.refetch(),
  };
};
