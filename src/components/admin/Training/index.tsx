"use client";

import React, { useRef, useState } from "react";

import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  File,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Image,
  Link2,
  Pencil,
  Plus,
  Presentation,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import { useLanguage } from "@/context/LanguageContext";

import useDebounced from "@/hooks/useDebounced";

import {
  getTrainingTopicById,
  getTrainingTopics,
  openTrainingFile,
} from "./api";

import {
  useCreateTrainingCategory,
  useCreateTrainingTopic,
  useDeleteTrainingCategory,
  useDeleteTrainingFile,
  useDeleteTrainingTopic,
  useTrainingCategories,
  useUpdateTrainingCategory,
  useUpdateTrainingTopic,
  useUploadTrainingFile,
} from "./hook";

import {
  formatTrainingDate,
  formatTrainingFileSize,
  getTrainingFileTypeLabel,
  getTrainingStatusLabel,
} from "./helper";

import type {
  TrainingCategory,
  TrainingCategorySortBy,
  TrainingFile,
  TrainingStatus,
  TrainingTopic,
} from "./types";

import { CategoryForm } from "./CategoryForm";
import { Modal } from "./Modal";
import { TopicForm } from "./TopicForm";
import { TopicViewModal } from "./TopicViewModal";

// ======================================================
// COMPONENT
// ======================================================

export default function AdminTrainingCategories() {
  const { lang } = useLanguage();

  // ====================================================
  // FILTERS
  // ====================================================

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounced(search, 500);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [statusFilter, setStatusFilter] = useState<TrainingStatus | "">("");

  const [sortBy, setSortBy] = useState<TrainingCategorySortBy>("sort_order");

  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  // ====================================================
  // EXPANDED CATEGORY DATA
  // ====================================================

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const [topicsData, setTopicsData] = useState<Record<string, TrainingTopic[]>>(
    {},
  );

  const [loadingTopics, setLoadingTopics] = useState<Set<string>>(new Set());

  const [topicError, setTopicError] = useState<Record<string, string>>({});

  // ====================================================
  // MODALS
  // ====================================================

  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);

  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);

  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] =
    useState(false);

  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);

  const [isEditTopicModalOpen, setIsEditTopicModalOpen] = useState(false);

  const [isDeleteTopicModalOpen, setIsDeleteTopicModalOpen] = useState(false);

  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false);

  const [isViewTopicModalOpen, setIsViewTopicModalOpen] = useState(false);

  // ====================================================
  // SELECTED
  // ====================================================

  const [selectedCategory, setSelectedCategory] =
    useState<TrainingCategory | null>(null);

  const [selectedTopic, setSelectedTopic] = useState<TrainingTopic | null>(
    null,
  );

  // ====================================================
  // CATEGORY FORM
  // ====================================================

  const [categoryName, setCategoryName] = useState("");

  const [categoryDescription, setCategoryDescription] = useState("");

  const [categorySortOrder, setCategorySortOrder] = useState(0);

  const [categoryStatus, setCategoryStatus] =
    useState<TrainingStatus>("active");

  // ====================================================
  // TOPIC FORM
  // ====================================================

  const [topicTitle, setTopicTitle] = useState("");

  const [topicDescription, setTopicDescription] = useState("");

  const [topicSortOrder, setTopicSortOrder] = useState(0);

  const [topicStatus, setTopicStatus] = useState<TrainingStatus>("active");

  // ====================================================
  // FILE FORM
  // ====================================================

  const [fileTitle, setFileTitle] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [fileSortOrder, setFileSortOrder] = useState(0);

  const [fileStatus, setFileStatus] = useState<TrainingStatus>("active");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ====================================================
  // ERROR
  // ====================================================

  const [error, setError] = useState("");

  // ====================================================
  // CATEGORY QUERY
  // ====================================================

  const {
    data: categoriesResponse,
    isLoading,
    isFetching,
    error: categoriesError,
    refetch: refetchCategories,
  } = useTrainingCategories({
    page,
    limit,
    search: debouncedSearch,
    status: statusFilter,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const categories = categoriesResponse?.data ?? [];

  const pagination = categoriesResponse?.pagination;

  // ====================================================
  // MUTATIONS
  // ====================================================

  const createCategoryMutation = useCreateTrainingCategory();

  const updateCategoryMutation = useUpdateTrainingCategory();

  const deleteCategoryMutation = useDeleteTrainingCategory();

  const createTopicMutation = useCreateTrainingTopic();

  const updateTopicMutation = useUpdateTrainingTopic();

  const deleteTopicMutation = useDeleteTrainingTopic();

  const uploadFileMutation = useUploadTrainingFile();

  const deleteFileMutation = useDeleteTrainingFile();

  // ====================================================
  // HELPERS
  // ====================================================

  const getStatusLabel = (status: TrainingStatus) =>
    getTrainingStatusLabel(status, lang);

  const formatDate = (value: string) => formatTrainingDate(value, lang);

  const formatFileSize = (value: number | null) =>
    formatTrainingFileSize(value);

  const getFileTypeLabel = (fileType: TrainingFile["file_type"]) =>
    getTrainingFileTypeLabel(fileType, lang);

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;

      case "video":
        return <Video className="h-5 w-5 text-purple-500" />;

      case "image":
        return <Image className="h-5 w-5 text-blue-500" />;

      case "doc":
        return <FileText className="h-5 w-5 text-blue-600" />;

      case "excel":
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;

      case "ppt":
        return <Presentation className="h-5 w-5 text-orange-500" />;

      case "link":
        return <Link2 className="h-5 w-5 text-cyan-500" />;

      default:
        return <File className="h-5 w-5 text-slate-500" />;
    }
  };

  // ====================================================
  // RESET FORMS
  // ====================================================

  const resetCategoryForm = () => {
    setCategoryName("");

    setCategoryDescription("");

    setCategorySortOrder(0);

    setCategoryStatus("active");

    setError("");
  };

  const resetTopicForm = () => {
    setTopicTitle("");

    setTopicDescription("");

    setTopicSortOrder(0);

    setTopicStatus("active");

    setError("");
  };

  const resetFileForm = () => {
    setFileTitle("");

    setSelectedFile(null);

    setFileSortOrder(0);

    setFileStatus("active");

    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ====================================================
  // LOAD TOPICS
  // ====================================================

  const loadTopicsForCategory = async (categoryId: string, force = false) => {
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

    setTopicError((previous) => ({
      ...previous,

      [categoryId]: "",
    }));

    try {
      const response = await getTrainingTopics({
        category_id: categoryId,

        page: 1,

        limit: 100,

        sort_by: "sort_order",

        sort_order: "ASC",
      });

      setTopicsData((previous) => ({
        ...previous,

        [categoryId]: response.data,
      }));
    } catch (loadError: unknown) {
      setTopicError((previous) => ({
        ...previous,

        [categoryId]:
          loadError instanceof Error
            ? loadError.message
            : lang === "ja"
              ? "トピックの読み込みに失敗しました"
              : "Failed to load topics.",
      }));
    } finally {
      setLoadingTopics((previous) => {
        const next = new Set(previous);

        next.delete(categoryId);

        return next;
      });
    }
  };

  const refreshCategoryTopics = async (categoryId: string) => {
    await loadTopicsForCategory(categoryId, true);

    await refetchCategories();
  };

  // ====================================================
  // EXPAND
  // ====================================================

  const toggleCategory = async (categoryId: string) => {
    const currentlyExpanded = expandedCategories.has(categoryId);

    setExpandedCategories((previous) => {
      const next = new Set(previous);

      if (currentlyExpanded) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }

      return next;
    });

    if (!currentlyExpanded) {
      await loadTopicsForCategory(categoryId);
    }
  };

  // ====================================================
  // CREATE CATEGORY
  // ====================================================

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      setError(
        lang === "ja" ? "カテゴリー名は必須です" : "Category name is required.",
      );

      return;
    }

    try {
      setError("");

      await createCategoryMutation.mutateAsync({
        name: categoryName.trim(),

        description: categoryDescription.trim() || null,

        sort_order: categorySortOrder,

        status: categoryStatus,
      });

      toast.success(
        lang === "ja"
          ? "カテゴリーを作成しました"
          : "Category created successfully.",
      );

      setIsCreateCategoryModalOpen(false);

      resetCategoryForm();

      await refetchCategories();
    } catch (mutationError: unknown) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to create category.",
      );
    }
  };

  // ====================================================
  // UPDATE CATEGORY
  // ====================================================

  const handleUpdateCategory = async () => {
    if (!selectedCategory) {
      return;
    }

    if (!categoryName.trim()) {
      setError("Category name is required.");

      return;
    }

    try {
      setError("");

      await updateCategoryMutation.mutateAsync({
        id: selectedCategory.id,

        name: categoryName.trim(),

        description: categoryDescription.trim() || null,

        sort_order: categorySortOrder,

        status: categoryStatus,
      });

      toast.success("Category updated successfully.");

      setIsEditCategoryModalOpen(false);

      setSelectedCategory(null);

      resetCategoryForm();

      await refetchCategories();
    } catch (mutationError: unknown) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to update category.",
      );
    }
  };

  // ====================================================
  // DELETE CATEGORY
  // ====================================================

  const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      return;
    }

    const categoryId = selectedCategory.id;

    try {
      setError("");

      await deleteCategoryMutation.mutateAsync({
        id: categoryId,
      });

      setTopicsData((previous) => {
        const next = { ...previous };

        delete next[categoryId];

        return next;
      });

      setExpandedCategories((previous) => {
        const next = new Set(previous);

        next.delete(categoryId);

        return next;
      });

      setIsDeleteCategoryModalOpen(false);

      setSelectedCategory(null);

      toast.success("Category deleted successfully.");

      await refetchCategories();
    } catch (mutationError: unknown) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to delete category.",
      );
    }
  };

  // ====================================================
  // CREATE TOPIC
  // ====================================================

  const handleCreateTopic = async () => {
    if (!selectedCategory) {
      return;
    }

    if (!topicTitle.trim()) {
      setError("Topic title is required.");

      return;
    }

    try {
      setError("");

      await createTopicMutation.mutateAsync({
        category_id: selectedCategory.id,

        title: topicTitle.trim(),

        description: topicDescription.trim() || null,

        sort_order: topicSortOrder,

        status: topicStatus,
      });

      toast.success("Topic created successfully.");

      setIsCreateTopicModalOpen(false);

      resetTopicForm();

      await refreshCategoryTopics(selectedCategory.id);
    } catch (mutationError: unknown) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to create topic.",
      );
    }
  };

  // ====================================================
  // UPDATE TOPIC
  // ====================================================

  const handleUpdateTopic = async () => {
    if (!selectedTopic) {
      return;
    }

    if (!topicTitle.trim()) {
      setError("Topic title is required.");

      return;
    }

    try {
      setError("");

      await updateTopicMutation.mutateAsync({
        id: selectedTopic.id,

        category_id: selectedTopic.category_id,

        title: topicTitle.trim(),

        description: topicDescription.trim() || null,

        sort_order: topicSortOrder,

        status: topicStatus,
      });

      toast.success("Topic updated successfully.");

      setIsEditTopicModalOpen(false);

      resetTopicForm();

      await refreshCategoryTopics(selectedTopic.category_id);
    } catch (mutationError: unknown) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to update topic.",
      );
    }
  };

  // ====================================================
  // DELETE TOPIC
  // ====================================================

  const handleDeleteTopic = async () => {
    if (!selectedTopic) {
      return;
    }

    const categoryId = selectedTopic.category_id;

    try {
      setError("");

      await deleteTopicMutation.mutateAsync({
        id: selectedTopic.id,
      });

      setIsDeleteTopicModalOpen(false);

      setSelectedTopic(null);

      toast.success("Topic deleted successfully.");

      await refreshCategoryTopics(categoryId);
    } catch (mutationError: unknown) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to delete topic.",
      );
    }
  };

  // ====================================================
  // UPLOAD FILE
  // ====================================================

  const handleUploadFile = async () => {
    if (!selectedTopic) {
      return;
    }

    if (!fileTitle.trim()) {
      setError("File title is required.");

      return;
    }

    if (!selectedFile) {
      setError("Please select a file.");

      return;
    }

    try {
      setError("");

      await uploadFileMutation.mutateAsync({
        topic_id: selectedTopic.id,

        file_title: fileTitle.trim(),

        file: selectedFile,

        sort_order: fileSortOrder,

        status: fileStatus,
      });

      toast.success("File uploaded successfully.");

      setIsUploadFileModalOpen(false);

      resetFileForm();

      await refreshCategoryTopics(selectedTopic.category_id);
    } catch (mutationError: unknown) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to upload file.",
      );
    }
  };

  // ====================================================
  // VIEW TOPIC
  // ====================================================

  const openViewTopicModal = async (topic: TrainingTopic) => {
    try {
      const response = await getTrainingTopicById(topic.id);

      setSelectedTopic(response.data);

      setIsViewTopicModalOpen(true);
    } catch (viewError: unknown) {
      toast.error(
        viewError instanceof Error
          ? viewError.message
          : "Failed to load topic details.",
      );
    }
  };

  // ====================================================
  // VIEW FILE
  // ====================================================

  const handleViewTrainingFile = async (file: TrainingFile) => {
    try {
      await openTrainingFile(file.id);
    } catch (viewError: unknown) {
      toast.error(
        viewError instanceof Error ? viewError.message : "Failed to open file.",
      );
    }
  };

  // ====================================================
  // DELETE FILE
  // ====================================================

  const handleDeleteFile = async (fileId: string) => {
    const confirmed = window.confirm(
      lang === "ja"
        ? "このファイルを削除してもよろしいですか？"
        : "Are you sure you want to delete this file?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteFileMutation.mutateAsync({
        id: fileId,
      });

      toast.success("File deleted successfully.");

      if (selectedTopic) {
        const response = await getTrainingTopicById(selectedTopic.id);

        setSelectedTopic(response.data);

        await refreshCategoryTopics(selectedTopic.category_id);
      }
    } catch (mutationError: unknown) {
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to delete file.",
      );
    }
  };

  // ====================================================
  // OPEN MODALS
  // ====================================================

  const openEditCategoryModal = (category: TrainingCategory) => {
    setSelectedCategory(category);

    setCategoryName(category.name);

    setCategoryDescription(category.description || "");

    setCategorySortOrder(category.sort_order);

    setCategoryStatus(category.status);

    setError("");

    setIsEditCategoryModalOpen(true);
  };

  const openDeleteCategoryModal = (category: TrainingCategory) => {
    setSelectedCategory(category);

    setError("");

    setIsDeleteCategoryModalOpen(true);
  };

  const openCreateTopicModal = (category: TrainingCategory) => {
    setSelectedCategory(category);

    resetTopicForm();

    setIsCreateTopicModalOpen(true);
  };

  const openEditTopicModal = (topic: TrainingTopic) => {
    setSelectedTopic(topic);

    setTopicTitle(topic.title);

    setTopicDescription(topic.description || "");

    setTopicSortOrder(topic.sort_order);

    setTopicStatus(topic.status);

    setError("");

    setIsEditTopicModalOpen(true);
  };

  const openDeleteTopicModal = (topic: TrainingTopic) => {
    setSelectedTopic(topic);

    setError("");

    setIsDeleteTopicModalOpen(true);
  };

  const openUploadFileModal = (topic: TrainingTopic) => {
    setSelectedTopic(topic);

    resetFileForm();

    setIsUploadFileModalOpen(true);
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <RefreshCw className="h-9 w-9 animate-spin text-indigo-600" />
      </div>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8">
        {/* HEADER */}

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {lang === "ja"
                  ? "トレーニングカテゴリー"
                  : "Training Categories"}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage training categories and their topics.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  resetCategoryForm();

                  setIsCreateCategoryModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                New Category
              </button>

              <button
                type="button"
                onClick={() => void refetchCategories()}
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {/* FILTERS */}

          <div className="mt-5 grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);

                  setPage(1);
                }}
                placeholder="Search by category name..."
                className="h-12 w-full rounded-xl border pl-11 pr-4 outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as TrainingStatus | "");

                setPage(1);
              }}
              className="h-12 rounded-xl border px-4"
            >
              <option value="">All Statuses</option>

              <option value="active">Active</option>

              <option value="inactive">Inactive</option>
            </select>

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value as TrainingCategorySortBy);

                setPage(1);
              }}
              className="h-12 rounded-xl border px-4"
            >
              <option value="sort_order">Sort Order</option>

              <option value="name">Category Name</option>

              <option value="status">Status</option>

              <option value="created_at">Created Date</option>

              <option value="updated_at">Updated Date</option>
            </select>

            <button
              type="button"
              onClick={() =>
                setSortOrder((previous) =>
                  previous === "ASC" ? "DESC" : "ASC",
                )
              }
              className="h-12 rounded-xl border px-5 text-xl"
            >
              {sortOrder === "ASC" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {categoriesError && (
          <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertTriangle className="h-5 w-5" />

            {categoriesError.message}
          </div>
        )}

        {/* CATEGORY TABLE */}

        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="w-12 px-4 py-4" />

                  <th className="px-4 py-4">ID</th>

                  <th className="px-4 py-4">Category Name</th>

                  <th className="px-4 py-4">Topics</th>

                  <th className="px-4 py-4">Sort Order</th>

                  <th className="px-4 py-4">Status</th>

                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => {
                  const expanded = expandedCategories.has(category.id);

                  const categoryStatusInfo = getStatusLabel(category.status);

                  const topics = topicsData[category.id] ?? [];

                  return (
                    <React.Fragment key={category.id}>
                      <tr className="border-t">
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => void toggleCategory(category.id)}
                          >
                            {expanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        </td>

                        <td className="px-4 py-4 font-medium">{category.id}</td>

                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <FolderOpen className="mt-1 h-4 w-4 text-amber-500" />

                            <div>
                              <p className="font-semibold">{category.name}</p>

                              {category.description && (
                                <p className="mt-1 text-xs text-slate-500">
                                  {category.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                            <BookOpen className="h-3.5 w-3.5" />

                            {category.topics_count}
                          </span>
                        </td>

                        <td className="px-4 py-4">{category.sort_order}</td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${categoryStatusInfo.color}`}
                          >
                            {categoryStatusInfo.label}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openCreateTopicModal(category)}
                              className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm"
                            >
                              <Plus className="h-4 w-4" />
                              Add Topic
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditCategoryModal(category)}
                              className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => openDeleteCategoryModal(category)}
                              className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* TOPICS */}

                      {expanded && (
                        <tr>
                          <td colSpan={7} className="bg-slate-50/70 p-4">
                            <div className="overflow-hidden rounded-2xl border bg-white">
                              <div className="flex items-center justify-between border-b p-4">
                                <p className="font-semibold">
                                  Topics ({topics.length})
                                </p>

                                <button
                                  type="button"
                                  onClick={() => openCreateTopicModal(category)}
                                  className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm"
                                >
                                  <Plus className="h-4 w-4" />
                                  Add Topic
                                </button>
                              </div>

                              {loadingTopics.has(category.id) ? (
                                <div className="py-10 text-center">
                                  <RefreshCw className="mx-auto h-6 w-6 animate-spin" />
                                </div>
                              ) : topicError[category.id] ? (
                                <div className="p-5 text-red-600">
                                  {topicError[category.id]}
                                </div>
                              ) : topics.length === 0 ? (
                                <div className="py-10 text-center text-slate-500">
                                  No topics found.
                                </div>
                              ) : (
                                <table className="w-full">
                                  <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                                    <tr>
                                      <th className="px-4 py-3">ID</th>

                                      <th className="px-4 py-3">Title</th>

                                      <th className="px-4 py-3">Files</th>

                                      <th className="px-4 py-3">Sort Order</th>

                                      <th className="px-4 py-3">Status</th>

                                      <th className="px-4 py-3 text-right">
                                        Actions
                                      </th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {topics.map((topic) => {
                                      const statusInfo = getStatusLabel(
                                        topic.status,
                                      );

                                      return (
                                        <tr key={topic.id} className="border-t">
                                          <td className="px-4 py-4">
                                            {topic.id}
                                          </td>

                                          <td className="px-4 py-4">
                                            <p className="font-semibold">
                                              {topic.title}
                                            </p>

                                            {topic.description && (
                                              <p className="mt-1 text-xs text-slate-500">
                                                {topic.description}
                                              </p>
                                            )}
                                          </td>

                                          <td className="px-4 py-4">
                                            {topic.files_count}
                                          </td>

                                          <td className="px-4 py-4">
                                            {topic.sort_order}
                                          </td>

                                          <td className="px-4 py-4">
                                            <span
                                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.color}`}
                                            >
                                              {statusInfo.label}
                                            </span>
                                          </td>

                                          <td className="px-4 py-4">
                                            <div className="flex justify-end gap-2">
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  openUploadFileModal(topic)
                                                }
                                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
                                              >
                                                <Upload className="h-4 w-4" />
                                                Upload
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  void openViewTopicModal(topic)
                                                }
                                                className="rounded-lg p-2"
                                              >
                                                <Eye className="h-4 w-4" />
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  openEditTopicModal(topic)
                                                }
                                                className="rounded-lg p-2"
                                              >
                                                <Pencil className="h-4 w-4" />
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  openDeleteTopicModal(topic)
                                                }
                                                className="rounded-lg p-2 text-red-500"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          {pagination && (
            <div className="flex items-center justify-between border-t p-4">
              <p className="text-sm text-slate-500">
                {pagination.total === 0
                  ? 0
                  : (pagination.page - 1) * pagination.limit + 1}
                {" - "}
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.total,
                )}{" "}
                of {pagination.total}
              </p>

              <div className="flex items-center gap-2">
                <select
                  value={limit}
                  onChange={(event) => {
                    setLimit(Number(event.target.value));

                    setPage(1);
                  }}
                  className="rounded-xl border px-3 py-2"
                >
                  <option value={10}>10 / page</option>

                  <option value={20}>20 / page</option>

                  <option value={50}>50 / page</option>
                </select>

                <button
                  type="button"
                  disabled={!pagination.has_prev_page}
                  onClick={() => setPage((previous) => previous - 1)}
                  className="rounded-xl border p-2 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="rounded-xl bg-slate-100 px-3 py-2">
                  {pagination.page}/{Math.max(pagination.total_pages, 1)}
                </span>

                <button
                  type="button"
                  disabled={!pagination.has_next_page}
                  onClick={() => setPage((previous) => previous + 1)}
                  className="rounded-xl border p-2 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CREATE CATEGORY */}

      <Modal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        title="Create Category"
        description="Create a new training category."
        error={error}
        onConfirm={() => void handleCreateCategory()}
        confirmLabel="Create"
        cancelLabel="Cancel"
        isPending={createCategoryMutation.isPending}
        lang={lang}
      >
        <CategoryForm
          name={categoryName}
          setName={setCategoryName}
          description={categoryDescription}
          setDescription={setCategoryDescription}
          sortOrder={categorySortOrder}
          setSortOrder={setCategorySortOrder}
          status={categoryStatus}
          setStatus={setCategoryStatus}
          lang={lang}
        />
      </Modal>

      {/* EDIT CATEGORY */}

      <Modal
        isOpen={isEditCategoryModalOpen}
        onClose={() => setIsEditCategoryModalOpen(false)}
        title="Edit Category"
        error={error}
        onConfirm={() => void handleUpdateCategory()}
        confirmLabel="Update"
        cancelLabel="Cancel"
        isPending={updateCategoryMutation.isPending}
        lang={lang}
      >
        <CategoryForm
          name={categoryName}
          setName={setCategoryName}
          description={categoryDescription}
          setDescription={setCategoryDescription}
          sortOrder={categorySortOrder}
          setSortOrder={setCategorySortOrder}
          status={categoryStatus}
          setStatus={setCategoryStatus}
          lang={lang}
        />
      </Modal>

      {/* DELETE CATEGORY */}

      <Modal
        isOpen={isDeleteCategoryModalOpen}
        onClose={() => setIsDeleteCategoryModalOpen(false)}
        title="Delete Category"
        description="Topics and files inside this category will also be deleted."
        error={error}
        onConfirm={() => void handleDeleteCategory()}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isPending={deleteCategoryMutation.isPending}
        lang={lang}
        isDestructive
      >
        <p>{selectedCategory?.name}</p>
      </Modal>

      {/* CREATE TOPIC */}

      <Modal
        isOpen={isCreateTopicModalOpen}
        onClose={() => setIsCreateTopicModalOpen(false)}
        title="Create Topic"
        error={error}
        onConfirm={() => void handleCreateTopic()}
        confirmLabel="Create"
        cancelLabel="Cancel"
        isPending={createTopicMutation.isPending}
        lang={lang}
      >
        <TopicForm
          categoryName={selectedCategory?.name || "-"}
          title={topicTitle}
          setTitle={setTopicTitle}
          description={topicDescription}
          setDescription={setTopicDescription}
          sortOrder={topicSortOrder}
          setSortOrder={setTopicSortOrder}
          status={topicStatus}
          setStatus={setTopicStatus}
          lang={lang}
        />
      </Modal>

      {/* EDIT TOPIC */}

      <Modal
        isOpen={isEditTopicModalOpen}
        onClose={() => setIsEditTopicModalOpen(false)}
        title="Edit Topic"
        error={error}
        onConfirm={() => void handleUpdateTopic()}
        confirmLabel="Update"
        cancelLabel="Cancel"
        isPending={updateTopicMutation.isPending}
        lang={lang}
      >
        <TopicForm
          categoryName={selectedTopic?.category_name || "-"}
          title={topicTitle}
          setTitle={setTopicTitle}
          description={topicDescription}
          setDescription={setTopicDescription}
          sortOrder={topicSortOrder}
          setSortOrder={setTopicSortOrder}
          status={topicStatus}
          setStatus={setTopicStatus}
          lang={lang}
          isEdit
        />
      </Modal>

      {/* DELETE TOPIC */}

      <Modal
        isOpen={isDeleteTopicModalOpen}
        onClose={() => setIsDeleteTopicModalOpen(false)}
        title="Delete Topic"
        description="Files attached to this topic will also be deleted."
        error={error}
        onConfirm={() => void handleDeleteTopic()}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isPending={deleteTopicMutation.isPending}
        lang={lang}
        isDestructive
      >
        <p>{selectedTopic?.title}</p>
      </Modal>

      {/* UPLOAD */}

      {isUploadFileModalOpen && selectedTopic && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setIsUploadFileModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-bold">Upload File</h2>

                <p className="text-sm text-slate-500">{selectedTopic.title}</p>
              </div>

              <button
                type="button"
                onClick={() => setIsUploadFileModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-red-600">
                {error}
              </div>
            )}

            <div className="mt-5 space-y-4">
              <input
                value={fileTitle}
                onChange={(event) => setFileTitle(event.target.value)}
                placeholder="File title"
                className="h-12 w-full rounded-xl border px-4"
              />

              <input
                ref={fileInputRef}
                type="file"
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] ?? null)
                }
                className="w-full rounded-xl border p-3"
              />

              <input
                type="number"
                min="0"
                value={fileSortOrder}
                onChange={(event) =>
                  setFileSortOrder(Number(event.target.value))
                }
                className="h-12 w-full rounded-xl border px-4"
                placeholder="Sort order"
              />

              <select
                value={fileStatus}
                onChange={(event) =>
                  setFileStatus(event.target.value as TrainingStatus)
                }
                className="h-12 w-full rounded-xl border px-4"
              >
                <option value="active">Active</option>

                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsUploadFileModalOpen(false)}
                className="rounded-xl border px-5 py-2.5"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={uploadFileMutation.isPending}
                onClick={() => void handleUploadFile()}
                className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW TOPIC */}

      {selectedTopic && (
        <TopicViewModal
          isOpen={isViewTopicModalOpen}
          onClose={() => {
            setIsViewTopicModalOpen(false);

            setSelectedTopic(null);
          }}
          topic={selectedTopic}
          lang={lang}
          getStatusLabel={getStatusLabel}
          getFileIcon={getFileIcon}
          getFileTypeLabel={(fileType) =>
            getFileTypeLabel(fileType as TrainingFile["file_type"])
          }
          formatDate={formatDate}
          formatFileSize={formatFileSize}
          handleDelete={handleDeleteFile}
          handleView={handleViewTrainingFile}
        />
      )}
    </>
  );
}
