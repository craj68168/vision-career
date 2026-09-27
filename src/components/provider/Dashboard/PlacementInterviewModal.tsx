"use client";

import axios from "axios";

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

import { useState } from "react";

import toast from "react-hot-toast";

import {
  schedulePlacementInterview,
  updatePlacementInterview,
} from "./placementInterviewApi";

import type {
  PlacementInterview,
  PlacementInterviewFormPayload,
  PlacementInterviewMethod,
} from "./placementInterviewApi";

import type { PlacementRequest, ProviderPlacementCandidate } from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  candidate: ProviderPlacementCandidate;

  request: PlacementRequest;

  interview?: PlacementInterview | null;

  lang: string;

  onClose: () => void;

  onSuccess: () => void | Promise<void>;
};

// ======================================================
// API ERROR
// ======================================================

type ApiErrorResponse = {
  status?: string;

  success?: boolean;

  message?: string;
};

// ======================================================
// DATE INPUT VALUE
// ======================================================

const toDateInputValue = (value?: string | null) => {
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

// ======================================================
// COMPONENT
// ======================================================

export default function PlacementInterviewModal({
  candidate,
  request,
  interview,
  lang,
  onClose,
  onSuccess,
}: Props) {
  const isEdit = Boolean(interview);

  const [interviewDate, setInterviewDate] = useState(() =>
    toDateInputValue(interview?.interviewDate),
  );

  const [interviewTime, setInterviewTime] = useState(
    () => interview?.interviewTime || "",
  );

  const [timezone, setTimezone] = useState(
    () => interview?.timezone || "Asia/Tokyo",
  );

  const [interviewMethod, setInterviewMethod] =
    useState<PlacementInterviewMethod>(
      () => interview?.interviewMethod || "ZOOM",
    );

  const [meetingLink, setMeetingLink] = useState(
    () => interview?.meetingLink || "",
  );

  const [notes, setNotes] = useState(() => interview?.notes || "");

  const [validationError, setValidationError] = useState("");

  const [saving, setSaving] = useState(false);

  // ====================================================
  // ONLINE METHOD
  // ====================================================

  const onlineInterview =
    interviewMethod === "ZOOM" || interviewMethod === "GOOGLE_MEET";

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async () => {
    setValidationError("");

    if (!interviewDate) {
      setValidationError(
        lang === "ja"
          ? "面接日を選択してください。"
          : "Interview date is required.",
      );

      return;
    }

    if (!interviewTime) {
      setValidationError(
        lang === "ja"
          ? "面接時間を選択してください。"
          : "Interview time is required.",
      );

      return;
    }

    if (!timezone.trim()) {
      setValidationError(
        lang === "ja"
          ? "タイムゾーンを入力してください。"
          : "Timezone is required.",
      );

      return;
    }

    if (meetingLink.trim().length > 2000) {
      setValidationError(
        lang === "ja"
          ? "ミーティングリンクが長すぎます。"
          : "Meeting link is too long.",
      );

      return;
    }

    if (notes.trim().length > 2000) {
      setValidationError(
        lang === "ja"
          ? "備考は2000文字以内で入力してください。"
          : "Notes cannot exceed 2000 characters.",
      );

      return;
    }

    const payload: PlacementInterviewFormPayload = {
      interviewDate,

      interviewTime,

      timezone: timezone.trim(),

      interviewMethod,

      meetingLink: meetingLink.trim(),

      notes: notes.trim(),
    };

    try {
      setSaving(true);

      const response =
        isEdit && interview
          ? await updatePlacementInterview(interview.interviewId, payload)
          : await schedulePlacementInterview(
              candidate.placementCandidateId,
              payload,
            );

      toast.success(
        response.message ||
          (isEdit
            ? lang === "ja"
              ? "面接情報を更新しました。"
              : "Interview updated successfully."
            : lang === "ja"
              ? "面接を設定しました。"
              : "Interview scheduled successfully."),
      );

      await onSuccess();

      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message ||
            (lang === "ja"
              ? "面接の保存に失敗しました。"
              : "Failed to save interview."),
        );

        return;
      }

      toast.error(
        lang === "ja"
          ? "面接の保存に失敗しました。"
          : "Failed to save interview.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close"
        disabled={saving}
        onClick={saving ? undefined : onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              {lang === "ja"
                ? isEdit
                  ? "面接情報を編集"
                  : "面接を設定"
                : isEdit
                  ? "Edit Placement Interview"
                  : "Schedule Placement Interview"}
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

        {/* CONTENT */}

        <div className="overflow-y-auto p-6">
          {/* SUMMARY */}

          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <SummaryItem
              icon={<UserRound className="h-4 w-4" />}
              label={lang === "ja" ? "候補者" : "Candidate"}
              value={candidate.candidate.name}
            />

            <SummaryItem
              icon={<MapPin className="h-4 w-4" />}
              label={lang === "ja" ? "勤務地" : "Work Location"}
              value={request.work_location || "-"}
            />

            <SummaryItem
              icon={<CalendarDays className="h-4 w-4" />}
              label={lang === "ja" ? "採用依頼ID" : "Placement Request"}
              value={request.recruitId}
            />
          </div>

          {validationError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {validationError}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            {/* DATE */}

            <FormField
              label={lang === "ja" ? "面接日" : "Interview Date"}
              required
            >
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

            {/* TIME */}

            <FormField
              label={lang === "ja" ? "面接時間" : "Interview Time"}
              required
            >
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

            {/* TIMEZONE */}

            <FormField
              label={lang === "ja" ? "タイムゾーン" : "Timezone"}
              required
            >
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

            {/* METHOD */}

            <FormField
              label={lang === "ja" ? "面接方法" : "Interview Method"}
              required
            >
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

                <option value="PHONE">Phone</option>

                <option value="FACE_TO_FACE">Face-to-Face</option>

                <option value="OTHER">Other</option>
              </select>
            </FormField>
          </div>

          {/* MEETING LINK */}

          {onlineInterview && (
            <div className="mt-5">
              <FormField
                label={lang === "ja" ? "ミーティングリンク" : "Meeting Link"}
              >
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
                  {lang === "ja"
                    ? "リンクなしでも保存できますが、面接はリンク待ちになります。リンクを追加して面接が確定するまで候補者への最終通知は送信されません。"
                    : "You can schedule without a link, but the interview will remain Awaiting Link. The final seeker notification is sent when the link is added and the interview becomes confirmed."}
                </div>
              )}
            </div>
          )}

          {/* NOTES */}

          <div className="mt-5">
            <FormField label={lang === "ja" ? "備考" : "Notes"}>
              <textarea
                rows={5}
                value={notes}
                disabled={saving}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={
                  lang === "ja"
                    ? "例：面接開始10分前に参加してください。"
                    : "Example: Please join 10 minutes before the interview."
                }
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-indigo-400"
              />
            </FormField>
          </div>

          {/* CURRENT LINK */}

          {isEdit && interview?.meetingLink && (
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />

              {lang === "ja" ? "現在のリンクを開く" : "Open Current Link"}
            </a>
          )}
        </div>

        {/* FOOTER */}

        <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {lang === "ja" ? "キャンセル" : "Cancel"}
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
              ? lang === "ja"
                ? "保存中..."
                : "Saving..."
              : isEdit
                ? lang === "ja"
                  ? "面接を更新"
                  : "Update Interview"
                : lang === "ja"
                  ? "面接を設定"
                  : "Schedule Interview"}
          </button>
        </footer>
      </div>
    </div>
  );
}

// ======================================================
// FIELD
// ======================================================

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;

  required?: boolean;

  children: React.ReactNode;
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

// ======================================================
// SUMMARY ITEM
// ======================================================

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;

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
