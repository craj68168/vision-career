"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import axios from "axios";

import toast from "react-hot-toast";

import { useTranslations } from "next-intl";

import { closeProviderVacancy, getProviderVacancies } from "./api";

import { getProviderProfile } from "../../Profile/api";

import type { Vacancy, VacancyApiError } from "./types";

type Props = {
  lang: string;

  refreshVersion: number;

  createSignal: number;

  onDataChanged: () => void | Promise<void>;
};

// ======================================================
// ERROR MESSAGE
// ======================================================

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<VacancyApiError>(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
};

export const useVacancies = ({
  lang,
  refreshVersion,
  createSignal,
  onDataChanged,
}: Props) => {
  const router = useRouter();

  const t = useTranslations("provider.vacancies.list");

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [postVacancyOpen, setPostVacancyOpen] = useState(false);

  const [viewVacancy, setViewVacancy] = useState<Vacancy | null>(null);

  const [editVacancy, setEditVacancy] = useState<Vacancy | null>(null);

  const [deleteVacancyTarget, setDeleteVacancyTarget] =
    useState<Vacancy | null>(null);

  // ====================================================
  // PROFILE ROUTE
  // ====================================================

  const providerProfileRoute =
    lang === "ja"
      ? "/provider-dashboard/profile"
      : "/en/provider-dashboard/profile";

  // ====================================================
  // PROFILE COMPLETION GATE
  //
  // Backend remains the final authority.
  //
  // This check exists only to give the Provider a
  // better frontend experience before opening forms.
  // ====================================================

  const ensureProviderProfileComplete = useCallback(async () => {
    try {
      const response = await getProviderProfile();

      if (response.status !== "success") {
        toast.error(t("toast.loadFailed"));

        return false;
      }

      if (response.is_complete) {
        return true;
      }

      const missingLabels = response.missing_fields
        ?.map((item) => item.label)
        .filter(Boolean)
        .join(", ");

      const message =
        lang === "ja"
          ? missingLabels
            ? `求人を掲載する前に企業プロフィールを完成してください。未入力: ${missingLabels}`
            : "求人を掲載する前に企業プロフィールを完成してください。"
          : missingLabels
            ? `Complete your company profile before posting or updating a vacancy. Missing: ${missingLabels}`
            : "Complete your company profile before posting or updating a vacancy.";

      toast.error(message, {
        duration: 5000,
      });

      router.push(providerProfileRoute);

      return false;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, t("toast.loadFailed")));

      return false;
    }
  }, [lang, providerProfileRoute, router, t]);

  // ====================================================
  // LOAD
  // ====================================================

  const loadVacancies = useCallback(async () => {
    try {
      const response = await getProviderVacancies();

      setVacancies(Array.isArray(response.data) ? response.data : []);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, t("toast.loadFailed")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadVacancies();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadVacancies, refreshVersion]);

  // ====================================================
  // HEADER CREATE SIGNAL
  //
  // Dashboard header may trigger vacancy creation from
  // outside this component.
  //
  // That path must use the same Profile check.
  // ====================================================

  useEffect(() => {
    if (createSignal <= 0) {
      return;
    }

    const checkProfileAndOpen = async () => {
      const allowed = await ensureProviderProfileComplete();

      if (!allowed) {
        return;
      }

      setPostVacancyOpen(true);
    };

    void checkProfileAndOpen();
  }, [createSignal, ensureProviderProfileComplete]);

  // ====================================================
  // FILTER
  // ====================================================

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

  // ====================================================
  // REFRESH
  // ====================================================

  const refresh = async () => {
    try {
      setRefreshing(true);

      await loadVacancies();
    } finally {
      setRefreshing(false);
    }
  };

  // ====================================================
  // CREATE
  // ====================================================

  const openPostVacancy = () => {
    const checkProfileAndOpen = async () => {
      const allowed = await ensureProviderProfileComplete();

      if (!allowed) {
        return;
      }

      setPostVacancyOpen(true);
    };

    void checkProfileAndOpen();
  };

  const closePostVacancy = () => {
    setPostVacancyOpen(false);
  };

  const handleVacancyCreated = async () => {
    setPostVacancyOpen(false);

    setSearch("");

    await loadVacancies();

    await onDataChanged();
  };

  // ====================================================
  // VIEW
  // ====================================================

  const openVacancyView = (vacancy: Vacancy) => {
    setViewVacancy(vacancy);
  };

  const closeVacancyView = () => {
    setViewVacancy(null);
  };

  // ====================================================
  // EDIT
  //
  // Editing a vacancy sends it back to Admin review,
  // therefore a complete company profile is required.
  // ====================================================

  const openVacancyEdit = (vacancy: Vacancy) => {
    const checkProfileAndOpen = async () => {
      const allowed = await ensureProviderProfileComplete();

      if (!allowed) {
        return;
      }

      setViewVacancy(null);

      window.setTimeout(() => {
        setEditVacancy(vacancy);
      }, 0);
    };

    void checkProfileAndOpen();
  };

  const closeVacancyEdit = () => {
    setEditVacancy(null);
  };

  const handleVacancyUpdated = async () => {
    setEditVacancy(null);

    await loadVacancies();

    await onDataChanged();
  };

  // ====================================================
  // DELETE
  // ====================================================

  const openVacancyDelete = (vacancy: Vacancy) => {
    setDeleteVacancyTarget(vacancy);
  };

  const closeVacancyDelete = () => {
    setDeleteVacancyTarget(null);
  };

  const handleVacancyDeleted = async () => {
    setDeleteVacancyTarget(null);

    await loadVacancies();

    await onDataChanged();
  };

  // ====================================================
  // CLOSE
  // ====================================================

  const handleCloseVacancy = async (vacancy: Vacancy) => {
    if (vacancy.status !== "published") {
      toast.error(t("toast.onlyPublishedCanClose"));

      return;
    }

    const confirmed = window.confirm(
      t("toast.confirmClose", {
        title: vacancy.title,
      }),
    );

    if (!confirmed) {
      return;
    }

    try {
      await closeProviderVacancy(vacancy.vacancyId);

      toast.success(t("toast.closed"));

      await loadVacancies();

      await onDataChanged();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, t("toast.closeFailed")));
    }
  };

  return {
    loading,

    refreshing,

    search,

    setSearch,

    filteredVacancies,

    postVacancyOpen,

    openPostVacancy,

    closePostVacancy,

    handleVacancyCreated,

    viewVacancy,

    openVacancyView,

    closeVacancyView,

    editVacancy,

    openVacancyEdit,

    closeVacancyEdit,

    handleVacancyUpdated,

    deleteVacancyTarget,

    openVacancyDelete,

    closeVacancyDelete,

    handleVacancyDeleted,

    handleCloseVacancy,

    refresh,
  };
};
