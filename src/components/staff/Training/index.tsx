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

import { useStaffTraining } from "./hook";

import TopicDetailsModal from "./TopicDetailsModal";

// ======================================================
// COMPONENT
// ======================================================

export default function StaffTraining() {
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

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
                <GraduationCap className="h-6 w-6 text-indigo-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-950">
                  Staff Training
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Browse training categories, topics and learning materials.
                </p>
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
              Refresh
            </button>
          </div>

          {/* SEARCH */}

          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search training categories..."
              className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to load Staff Training. Make sure this Staff account has the{" "}
            <strong>training:view</strong> permission.
          </div>
        )}

        {/* CATEGORIES */}

        <div className="space-y-4">
          {categories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-slate-300" />

              <p className="mt-3 font-semibold text-slate-700">
                No training categories available.
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Active training created by Admin will appear here.
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
                  {/* CATEGORY */}

                  <button
                    type="button"
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
                            {category.topicsCount} Topics
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            <FileText className="h-3.5 w-3.5" />
                            {category.filesCount} Files
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

                  {/* TOPICS */}

                  {expanded && (
                    <div className="border-t border-slate-200 bg-slate-50/60 p-4">
                      {loading ? (
                        <div className="py-10 text-center">
                          <RefreshCw className="mx-auto h-6 w-6 animate-spin text-indigo-600" />
                        </div>
                      ) : topicErrors[category.categoryId] ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                          {topicErrors[category.categoryId]}
                        </div>
                      ) : topics.length === 0 ? (
                        <div className="py-10 text-center text-sm text-slate-500">
                          No active topics are available in this category.
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
                                    {topic.filesCount} training material
                                    {topic.filesCount === 1 ? "" : "s"}
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
                                View Training
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

        {/* PAGINATION */}

        {pagination && (
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
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
                onChange={(event) => setLimit(Number(event.target.value))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                <option value={10}>10 / page</option>

                <option value={20}>20 / page</option>

                <option value={50}>50 / page</option>
              </select>

              <button
                type="button"
                disabled={!pagination.hasPrevPage}
                onClick={() =>
                  setPage(
                    Math.max(
                      page - 1,

                      1,
                    ),
                  )
                }
                className="rounded-xl border border-slate-200 p-2 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold">
                {pagination.page}/
                {Math.max(
                  pagination.totalPages,

                  1,
                )}
              </span>

              <button
                type="button"
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

      {/* TOPIC DETAILS */}

      <TopicDetailsModal
        topic={selectedTopic}
        onClose={closeTopic}
        onOpenFile={(file) => void openFile(file)}
      />
    </>
  );
}
