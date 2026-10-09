"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";

import type { ReviewCandidatePayload, StaffPlacementCandidate } from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  candidate: StaffPlacementCandidate | null;

  isSaving: boolean;

  onClose: () => void;

  onSubmit: (
    placementCandidateId: string,
    payload: ReviewCandidatePayload,
  ) => void;
};

// ======================================================
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const secondaryButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50";

// ======================================================
// OPTION TONES
//
// Full class names are written out so Tailwind can
// detect them.
// ======================================================

const optionTones = {
  REVIEWED: {
    idle: "bg-white ring-1 ring-inset ring-slate-200 hover:ring-emerald-300",
    active:
      "bg-[linear-gradient(180deg,#ecfdf5,#ffffff_75%)] ring-2 ring-inset ring-emerald-500",
    chip: "text-emerald-600 ring-emerald-200",
    focus: "focus-visible:ring-emerald-500",
  },
  NEEDS_ATTENTION: {
    idle: "bg-white ring-1 ring-inset ring-slate-200 hover:ring-rose-300",
    active:
      "bg-[linear-gradient(180deg,#fff1f2,#ffffff_75%)] ring-2 ring-inset ring-rose-500",
    chip: "text-rose-600 ring-rose-200",
    focus: "focus-visible:ring-rose-500",
  },
} as const;

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "C"
  );
}

// ======================================================
// WRAPPER (resets the form whenever the candidate changes)
// ======================================================

export default function ReviewCandidateModal({
  candidate,
  isSaving,
  onClose,
  onSubmit,
}: Props) {
  if (!candidate) {
    return null;
  }

  return (
    <ReviewForm
      key={candidate.placementCandidateId}
      candidate={candidate}
      isSaving={isSaving}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

// ======================================================
// FORM
// ======================================================

function ReviewForm({
  candidate,
  isSaving,
  onClose,
  onSubmit,
}: {
  candidate: StaffPlacementCandidate;

  isSaving: boolean;

  onClose: () => void;

  onSubmit: (
    placementCandidateId: string,
    payload: ReviewCandidatePayload,
  ) => void;
}) {
  const t = useTranslations("staffPlacementCandidates");

  const [status, setStatus] = useState<"REVIEWED" | "NEEDS_ATTENTION">(
    candidate.staffReview.status === "NEEDS_ATTENTION"
      ? "NEEDS_ATTENTION"
      : "REVIEWED",
  );

  const [note, setNote] = useState(candidate.staffReview.note || "");

  const [error, setError] = useState("");

  const isEditing = candidate.staffReview.status !== "NOT_REVIEWED";

  const candidateName = candidate.candidate.name || "-";

  // ====================================================
  // SUBMIT
  // ====================================================

  const submit = () => {
    setError("");

    const normalizedNote = note.trim();

    if (status === "NEEDS_ATTENTION" && !normalizedNote) {
      setError(t("reviewModal.noteRequired"));

      return;
    }

    if (normalizedNote.length > 2000) {
      setError(t("reviewModal.noteTooLong"));

      return;
    }

    onSubmit(candidate.placementCandidateId, {
      reviewStatus: status,

      note: normalizedNote,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={candidateName}
      className="fixed inset-0 z-[160] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      {/* BACKDROP */}

      <button
        type="button"
        className="absolute inset-0 cursor-default"
        disabled={isSaving}
        onClick={onClose}
        aria-label={t("reviewModal.close")}
      />

      {/* MODAL */}

      <div className="relative z-10 flex max-h-[94dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-slate-200 sm:max-h-[92dvh] sm:rounded-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="relative shrink-0 overflow-hidden bg-[linear-gradient(120deg,#eef2ff_0%,#f5f3ff_45%,#ffffff_100%)] px-4 py-4 shadow-[inset_0_-1px_0_0_#e0e7ff] sm:px-6 sm:py-5">
          {/* decorative grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.07)_1px,transparent_1px)] bg-[length:44px_44px] [mask-image:linear-gradient(90deg,#000,transparent)]"
          />

          <div className="relative flex items-start gap-3 sm:gap-4">
            <span
              aria-hidden="true"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-base font-bold text-white shadow-md shadow-indigo-600/30"
            >
              {getInitials(candidateName)}
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                {t("reviewModal.eyebrow")}
              </p>

              <h2 className="mt-0.5 break-words text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
                {candidateName}
              </h2>

              <p className="mt-1 break-all text-xs text-slate-500">
                {candidate.placementCandidateId}
              </p>
            </div>

            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              aria-label={t("reviewModal.close")}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-slate-600 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* SCROLLABLE CONTENT */}
        {/* ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/60">
          <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
            {/* REQUEST */}

            <div className="min-w-0 rounded-xl bg-white p-3.5 ring-1 ring-inset ring-slate-200">
              <p className="break-words text-sm font-semibold text-slate-950">
                {candidate.request?.jobTitle || candidate.recruitId}
              </p>

              <p className="mt-1 break-words text-xs text-slate-500">
                {candidate.provider?.companyName || "-"}
              </p>
            </div>

            {/* EDIT NOTICE */}

            {isEditing && (
              <div className="rounded-xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-700 ring-1 ring-inset ring-indigo-200">
                {t("reviewModal.editNotice")}
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div
                role="alert"
                className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-inset ring-rose-200"
              >
                {error}
              </div>
            )}

            {/* OPTIONS */}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={isSaving}
                aria-pressed={status === "REVIEWED"}
                onClick={() => setStatus("REVIEWED")}
                className={`min-w-0 rounded-xl p-4 text-left transition-shadow focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  optionTones.REVIEWED.focus
                } ${
                  status === "REVIEWED"
                    ? optionTones.REVIEWED.active
                    : optionTones.REVIEWED.idle
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`grid h-9 w-9 place-items-center rounded-lg bg-white ring-1 ring-inset ${optionTones.REVIEWED.chip}`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </span>

                <p className="mt-3 text-sm font-semibold text-slate-950">
                  {t("reviewModal.reviewed")}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {t("reviewModal.reviewedDescription")}
                </p>
              </button>

              <button
                type="button"
                disabled={isSaving}
                aria-pressed={status === "NEEDS_ATTENTION"}
                onClick={() => setStatus("NEEDS_ATTENTION")}
                className={`min-w-0 rounded-xl p-4 text-left transition-shadow focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  optionTones.NEEDS_ATTENTION.focus
                } ${
                  status === "NEEDS_ATTENTION"
                    ? optionTones.NEEDS_ATTENTION.active
                    : optionTones.NEEDS_ATTENTION.idle
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`grid h-9 w-9 place-items-center rounded-lg bg-white ring-1 ring-inset ${optionTones.NEEDS_ATTENTION.chip}`}
                >
                  <AlertTriangle className="h-4 w-4" />
                </span>

                <p className="mt-3 text-sm font-semibold text-slate-950">
                  {t("reviewModal.needsAttention")}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {t("reviewModal.needsAttentionDescription")}
                </p>
              </button>
            </div>

            {/* NOTE */}

            <label className="block rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {t("reviewModal.note")}
              </span>

              <textarea
                rows={5}
                maxLength={2000}
                disabled={isSaving}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={t("reviewModal.notePlaceholder")}
                className="mt-2 w-full resize-none rounded-xl bg-white p-4 text-sm leading-6 text-slate-900 ring-1 ring-inset ring-slate-200 outline-none transition-shadow placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-1 text-right text-xs tabular-nums text-slate-400">
                {note.length} / 2000
              </p>
            </label>

            {/* PIPELINE NOTICE */}

            <div className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-700 ring-1 ring-inset ring-blue-200">
              {t("reviewModal.pipelineNotice")}
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex shrink-0 flex-col-reverse gap-2 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[inset_0_1px_0_0_#e2e8f0] sm:flex-row sm:justify-end sm:px-6 sm:py-4">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className={secondaryButton}
          >
            {t("reviewModal.cancel")}
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={submit}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}

            {isSaving ? t("reviewModal.saving") : t("reviewModal.save")}
          </button>
        </div>
      </div>
    </div>
  );
}