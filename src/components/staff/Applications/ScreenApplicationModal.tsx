"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";

import type { ScreenApplicationPayload, StaffApplication } from "./types";

type Props = {
  application: StaffApplication | null;

  loading: boolean;

  onClose: () => void;

  onSubmit: (applicationId: string, payload: ScreenApplicationPayload) => void;
};

export default function ScreenApplicationModal({
  application,
  loading,
  onClose,
  onSubmit,
}: Props) {
  if (!application) {
    return null;
  }

  return (
    <ScreenForm
      key={application.applicationId}
      application={application}
      loading={loading}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function ScreenForm({
  application,
  loading,
  onClose,
  onSubmit,
}: {
  application: StaffApplication;

  loading: boolean;

  onClose: () => void;

  onSubmit: (applicationId: string, payload: ScreenApplicationPayload) => void;
}) {
  const t = useTranslations("staffApplications");

  const [status, setStatus] = useState<"SCREENED" | "NEEDS_ATTENTION">(
    application.screening.status === "NEEDS_ATTENTION"
      ? "NEEDS_ATTENTION"
      : "SCREENED",
  );

  const [note, setNote] = useState(application.screening.note || "");

  const [error, setError] = useState("");

  const isEditing = application.screening.status !== "NOT_SCREENED";

  const submit = () => {
    setError("");

    const normalizedNote = note.trim();

    if (status === "NEEDS_ATTENTION" && !normalizedNote) {
      setError(t("screenModal.noteRequired"));

      return;
    }

    if (normalizedNote.length > 2000) {
      setError(t("screenModal.noteTooLong"));

      return;
    }

    onSubmit(application.applicationId, {
      screeningStatus: status,

      note: normalizedNote,
    });
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        disabled={loading}
        onClick={onClose}
        aria-label={t("screenModal.close")}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              {t("screenModal.eyebrow")}
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {isEditing ? t("screenModal.editTitle") : t("screenModal.title")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {application.applicationId}
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            aria-label={t("screenModal.close")}
            className="rounded-full p-2 transition hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold">{application.applicant.name || "-"}</p>

            <p className="mt-1 text-sm text-slate-500">
              {application.vacancy?.title || "-"} •{" "}
              {application.vacancy?.companyName || "-"}
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => setStatus("SCREENED")}
              className={`rounded-2xl border p-4 text-left transition disabled:opacity-50 ${
                status === "SCREENED"
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />

              <p className="mt-3 font-semibold">{t("screenModal.screened")}</p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {t("screenModal.screenedDescription")}
              </p>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => setStatus("NEEDS_ATTENTION")}
              className={`rounded-2xl border p-4 text-left transition disabled:opacity-50 ${
                status === "NEEDS_ATTENTION"
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <AlertTriangle className="h-5 w-5 text-red-600" />

              <p className="mt-3 font-semibold">
                {t("screenModal.needsAttention")}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {t("screenModal.needsAttentionDescription")}
              </p>
            </button>
          </div>

          <label className="block">
            <span className="text-sm font-semibold">
              {t("screenModal.note")}
            </span>

            <textarea
              value={note}
              disabled={loading}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              maxLength={2000}
              placeholder={t("screenModal.notePlaceholder")}
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-4 outline-none focus:border-indigo-500 disabled:opacity-50"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {note.length} / 2000
            </p>
          </label>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-700">
            {t("screenModal.permissionNotice")}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 disabled:opacity-50"
          >
            {t("screenModal.cancel")}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={submit}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}

            {loading ? t("screenModal.saving") : t("screenModal.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
