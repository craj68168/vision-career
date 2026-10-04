"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

import type { AdminSeeker } from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

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
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
          <div className="min-w-0">
            <p className="text-xs font-medium text-red-600 dark:text-red-300">
              Delete Job Seeker
            </p>

            <h2 className="mt-0.5 text-lg font-semibold text-zinc-950 dark:text-white">
              Confirm Deletion
            </h2>
          </div>

          <button
            type="button"
            disabled={isDeleting}
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

        <div className="mt-4 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-red-50 text-red-600 dark:bg-red-400/10 dark:text-red-300">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
            Are you sure you want to permanently delete this job seeker?
          </p>

          <div className="mt-4 rounded-lg bg-zinc-50 p-4 dark:bg-white/5">
            <p className="font-semibold text-zinc-950 dark:text-white">
              {seeker.name}
            </p>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {seeker.email}
            </p>

            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              {seeker.seeker_id}
            </p>
          </div>

          {seeker.applications_count > 0 && (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
              This seeker has {seeker.applications_count} application(s). The
              backend will prevent permanent deletion.
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-white/10">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onDelete}
            className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${focusRing}`}
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
    </div>
  );
}
