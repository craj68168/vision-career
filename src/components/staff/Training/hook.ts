"use client";

import { useMemo, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useQuery } from "@tanstack/react-query";

import useDebounced from "@/hooks/useDebounced";

import {
  getStaffTrainingCategories,
  getStaffTrainingTopicById,
  getStaffTrainingTopics,
  openStaffTrainingFile,
} from "./api";

import type {
  StaffTrainingApiError,
  StaffTrainingFile,
  StaffTrainingTopic,
} from "./types";
import { useLanguage } from "@/context/LanguageContext";
// ======================================================
// HOOK
// ======================================================

export const useStaffTraining = () => {
  // ====================================================
  // FILTERS
  // ====================================================
const { lang } = useLanguage();
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounced(search, 400);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  // ====================================================
  // EXPANDED CATEGORIES
  // ====================================================

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const [topicsData, setTopicsData] = useState<
    Record<string, StaffTrainingTopic[]>
  >({});

  const [loadingTopics, setLoadingTopics] = useState<Set<string>>(new Set());

  const [topicErrors, setTopicErrors] = useState<Record<string, string>>({});

  // ====================================================
  // TOPIC DETAILS
  // ====================================================

  const [selectedTopic, setSelectedTopic] = useState<StaffTrainingTopic | null>(
    null,
  );

  const [isTopicDetailsLoading, setIsTopicDetailsLoading] = useState(false);

  // ====================================================
  // CATEGORY QUERY
  // ====================================================

  const filters = useMemo(
    () => ({
      page,

      limit,

      search: debouncedSearch,
    }),

    [page, limit, debouncedSearch],
  );

  const categoryQuery = useQuery({
    queryKey: ["staff-training-categories", filters],

    queryFn: () => getStaffTrainingCategories(filters),

    staleTime: 30 * 1000,

    refetchOnWindowFocus: false,

    retry: 1,
  });

  // ====================================================
  // ERROR HELPER
  // ====================================================

const getErrorMessage = (error: unknown) => {
  const isJapanese = lang === "ja";

  if (axios.isAxiosError<StaffTrainingApiError>(error)) {
    const status = error.response?.status;

    if (status === 401) {
      return isJapanese
        ? "セッションの有効期限が切れました。再度ログインしてください。"
        : "Your session has expired. Please log in again.";
    }

    if (status === 403) {
      return isJapanese
        ? "この操作を行う権限がありません。"
        : "You do not have permission to perform this action.";
    }

    if (status === 404) {
      return isJapanese
        ? "指定された研修データが見つかりません。"
        : "The requested training resource was not found.";
    }

    if (!error.response) {
      return isJapanese
        ? "サーバーに接続できません。接続状況を確認して再度お試しください。"
        : "Unable to connect to the server. Check your connection and try again.";
    }
  }

  return isJapanese
    ? "エラーが発生しました。再度お試しください。"
    : "Something went wrong. Please try again.";
};

  // ====================================================
  // LOAD TOPICS
  // ====================================================

  const loadTopics = async (
    categoryId: string,

    force = false,
  ) => {
    if (!force && topicsData[categoryId] !== undefined) {
      return;
    }

    if (loadingTopics.has(categoryId)) {
      return;
    }

    setLoadingTopics((previous) => {
      const next = new Set(previous);

      next.add(categoryId);

      return next;
    });

    setTopicErrors((previous) => ({
      ...previous,

      [categoryId]: "",
    }));

    try {
      const response = await getStaffTrainingTopics(categoryId);

      setTopicsData((previous) => ({
        ...previous,

        [categoryId]: response.data,
      }));
    } catch (error: unknown) {
      setTopicErrors((previous) => ({
        ...previous,

        [categoryId]: getErrorMessage(error),
      }));
    } finally {
      setLoadingTopics((previous) => {
        const next = new Set(previous);

        next.delete(categoryId);

        return next;
      });
    }
  };

  // ====================================================
  // TOGGLE CATEGORY
  // ====================================================

  const toggleCategory = async (categoryId: string) => {
    const isExpanded = expandedCategories.has(categoryId);

    setExpandedCategories((previous) => {
      const next = new Set(previous);

      if (isExpanded) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }

      return next;
    });

    if (!isExpanded) {
      await loadTopics(categoryId);
    }
  };

  // ====================================================
  // OPEN TOPIC
  // ====================================================

  const openTopic = async (topicId: string) => {
    try {
      setIsTopicDetailsLoading(true);

      const response = await getStaffTrainingTopicById(topicId);

      setSelectedTopic(response.data);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsTopicDetailsLoading(false);
    }
  };

  // ====================================================
  // CLOSE TOPIC
  // ====================================================

  const closeTopic = () => {
    setSelectedTopic(null);
  };

  // ====================================================
  // OPEN FILE
  // ====================================================

  const openFile = async (file: StaffTrainingFile) => {
    try {
      await openStaffTrainingFile(file.fileId);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  // ====================================================
  // SEARCH
  // ====================================================

  const handleSearchChange = (value: string) => {
    setSearch(value);

    setPage(1);
  };

  // ====================================================
  // LIMIT
  // ====================================================

  const handleLimitChange = (value: number) => {
    setLimit(value);

    setPage(1);
  };

  // ====================================================
  // RETURN
  // ====================================================

  return {
    categories: categoryQuery.data?.data ?? [],

    pagination: categoryQuery.data?.pagination,

    search,

    setSearch: handleSearchChange,

    page,

    setPage,

    limit,

    setLimit: handleLimitChange,

    expandedCategories,

    topicsData,

    loadingTopics,

    topicErrors,

    toggleCategory,

    selectedTopic,

    openTopic,

    closeTopic,

    openFile,

    isTopicDetailsLoading,

    isLoading: categoryQuery.isLoading,

    isFetching: categoryQuery.isFetching,

    error: categoryQuery.error,

    refresh: categoryQuery.refetch,
  };
};
