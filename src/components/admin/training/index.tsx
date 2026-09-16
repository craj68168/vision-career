"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  RefreshCw,
  AlertTriangle,
  FolderOpen,
  BookOpen,
  FileText,
  Plus,
  ChevronDown,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  File,
  Video,
  Image,
  Link2,
  FileSpreadsheet,
  Presentation,
  Upload,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  useTrainingCategories,
  useTrainingTopics,
  useCreateTrainingCategory,
  useCreateTrainingTopic,
  useUploadTrainingFile,
  useUpdateTrainingCategory,
  useUpdateTrainingTopic,
  useDeleteTrainingCategory,
  useDeleteTrainingTopic,
  TrainingCategory,
  TrainingTopic,
  TrainingStatus,
  GetTrainingCategoriesParams,
  useDeleteTrainingFile,
} from "@/hooks/useTraining";
import useDebounced from "@/hooks/useDebounced";
import toast from "react-hot-toast";
import { TopicViewModal } from "./TopicViewModal";
import { Modal } from "./Modal";
import { CategoryForm } from "./CategoryForm";
import { TopicForm } from "./TopicForm";

export default function AdminTrainingCategories() {
  const { lang } = useLanguage();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<TrainingStatus | "">("");
  const [sortBy, setSortBy] = useState<
    "id" | "name" | "sort_order" | "status" | "created_at" | "updated_at"
  >("sort_order");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(),
  );

  // Modal states
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
  const [selectedCategory, setSelectedCategory] =
    useState<TrainingCategory | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TrainingTopic | null>(
    null,
  );

  // Form states for category creation/editing
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categorySortOrder, setCategorySortOrder] = useState(0);
  const [categoryStatus, setCategoryStatus] =
    useState<TrainingStatus>("active");

  // Form states for topic creation/editing
  const [topicTitle, setTopicTitle] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [topicSortOrder, setTopicSortOrder] = useState(0);
  const [topicStatus, setTopicStatus] = useState<TrainingStatus>("active");

  // Form states for file upload
  const [fileTitle, setFileTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileSortOrder, setFileSortOrder] = useState(0);
  const [fileStatus, setFileStatus] = useState<TrainingStatus>("active");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");

  const categoryParams: GetTrainingCategoriesParams = {
    page,
    limit,
    search: debouncedSearch,
    status: statusFilter,
    sort_by: sortBy,
    sort_order: sortOrder,
  };

  const {
    data: categoriesResponse,
    isLoading,
    isFetching,
    error: categoriesError,
    refetch: refetchCategories,
  } = useTrainingCategories(categoryParams);

  const categories = categoriesResponse?.data ?? [];
  const pagination = categoriesResponse?.pagination ?? null;

  const [topicsData, setTopicsData] = useState<Record<number, TrainingTopic[]>>(
    {},
  );
  const [loadingTopics, setLoadingTopics] = useState<Set<number>>(new Set());
  const [topicError, setTopicError] = useState<Record<number, string>>({});

  // Mutations
  const createCategoryMutation = useCreateTrainingCategory();
  const updateCategoryMutation = useUpdateTrainingCategory();
  const deleteCategoryMutation = useDeleteTrainingCategory();
  const createTopicMutation = useCreateTrainingTopic();
  const updateTopicMutation = useUpdateTrainingTopic();
  const deleteTopicMutation = useDeleteTrainingTopic();
  const uploadFileMutation = useUploadTrainingFile();

  const loadTopicsForCategory = async (categoryId: number) => {
    if (topicsData[categoryId] !== undefined) return;
    if (loadingTopics.has(categoryId)) return;

    setLoadingTopics((prev) => new Set(prev).add(categoryId));
    setTopicError((prev) => ({ ...prev, [categoryId]: "" }));

    try {
      const response = await fetch(
        `https://vision-career.co.jp/admin-get-training-topics.php?category_id=${categoryId}&limit=100&sort_by=sort_order&sort_order=ASC`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Failed to load topics");
      }

      setTopicsData((prev) => ({
        ...prev,
        [categoryId]: data.data || [],
      }));
    } catch (err) {
      setTopicError((prev) => ({
        ...prev,
        [categoryId]:
          err instanceof Error
            ? err.message
            : lang === "ja"
              ? "トピックの読み込みに失敗しました"
              : "Failed to load topics",
      }));
    } finally {
      setLoadingTopics((prev) => {
        const newSet = new Set(prev);
        newSet.delete(categoryId);
        return newSet;
      });
    }
  };
  useEffect(() => {
    expandedCategories.forEach((categoryId) => {
      loadTopicsForCategory(categoryId);
    });
  }, [expandedCategories, lang, topicsData, loadingTopics]);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const getStatusLabel = (
    status: TrainingStatus,
  ): { label: string; color: string; darkColor: string } => {
    const map: Record<
      TrainingStatus,
      { label: { ja: string; en: string }; color: string; darkColor: string }
    > = {
      active: {
        label: { ja: "有効", en: "Active" },
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        darkColor:
          "dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
      },
      inactive: {
        label: { ja: "無効", en: "Inactive" },
        color: "bg-slate-100 text-slate-600 border-slate-200",
        darkColor:
          "dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      },
    };

    const result = map[status];
    return {
      label: lang === "ja" ? result.label.ja : result.label.en,
      color: result.color,
      darkColor: result.darkColor,
    };
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(lang === "ja" ? "ja-JP" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getFileIcon = (fileType: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      pdf: <FileText className="h-5 w-5 text-red-500" />,
      video: <Video className="h-5 w-5 text-purple-500" />,
      image: <Image className="h-5 w-5 text-blue-500" />,
      doc: <FileText className="h-5 w-5 text-blue-600" />,
      excel: <FileSpreadsheet className="h-5 w-5 text-green-600" />,
      ppt: <Presentation className="h-5 w-5 text-orange-500" />,
      link: <Link2 className="h-5 w-5 text-cyan-500" />,
      other: <File className="h-5 w-5 text-slate-500" />,
    };
    return iconMap[fileType] || iconMap.other;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getFileTypeLabel = (fileType: string): string => {
    const map: Record<string, { ja: string; en: string }> = {
      pdf: { ja: "PDF", en: "PDF" },
      video: { ja: "動画", en: "Video" },
      image: { ja: "画像", en: "Image" },
      doc: { ja: "ドキュメント", en: "Document" },
      excel: { ja: "スプレッドシート", en: "Spreadsheet" },
      ppt: { ja: "プレゼンテーション", en: "Presentation" },
      link: { ja: "リンク", en: "Link" },
      other: { ja: "その他", en: "Other" },
    };
    return (
      map[fileType]?.[lang as keyof (typeof map)[typeof fileType]] || fileType
    );
  };

  // Category Handlers
  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      setError(
        lang === "ja" ? "カテゴリー名は必須です" : "Category name is required",
      );
      return;
    }

    try {
      await createCategoryMutation.mutateAsync({
        name: categoryName.trim(),
        description: categoryDescription.trim() || null,
        sort_order: categorySortOrder,
        status: categoryStatus,
      });

      toast.success(
        lang === "ja"
          ? "カテゴリーを作成しました"
          : "Category created successfully",
      );
      setIsCreateCategoryModalOpen(false);
      resetCategoryForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang === "ja"
            ? "カテゴリーの作成に失敗しました"
            : "Failed to create category",
      );
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    if (!categoryName.trim()) {
      setError(
        lang === "ja" ? "カテゴリー名は必須です" : "Category name is required",
      );
      return;
    }

    try {
      await updateCategoryMutation.mutateAsync({
        id: selectedCategory.id,
        name: categoryName.trim(),
        description: categoryDescription.trim() || null,
        sort_order: categorySortOrder,
        status: categoryStatus,
      });

      toast.success(
        lang === "ja"
          ? "カテゴリーを更新しました"
          : "Category updated successfully",
      );
      setIsEditCategoryModalOpen(false);
      resetCategoryForm();
      refetchCategories();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang === "ja"
            ? "カテゴリーの更新に失敗しました"
            : "Failed to update category",
      );
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategoryMutation.mutateAsync({
        id: selectedCategory.id,
      });

      toast.success(
        lang === "ja"
          ? "カテゴリーを削除しました"
          : "Category deleted successfully",
      );
      setIsDeleteCategoryModalOpen(false);
      setSelectedCategory(null);
      refetchCategories();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang === "ja"
            ? "カテゴリーの削除に失敗しました"
            : "Failed to delete category",
      );
    }
  };

  // Topic Handlers
  const handleCreateTopic = async () => {
    if (!selectedCategory) return;
    if (!topicTitle.trim()) {
      setError(
        lang === "ja"
          ? "トピックタイトルは必須です"
          : "Topic title is required",
      );
      return;
    }

    try {
      await createTopicMutation.mutateAsync({
        category_id: selectedCategory.id,
        title: topicTitle.trim(),
        description: topicDescription.trim() || null,
        sort_order: topicSortOrder,
        status: topicStatus,
      });

      toast.success(
        lang === "ja" ? "トピックを作成しました" : "Topic created successfully",
      );
      setIsCreateTopicModalOpen(false);
      resetTopicForm();

      // Refresh topics for this category
      setTopicsData((prev) => {
        const updated = { ...prev };
        delete updated[selectedCategory.id];
        return updated;
      });
      // Re-expand to reload
      setExpandedCategories((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedCategory.id);
        setTimeout(() => {
          setExpandedCategories((newSet2) => {
            const refreshed = new Set(newSet2);
            refreshed.add(selectedCategory.id);
            return refreshed;
          });
        }, 100);
        return newSet;
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang === "ja"
            ? "トピックの作成に失敗しました"
            : "Failed to create topic",
      );
    }
  };

  const handleUpdateTopic = async () => {
    if (!selectedTopic) return;
    if (!topicTitle.trim()) {
      setError(
        lang === "ja"
          ? "トピックタイトルは必須です"
          : "Topic title is required",
      );
      return;
    }

    try {
      await updateTopicMutation.mutateAsync({
        id: selectedTopic.id,
        category_id: selectedTopic.category_id,
        title: topicTitle.trim(),
        description: topicDescription.trim() || null,
        sort_order: topicSortOrder,
        status: topicStatus,
      });

      toast.success(
        lang === "ja" ? "トピックを更新しました" : "Topic updated successfully",
      );
      setIsEditTopicModalOpen(false);
      resetTopicForm();

      // Refresh topics for this category
      if (selectedTopic.category_id) {
        setTopicsData((prev) => {
          const updated = { ...prev };
          delete updated[selectedTopic.category_id];
          return updated;
        });
        setExpandedCategories((prev) => {
          const newSet = new Set(prev);
          newSet.delete(selectedTopic.category_id);
          setTimeout(() => {
            setExpandedCategories((newSet2) => {
              const refreshed = new Set(newSet2);
              refreshed.add(selectedTopic.category_id);
              return refreshed;
            });
          }, 100);
          return newSet;
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang === "ja"
            ? "トピックの更新に失敗しました"
            : "Failed to update topic",
      );
    }
  };

  const handleDeleteTopic = async () => {
    if (!selectedTopic) return;

    try {
      await deleteTopicMutation.mutateAsync({
        id: selectedTopic.id,
      });

      toast.success(
        lang === "ja" ? "トピックを削除しました" : "Topic deleted successfully",
      );
      setIsDeleteTopicModalOpen(false);
      setSelectedTopic(null);

      // Refresh topics for this category
      if (selectedTopic.category_id) {
        setTopicsData((prev) => {
          const updated = { ...prev };
          delete updated[selectedTopic.category_id];
          return updated;
        });
        setExpandedCategories((prev) => {
          const newSet = new Set(prev);
          newSet.delete(selectedTopic.category_id);
          setTimeout(() => {
            setExpandedCategories((newSet2) => {
              const refreshed = new Set(newSet2);
              refreshed.add(selectedTopic.category_id);
              return refreshed;
            });
          }, 100);
          return newSet;
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang === "ja"
            ? "トピックの削除に失敗しました"
            : "Failed to delete topic",
      );
    }
  };

  // Upload file handler
  const handleUploadFile = async () => {
    if (!selectedTopic) return;
    if (!fileTitle.trim()) {
      setError(
        lang === "ja" ? "ファイルタイトルは必須です" : "File title is required",
      );
      return;
    }
    if (!selectedFile) {
      setError(
        lang === "ja" ? "ファイルを選択してください" : "Please select a file",
      );
      return;
    }

    try {
      await uploadFileMutation.mutateAsync({
        topic_id: selectedTopic.id,
        file_title: fileTitle.trim(),
        file: selectedFile,
        sort_order: fileSortOrder,
        status: fileStatus,
      });

      toast.success(
        lang === "ja"
          ? "ファイルをアップロードしました"
          : "File uploaded successfully",
      );
      setIsUploadFileModalOpen(false);
      resetFileForm();

      setTopicsData((prev) => {
        const updated = { ...prev };
        if (selectedTopic.category_id) {
          delete updated[selectedTopic.category_id];
        }
        return updated;
      });
      if (selectedTopic.category_id) {
        setExpandedCategories((prev) => {
          const newSet = new Set(prev);
          newSet.delete(selectedTopic.category_id);
          setTimeout(() => {
            setExpandedCategories((newSet2) => {
              const refreshed = new Set(newSet2);
              refreshed.add(selectedTopic.category_id);
              return refreshed;
            });
          }, 100);
          return newSet;
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang === "ja"
            ? "ファイルのアップロードに失敗しました"
            : "Failed to upload file",
      );
    }
  };

  // Reset forms
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

  // Modal open functions
  const openCreateTopicModal = (category: TrainingCategory) => {
    setSelectedCategory(category);
    resetTopicForm();
    setIsCreateTopicModalOpen(true);
  };

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

  const openViewTopicModal = (topic: TrainingTopic) => {
    setSelectedTopic(topic);
    setIsViewTopicModalOpen(true);
  };

  const deleteMutation = useDeleteTrainingFile();

  const handleDeleteFile = async (id: number) => {
    if (!confirm("Are you sure to delete this file?")) return;

    const toastId = toast.loading("Deleting File");
    try {
      await deleteMutation.mutateAsync({ id });
      setIsViewTopicModalOpen(false);
      toast.dismiss(toastId);
      toast.success("File deleted successfully.");

      if (selectedTopic?.category_id) {
        setTopicsData((prev) => {
          const updated = { ...prev };
          delete updated[selectedTopic.category_id];
          return updated;
        });

        setExpandedCategories((prev) => {
          const newSet = new Set(prev);
          newSet.delete(selectedTopic.category_id);
          setTimeout(() => {
            setExpandedCategories((newSet2) => {
              const refreshed = new Set(newSet2);
              refreshed.add(selectedTopic.category_id);
              return refreshed;
            });
          }, 100);
          return newSet;
        });
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error while deleting file");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
        <div
          className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
          role="status"
          aria-busy="true"
        >
          <RefreshCw className="mx-auto mb-4 h-10 w-10 animate-spin text-slate-400 dark:text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {lang === "ja"
              ? "トレーニングカテゴリーを読み込み中..."
              : "Loading training categories..."}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8">
      {/* Header Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {lang === "ja" ? "トレーニングカテゴリー" : "Training Categories"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {lang === "ja"
                ? "トレーニングカテゴリーとそのトピックを管理します。"
                : "Manage training categories and their topics."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                resetCategoryForm();
                setIsCreateCategoryModalOpen(true);
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              {lang === "ja" ? "新規カテゴリー" : "New Category"}
            </button>

            <button
              type="button"
              onClick={() => refetchCategories()}
              disabled={isFetching}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              {lang === "ja" ? "更新" : "Refresh"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="relative">
            <label htmlFor="category-search" className="sr-only">
              {lang === "ja" ? "カテゴリーを検索" : "Search categories"}
            </label>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              id="category-search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={
                lang === "ja"
                  ? "カテゴリー名で検索..."
                  : "Search by category name..."
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as TrainingStatus | "");
              setPage(1);
            }}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
          >
            <option value="">
              {lang === "ja" ? "全てのステータス" : "All Statuses"}
            </option>
            <option value="active">{lang === "ja" ? "有効" : "Active"}</option>
            <option value="inactive">
              {lang === "ja" ? "無効" : "Inactive"}
            </option>
          </select>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as typeof sortBy);
                setPage(1);
              }}
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
            >
              <option value="id">ID</option>
              <option value="name">{lang === "ja" ? "名前" : "Name"}</option>
              <option value="sort_order">
                {lang === "ja" ? "並び順" : "Sort Order"}
              </option>
              <option value="status">
                {lang === "ja" ? "ステータス" : "Status"}
              </option>
              <option value="created_at">
                {lang === "ja" ? "作成日" : "Created"}
              </option>
              <option value="updated_at">
                {lang === "ja" ? "更新日" : "Updated"}
              </option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
                setPage(1);
              }}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {sortOrder === "ASC" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {(error || categoriesError) && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error ||
            (categoriesError instanceof Error
              ? categoriesError.message
              : lang === "ja"
                ? "カテゴリーの読み込みに失敗しました"
                : "Failed to load categories")}
        </div>
      )}

      {/* Categories Table */}
      {categories.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-slate-300 dark:text-slate-600" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {lang === "ja"
              ? "カテゴリーが見つかりません"
              : "No categories found"}
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {lang === "ja"
              ? "新しいカテゴリーを作成するか、検索条件を変更してください。"
              : "Create a new category or try changing your search criteria."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="w-10 px-5 py-4 font-semibold"></th>
                  <th className="px-5 py-4 font-semibold">ID</th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "カテゴリー名" : "Category Name"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "トピック数" : "Topics"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "並び順" : "Sort Order"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "ステータス" : "Status"}
                  </th>
                  <th className="px-5 py-4 text-right font-semibold">
                    {lang === "ja" ? "操作" : "Actions"}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {categories.map((category) => {
                  const statusInfo = getStatusLabel(category.status);
                  const isExpanded = expandedCategories.has(category.id);
                  const isLoadingTopics = loadingTopics.has(category.id);
                  const categoryTopics = topicsData[category.id] || [];
                  const hasError = !!topicError[category.id];

                  return (
                    <React.Fragment key={category.id}>
                      {/* Category Row */}
                      <tr
                        className="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        onClick={() => toggleCategory(category.id)}
                      >
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCategory(category.id);
                            }}
                            className="rounded-full p-1 hover:bg-slate-200 dark:hover:bg-slate-700"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            )}
                          </button>
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-300">
                          #{category.id}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {category.name}
                            </span>
                          </div>
                          {category.description && (
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                              {category.description}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            <BookOpen className="h-3 w-3" />
                            {category.topics_count || 0}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {category.sort_order}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.color} ${statusInfo.darkColor}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div
                            className="flex justify-end gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => openCreateTopicModal(category)}
                              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              {lang === "ja" ? "トピック追加" : "Add Topic"}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditCategoryModal(category);
                              }}
                              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              {lang === "ja" ? "編集" : "Edit"}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteCategoryModal(category);
                              }}
                              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {lang === "ja" ? "削除" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Nested Topics Row */}
                      {isExpanded && (
                        <tr>
                          <td
                            colSpan={7}
                            className="bg-slate-50 p-0 dark:bg-slate-800/50"
                          >
                            <div className="border-t border-slate-200 p-4 dark:border-slate-700">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                  {lang === "ja" ? "トピック一覧" : "Topics"}
                                  <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                                    ({categoryTopics.length})
                                  </span>
                                </h4>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openCreateTopicModal(category);
                                  }}
                                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                  {lang === "ja" ? "トピック追加" : "Add Topic"}
                                </button>
                              </div>

                              {/* Topics Loading State */}
                              {isLoadingTopics && (
                                <div className="flex items-center justify-center py-8">
                                  <RefreshCw className="h-6 w-6 animate-spin text-slate-400 dark:text-slate-500" />
                                  <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                                    {lang === "ja"
                                      ? "トピックを読み込み中..."
                                      : "Loading topics..."}
                                  </span>
                                </div>
                              )}

                              {/* Topics Error */}
                              {hasError && !isLoadingTopics && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                                  {topicError[category.id]}
                                </div>
                              )}

                              {/* Topics List */}
                              {!isLoadingTopics &&
                                !hasError &&
                                categoryTopics.length === 0 && (
                                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-600 dark:bg-slate-800/50">
                                    <BookOpen className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
                                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                      {lang === "ja"
                                        ? "このカテゴリーにはトピックがありません。"
                                        : "No topics in this category."}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openCreateTopicModal(category);
                                      }}
                                      className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                                    >
                                      <Plus className="h-4 w-4" />
                                      {lang === "ja"
                                        ? "最初のトピックを作成"
                                        : "Create First Topic"}
                                    </button>
                                  </div>
                                )}

                              {/* Topics Table */}
                              {!isLoadingTopics &&
                                !hasError &&
                                categoryTopics.length > 0 && (
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                      <thead className="bg-white text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                        <tr>
                                          <th className="px-4 py-2 font-semibold">
                                            ID
                                          </th>
                                          <th className="px-4 py-2 font-semibold">
                                            {lang === "ja"
                                              ? "タイトル"
                                              : "Title"}
                                          </th>
                                          <th className="px-4 py-2 font-semibold">
                                            {lang === "ja"
                                              ? "ファイル数"
                                              : "Files"}
                                          </th>
                                          <th className="px-4 py-2 font-semibold">
                                            {lang === "ja"
                                              ? "並び順"
                                              : "Sort Order"}
                                          </th>
                                          <th className="px-4 py-2 font-semibold">
                                            {lang === "ja"
                                              ? "ステータス"
                                              : "Status"}
                                          </th>
                                          <th className="px-4 py-2 text-right font-semibold">
                                            {lang === "ja" ? "操作" : "Actions"}
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                                        {categoryTopics.map((topic) => {
                                          const topicStatusInfo =
                                            getStatusLabel(topic.status);

                                          return (
                                            <tr
                                              key={topic.id}
                                              className="hover:bg-white/80 dark:hover:bg-slate-700/50"
                                            >
                                              <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300">
                                                #{topic.id}
                                              </td>

                                              <td className="px-4 py-2.5">
                                                <div className="flex items-center gap-2">
                                                  <FileText className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                                                  <span className="font-medium text-slate-900 dark:text-white">
                                                    {topic.title}
                                                  </span>
                                                </div>
                                                {topic.description && (
                                                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                                    {topic.description}
                                                  </p>
                                                )}
                                              </td>

                                              <td className="px-4 py-2.5">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                  <File className="h-3 w-3" />
                                                  {topic.files_count || 0}
                                                </span>
                                              </td>

                                              <td className="px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400">
                                                {topic.sort_order}
                                              </td>

                                              <td className="px-4 py-2.5">
                                                <span
                                                  className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${topicStatusInfo.color} ${topicStatusInfo.darkColor}`}
                                                >
                                                  {topicStatusInfo.label}
                                                </span>
                                              </td>

                                              <td className="px-4 py-2.5">
                                                <div className="flex justify-end gap-1.5">
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      openUploadFileModal(topic)
                                                    }
                                                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                                                  >
                                                    <Upload className="h-3.5 w-3.5" />
                                                    {lang === "ja"
                                                      ? "アップロード"
                                                      : "Upload"}
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      openViewTopicModal(topic)
                                                    }
                                                    className="rounded-lg cursor-pointer p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                                                    title={
                                                      lang === "ja"
                                                        ? "詳細表示"
                                                        : "View Details"
                                                    }
                                                  >
                                                    <Eye className="h-3.5 w-3.5" />
                                                  </button>

                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      openEditTopicModal(topic)
                                                    }
                                                    className="rounded-lg p-1.5 cursor-pointer text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                                                  >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      openDeleteTopicModal(
                                                        topic,
                                                      )
                                                    }
                                                    className="rounded-lg p-1.5 cursor-pointer text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                                                  >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                  </button>
                                                </div>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
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

          {/* Pagination */}
          {pagination && pagination.total > 0 && (
            <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-800">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {lang === "ja" ? (
                  <>
                    全 {pagination.total} 件中{" "}
                    {(pagination.page - 1) * pagination.limit + 1} -{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}{" "}
                    件を表示
                  </>
                ) : (
                  <>
                    Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}{" "}
                    of {pagination.total}
                  </>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-slate-600"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage(1)}
                    disabled={!pagination.has_prev_page || isFetching}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {lang === "ja" ? "最初" : "First"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={!pagination.has_prev_page || isFetching}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {lang === "ja" ? "前へ" : "Prev"}
                  </button>

                  <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    {pagination.page} / {pagination.total_pages}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((prev) =>
                        Math.min(pagination.total_pages, prev + 1),
                      )
                    }
                    disabled={!pagination.has_next_page || isFetching}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {lang === "ja" ? "次へ" : "Next"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPage(pagination.total_pages)}
                    disabled={!pagination.has_next_page || isFetching}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {lang === "ja" ? "最後" : "Last"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Category Modal */}
      <Modal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => {
          setIsCreateCategoryModalOpen(false);
          resetCategoryForm();
        }}
        title={lang === "ja" ? "新規カテゴリー作成" : "Create Category"}
        description={
          lang === "ja"
            ? "新しいトレーニングカテゴリーを作成します。"
            : "Create a new training category."
        }
        error={error}
        onConfirm={handleCreateCategory}
        confirmLabel={lang === "ja" ? "作成" : "Create"}
        cancelLabel={lang === "ja" ? "キャンセル" : "Cancel"}
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

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditCategoryModalOpen}
        onClose={() => {
          setIsEditCategoryModalOpen(false);
          resetCategoryForm();
        }}
        title={lang === "ja" ? "カテゴリー編集" : "Edit Category"}
        description={
          lang === "ja"
            ? `カテゴリー "${selectedCategory?.name}" を編集します。`
            : `Edit category "${selectedCategory?.name}".`
        }
        error={error}
        onConfirm={handleUpdateCategory}
        confirmLabel={lang === "ja" ? "更新" : "Update"}
        cancelLabel={lang === "ja" ? "キャンセル" : "Cancel"}
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

      {/* Delete Category Modal */}
      <Modal
        isOpen={isDeleteCategoryModalOpen}
        onClose={() => {
          setIsDeleteCategoryModalOpen(false);
          setSelectedCategory(null);
          setError("");
        }}
        title={lang === "ja" ? "カテゴリー削除" : "Delete Category"}
        description={
          lang === "ja"
            ? `カテゴリー "${selectedCategory?.name}" を削除してもよろしいですか？`
            : `Are you sure you want to delete category "${selectedCategory?.name}"?`
        }
        error={error}
        onConfirm={handleDeleteCategory}
        confirmLabel={lang === "ja" ? "削除" : "Delete"}
        cancelLabel={lang === "ja" ? "キャンセル" : "Cancel"}
        isPending={deleteCategoryMutation.isPending}
        lang={lang}
        isDestructive
      >
        <div className="space-y-3">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5 dark:text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-400">
                  {lang === "ja"
                    ? "この操作は元に戻せません。"
                    : "This action cannot be undone."}
                </p>
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {lang === "ja"
                    ? `カテゴリー "${selectedCategory?.name}" とそれに属する全てのトピックが削除されます。`
                    : `Category "${selectedCategory?.name}" and all its topics will be deleted.`}
                </p>
                {selectedCategory?.topics_count &&
                  selectedCategory.topics_count > 0 && (
                    <p className="mt-2 text-sm font-semibold text-red-700 dark:text-red-400">
                      {lang === "ja"
                        ? `⚠️ このカテゴリーには ${selectedCategory.topics_count} 個のトピックが含まれています。`
                        : `⚠️ This category contains ${selectedCategory.topics_count} topic(s).`}
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Create Topic Modal */}
      <Modal
        isOpen={isCreateTopicModalOpen}
        onClose={() => {
          setIsCreateTopicModalOpen(false);
          resetTopicForm();
        }}
        title={lang === "ja" ? "新規トピック作成" : "Create Topic"}
        description={
          lang === "ja"
            ? `カテゴリー "${selectedCategory?.name}" に新しいトピックを作成します。`
            : `Create a new topic in category "${selectedCategory?.name}".`
        }
        error={error}
        onConfirm={handleCreateTopic}
        confirmLabel={lang === "ja" ? "作成" : "Create"}
        cancelLabel={lang === "ja" ? "キャンセル" : "Cancel"}
        isPending={createTopicMutation.isPending}
        lang={lang}
      >
        <TopicForm
          categoryName={selectedCategory?.name || ""}
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

      {/* Edit Topic Modal */}
      <Modal
        isOpen={isEditTopicModalOpen}
        onClose={() => {
          setIsEditTopicModalOpen(false);
          resetTopicForm();
        }}
        title={lang === "ja" ? "トピック編集" : "Edit Topic"}
        description={
          lang === "ja"
            ? `トピック "${selectedTopic?.title}" を編集します。`
            : `Edit topic "${selectedTopic?.title}".`
        }
        error={error}
        onConfirm={handleUpdateTopic}
        confirmLabel={lang === "ja" ? "更新" : "Update"}
        cancelLabel={lang === "ja" ? "キャンセル" : "Cancel"}
        isPending={updateTopicMutation.isPending}
        lang={lang}
      >
        <TopicForm
          categoryName={selectedTopic?.category_name || ""}
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

      {/* Delete Topic Modal */}
      <Modal
        isOpen={isDeleteTopicModalOpen}
        onClose={() => {
          setIsDeleteTopicModalOpen(false);
          setSelectedTopic(null);
          setError("");
        }}
        title={lang === "ja" ? "トピック削除" : "Delete Topic"}
        description={
          lang === "ja"
            ? `トピック "${selectedTopic?.title}" を削除してもよろしいですか？`
            : `Are you sure you want to delete topic "${selectedTopic?.title}"?`
        }
        error={error}
        onConfirm={handleDeleteTopic}
        confirmLabel={lang === "ja" ? "削除" : "Delete"}
        cancelLabel={lang === "ja" ? "キャンセル" : "Cancel"}
        isPending={deleteTopicMutation.isPending}
        lang={lang}
        isDestructive
      >
        <div className="space-y-3">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5 dark:text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-400">
                  {lang === "ja"
                    ? "この操作は元に戻せません。"
                    : "This action cannot be undone."}
                </p>
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {lang === "ja"
                    ? `トピック "${selectedTopic?.title}" とそれに属する全てのファイルが削除されます。`
                    : `Topic "${selectedTopic?.title}" and all its files will be deleted.`}
                </p>
                {selectedTopic?.files_count &&
                  selectedTopic.files_count > 0 && (
                    <p className="mt-2 text-sm font-semibold text-red-700 dark:text-red-400">
                      {lang === "ja"
                        ? `⚠️ このトピックには ${selectedTopic.files_count} 個のファイルが含まれています。`
                        : `⚠️ This topic contains ${selectedTopic.files_count} file(s).`}
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Upload File Modal */}
      <Modal
        isOpen={isUploadFileModalOpen}
        onClose={() => {
          setIsUploadFileModalOpen(false);
          resetFileForm();
        }}
        title={lang === "ja" ? "ファイルアップロード" : "Upload File"}
        description={
          lang === "ja"
            ? `トピック "${selectedTopic?.title}" にファイルをアップロードします。`
            : `Upload a file to topic "${selectedTopic?.title}".`
        }
        error={error}
        onConfirm={handleUploadFile}
        confirmLabel={lang === "ja" ? "アップロード" : "Upload"}
        cancelLabel={lang === "ja" ? "キャンセル" : "Cancel"}
        isPending={uploadFileMutation.isPending}
        lang={lang}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {lang === "ja" ? "トピック" : "Topic"}
            </label>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
              {selectedTopic?.title}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {lang === "ja" ? "ファイルタイトル *" : "File Title *"}
            </label>
            <input
              type="text"
              value={fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
              placeholder={
                lang === "ja" ? "ファイルタイトルを入力" : "Enter file title"
              }
              autoFocus
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {lang === "ja" ? "ファイル *" : "File *"}
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setSelectedFile(file);
                }}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white file:cursor-pointer hover:file:bg-slate-800 dark:file:bg-indigo-600 dark:hover:file:bg-indigo-700"
              />
              {selectedFile && (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {formatFileSize(selectedFile.size)}
                </span>
              )}
            </div>
            {selectedFile && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {lang === "ja"
                  ? `選択されたファイル: ${selectedFile.name}`
                  : `Selected file: ${selectedFile.name}`}
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ja" ? "並び順" : "Sort Order"}
              </label>
              <input
                type="number"
                value={fileSortOrder}
                onChange={(e) => setFileSortOrder(Number(e.target.value))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                min="0"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ja" ? "ステータス" : "Status"}
              </label>
              <select
                value={fileStatus}
                onChange={(e) =>
                  setFileStatus(e.target.value as TrainingStatus)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
              >
                <option value="active">
                  {lang === "ja" ? "有効" : "Active"}
                </option>
                <option value="inactive">
                  {lang === "ja" ? "無効" : "Inactive"}
                </option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* View Topic Modal */}
      {isViewTopicModalOpen && selectedTopic && (
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
          getFileTypeLabel={getFileTypeLabel}
          formatDate={formatDate}
          formatFileSize={formatFileSize}
          handleDelete={handleDeleteFile}
        />
      )}
    </div>
  );
}
