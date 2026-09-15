"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import axios from "axios";

import { useLanguage } from "@/context/LanguageContext";

import { getDashboardProfileStatus } from "./api";

import type {
  ApiErrorResponse,
  Application,
  DashboardTab,
  MissingField,
  Vacancy,
} from "./types";

export const useJobSeekerDashboard = () => {
  const router = useRouter();

  const { lang } = useLanguage();

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  const [applications, setApplications] = useState<Application[]>([]);

  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const [profileCompletionPercentage, setProfileCompletionPercentage] =
    useState(0);

  const [missingFields, setMissingFields] = useState<MissingField[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState<DashboardTab>("available");

  // ============================================
  // AUTH
  // ============================================

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("access_token");

    const role = localStorage.getItem("user_role");

    if (!token || role !== "seeker") {
      router.replace(
        lang === "ja" ? "/job-seekers-auth" : "/en/job-seekers-auth",
      );

      return false;
    }

    return true;
  }, [router, lang]);

  // ============================================
  // PROFILE STATUS
  // ============================================

  const loadProfileStatus = useCallback(async () => {
    const authenticated = checkAuth();

    if (!authenticated) {
      return;
    }

    try {
      const data = await getDashboardProfileStatus();

      if (data.status !== "success") {
        throw new Error(data.message || "Failed to load profile.");
      }

      setIsProfileComplete(data.is_complete);

      setProfileCompletionPercentage(data.completion_percentage);

      setMissingFields(data.missing_fields || []);
    } catch (error: unknown) {
      console.error("Dashboard profile error:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("access_token");

          localStorage.removeItem("user_role");

          router.replace(
            lang === "ja" ? "/job-seekers-auth" : "/en/job-seekers-auth",
          );

          return;
        }

        setError(error.response?.data?.message || "Failed to load dashboard.");

        return;
      }

      setError(
        lang === "ja"
          ? "ダッシュボードの読み込みに失敗しました"
          : "Failed to load dashboard.",
      );
    }
  }, [checkAuth, lang, router]);

  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        await loadProfileStatus();

        /*
            Temporary.

            Vacancies and applications
            will be loaded here after
            their GET APIs are created.
          */

        setVacancies([]);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [loadProfileStatus]);

  // ============================================
  // APPLIED VACANCY IDS
  // ============================================

  const appliedVacancyIds = useMemo(() => {
    return new Set(applications.map((application) => application.vacancy_id));
  }, [applications]);

  // ============================================
  // FILTER AVAILABLE JOBS
  // ============================================

  const filteredVacancies = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const available = vacancies.filter(
      (vacancy) => !appliedVacancyIds.has(vacancy.vacancy_id),
    );

    if (!keyword) {
      return available;
    }

    return available.filter((vacancy) => {
      const haystack = [
        vacancy.title,
        vacancy.employment_type,
        vacancy.work_location,
        vacancy.job_description,
        vacancy.required_skills,
        vacancy.preferred_skills,
        vacancy.japanese_level,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [vacancies, search, appliedVacancyIds]);

  // ============================================
  // FILTER APPLICATIONS
  // ============================================

  const filteredApplications = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return applications;
    }

    return applications.filter((application) => {
      const haystack = [
        application.vacancy?.title,
        application.vacancy?.employment_type,
        application.vacancy?.work_location,
        application.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [applications, search]);

  // ============================================
  // COUNTS
  // ============================================

  const availableCount = filteredVacancies.length;

  const appliedCount = applications.length;

  const inProgressCount = applications.filter((application) =>
    [
      "PENDING_ADMIN_APPROVAL",
      "ADMIN_APPROVED",
      "SENT_TO_PROVIDER",
      "PROVIDER_REVIEWING",
      "SHORTLISTED",
      "INTERVIEW",
    ].includes(application.status),
  ).length;

  return {
    lang,

    loading,
    error,

    vacancies,
    applications,

    isProfileComplete,
    profileCompletionPercentage,
    missingFields,

    search,
    setSearch,

    activeTab,
    setActiveTab,

    filteredVacancies,
    filteredApplications,

    availableCount,
    appliedCount,
    inProgressCount,

    refreshProfileStatus: loadProfileStatus,
  };
};
