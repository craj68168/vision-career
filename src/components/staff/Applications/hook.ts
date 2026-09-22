"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getStaffApplications, screenStaffApplication } from "./api";

import type {
  ApiErrorResponse,
  ScreenApplicationPayload,
  StaffApplication,
  StaffApplicationStatus,
  StaffScreeningStatus,
} from "./types";

// ======================================================
// QUERY KEY
// ======================================================

const APPLICATION_QUERY_KEY = ["staff-applications"] as const;

// ======================================================
// HOOK
// ======================================================

export const useStaffApplications = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | StaffApplicationStatus
  >("ALL");

  const [screeningFilter, setScreeningFilter] = useState<
    "ALL" | StaffScreeningStatus
  >("ALL");

  const [selectedApplication, setSelectedApplication] =
    useState<StaffApplication | null>(null);

  const [screeningApplication, setScreeningApplication] =
    useState<StaffApplication | null>(null);

  // ==================================================
  // QUERY
  // ==================================================

  const applicationQuery = useQuery({
    queryKey: APPLICATION_QUERY_KEY,

    queryFn: getStaffApplications,
  });

  // ==================================================
  // ERROR
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
      applicationId,
      payload,
    }: {
      applicationId: string;

      payload: ScreenApplicationPayload;
    }) => screenStaffApplication(applicationId, payload),

    onSuccess: async (response) => {
      toast.success(response.message || "Application screening saved.");

      setScreeningApplication(null);

      setSelectedApplication((current) => {
        if (!current || current.applicationId !== response.data.applicationId) {
          return current;
        }

        return response.data;
      });

      await queryClient.invalidateQueries({
        queryKey: APPLICATION_QUERY_KEY,
      });

      await queryClient.invalidateQueries({
        queryKey: ["staff-dashboard"],
      });

      // Admin needs fresh screening state too.
      await queryClient.invalidateQueries({
        queryKey: ["admin-applications"],
      });
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  // ==================================================
  // DATA
  // ==================================================

  const applications = applicationQuery.data?.data || [];

  const summary = applicationQuery.data?.summary;

  // ==================================================
  // FILTER
  // ==================================================

  const filteredApplications = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return applications.filter((application) => {
      if (statusFilter !== "ALL" && application.status !== statusFilter) {
        return false;
      }

      if (
        screeningFilter !== "ALL" &&
        application.screening.status !== screeningFilter
      ) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const searchable = [
        application.applicationId,
        application.applicant.name,
        application.vacancy?.title,
        application.vacancy?.companyName,
        application.vacancy?.workLocation,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(keyword);
    });
  }, [applications, search, statusFilter, screeningFilter]);

  // ==================================================
  // ACTIONS
  // ==================================================

  const submitScreening = (
    applicationId: string,
    payload: ScreenApplicationPayload,
  ) => {
    screeningMutation.mutate({
      applicationId,
      payload,
    });
  };

  const refresh = async () => {
    await applicationQuery.refetch();
  };

  return {
    applications: filteredApplications,

    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    screeningFilter,
    setScreeningFilter,

    selectedApplication,
    setSelectedApplication,

    screeningApplication,
    setScreeningApplication,

    isLoading: applicationQuery.isLoading,

    isFetching: applicationQuery.isFetching,

    isScreening: screeningMutation.isPending,

    submitScreening,

    refresh,
  };
};
