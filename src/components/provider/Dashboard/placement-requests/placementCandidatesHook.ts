"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useTranslations } from "next-intl";

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
// REMOTE CANDIDATE STATE
//
// State is linked to recruitId so data from a previously
// opened placement request cannot appear in a new one.
// ======================================================

type RemoteCandidateState = {
  recruitId: string;

  data: ProviderPlacementCandidate[];
};

// ======================================================
// REMOTE INTERVIEW STATE
// ======================================================

type RemoteInterviewState = {
  recruitId: string;

  data: PlacementInterview[];
};

// ======================================================
// ERROR MESSAGE
// ======================================================

const getPlacementCandidateErrorMessage = (
  error: unknown,
  fallback: string,
) => {
  if (axios.isAxiosError<PlacementCandidateApiError>(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
};

// ======================================================
// HOOK
// ======================================================

export const usePlacementCandidates = ({
  open,

  request,

  candidates,

  onStatusChange,
}: Props) => {
  const t = useTranslations("provider.placementRequests.candidatesModal");

  // ====================================================
  // REMOTE CANDIDATES
  // ====================================================

  const [remoteCandidateState, setRemoteCandidateState] =
    useState<RemoteCandidateState | null>(null);

  // ====================================================
  // REMOTE INTERVIEWS
  // ====================================================

  const [remoteInterviewState, setRemoteInterviewState] =
    useState<RemoteInterviewState | null>(null);

  // ====================================================
  // MANUAL REFRESH
  //
  // This state is changed only from user/action callbacks,
  // not directly inside useEffect.
  // ====================================================

  const [refreshingPlacementData, setRefreshingPlacementData] = useState(false);

  // ====================================================
  // CANDIDATE INTERVIEW CHECK
  // ====================================================

  const [loadingCandidateInterviewId, setLoadingCandidateInterviewId] =
    useState<string | null>(null);

  // ====================================================
  // INTERVIEW MODAL
  // ====================================================

  const [interviewCandidate, setInterviewCandidate] =
    useState<ProviderPlacementCandidate | null>(null);

  const [editingInterview, setEditingInterview] =
    useState<PlacementInterview | null>(null);

  // ====================================================
  // REJECTION
  // ====================================================

  const [rejectingCandidateId, setRejectingCandidateId] = useState<
    string | null
  >(null);

  const [rejectionReason, setRejectionReason] = useState("");

  // ====================================================
  // CURRENT REQUEST ID
  // ====================================================

  const recruitId = request?.recruitId ?? null;

  // ====================================================
  // CURRENT CANDIDATES
  // ====================================================

  const currentCandidates = useMemo(() => {
    if (recruitId && remoteCandidateState?.recruitId === recruitId) {
      return remoteCandidateState.data;
    }

    return candidates;
  }, [candidates, recruitId, remoteCandidateState]);

  // ====================================================
  // CURRENT INTERVIEWS
  // ====================================================

  const currentInterviews = useMemo(() => {
    if (recruitId && remoteInterviewState?.recruitId === recruitId) {
      return remoteInterviewState.data;
    }

    return [];
  }, [recruitId, remoteInterviewState]);

  // ====================================================
  // INITIAL LOADING
  //
  // Derived instead of using setLoading... inside effect.
  //
  // This is what fixes:
  //
  // "Calling setState synchronously within an effect..."
  // ====================================================

  const initialDataLoading =
    Boolean(open && recruitId) &&
    (remoteCandidateState?.recruitId !== recruitId ||
      remoteInterviewState?.recruitId !== recruitId);

  const loadingInterviewData = initialDataLoading || refreshingPlacementData;

  // ====================================================
  // INTERVIEW MAP
  // ====================================================

  const interviewMap = useMemo(() => {
    const map = new Map<string, PlacementInterview>();

    for (const interview of currentInterviews) {
      if (interview.placementCandidateId) {
        map.set(
          interview.placementCandidateId,

          interview,
        );
      }
    }

    return map;
  }, [currentInterviews]);

  // ====================================================
  // PLACED COUNT
  // ====================================================

  const placedCount = useMemo(() => {
    return currentCandidates.filter(
      (candidate) => candidate.status === "PLACED",
    ).length;
  }, [currentCandidates]);

  // ====================================================
  // INITIAL LOAD
  //
  // IMPORTANT:
  //
  // There is NO synchronous state update in this effect.
  //
  // We start the external request and update React state
  // only from promise callbacks.
  // ====================================================

  useEffect(() => {
    if (!open || !recruitId) {
      return;
    }

    let active = true;

    Promise.all([
      getProviderPlacementCandidates(recruitId),

      getProviderPlacementInterviews(),
    ])
      .then(([candidateResponse, interviewResponse]) => {
        if (!active) {
          return;
        }

        const candidateData = Array.isArray(candidateResponse.data)
          ? candidateResponse.data.filter(
              (candidate) => candidate.recruitId === recruitId,
            )
          : [];

        const candidateIds = new Set(
          candidateData.map((candidate) => candidate.placementCandidateId),
        );

        const interviewData = Array.isArray(interviewResponse.data)
          ? interviewResponse.data.filter(
              (interview) =>
                interview.recruitId === recruitId ||
                Boolean(
                  interview.placementCandidateId &&
                  candidateIds.has(interview.placementCandidateId),
                ),
            )
          : [];

        setRemoteCandidateState({
          recruitId,

          data: candidateData,
        });

        setRemoteInterviewState({
          recruitId,

          data: interviewData,
        });
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        // Mark this recruit as loaded even when request
        // fails so the loading indicator does not stay
        // active forever.

        setRemoteCandidateState({
          recruitId,

          data: [],
        });

        setRemoteInterviewState({
          recruitId,

          data: [],
        });

        toast.error(
          getPlacementCandidateErrorMessage(
            error,

            t("toast.loadCandidateFailed"),
          ),
        );
      });

    return () => {
      active = false;
    };
  }, [open, recruitId, t]);

  // ====================================================
  // MANUAL REFRESH
  //
  // This function is called from user/action callbacks.
  //
  // Therefore setRefreshingPlacementData is safe here.
  // ====================================================

  const refreshPlacementData = useCallback(async () => {
    if (!recruitId) {
      return;
    }

    try {
      setRefreshingPlacementData(true);

      const [candidateResponse, interviewResponse] = await Promise.all([
        getProviderPlacementCandidates(recruitId),

        getProviderPlacementInterviews(),
      ]);

      const candidateData = Array.isArray(candidateResponse.data)
        ? candidateResponse.data.filter(
            (candidate) => candidate.recruitId === recruitId,
          )
        : [];

      const candidateIds = new Set(
        candidateData.map((candidate) => candidate.placementCandidateId),
      );

      const interviewData = Array.isArray(interviewResponse.data)
        ? interviewResponse.data.filter(
            (interview) =>
              interview.recruitId === recruitId ||
              Boolean(
                interview.placementCandidateId &&
                candidateIds.has(interview.placementCandidateId),
              ),
          )
        : [];

      setRemoteCandidateState({
        recruitId,

        data: candidateData,
      });

      setRemoteInterviewState({
        recruitId,

        data: interviewData,
      });
    } catch (error: unknown) {
      toast.error(
        getPlacementCandidateErrorMessage(
          error,

          t("toast.loadCandidateFailed"),
        ),
      );
    } finally {
      setRefreshingPlacementData(false);
    }
  }, [recruitId, t]);

  // ====================================================
  // UPDATE CANDIDATE STATUS
  // ====================================================

  const updateCandidateStatus = async (
    placementCandidateId: string,

    payload: UpdateProviderPlacementCandidateStatusPayload,
  ) => {
    await onStatusChange(
      placementCandidateId,

      payload,
    );

    await refreshPlacementData();
  };

  // ====================================================
  // CLOSE REJECT
  // ====================================================

  const closeReject = () => {
    setRejectingCandidateId(null);

    setRejectionReason("");
  };

  // ====================================================
  // REJECT CANDIDATE
  // ====================================================

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

  // ====================================================
  // OPEN INTERVIEW
  //
  // First use already-loaded interview.
  //
  // If no interview exists in local state, safely check
  // the Provider interview API before creating one.
  // ====================================================

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

      if (!existingInterview) {
        existingInterview = await getProviderPlacementInterviewByCandidateId(
          candidate.placementCandidateId,
        );
      }

      setInterviewCandidate(candidate);

      setEditingInterview(existingInterview);
    } catch (error: unknown) {
      toast.error(
        getPlacementCandidateErrorMessage(
          error,

          t("toast.checkInterviewFailed"),
        ),
      );
    } finally {
      setLoadingCandidateInterviewId(null);
    }
  };

  // ====================================================
  // CLOSE INTERVIEW
  // ====================================================

  const closeScheduleInterview = () => {
    setInterviewCandidate(null);

    setEditingInterview(null);
  };

  // ====================================================
  // INTERVIEW SUCCESS
  // ====================================================

  const handleInterviewSuccess = async () => {
    await refreshPlacementData();
  };

  // ====================================================
  // RETURN
  // ====================================================

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
