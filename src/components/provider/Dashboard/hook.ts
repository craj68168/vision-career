"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";

import { getProviderPlacementRequests, getProviderVacancies } from "./api";

import type {
  ApiErrorResponse,
  PlacementRequest,
  ProviderApplication,
  ProviderDashboardTab,
  Vacancy,
} from "./types";

export const useProviderDashboard = () => {
  const router = useRouter();

  const { lang } = useLanguage();

  // ======================================================
  // DATA
  // ======================================================

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  /*
   * Provider applications backend API
   * is not implemented yet.
   *
   * Keep the state because the UI/tab will
   * be connected later.
   */
  const [applications] = useState<ProviderApplication[]>([]);

  const [placementRequests, setPlacementRequests] = useState<
    PlacementRequest[]
  >([]);

  // ======================================================
  // UI
  // ======================================================

  const [activeTab, setActiveTab] = useState<ProviderDashboardTab>("vacancies");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [postVacancyOpen, setPostVacancyOpen] = useState(false);

  const [placementRequestOpen, setPlacementRequestOpen] = useState(false);

  // ======================================================
  // AUTH
  // ======================================================

  const redirectToLogin = useCallback(() => {
    localStorage.removeItem("access_token");

    localStorage.removeItem("user_role");

    localStorage.removeItem("provider_register_id");

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
  // API ERROR
  // ======================================================

  const handleApiError = useCallback(
    (error: unknown) => {
      console.error("Provider dashboard error:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          redirectToLogin();

          return;
        }

        setError(
          error.response?.data?.message || "Failed to load provider dashboard.",
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

        const [vacancyResponse, placementResponse] = await Promise.all([
          getProviderVacancies(),

          getProviderPlacementRequests(),
        ]);

        // ----------------------------------------------
        // Vacancies
        // ----------------------------------------------

        setVacancies(
          Array.isArray(vacancyResponse.data) ? vacancyResponse.data : [],
        );

        // ----------------------------------------------
        // Placement / Recruit Requests
        // ----------------------------------------------

        setPlacementRequests(
          Array.isArray(placementResponse.data) ? placementResponse.data : [],
        );

        return true;
      } catch (error: unknown) {
        handleApiError(error);

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
  // MODAL ACTIONS
  // ======================================================

  const openPostVacancy = () => {
    setPostVacancyOpen(true);
  };

  const closePostVacancy = () => {
    setPostVacancyOpen(false);
  };

  const openPlacementRequest = () => {
    setPlacementRequestOpen(true);
  };

  const closePlacementRequest = () => {
    setPlacementRequestOpen(false);
  };

  // ======================================================
  // CREATED VACANCY
  // ======================================================

  const handleVacancyCreated = async () => {
    setPostVacancyOpen(false);

    setActiveTab("vacancies");

    await loadDashboard(false);
  };

  // ======================================================
  // CREATED PLACEMENT REQUEST
  // ======================================================

  const handlePlacementCreated = async () => {
    setPlacementRequestOpen(false);

    setActiveTab("placement-requests");

    await loadDashboard(false);
  };

  // ======================================================
  // VACANCY FILTER
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
  // APPLICATION FILTER
  // ======================================================

  const filteredApplications = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return applications;
    }

    return applications.filter((application) => {
      const haystack = [
        application.application_id,
        application.vacancy_id,
        application.status,
        application.vacancy?.title,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [applications, search]);

  // ======================================================
  // PLACEMENT FILTER
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

  const activePlacementCount = placementRequests.filter(
    (request) =>
      !["approved", "rejected", "closed", "cancelled"].includes(
        request.status || "",
      ),
  ).length;

  return {
    lang,

    // state
    loading,
    refreshing,
    error,

    activeTab,
    setActiveTab,

    search,
    setSearch,

    // data
    vacancies,
    applications,
    placementRequests,

    // filtered
    filteredVacancies,
    filteredApplications,
    filteredPlacementRequests,

    // counts
    totalVacancies,
    publishedCount,
    pendingVacancyCount,
    totalApplications,
    activePlacementCount,

    // modal state
    postVacancyOpen,
    placementRequestOpen,

    // modal actions
    openPostVacancy,
    closePostVacancy,

    openPlacementRequest,
    closePlacementRequest,

    // data actions
    handleRefresh,

    handleVacancyCreated,

    handlePlacementCreated,
  };
};
