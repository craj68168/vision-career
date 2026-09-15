"use client";

import { useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { AlertTriangle, Loader2 } from "lucide-react";

import { deleteProviderVacancy } from "./api";

import type { ApiErrorResponse, Vacancy } from "./types";

type DeleteVacancyModalProps = {
  open: boolean;

  vacancy: Vacancy | null;

  onClose: () => void;

  onSuccess: () => void | Promise<void>;

  lang: string;
};

export default function DeleteVacancyModal({
  open,
  vacancy,
  onClose,
  onSuccess,
  lang,
}: DeleteVacancyModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!open || !vacancy) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setDeleting(true);

      const response = await deleteProviderVacancy(vacancy.vacancyId);

      toast.success(
        response.message ||
          (lang === "ja"
            ? "求人を削除しました"
            : "Vacancy deleted successfully."),
      );

      await onSuccess();
    } catch (error: unknown) {
      console.error("Delete vacancy error:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message || "Failed to delete vacancy.",
        );

        return;
      }

      toast.error(
        lang === "ja"
          ? "求人の削除に失敗しました"
          : "Failed to delete vacancy.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      {/* BACKDROP */}

      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0"
        onClick={deleting ? undefined : onClose}
      />

      {/* DIALOG */}

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-950">
            {lang === "ja"
              ? "本当に削除しますか？"
              : "Are you absolutely sure?"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {lang === "ja"
              ? `「${vacancy.title}」を完全に削除します。この操作は取り消せません。`
              : `"${vacancy.title}" will be permanently deleted. This action cannot be undone.`}
          </p>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Vacancy ID</p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {vacancy.vacancyId}
            </p>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            disabled={deleting}
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {lang === "ja" ? "キャンセル" : "Cancel"}
          </button>

          <button
            type="button"
            disabled={deleting}
            onClick={() => void handleDelete()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}

            {deleting
              ? lang === "ja"
                ? "削除中..."
                : "Deleting..."
              : lang === "ja"
                ? "削除"
                : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
