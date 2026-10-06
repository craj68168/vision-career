"use client";

import { useState } from "react";

import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";

import { useTranslations } from "next-intl";

import type { ScreenVacancyPayload, StaffVacancy } from "./types";

type Props = {
  vacancy: StaffVacancy | null;

  loading: boolean;

  onClose: () => void;

  onSubmit: (vacancyId: string, payload: ScreenVacancyPayload) => void;
};

export default function ScreenVacancyModal({
  vacancy,
  loading,
  onClose,
  onSubmit,
}: Props) {
  if (!vacancy) {
    return null;
  }

  return (
    <ScreenForm
      key={vacancy.vacancyId}
      vacancy={vacancy}
      loading={loading}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function ScreenForm({
  vacancy,
  loading,
  onClose,
  onSubmit,
}: {
  vacancy: StaffVacancy;

  loading: boolean;

  onClose: () => void;

  onSubmit: (vacancyId: string, payload: ScreenVacancyPayload) => void;
}) {
  const t = useTranslations("staffVacancies.screenModal");

  const [status, setStatus] = useState<"SCREENED" | "NEEDS_ATTENTION">(
    vacancy.staffScreening.status === "NEEDS_ATTENTION"
      ? "NEEDS_ATTENTION"
      : "SCREENED",
  );

  const [note, setNote] = useState(vacancy.staffScreening.note || "");

  const [error, setError] = useState("");

  const submit = () => {
    setError("");

    const normalizedNote = note.trim();

    if (status === "NEEDS_ATTENTION" && !normalizedNote) {
      setError(t("noteRequired"));

      return;
    }

    if (normalizedNote.length > 2000) {
      setError(t("noteTooLong"));

      return;
    }

    onSubmit(vacancy.vacancyId, {
      screeningStatus: status,

      note: normalizedNote,
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        disabled={loading}
        onClick={onClose}
        aria-label={t("close")}
      />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              {t("eyebrow")}
            </p>

            <h2 className="mt-1 text-2xl font-bold">{t("title")}</h2>

            <p className="mt-1 text-sm text-slate-500">{vacancy.vacancyId}</p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            aria-label={t("close")}
            className="rounded-full p-2 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}

        <div className="space-y-5 p-6">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold">{vacancy.title}</p>

            <p className="mt-1 text-sm text-slate-500">
              {vacancy.companyName}
              {" • "}
              {vacancy.workLocation}
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
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
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />

              <p className="mt-3 font-semibold">{t("screened")}</p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {t("screenedDescription")}
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

              <p className="mt-3 font-semibold">{t("needsAttention")}</p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {t("needsAttentionDescription")}
              </p>
            </button>
          </div>

          <label className="block">
            <span className="text-sm font-semibold">{t("note")}</span>

            <textarea
              rows={5}
              maxLength={2000}
              disabled={loading}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t("notePlaceholder")}
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-4 outline-none focus:border-indigo-500 disabled:opacity-50"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {note.length} / 2000
            </p>
          </label>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            {t("permissionNotice")}
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 disabled:opacity-50"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={submit}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}

            {loading ? t("saving") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
