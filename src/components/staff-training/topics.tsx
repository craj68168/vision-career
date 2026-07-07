"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  FileText,
  Download,
  Eye,
  Loader2,
  Filter,
  SlidersHorizontal,
  FileIcon,
  ChevronLeft,
  ChevronRight,
  Link2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  useTrainingTopics,
  type TrainingFile,
  type TrainingTopic,
  type TrainingFileType,
} from "@/hooks/useStaffTraining";
import useDebounced from "@/hooks/useDebounced";

interface TrainingTopicsClientProps {
  categoryId: string;
}

type FileTypeFilter = TrainingFileType | "all";

const TEXT = {
  en: {
    back: "Back to categories",
    fallbackTitle: "Training Topics",
    subtitle: "Browse topics and access training materials",
    searchPlaceholder: "Search topics...",
    allFiles: "All formats",
    loading: "Loading topics...",
    errorTitle: "Failed to load topics",
    noTopics: "No topics found in this category",
    noFiles: "No files uploaded yet",
    files: "files",
    preview: "Preview",
    download: "Download",
    unknownSize: "N/A",
    page: "Page",
    previous: "Previous",
    next: "Next",
    showing: "Showing",
    results: "results",
    filters: "Filters",
    sortBy: "Sort by",
  },
  ja: {
    back: "カテゴリ一覧に戻る",
    fallbackTitle: "トレーニングトピック",
    subtitle: "トピックを閲覧してトレーニング資料にアクセス",
    searchPlaceholder: "トピックを検索...",
    allFiles: "すべての形式",
    loading: "トピックを読み込み中...",
    errorTitle: "トピックの読み込みに失敗しました",
    noTopics: "このカテゴリにはトピックがありません",
    noFiles: "まだファイルがアップロードされていません",
    files: "ファイル",
    preview: "プレビュー",
    download: "ダウンロード",
    unknownSize: "不明",
    page: "ページ",
    previous: "前へ",
    next: "次へ",
    showing: "全",
    results: "件",
    filters: "フィルター",
    sortBy: "並び替え",
  },
};

const FILE_TYPE_CONFIG: Record<
  TrainingFileType,
  { color: string; icon: string }
> = {
  link: {
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: "LINK",
  },
  pdf: { color: "bg-red-50 text-red-700 border-red-200", icon: "PDF" },
  video: {
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: "VID",
  },
  image: { color: "bg-green-50 text-green-700 border-green-200", icon: "IMG" },
  doc: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: "DOC" },
  excel: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "XLS",
  },
  ppt: { color: "bg-orange-50 text-orange-700 border-orange-200", icon: "PPT" },
  other: { color: "bg-gray-50 text-gray-700 border-gray-200", icon: "FILE" },
};

function formatFileSize(size: number | null, unknownText: string) {
  if (!size) return unknownText;
  const mb = size / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = size / 1024;
  return `${kb.toFixed(0)} KB`;
}

function FileTypeBadge({ type }: { type: TrainingFileType }) {
  const config = FILE_TYPE_CONFIG[type] || FILE_TYPE_CONFIG.other;
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${config.color}`}
    >
      {config.icon}
    </span>
  );
}

export default function TrainingTopicsClient({
  categoryId,
}: TrainingTopicsClientProps) {
  const { lang } = useLanguage();
  const t = lang === "ja" ? TEXT.ja : TEXT.en;
  const [showFilters, setShowFilters] = useState(false);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 500);
  const [sortBy, setSortBy] = useState<"sort_order" | "title" | "created_at">(
    "sort_order",
  );
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [fileType, setFileType] = useState<FileTypeFilter>("all");

  const categoryIdNumber = Number(categoryId);

  const { data, isLoading, isFetching, error } = useTrainingTopics({
    page,
    limit: 10,
    category_id: categoryIdNumber,
    search: debouncedSearch,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const topics = data?.data ?? [];
  const pagination = data?.pagination;
  const categoryName = topics.length > 0 ? topics[0].category_name : "";

  const filteredTopics = useMemo(() => {
    if (fileType === "all") return topics;
    return topics
      .map((topic) => {
        const files =
          topic.files?.filter((file) => file.file_type === fileType) ?? [];
        return { ...topic, files, files_count: files.length };
      })
      .filter((topic) => topic.files.length > 0);
  }, [topics, fileType]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFileTypeChange = (value: FileTypeFilter) => {
    setFileType(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    const [nextSortBy, nextSortOrder] = value.split("-") as [
      "sort_order" | "title" | "created_at",
      "ASC" | "DESC",
    ];
    setSortBy(nextSortBy);
    setSortOrder(nextSortOrder);
    setPage(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">{t.loading}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <FileText className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-red-800">{t.errorTitle}</h2>
          <p className="mt-2 text-sm text-red-600">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm ring-1 ring-red-200 hover:bg-red-50"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/staff-training"
          className="group inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t.back}
        </Link>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {categoryName || t.fallbackTitle}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{t.subtitle}</p>
          </div>
          {pagination && (
            <div className="rounded-lg bg-gray-50 px-3 py-1.5 text-sm text-gray-600">
              <span className="font-medium">{pagination.total}</span>{" "}
              {t.results}
            </div>
          )}
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              showFilters || fileType !== "all"
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-4 w-4" />
            {t.filters}
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4 sm:flex-row">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                {t.sortBy}
              </label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="sort_order-ASC">Sort order (ascending)</option>
                <option value="sort_order-DESC">Sort order (descending)</option>
                <option value="title-ASC">Title (A-Z)</option>
                <option value="title-DESC">Title (Z-A)</option>
                <option value="created_at-DESC">Newest first</option>
                <option value="created_at-ASC">Oldest first</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                File type
              </label>
              <select
                value={fileType}
                onChange={(e) =>
                  handleFileTypeChange(e.target.value as FileTypeFilter)
                }
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">{t.allFiles}</option>
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="doc">Document</option>
                <option value="excel">Excel</option>
                <option value="ppt">PowerPoint</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Loading indicator for refetch */}
      {isFetching && !isLoading && (
        <div className="mb-4 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm text-blue-700">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Updating...
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredTopics.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white px-6 py-16">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <Search className="h-7 w-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">{t.noTopics}</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        /* Topics List */
        <div className="space-y-4">
          {filteredTopics.map((topic: TrainingTopic) => (
            <div
              key={topic.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Topic Header */}
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {topic.title}
                    </h2>
                    {topic.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                        {topic.description}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 rounded-lg bg-white px-3 py-1.5 text-center shadow-sm ring-1 ring-gray-200">
                    <div className="text-lg font-bold text-gray-900">
                      {topic.files_count ?? topic.files?.length ?? 0}
                    </div>
                    <div className="text-xs text-gray-500">{t.files}</div>
                  </div>
                </div>
              </div>

              {/* Files List */}
              <div className="px-6 py-4">
                {topic.files && topic.files.length > 0 ? (
                  <div className="space-y-3">
                    {topic.files.map((file: TrainingFile) => (
                      <div
                        key={file.id}
                        className="group flex items-center justify-between gap-4 rounded-lg p-3 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                            <FileText className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {file.file_title}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <FileTypeBadge type={file.file_type} />
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {formatFileSize(file.file_size, t.unknownSize)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-shrink-0 items-center gap-2">
                          {file.view_url && (
                            <a
                              href={file.view_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="hidden sm:inline">
                                {t.preview}
                              </span>
                            </a>
                          )}
                          {file.download_url && (
                            <a
                              href={file.download_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100 hover:shadow"
                            >
                              <Download className="h-4 w-4" />
                              <span className="hidden sm:inline">
                                {t.download}
                              </span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-lg bg-gray-50 px-4 py-8">
                    <div className="text-center">
                      <FileIcon className="mx-auto h-8 w-8 text-gray-300" />
                      <p className="mt-2 text-sm text-gray-500">{t.noFiles}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="mt-8 flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
          <button
            type="button"
            disabled={!pagination.has_prev_page}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
            {t.previous}
          </button>

          <div className="flex items-center gap-1">
            {Array.from(
              { length: pagination.total_pages },
              (_, i) => i + 1,
            ).map((pageNum) => {
              const isActive = pageNum === pagination.page;
              const isNearCurrent =
                Math.abs(pageNum - pagination.page) <= 1 ||
                pageNum === 1 ||
                pageNum === pagination.total_pages;

              if (!isNearCurrent) {
                if (pageNum === 2 || pageNum === pagination.total_pages - 1) {
                  return (
                    <span key={pageNum} className="px-1 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!pagination.has_next_page}
            onClick={() => setPage((prev) => prev + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            {t.next}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
