"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getStaffVacancies, screenStaffVacancy } from "./api";

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

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      return error.response?.data?.message || "Something went wrong.";
    }

    return "Something went wrong.";
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
      toast.success(response.message || "Vacancy screening saved.");

      setScreeningVacancy(null);

      setSelectedVacancy((current) => {
        if (!current || current.vacancyId !== response.data.vacancyId) {
          return current;
        }

        return response.data;
      });

      await queryClient.invalidateQueries({
        queryKey: VACANCY_QUERY_KEY,
      });

      await queryClient.invalidateQueries({
        queryKey: ["staff-dashboard"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["admin-vacancies"],
      });
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
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

    isLoading: vacancyQuery.isLoading,

    isFetching: vacancyQuery.isFetching,

    isScreening: screeningMutation.isPending,

    submitScreening,

    refresh,
  };
};
