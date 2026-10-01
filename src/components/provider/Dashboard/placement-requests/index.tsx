"use client";

import type { ReactNode } from "react";
import {
  CircleAlert,
  CircleCheck,
  ClipboardList,
  Clock,
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
import { useTranslations } from "next-intl";

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

// Shared tokens: keep in sync with vacancies.tsx / provider-dashboard.tsx
const PANEL = "rounded-[14px] bg-white/70 ring-1 ring-black/5";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-800/50 focus-visible:ring-offset-1";

const BTN = `inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-[12px] px-3.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS}`;

const BTN_PRIMARY = `${BTN} bg-teal-800 text-white ring-1 ring-teal-800 hover:bg-teal-700`;

const BTN_SECONDARY = `${BTN} bg-white/80 text-slate-700 ring-1 ring-black/10 hover:bg-white hover:text-slate-900`;

const BTN_DANGER = `${BTN} bg-white/80 text-red-700 ring-1 ring-red-200 hover:bg-red-50`;

const CONTROL =
  "w-full rounded-[12px] bg-white px-3.5 py-2.5 text-sm ring-1 ring-black/10 placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-800/50 disabled:cursor-not-allowed disabled:bg-slate-900/[0.03] disabled:text-slate-500";

const railFor = (status: string) => {
  if (status === "approved") return "bg-emerald-600";
  if (status === "pending_review" || status === "draft") return "bg-amber-600";
  if (status === "rejected") return "bg-red-700";
  return "bg-slate-400";
};

const labelToneFor = (status: string) => {
  if (status === "approved") return "text-emerald-700";
  if (status === "pending_review" || status === "draft")
    return "text-amber-700";
  if (status === "rejected") return "text-red-700";
  return "text-slate-500";
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
  const t = useTranslations("provider.placementRequests.list");

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
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
              className={`${CONTROL} pl-10`}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={refreshing}
              onClick={() => void refresh()}
              className={BTN_SECONDARY}
            >
              <RefreshCw
                className={`h-4 w-4 shrink-0 text-slate-500 ${refreshing ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              {t("refresh")}
            </button>

            <button
              type="button"
              onClick={openPlacementRequest}
              className={BTN_PRIMARY}
            >
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              {t("newPlacementRequest")}
            </button>
          </div>
        </div>

        {loading ? (
          <div
            role="status"
            className={`flex flex-col items-center gap-3 py-16 ${PANEL}`}
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80 ring-1 ring-black/5">
              <RefreshCw
                className="h-5 w-5 animate-spin text-teal-800"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm text-slate-500">{t("loading")}</p>
          </div>
        ) : filteredPlacementRequests.length === 0 ? (
          <div
            className={`flex flex-col items-center px-6 py-14 text-center ${PANEL}`}
          >
            <div
              aria-hidden="true"
              className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 ring-1 ring-teal-200/70"
            >
              <ClipboardList className="h-5 w-5 text-teal-700" />
            </div>

            <h3 className="mt-4 text-base font-semibold">{t("emptyTitle")}</h3>

            <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">
              {t("emptyDescription")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPlacementRequests.map((request) => {
              const candidateCount =
                placementCandidateCounts[request.recruitId] ?? 0;
              const status = String(request.status ?? "").toLowerCase();

              return (
                <article
                  key={request.recruitId}
                  className={`relative overflow-hidden p-5 pl-6 transition-shadow hover:ring-black/10 sm:p-6 sm:pl-7 ${PANEL}`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-1.5 ${railFor(status)}`}
                  />

                  {/* Summary */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <StatusLabel value={status} />
                        <span className="font-mono text-xs tabular-nums text-slate-500">
                          {request.recruitId}
                        </span>
                      </div>

                      <h3 className="break-words text-lg font-semibold leading-tight md:text-xl">
                        {request.job_title}
                      </h3>

                      {request.work_location && (
                        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                          <MapPin
                            className="h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                          <span className="min-w-0 break-words">
                            {request.work_location}
                          </span>
                        </div>
                      )}
                    </div>

                    <dl className="grid shrink-0 grid-cols-2 gap-x-8 gap-y-3 md:text-right">
                      <div>
                        <dt className="text-xs text-slate-500">
                          {t("fields.positions")}
                        </dt>
                        <dd className="mt-0.5 font-mono text-base font-medium tabular-nums">
                          {request.number_of_positions ?? "-"}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs text-slate-500">
                          {t("fields.candidates")}
                        </dt>
                        <dd className="mt-0.5 font-mono text-base font-medium tabular-nums">
                          {candidateCount}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Details */}
                  <dl className="mt-5 grid gap-x-6 gap-y-3 rounded-[12px] bg-slate-900/[0.03] p-4 sm:grid-cols-3">
                    <Info
                      label={t("fields.employment")}
                      value={request.employment_type}
                    />
                    <Info
                      label={t("fields.japanese")}
                      value={request.japanese_level_required}
                    />
                    <Info
                      label={t("fields.visa")}
                      value={request.visa_type_required}
                    />
                  </dl>

                  {/* Notices */}
                  {status === "rejected" && request.rejection_reason && (
                    <Notice
                      tone="red"
                      role="alert"
                      icon={<CircleAlert />}
                      title={t("rejectionReason")}
                    >
                      {request.rejection_reason}
                    </Notice>
                  )}

                  {status === "pending_review" && (
                    <Notice tone="amber" icon={<Clock />}>
                      {t("pendingReviewNotice")}
                    </Notice>
                  )}

                  {status === "approved" && (
                    <Notice tone="emerald" icon={<CircleCheck />}>
                      {candidateCount > 0
                        ? t("matchedNotice", { count: candidateCount })
                        : t("approvedNotice")}
                    </Notice>
                  )}

                  {/* Actions */}
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-black/5 pt-4">
                    <button
                      type="button"
                      onClick={() => openPlacementRequestView(request)}
                      className={BTN_SECONDARY}
                    >
                      <Eye
                        className="h-4 w-4 shrink-0 text-slate-500"
                        aria-hidden="true"
                      />
                      {t("view")}
                    </button>

                    {canEdit(request.status) && (
                      <button
                        type="button"
                        onClick={() => openPlacementRequestEdit(request)}
                        className={BTN_SECONDARY}
                      >
                        <Pencil
                          className="h-4 w-4 shrink-0 text-slate-500"
                          aria-hidden="true"
                        />
                        {t("edit")}
                      </button>
                    )}

                    {request.status === "approved" && (
                      <button
                        type="button"
                        onClick={() => openPlacementCandidates(request)}
                        className={BTN_PRIMARY}
                      >
                        <UserRound
                          className="h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                        {t("candidatesWithCount", { count: candidateCount })}
                      </button>
                    )}

                    {canSubmit(request.status) && (
                      <button
                        type="button"
                        onClick={() => openPlacementRequestSubmit(request)}
                        className={BTN_PRIMARY}
                      >
                        <Send className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {request.status === "rejected"
                          ? t("resubmit")
                          : t("submitForReview")}
                      </button>
                    )}

                    {canDelete(request.status) && (
                      <button
                        type="button"
                        onClick={() => openPlacementRequestDelete(request)}
                        className={`${BTN_DANGER} sm:ml-auto`}
                      >
                        <Trash2
                          className="h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                        {t("delete")}
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

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 break-words text-sm font-medium">{value || "-"}</dd>
    </div>
  );
}

const NOTICE_TONES = {
  red: "bg-red-50/90 text-red-700 ring-red-200",
  amber: "bg-amber-50/90 text-amber-700 ring-amber-200",
  emerald: "bg-emerald-50/90 text-emerald-700 ring-emerald-200",
} as const;

function Notice({
  tone,
  icon,
  title,
  role,
  children,
}: {
  tone: keyof typeof NOTICE_TONES;
  icon: ReactNode;
  title?: string;
  role?: "alert";
  children: ReactNode;
}) {
  return (
    <div
      role={role}
      className={`mt-5 flex items-start gap-3 rounded-[12px] px-4 py-3 text-sm ring-1 ${NOTICE_TONES[tone]}`}
    >
      <span aria-hidden="true" className="mt-0.5 shrink-0 [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>

      <div className="min-w-0">
        {title && <p className="font-medium">{title}</p>}
        <p className={`break-words ${title ? "mt-0.5" : ""}`}>{children}</p>
      </div>
    </div>
  );
}

function StatusLabel({ value }: { value: string }) {
  const t = useTranslations("provider.placementRequests.list.statuses");

  return (
    <span
      className={`text-xs font-medium uppercase tracking-[0.15em] ${labelToneFor(value)}`}
    >
      {t(value.replaceAll("_", ""))}
    </span>
  );
}