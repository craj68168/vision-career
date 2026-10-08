"use client";

import { useState } from "react";

import axios from "axios";

import { CalendarDays, Clock3, Loader2, MapPin, Video, X } from "lucide-react";

import toast from "react-hot-toast";

import {
  schedulePlacementInterview,
  updatePlacementInterview,
} from "./placementInterviewApi";

import type {
  PlacementInterview,
  PlacementInterviewFormPayload,
  PlacementInterviewMethod,
} from "./placementInterviewTypes";

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
// DATE INPUT
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
          ? await updatePlacementInterview(
              interview.interviewId,

              payload,
            )
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

        <div className="overflow-y-auto p-6">
          {validationError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {validationError}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {lang === "ja" ? "面接日" : "Interview Date"}
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="date"
                  value={interviewDate}
                  onChange={(event) => setInterviewDate(event.target.value)}
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {lang === "ja" ? "面接時間" : "Interview Time"}
              </label>

              <div className="relative">
                <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="time"
                  value={interviewTime}
                  onChange={(event) => setInterviewTime(event.target.value)}
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {lang === "ja" ? "タイムゾーン" : "Timezone"}
              </label>

              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={timezone}
                  onChange={(event) => setTimezone(event.target.value)}
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {lang === "ja" ? "面接方法" : "Interview Method"}
              </label>

              <div className="relative">
                <Video className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  value={interviewMethod}
                  onChange={(event) =>
                    setInterviewMethod(
                      event.target.value as PlacementInterviewMethod,
                    )
                  }
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-400"
                >
                  <option value="ZOOM">Zoom</option>

                  <option value="GOOGLE_MEET">Google Meet</option>

                  <option value="PHONE">Phone</option>

                  <option value="FACE_TO_FACE">Face-to-Face</option>

                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {lang === "ja" ? "ミーティングリンク" : "Meeting Link"}
            </label>

            <input
              type="url"
              value={meetingLink}
              onChange={(event) => setMeetingLink(event.target.value)}
              disabled={saving}
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {lang === "ja" ? "備考" : "Notes"}
            </label>

            <textarea
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              disabled={saving}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            {lang === "ja" ? "キャンセル" : "Cancel"}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSubmit()}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}

            {lang === "ja"
              ? isEdit
                ? "更新"
                : "面接を設定"
              : isEdit
                ? "Update Interview"
                : "Schedule Interview"}
          </button>
        </footer>
      </div>
    </div>
  );
}
