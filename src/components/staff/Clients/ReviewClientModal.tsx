"use client";

import { useState } from "react";

import { AlertTriangle, CheckCircle2, X } from "lucide-react";

import type { ReviewProviderPayload, StaffProvider } from "./types";

type Props = {
  provider: StaffProvider | null;

  isSaving: boolean;

  onClose: () => void;

  onSubmit: (registerId: string, payload: ReviewProviderPayload) => void;
};

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
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Staff Review
            </p>

            <h2 className="mt-1 text-2xl font-bold">Review Client Company</h2>

            <p className="mt-1 text-sm text-slate-500">{provider.registerId}</p>
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
            <p className="font-bold">{provider.companyName}</p>

            <p className="mt-1 text-sm text-slate-500">{provider.name}</p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {/* REVIEWED */}

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
                Company information has been reviewed and no immediate issue was
                identified.
              </p>
            </button>

            {/* ATTENTION */}

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
                Company information or operational details require Admin
                attention.
              </p>
            </button>
          </div>

          <label className="block">
            <span className="text-sm font-semibold">Review Note</span>

            <textarea
              rows={5}
              maxLength={2000}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Enter review notes..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-4 outline-none focus:border-indigo-500"
            />
          </label>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            Staff review does not change the Provider account status.
            Activation, suspension and account management remain with Admin.
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5"
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
