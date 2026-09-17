"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

import type { AdminSeeker } from "./types";

type Props = {
  lang: string;

  seeker: AdminSeeker;

  isDeleting: boolean;

  error: string | null;

  onClose: () => void;

  onDelete: () => void;
};

export default function DeleteModal({
  seeker,
  isDeleting,
  error,
  onClose,
  onDelete,
}: Props) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-red-500">
              Delete Job Seeker
            </p>

            <h2 className="mt-1 text-xl font-bold">Confirm Deletion</h2>
          </div>

          <button type="button" disabled={isDeleting} onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>

          <p className="mt-4 text-sm text-slate-600">
            Are you sure you want to permanently delete this job seeker?
          </p>

          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="font-semibold">{seeker.name}</p>

            <p className="text-sm text-slate-500">{seeker.email}</p>

            <p className="mt-1 text-xs text-slate-400">{seeker.seeker_id}</p>
          </div>

          {seeker.applications_count > 0 && (
            <p className="mt-4 text-sm font-medium text-amber-700">
              This seeker has {seeker.applications_count} application(s). The
              backend will prevent permanent deletion.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isDeleting ? (
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
