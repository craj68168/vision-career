"use client";

import {
  Eye,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  UserRound,
} from "lucide-react";

import { usePlacementRequests } from "./hook";

import PlacementRequestModal from "./PlacementRequestModal";

import PlacementRequestDetailsModal from "./PlacementRequestDetailsModal";

import EditPlacementRequestModal from "./EditPlacementRequestModal";

import DeletePlacementRequestModal from "./DeletePlacementRequestModal";

import SubmitPlacementRequestModal from "./SubmitPlacementRequestModal";

import PlacementCandidatesModal from "./PlacementCandidatesModal";

import type { PlacementRequestStatus } from "./types";

type Props = {
  lang: string;

  refreshVersion: number;

  onDataChanged: () => void | Promise<void>;
};

const canEdit = (status: PlacementRequestStatus) =>
  ["draft", "rejected"].includes(status);

const canDelete = (status: PlacementRequestStatus) =>
  ["draft", "rejected"].includes(status);

const canSubmit = (status: PlacementRequestStatus) =>
  ["draft", "rejected"].includes(status);

export default function PlacementRequests({
  lang,
  refreshVersion,
  onDataChanged,
}: Props) {
  const {
    loading,

    refreshing,

    search,

    setSearch,

    filteredPlacementRequests,

    placementCandidateCounts,

    placementRequestOpen,

    openPlacementRequest,

    closePlacementRequest,

    handlePlacementCreated,

    viewPlacementRequest,

    openPlacementRequestView,

    closePlacementRequestView,

    editPlacementRequest,

    openPlacementRequestEdit,

    closePlacementRequestEdit,

    handlePlacementRequestUpdate,

    deletePlacementRequestTarget,

    openPlacementRequestDelete,

    closePlacementRequestDelete,

    handlePlacementRequestDelete,

    submitPlacementRequestTarget,

    openPlacementRequestSubmit,

    closePlacementRequestSubmit,

    handlePlacementRequestSubmit,

    placementActionLoading,

    candidateRequest,

    candidateRequestCandidates,

    openPlacementCandidates,

    closePlacementCandidates,

    candidateActionId,

    handlePlacementCandidateStatus,

    refresh,
  } = usePlacementRequests({
    lang,

    refreshVersion,

    onDataChanged,
  });

  return (
    <>
      <section className="mt-8">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                lang === "ja"
                  ? "採用依頼を検索..."
                  : "Search placement requests..."
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
              onClick={openPlacementRequest}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />

              {lang === "ja" ? "新しい採用依頼" : "New Placement Request"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-500">
            {lang === "ja"
              ? "採用依頼を読み込み中..."
              : "Loading placement requests..."}
          </div>
        ) : filteredPlacementRequests.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h3 className="text-xl font-semibold text-slate-900">
              {lang === "ja"
                ? "採用依頼はまだありません"
                : "No placement requests"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {lang === "ja"
                ? "候補者の紹介を希望する場合は採用依頼を作成してください。"
                : "Create a placement request when you want Admin to source candidates for your company."}
            </p>
          </div>
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
                    <Info
                      label={lang === "ja" ? "雇用形態" : "Employment"}
                      value={request.employment_type}
                    />

                    <Info
                      label={lang === "ja" ? "募集人数" : "Positions"}
                      value={String(request.number_of_positions)}
                    />

                    <Info
                      label={lang === "ja" ? "日本語レベル" : "Japanese"}
                      value={request.japanese_level_required}
                    />

                    <Info
                      label={lang === "ja" ? "ビザ" : "Visa"}
                      value={request.visa_type_required}
                    />

                    <Info
                      label={lang === "ja" ? "紹介候補者" : "Candidates"}
                      value={String(candidateCount)}
                    />
                  </div>

                  {request.status === "rejected" &&
                    request.rejection_reason && (
                      <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-red-700">
                          {lang === "ja" ? "却下理由" : "Rejection Reason"}
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

                    {canEdit(request.status) && (
                      <button
                        type="button"
                        onClick={() => openPlacementRequestEdit(request)}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
                      >
                        <Pencil className="h-4 w-4" />

                        {lang === "ja" ? "編集" : "Edit"}
                      </button>
                    )}

                    {canDelete(request.status) && (
                      <button
                        type="button"
                        onClick={() => openPlacementRequestDelete(request)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />

                        {lang === "ja" ? "削除" : "Delete"}
                      </button>
                    )}

                    {canSubmit(request.status) && (
                      <button
                        type="button"
                        onClick={() => openPlacementRequestSubmit(request)}
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
// HELPERS
// ======================================================

function Info({
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

function StatusBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();

  let classes = "bg-slate-100 text-slate-700";

  if (normalized === "approved") {
    classes = "bg-emerald-50 text-emerald-700";
  }

  if (normalized === "pending_review" || normalized === "draft") {
    classes = "bg-amber-50 text-amber-700";
  }

  if (normalized === "rejected") {
    classes = "bg-red-50 text-red-700";
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${classes}`}
    >
      {value.replaceAll("_", " ").toLowerCase()}
    </span>
  );
}
