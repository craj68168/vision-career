"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

import type { AdminProvider } from "./types";

type Props = {
  provider: AdminProvider;

  isDeleting: boolean;

  onClose: () => void;

  onDelete: (registerId: string) => void;
};

export default function DeleteModal({
  provider,
  isDeleting,
  onClose,
  onDelete,
}: Props) {
  const hasHistory = provider.vacancyCount > 0 || provider.applicationCount > 0;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        className="absolute inset-0 cursor-default"
        onClick={() => !isDeleting && onClose()}
      />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>

          <button onClick={onClose} className="cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="mt-4 text-xl font-bold">Delete Provider</h2>

        <p className="mt-2 text-sm text-slate-500">
          Are you sure you want to delete this provider?
        </p>

        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <p className="font-bold">{provider.name}</p>

          <p className="text-sm text-slate-500">{provider.email}</p>
        </div>

        {hasHistory && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            This Provider has recruitment history:
            <br />
            Vacancies: {provider.vacancyCount}
            <br />
            Applications: {provider.applicationCount}
            <br />
            <br />
            It cannot be deleted. Set it to Inactive or Suspended instead.
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={isDeleting || hasHistory}
            onClick={() => onDelete(provider.registerId)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
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
