"use client";

import { useState } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";

import type {
  ScreenPlacementRequestPayload,
  StaffPlacementRequest,
} from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  request: StaffPlacementRequest | null;

  isSaving: boolean;

  onClose: () => void;

  onSubmit: (recruitId: string, payload: ScreenPlacementRequestPayload) => void;
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
  SCREENED: {
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

// ======================================================
// WRAPPER (resets the form whenever the request changes)
// ======================================================

export default function ScreenPlacementRequestModal({
  request,
  isSaving,
  onClose,
  onSubmit,
}: Props) {
  if (!request) {
    return null;
  }

  return (
    <ScreenForm
      key={request.recruitId}
      request={request}
      isSaving={isSaving}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

// ======================================================
// FORM
// ======================================================

function ScreenForm({
  request,
  isSaving,
  onClose,
  onSubmit,
}: {
  request: StaffPlacementRequest;

  isSaving: boolean;

  onClose: () => void;

  onSubmit: (recruitId: string, payload: ScreenPlacementRequestPayload) => void;
}) {
  const [status, setStatus] = useState<"SCREENED" | "NEEDS_ATTENTION">(
    request.staffScreening.status === "NEEDS_ATTENTION"
      ? "NEEDS_ATTENTION"
      : "SCREENED",
  );

  const [note, setNote] = useState(request.staffScreening.note || "");

  const [error, setError] = useState("");

  const submit = () => {
    setError("");

    if (status === "NEEDS_ATTENTION" && !note.trim()) {
      setError("Please explain what requires Admin attention.");

      return;
    }

    onSubmit(request.recruitId, {
      screeningStatus: status,

      note: note.trim(),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Screen Placement Request"
      className="fixed inset-0 z-[150] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      {/* BACKDROP */}

      <button
        type="button"
        className="absolute inset-0 cursor-default"
        disabled={isSaving}
        onClick={onClose}
        aria-label="Close"
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
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-white shadow-md shadow-indigo-600/30"
            >
              <ShieldCheck className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                Staff Screening
              </p>

              <h2 className="mt-0.5 break-words text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
                Screen Placement Request
              </h2>

              <p className="mt-1 break-all text-xs text-slate-500">
                {request.recruitId}
              </p>
            </div>

            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              aria-label="Close"
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
                {request.jobTitle}
              </p>

              <p className="mt-1 break-words text-xs text-slate-500">
                {request.companyName}
                {" • "}
                {request.workLocation}
              </p>
            </div>

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
              {/* SCREENED */}

              <button
                type="button"
                disabled={isSaving}
                aria-pressed={status === "SCREENED"}
                onClick={() => setStatus("SCREENED")}
                className={`min-w-0 rounded-xl p-4 text-left transition-shadow focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  optionTones.SCREENED.focus
                } ${
                  status === "SCREENED"
                    ? optionTones.SCREENED.active
                    : optionTones.SCREENED.idle
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`grid h-9 w-9 place-items-center rounded-lg bg-white ring-1 ring-inset ${optionTones.SCREENED.chip}`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </span>

                <p className="mt-3 text-sm font-semibold text-slate-950">
                  Screened
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Placement request information has been checked and is ready
                  for a final decision.
                </p>
              </button>

              {/* NEEDS ATTENTION */}

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
                  Needs Attention
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Something should be verified before a final decision is made.
                </p>
              </button>
            </div>

            {/* NOTE */}

            <label className="block rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Screening Note
              </span>

              <textarea
                rows={5}
                maxLength={2000}
                disabled={isSaving}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Enter screening notes..."
                className="mt-2 w-full resize-none rounded-xl bg-white p-4 text-sm leading-6 text-slate-900 ring-1 ring-inset ring-slate-200 outline-none transition-shadow placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-1 text-right text-xs tabular-nums text-slate-400">
                {note.length} / 2000
              </p>
            </label>

            {/* PERMISSION NOTICE */}

            <div className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-700 ring-1 ring-inset ring-blue-200">
              Staff screening does not approve or reject the placement request.
              Screening and approval or rejection are separate permissions.
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
            Cancel
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={submit}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}

            {isSaving ? "Saving..." : "Save Screening"}
          </button>
        </div>
      </div>
    </div>
  );
}