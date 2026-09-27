"use client";

import {
  Briefcase,
  Eye,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";

import { useVacancies } from "./hook";

import PostVacancyModal from "./PostVacancyModal";

import VacancyDetailsModal from "./VacancyDetailsModal";

import DeleteVacancyModal from "./DeleteVacancyModal";

import type { Vacancy } from "./types";

type Props = {
  lang: string;

  refreshVersion: number;

  createSignal: number;

  onDataChanged: () => void | Promise<void>;
};

// ======================================================
// RULES
// ======================================================

const canEditVacancy = (status: Vacancy["status"]) =>
  ["draft", "pending_review", "approved", "rejected", "published"].includes(
    status,
  );

const canDeleteVacancy = (status: Vacancy["status"]) =>
  ["draft", "pending_review", "approved", "rejected"].includes(status);

const canCloseVacancy = (status: Vacancy["status"]) => status === "published";

// ======================================================
// COMPONENT
// ======================================================

export default function Vacancies({
  lang,
  refreshVersion,
  createSignal,
  onDataChanged,
}: Props) {
  const {
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
  } = useVacancies({
    lang,

    refreshVersion,

    createSignal,

    onDataChanged,
  });

  return (
    <>
      <section className="mt-8">
        {/* ============================================= */}
        {/* TOOLBAR */}
        {/* ============================================= */}

        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                lang === "ja" ? "求人を検索..." : "Search vacancies..."
              }
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={refreshing}
              onClick={() => void refresh()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />

              {lang === "ja" ? "更新" : "Refresh"}
            </button>

            <button
              type="button"
              onClick={openPostVacancy}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />

              {lang === "ja" ? "求人を掲載" : "Post Vacancy"}
            </button>
          </div>
        </div>

        {/* ============================================= */}
        {/* CONTENT */}
        {/* ============================================= */}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-500">
            {lang === "ja" ? "求人を読み込み中..." : "Loading vacancies..."}
          </div>
        ) : filteredVacancies.length === 0 ? (
          <EmptyState
            title={lang === "ja" ? "求人はまだありません" : "No vacancies yet"}
            description={
              lang === "ja"
                ? "最初の求人を登録してください。"
                : "Post your first vacancy to start recruiting."
            }
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredVacancies.map((vacancy) => (
              <article
                key={vacancy.vacancyId}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      {vacancy.vacancyId}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold text-slate-900">
                      {vacancy.title}
                    </h3>

                    {vacancy.titleKana && (
                      <p className="mt-1 text-xs text-slate-400">
                        {vacancy.titleKana}
                      </p>
                    )}
                  </div>

                  <StatusBadge value={vacancy.status} />
                </div>

                <p className="mt-4 text-sm font-medium text-slate-700">
                  {vacancy.companyName}
                </p>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-400" />

                    <span>{vacancy.employmentType}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />

                    <span>{vacancy.workLocation}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400" />

                    <span>
                      {vacancy.numberOfPeople}{" "}
                      {lang === "ja" ? "名" : "opening(s)"}
                    </span>
                  </div>
                </div>

                {(vacancy.salaryMin !== null || vacancy.salaryMax !== null) && (
                  <div className="mt-5 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      {lang === "ja" ? "給与" : "Annual Salary"}
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatSalary(vacancy.salaryMin)}
                      {" ~ "}
                      {formatSalary(vacancy.salaryMax)} 万円
                    </p>
                  </div>
                )}

                {vacancy.status === "rejected" && vacancy.rejectionReason && (
                  <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                    <p className="font-medium">
                      {lang === "ja" ? "却下理由" : "Rejection reason"}
                    </p>

                    <p className="mt-1">{vacancy.rejectionReason}</p>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={() => openVacancyView(vacancy)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold"
                  >
                    <Eye className="h-4 w-4" />

                    {lang === "ja" ? "詳細" : "View"}
                  </button>

                  {canEditVacancy(vacancy.status) && (
                    <button
                      type="button"
                      onClick={() => openVacancyEdit(vacancy)}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      <Pencil className="h-4 w-4" />

                      {lang === "ja" ? "編集" : "Edit"}
                    </button>
                  )}

                  {canDeleteVacancy(vacancy.status) && (
                    <button
                      type="button"
                      onClick={() => openVacancyDelete(vacancy)}
                      className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      <Trash2 className="h-4 w-4" />

                      {lang === "ja" ? "削除" : "Delete"}
                    </button>
                  )}

                  {canCloseVacancy(vacancy.status) && (
                    <button
                      type="button"
                      onClick={() => void handleCloseVacancy(vacancy)}
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      <XCircle className="h-4 w-4" />

                      {lang === "ja" ? "求人終了" : "Close"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <PostVacancyModal
        key="create-vacancy"
        open={postVacancyOpen}
        mode="create"
        onClose={closePostVacancy}
        onSuccess={handleVacancyCreated}
        lang={lang}
      />

      <VacancyDetailsModal
        open={Boolean(viewVacancy)}
        vacancy={viewVacancy}
        onClose={closeVacancyView}
        onEdit={openVacancyEdit}
        lang={lang}
      />

      <PostVacancyModal
        key={editVacancy ? `edit-${editVacancy.vacancyId}` : "edit-none"}
        open={Boolean(editVacancy)}
        mode="edit"
        vacancy={editVacancy}
        onClose={closeVacancyEdit}
        onSuccess={handleVacancyUpdated}
        lang={lang}
      />

      <DeleteVacancyModal
        open={Boolean(deleteVacancyTarget)}
        vacancy={deleteVacancyTarget}
        onClose={closeVacancyDelete}
        onSuccess={handleVacancyDeleted}
        lang={lang}
      />
    </>
  );
}

// ======================================================
// HELPERS
// ======================================================

function formatSalary(value?: number | null) {
  if (value === null || value === undefined) {
    return "-";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

function EmptyState({
  title,
  description,
}: {
  title: string;

  description: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();

  let classes = "bg-slate-100 text-slate-700";

  if (normalized === "published" || normalized === "approved") {
    classes = "bg-emerald-50 text-emerald-700";
  }

  if (normalized === "pending_review" || normalized === "draft") {
    classes = "bg-amber-50 text-amber-700";
  }

  if (normalized === "rejected") {
    classes = "bg-red-50 text-red-700";
  }

  if (normalized === "closed") {
    classes = "bg-slate-200 text-slate-600";
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${classes}`}
    >
      {value.replaceAll("_", " ").toLowerCase()}
    </span>
  );
}
