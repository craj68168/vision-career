"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

export const usePlacementRequests = ({
  refreshVersion,
  onDataChanged,
}: Props) => {
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

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError<PlacementRequestApiError>(error)) {
      return error.response?.data?.message || fallback;
    }

    return fallback;
  };

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
      toast.error(getErrorMessage(error, t("toast.loadFailed")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadPlacementData();
  }, [loadPlacementData, refreshVersion]);

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

  const placementCandidateCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const candidate of placementCandidates) {
      counts[candidate.recruitId] = (counts[candidate.recruitId] ?? 0) + 1;
    }

    return counts;
  }, [placementCandidates]);

  const candidateRequestCandidates = useMemo(() => {
    if (!candidateRequest) {
      return [];
    }

    return placementCandidates.filter(
      (candidate) => candidate.recruitId === candidateRequest.recruitId,
    );
  }, [candidateRequest, placementCandidates]);

  const refresh = async () => {
    try {
      setRefreshing(true);
      await loadPlacementData();
    } finally {
      setRefreshing(false);
    }
  };

  const openPlacementRequest = () => {
    setPlacementRequestOpen(true);
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

  const openPlacementRequestView = (request: PlacementRequest) => {
    setViewPlacementRequest(request);
  };

  const closePlacementRequestView = () => {
    setViewPlacementRequest(null);
  };

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
      toast.error(getErrorMessage(error, t("toast.updateFailed")));
    } finally {
      setPlacementActionLoading(false);
    }
  };

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
      toast.error(getErrorMessage(error, t("toast.deleteFailed")));
    } finally {
      setPlacementActionLoading(false);
    }
  };

  const openPlacementRequestSubmit = (request: PlacementRequest) => {
    if (!["draft", "rejected"].includes(request.status)) {
      toast.error(t("toast.cannotSubmit"));
      return;
    }

    setSubmitPlacementRequestTarget(request);
  };

  const closePlacementRequestSubmit = () => {
    setSubmitPlacementRequestTarget(null);
  };

  const handlePlacementRequestSubmit = async () => {
    if (!submitPlacementRequestTarget) {
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
      toast.error(getErrorMessage(error, t("toast.submitFailed")));
    } finally {
      setPlacementActionLoading(false);
    }
  };

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

  const refreshPlacementCandidates = async () => {
    try {
      const response = await getProviderPlacementCandidates();
      setPlacementCandidates(Array.isArray(response.data) ? response.data : []);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, t("toast.refreshCandidatesFailed")));
    }
  };

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
      toast.error(getErrorMessage(error, t("toast.candidateStatusUpdateFailed")));
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
