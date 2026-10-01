"use client";

import type { ReactNode } from "react";

import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Loader2,
  MapPin,
  Pencil,
  UserRound,
  Video,
  X,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";

import PlacementInterviewModal from "./PlacementInterviewModal";
import { usePlacementCandidates } from "./placementCandidatesHook";

import type { PlacementRequest } from "./types";
import type {
  PlacementCandidateStatus,
  ProviderPlacementCandidate,
  ProviderPlacementCandidateDecisionStatus,
  UpdateProviderPlacementCandidateStatusPayload,
} from "./placementCandidatesTypes";
import type {
  PlacementInterview,
  PlacementInterviewStatus,
} from "./placementInterviewTypes";

type Props = {
  open: boolean;
  request: PlacementRequest | null;
  candidates: ProviderPlacementCandidate[];
  actionCandidateId: string | null;
  lang: string;
  onClose: () => void;
  onStatusChange: (
    placementCandidateId: string,
    payload: UpdateProviderPlacementCandidateStatusPayload,
  ) => void | Promise<void>;
};

const getNextAction = (
  status: PlacementCandidateStatus,
): {
  status: ProviderPlacementCandidateDecisionStatus;
  labelKey: "startReview" | "selectCandidate" | "markAsPlaced";
} | null => {
  switch (status) {
    case "MATCHED":
      return { status: "UNDER_REVIEW", labelKey: "startReview" };
    case "INTERVIEW":
      return { status: "SELECTED", labelKey: "selectCandidate" };
    case "SELECTED":
      return { status: "PLACED", labelKey: "markAsPlaced" };
    default:
      return null;
  }
};

export default function PlacementCandidatesModal({
  open,
  request,
  candidates,
  actionCandidateId,
  lang,
  onClose,
  onStatusChange,
}: Props) {
  const t = useTranslations("provider.placementRequests.candidatesModal");

  const {
    currentCandidates,
    interviewMap,
    placedCount,
    loadingInterviewData,
    loadingCandidateInterviewId,
    interviewCandidate,
    editingInterview,
    rejectingCandidateId,
    setRejectingCandidateId,
    rejectionReason,
    setRejectionReason,
    updateCandidateStatus,
    closeReject,
    rejectCandidate,
    openScheduleInterview,
    closeScheduleInterview,
    handleInterviewSuccess,
  } = usePlacementCandidates({
    open,
    request,
    candidates,
    lang,
    onStatusChange,
  });

  if (!open || !request) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:p-4">
        <button
          type="button"
          aria-label={t("close")}
          onClick={onClose}
          className="absolute inset-0"
        />

        <div className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-white sm:max-h-[94vh] sm:max-w-6xl sm:rounded-3xl sm:shadow-2xl">
          <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                {t("title")}
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                {request.job_title}
              </h2>

              <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                <span>{request.recruitId}</span>

                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {request.work_location || "-"}
                </span>

                <span>
                  {t("positions")}: {request.number_of_positions}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {loadingInterviewData && (
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              )}

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 transition hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="grid gap-4 border-b border-slate-200 bg-slate-50/70 p-6 sm:grid-cols-3">
            <SummaryCard
              label={t("summary.positionsRequired")}
              value={request.number_of_positions}
            />
            <SummaryCard
              label={t("summary.candidatesReceived")}
              value={currentCandidates.length}
            />
            <SummaryCard label={t("summary.placed")} value={placedCount} />
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {currentCandidates.length === 0 ? (
              <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-slate-300">
                <div className="max-w-md text-center">
                  <BriefcaseBusiness className="mx-auto h-9 w-9 text-slate-300" />

                  <h3 className="mt-4 font-semibold text-slate-900">
                    {t("emptyTitle")}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {t("emptyDescription")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {currentCandidates.map((item) => {
                  const nextAction = getNextAction(item.status);
                  const interview = interviewMap.get(item.placementCandidateId);
                  const isBusy =
                    actionCandidateId === item.placementCandidateId;
                  const isInterviewLookup =
                    loadingCandidateInterviewId === item.placementCandidateId;
                  const canScheduleInterview =
                    item.status === "UNDER_REVIEW" && !interview;
                  const needsInterviewLookup =
                    item.status === "INTERVIEW" && !interview;
                  const canEditInterview =
                    item.status === "INTERVIEW" &&
                    Boolean(interview) &&
                    interview?.status !== "COMPLETED" &&
                    interview?.status !== "CANCELLED";
                  const canReject = [
                    "MATCHED",
                    "UNDER_REVIEW",
                    "INTERVIEW",
                    "SELECTED",
                  ].includes(item.status);

                  return (
                    <article
                      key={item.placementCandidateId}
                      className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <UserRound className="h-5 w-5" />
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold text-slate-950">
                              {item.candidate.name}
                            </h3>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {item.placementCandidateId}
                            </p>
                          </div>
                        </div>

                        <CandidateStatusBadge status={item.status} />
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <Info
                          label={t("fields.nationality")}
                          value={item.candidate.nationality}
                        />
                        <Info
                          label={t("fields.japanese")}
                          value={item.candidate.japanese_level}
                        />
                        <Info
                          label={t("fields.visa")}
                          value={item.candidate.visa_type}
                        />
                        <Info
                          label={t("fields.currentLocation")}
                          value={item.candidate.current_location}
                        />
                        <Info
                          label={t("fields.desiredJob")}
                          value={item.candidate.desired_job}
                        />
                        <Info
                          label={t("fields.desiredLocation")}
                          value={item.candidate.desired_location}
                        />
                        <Info
                          label={t("fields.visaExpiry")}
                          value={formatDate(item.candidate.visa_expiry_date)}
                        />
                        <Info
                          label={t("fields.matched")}
                          value={formatDate(item.matchedAt)}
                        />
                      </div>

                      {item.candidate.skills.length > 0 && (
                        <div className="mt-5">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {t("sections.skills")}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {item.candidate.skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.candidate.education.length > 0 && (
                        <details className="mt-5 rounded-xl border border-slate-200">
                          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">
                            {t("sections.education")} (
                            {item.candidate.education.length})
                          </summary>

                          <div className="space-y-3 border-t border-slate-200 p-4">
                            {item.candidate.education.map(
                              (education, index) => (
                                <div
                                  key={`${education.school ?? "school"}-${index}`}
                                  className="rounded-xl bg-slate-50 p-3"
                                >
                                  <p className="font-medium text-slate-900">
                                    {education.school || "-"}
                                  </p>

                                  <p className="mt-1 text-sm text-slate-500">
                                    {[education.school_type, education.major]
                                      .filter(Boolean)
                                      .join(" - ") || "-"}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        </details>
                      )}

                      {item.candidate.employment_history.length > 0 && (
                        <details className="mt-3 rounded-xl border border-slate-200">
                          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">
                            {t("sections.employmentHistory")} (
                            {item.candidate.employment_history.length})
                          </summary>

                          <div className="space-y-3 border-t border-slate-200 p-4">
                            {item.candidate.employment_history.map(
                              (employment, index) => (
                                <div
                                  key={`${employment.company_name ?? "company"}-${index}`}
                                  className="rounded-xl bg-slate-50 p-3"
                                >
                                  <p className="font-medium text-slate-900">
                                    {employment.company_name || "-"}
                                  </p>

                                  <p className="mt-1 text-sm text-slate-500">
                                    {employment.employment_type || "-"}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        </details>
                      )}

                      {interview && (
                        <InterviewCard
                          interview={interview}
                          canEdit={canEditInterview}
                          onEdit={() =>
                            void openScheduleInterview(item, interview)
                          }
                        />
                      )}

                      {item.status === "REJECTED" && item.rejectionReason && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                          <p className="text-sm font-semibold text-red-700">
                            {t("rejectionReason")}
                          </p>

                          <p className="mt-1 whitespace-pre-wrap text-sm text-red-700">
                            {item.rejectionReason}
                          </p>
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-400">
                        {item.providerReviewedAt && (
                          <DateStamp
                            label={t("dates.review")}
                            value={item.providerReviewedAt}
                          />
                        )}
                        {item.interviewAt && (
                          <DateStamp
                            label={t("dates.interview")}
                            value={item.interviewAt}
                          />
                        )}
                        {item.selectedAt && (
                          <DateStamp
                            label={t("dates.selected")}
                            value={item.selectedAt}
                          />
                        )}
                        {item.placedAt && (
                          <DateStamp
                            label={t("dates.placed")}
                            value={item.placedAt}
                          />
                        )}
                      </div>

                      {(nextAction ||
                        canScheduleInterview ||
                        needsInterviewLookup ||
                        canEditInterview ||
                        canReject) && (
                        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                          {nextAction && (
                            <button
                              type="button"
                              disabled={Boolean(actionCandidateId)}
                              onClick={() =>
                                void updateCandidateStatus(
                                  item.placementCandidateId,
                                  { status: nextAction.status },
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isBusy ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
                              {t(`actions.${nextAction.labelKey}`)}
                            </button>
                          )}

                          {canScheduleInterview && (
                            <button
                              type="button"
                              disabled={
                                Boolean(actionCandidateId) || isInterviewLookup
                              }
                              onClick={() => void openScheduleInterview(item)}
                              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                            >
                              {isInterviewLookup ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CalendarDays className="h-4 w-4" />
                              )}
                              {t("actions.scheduleInterview")}
                            </button>
                          )}

                          {needsInterviewLookup && (
                            <button
                              type="button"
                              disabled={
                                Boolean(actionCandidateId) || isInterviewLookup
                              }
                              onClick={() => void openScheduleInterview(item)}
                              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
                            >
                              {isInterviewLookup ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Video className="h-4 w-4" />
                              )}
                              {t("actions.openInterview")}
                            </button>
                          )}

                          {canEditInterview && interview && (
                            <button
                              type="button"
                              disabled={
                                Boolean(actionCandidateId) || isInterviewLookup
                              }
                              onClick={() =>
                                void openScheduleInterview(item, interview)
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-50"
                            >
                              <Pencil className="h-4 w-4" />
                              {t("actions.editInterview")}
                            </button>
                          )}

                          {canReject && (
                            <button
                              type="button"
                              disabled={Boolean(actionCandidateId)}
                              onClick={() => {
                                setRejectingCandidateId(
                                  item.placementCandidateId,
                                );
                                setRejectionReason("");
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 disabled:opacity-50"
                            >
                              <XCircle className="h-4 w-4" />
                              {t("actions.rejectCandidate")}
                            </button>
                          )}
                        </div>
                      )}

                      {rejectingCandidateId === item.placementCandidateId && (
                        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                          <label className="text-sm font-semibold text-red-700">
                            {t("rejectionReason")}
                          </label>

                          <textarea
                            rows={3}
                            value={rejectionReason}
                            onChange={(event) =>
                              setRejectionReason(event.target.value)
                            }
                            placeholder={t("rejectionPlaceholder")}
                            className="mt-2 w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-400"
                          />

                          <div className="mt-3 flex justify-end gap-2">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={closeReject}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                            >
                              {t("cancel")}
                            </button>

                            <button
                              type="button"
                              disabled={!rejectionReason.trim() || isBusy}
                              onClick={() => void rejectCandidate()}
                              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                            >
                              {isBusy && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              )}
                              {t("confirmReject")}
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {interviewCandidate && (
        <PlacementInterviewModal
          key={`${interviewCandidate.placementCandidateId}-${
            editingInterview?.interviewId || "new"
          }`}
          candidate={interviewCandidate}
          request={request}
          interview={editingInterview}
          lang={lang}
          onClose={closeScheduleInterview}
          onSuccess={handleInterviewSuccess}
        />
      )}
    </>
  );
}

function InterviewCard({
  interview,
  canEdit,
  onEdit,
}: {
  interview: PlacementInterview;
  canEdit: boolean;
  onEdit: () => void;
}) {
  const t = useTranslations("provider.placementRequests.candidatesModal");

  return (
    <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Video className="h-4 w-4 text-blue-600" />
            <p className="font-semibold text-blue-950">
              {t("interview.schedule")}
            </p>
            <InterviewStatusBadge status={interview.status} />
          </div>

          <p className="mt-1 text-xs text-blue-500">{interview.interviewId}</p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            {t("edit")}
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <InterviewInfo
          icon={<CalendarDays className="h-4 w-4" />}
          label={t("interview.date")}
          value={formatDate(interview.interviewDate)}
        />
        <InterviewInfo
          icon={<Clock3 className="h-4 w-4" />}
          label={t("interview.time")}
          value={interview.interviewTime}
        />
        <InterviewInfo
          icon={<MapPin className="h-4 w-4" />}
          label={t("interview.timezone")}
          value={interview.timezone}
        />
        <InterviewInfo
          icon={<Video className="h-4 w-4" />}
          label={t("interview.method")}
          value={formatMethod(interview.interviewMethod, t)}
        />
      </div>

      {interview.status === "AWAITING_LINK" && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          {t("interview.awaitingLink")}
        </div>
      )}

      {interview.meetingLink && interview.status !== "CANCELLED" && (
        <a
          href={interview.meetingLink}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          {t("interview.openLink")}
        </a>
      )}

      {interview.notes && (
        <div className="mt-4 rounded-xl bg-white/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {t("interview.notes")}
          </p>

          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
            {interview.notes}
          </p>
        </div>
      )}
    </div>
  );
}

function InterviewInfo({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-xl bg-white/80 p-3">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        {icon}
        {label}
      </div>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value || "-"}
      </p>
    </div>
  );
}

function InterviewStatusBadge({
  status,
}: {
  status: PlacementInterviewStatus;
}) {
  const t = useTranslations("provider.placementRequests.candidatesModal");
  const classes: Record<PlacementInterviewStatus, string> = {
    AWAITING_LINK: "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-emerald-100 text-emerald-700",
    COMPLETED: "bg-blue-100 text-blue-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes[status]}`}
    >
      {t(`interview.statuses.${status.toLowerCase()}`)}
    </span>
  );
}

function CandidateStatusBadge({
  status,
}: {
  status: PlacementCandidateStatus;
}) {
  const t = useTranslations("provider.placementRequests.candidatesModal");
  let classes = "bg-slate-100 text-slate-700";

  switch (status) {
    case "MATCHED":
      classes = "bg-indigo-50 text-indigo-700";
      break;
    case "UNDER_REVIEW":
      classes = "bg-amber-50 text-amber-700";
      break;
    case "INTERVIEW":
      classes = "bg-blue-50 text-blue-700";
      break;
    case "SELECTED":
      classes = "bg-violet-50 text-violet-700";
      break;
    case "PLACED":
      classes = "bg-emerald-50 text-emerald-700";
      break;
    case "REJECTED":
      classes = "bg-red-50 text-red-700";
      break;
  }

  return (
    <span
      className={`h-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {t(`statuses.${status.toLowerCase()}`)}
    </span>
  );
}

function DateStamp({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <CalendarDays className="h-3.5 w-3.5" />
      {label}: {formatDate(value)}
    </span>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">
        {value === null || value === undefined || value === ""
          ? "-"
          : String(value)}
      </p>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function formatMethod(value: string, t: (key: string) => string) {
  const labels: Record<string, string> = {
    ZOOM: "Zoom",
    GOOGLE_MEET: "Google Meet",
    PHONE: t("methods.phone"),
    FACE_TO_FACE: t("methods.faceToFace"),
    OTHER: t("methods.other"),
  };

  return labels[value] || value;
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
