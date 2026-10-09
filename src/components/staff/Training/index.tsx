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
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const fieldClass =
  "h-11 w-full rounded-xl bg-white px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 outline-none transition-shadow placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500";

const pagerButton =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-40";

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
        className="flex min-h-[60vh] items-center justify-center"
      >
        <RefreshCw
          className="h-8 w-8 animate-spin text-indigo-600"
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
      <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 py-4 sm:space-y-6 sm:p-5 lg:px-8 lg:py-6">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
              {t.title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>
          </div>

          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refresh()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />

            {t.refresh}
          </button>
        </div>

        {/* SEARCH */}

        <div className="rounded-2xl bg-white p-3 ring-1 ring-inset ring-slate-200 sm:p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.search}
              aria-label={t.search}
              className={`${fieldClass} pl-10`}
            />
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div
            role="alert"
            className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-inset ring-rose-200"
          >
            <p className="font-semibold">{t.loadError}</p>

            <p className="mt-1">{t.errorHelp}</p>
          </div>
        )}

        {/* ================================================= */}
        {/* CATEGORIES */}
        {/* ================================================= */}

        <div className="space-y-3">
          {categories.length === 0 ? (
            <div className="rounded-2xl bg-white px-4 py-14 text-center ring-1 ring-inset ring-slate-200">
              <span
                aria-hidden="true"
                className="mx-auto grid h-10 w-10 place-items-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100"
              >
                <GraduationCap className="h-5 w-5" />
              </span>

              <p className="mt-3 text-sm font-semibold text-slate-800">
                {t.noCategories}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {t.noCategoriesHelp}
              </p>
            </div>
          ) : (
            categories.map((category) => {
              const expanded = expandedCategories.has(category.categoryId);

              const topics = topicsData[category.categoryId] ?? [];

              const loading = loadingTopics.has(category.categoryId);

              return (
                <article
                  key={category.categoryId}
                  className="overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-slate-200"
                >
                  {/* CATEGORY */}

                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => void toggleCategory(category.categoryId)}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-slate-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 sm:p-5"
                  >
                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                      <span
                        aria-hidden="true"
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100"
                      >
                        <FolderOpen className="h-5 w-5" />
                      </span>

                      <div className="min-w-0">
                        <h2 className="break-words font-semibold text-slate-950">
                          {category.name}
                        </h2>

                        {category.description && (
                          <p className="mt-1 break-words text-sm leading-6 text-slate-500">
                            {category.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-100">
                            <BookOpen className="h-3.5 w-3.5" />

                            {category.topicsCount} {t.topics}
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
                            <FileText className="h-3.5 w-3.5" />

                            {category.filesCount} {t.files}
                          </span>
                        </div>
                      </div>
                    </div>

                    {expanded ? (
                      <ChevronUp
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 text-slate-400"
                      />
                    ) : (
                      <ChevronDown
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 text-slate-400"
                      />
                    )}
                  </button>

                  {/* TOPICS */}

                  {expanded && (
                    <div className="bg-slate-50/60 p-3 shadow-[inset_0_1px_0_0_#e2e8f0] sm:p-4">
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
                          className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-inset ring-rose-200"
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
                              className="flex flex-col justify-between gap-4 rounded-xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:flex-row sm:items-center"
                            >
                              <div className="flex min-w-0 items-start gap-3">
                                <span
                                  aria-hidden="true"
                                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100"
                                >
                                  <FileText className="h-4 w-4" />
                                </span>

                                <div className="min-w-0">
                                  <p className="break-words font-semibold text-slate-950">
                                    {topic.title}
                                  </p>

                                  {topic.description && (
                                    <p className="mt-1 break-words text-sm leading-6 text-slate-500">
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
                                className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
                </article>
              );
            })
          )}
        </div>

        {/* ================================================= */}
        {/* PAGINATION */}
        {/* ================================================= */}

        {pagination && (
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-3 ring-1 ring-inset ring-slate-200 sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <p className="text-sm tabular-nums text-slate-500">
              {paginationText()}
            </p>

            <div className="flex items-center gap-2">
              <select
                value={limit}
                aria-label={t.pageSize}
                onChange={(event) => setLimit(Number(event.target.value))}
                className="h-10 rounded-lg bg-white px-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 outline-none transition-shadow focus:ring-2 focus:ring-indigo-500"
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
                className={pagerButton}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="inline-flex h-10 items-center rounded-lg bg-slate-100 px-3 text-sm font-semibold tabular-nums text-slate-800">
                {pagination.page}/{Math.max(pagination.totalPages, 1)}
              </span>

              <button
                type="button"
                aria-label={t.next}
                title={t.next}
                disabled={!pagination.hasNextPage}
                onClick={() => setPage(page + 1)}
                className={pagerButton}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* TOPIC DETAILS */}

      <TopicDetailsModal
        topic={selectedTopic}
        onClose={closeTopic}
        onOpenFile={(file) => void openFile(file)}
      />
    </>
  );
}