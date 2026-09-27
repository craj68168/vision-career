"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { closeProviderVacancy, getProviderVacancies } from "./api";

import type { Vacancy, VacancyApiError } from "./types";

type Props = {
  lang: string;

  refreshVersion: number;

  createSignal: number;

  onDataChanged: () => void | Promise<void>;
};

export const useVacancies = ({
  lang,
  refreshVersion,
  createSignal,
  onDataChanged,
}: Props) => {
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
  // ERROR
  // ====================================================

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError<VacancyApiError>(error)) {
      return error.response?.data?.message || fallback;
    }

    return fallback;
  };

  // ====================================================
  // LOAD
  // ====================================================

  const loadVacancies = useCallback(async () => {
    try {
      const response = await getProviderVacancies();

      setVacancies(Array.isArray(response.data) ? response.data : []);
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          lang === "ja"
            ? "求人情報の読み込みに失敗しました。"
            : "Failed to load vacancies.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    void loadVacancies();
  }, [loadVacancies, refreshVersion]);

  // ====================================================
  // HEADER CREATE SIGNAL
  // ====================================================

  useEffect(() => {
    if (createSignal > 0) {
      setPostVacancyOpen(true);
    }
  }, [createSignal]);

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
    setPostVacancyOpen(true);
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
  // ====================================================

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

      await loadVacancies();

      await onDataChanged();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          lang === "ja"
            ? "求人の終了に失敗しました"
            : "Failed to close vacancy.",
        ),
      );
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
