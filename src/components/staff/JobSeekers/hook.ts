"use client";

import { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  downloadStaffSeekerResume,
  getStaffSeekerById,
  getStaffSeekers,
  screenStaffSeeker,
} from "./api";

import type {
  AccountStatus,
  ApiErrorResponse,
  ApprovalStatus,
  PlacementStatus,
  ScreenSeekerPayload,
  SeekerScreeningStatus,
  StaffSeeker,
} from "./types";

// ======================================================
// ERROR
// ======================================================

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

// ======================================================
// HOOK
// ======================================================

export const useStaffJobSeekers = () => {
  const queryClient = useQueryClient();

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
      toast.success(response.message || "Screening saved.");

      setScreeningSeeker(null);

      setViewingSeeker((current) => {
        if (current?.seeker_id !== response.data.seeker_id) {
          return current;
        }

        return response.data;
      });

      await queryClient.invalidateQueries({
        queryKey: ["staff-seekers"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["staff-dashboard"],
      });
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to save screening."));
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
      toast.error(getErrorMessage(error, "Failed to load Job Seeker."));
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
      toast.error(getErrorMessage(error, "Failed to download resume."));
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

    isLoading: seekerQuery.isLoading,

    isFetching: seekerQuery.isFetching,

    isScreening: screenMutation.isPending,

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

    refresh: () => seekerQuery.refetch(),
  };
};
