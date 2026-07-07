"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  FileText,
  Loader2,
  Search,
  FolderTree,
  Grid3x3,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import {
  TrainingCategory,
  useTrainingCategories,
} from "@/hooks/useStaffTraining";
import { useLanguage } from "@/context/LanguageContext";

export default function StaffTrainingCategories() {
  const router = useRouter();
  const { lang } = useLanguage();

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, isLoading, isError, error, isFetching } = useTrainingCategories(
    {
      page: 1,
      limit: 100,
      search,
      status: "active",
      sort_by: "sort_order",
      sort_order: "ASC",
    },
  );

  const categories: TrainingCategory[] = data?.data ?? [];

  // Translations
  const translations = {
    title: {
      ja: "トレーニングライブラリ",
      en: "Training Library",
    },
    subtitle: {
      ja: "トレーニングカテゴリーを選択して、トピックと教材を表示します。",
      en: "Select a training category to view its topics and training materials.",
    },
    searchPlaceholder: {
      ja: "トレーニングカテゴリーを検索...",
      en: "Search training categories...",
    },
    loading: {
      ja: "トレーニングカテゴリーを読み込み中...",
      en: "Loading training categories...",
    },
    errorTitle: {
      ja: "カテゴリーの読み込みに失敗しました",
      en: "Failed to load categories",
    },
    errorMessage: {
      ja: "エラーが発生しました。",
      en: "Something went wrong.",
    },
    noCategoriesTitle: {
      ja: "トレーニングカテゴリーが見つかりません",
      en: "No training categories found",
    },
    noCategoriesMessage: {
      ja: "トレーニングカテゴリーが利用可能になるとここに表示されます。",
      en: "Training categories will appear here once they are available.",
    },
    topics: {
      ja: "トピック",
      en: "topics",
    },
    files: {
      ja: "ファイル",
      en: "files",
    },
    view: {
      ja: "表示",
      en: "View",
    },
    noDescription: {
      ja: "説明はありません。",
      en: "No description available.",
    },
    updating: {
      ja: "更新中...",
      en: "Updating...",
    },
    gridView: {
      ja: "グリッド表示",
      en: "Grid View",
    },
    listView: {
      ja: "リスト表示",
      en: "List View",
    },
  };

  // Helper function to get translation
  const t = (key: keyof typeof translations): string => {
    const value = translations[key];
    if (typeof value === "object" && value !== null) {
      return value[lang] || value.en;
    }
    return String(value);
  };

  // Helper function for translations that need count
  const categoryCount = (count: number) => {
    return lang === "ja" ? `${count}件のカテゴリー` : `${count} categories`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white/80 p-8 backdrop-blur-sm transition-all">
          {/* Decorative elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-50/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-50/20 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 text-white shadow-lg shadow-blue-500/25">
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                      {t("title")}
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                      {t("subtitle")}
                    </p>
                  </div>
                </div>
              </div>

              {/* View toggle and category count */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50/50 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`rounded-lg p-2 transition-all ${
                      viewMode === "grid"
                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                    }`}
                    aria-label={t("gridView")}
                    title={t("gridView")}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`rounded-lg p-2 transition-all ${
                      viewMode === "list"
                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                    }`}
                    aria-label={t("listView")}
                    title={t("listView")}
                  >
                    <FolderTree className="h-4 w-4" />
                  </button>
                </div>

                {categories.length > 0 && (
                  <span className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-600 sm:flex">
                    <Sparkles className="h-3.5 w-3.5 text-slate-400" />
                    {categoryCount(categories.length)}
                  </span>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="mt-6">
              <div className="relative max-w-lg">
                <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/50"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results section */}
        <div className="mt-6">
          {isLoading ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white/80 p-12 shadow-sm backdrop-blur-sm">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-100/50 blur-xl" />
                <Loader2 className="relative h-12 w-12 animate-spin text-blue-600" />
              </div>
              <p className="mt-6 text-sm font-medium text-slate-600">
                {t("loading")}
              </p>
            </div>
          ) : isError ? (
            <div className="rounded-3xl border border-red-200/80 bg-red-50/80 p-8 shadow-sm backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-red-100 p-2.5 text-red-600">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">
                    {t("errorTitle")}
                  </h3>
                  <p className="mt-1 text-sm text-red-600">
                    {error?.message || t("errorMessage")}
                  </p>
                </div>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300/80 bg-white/80 p-16 text-center shadow-sm backdrop-blur-sm transition-all">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50">
                <BookOpen className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                {t("noCategoriesTitle")}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {t("noCategoriesMessage")}
              </p>
            </div>
          ) : (
            <>
              {/* Updating indicator */}
              {isFetching && (
                <div className="mb-4 flex items-center justify-end gap-2 rounded-xl bg-white/80 px-4 py-2 text-xs font-medium text-slate-500 shadow-sm backdrop-blur-sm">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {t("updating")}
                </div>
              )}

              {/* Categories Grid/List */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                    : "space-y-4"
                }
              >
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      router.push(
                        lang === "ja"
                          ? `/staff-training/${category.id}`
                          : `/en/staff-training/${category.id}`,
                      )
                    }
                    className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 text-left shadow-sm backdrop-blur-sm transition-all hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 ${
                      viewMode === "list" ? "flex items-center gap-6" : ""
                    }`}
                  >
                    {/* Decorative gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-50/0 transition-all duration-500 group-hover:from-blue-50/20 group-hover:via-blue-50/10 group-hover:to-blue-50/0" />

                    {viewMode === "grid" ? (
                      // Grid View
                      <>
                        <div className="relative flex items-start justify-between gap-4">
                          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-3 text-blue-600 shadow-sm transition-all group-hover:scale-105 group-hover:shadow-md">
                            <BookOpen className="h-6 w-6" />
                          </div>
                          <ChevronRight className="h-5 w-5 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-blue-600" />
                        </div>

                        <div className="relative mt-4">
                          <h2 className="line-clamp-2 text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {category.name}
                          </h2>
                          <p className="mt-2 line-clamp-2 min-h-[44px] text-sm leading-relaxed text-slate-500">
                            {category.description || t("noDescription")}
                          </p>
                        </div>

                        <div className="relative mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1">
                              <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                              {category.topics_count ?? 0}{" "}
                              <span className="sr-only">{t("topics")}</span>
                            </span>
                            <span className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1">
                              <FileText className="h-3.5 w-3.5 text-slate-400" />
                              {category.files_count ?? 0}{" "}
                              <span className="sr-only">{t("files")}</span>
                            </span>
                          </div>
                          <span className="flex gap-1 items-center text-sm font-medium text-blue-600 opacity-0 transition-all group-hover:opacity-100">
                            {t("view")} <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </>
                    ) : (
                      // List View
                      <>
                        <div className="flex flex-1 items-center gap-6">
                          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-3.5 text-blue-600 shadow-sm transition-all group-hover:scale-105 group-hover:shadow-md">
                            <BookOpen className="h-6 w-6" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                                  {category.name}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500 line-clamp-1">
                                  {category.description || t("noDescription")}
                                </p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-blue-600 flex-shrink-0" />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 flex-shrink-0">
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <BookOpen className="h-4 w-4 text-slate-400" />
                              {category.topics_count ?? 0}{" "}
                              <span className="hidden sm:inline">
                                {t("topics")}
                              </span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FileText className="h-4 w-4 text-slate-400" />
                              {category.files_count ?? 0}{" "}
                              <span className="hidden sm:inline">
                                {t("files")}
                              </span>
                            </span>
                          </div>
                          <span className="text-sm font-medium text-blue-600 opacity-0 transition-all group-hover:opacity-100">
                            {t("view")}
                          </span>
                        </div>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
