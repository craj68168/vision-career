"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveAdminVacancy,
  closeAdminVacancy,
  getAdminVacancies,
  getAdminVacancyById,
  publishAdminVacancy,
  rejectAdminVacancy,
} from "./api";

import type {
  AdminVacancy,
  AdminVacancyApiError,
  VacancyStatus,
} from "./types";

export const useAdminVacancies = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<"ALL" | VacancyStatus>(
    "ALL",
  );

  const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(
    null,
  );

  const [rejectingVacancy, setRejectingVacancy] = useState<AdminVacancy | null>(
    null,
  );

  // ==================================================
  // LIST
  // ==================================================

  const vacanciesQuery = useQuery({
    queryKey: ["admin-vacancies"],

    queryFn: getAdminVacancies,

    staleTime: 1000 * 30,

    refetchOnWindowFocus: false,

    retry: 1,
  });

  // ==================================================
  // DETAILS
  // ==================================================

  const detailsQuery = useQuery({
    queryKey: ["admin-vacancy-details", selectedVacancyId],

    queryFn: () => getAdminVacancyById(selectedVacancyId!),

    enabled: Boolean(selectedVacancyId),

    retry: 1,
  });

  // ==================================================
  // FRONTEND FILTER
  // ==================================================

  const filteredVacancies = useMemo(() => {
    const vacancies = vacanciesQuery.data?.data || [];

    const normalizedSearch = search.trim().toLowerCase();

    return vacancies.filter((vacancy) => {
      if (statusFilter !== "ALL" && vacancy.status !== statusFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchable = [
        vacancy.vacancyId,
        vacancy.title,
        vacancy.titleKana,
        vacancy.companyName,
        vacancy.employmentType,
        vacancy.workLocation,
        vacancy.provider?.name,
        vacancy.provider?.companyName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedSearch);
    });
  }, [vacanciesQuery.data, search, statusFilter]);

  // ==================================================
  // INVALIDATE
  // ==================================================

  const refreshRelated = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["admin-vacancies"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["provider-vacancies"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["seeker-vacancies"],
      }),
    ]);
  };

  // ==================================================
  // ERROR
  // ==================================================

  const showError = (error: unknown, fallback: string) => {
    if (axios.isAxiosError<AdminVacancyApiError>(error)) {
      toast.error(error.response?.data?.message || fallback);

      return;
    }

    toast.error(fallback);
  };

  // ==================================================
  // APPROVE
  // ==================================================

  const approveMutation = useMutation({
    mutationFn: approveAdminVacancy,

    onSuccess: async (response) => {
      toast.success(response.message);

      setSelectedVacancyId(null);

      await refreshRelated();
    },

    onError: (error: unknown) => showError(error, "Failed to approve vacancy."),
  });

  // ==================================================
  // REJECT
  // ==================================================

  const rejectMutation = useMutation({
    mutationFn: ({
      vacancyId,
      reason,
    }: {
      vacancyId: string;
      reason: string;
    }) =>
      rejectAdminVacancy(vacancyId, {
        reason,
      }),

    onSuccess: async (response) => {
      toast.success(response.message);

      setRejectingVacancy(null);

      setSelectedVacancyId(null);

      await refreshRelated();
    },

    onError: (error: unknown) => showError(error, "Failed to reject vacancy."),
  });

  // ==================================================
  // PUBLISH
  // ==================================================

  const publishMutation = useMutation({
    mutationFn: publishAdminVacancy,

    onSuccess: async (response) => {
      toast.success(response.message);

      setSelectedVacancyId(null);

      await refreshRelated();
    },

    onError: (error: unknown) => showError(error, "Failed to publish vacancy."),
  });

  // ==================================================
  // CLOSE
  // ==================================================

  const closeMutation = useMutation({
    mutationFn: closeAdminVacancy,

    onSuccess: async (response) => {
      toast.success(response.message);

      setSelectedVacancyId(null);

      await refreshRelated();
    },

    onError: (error: unknown) => showError(error, "Failed to close vacancy."),
  });

  return {
    vacancies: filteredVacancies,

    summary: vacanciesQuery.data?.summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    selectedVacancy: detailsQuery.data?.data,

    selectedVacancyId,

    rejectingVacancy,

    isLoading: vacanciesQuery.isLoading,

    isFetching: vacanciesQuery.isFetching,

    isDetailsLoading: detailsQuery.isLoading,

    isApproving: approveMutation.isPending,

    isRejecting: rejectMutation.isPending,

    isPublishing: publishMutation.isPending,

    isClosing: closeMutation.isPending,

    openDetails: (vacancyId: string) => setSelectedVacancyId(vacancyId),

    closeDetails: () => setSelectedVacancyId(null),

    openReject: (vacancy: AdminVacancy) => setRejectingVacancy(vacancy),

    closeReject: () => setRejectingVacancy(null),

    approveVacancy: (vacancyId: string) => approveMutation.mutate(vacancyId),

    rejectVacancy: (vacancyId: string, reason: string) =>
      rejectMutation.mutate({
        vacancyId,
        reason,
      }),

    publishVacancy: (vacancyId: string) => publishMutation.mutate(vacancyId),

    closeVacancy: (vacancyId: string) => {
      const confirmed = window.confirm(
        "Close this published vacancy? It will disappear from the seeker job list.",
      );

      if (!confirmed) {
        return;
      }

      closeMutation.mutate(vacancyId);
    },

    refetch: () => vacanciesQuery.refetch(),
  };
};
