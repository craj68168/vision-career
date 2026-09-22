"use client";

import { useState } from "react";

import { AlertTriangle, CheckCircle2, X } from "lucide-react";

import type {
  ScreenPlacementRequestPayload,
  StaffPlacementRequest,
} from "./types";

type Props = {
  request: StaffPlacementRequest | null;

  isSaving: boolean;

  onClose: () => void;

  onSubmit: (recruitId: string, payload: ScreenPlacementRequestPayload) => void;
};

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
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Staff Screening
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Screen Placement Request
            </h2>

            <p className="mt-1 text-sm text-slate-500">{request.recruitId}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}

        <div className="space-y-5 p-6">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-bold">{request.jobTitle}</p>

            <p className="mt-1 text-sm text-slate-500">
              {request.companyName}
              {" • "}
              {request.workLocation}
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {/* SCREENED */}

            <button
              type="button"
              onClick={() => setStatus("SCREENED")}
              className={`rounded-2xl border p-4 text-left ${
                status === "SCREENED"
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-200"
              }`}
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />

              <p className="mt-3 font-semibold">Screened</p>

              <p className="mt-1 text-sm text-slate-500">
                Placement request information has been checked and is ready for
                Admin review.
              </p>
            </button>

            {/* NEEDS ATTENTION */}

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
                Something should be verified before Admin makes the final
                decision.
              </p>
            </button>
          </div>

          <label className="block">
            <span className="text-sm font-semibold">Screening Note</span>

            <textarea
              rows={5}
              maxLength={2000}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Enter screening notes..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-4 outline-none focus:border-indigo-500"
            />
          </label>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            Staff screening does not approve or reject the placement request.
            Final approval remains with Admin.
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
            {isSaving ? "Saving..." : "Save Screening"}
          </button>
        </div>
      </div>
    </div>
  );
}
