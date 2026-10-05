"use client";

import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  FileText,
  FolderOpen,
  GraduationCap,
  RefreshCw,
  Search,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import { useStaffTraining } from "./hook";

import TopicDetailsModal from "./TopicDetailsModal";

// ======================================================
// TRANSLATIONS
// ======================================================

const translations = {
  ja: {
    title: "スタッフ研修",

    subtitle: "研修カテゴリー、トピック、学習教材を閲覧できます。",

    refresh: "更新",

    search: "研修カテゴリーを検索...",

    loading: "研修データを読み込み中...",

    loadError: "スタッフ研修を読み込めませんでした。",

    errorHelp:
      "ページを更新しても問題が続く場合は、管理者にお問い合わせください。",

    noCategories: "利用可能な研修カテゴリーはありません。",

    noCategoriesHelp: "管理者が作成した有効な研修がここに表示されます。",

    topics: "トピック",

    files: "ファイル",

    topicsLoading: "トピックを読み込み中...",

    topicsError: "トピックを読み込めませんでした。再度お試しください。",

    noTopics: "このカテゴリーには有効なトピックがありません。",

    viewTraining: "研修を表示",

    perPage: "件 / ページ",

    previous: "前のページ",

    next: "次のページ",

    pageSize: "1ページの表示件数",
  },

  en: {
    title: "Staff Training",

    subtitle: "Browse training categories, topics and learning materials.",

    refresh: "Refresh",

    search: "Search training categories...",

    loading: "Loading training data...",

    loadError: "Unable to load Staff Training.",

    errorHelp:
      "If the problem continues after refreshing the page, contact an administrator.",

    noCategories: "No training categories available.",

    noCategoriesHelp: "Active training created by Admin will appear here.",

    topics: "Topics",

    files: "Files",

    topicsLoading: "Loading topics...",

    topicsError: "Unable to load topics. Please try again.",

    noTopics: "No active topics are available in this category.",

    viewTraining: "View Training",

    perPage: "/ page",

    previous: "Previous page",

    next: "Next page",

    pageSize: "Items per page",
  },
};

// ======================================================
// STAFF TRAINING
// ======================================================

export default function StaffTraining() {
  const { lang } = useLanguage();

  const isJapanese = lang === "ja";

  const t = translations[isJapanese ? "ja" : "en"];

  const {
    categories,

    pagination,

    search,

    setSearch,

    page,

    setPage,

    limit,

    setLimit,

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

    isLoading,

    isFetching,

    error,

    refresh,
  } = useStaffTraining();

  // ====================================================
  // MATERIAL COUNT
  // ====================================================

  const materialCount = (count: number) =>
    isJapanese
      ? `${count}件の研修教材`
      : `${count} training material${count === 1 ? "" : "s"}`;

  // ====================================================
  // PAGINATION TEXT
  // ====================================================

  const paginationText = () => {
    if (!pagination) {
      return "";
    }

    const start =
      pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;

    const end = Math.min(pagination.page * pagination.limit, pagination.total);

    return isJapanese
      ? `全${pagination.total}件中 ${start}〜${end}件を表示`
      : `${start} - ${end} of ${pagination.total}`;
  };

  // ====================================================
  // INITIAL LOADING
  // ====================================================

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-[500px] items-center justify-center"
      >
        <RefreshCw
          className="h-9 w-9 animate-spin text-indigo-600"
          aria-hidden="true"
        />

        <span className="sr-only">{t.loading}</span>
      </div>
    );
  }

  // ====================================================
  // PAGE
  // ====================================================

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8">
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
                <GraduationCap className="h-6 w-6 text-indigo-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-950">{t.title}</h1>

                <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              disabled={isFetching}
              onClick={() => void refresh()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />

              {t.refresh}
            </button>
          </div>

          {/* ==================================================
              SEARCH
          ================================================== */}

          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.search}
              aria-label={t.search}
              className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p className="font-semibold">{t.loadError}</p>

            <p className="mt-1">{t.errorHelp}</p>
          </div>
        )}

        {/* ==================================================
            CATEGORIES
        ================================================== */}

        <div className="space-y-4">
          {categories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-slate-300" />

              <p className="mt-3 font-semibold text-slate-700">
                {t.noCategories}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {t.noCategoriesHelp}
              </p>
            </div>
          ) : (
            categories.map((category) => {
              const expanded = expandedCategories.has(category.categoryId);

              const topics = topicsData[category.categoryId] ?? [];

              const loading = loadingTopics.has(category.categoryId);

              return (
                <div
                  key={category.categoryId}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* ==========================================
                      CATEGORY
                  ========================================== */}

                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => void toggleCategory(category.categoryId)}
                    className="flex w-full items-center justify-between gap-5 p-5 text-left transition hover:bg-slate-50"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                        <FolderOpen className="h-5 w-5 text-amber-600" />
                      </div>

                      <div className="min-w-0">
                        <h2 className="font-bold text-slate-950">
                          {category.name}
                        </h2>

                        {category.description && (
                          <p className="mt-1 text-sm text-slate-500">
                            {category.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                            <BookOpen className="h-3.5 w-3.5" />
                            {category.topicsCount} {t.topics}
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            <FileText className="h-3.5 w-3.5" />
                            {category.filesCount} {t.files}
                          </span>
                        </div>
                      </div>
                    </div>

                    {expanded ? (
                      <ChevronUp className="h-5 w-5 shrink-0 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />
                    )}
                  </button>

                  {/* ==========================================
                      TOPICS
                  ========================================== */}

                  {expanded && (
                    <div className="border-t border-slate-200 bg-slate-50/60 p-4">
                      {loading ? (
                        <div role="status" className="py-10 text-center">
                          <RefreshCw
                            className="mx-auto h-6 w-6 animate-spin text-indigo-600"
                            aria-hidden="true"
                          />

                          <span className="sr-only">{t.topicsLoading}</span>
                        </div>
                      ) : topicErrors[category.categoryId] ? (
                        <div
                          role="alert"
                          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        >
                          {t.topicsError}
                        </div>
                      ) : topics.length === 0 ? (
                        <div className="py-10 text-center text-sm text-slate-500">
                          {t.noTopics}
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {topics.map((topic) => (
                            <div
                              key={topic.topicId}
                              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
                            >
                              <div className="flex min-w-0 items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                                  <FileText className="h-5 w-5 text-indigo-600" />
                                </div>

                                <div className="min-w-0">
                                  <p className="font-semibold text-slate-900">
                                    {topic.title}
                                  </p>

                                  {topic.description && (
                                    <p className="mt-1 text-sm text-slate-500">
                                      {topic.description}
                                    </p>
                                  )}

                                  <p className="mt-2 text-xs font-medium text-slate-400">
                                    {materialCount(topic.filesCount)}
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                disabled={isTopicDetailsLoading}
                                onClick={() => void openTopic(topic.topicId)}
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                              >
                                <Eye className="h-4 w-4" />

                                {t.viewTraining}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ==================================================
            PAGINATION
        ================================================== */}

        {pagination && (
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">{paginationText()}</p>

            <div className="flex items-center gap-2">
              <select
                value={limit}
                aria-label={t.pageSize}
                onChange={(event) => setLimit(Number(event.target.value))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                {[10, 20, 50].map((value) => (
                  <option key={value} value={value}>
                    {value} {t.perPage}
                  </option>
                ))}
              </select>

              <button
                type="button"
                aria-label={t.previous}
                title={t.previous}
                disabled={!pagination.hasPrevPage}
                onClick={() => setPage(Math.max(page - 1, 1))}
                className="rounded-xl border border-slate-200 p-2 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold">
                {pagination.page}/{Math.max(pagination.totalPages, 1)}
              </span>

              <button
                type="button"
                aria-label={t.next}
                title={t.next}
                disabled={!pagination.hasNextPage}
                onClick={() => setPage(page + 1)}
                className="rounded-xl border border-slate-200 p-2 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================
          TOPIC DETAILS
      ================================================== */}

      <TopicDetailsModal
        topic={selectedTopic}
        onClose={closeTopic}
        onOpenFile={(file) => void openFile(file)}
      />
    </>
  );
}
