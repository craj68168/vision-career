"use client";

import { useEffect, useMemo, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { getProviderApplications } from "./api";

import type { ApplicationApiError, ProviderApplication } from "./types";

type Props = {
  refreshVersion: number;
};

export const useApplications = ({ refreshVersion }: Props) => {
  const t = useTranslations("provider.applications.list");

  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ====================================================
  // INITIAL LOAD / PARENT REFRESH
  // ====================================================

  useEffect(() => {
    let active = true;

    getProviderApplications()
      .then((response) => {
        if (!active) {
          return;
        }

        setApplications(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        if (axios.isAxiosError<ApplicationApiError>(error)) {
          toast.error(error.response?.data?.message || t("loadFailed"));
          return;
        }

        toast.error(t("loadFailed"));
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [refreshVersion, t]);

  // ====================================================
  // SEARCH / FILTER
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

  // ====================================================
  // MANUAL REFRESH
  // ====================================================

  const refresh = async () => {
    try {
      setRefreshing(true);

      const response = await getProviderApplications();

      setApplications(Array.isArray(response.data) ? response.data : []);
    } catch (error: unknown) {
      if (axios.isAxiosError<ApplicationApiError>(error)) {
        toast.error(error.response?.data?.message || t("loadFailed"));
        return;
      }

      toast.error(t("loadFailed"));
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
