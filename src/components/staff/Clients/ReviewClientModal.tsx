"use client";

import { useState } from "react";

import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";

import type { ReviewProviderPayload, StaffProvider } from "./types";

type Props = {
  provider: StaffProvider | null;

  isSaving: boolean;

  onClose: () => void;

  onSubmit: (registerId: string, payload: ReviewProviderPayload) => void;
};

// ======================================================
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const optionBase =
  "rounded-xl p-4 text-left transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

const optionIdle =
  "bg-white ring-1 ring-inset ring-slate-200 hover:ring-slate-400";

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

export default function ReviewClientModal({
  provider,
  isSaving,
  onClose,
  onSubmit,
}: Props) {
  if (!provider) {
    return null;
  }

  return (
    <ReviewForm
      key={provider.registerId}
      provider={provider}
      isSaving={isSaving}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function ReviewForm({
  provider,
  isSaving,
  onClose,
  onSubmit,
}: {
  provider: StaffProvider;

  isSaving: boolean;

  onClose: () => void;

  onSubmit: (registerId: string, payload: ReviewProviderPayload) => void;
}) {
  const [status, setStatus] = useState<"REVIEWED" | "NEEDS_ATTENTION">(
    provider.staffReview.status === "NEEDS_ATTENTION"
      ? "NEEDS_ATTENTION"
      : "REVIEWED",
  );

  const [note, setNote] = useState(provider.staffReview.note || "");

  const [error, setError] = useState("");

  const submit = () => {
    setError("");

    if (status === "NEEDS_ATTENTION" && !note.trim()) {
      setError("Please explain what requires Admin attention.");

      return;
    }

    onSubmit(provider.registerId, {
      reviewStatus: status,

      note: note.trim(),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Review Client Company"
      className="fixed inset-0 z-[150] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[94dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-slate-200 sm:rounded-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="relative shrink-0 overflow-hidden bg-[linear-gradient(120deg,#eef2ff_0%,#f5f3ff_45%,#ffffff_100%)] px-4 py-4 shadow-[inset_0_-1px_0_0_#e0e7ff] sm:px-6 sm:py-5">
          {/* decorative grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.07)_1px,transparent_1px)] bg-[length:44px_44px] [mask-image:linear-gradient(90deg,#000,transparent)]"
          />

          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                Staff Review
              </p>

              <h2 className="mt-0.5 text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
                Review Client Company
              </h2>

              <p className="mt-1 break-all text-xs text-slate-500">
                {provider.registerId}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-slate-600 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:space-y-5 sm:p-6">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3.5 ring-1 ring-inset ring-slate-200/70">
            <span
              aria-hidden="true"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-sm font-bold text-white shadow-md shadow-indigo-600/30"
            >
              {getInitials(provider.companyName)}
            </span>

            <div className="min-w-0">
              <p className="break-words font-semibold text-slate-950">
                {provider.companyName}
              </p>

              <p className="mt-0.5 break-words text-sm text-slate-500">
                {provider.name}
              </p>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 ring-1 ring-inset ring-rose-200"
            >
              {error}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {/* REVIEWED */}

            <button
              type="button"
              aria-pressed={status === "REVIEWED"}
              onClick={() => setStatus("REVIEWED")}
              className={`${optionBase} ${
                status === "REVIEWED"
                  ? "bg-[linear-gradient(180deg,#ecfdf5,#ffffff_75%)] ring-2 ring-inset ring-emerald-500"
                  : optionIdle
              }`}
            >
              <span
                aria-hidden="true"
                className="grid h-9 w-9 place-items-center rounded-lg bg-white text-emerald-600 ring-1 ring-inset ring-emerald-200"
              >
                <CheckCircle2 className="h-4 w-4" />
              </span>

              <p className="mt-3 font-semibold text-slate-950">Reviewed</p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Company information has been reviewed and no immediate issue was
                identified.
              </p>
            </button>

            {/* ATTENTION */}

            <button
              type="button"
              aria-pressed={status === "NEEDS_ATTENTION"}
              onClick={() => setStatus("NEEDS_ATTENTION")}
              className={`${optionBase} ${
                status === "NEEDS_ATTENTION"
                  ? "bg-[linear-gradient(180deg,#fff1f2,#ffffff_75%)] ring-2 ring-inset ring-rose-500"
                  : optionIdle
              }`}
            >
              <span
                aria-hidden="true"
                className="grid h-9 w-9 place-items-center rounded-lg bg-white text-rose-600 ring-1 ring-inset ring-rose-200"
              >
                <AlertTriangle className="h-4 w-4" />
              </span>

              <p className="mt-3 font-semibold text-slate-950">
                Needs Attention
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Company information or operational details require Admin
                attention.
              </p>
            </button>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-950">
              Review Note
            </span>

            <textarea
              rows={5}
              maxLength={2000}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Enter review notes..."
              className="mt-2 w-full resize-none rounded-xl bg-white p-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 outline-none transition-shadow placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <div className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-700 ring-1 ring-inset ring-blue-200">
            Staff review does not change the Provider account status.
            Activation, suspension and account management remain with Admin.
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex shrink-0 flex-col-reverse gap-2 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[inset_0_1px_0_0_#e2e8f0] sm:flex-row sm:justify-end sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={submit}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}

            {isSaving ? "Saving..." : "Save Review"}
          </button>
        </div>
      </div>
    </div>
  );
}