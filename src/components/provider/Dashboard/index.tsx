"use client";

import Link from "next/link";

import {
  Briefcase,
  Building2,
  ClipboardList,
  Eye,
  FileText,
  Inbox,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";

import { useProviderDashboard } from "./hook";

import PostVacancyModal from "./PostVacancyModal";
import PlacementRequestModal from "./PlacementRequestModal";
import VacancyDetailsModal from "./VacancyDetailsModal";
import DeleteVacancyModal from "./DeleteVacancyModal";
import PlacementRequestDetailsModal from "./PlacementRequestDetailsModal";
import EditPlacementRequestModal from "./EditPlacementRequestModal";
import DeletePlacementRequestModal from "./DeletePlacementRequestModal";
import SubmitPlacementRequestModal from "./SubmitPlacementRequestModal";
import PlacementCandidatesModal from "./PlacementCandidatesModal";

import type { PlacementRequestStatus, Vacancy } from "./types";

// ======================================================
// VACANCY ACTION RULES
// ======================================================

const canEditVacancy = (status: Vacancy["status"]) =>
  ["draft", "pending_review", "approved", "rejected", "published"].includes(
    status,
  );

const canDeleteVacancy = (status: Vacancy["status"]) =>
  ["draft", "pending_review", "approved", "rejected"].includes(status);

const canCloseVacancy = (status: Vacancy["status"]) => status === "published";

// ======================================================
// PLACEMENT REQUEST ACTION RULES
// ======================================================

const canEditPlacementRequest = (status: PlacementRequestStatus) =>
  ["draft", "rejected"].includes(status);

const canDeletePlacementRequest = (status: PlacementRequestStatus) =>
  ["draft", "rejected"].includes(status);

const canSubmitPlacementRequest = (status: PlacementRequestStatus) =>
  ["draft", "rejected"].includes(status);

// ======================================================
// COMPONENT
// ======================================================

export default function ProviderDashboard() {
  const {
    lang,

    loading,
    refreshing,
    error,

    activeTab,
    setActiveTab,

    search,
    setSearch,

    filteredVacancies,
    filteredApplications,
    filteredPlacementRequests,

    totalVacancies,
    publishedCount,
    pendingVacancyCount,
    totalApplications,
    totalPlacementRequests,

    // CREATE VACANCY

    postVacancyOpen,
    openPostVacancy,
    closePostVacancy,
    handleVacancyCreated,

    // PLACEMENT REQUEST CREATE

    placementRequestOpen,
    openPlacementRequest,
    closePlacementRequest,
    handlePlacementCreated,

    // VIEW PLACEMENT REQUEST

    viewPlacementRequest,
    openPlacementRequestView,
    closePlacementRequestView,

    // EDIT PLACEMENT REQUEST

    editPlacementRequest,
    openPlacementRequestEdit,
    closePlacementRequestEdit,
    handlePlacementRequestUpdate,

    // DELETE PLACEMENT REQUEST

    deletePlacementRequestTarget,
    openPlacementRequestDelete,
    closePlacementRequestDelete,
    handlePlacementRequestDelete,

    // SUBMIT PLACEMENT REQUEST

    submitPlacementRequestTarget,
    openPlacementRequestSubmit,
    closePlacementRequestSubmit,
    handlePlacementRequestSubmit,

    placementActionLoading,

    // PLACEMENT CANDIDATES

    placementCandidateCounts,

    candidateRequest,
    candidateRequestCandidates,

    openPlacementCandidates,
    closePlacementCandidates,

    candidateActionId,

    handlePlacementCandidateStatus,

    // VIEW VACANCY

    viewVacancy,
    openVacancyView,
    closeVacancyView,

    // EDIT VACANCY

    editVacancy,
    openVacancyEdit,
    closeVacancyEdit,
    handleVacancyUpdated,

    // DELETE VACANCY

    deleteVacancyTarget,
    openVacancyDelete,
    closeVacancyDelete,
    handleVacancyDeleted,

    // CLOSE VACANCY

    handleCloseVacancy,

    // REFRESH

    handleRefresh,
  } = useProviderDashboard();

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-slate-400" />

          <p className="mt-4 text-sm text-slate-600">
            {lang === "ja"
              ? "ダッシュボードを読み込み中..."
              : "Loading provider dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  {lang === "ja" ? "企業ダッシュボード" : "Provider Dashboard"}
                </h1>

                <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
                  {lang === "ja"
                    ? "会社情報、求人、応募状況、採用依頼を管理します。"
                    : "Manage your company profile, vacancies, applications, and placement requests."}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
                <Link
                  href={
                    lang === "ja"
                      ? "/provider-dashboard/profile"
                      : "/en/provider-dashboard/profile"
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Building2 className="h-4 w-4" />

                  {lang === "ja" ? "会社プロフィール" : "Company Profile"}
                </Link>

                <button
                  type="button"
                  disabled={refreshing}
                  onClick={() => void handleRefresh()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />

                  {refreshing
                    ? lang === "ja"
                      ? "更新中..."
                      : "Refreshing..."
                    : lang === "ja"
                      ? "更新"
                      : "Refresh"}
                </button>

                <button
                  type="button"
                  onClick={openPostVacancy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4" />

                  {lang === "ja" ? "求人を掲載" : "Post Vacancy"}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ================================================= */}
        {/* MAIN */}
        {/* ================================================= */}

        <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ================================================= */}
          {/* STATS */}
          {/* ================================================= */}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
              label={lang === "ja" ? "求人総数" : "Total Vacancies"}
              value={totalVacancies}
              icon={<Briefcase className="h-5 w-5" />}
            />

            <StatCard
              label={lang === "ja" ? "公開中" : "Published"}
              value={publishedCount}
              icon={<FileText className="h-5 w-5" />}
            />

            <StatCard
              label={lang === "ja" ? "審査中" : "Pending Review"}
              value={pendingVacancyCount}
              icon={<Inbox className="h-5 w-5" />}
            />

            <StatCard
              label={lang === "ja" ? "応募者" : "Applications"}
              value={totalApplications}
              icon={<Users className="h-5 w-5" />}
            />

            <StatCard
              label={lang === "ja" ? "採用依頼" : "Placement Requests"}
              value={totalPlacementRequests}
              icon={<ClipboardList className="h-5 w-5" />}
            />
          </section>

          {/* ================================================= */}
          {/* TABS */}
          {/* ================================================= */}

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-1 rounded-2xl bg-slate-100 p-1">
                <TabButton
                  active={activeTab === "vacancies"}
                  onClick={() => setActiveTab("vacancies")}
                  label={
                    lang === "ja"
                      ? `求人 (${totalVacancies})`
                      : `Vacancies (${totalVacancies})`
                  }
                />

                <TabButton
                  active={activeTab === "applications"}
                  onClick={() => setActiveTab("applications")}
                  label={
                    lang === "ja"
                      ? `応募者 (${totalApplications})`
                      : `Applications (${totalApplications})`
                  }
                />

                <TabButton
                  active={activeTab === "placement-requests"}
                  onClick={() => setActiveTab("placement-requests")}
                  label={
                    lang === "ja"
                      ? `採用依頼 (${totalPlacementRequests})`
                      : `Placement Requests (${totalPlacementRequests})`
                  }
                />
              </div>

              <div className="relative w-full lg:max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={
                    activeTab === "vacancies"
                      ? lang === "ja"
                        ? "求人を検索..."
                        : "Search vacancies..."
                      : activeTab === "applications"
                        ? lang === "ja"
                          ? "応募者を検索..."
                          : "Search applications..."
                        : lang === "ja"
                          ? "採用依頼を検索..."
                          : "Search placement requests..."
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </div>
            </div>
          </section>

          {/* ================================================= */}
          {/* VACANCIES */}
          {/* ================================================= */}

          {activeTab === "vacancies" && (
            <section className="mt-8">
              {filteredVacancies.length === 0 ? (
                <EmptyState
                  title={
                    lang === "ja" ? "求人はまだありません" : "No vacancies yet"
                  }
                  description={
                    lang === "ja"
                      ? "最初の求人を登録してください。"
                      : "Post your first vacancy to start recruiting."
                  }
                  action={
                    <button
                      type="button"
                      onClick={openPostVacancy}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
                    >
                      <Plus className="h-4 w-4" />

                      {lang === "ja" ? "求人を掲載" : "Post Vacancy"}
                    </button>
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

                      {(vacancy.salaryMin !== null ||
                        vacancy.salaryMax !== null) && (
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

                      {vacancy.status === "rejected" &&
                        vacancy.rejectionReason && (
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
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                        >
                          <Eye className="h-4 w-4" />

                          {lang === "ja" ? "詳細" : "View"}
                        </button>

                        {canEditVacancy(vacancy.status) && (
                          <button
                            type="button"
                            onClick={() => openVacancyEdit(vacancy)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
                          >
                            <Pencil className="h-4 w-4" />

                            {lang === "ja" ? "編集" : "Edit"}
                          </button>
                        )}

                        {canDeleteVacancy(vacancy.status) && (
                          <button
                            type="button"
                            onClick={() => openVacancyDelete(vacancy)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
                          >
                            <Trash2 className="h-4 w-4" />

                            {lang === "ja" ? "削除" : "Delete"}
                          </button>
                        )}

                        {canCloseVacancy(vacancy.status) && (
                          <button
                            type="button"
                            onClick={() => void handleCloseVacancy(vacancy)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white"
                          >
                            <XCircle className="h-4 w-4" />

                            {lang === "ja" ? "求人終了" : "Close"}
                          </button>
                        )}
                      </div>

                      {vacancy.status === "published" && (
                        <p className="mt-3 text-xs leading-5 text-slate-500">
                          {lang === "ja"
                            ? "公開中の求人を編集すると再審査となり、一時的に非公開になります。"
                            : "Editing a published vacancy will send it back for review and temporarily remove it from the public job list."}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ================================================= */}
          {/* APPLICATIONS */}
          {/* ================================================= */}

          {activeTab === "applications" && (
            <section className="mt-8">
              {filteredApplications.length === 0 ? (
                <EmptyState
                  title={
                    lang === "ja"
                      ? "応募はまだありません"
                      : "No applications yet"
                  }
                  description={
                    lang === "ja"
                      ? "管理者が応募を承認するとここに表示されます。"
                      : "Applications approved by Admin will appear here."
                  }
                />
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <article
                      key={application.application_id}
                      className="rounded-3xl border border-slate-200 bg-white p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-slate-400">
                            {application.application_id}
                          </p>

                          <h3 className="mt-1 text-lg font-semibold">
                            {application.vacancy?.title ||
                              application.vacancy_id}
                          </h3>
                        </div>

                        <StatusBadge value={application.status} />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ================================================= */}
          {/* PLACEMENT REQUESTS */}
          {/* ================================================= */}

          {activeTab === "placement-requests" && (
            <section className="mt-8">
              <div className="mb-5 flex justify-end">
                <button
                  type="button"
                  onClick={openPlacementRequest}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
                >
                  <Plus className="h-4 w-4" />

                  {lang === "ja" ? "新しい採用依頼" : "New Placement Request"}
                </button>
              </div>

              {filteredPlacementRequests.length === 0 ? (
                <EmptyState
                  title={
                    lang === "ja"
                      ? "採用依頼はまだありません"
                      : "No placement requests"
                  }
                  description={
                    lang === "ja"
                      ? "候補者の紹介を希望する場合は採用依頼を作成してください。"
                      : "Create a placement request when you want Admin to source candidates for your company."
                  }
                />
              ) : (
                <div className="space-y-4">
                  {filteredPlacementRequests.map((request) => {
                    const candidateCount =
                      placementCandidateCounts[request.recruitId] ?? 0;

                    return (
                      <article
                        key={request.recruitId}
                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-xs text-slate-400">
                              {request.recruitId}
                            </p>

                            <h3 className="mt-1 text-lg font-semibold text-slate-900">
                              {request.job_title}
                            </h3>

                            {request.work_location && (
                              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                <MapPin className="h-4 w-4" />

                                {request.work_location}
                              </div>
                            )}
                          </div>

                          <StatusBadge value={request.status} />
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                          <InfoField
                            label={lang === "ja" ? "雇用形態" : "Employment"}
                            value={request.employment_type}
                          />

                          <InfoField
                            label={lang === "ja" ? "募集人数" : "Positions"}
                            value={String(request.number_of_positions)}
                          />

                          <InfoField
                            label={lang === "ja" ? "日本語レベル" : "Japanese"}
                            value={request.japanese_level_required}
                          />

                          <InfoField
                            label={lang === "ja" ? "ビザ" : "Visa"}
                            value={request.visa_type_required}
                          />

                          <InfoField
                            label={lang === "ja" ? "紹介候補者" : "Candidates"}
                            value={String(candidateCount)}
                          />
                        </div>

                        {request.status === "rejected" &&
                          request.rejection_reason && (
                            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
                              <p className="text-sm font-semibold text-red-700">
                                {lang === "ja"
                                  ? "却下理由"
                                  : "Rejection Reason"}
                              </p>

                              <p className="mt-1 text-sm text-red-700">
                                {request.rejection_reason}
                              </p>
                            </div>
                          )}

                        {request.status === "pending_review" && (
                          <div className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
                            {lang === "ja"
                              ? "管理者による審査を待っています。"
                              : "Waiting for Admin review."}
                          </div>
                        )}

                        {request.status === "approved" && (
                          <div className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                            {candidateCount > 0
                              ? lang === "ja"
                                ? `${candidateCount}名の候補者が紹介されています。`
                                : `${candidateCount} candidate(s) have been matched by Admin.`
                              : lang === "ja"
                                ? "採用依頼は承認済みです。管理者からの候補者紹介を待っています。"
                                : "Placement request approved. Waiting for Admin to match candidates."}
                          </div>
                        )}

                        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                          <button
                            type="button"
                            onClick={() => openPlacementRequestView(request)}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold"
                          >
                            <Eye className="h-4 w-4" />

                            {lang === "ja" ? "詳細" : "View"}
                          </button>

                          {request.status === "approved" && (
                            <button
                              type="button"
                              onClick={() => openPlacementCandidates(request)}
                              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
                            >
                              <UserRound className="h-4 w-4" />

                              {lang === "ja"
                                ? `候補者 (${candidateCount})`
                                : `Candidates (${candidateCount})`}
                            </button>
                          )}

                          {canEditPlacementRequest(request.status) && (
                            <button
                              type="button"
                              onClick={() => openPlacementRequestEdit(request)}
                              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
                            >
                              <Pencil className="h-4 w-4" />

                              {lang === "ja" ? "編集" : "Edit"}
                            </button>
                          )}

                          {canDeletePlacementRequest(request.status) && (
                            <button
                              type="button"
                              onClick={() =>
                                openPlacementRequestDelete(request)
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />

                              {lang === "ja" ? "削除" : "Delete"}
                            </button>
                          )}

                          {canSubmitPlacementRequest(request.status) && (
                            <button
                              type="button"
                              onClick={() =>
                                openPlacementRequestSubmit(request)
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
                            >
                              <Send className="h-4 w-4" />

                              {request.status === "rejected"
                                ? lang === "ja"
                                  ? "再申請"
                                  : "Resubmit"
                                : lang === "ja"
                                  ? "審査へ送信"
                                  : "Submit for Review"}
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {/* ================================================= */}
      {/* VACANCY MODALS */}
      {/* ================================================= */}

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

      {/* ================================================= */}
      {/* PLACEMENT REQUEST MODALS */}
      {/* ================================================= */}

      <PlacementRequestModal
        open={placementRequestOpen}
        onClose={closePlacementRequest}
        onSuccess={handlePlacementCreated}
        lang={lang}
      />

      <PlacementRequestDetailsModal
        open={Boolean(viewPlacementRequest)}
        request={viewPlacementRequest}
        onClose={closePlacementRequestView}
        lang={lang}
      />

      <EditPlacementRequestModal
        open={Boolean(editPlacementRequest)}
        request={editPlacementRequest}
        loading={placementActionLoading}
        onClose={closePlacementRequestEdit}
        onSubmit={handlePlacementRequestUpdate}
        lang={lang}
      />

      <DeletePlacementRequestModal
        open={Boolean(deletePlacementRequestTarget)}
        request={deletePlacementRequestTarget}
        loading={placementActionLoading}
        onClose={closePlacementRequestDelete}
        onDelete={() => void handlePlacementRequestDelete()}
      />

      <SubmitPlacementRequestModal
        open={Boolean(submitPlacementRequestTarget)}
        request={submitPlacementRequestTarget}
        loading={placementActionLoading}
        onClose={closePlacementRequestSubmit}
        onSubmit={() => void handlePlacementRequestSubmit()}
      />

      {/* ================================================= */}
      {/* PLACEMENT CANDIDATES */}
      {/* ================================================= */}

      <PlacementCandidatesModal
        key={candidateRequest?.recruitId ?? "no-candidate-request"}
        open={Boolean(candidateRequest)}
        request={candidateRequest}
        candidates={candidateRequestCandidates}
        actionCandidateId={candidateActionId}
        lang={lang}
        onClose={closePlacementCandidates}
        onStatusChange={handlePlacementCandidateStatus}
      />
    </>
  );
}

// ======================================================
// SALARY
// ======================================================

function formatSalary(value?: number | null) {
  if (value === null || value === undefined) {
    return "-";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;

  value: number;

  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>

        <div className="text-slate-400">{icon}</div>
      </div>

      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

// ======================================================
// TAB
// ======================================================

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;

  onClick: () => void;

  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm transition ${
        active
          ? "bg-white font-semibold text-slate-900 shadow-sm"
          : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {label}
    </button>
  );
}

// ======================================================
// EMPTY STATE
// ======================================================

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;

  description: string;

  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>

      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

// ======================================================
// INFO FIELD
// ======================================================

function InfoField({
  label,
  value,
}: {
  label: string;

  value?: string | null;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 text-sm font-medium text-slate-800">{value || "-"}</p>
    </div>
  );
}

// ======================================================
// STATUS BADGE
// ======================================================

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
      className={`h-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${classes}`}
    >
      {value.replaceAll("_", " ").toLowerCase()}
    </span>
  );
}
