"use client";

import { useCallback, useEffect, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useLanguage } from "@/context/LanguageContext";

import { getProviderVacancies } from "./vacancies/api";

import { getProviderApplications } from "./applications/api";

import { getProviderPlacementRequests } from "./placement-requests/api";

import type {
  ProviderDashboardApiError,
  ProviderDashboardSummary,
  ProviderDashboardTab,
} from "./types";

// ======================================================
// EMPTY SUMMARY
// ======================================================

const EMPTY_SUMMARY: ProviderDashboardSummary = {
  totalVacancies: 0,

  publishedCount: 0,

  pendingVacancyCount: 0,

  totalApplications: 0,

  totalPlacementRequests: 0,
};

// ======================================================
// PROVIDER DASHBOARD SHELL HOOK
//
// IMPORTANT:
//
// Feature-specific data/state now lives inside:
//
// vacancies/hook.ts
// applications/hook.ts
// placement-requests/hook.ts
// billing/hook.ts
//
// This hook only manages:
// - authentication
// - dashboard tabs
// - summary cards
// - global refresh
// ======================================================

export const useProviderDashboard = () => {
  const router = useRouter();
  const t = useTranslations("provider.dashboard");

  const { lang } = useLanguage();

  // ====================================================
  // DASHBOARD
  // ====================================================

  const [activeTab, setActiveTab] = useState<ProviderDashboardTab>("vacancies");

  const [summary, setSummary] =
    useState<ProviderDashboardSummary>(EMPTY_SUMMARY);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  // ====================================================
  // FEATURE REFRESH SIGNAL
  // ====================================================

  const [refreshVersion, setRefreshVersion] = useState(0);

  // ====================================================
  // HEADER CREATE VACANCY SIGNAL
  // ====================================================

  const [vacancyCreateSignal, setVacancyCreateSignal] = useState(0);

  // ====================================================
  // AUTH
  // ====================================================

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

  // ====================================================
  // ERROR
  // ====================================================

  const handleApiError = useCallback(
    (apiError: unknown) => {
      console.error("Provider dashboard summary error:", apiError);

      if (axios.isAxiosError<ProviderDashboardApiError>(apiError)) {
        const status = apiError.response?.status;

        if (status === 401 || status === 403) {
          redirectToLogin();

          return;
        }

        setError(apiError.response?.data?.message || t("loadFailed"));

        return;
      }

      setError(t("loadFailed"));
    },
    [redirectToLogin, t],
  );

  // ====================================================
  // LOAD SUMMARY
  // ====================================================

  const loadSummary = useCallback(
    async (showMainLoader = false) => {
      if (!checkAuth()) {
        return false;
      }

      try {
        if (showMainLoader) {
          setLoading(true);
        }

        setError("");

        const [vacancyResponse, applicationResponse, placementResponse] =
          await Promise.all([
            getProviderVacancies(),

            getProviderApplications(),

            getProviderPlacementRequests(),
          ]);

        const vacancies = Array.isArray(vacancyResponse.data)
          ? vacancyResponse.data
          : [];

        const applications = Array.isArray(applicationResponse.data)
          ? applicationResponse.data
          : [];

        const placementRequests = Array.isArray(placementResponse.data)
          ? placementResponse.data
          : [];

        setSummary({
          totalVacancies: vacancies.length,

          publishedCount: vacancies.filter(
            (vacancy) => vacancy.status === "published",
          ).length,

          pendingVacancyCount: vacancies.filter(
            (vacancy) =>
              vacancy.status === "pending_review" || vacancy.status === "draft",
          ).length,

          totalApplications: applications.length,

          totalPlacementRequests: placementRequests.length,
        });

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

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    void loadSummary(true);
  }, [loadSummary]);

  // ====================================================
  // TAB
  // ====================================================

  const changeActiveTab = (tab: ProviderDashboardTab) => {
    setActiveTab(tab);
  };

  // ====================================================
  // GLOBAL REFRESH
  // ====================================================

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      const success = await loadSummary(false);

      setRefreshVersion((previous) => previous + 1);

      if (success) {
        toast.success(t("refreshed"));
      }
    } finally {
      setRefreshing(false);
    }
  }, [loadSummary, t]);

  // ====================================================
  // FEATURE DATA CHANGED
  // ====================================================

  const handleFeatureChanged = useCallback(async () => {
    await loadSummary(false);
  }, [loadSummary]);

  // ====================================================
  // HEADER POST VACANCY
  // ====================================================

  const requestPostVacancy = () => {
    setActiveTab("vacancies");

    setVacancyCreateSignal((previous) => previous + 1);
  };

  // ====================================================
  // RETURN
  // ====================================================

  return {
    lang,

    loading,

    refreshing,

    error,

    activeTab,

    changeActiveTab,

    summary,

    refreshVersion,

    vacancyCreateSignal,

    requestPostVacancy,

    handleRefresh,
    handleFeatureChanged,
  };
};
