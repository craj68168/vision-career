"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import axios from "axios";

import toast from "react-hot-toast";

import { useTranslations } from "next-intl";

import {
  deleteProviderPlacementRequest,
  getProviderPlacementCandidates,
  getProviderPlacementRequests,
  submitProviderPlacementRequest,
  updateProviderPlacementCandidateStatus,
  updateProviderPlacementRequest,
} from "./api";

import { getProviderProfile } from "../../Profile/api";

import type {
  CreatePlacementRequestPayload,
  PlacementRequest,
  PlacementRequestApiError,
  ProviderPlacementCandidate,
  UpdateProviderPlacementCandidateStatusPayload,
} from "./types";

type Props = {
  lang: string;

  refreshVersion: number;

  onDataChanged: () => void | Promise<void>;
};

// ======================================================
// API ERROR MESSAGE
// ======================================================

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<PlacementRequestApiError>(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
};

export const usePlacementRequests = ({
  lang,
  refreshVersion,
  onDataChanged,
}: Props) => {
  const router = useRouter();

  const t = useTranslations("provider.placementRequests.list");

  const [placementRequests, setPlacementRequests] = useState<
    PlacementRequest[]
  >([]);

  const [placementCandidates, setPlacementCandidates] = useState<
    ProviderPlacementCandidate[]
  >([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [placementRequestOpen, setPlacementRequestOpen] = useState(false);

  const [viewPlacementRequest, setViewPlacementRequest] =
    useState<PlacementRequest | null>(null);

  const [editPlacementRequest, setEditPlacementRequest] =
    useState<PlacementRequest | null>(null);

  const [deletePlacementRequestTarget, setDeletePlacementRequestTarget] =
    useState<PlacementRequest | null>(null);

  const [submitPlacementRequestTarget, setSubmitPlacementRequestTarget] =
    useState<PlacementRequest | null>(null);

  const [placementActionLoading, setPlacementActionLoading] = useState(false);

  const [candidateRequest, setCandidateRequest] =
    useState<PlacementRequest | null>(null);

  const [candidateActionId, setCandidateActionId] = useState<string | null>(
    null,
  );

  // ====================================================
  // PROFILE ROUTE
  // ====================================================

  const providerProfileRoute =
    lang === "ja"
      ? "/provider-dashboard/profile"
      : "/en/provider-dashboard/profile";

  // ====================================================
  // PROFILE COMPLETION GATE
  //
  // Backend is still the final authority.
  //
  // This frontend check prevents opening create/submit
  // flows when the Provider already has an incomplete
  // company profile.
  // ====================================================

  const ensureProviderProfileComplete = useCallback(async () => {
    try {
      const response = await getProviderProfile();

      if (response.status !== "success") {
        toast.error(t("toast.loadFailed"));

        return false;
      }

      if (response.is_complete) {
        return true;
      }

      const missingLabels = response.missing_fields
        ?.map((item) => item.label)
        .filter(Boolean)
        .join(", ");

      const message =
        lang === "ja"
          ? missingLabels
            ? `人材紹介依頼を作成または送信する前に企業プロフィールを完成してください。未入力: ${missingLabels}`
            : "人材紹介依頼を作成または送信する前に企業プロフィールを完成してください。"
          : missingLabels
            ? `Complete your company profile before creating or submitting a placement request. Missing: ${missingLabels}`
            : "Complete your company profile before creating or submitting a placement request.";

      toast.error(message, {
        duration: 5000,
      });

      router.push(providerProfileRoute);

      return false;
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, t("toast.loadFailed")));

      return false;
    }
  }, [lang, providerProfileRoute, router, t]);

  // ====================================================
  // LOAD
  // ====================================================

  const loadPlacementData = useCallback(async () => {
    try {
      const [placementResponse, candidateResponse] = await Promise.all([
        getProviderPlacementRequests(),

        getProviderPlacementCandidates(),
      ]);

      setPlacementRequests(
        Array.isArray(placementResponse.data) ? placementResponse.data : [],
      );

      setPlacementCandidates(
        Array.isArray(candidateResponse.data) ? candidateResponse.data : [],
      );
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, t("toast.loadFailed")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPlacementData();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadPlacementData, refreshVersion]);

  // ====================================================
  // FILTER
  // ====================================================

  const filteredPlacementRequests = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return placementRequests;
    }

    return placementRequests.filter((request) => {
      const haystack = [
        request.recruitId,

        request.job_title,

        request.job_category,

        request.employment_type,

        request.work_location,

        request.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [placementRequests, search]);

  // ====================================================
  // CANDIDATE COUNTS
  // ====================================================

  const placementCandidateCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const candidate of placementCandidates) {
      counts[candidate.recruitId] = (counts[candidate.recruitId] ?? 0) + 1;
    }

    return counts;
  }, [placementCandidates]);

  // ====================================================
  // CURRENT REQUEST CANDIDATES
  // ====================================================

  const candidateRequestCandidates = useMemo(() => {
    if (!candidateRequest) {
      return [];
    }

    return placementCandidates.filter(
      (candidate) => candidate.recruitId === candidateRequest.recruitId,
    );
  }, [candidateRequest, placementCandidates]);

  // ====================================================
  // REFRESH
  // ====================================================

  const refresh = async () => {
    try {
      setRefreshing(true);

      await loadPlacementData();
    } finally {
      setRefreshing(false);
    }
  };

  // ====================================================
  // CREATE
  //
  // Incomplete company profiles cannot start a new
  // Placement Request.
  // ====================================================

  const openPlacementRequest = () => {
    const checkProfileAndOpen = async () => {
      const allowed = await ensureProviderProfileComplete();

      if (!allowed) {
        return;
      }

      setPlacementRequestOpen(true);
    };

    void checkProfileAndOpen();
  };

  const closePlacementRequest = () => {
    setPlacementRequestOpen(false);
  };

  const handlePlacementCreated = async () => {
    setPlacementRequestOpen(false);

    setSearch("");

    await loadPlacementData();

    await onDataChanged();
  };

  // ====================================================
  // VIEW
  // ====================================================

  const openPlacementRequestView = (request: PlacementRequest) => {
    setViewPlacementRequest(request);
  };

  const closePlacementRequestView = () => {
    setViewPlacementRequest(null);
  };

  // ====================================================
  // EDIT
  //
  // Editing draft/rejected requests is allowed.
  //
  // They still cannot be submitted until the profile is
  // complete.
  // ====================================================

  const openPlacementRequestEdit = (request: PlacementRequest) => {
    if (!["draft", "rejected"].includes(request.status)) {
      toast.error(t("toast.cannotEdit"));

      return;
    }

    setViewPlacementRequest(null);

    window.setTimeout(() => {
      setEditPlacementRequest(request);
    }, 0);
  };

  const closePlacementRequestEdit = () => {
    setEditPlacementRequest(null);
  };

  const handlePlacementRequestUpdate = async (
    payload: CreatePlacementRequestPayload,
  ) => {
    if (!editPlacementRequest) {
      return;
    }

    try {
      setPlacementActionLoading(true);

      const response = await updateProviderPlacementRequest(
        editPlacementRequest.recruitId,
        payload,
      );

      toast.success(response.message || t("toast.updated"));

      setEditPlacementRequest(null);

      await loadPlacementData();

      await onDataChanged();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, t("toast.updateFailed")));
    } finally {
      setPlacementActionLoading(false);
    }
  };

  // ====================================================
  // DELETE
  // ====================================================

  const openPlacementRequestDelete = (request: PlacementRequest) => {
    if (!["draft", "rejected"].includes(request.status)) {
      toast.error(t("toast.cannotDelete"));

      return;
    }

    setDeletePlacementRequestTarget(request);
  };

  const closePlacementRequestDelete = () => {
    setDeletePlacementRequestTarget(null);
  };

  const handlePlacementRequestDelete = async () => {
    if (!deletePlacementRequestTarget) {
      return;
    }

    try {
      setPlacementActionLoading(true);

      const response = await deleteProviderPlacementRequest(
        deletePlacementRequestTarget.recruitId,
      );

      toast.success(response.message || t("toast.deleted"));

      setDeletePlacementRequestTarget(null);

      await loadPlacementData();

      await onDataChanged();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, t("toast.deleteFailed")));
    } finally {
      setPlacementActionLoading(false);
    }
  };

  // ====================================================
  // OPEN SUBMIT / RESUBMIT
  //
  // Check Provider Profile before even opening the
  // confirmation modal.
  // ====================================================

  const openPlacementRequestSubmit = (request: PlacementRequest) => {
    if (!["draft", "rejected"].includes(request.status)) {
      toast.error(t("toast.cannotSubmit"));

      return;
    }

    const checkProfileAndOpen = async () => {
      const allowed = await ensureProviderProfileComplete();

      if (!allowed) {
        return;
      }

      setSubmitPlacementRequestTarget(request);
    };

    void checkProfileAndOpen();
  };

  const closePlacementRequestSubmit = () => {
    setSubmitPlacementRequestTarget(null);
  };

  // ====================================================
  // SUBMIT / RESUBMIT
  //
  // Check Profile again immediately before the API call.
  //
  // This protects against the Profile becoming incomplete
  // after the confirmation modal was opened.
  // ====================================================

  const handlePlacementRequestSubmit = async () => {
    if (!submitPlacementRequestTarget) {
      return;
    }

    const allowed = await ensureProviderProfileComplete();

    if (!allowed) {
      setSubmitPlacementRequestTarget(null);

      return;
    }

    try {
      setPlacementActionLoading(true);

      const response = await submitProviderPlacementRequest(
        submitPlacementRequestTarget.recruitId,
      );

      toast.success(response.message || t("toast.submitted"));

      setSubmitPlacementRequestTarget(null);

      await loadPlacementData();

      await onDataChanged();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, t("toast.submitFailed")));
    } finally {
      setPlacementActionLoading(false);
    }
  };

  // ====================================================
  // OPEN CANDIDATES
  // ====================================================

  const openPlacementCandidates = (request: PlacementRequest) => {
    if (request.status !== "approved") {
      toast.error(t("toast.approvedOnlyCandidates"));

      return;
    }

    setCandidateRequest(request);
  };

  const closePlacementCandidates = () => {
    setCandidateRequest(null);
  };

  // ====================================================
  // REFRESH CANDIDATES
  // ====================================================

  const refreshPlacementCandidates = async () => {
    try {
      const response = await getProviderPlacementCandidates();

      setPlacementCandidates(Array.isArray(response.data) ? response.data : []);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error, t("toast.refreshCandidatesFailed")),
      );
    }
  };

  // ====================================================
  // UPDATE CANDIDATE STATUS
  // ====================================================

  const handlePlacementCandidateStatus = async (
    placementCandidateId: string,

    payload: UpdateProviderPlacementCandidateStatusPayload,
  ) => {
    try {
      setCandidateActionId(placementCandidateId);

      const response = await updateProviderPlacementCandidateStatus(
        placementCandidateId,
        payload,
      );

      toast.success(response.message || t("toast.candidateStatusUpdated"));

      await refreshPlacementCandidates();
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error, t("toast.candidateStatusUpdateFailed")),
      );
    } finally {
      setCandidateActionId(null);
    }
  };

  return {
    loading,

    refreshing,

    search,

    setSearch,

    filteredPlacementRequests,

    placementCandidateCounts,

    placementRequestOpen,

    openPlacementRequest,

    closePlacementRequest,

    handlePlacementCreated,

    viewPlacementRequest,

    openPlacementRequestView,

    closePlacementRequestView,

    editPlacementRequest,

    openPlacementRequestEdit,

    closePlacementRequestEdit,

    handlePlacementRequestUpdate,

    deletePlacementRequestTarget,

    openPlacementRequestDelete,

    closePlacementRequestDelete,

    handlePlacementRequestDelete,

    submitPlacementRequestTarget,

    openPlacementRequestSubmit,

    closePlacementRequestSubmit,

    handlePlacementRequestSubmit,

    placementActionLoading,

    candidateRequest,

    candidateRequestCandidates,

    openPlacementCandidates,

    closePlacementCandidates,

    candidateActionId,

    handlePlacementCandidateStatus,

    refresh,
  };
};
