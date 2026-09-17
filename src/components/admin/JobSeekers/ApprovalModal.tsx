"use client";

import { CheckCircle2, Loader2, X, XCircle } from "lucide-react";
import { useState } from "react";

import type { AdminSeeker } from "./types";

type Props = {
  lang: string;

  seeker: AdminSeeker;

  isSaving: boolean;

  error: string | null;

  onClose: () => void;

  onSubmit: (
    decision: "approved" | "rejected",
    reason?: string,
  ) => Promise<void>;
};

export default function ApprovalModal({
  seeker,
  isSaving,
  error,
  onClose,
  onSubmit,
}: Props) {
  const [decision, setDecision] = useState<"approved" | "rejected">("approved");

  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    await onSubmit(decision, decision === "rejected" ? reason : undefined);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Registration Review
            </p>

            <h2 className="mt-1 text-xl font-bold">{seeker.name}</h2>

            <p className="mt-1 text-sm text-slate-500">{seeker.email}</p>
          </div>

          <button type="button" disabled={isSaving} onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDecision("approved")}
            className={`rounded-2xl border p-4 text-left ${
              decision === "approved"
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200"
            }`}
          >
            <CheckCircle2 className="mb-2 h-5 w-5 text-emerald-600" />

            <p className="font-semibold">Approve</p>

            <p className="mt-1 text-xs text-slate-500">
              Account becomes active.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setDecision("rejected")}
            className={`rounded-2xl border p-4 text-left ${
              decision === "rejected"
                ? "border-red-500 bg-red-50"
                : "border-slate-200"
            }`}
          >
            <XCircle className="mb-2 h-5 w-5 text-red-600" />

            <p className="font-semibold">Reject</p>

            <p className="mt-1 text-xs text-slate-500">
              Login remains blocked.
            </p>
          </button>
        </div>

        {decision === "rejected" && (
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium">
              Rejection Reason *
            </label>

            <textarea
              rows={4}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Explain why this registration was rejected..."
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSaving || (decision === "rejected" && !reason.trim())}
            onClick={() => void handleSubmit()}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${
              decision === "approved" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}

            {decision === "approved"
              ? "Approve Job Seeker"
              : "Reject Job Seeker"}
          </button>
        </div>
      </div>
    </div>
  );
}
