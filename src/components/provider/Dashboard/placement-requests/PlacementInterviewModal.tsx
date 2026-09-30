"use client";

import type { ReactNode } from "react";

import {
  CalendarDays,
  Clock3,
  ExternalLink,
  Loader2,
  MapPin,
  UserRound,
  Video,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { usePlacementInterview } from "./placementInterviewHook";

import type {
  PlacementInterview,
  PlacementInterviewMethod,
} from "./placementInterviewTypes";

import type { PlacementRequest, ProviderPlacementCandidate } from "./types";

type Props = {
  candidate: ProviderPlacementCandidate;
  request: PlacementRequest;
  interview?: PlacementInterview | null;
  lang: string;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
};

export default function PlacementInterviewModal({
  candidate,
  request,
  interview,
  lang,
  onClose,
  onSuccess,
}: Props) {
  const t = useTranslations("provider.placementRequests.interviewModal");

  const {
    isEdit,
    interviewDate,
    setInterviewDate,
    interviewTime,
    setInterviewTime,
    timezone,
    setTimezone,
    interviewMethod,
    setInterviewMethod,
    meetingLink,
    setMeetingLink,
    notes,
    setNotes,
    validationError,
    saving,
    onlineInterview,
    handleSubmit,
  } = usePlacementInterview({
    placementCandidateId: candidate.placementCandidateId,
    interview,
    lang,
    onClose,
    onSuccess,
  });

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label={t("close")}
        disabled={saving}
        onClick={saving ? undefined : onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              {isEdit ? t("editTitle") : t("scheduleTitle")}
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              {candidate.candidate.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">{request.job_title}</p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="overflow-y-auto p-6">
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <SummaryItem
              icon={<UserRound className="h-4 w-4" />}
              label={t("summary.candidate")}
              value={candidate.candidate.name}
            />

            <SummaryItem
              icon={<MapPin className="h-4 w-4" />}
              label={t("summary.workLocation")}
              value={request.work_location || "-"}
            />

            <SummaryItem
              icon={<CalendarDays className="h-4 w-4" />}
              label={t("summary.placementRequest")}
              value={request.recruitId}
            />
          </div>

          {validationError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {validationError}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <FormField label={t("fields.interviewDate")} required>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="date"
                  value={interviewDate}
                  disabled={saving}
                  onChange={(event) => setInterviewDate(event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>
            </FormField>

            <FormField label={t("fields.interviewTime")} required>
              <div className="relative">
                <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="time"
                  value={interviewTime}
                  disabled={saving}
                  onChange={(event) => setInterviewTime(event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>
            </FormField>

            <FormField label={t("fields.timezone")} required>
              <select
                value={timezone}
                disabled={saving}
                onChange={(event) => setTimezone(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-400"
              >
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="Asia/Kathmandu">Asia/Kathmandu</option>
                <option value="UTC">UTC</option>
              </select>
            </FormField>

            <FormField label={t("fields.interviewMethod")} required>
              <select
                value={interviewMethod}
                disabled={saving}
                onChange={(event) =>
                  setInterviewMethod(
                    event.target.value as PlacementInterviewMethod,
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-400"
              >
                <option value="ZOOM">Zoom</option>
                <option value="GOOGLE_MEET">Google Meet</option>
                <option value="PHONE">{t("methods.phone")}</option>
                <option value="FACE_TO_FACE">{t("methods.faceToFace")}</option>
                <option value="OTHER">{t("methods.other")}</option>
              </select>
            </FormField>
          </div>

          {onlineInterview && (
            <div className="mt-5">
              <FormField label={t("fields.meetingLink")}>
                <div className="relative">
                  <Video className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="url"
                    value={meetingLink}
                    disabled={saving}
                    onChange={(event) => setMeetingLink(event.target.value)}
                    placeholder={
                      interviewMethod === "ZOOM"
                        ? "https://zoom.us/j/..."
                        : "https://meet.google.com/..."
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400"
                  />
                </div>
              </FormField>

              {!meetingLink.trim() && (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-700">
                  {t("missingLinkNotice")}
                </div>
              )}
            </div>
          )}

          <div className="mt-5">
            <FormField label={t("fields.notes")}>
              <textarea
                rows={5}
                value={notes}
                disabled={saving}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={t("notesPlaceholder")}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-indigo-400"
              />
            </FormField>
          </div>

          {isEdit && interview?.meetingLink && (
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              {t("openCurrentLink")}
            </a>
          )}
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSubmit()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CalendarDays className="h-4 w-4" />
            )}

            {saving
              ? t("saving")
              : isEdit
                ? t("updateInterview")
                : t("scheduleInterview")}
          </button>
        </footer>
      </div>
    </div>
  );
}

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      {children}
    </label>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        {icon}
        {label}
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}
