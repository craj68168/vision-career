"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

import type { PlacementRequest } from "./types";

type Props = {
  open: boolean;

  request: PlacementRequest | null;

  loading: boolean;

  onClose: () => void;

  onDelete: () => void;
};

export default function DeletePlacementRequestModal({
  open,
  request,
  loading,
  onClose,
  onDelete,
}: Props) {
  if (!open || !request) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>

          <button type="button" disabled={loading} onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="mt-5 text-xl font-bold">Delete Placement Request</h2>

        <p className="mt-2 text-sm text-slate-500">
          Permanently delete this placement request?
        </p>

        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-400">{request.recruitId}</p>

          <p className="mt-1 font-semibold">{request.job_title}</p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border px-4 py-2.5"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
