"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";

import {
  closeProviderVacancy,
  getProviderPlacementRequests,
  getProviderVacancies,
} from "./api";

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
   * Provider applications API is not connected yet.
   * Keep this empty until we build that endpoint.
   */
  const [applications] = useState<ProviderApplication[]>([]);

  const [placementRequests, setPlacementRequests] = useState<
    PlacementRequest[]
  >([]);

  // ======================================================
  // DASHBOARD UI
  // ======================================================

  const [activeTab, setActiveTab] = useState<ProviderDashboardTab>("vacancies");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  // ======================================================
  // CREATE VACANCY MODAL
  // ======================================================

  const [postVacancyOpen, setPostVacancyOpen] = useState(false);

  // ======================================================
  // PLACEMENT REQUEST MODAL
  // ======================================================

  const [placementRequestOpen, setPlacementRequestOpen] = useState(false);

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

        setVacancies(
          Array.isArray(vacancyResponse.data) ? vacancyResponse.data : [],
        );

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
  // CLOSE PUBLISHED VACANCY
  // ======================================================

  const handleCloseVacancy = async (vacancy: Vacancy) => {
    /*
     * Only published vacancies
     * should be closed.
     */
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
    } catch (error: unknown) {
      console.error("Close vacancy error:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message || "Failed to close vacancy.",
        );

        return;
      }

      toast.error(
        lang === "ja" ? "求人の終了に失敗しました" : "Failed to close vacancy.",
      );
    }
  };

  // ======================================================
  // PLACEMENT REQUEST
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

  const activePlacementCount = placementRequests.filter(
    (request) =>
      !["approved", "rejected", "closed", "cancelled"].includes(
        request.status || "",
      ),
  ).length;

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

    filteredVacancies,
    filteredApplications,
    filteredPlacementRequests,

    totalVacancies,
    publishedCount,
    pendingVacancyCount,
    totalApplications,
    activePlacementCount,

    // CREATE
    postVacancyOpen,

    openPostVacancy,
    closePostVacancy,

    handleVacancyCreated,

    // VIEW
    viewVacancy,

    openVacancyView,
    closeVacancyView,

    // EDIT
    editVacancy,

    openVacancyEdit,
    closeVacancyEdit,

    handleVacancyUpdated,

    // DELETE
    deleteVacancyTarget,

    openVacancyDelete,
    closeVacancyDelete,

    handleVacancyDeleted,

    // CLOSE
    handleCloseVacancy,

    // PLACEMENT
    placementRequestOpen,

    openPlacementRequest,
    closePlacementRequest,

    handlePlacementCreated,

    // REFRESH
    handleRefresh,
  };
};
