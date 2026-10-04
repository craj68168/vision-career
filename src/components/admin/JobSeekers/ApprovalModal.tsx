"use client";

import { CheckCircle2, Loader2, X, XCircle } from "lucide-react";
import { useState } from "react";

import type { AdminSeeker } from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

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
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
          <div className="min-w-0">
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Registration Review
            </p>

            <h2 className="mt-0.5 truncate text-lg font-semibold text-zinc-950 dark:text-white">
              {seeker.name}
            </h2>

            <p className="mt-0.5 truncate text-sm text-zinc-500 dark:text-zinc-400">
              {seeker.email}
            </p>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10 ${focusRing}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
              {error}
            </div>
          )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDecision("approved")}
            className={`rounded-lg border p-4 text-left transition ${focusRing} ${
              decision === "approved"
                ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20 dark:bg-emerald-400/10"
                : "border-zinc-200 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
            }`}
          >
            <CheckCircle2 className="mb-2 h-5 w-5 text-emerald-600" />

            <p className="font-semibold text-zinc-950 dark:text-white">
              Approve
            </p>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Account becomes active.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setDecision("rejected")}
            className={`rounded-lg border p-4 text-left transition ${focusRing} ${
              decision === "rejected"
                ? "border-red-500 bg-red-50 ring-2 ring-red-500/20 dark:bg-red-400/10"
                : "border-zinc-200 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
            }`}
          >
            <XCircle className="mb-2 h-5 w-5 text-red-600" />

            <p className="font-semibold text-zinc-950 dark:text-white">
              Reject
            </p>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Login remains blocked.
            </p>
          </button>
        </div>

        {decision === "rejected" && (
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Rejection Reason *
            </label>

            <textarea
              rows={4}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Explain why this registration was rejected..."
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
            />
          </div>
        )}

        <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-white/10">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSaving || (decision === "rejected" && !reason.trim())}
            onClick={() => void handleSubmit()}
            className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${focusRing} ${
              decision === "approved"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"
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
    </div>
  );
}
