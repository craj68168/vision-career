"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useTranslations } from "next-intl";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveStaffVacancy,
  getStaffVacancies,
  rejectStaffVacancy,
  screenStaffVacancy,
} from "./api";

import type {
  ApiErrorResponse,
  ScreenVacancyPayload,
  StaffVacancy,
  StaffVacancyScreeningStatus,
  StaffVacancyStatus,
} from "./types";

// ======================================================
// QUERY KEY
// ======================================================

const VACANCY_QUERY_KEY = ["staff-vacancies"] as const;

// ======================================================
// HOOK
// ======================================================

export const useStaffVacancies = () => {
  const t = useTranslations("staffVacancies");

  const queryClient = useQueryClient();

  // ==================================================
  // FILTERS
  // ==================================================

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<"ALL" | StaffVacancyStatus>(
    "ALL",
  );

  const [screeningFilter, setScreeningFilter] = useState<
    "ALL" | StaffVacancyScreeningStatus
  >("ALL");

  // ==================================================
  // MODALS
  // ==================================================

  const [selectedVacancy, setSelectedVacancy] = useState<StaffVacancy | null>(
    null,
  );

  const [screeningVacancy, setScreeningVacancy] = useState<StaffVacancy | null>(
    null,
  );

  const [decisionVacancy, setDecisionVacancy] = useState<StaffVacancy | null>(
    null,
  );

  // ==================================================
  // QUERY
  // ==================================================

  const vacancyQuery = useQuery({
    queryKey: VACANCY_QUERY_KEY,

    queryFn: getStaffVacancies,
  });

  // ==================================================
  // ERROR HELPER
  // ==================================================

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (!axios.isAxiosError<ApiErrorResponse>(error)) {
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

  // ==================================================
  // INVALIDATE
  // ==================================================

  const invalidateRelated = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: VACANCY_QUERY_KEY,
      }),

      queryClient.invalidateQueries({
        queryKey: ["staff-dashboard"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["admin-vacancies"],
      }),
    ]);
  };

  // ==================================================
  // SCREEN MUTATION
  // ==================================================

  const screeningMutation = useMutation({
    mutationFn: ({
      vacancyId,
      payload,
    }: {
      vacancyId: string;

      payload: ScreenVacancyPayload;
    }) => screenStaffVacancy(vacancyId, payload),

    onSuccess: async (response) => {
      toast.success(t("messages.screeningSaved"));

      setScreeningVacancy(null);

      setSelectedVacancy((current) => {
        if (!current || current.vacancyId !== response.data.vacancyId) {
          return current;
        }

        return response.data;
      });

      await invalidateRelated();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t("messages.screeningFailed")));
    },
  });

  // ==================================================
  // APPROVE
  // ==================================================

  const approveMutation = useMutation({
    mutationFn: approveStaffVacancy,

    onSuccess: async (response) => {
      toast.success(t("messages.approved"));

      setDecisionVacancy(null);

      setSelectedVacancy((current) => {
        if (!current || current.vacancyId !== response.data.vacancyId) {
          return current;
        }

        return response.data;
      });

      await invalidateRelated();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t("messages.approvalFailed")));
    },
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
      rejectStaffVacancy(vacancyId, {
        reason,
      }),

    onSuccess: async (response) => {
      toast.success(t("messages.rejected"));

      setDecisionVacancy(null);

      setSelectedVacancy((current) => {
        if (!current || current.vacancyId !== response.data.vacancyId) {
          return current;
        }

        return response.data;
      });

      await invalidateRelated();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t("messages.rejectionFailed")));
    },
  });

  // ==================================================
  // DATA
  // ==================================================

  const vacancies = vacancyQuery.data?.data || [];

  const summary = vacancyQuery.data?.summary;

  // ==================================================
  // FILTERED DATA
  // ==================================================

  const filteredVacancies = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return vacancies.filter((vacancy) => {
      if (statusFilter !== "ALL" && vacancy.status !== statusFilter) {
        return false;
      }

      if (
        screeningFilter !== "ALL" &&
        vacancy.staffScreening.status !== screeningFilter
      ) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const searchable = [
        vacancy.vacancyId,
        vacancy.companyName,
        vacancy.title,
        vacancy.employmentType,
        vacancy.workLocation,
        vacancy.japaneseLevel,
        vacancy.status,
        vacancy.staffScreening.status,
        vacancy.staffScreening.note,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(keyword);
    });
  }, [vacancies, search, statusFilter, screeningFilter]);

  // ==================================================
  // ACTIONS
  // ==================================================

  const submitScreening = (
    vacancyId: string,
    payload: ScreenVacancyPayload,
  ) => {
    screeningMutation.mutate({
      vacancyId,
      payload,
    });
  };

  const approveVacancy = (vacancyId: string) => {
    approveMutation.mutate(vacancyId);
  };

  const rejectVacancy = (vacancyId: string, reason: string) => {
    rejectMutation.mutate({
      vacancyId,
      reason,
    });
  };

  const refresh = async () => {
    await vacancyQuery.refetch();
  };

  return {
    vacancies: filteredVacancies,

    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    screeningFilter,
    setScreeningFilter,

    selectedVacancy,
    setSelectedVacancy,

    screeningVacancy,
    setScreeningVacancy,

    decisionVacancy,
    setDecisionVacancy,

    isLoading: vacancyQuery.isLoading,

    isFetching: vacancyQuery.isFetching,

    isScreening: screeningMutation.isPending,

    isApproving: approveMutation.isPending,

    isRejecting: rejectMutation.isPending,

    submitScreening,

    approveVacancy,

    rejectVacancy,

    refresh,
  };
};
