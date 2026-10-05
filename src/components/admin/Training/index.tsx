"use client";
import React, { useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  File as FileIcon,
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
import { useLocale, useTranslations } from "next-intl";
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
type TrainingMessageKey = "categoryNameRequired" | "topicTitleRequired" | "fileTitleRequired" | "fileRequired" | "messages.loadTopics" | "messages.createCategory" | "messages.updateCategory" | "messages.deleteCategory" | "messages.createTopic" | "messages.updateTopic" | "messages.deleteTopic" | "messages.uploadFile" | "messages.topicDetails" | "messages.openFile" | "messages.deleteFile" | "messages.loadCategories" | "messages.categoryCreated" | "messages.categoryUpdated" | "messages.categoryDeleted" | "messages.topicCreated" | "messages.topicUpdated" | "messages.topicDeleted" | "messages.fileUploaded" | "messages.fileDeleted";
type StatusInfo = ReturnType<typeof getTrainingStatusLabel>;
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";
const inputClass =
  "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white";
const selectClass =
  "h-10 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white";
const neutralButton =
  "border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10";
const dangerButton =
  "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10";
// ======================================================
// COMPONENT
// ======================================================
export default function AdminTrainingCategories() {
  const lang = useLocale();
  const t = useTranslations("adminTraining");
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
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
    formatTrainingFileSize(value, lang);
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
        return <FileIcon className="h-5 w-5 text-zinc-500" />;
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
    } catch {
      setTopicError((previous) => ({
        ...previous,
        [categoryId]:
          "messages.loadTopics",
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
      setError("categoryNameRequired");
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
        t("messages.categoryCreated"),
      );
      setIsCreateCategoryModalOpen(false);
      resetCategoryForm();
      await refetchCategories();
    } catch {
      setError("messages.createCategory");
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
      setError("categoryNameRequired");
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
      toast.success(t("messages.categoryUpdated"));
      setIsEditCategoryModalOpen(false);
      setSelectedCategory(null);
      resetCategoryForm();
      await refetchCategories();
    } catch {
      setError("messages.updateCategory");
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
      toast.success(t("messages.categoryDeleted"));
      await refetchCategories();
    } catch {
      setError("messages.deleteCategory");
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
      setError("topicTitleRequired");
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
      toast.success(t("messages.topicCreated"));
      setIsCreateTopicModalOpen(false);
      resetTopicForm();
      await refreshCategoryTopics(selectedCategory.id);
    } catch {
      setError("messages.createTopic");
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
      setError("topicTitleRequired");
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
      toast.success(t("messages.topicUpdated"));
      setIsEditTopicModalOpen(false);
      resetTopicForm();
      await refreshCategoryTopics(selectedTopic.category_id);
    } catch {
      setError("messages.updateTopic");
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
      toast.success(t("messages.topicDeleted"));
      await refreshCategoryTopics(categoryId);
    } catch {
      setError("messages.deleteTopic");
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
      setError("fileTitleRequired");
      return;
    }
    if (!selectedFile) {
      setError("fileRequired");
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
      toast.success(t("messages.fileUploaded"));
      setIsUploadFileModalOpen(false);
      resetFileForm();
      await refreshCategoryTopics(selectedTopic.category_id);
    } catch {
      setError("messages.uploadFile");
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
    } catch {
      toast.error(
        t("messages.topicDetails"),
      );
    }
  };
  // ====================================================
  // VIEW FILE
  // ====================================================
  const handleViewTrainingFile = async (file: TrainingFile) => {
    try {
      await openTrainingFile(file.id);
    } catch {
      toast.error(
        t("messages.openFile"),
      );
    }
  };
  // ====================================================
  // DELETE FILE
  // ====================================================
  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteFileMutation.mutateAsync({
        id: fileId,
      });
      toast.success(t("messages.fileDeleted"));
      if (selectedTopic) {
        const response = await getTrainingTopicById(selectedTopic.id);
        setSelectedTopic(response.data);
        await refreshCategoryTopics(selectedTopic.category_id);
      }
    } catch {
      toast.error(
        t("messages.deleteFile"),
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
      <div className="flex min-h-[320px] items-center justify-center sm:min-h-[500px]">
        <RefreshCw
          role="status"
          aria-label={t("loading")}
          className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400"
        />
      </div>
    );
  }
  // ====================================================
  // UI
  // ====================================================
  return (
    <>
      <div className="min-w-0 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-zinc-950 dark:text-white sm:text-2xl">
              {t("title")}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {t("description")}
            </p>
          </div>
          <div className="flex shrink-0 gap-2 sm:gap-3">
            <button
              type="button"
              disabled={isFetching}
              onClick={() => void refetchCategories()}
              className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              {t("refresh")}
            </button>
            <button
              type="button"
              onClick={() => {
                resetCategoryForm();
                setIsCreateCategoryModalOpen(true);
              }}
              className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 sm:flex-none ${focusRing}`}
            >
              <Plus className="h-4 w-4" />
              {t("newCategory")}
            </button>
          </div>
        </div>
        {/* FILTERS */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_200px_260px]">
            <div className="relative sm:col-span-2 xl:col-span-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                aria-label={t("searchCategories")}
                placeholder={t("searchPlaceholder")}
                className={`${inputClass} pl-10`}
              />
            </div>
            <select
              value={statusFilter}
              aria-label={t("status")}
              onChange={(event) => {
                setStatusFilter(event.target.value as TrainingStatus | "");
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="">{t("allStatuses")}</option>
              <option value="active">{t("active")}</option>
              <option value="inactive">{t("inactive")}</option>
            </select>
            <div className="flex gap-2">
              <select
                value={sortBy}
                aria-label={t("sortBy")}
                onChange={(event) => {
                  setSortBy(event.target.value as TrainingCategorySortBy);
                  setPage(1);
                }}
                className={selectClass}
              >
                <option value="sort_order">{t("sortOrder")}</option>
                <option value="name">{t("categoryName")}</option>
                <option value="status">{t("status")}</option>
                <option value="created_at">{t("createdDate")}</option>
                <option value="updated_at">{t("updatedDate")}</option>
              </select>
              <button
                type="button"
                onClick={() =>
                  setSortOrder((previous) =>
                    previous === "ASC" ? "DESC" : "ASC",
                  )
                }
                aria-label={
                  sortOrder === "ASC" ? t("sortAscending") : t("sortDescending")
                }
                title={
                  sortOrder === "ASC" ? t("sortAscending") : t("sortDescending")
                }
                className={`grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-lg border bg-white transition dark:bg-transparent ${neutralButton} ${focusRing}`}
              >
                {sortOrder === "ASC" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
        {categoriesError && (
          <div
            role="alert"
            className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300"
          >
            <AlertTriangle className="h-5 w-5 shrink-0" />
            {t("messages.loadCategories")}
          </div>
        )}
        {/* CATEGORIES */}
        {categories.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white px-4 py-16 text-center text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 sm:py-20">
            {t("noCategories")}
          </div>
        ) : (
          <>
            {/* CARDS (below xl) */}
            <div className="space-y-4 xl:hidden">
              {categories.map((category) => {
                const expanded = expandedCategories.has(category.id);
                const categoryStatusInfo = getStatusLabel(category.status);
                return (
                  <article
                    key={category.id}
                    className="min-w-0 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2">
                        <button
                          type="button"
                          onClick={() => void toggleCategory(category.id)}
                          aria-expanded={expanded}
                          aria-label={
                            expanded ? t("collapseTopics") : t("expandTopics")
                          }
                          className={`mt-0.5 grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10 ${focusRing}`}
                        >
                          {expanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            {category.id}
                          </p>
                          <h3 className="mt-1 flex items-start gap-2 break-words text-lg font-semibold text-zinc-950 dark:text-white">
                            <FolderOpen className="mt-1 h-4 w-4 shrink-0 text-amber-500" />
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="mt-1 break-words text-sm text-zinc-500 dark:text-zinc-400">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${categoryStatusInfo.color}`}
                      >
                        {categoryStatusInfo.label}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="min-w-0 rounded-lg bg-zinc-50 p-3 dark:bg-white/5">
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          {t("topics")}
                        </p>
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                          <BookOpen className="h-3.5 w-3.5" />
                          {category.topics_count}
                        </span>
                      </div>
                      <div className="min-w-0 rounded-lg bg-zinc-50 p-3 dark:bg-white/5">
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          {t("sortOrder")}
                        </p>
                        <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {category.sort_order}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-white/10">
                      <CategoryActions
                        onAddTopic={() => openCreateTopicModal(category)}
                        onEdit={() => openEditCategoryModal(category)}
                        onDelete={() => openDeleteCategoryModal(category)}
                      />
                    </div>
                    {expanded && (
                      <div className="mt-4">
                        <TopicsPanel
                          topics={topicsData[category.id] ?? []}
                          isLoading={loadingTopics.has(category.id)}
                          loadError={topicError[category.id] ? t("messages.loadTopics") : ""}
                          getStatusLabel={getStatusLabel}
                          onAdd={() => openCreateTopicModal(category)}
                          onUpload={openUploadFileModal}
                          onView={(topic) => void openViewTopicModal(topic)}
                          onEdit={openEditTopicModal}
                          onDelete={openDeleteTopicModal}
                        />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
            {/* TABLE (xl and up) */}
            <div className="hidden overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900 xl:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                    <tr>
                      <th className="w-12 px-4 py-3" />
                      <th className="px-4 py-3 font-medium">{t("id")}</th>
                      <th className="px-4 py-3 font-medium">{t("categoryName")}</th>
                      <th className="px-4 py-3 font-medium">{t("topics")}</th>
                      <th className="px-4 py-3 font-medium">{t("sortOrder")}</th>
                      <th className="px-4 py-3 font-medium">{t("status")}</th>
                      <th className="px-4 py-3 text-right font-medium">
                        {t("actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => {
                      const expanded = expandedCategories.has(category.id);
                      const categoryStatusInfo = getStatusLabel(
                        category.status,
                      );
                      return (
                        <React.Fragment key={category.id}>
                          <tr className="border-t border-zinc-100 transition hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5">
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() => void toggleCategory(category.id)}
                                aria-expanded={expanded}
                                aria-label={
                                  expanded ? t("collapseTopics") : t("expandTopics")
                                }
                                className={`grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10 ${focusRing}`}
                              >
                                {expanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                              {category.id}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <FolderOpen className="mt-1 h-4 w-4 shrink-0 text-amber-500" />
                                <div className="min-w-0">
                                  <p className="font-medium text-zinc-950 dark:text-white">
                                    {category.name}
                                  </p>
                                  {category.description && (
                                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                      {category.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                                <BookOpen className="h-3.5 w-3.5" />
                                {category.topics_count}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                              {category.sort_order}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${categoryStatusInfo.color}`}
                              >
                                {categoryStatusInfo.label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-1.5">
                                <CategoryActions
                                  compact
                                  onAddTopic={() =>
                                    openCreateTopicModal(category)
                                  }
                                  onEdit={() => openEditCategoryModal(category)}
                                  onDelete={() =>
                                    openDeleteCategoryModal(category)
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                          {/* TOPICS */}
                          {expanded && (
                            <tr>
                              <td
                                colSpan={7}
                                className="bg-zinc-50/70 p-4 dark:bg-white/5"
                              >
                                <TopicsPanel
                                  topics={topicsData[category.id] ?? []}
                                  isLoading={loadingTopics.has(category.id)}
                                  loadError={topicError[category.id] ? t("messages.loadTopics") : ""}
                                  getStatusLabel={getStatusLabel}
                                  onAdd={() => openCreateTopicModal(category)}
                                  onUpload={openUploadFileModal}
                                  onView={(topic) =>
                                    void openViewTopicModal(topic)
                                  }
                                  onEdit={openEditTopicModal}
                                  onDelete={openDeleteTopicModal}
                                />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        {/* PAGINATION */}
        {pagination && (
          <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("paginationRange", {
                from: pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1,
                to: Math.min(pagination.page * pagination.limit, pagination.total),
                total: pagination.total,
              })}
            </p>
            <div className="flex items-center gap-2">
              <select
                value={limit}
                aria-label={t("rowsPerPage")}
                onChange={(event) => {
                  setLimit(Number(event.target.value));
                  setPage(1);
                }}
                className="h-9 cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
              >
                <option value={10}>{t("pageSize", { count: 10 })}</option>
                <option value={20}>{t("pageSize", { count: 20 })}</option>
                <option value={50}>{t("pageSize", { count: 50 })}</option>
              </select>
              <button
                type="button"
                disabled={!pagination.has_prev_page}
                onClick={() => setPage((previous) => previous - 1)}
                aria-label={t("previousPage")}
                className={`grid h-9 w-9 cursor-pointer place-items-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-40 ${neutralButton} ${focusRing}`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-16 text-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {pagination.page} / {Math.max(pagination.total_pages, 1)}
              </span>
              <button
                type="button"
                disabled={!pagination.has_next_page}
                onClick={() => setPage((previous) => previous + 1)}
                aria-label={t("nextPage")}
                className={`grid h-9 w-9 cursor-pointer place-items-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-40 ${neutralButton} ${focusRing}`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* CREATE CATEGORY */}
      <Modal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        title={t("createCategory")}
        description={t("createCategoryDescription")}
        error={error ? t(error as TrainingMessageKey) : ""}
        onConfirm={() => void handleCreateCategory()}
        confirmLabel={t("create")}
        cancelLabel={t("cancel")}
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
        title={t("editCategory")}
        error={error ? t(error as TrainingMessageKey) : ""}
        onConfirm={() => void handleUpdateCategory()}
        confirmLabel={t("update")}
        cancelLabel={t("cancel")}
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
        title={t("deleteCategory")}
        description={t("deleteCategoryDescription")}
        error={error ? t(error as TrainingMessageKey) : ""}
        onConfirm={() => void handleDeleteCategory()}
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
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
        title={t("createTopic")}
        error={error ? t(error as TrainingMessageKey) : ""}
        onConfirm={() => void handleCreateTopic()}
        confirmLabel={t("create")}
        cancelLabel={t("cancel")}
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
        title={t("editTopic")}
        error={error ? t(error as TrainingMessageKey) : ""}
        onConfirm={() => void handleUpdateTopic()}
        confirmLabel={t("update")}
        cancelLabel={t("cancel")}
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
        title={t("deleteTopic")}
        description={t("deleteTopicDescription")}
        error={error ? t(error as TrainingMessageKey) : ""}
        onConfirm={() => void handleDeleteTopic()}
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
        isPending={deleteTopicMutation.isPending}
        lang={lang}
        isDestructive
      >
        <p>{selectedTopic?.title}</p>
      </Modal>
      {/* UPLOAD */}
      {isUploadFileModalOpen && selectedTopic && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm">
          <button
            type="button"
            aria-label={t("closeUpload")}
            className="absolute inset-0 cursor-default"
            onClick={() => setIsUploadFileModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("uploadFile")}
            className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg border border-zinc-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-zinc-900 sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-zinc-950 dark:text-white sm:text-xl">
                  {t("uploadFile")}
                </h2>
                <p className="mt-1 break-words text-sm text-zinc-500 dark:text-zinc-400">
                  {selectedTopic.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadFileModalOpen(false)}
                aria-label={t("close")}
                className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white ${focusRing}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {error && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300"
              >
                {t(error as TrainingMessageKey)}
              </div>
            )}
            <div className="mt-5 space-y-4">
              <input
                value={fileTitle}
                onChange={(event) => setFileTitle(event.target.value)}
                aria-label={t("fileTitle")}
                placeholder={t("fileTitle")}
                className={inputClass}
              />
              <div className="space-y-2">
                <input ref={fileInputRef} type="file" className="hidden" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className={`${inputClass} text-left`}>{t("chooseFile")}</button>
                <p className="break-all text-sm text-zinc-500 dark:text-zinc-400">{selectedFile?.name || t("noFileSelected")}</p>
              </div>
              <input
                type="number"
                min="0"
                value={fileSortOrder}
                onChange={(event) =>
                  setFileSortOrder(Number(event.target.value))
                }
                aria-label={t("sortOrderInput")}
                className={inputClass}
                placeholder={t("sortOrderInput")}
              />
              <select
                value={fileStatus}
                aria-label={t("status")}
                onChange={(event) =>
                  setFileStatus(event.target.value as TrainingStatus)
                }
                className={selectClass}
              >
                <option value="active">{t("active")}</option>
                <option value="inactive">{t("inactive")}</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsUploadFileModalOpen(false)}
                className={`inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border px-5 text-sm font-medium transition ${neutralButton} ${focusRing}`}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                disabled={uploadFileMutation.isPending}
                onClick={() => void handleUploadFile()}
                className={`inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
              >
                {t("upload")}
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
          handleDelete={(fileId) => setDeletingFileId(fileId)}
          handleView={handleViewTrainingFile}
        />
      )}
      <Modal
        isOpen={Boolean(deletingFileId)}
        onClose={() => setDeletingFileId(null)}
        title={t("deleteFile")}
        description={t("confirmDeleteFile")}
        onConfirm={() => { if (deletingFileId) void handleDeleteFile(deletingFileId).then(() => setDeletingFileId(null)); }}
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
        isPending={deleteFileMutation.isPending}
        lang={lang}
        isDestructive
      ><p>{selectedTopic?.files?.find((file) => file.id === deletingFileId)?.file_title || ""}</p></Modal>
    </>
  );
}
// ======================================================
// CATEGORY ACTIONS
// ======================================================
function CategoryActions({
  compact = false,
  onAddTopic,
  onEdit,
  onDelete,
}: {
  compact?: boolean;
  onAddTopic: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("adminTraining");
  const base = compact
    ? "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition"
    : "inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition sm:flex-none";
  return (
    <>
      <button
        type="button"
        onClick={onAddTopic}
        aria-label={t("addTopic")}
        title={t("addTopic")}
        className={`${base} ${neutralButton} ${focusRing}`}
      >
        <Plus className="h-4 w-4" />
        {!compact && t("addTopic")}
      </button>
      <button
        type="button"
        onClick={onEdit}
        aria-label={t("edit")}
        title={t("edit")}
        className={`${base} ${neutralButton} ${focusRing}`}
      >
        <Pencil className="h-4 w-4" />
        {!compact && t("edit")}
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={t("delete")}
        title={t("delete")}
        className={`${base} ${dangerButton} ${focusRing}`}
      >
        <Trash2 className="h-4 w-4" />
        {!compact && t("delete")}
      </button>
    </>
  );
}
// ======================================================
// TOPICS PANEL
// ======================================================
function TopicsPanel({
  topics,
  isLoading,
  loadError,
  getStatusLabel,
  onAdd,
  onUpload,
  onView,
  onEdit,
  onDelete,
}: {
  topics: TrainingTopic[];
  isLoading: boolean;
  loadError?: string;
  getStatusLabel: (status: TrainingStatus) => StatusInfo;
  onAdd: () => void;
  onUpload: (topic: TrainingTopic) => void;
  onView: (topic: TrainingTopic) => void;
  onEdit: (topic: TrainingTopic) => void;
  onDelete: (topic: TrainingTopic) => void;
}) {
  const t = useTranslations("adminTraining");
  const iconButton = `grid h-9 w-9 cursor-pointer place-items-center rounded-lg border transition ${focusRing}`;
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 dark:border-white/10">
        <p className="text-sm font-semibold text-zinc-950 dark:text-white">
          {t("topicsCount", { count: topics.length })}
        </p>
        <button
          type="button"
          onClick={onAdd}
          className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition ${neutralButton} ${focusRing}`}
        >
          <Plus className="h-4 w-4" />
          {t("addTopic")}
        </button>
      </div>
      {isLoading ? (
        <div role="status" className="py-10 text-center">
          <RefreshCw className="mx-auto h-6 w-6 animate-spin text-emerald-600 dark:text-emerald-400" />
        </div>
      ) : loadError ? (
        <div className="p-5 text-sm text-red-600 dark:text-red-300">
          {loadError}
        </div>
      ) : topics.length === 0 ? (
        <div className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {t("noTopics")}
        </div>
      ) : (
        <ul className="divide-y divide-zinc-100 dark:divide-white/10">
          {topics.map((topic) => {
            const statusInfo = getStatusLabel(topic.status);
            return (
              <li
                key={topic.id}
                className="flex flex-col gap-3 px-4 py-4 transition hover:bg-zinc-50 dark:hover:bg-white/5 md:flex-row md:items-start md:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {topic.id}
                  </p>
                  <p className="mt-1 break-words font-medium text-zinc-950 dark:text-white">
                    {topic.title}
                  </p>
                  {topic.description && (
                    <p className="mt-1 break-words text-xs text-zinc-500 dark:text-zinc-400">
                      {topic.description}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>{t("filesCount", { count: topic.files_count })}</span>
                    <span>{t("sortValue", { order: topic.sort_order })}</span>
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 font-medium ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onUpload(topic)}
                    className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-200 px-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-400/30 dark:text-emerald-300 dark:hover:bg-emerald-400/10 ${focusRing}`}
                  >
                    <Upload className="h-4 w-4" />
                    {t("upload")}
                  </button>
                  <button
                    type="button"
                    onClick={() => onView(topic)}
                    aria-label={t("view")}
                    title={t("view")}
                    className={`${iconButton} ${neutralButton}`}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(topic)}
                    aria-label={t("edit")}
                    title={t("edit")}
                    className={`${iconButton} ${neutralButton}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(topic)}
                    aria-label={t("delete")}
                    title={t("delete")}
                    className={`${iconButton} ${dangerButton}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}