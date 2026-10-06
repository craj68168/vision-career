"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useTranslations } from "next-intl";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveStaffApplication,
  getStaffApplications,
  rejectStaffApplication,
  screenStaffApplication,
} from "./api";

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
  const t = useTranslations("staffApplications");

  const queryClient = useQueryClient();

  // ==================================================
  // FILTERS
  // ==================================================

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | StaffApplicationStatus
  >("ALL");

  const [screeningFilter, setScreeningFilter] = useState<
    "ALL" | StaffScreeningStatus
  >("ALL");

  // ==================================================
  // MODALS
  // ==================================================

  const [selectedApplication, setSelectedApplication] =
    useState<StaffApplication | null>(null);

  const [screeningApplication, setScreeningApplication] =
    useState<StaffApplication | null>(null);

  const [decisionApplication, setDecisionApplication] =
    useState<StaffApplication | null>(null);

  // ==================================================
  // QUERY
  // ==================================================

  const applicationQuery = useQuery({
    queryKey: APPLICATION_QUERY_KEY,

    queryFn: getStaffApplications,
  });

  // ==================================================
  // ERROR MESSAGE
  // ==================================================

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
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

  // ==================================================
  // INVALIDATE
  // ==================================================

  const invalidateApplicationQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: APPLICATION_QUERY_KEY,
      }),

      queryClient.invalidateQueries({
        queryKey: ["staff-dashboard"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["admin-applications"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["provider-applications"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["job-seeker-applications"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["seeker-applications"],
      }),
    ]);
  };

  // ==================================================
  // SCREEN
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
      toast.success(t("messages.screeningSaved"));

      setScreeningApplication(null);

      setSelectedApplication((current) => {
        if (!current || current.applicationId !== response.data.applicationId) {
          return current;
        }

        return response.data;
      });

      await invalidateApplicationQueries();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t("messages.screeningFailed")));
    },
  });

  // ==================================================
  // APPROVE
  // ==================================================

  const approveMutation = useMutation({
    mutationFn: approveStaffApplication,

    onSuccess: async () => {
      toast.success(t("messages.approved"));

      setDecisionApplication(null);

      setSelectedApplication(null);

      await invalidateApplicationQueries();
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
      applicationId,
      reason,
    }: {
      applicationId: string;

      reason: string;
    }) =>
      rejectStaffApplication(applicationId, {
        reason,
      }),

    onSuccess: async () => {
      toast.success(t("messages.rejected"));

      setDecisionApplication(null);

      setSelectedApplication(null);

      await invalidateApplicationQueries();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t("messages.rejectionFailed")));
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
  // SCREEN ACTION
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

  // ==================================================
  // APPROVE ACTION
  // ==================================================

  const approveApplication = (applicationId: string) => {
    approveMutation.mutate(applicationId);
  };

  // ==================================================
  // REJECT ACTION
  // ==================================================

  const rejectApplication = (applicationId: string, reason: string) => {
    rejectMutation.mutate({
      applicationId,
      reason,
    });
  };

  // ==================================================
  // REFRESH
  // ==================================================

  const refresh = async () => {
    await applicationQuery.refetch();
  };

  // ==================================================
  // RETURN
  // ==================================================

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

    decisionApplication,
    setDecisionApplication,

    isLoading: applicationQuery.isLoading,

    isFetching: applicationQuery.isFetching,

    isScreening: screeningMutation.isPending,

    isApproving: approveMutation.isPending,

    isRejecting: rejectMutation.isPending,

    submitScreening,

    approveApplication,

    rejectApplication,

    refresh,
  };
};
