"use client";

import { useState } from "react";

import { AlertTriangle, CheckCircle2, X } from "lucide-react";

import type { ReviewCandidatePayload, StaffPlacementCandidate } from "./types";

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
// COMPONENT
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
  const [status, setStatus] = useState<"REVIEWED" | "NEEDS_ATTENTION">(
    candidate.staffReview.status === "NEEDS_ATTENTION"
      ? "NEEDS_ATTENTION"
      : "REVIEWED",
  );

  const [note, setNote] = useState(candidate.staffReview.note || "");

  const [error, setError] = useState("");

  const submit = () => {
    setError("");

    if (status === "NEEDS_ATTENTION" && !note.trim()) {
      setError("Please explain what requires attention.");

      return;
    }

    onSubmit(
      candidate.placementCandidateId,

      {
        reviewStatus: status,

        note: note.trim(),
      },
    );
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Staff Candidate Review
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {candidate.candidate.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {candidate.placementCandidateId}
            </p>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}

        <div className="space-y-5 p-6">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold">
              {candidate.request?.jobTitle || candidate.recruitId}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {candidate.provider?.companyName || "-"}
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* OPTIONS */}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setStatus("REVIEWED")}
              className={`rounded-2xl border p-4 text-left ${
                status === "REVIEWED"
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-200"
              }`}
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />

              <p className="mt-3 font-semibold">Reviewed</p>

              <p className="mt-1 text-sm text-slate-500">
                Candidate information has been checked and no immediate issue
                requires attention.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setStatus("NEEDS_ATTENTION")}
              className={`rounded-2xl border p-4 text-left ${
                status === "NEEDS_ATTENTION"
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200"
              }`}
            >
              <AlertTriangle className="h-5 w-5 text-red-600" />

              <p className="mt-3 font-semibold">Needs Attention</p>

              <p className="mt-1 text-sm text-slate-500">
                Candidate or placement information requires internal attention.
              </p>
            </button>
          </div>

          {/* NOTE */}

          <label className="block">
            <span className="text-sm font-semibold">Staff Review Note</span>

            <textarea
              rows={5}
              maxLength={2000}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Enter Staff review notes..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-4 outline-none focus:border-indigo-500"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {note.length}/2000
            </p>
          </label>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            {` This Staff review does not change the Provider's candidate pipeline
            status. Interview, selection, placement and rejection remain
            Provider actions.`}
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={submit}
            className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
