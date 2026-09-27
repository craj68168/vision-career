"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { getProviderPlacementCandidates } from "./placementCandidatesApi";

import {
  getProviderPlacementInterviewByCandidateId,
  getProviderPlacementInterviews,
} from "./placementInterviewApi";

import type { PlacementRequest } from "./types";

import type {
  PlacementCandidateApiError,
  ProviderPlacementCandidate,
  UpdateProviderPlacementCandidateStatusPayload,
} from "./placementCandidatesTypes";

import type { PlacementInterview } from "./placementInterviewTypes";

// ======================================================
// PROPS
// ======================================================

type Props = {
  open: boolean;

  request: PlacementRequest | null;

  candidates: ProviderPlacementCandidate[];

  lang: string;

  onStatusChange: (
    placementCandidateId: string,
    payload: UpdateProviderPlacementCandidateStatusPayload,
  ) => void | Promise<void>;
};

// ======================================================
// HOOK
// ======================================================

export const usePlacementCandidates = ({
  open,
  request,
  candidates,
  lang,
  onStatusChange,
}: Props) => {
  const [remoteCandidates, setRemoteCandidates] = useState<
    ProviderPlacementCandidate[] | null
  >(null);

  const [interviews, setInterviews] = useState<PlacementInterview[]>([]);

  const [loadingInterviewData, setLoadingInterviewData] = useState(false);

  const [loadingCandidateInterviewId, setLoadingCandidateInterviewId] =
    useState<string | null>(null);

  const [interviewCandidate, setInterviewCandidate] =
    useState<ProviderPlacementCandidate | null>(null);

  const [editingInterview, setEditingInterview] =
    useState<PlacementInterview | null>(null);

  const [rejectingCandidateId, setRejectingCandidateId] = useState<
    string | null
  >(null);

  const [rejectionReason, setRejectionReason] = useState("");

  // ======================================================
  // CANDIDATES
  // ======================================================

  const currentCandidates = remoteCandidates ?? candidates;

  // ======================================================
  // INTERVIEW MAP
  // ======================================================

  const interviewMap = useMemo(() => {
    const map = new Map<string, PlacementInterview>();

    for (const interview of interviews) {
      if (interview.placementCandidateId) {
        map.set(interview.placementCandidateId, interview);
      }
    }

    return map;
  }, [interviews]);

  // ======================================================
  // SUMMARY
  // ======================================================

  const placedCount = useMemo(() => {
    return currentCandidates.filter(
      (candidate) => candidate.status === "PLACED",
    ).length;
  }, [currentCandidates]);

  // ======================================================
  // REFRESH
  // ======================================================

  const refreshPlacementData = useCallback(async () => {
    if (!request) {
      return;
    }

    try {
      setLoadingInterviewData(true);

      const [candidateResponse, interviewResponse] = await Promise.all([
        getProviderPlacementCandidates(request.recruitId),

        getProviderPlacementInterviews(),
      ]);

      const candidateData = Array.isArray(candidateResponse.data)
        ? candidateResponse.data.filter(
            (candidate) => candidate.recruitId === request.recruitId,
          )
        : [];

      const candidateIds = new Set(
        candidateData.map((candidate) => candidate.placementCandidateId),
      );

      const interviewData = Array.isArray(interviewResponse.data)
        ? interviewResponse.data.filter(
            (interview) =>
              interview.recruitId === request.recruitId ||
              Boolean(
                interview.placementCandidateId &&
                candidateIds.has(interview.placementCandidateId),
              ),
          )
        : [];

      setRemoteCandidates(candidateData);

      setInterviews(interviewData);
    } catch (error: unknown) {
      if (axios.isAxiosError<PlacementCandidateApiError>(error)) {
        toast.error(
          error.response?.data?.message ||
            (lang === "ja"
              ? "候補者情報の読み込みに失敗しました。"
              : "Failed to load candidate information."),
        );

        return;
      }

      toast.error(
        lang === "ja"
          ? "候補者情報の読み込みに失敗しました。"
          : "Failed to load candidate information.",
      );
    } finally {
      setLoadingInterviewData(false);
    }
  }, [lang, request]);

  // ======================================================
  // OPEN
  // ======================================================

  useEffect(() => {
    if (!open || !request) {
      return;
    }

    void refreshPlacementData();
  }, [open, request, refreshPlacementData]);

  // ======================================================
  // STATUS
  // ======================================================

  const updateCandidateStatus = async (
    placementCandidateId: string,
    payload: UpdateProviderPlacementCandidateStatusPayload,
  ) => {
    await onStatusChange(placementCandidateId, payload);

    await refreshPlacementData();
  };

  // ======================================================
  // REJECTION
  // ======================================================

  const closeReject = () => {
    setRejectingCandidateId(null);

    setRejectionReason("");
  };

  const rejectCandidate = async () => {
    if (!rejectingCandidateId || !rejectionReason.trim()) {
      return;
    }

    await updateCandidateStatus(rejectingCandidateId, {
      status: "REJECTED",

      rejectionReason: rejectionReason.trim(),
    });

    closeReject();
  };

  // ======================================================
  // INTERVIEW
  // ======================================================

  const openScheduleInterview = async (
    candidate: ProviderPlacementCandidate,
    knownInterview?: PlacementInterview | null,
  ) => {
    try {
      setLoadingCandidateInterviewId(candidate.placementCandidateId);

      let existingInterview =
        knownInterview ||
        interviewMap.get(candidate.placementCandidateId) ||
        null;

      /*
       * Critical:
       * Never assume there is no interview just because
       * local state cannot find one.
       */
      if (!existingInterview) {
        existingInterview = await getProviderPlacementInterviewByCandidateId(
          candidate.placementCandidateId,
        );
      }

      setInterviewCandidate(candidate);

      setEditingInterview(existingInterview);
    } catch (error: unknown) {
      if (axios.isAxiosError<PlacementCandidateApiError>(error)) {
        toast.error(
          error.response?.data?.message ||
            (lang === "ja"
              ? "面接情報の確認に失敗しました。"
              : "Failed to check interview information."),
        );

        return;
      }

      toast.error(
        lang === "ja"
          ? "面接情報の確認に失敗しました。"
          : "Failed to check interview information.",
      );
    } finally {
      setLoadingCandidateInterviewId(null);
    }
  };

  const closeScheduleInterview = () => {
    setInterviewCandidate(null);

    setEditingInterview(null);
  };

  const handleInterviewSuccess = async () => {
    await refreshPlacementData();
  };

  return {
    currentCandidates,

    interviewMap,

    placedCount,

    loadingInterviewData,

    loadingCandidateInterviewId,

    interviewCandidate,

    editingInterview,

    rejectingCandidateId,
    setRejectingCandidateId,

    rejectionReason,
    setRejectionReason,

    updateCandidateStatus,

    closeReject,

    rejectCandidate,

    openScheduleInterview,

    closeScheduleInterview,

    handleInterviewSuccess,

    refreshPlacementData,
  };
};
