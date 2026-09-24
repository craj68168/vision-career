"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import axios from "axios";

import { useRouter } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";

import {
  getAvailableVacancies,
  getDashboardProfileStatus,
  getMyApplications,
  getMyInterviews,
} from "./api";

import type {
  ApiErrorResponse,
  Application,
  DashboardTab,
  MissingField,
  SeekerInterview,
  Vacancy,
} from "./types";

export const useJobSeekerDashboard = () => {
  const router = useRouter();

  const { lang } = useLanguage();

  // ==================================================
  // DATA
  // ==================================================

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  const [applications, setApplications] = useState<Application[]>([]);

  const [interviews, setInterviews] = useState<SeekerInterview[]>([]);

  // ==================================================
  // PROFILE
  // ==================================================

  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const [profileCompletionPercentage, setProfileCompletionPercentage] =
    useState(0);

  const [missingFields, setMissingFields] = useState<MissingField[]>([]);

  // ==================================================
  // DASHBOARD UI
  // ==================================================

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState<DashboardTab>("available");

  // ==================================================
  // APPLY MODAL
  // ==================================================

  const [applyVacancy, setApplyVacancy] = useState<Vacancy | null>(null);

  // ==================================================
  // AUTH REDIRECT
  // ==================================================

  const redirectToLogin = useCallback(() => {
    localStorage.removeItem("access_token");

    localStorage.removeItem("user_role");

    router.replace(
      lang === "ja" ? "/job-seekers-auth" : "/en/job-seekers-auth",
    );
  }, [lang, router]);

  // ==================================================
  // CHECK AUTH
  // ==================================================

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("access_token");

    const role = localStorage.getItem("user_role");

    if (!token || role !== "seeker") {
      redirectToLogin();

      return false;
    }

    return true;
  }, [redirectToLogin]);

  // ==================================================
  // API ERROR
  // ==================================================

  const handleApiError = useCallback(
    (apiError: unknown) => {
      console.error("Job seeker dashboard error:", apiError);

      if (axios.isAxiosError<ApiErrorResponse>(apiError)) {
        if (
          apiError.response?.status === 401 ||
          apiError.response?.status === 403
        ) {
          redirectToLogin();

          return;
        }

        setError(
          apiError.response?.data?.message || "Failed to load dashboard.",
        );

        return;
      }

      setError(
        lang === "ja"
          ? "ダッシュボードの読み込みに失敗しました"
          : "Failed to load dashboard.",
      );
    },
    [lang, redirectToLogin],
  );

  // ==================================================
  // LOAD DASHBOARD
  // ==================================================

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
          profileResponse,
          vacancyResponse,
          applicationResponse,
          interviewResponse,
        ] = await Promise.all([
          getDashboardProfileStatus(),

          getAvailableVacancies(),

          getMyApplications(),

          getMyInterviews(),
        ]);

        // ==========================================
        // PROFILE
        // ==========================================

        if (profileResponse.status !== "success") {
          throw new Error(profileResponse.message || "Failed to load profile.");
        }

        setIsProfileComplete(profileResponse.is_complete);

        setProfileCompletionPercentage(profileResponse.completion_percentage);

        setMissingFields(profileResponse.missing_fields || []);

        // ==========================================
        // AVAILABLE VACANCIES
        // ==========================================

        setVacancies(
          Array.isArray(vacancyResponse.data) ? vacancyResponse.data : [],
        );

        // ==========================================
        // APPLICATIONS
        // ==========================================

        setApplications(
          Array.isArray(applicationResponse.data)
            ? applicationResponse.data
            : [],
        );

        // ==========================================
        // INTERVIEWS
        // ==========================================

        setInterviews(
          Array.isArray(interviewResponse.data) ? interviewResponse.data : [],
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

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    void loadDashboard(true);
  }, [loadDashboard]);

  // ==================================================
  // REFRESH
  // ==================================================

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await loadDashboard(false);
    } finally {
      setRefreshing(false);
    }
  }, [loadDashboard]);

  // ==================================================
  // OPEN APPLY
  // ==================================================

  const openApplyVacancy = (vacancy: Vacancy) => {
    if (!isProfileComplete) {
      return;
    }

    setApplyVacancy(vacancy);
  };

  // ==================================================
  // CLOSE APPLY
  // ==================================================

  const closeApplyVacancy = () => {
    setApplyVacancy(null);
  };

  // ==================================================
  // APPLICATION SUBMITTED
  // ==================================================

  const handleApplicationSubmitted = async () => {
    setApplyVacancy(null);

    await loadDashboard(false);

    setActiveTab("applied");
  };

  // ==================================================
  // FILTER AVAILABLE VACANCIES
  // ==================================================

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

        vacancy.jobDescription,

        vacancy.requiredSkills,

        vacancy.preferredSkills,

        vacancy.requiredEducation,

        vacancy.requiredExperience,

        vacancy.japaneseLevel,

        vacancy.remoteWork,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [vacancies, search]);

  // ==================================================
  // FILTER APPLICATIONS
  // ==================================================

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

        application.vacancy?.companyName,

        application.vacancy?.title,

        application.vacancy?.employmentType,

        application.vacancy?.workLocation,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [applications, search]);

  // ==================================================
  // FILTER INTERVIEWS
  // ==================================================

  const filteredInterviews = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return interviews;
    }

    return interviews.filter((interview) => {
      const haystack = [
        interview.interviewId,

        interview.applicationId,

        interview.vacancyId,

        interview.status,

        interview.interviewMethod,

        interview.timezone,

        interview.vacancy?.companyName,

        interview.vacancy?.title,

        interview.vacancy?.employmentType,

        interview.vacancy?.workLocation,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [interviews, search]);

  // ==================================================
  // COUNTS
  // ==================================================

  const availableCount = vacancies.length;

  const appliedCount = applications.length;

  const inProgressCount = applications.filter((application) =>
    ["SENT_TO_PROVIDER", "UNDER_REVIEW", "INTERVIEW", "SELECTED"].includes(
      application.status,
    ),
  ).length;

  const interviewCount = interviews.filter(
    (interview) => interview.status === "CONFIRMED",
  ).length;

  // ==================================================
  // RETURN
  // ==================================================

  return {
    lang,

    loading,
    refreshing,
    error,

    vacancies,
    applications,
    interviews,

    isProfileComplete,
    profileCompletionPercentage,
    missingFields,

    search,
    setSearch,

    activeTab,
    setActiveTab,

    filteredVacancies,
    filteredApplications,
    filteredInterviews,

    availableCount,
    appliedCount,
    inProgressCount,
    interviewCount,

    applyVacancy,

    openApplyVacancy,
    closeApplyVacancy,

    handleApplicationSubmitted,

    loadDashboard,
    handleRefresh,
  };
};
