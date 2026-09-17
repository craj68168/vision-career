"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";

import {
  closeProviderVacancy,
  deleteProviderPlacementRequest,
  getProviderApplications,
  getProviderPlacementCandidates,
  getProviderPlacementRequests,
  getProviderVacancies,
  submitProviderPlacementRequest,
  updateProviderPlacementCandidateStatus,
  updateProviderPlacementRequest,
} from "./api";

import type {
  ApiErrorResponse,
  CreatePlacementRequestPayload,
  PlacementRequest,
  ProviderApplication,
  ProviderDashboardTab,
  ProviderPlacementCandidate,
  UpdateProviderPlacementCandidateStatusPayload,
  Vacancy,
} from "./types";

// ======================================================
// PROVIDER DASHBOARD HOOK
// ======================================================

export const useProviderDashboard = () => {
  const router = useRouter();

  const { lang } = useLanguage();

  // ======================================================
  // DATA
  // ======================================================

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  const [applications, setApplications] = useState<ProviderApplication[]>([]);

  const [placementRequests, setPlacementRequests] = useState<
    PlacementRequest[]
  >([]);

  const [placementCandidates, setPlacementCandidates] = useState<
    ProviderPlacementCandidate[]
  >([]);

  // ======================================================
  // DASHBOARD
  // ======================================================

  const [activeTab, setActiveTab] = useState<ProviderDashboardTab>("vacancies");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  // ======================================================
  // CREATE VACANCY
  // ======================================================

  const [postVacancyOpen, setPostVacancyOpen] = useState(false);

  // ======================================================
  // CREATE PLACEMENT REQUEST
  // ======================================================

  const [placementRequestOpen, setPlacementRequestOpen] = useState(false);

  // ======================================================
  // PLACEMENT REQUEST VIEW
  // ======================================================

  const [viewPlacementRequest, setViewPlacementRequest] =
    useState<PlacementRequest | null>(null);

  // ======================================================
  // PLACEMENT REQUEST EDIT
  // ======================================================

  const [editPlacementRequest, setEditPlacementRequest] =
    useState<PlacementRequest | null>(null);

  // ======================================================
  // PLACEMENT REQUEST DELETE
  // ======================================================

  const [deletePlacementRequestTarget, setDeletePlacementRequestTarget] =
    useState<PlacementRequest | null>(null);

  // ======================================================
  // PLACEMENT REQUEST SUBMIT
  // ======================================================

  const [submitPlacementRequestTarget, setSubmitPlacementRequestTarget] =
    useState<PlacementRequest | null>(null);

  const [placementActionLoading, setPlacementActionLoading] = useState(false);

  // ======================================================
  // PLACEMENT CANDIDATES
  // ======================================================

  const [candidateRequest, setCandidateRequest] =
    useState<PlacementRequest | null>(null);

  const [candidateActionId, setCandidateActionId] = useState<string | null>(
    null,
  );

  // ======================================================
  // VIEW VACANCY
  // ======================================================

  const [viewVacancy, setViewVacancy] = useState<Vacancy | null>(null);

  // ======================================================
  // EDIT VACANCY
  // ======================================================

  const [editVacancy, setEditVacancy] = useState<Vacancy | null>(null);

  // ======================================================
  // DELETE VACANCY
  // ======================================================

  const [deleteVacancyTarget, setDeleteVacancyTarget] =
    useState<Vacancy | null>(null);

  // ======================================================
  // AUTH
  // ======================================================

  const redirectToLogin = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");

    router.replace(lang === "ja" ? "/auth" : "/en/auth");
  }, [lang, router]);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");

    if (!token || role !== "provider") {
      redirectToLogin();

      return false;
    }

    return true;
  }, [redirectToLogin]);

  // ======================================================
  // ERROR HANDLING
  // ======================================================

  const handleApiError = useCallback(
    (apiError: unknown) => {
      console.error("Provider dashboard error:", apiError);

      if (axios.isAxiosError<ApiErrorResponse>(apiError)) {
        const status = apiError.response?.status;

        if (status === 401 || status === 403) {
          redirectToLogin();

          return;
        }

        setError(
          apiError.response?.data?.message ||
            (lang === "ja"
              ? "ダッシュボードの読み込みに失敗しました"
              : "Failed to load provider dashboard."),
        );

        return;
      }

      setError(
        lang === "ja"
          ? "ダッシュボードの読み込みに失敗しました"
          : "Failed to load provider dashboard.",
      );
    },
    [lang, redirectToLogin],
  );

  const getActionErrorMessage = useCallback(
    (apiError: unknown, fallback: string) => {
      if (axios.isAxiosError<ApiErrorResponse>(apiError)) {
        if (
          apiError.response?.status === 401 ||
          apiError.response?.status === 403
        ) {
          redirectToLogin();
        }

        return apiError.response?.data?.message || fallback;
      }

      return fallback;
    },
    [redirectToLogin],
  );

  // ======================================================
  // LOAD DASHBOARD
  // ======================================================

  const loadDashboard = useCallback(
    async (showMainLoader = false) => {
      if (!checkAuth()) {
        return false;
      }

      try {
        if (showMainLoader) {
          setLoading(true);
        }

        setError("");

        const [
          vacancyResponse,
          applicationResponse,
          placementResponse,
          candidateResponse,
        ] = await Promise.all([
          getProviderVacancies(),
          getProviderApplications(),
          getProviderPlacementRequests(),
          getProviderPlacementCandidates(),
        ]);

        setVacancies(
          Array.isArray(vacancyResponse.data) ? vacancyResponse.data : [],
        );

        setApplications(
          Array.isArray(applicationResponse.data)
            ? applicationResponse.data
            : [],
        );

        setPlacementRequests(
          Array.isArray(placementResponse.data) ? placementResponse.data : [],
        );

        setPlacementCandidates(
          Array.isArray(candidateResponse.data) ? candidateResponse.data : [],
        );

        return true;
      } catch (apiError: unknown) {
        handleApiError(apiError);

        return false;
      } finally {
        if (showMainLoader) {
          setLoading(false);
        }
      }
    },
    [checkAuth, handleApiError],
  );

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    void loadDashboard(true);
  }, [loadDashboard]);

  // ======================================================
  // REFRESH
  // ======================================================

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      const success = await loadDashboard(false);

      if (success) {
        toast.success(
          lang === "ja" ? "最新情報に更新しました" : "Dashboard refreshed",
        );
      }
    } finally {
      setRefreshing(false);
    }
  }, [lang, loadDashboard]);

  // ======================================================
  // CREATE VACANCY
  // ======================================================

  const openPostVacancy = () => {
    setPostVacancyOpen(true);
  };

  const closePostVacancy = () => {
    setPostVacancyOpen(false);
  };

  const handleVacancyCreated = async () => {
    setPostVacancyOpen(false);

    setActiveTab("vacancies");

    await loadDashboard(false);
  };

  // ======================================================
  // VIEW VACANCY
  // ======================================================

  const openVacancyView = (vacancy: Vacancy) => {
    setViewVacancy(vacancy);
  };

  const closeVacancyView = () => {
    setViewVacancy(null);
  };

  // ======================================================
  // EDIT VACANCY
  // ======================================================

  const openVacancyEdit = (vacancy: Vacancy) => {
    setViewVacancy(null);

    window.setTimeout(() => {
      setEditVacancy(vacancy);
    }, 0);
  };

  const closeVacancyEdit = () => {
    setEditVacancy(null);
  };

  const handleVacancyUpdated = async () => {
    setEditVacancy(null);

    setActiveTab("vacancies");

    await loadDashboard(false);
  };

  // ======================================================
  // DELETE VACANCY
  // ======================================================

  const openVacancyDelete = (vacancy: Vacancy) => {
    setDeleteVacancyTarget(vacancy);
  };

  const closeVacancyDelete = () => {
    setDeleteVacancyTarget(null);
  };

  const handleVacancyDeleted = async () => {
    setDeleteVacancyTarget(null);

    setActiveTab("vacancies");

    await loadDashboard(false);
  };

  // ======================================================
  // CLOSE VACANCY
  // ======================================================

  const handleCloseVacancy = async (vacancy: Vacancy) => {
    if (vacancy.status !== "published") {
      toast.error(
        lang === "ja"
          ? "公開中の求人のみ終了できます"
          : "Only published vacancies can be closed.",
      );

      return;
    }

    const confirmed = window.confirm(
      lang === "ja"
        ? `「${vacancy.title}」の掲載を終了しますか？`
        : `Close "${vacancy.title}"? It will no longer appear to job seekers.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await closeProviderVacancy(vacancy.vacancyId);

      toast.success(
        lang === "ja"
          ? "求人の掲載を終了しました"
          : "Vacancy closed successfully.",
      );

      await loadDashboard(false);
    } catch (apiError: unknown) {
      toast.error(
        getActionErrorMessage(
          apiError,
          lang === "ja"
            ? "求人の終了に失敗しました"
            : "Failed to close vacancy.",
        ),
      );
    }
  };

  // ======================================================
  // CREATE PLACEMENT REQUEST
  // ======================================================

  const openPlacementRequest = () => {
    setPlacementRequestOpen(true);
  };

  const closePlacementRequest = () => {
    setPlacementRequestOpen(false);
  };

  const handlePlacementCreated = async () => {
    setPlacementRequestOpen(false);

    setActiveTab("placement-requests");

    await loadDashboard(false);
  };

  // ======================================================
  // VIEW PLACEMENT REQUEST
  // ======================================================

  const openPlacementRequestView = (request: PlacementRequest) => {
    setViewPlacementRequest(request);
  };

  const closePlacementRequestView = () => {
    setViewPlacementRequest(null);
  };

  // ======================================================
  // EDIT PLACEMENT REQUEST
  // ======================================================

  const openPlacementRequestEdit = (request: PlacementRequest) => {
    if (!["draft", "rejected"].includes(request.status)) {
      toast.error(
        lang === "ja"
          ? "この採用依頼は編集できません。"
          : "This placement request cannot be edited.",
      );

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

      toast.success(
        response.message ||
          (lang === "ja"
            ? "採用依頼を更新しました。"
            : "Placement request updated."),
      );

      setEditPlacementRequest(null);

      await loadDashboard(false);
    } catch (apiError: unknown) {
      toast.error(
        getActionErrorMessage(
          apiError,
          lang === "ja"
            ? "採用依頼の更新に失敗しました。"
            : "Failed to update placement request.",
        ),
      );
    } finally {
      setPlacementActionLoading(false);
    }
  };

  // ======================================================
  // DELETE PLACEMENT REQUEST
  // ======================================================

  const openPlacementRequestDelete = (request: PlacementRequest) => {
    if (!["draft", "rejected"].includes(request.status)) {
      toast.error(
        lang === "ja"
          ? "この採用依頼は削除できません。"
          : "This placement request cannot be deleted.",
      );

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

      toast.success(
        response.message ||
          (lang === "ja"
            ? "採用依頼を削除しました。"
            : "Placement request deleted."),
      );

      setDeletePlacementRequestTarget(null);

      await loadDashboard(false);
    } catch (apiError: unknown) {
      toast.error(
        getActionErrorMessage(
          apiError,
          lang === "ja"
            ? "採用依頼の削除に失敗しました。"
            : "Failed to delete placement request.",
        ),
      );
    } finally {
      setPlacementActionLoading(false);
    }
  };

  // ======================================================
  // SUBMIT PLACEMENT REQUEST
  // ======================================================

  const openPlacementRequestSubmit = (request: PlacementRequest) => {
    if (!["draft", "rejected"].includes(request.status)) {
      toast.error(
        lang === "ja"
          ? "この採用依頼は送信できません。"
          : "This placement request cannot be submitted.",
      );

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

      toast.success(
        response.message ||
          (lang === "ja"
            ? "管理者審査へ送信しました。"
            : "Placement request submitted for Admin review."),
      );

      setSubmitPlacementRequestTarget(null);

      await loadDashboard(false);
    } catch (apiError: unknown) {
      toast.error(
        getActionErrorMessage(
          apiError,
          lang === "ja"
            ? "採用依頼の送信に失敗しました。"
            : "Failed to submit placement request.",
        ),
      );
    } finally {
      setPlacementActionLoading(false);
    }
  };

  // ======================================================
  // PROVIDER PLACEMENT CANDIDATES
  // ======================================================

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

  const openPlacementCandidates = (request: PlacementRequest) => {
    if (request.status !== "approved") {
      toast.error(
        lang === "ja"
          ? "承認済みの採用依頼のみ候補者を確認できます。"
          : "Candidates are available only for approved placement requests.",
      );

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
    } catch (apiError: unknown) {
      toast.error(
        getActionErrorMessage(
          apiError,
          lang === "ja"
            ? "候補者情報の更新に失敗しました。"
            : "Failed to refresh matched candidates.",
        ),
      );
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

      toast.success(
        response.message ||
          (lang === "ja"
            ? "候補者のステータスを更新しました。"
            : "Candidate status updated."),
      );

      await refreshPlacementCandidates();
    } catch (apiError: unknown) {
      toast.error(
        getActionErrorMessage(
          apiError,
          lang === "ja"
            ? "候補者ステータスの更新に失敗しました。"
            : "Failed to update candidate status.",
        ),
      );
    } finally {
      setCandidateActionId(null);
    }
  };

  // ======================================================
  // FILTER VACANCIES
  // ======================================================

  const filteredVacancies = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return vacancies;
    }

    return vacancies.filter((vacancy) => {
      const haystack = [
        vacancy.vacancyId,
        vacancy.companyName,
        vacancy.companyNameKana,
        vacancy.title,
        vacancy.titleKana,
        vacancy.employmentType,
        vacancy.workLocation,
        vacancy.japaneseLevel,
        vacancy.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [vacancies, search]);

  // ======================================================
  // FILTER APPLICATIONS
  // ======================================================

  const filteredApplications = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return applications;
    }

    return applications.filter((application) => {
      const applicant = application.applicant;
      const vacancy = application.vacancy;

      const haystack = [
        application.application_id,
        application.vacancy_id,
        application.status,

        applicant?.name,
        applicant?.nationality,
        applicant?.visa_type,
        applicant?.japanese_level,
        applicant?.desired_job,
        applicant?.desired_location,

        ...(applicant?.skills || []),

        vacancy?.vacancyId,
        vacancy?.title,
        vacancy?.titleKana,
        vacancy?.companyName,
        vacancy?.employmentType,
        vacancy?.workLocation,
        vacancy?.japaneseLevel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [applications, search]);

  // ======================================================
  // FILTER PLACEMENT REQUESTS
  // ======================================================

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

  // ======================================================
  // COUNTS
  // ======================================================

  const totalVacancies = vacancies.length;

  const publishedCount = vacancies.filter(
    (vacancy) => vacancy.status === "published",
  ).length;

  const pendingVacancyCount = vacancies.filter(
    (vacancy) =>
      vacancy.status === "pending_review" || vacancy.status === "draft",
  ).length;

  const totalApplications = applications.length;

  const sentToProviderCount = applications.filter(
    (application) => application.status === "SENT_TO_PROVIDER",
  ).length;

  const underReviewCount = applications.filter(
    (application) => application.status === "UNDER_REVIEW",
  ).length;

  const interviewCount = applications.filter(
    (application) => application.status === "INTERVIEW",
  ).length;

  const selectedCount = applications.filter(
    (application) => application.status === "SELECTED",
  ).length;

  const hiredCount = applications.filter(
    (application) => application.status === "HIRED",
  ).length;

  const rejectedApplicationCount = applications.filter(
    (application) => application.status === "REJECTED",
  ).length;

  const totalPlacementRequests = placementRequests.length;

  // ======================================================
  // RETURN
  // ======================================================

  return {
    lang,

    loading,
    refreshing,
    error,

    activeTab,
    setActiveTab,

    search,
    setSearch,

    vacancies,
    applications,
    placementRequests,
    placementCandidates,

    filteredVacancies,
    filteredApplications,
    filteredPlacementRequests,

    totalVacancies,
    publishedCount,
    pendingVacancyCount,

    totalApplications,

    sentToProviderCount,
    underReviewCount,
    interviewCount,
    selectedCount,
    hiredCount,
    rejectedApplicationCount,

    totalPlacementRequests,

    // VACANCY CREATE

    postVacancyOpen,
    openPostVacancy,
    closePostVacancy,
    handleVacancyCreated,

    // VACANCY VIEW

    viewVacancy,
    openVacancyView,
    closeVacancyView,

    // VACANCY EDIT

    editVacancy,
    openVacancyEdit,
    closeVacancyEdit,
    handleVacancyUpdated,

    // VACANCY DELETE

    deleteVacancyTarget,
    openVacancyDelete,
    closeVacancyDelete,
    handleVacancyDeleted,

    handleCloseVacancy,

    // PLACEMENT CREATE

    placementRequestOpen,
    openPlacementRequest,
    closePlacementRequest,
    handlePlacementCreated,

    // PLACEMENT VIEW

    viewPlacementRequest,
    openPlacementRequestView,
    closePlacementRequestView,

    // PLACEMENT EDIT

    editPlacementRequest,
    openPlacementRequestEdit,
    closePlacementRequestEdit,
    handlePlacementRequestUpdate,

    // PLACEMENT DELETE

    deletePlacementRequestTarget,
    openPlacementRequestDelete,
    closePlacementRequestDelete,
    handlePlacementRequestDelete,

    // PLACEMENT SUBMIT

    submitPlacementRequestTarget,
    openPlacementRequestSubmit,
    closePlacementRequestSubmit,
    handlePlacementRequestSubmit,

    placementActionLoading,

    // PLACEMENT CANDIDATES

    placementCandidateCounts,

    candidateRequest,
    candidateRequestCandidates,

    openPlacementCandidates,
    closePlacementCandidates,

    candidateActionId,

    handlePlacementCandidateStatus,
    refreshPlacementCandidates,

    // REFRESH

    handleRefresh,
  };
};
