"use client";

import { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useTranslations } from "next-intl";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  downloadStaffSeekerResume,
  getStaffSeekerById,
  getStaffSeekers,
  screenStaffSeeker,
  updateStaffSeekerApproval,
} from "./api";

import type {
  AccountStatus,
  ApiErrorResponse,
  ApprovalStatus,
  PlacementStatus,
  ScreenSeekerPayload,
  SeekerScreeningStatus,
  StaffSeeker,
  StaffSeekerApprovalPayload,
} from "./types";

// ======================================================
// HOOK
// ======================================================

export const useStaffJobSeekers = () => {
  const t = useTranslations("staffJobSeekers");

  const queryClient = useQueryClient();

  // ==================================================
  // ERROR
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
  // FILTERS
  // ==================================================

  const [search, setSearchState] = useState("");

  const [approvalStatus, setApprovalStatusState] = useState<
    "" | ApprovalStatus
  >("");

  const [accountStatus, setAccountStatusState] = useState<"" | AccountStatus>(
    "",
  );

  const [placementStatus, setPlacementStatusState] = useState<
    "" | PlacementStatus
  >("");

  const [screeningStatus, setScreeningStatusState] = useState<
    "" | SeekerScreeningStatus
  >("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  // ==================================================
  // MODALS
  // ==================================================

  const [viewingSeeker, setViewingSeeker] = useState<StaffSeeker | null>(null);

  const [screeningSeeker, setScreeningSeeker] = useState<StaffSeeker | null>(
    null,
  );

  const [approvalSeeker, setApprovalSeeker] = useState<StaffSeeker | null>(
    null,
  );

  const [isDownloading, setIsDownloading] = useState(false);

  // ==================================================
  // LIST
  // ==================================================

  const seekerQuery = useQuery({
    queryKey: [
      "staff-seekers",
      search,
      approvalStatus,
      accountStatus,
      placementStatus,
      screeningStatus,
      page,
      limit,
    ],

    queryFn: () =>
      getStaffSeekers({
        search,
        approvalStatus,
        accountStatus,
        placementStatus,
        screeningStatus,
        page,
        limit,
      }),
  });

  // ==================================================
  // INVALIDATE
  // ==================================================

  const invalidateSeekerQueries = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["staff-seekers"],
    });

    await queryClient.invalidateQueries({
      queryKey: ["staff-dashboard"],
    });
  };

  // ==================================================
  // SCREEN
  // ==================================================

  const screenMutation = useMutation({
    mutationFn: ({
      seekerId,
      payload,
    }: {
      seekerId: string;
      payload: ScreenSeekerPayload;
    }) => screenStaffSeeker(seekerId, payload),

    onSuccess: async (response) => {
      toast.success(t("messages.screeningSaved"));

      setScreeningSeeker(null);

      setViewingSeeker((current) => {
        if (current?.seeker_id !== response.data.seeker_id) {
          return current;
        }

        return response.data;
      });

      await invalidateSeekerQueries();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t("messages.screeningFailed")));
    },
  });

  // ==================================================
  // APPROVE / REJECT
  // ==================================================

  const approvalMutation = useMutation({
    mutationFn: ({
      seekerId,
      payload,
    }: {
      seekerId: string;
      payload: StaffSeekerApprovalPayload;
    }) => updateStaffSeekerApproval(seekerId, payload),

    onSuccess: async (response) => {
      const approved = response.data.approval_status === "approved";

      toast.success(approved ? t("messages.approved") : t("messages.rejected"));

      setApprovalSeeker(null);

      setViewingSeeker((current) => {
        if (current?.seeker_id !== response.data.seeker_id) {
          return current;
        }

        return response.data;
      });

      await invalidateSeekerQueries();
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t("messages.approvalFailed")));
    },
  });

  // ==================================================
  // OPEN VIEW
  // ==================================================

  const openView = async (seeker: StaffSeeker) => {
    try {
      const response = await getStaffSeekerById(seeker.seeker_id);

      setViewingSeeker(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error, t("messages.loadFailed")));
    }
  };

  // ==================================================
  // DOWNLOAD
  // ==================================================

  const downloadResume = async (seeker: StaffSeeker) => {
    try {
      setIsDownloading(true);

      await downloadStaffSeekerResume(seeker);
    } catch (error) {
      toast.error(getErrorMessage(error, t("messages.resumeFailed")));
    } finally {
      setIsDownloading(false);
    }
  };

  // ==================================================
  // FILTER HELPERS
  // ==================================================

  const setSearch = (value: string) => {
    setPage(1);

    setSearchState(value);
  };

  const setApprovalStatus = (value: "" | ApprovalStatus) => {
    setPage(1);

    setApprovalStatusState(value);
  };

  const setAccountStatus = (value: "" | AccountStatus) => {
    setPage(1);

    setAccountStatusState(value);
  };

  const setPlacementStatus = (value: "" | PlacementStatus) => {
    setPage(1);

    setPlacementStatusState(value);
  };

  const setScreeningStatus = (value: "" | SeekerScreeningStatus) => {
    setPage(1);

    setScreeningStatusState(value);
  };

  const changeLimit = (value: number) => {
    setPage(1);

    setLimit(value);
  };

  // ==================================================
  // RETURN
  // ==================================================

  return {
    seekers: seekerQuery.data?.data || [],

    summary: seekerQuery.data?.summary,

    pagination: seekerQuery.data?.pagination,

    search,
    approvalStatus,
    accountStatus,
    placementStatus,
    screeningStatus,

    page,
    limit,

    viewingSeeker,
    setViewingSeeker,

    screeningSeeker,
    setScreeningSeeker,

    approvalSeeker,
    setApprovalSeeker,

    isLoading: seekerQuery.isLoading,

    isFetching: seekerQuery.isFetching,

    isScreening: screenMutation.isPending,

    isApproving: approvalMutation.isPending,

    isDownloading,

    setSearch,
    setApprovalStatus,
    setAccountStatus,
    setPlacementStatus,
    setScreeningStatus,

    setPage,
    changeLimit,

    openView,

    downloadResume,

    submitScreening: (seekerId: string, payload: ScreenSeekerPayload) =>
      screenMutation.mutate({
        seekerId,
        payload,
      }),

    submitApproval: (seekerId: string, payload: StaffSeekerApprovalPayload) =>
      approvalMutation.mutate({
        seekerId,
        payload,
      }),

    refresh: () => seekerQuery.refetch(),
  };
};
