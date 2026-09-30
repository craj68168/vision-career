"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import {
  CalendarDays,
  Clock3,
  Link2,
  Loader2,
  MessageSquareText,
  Video,
  X,
} from "lucide-react";

import { scheduleProviderInterview, updateProviderInterview } from "./api";

import type {
  ProviderApplication,
  ProviderInterview,
  ProviderInterviewMethod,
  ScheduleProviderInterviewPayload,
  UpdateProviderInterviewPayload,
} from "./types";
import type { ProviderDashboardApiError } from "../types";

type Props = {
  open: boolean;
  application: ProviderApplication | null;
  interview?: ProviderInterview | null;
  lang: string;
  onClose: () => void;
  onSuccess: (interview: ProviderInterview) => void | Promise<void>;
};

const METHOD_OPTIONS: Array<{
  value: ProviderInterviewMethod;
  labelKey:
    | "methods.zoom"
    | "methods.googleMeet"
    | "methods.phone"
    | "methods.faceToFace"
    | "methods.other";
}> = [
  { value: "ZOOM", labelKey: "methods.zoom" },
  { value: "GOOGLE_MEET", labelKey: "methods.googleMeet" },
  { value: "PHONE", labelKey: "methods.phone" },
  { value: "FACE_TO_FACE", labelKey: "methods.faceToFace" },
  { value: "OTHER", labelKey: "methods.other" },
];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ProviderDashboardApiError>(error)) {
    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const getDateInputValue = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function ScheduleInterviewModal({
  open,
  application,
  interview = null,
  onClose,
  onSuccess,
}: Props) {
  const t = useTranslations("provider.applications.scheduleModal");
  const isEdit = Boolean(interview);

  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [timezone, setTimezone] = useState("Asia/Tokyo");
  const [interviewMethod, setInterviewMethod] =
    useState<ProviderInterviewMethod>("ZOOM");
  const [meetingLink, setMeetingLink] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (interview) {
      setInterviewDate(getDateInputValue(interview.interviewDate));
      setInterviewTime(interview.interviewTime || "");
      setTimezone(interview.timezone || "Asia/Tokyo");
      setInterviewMethod(interview.interviewMethod);
      setMeetingLink(interview.meetingLink || "");
      setNotes(interview.notes || "");
      return;
    }

    setInterviewDate("");
    setInterviewTime("");
    setTimezone("Asia/Tokyo");
    setInterviewMethod("ZOOM");
    setMeetingLink("");
    setNotes("");
  }, [open, interview]);

  if (!open || !application) {
    return null;
  }

  const handleClose = () => {
    if (submitting) {
      return;
    }

    onClose();
  };

  const handleSubmit = async () => {
    if (!interviewDate) {
      toast.error(t("validation.dateRequired"));
      return;
    }

    if (!interviewTime) {
      toast.error(t("validation.timeRequired"));
      return;
    }

    if (!timezone.trim()) {
      toast.error(t("validation.timezoneRequired"));
      return;
    }

    try {
      setSubmitting(true);

      if (isEdit && interview) {
        const payload: UpdateProviderInterviewPayload = {
          interviewDate,
          interviewTime,
          timezone: timezone.trim(),
          interviewMethod,
          meetingLink: meetingLink.trim(),
          notes: notes.trim(),
        };

        const response = await updateProviderInterview(
          interview.interviewId,
          payload,
        );

        toast.success(response.message || t("toast.updated"));
        await onSuccess(response.data);
        return;
      }

      const payload: ScheduleProviderInterviewPayload = {
        applicationId: application.application_id,
        interviewDate,
        interviewTime,
        timezone: timezone.trim(),
        interviewMethod,
        meetingLink: meetingLink.trim(),
        notes: notes.trim(),
      };

      const response = await scheduleProviderInterview(payload);

      toast.success(response.message || t("toast.scheduled"));
      await onSuccess(response.data);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          isEdit ? t("toast.updateFailed") : t("toast.scheduleFailed"),
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onlineInterview =
    interviewMethod === "ZOOM" || interviewMethod === "GOOGLE_MEET";

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0"
        onClick={handleClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              {isEdit ? t("editEyebrow") : t("scheduleEyebrow")}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {application.applicant?.name || "-"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {application.vacancy?.title || application.vacancy_id}
            </p>
          </div>

          <button
            type="button"
            aria-label={t("close")}
            disabled={submitting}
            onClick={handleClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("fields.interviewDate")}
                icon={<CalendarDays className="h-4 w-4" />}
              >
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(event) => setInterviewDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                />
              </Field>

              <Field
                label={t("fields.interviewTime")}
                icon={<Clock3 className="h-4 w-4" />}
              >
                <input
                  type="time"
                  value={interviewTime}
                  onChange={(event) => setInterviewTime(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                />
              </Field>
            </div>

            <Field
              label={t("fields.timezone")}
              icon={<Clock3 className="h-4 w-4" />}
            >
              <select
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              >
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                <option value="Asia/Kathmandu">Asia/Kathmandu</option>
                <option value="UTC">UTC</option>
              </select>
            </Field>

            <Field
              label={t("fields.interviewMethod")}
              icon={<Video className="h-4 w-4" />}
            >
              <select
                value={interviewMethod}
                onChange={(event) =>
                  setInterviewMethod(
                    event.target.value as ProviderInterviewMethod,
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              >
                {METHOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label={t("fields.meetingLink")}
              icon={<Link2 className="h-4 w-4" />}
            >
              <input
                type="url"
                value={meetingLink}
                onChange={(event) => setMeetingLink(event.target.value)}
                placeholder={
                  interviewMethod === "ZOOM"
                    ? "https://zoom.us/..."
                    : interviewMethod === "GOOGLE_MEET"
                      ? "https://meet.google.com/..."
                      : t("optionalPlaceholder")
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              />

              {onlineInterview && !meetingLink.trim() && (
                <div className="mt-2 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-700">
                  {t("missingLinkNotice")}
                </div>
              )}
            </Field>

            <Field
              label={t("fields.notes")}
              icon={<MessageSquareText className="h-4 w-4" />}
            >
              <textarea
                value={notes}
                maxLength={2000}
                rows={4}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={t("notesPlaceholder")}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              />

              <p className="mt-1 text-right text-xs text-slate-400">
                {notes.length}/2000
              </p>
            </Field>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={submitting}
            onClick={handleClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => void handleSubmit()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}

            {submitting
              ? t("saving")
              : isEdit
                ? t("saveChanges")
                : t("scheduleInterview")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
        <span className="text-indigo-500">{icon}</span>
        <span>{label}</span>
      </div>

      {children}
    </div>
  );
}
