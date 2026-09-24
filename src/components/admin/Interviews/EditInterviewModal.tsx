"use client";

import { useState } from "react";

import {
  CalendarDays,
  Clock3,
  Link2,
  Loader2,
  MessageSquareText,
  Video,
  X,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import type {
  AdminInterview,
  AdminInterviewMethod,
  UpdateAdminInterviewPayload,
} from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  interview: AdminInterview;

  isSaving: boolean;

  onClose: () => void;

  onSubmit: (interviewId: string, payload: UpdateAdminInterviewPayload) => void;
};

// ======================================================
// METHOD OPTIONS
// ======================================================

const METHOD_OPTIONS: Array<{
  value: AdminInterviewMethod;

  en: string;

  ja: string;
}> = [
  {
    value: "ZOOM",
    en: "Zoom",
    ja: "Zoom",
  },

  {
    value: "GOOGLE_MEET",
    en: "Google Meet",
    ja: "Google Meet",
  },

  {
    value: "PHONE",
    en: "Phone",
    ja: "電話",
  },

  {
    value: "FACE_TO_FACE",
    en: "Face-to-Face",
    ja: "対面",
  },

  {
    value: "OTHER",
    en: "Other",
    ja: "その他",
  },
];

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

export default function EditInterviewModal({
  interview,
  isSaving,
  onClose,
  onSubmit,
}: Props) {
  const { lang } = useLanguage();

  // ==================================================
  // FORM STATE
  //
  // IMPORTANT:
  //
  // Initialize directly from interview props.
  //
  // Do NOT use useEffect + setState here.
  //
  // The parent gives this modal a key using interviewId,
  // so changing interview creates fresh form state.
  // ==================================================

  const [interviewDate, setInterviewDate] = useState(() =>
    toDateInputValue(interview.interviewDate),
  );

  const [interviewTime, setInterviewTime] = useState(
    () => interview.interviewTime || "",
  );

  const [timezone, setTimezone] = useState(
    () => interview.timezone || "Asia/Tokyo",
  );

  const [interviewMethod, setInterviewMethod] = useState<AdminInterviewMethod>(
    () => interview.interviewMethod,
  );

  const [meetingLink, setMeetingLink] = useState(
    () => interview.meetingLink || "",
  );

  const [notes, setNotes] = useState(() => interview.notes || "");

  const [validationError, setValidationError] = useState("");

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = () => {
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

    onSubmit(interview.interviewId, {
      interviewDate,

      interviewTime,

      timezone: timezone.trim(),

      interviewMethod,

      meetingLink: meetingLink.trim(),

      notes: notes.trim(),
    });
  };

  // ==================================================
  // ONLINE INTERVIEW
  // ==================================================

  const onlineInterview =
    interviewMethod === "ZOOM" || interviewMethod === "GOOGLE_MEET";

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={isSaving ? undefined : onClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              {lang === "ja" ? "面接編集" : "Edit Interview"}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {interview.candidate?.name || "-"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {interview.interviewId}
            </p>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}

        <div className="overflow-y-auto px-6 py-6">
          <div className="space-y-5">
            {validationError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {validationError}
              </div>
            )}

            {/* DATE / TIME */}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={lang === "ja" ? "面接日" : "Interview Date"}
                icon={<CalendarDays className="h-4 w-4" />}
              >
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(event) => setInterviewDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                />
              </Field>

              <Field
                label={lang === "ja" ? "面接時間" : "Interview Time"}
                icon={<Clock3 className="h-4 w-4" />}
              >
                <input
                  type="time"
                  value={interviewTime}
                  onChange={(event) => setInterviewTime(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                />
              </Field>
            </div>

            {/* TIMEZONE */}

            <Field
              label={lang === "ja" ? "タイムゾーン" : "Timezone"}
              icon={<Clock3 className="h-4 w-4" />}
            >
              <select
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400"
              >
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>

                <option value="Asia/Kathmandu">Asia/Kathmandu</option>

                <option value="UTC">UTC</option>
              </select>
            </Field>

            {/* METHOD */}

            <Field
              label={lang === "ja" ? "面接方法" : "Interview Method"}
              icon={<Video className="h-4 w-4" />}
            >
              <select
                value={interviewMethod}
                onChange={(event) =>
                  setInterviewMethod(event.target.value as AdminInterviewMethod)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400"
              >
                {METHOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {lang === "ja" ? option.ja : option.en}
                  </option>
                ))}
              </select>
            </Field>

            {/* MEETING LINK */}

            <Field
              label={lang === "ja" ? "ミーティングリンク" : "Meeting Link"}
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
                      : lang === "ja"
                        ? "必要な場合のみ入力"
                        : "Optional"
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
              />

              {onlineInterview && !meetingLink.trim() && (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-700">
                  {lang === "ja"
                    ? "Zoom / Google Meet のリンクがない場合、面接はリンク待ち状態になります。"
                    : "Without a Zoom or Google Meet link, the interview will remain Awaiting Link."}
                </div>
              )}
            </Field>

            {/* NOTES */}

            <Field
              label={lang === "ja" ? "重要事項・メモ" : "Important Notes"}
              icon={<MessageSquareText className="h-4 w-4" />}
            >
              <textarea
                rows={5}
                maxLength={2000}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
              />

              <p className="mt-1 text-right text-xs text-slate-400">
                {notes.length}/2000
              </p>
            </Field>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            {lang === "ja" ? "キャンセル" : "Cancel"}
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSubmit}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}

            {isSaving
              ? lang === "ja"
                ? "保存中..."
                : "Saving..."
              : lang === "ja"
                ? "変更を保存"
                : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// FIELD
// ======================================================

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
