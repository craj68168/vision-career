"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { getProviderApplications } from "./api";

import type { ApplicationApiError, ProviderApplication } from "./types";

type Props = {
  lang: string;

  refreshVersion: number;
};

export const useApplications = ({ lang, refreshVersion }: Props) => {
  const [applications, setApplications] = useState<ProviderApplication[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  // ====================================================
  // LOAD
  // ====================================================

  const loadApplications = useCallback(async () => {
    try {
      const response = await getProviderApplications();

      setApplications(Array.isArray(response.data) ? response.data : []);
    } catch (error: unknown) {
      if (axios.isAxiosError<ApplicationApiError>(error)) {
        toast.error(
          error.response?.data?.message ||
            (lang === "ja"
              ? "応募者情報の読み込みに失敗しました。"
              : "Failed to load applications."),
        );

        return;
      }

      toast.error(
        lang === "ja"
          ? "応募者情報の読み込みに失敗しました。"
          : "Failed to load applications.",
      );
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications, refreshVersion]);

  // ====================================================
  // FILTER
  // ====================================================

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

  const refresh = async () => {
    try {
      setRefreshing(true);

      await loadApplications();
    } finally {
      setRefreshing(false);
    }
  };

  return {
    loading,

    refreshing,

    search,

    setSearch,

    filteredApplications,

    refresh,
  };
};
